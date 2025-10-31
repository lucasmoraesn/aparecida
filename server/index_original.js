console.log("🟢 Starting index.js...");
console.log("🔍 Current working directory:", process.cwd());

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
console.log("[MP_ACCESS_TOKEN]", process.env.MP_ACCESS_TOKEN);
console.log("[SUPABASE_URL]", process.env.SUPABASE_URL);

import express from "express";
import cors from "cors";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", /\.ngrok-free\.app$/],
  })
);

// --- SDK v2 Mercado Pago ---
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc'
  }
});

// Verificar se é token de teste e configurar ambiente sandbox
// Suporta tanto formato antigo (TEST-) quanto novo (APP_USR)
const isTestToken = process.env.MP_ACCESS_TOKEN?.startsWith('TEST-') || process.env.MP_ACCESS_TOKEN?.startsWith('APP_USR');
console.log('🔧 Mercado Pago Environment:', isTestToken ? 'SANDBOX (teste)' : 'PRODUCTION');
console.log('🔑 Token type:', process.env.MP_ACCESS_TOKEN?.substring(0, 20) + '...');

const preApproval = new PreApproval(mpClient);

// --- Supabase (usando service_role no backend) ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Health-check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Endpoint para buscar planos disponíveis
app.get("/api/plans", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("business_plans")
      .select("id, name, price, description, features")
      .order("price", { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Erro ao buscar planos:", err);
    res.status(500).json({ message: "Erro ao buscar planos" });
  }
});

// ✅ Página de retorno do Mercado Pago
app.get("/return/subscription/success", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head><meta charset="UTF-8"><title>Pagamento Concluído</title></head>
      <body style="font-family: sans-serif; text-align:center; margin-top: 50px;">
        <h1>✅ Pagamento concluído com sucesso!</h1>
        <p>Obrigado por assinar o plano.</p>
      </body>
    </html>
  `);
});


/* =============================
   CADASTRAR NEGÓCIO + CRIAR ASSINATURA
============================= */

// Endpoint correto: /api/create-subscription
app.post('/api/create-subscription', async (req, res) => {
  try {
    console.log('📥 Body recebido:', req.body);
    
    const { payer_email, plan_id, establishment_name, category, address, location, photos, whatsapp, phone, description } = req.body;

    if (!payer_email || !plan_id) {
      return res.status(400).json({ error: "payer_email e plan_id são obrigatórios" });
    }

    // Buscar plano no Supabase usando o UUID diretamente
    const { data: plan, error } = await supabase
      .from("business_plans")
      .select("*")
      .eq("id", plan_id)
      .single();

    if (error || !plan) {
      console.log("❌ Plano não encontrado:", error);
      return res.status(400).json({ error: "Plano não encontrado" });
    }

    console.log("📊 Plano encontrado:", plan);

    // Criar cadastro de negócio se os dados foram fornecidos
    let registrationId = null;
    if (establishment_name) {
      const { data: regData, error: regError } = await supabase
        .from('business_registrations')
        .insert([{
          establishment_name,
          category,
          address,
          location: location || '',
          photos: photos || [],
          whatsapp,
          phone,
          description,
          plan_id,
          status: 'pending',
          payment_status: 'pending'
        }])
        .select('id')
        .single();

      if (regError) {
        console.log("❌ Erro ao criar cadastro:", regError);
        return res.status(500).json({ error: "Erro ao criar cadastro: " + regError.message });
      }

      registrationId = regData.id;
    }

    // Configurar ngrok URL se disponível
    const rawPublicUrl = process.env.PUBLIC_URL_NGROK;
    let BACK_URL_BASE = null;
    if (rawPublicUrl && !rawPublicUrl.includes('seu-tunel.ngrok-free.app')) {
      try {
        const u = new URL(String(rawPublicUrl).trim());
        BACK_URL_BASE = u.origin;
      } catch (e) {
        console.log("⚠️  URL inválida:", rawPublicUrl);
      }
    }

    // Criar payload para Mercado Pago
    const payload = {
      reason: plan.name || 'Plano de Assinatura',
      external_reference: registrationId ? `reg_${registrationId}` : `sub_${Date.now()}`,
      payer_email: payer_email,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months", 
        transaction_amount: plan.price,
        currency_id: "BRL",
        start_date: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      }
    };

    // Adicionar URLs de callback se disponível
    if (BACK_URL_BASE) {
      payload.back_url = `${BACK_URL_BASE}/return/subscription/success`;
      payload.notification_url = `${BACK_URL_BASE}/api/webhook`;
    }

    console.log("📤 Payload para Mercado Pago:", JSON.stringify(payload, null, 2));

    // Criar assinatura no Mercado Pago
    const preApprovalData = await preApproval.create({ body: payload });
    console.log('✅ Resposta do MP:', preApprovalData);
    
    const mpSubscriptionId = preApprovalData.id;
    const mpInitPoint = preApprovalData.init_point || preApprovalData.sandbox_init_point;
    const mpStatus = preApprovalData.status;

    // Salvar no Supabase
    try {
      await supabase.from('mp_subscription').insert([{ 
        mp_subscription_id: mpSubscriptionId, 
        mp_init_point: mpInitPoint, 
        status: mpStatus, 
        raw_response: preApprovalData 
      }]);
    } catch (dbErr) {
      console.warn('Erro ao salvar mp_subscription:', dbErr?.message);
    }

    return res.json({ 
      ok: true,
      init_point: mpInitPoint, 
      mp_subscription_id: mpSubscriptionId, 
      status: mpStatus, 
      registration_id: registrationId 
    });
  } catch (err) {
    console.error('❌ Erro ao criar assinatura:', err);
    return res.status(500).json({ error: err.message });
  }
});

      // Inserir cadastro
      const { data: regData, error: regError } = await supabase
        .from('business_registrations')
        .insert([{
          establishment_name,
          category,
          address,
          location: location || '',
          photos: photos || [],
          whatsapp,
          phone,
          description,
          plan_id,
          status: 'pending',
          payment_status: 'pending'
        }])
        .select('id')
        .single();

      if (regError) {
        return res.status(500).json({ error: true, message: 'Erro ao criar cadastro: ' + regError.message });
      }

      registrationId = regData.id;
      amount = plan.price;
      frequency = 1;
      frequency_type = 'months';
      payer_email = body.payer_email || 'testuser7399@testuser.com'; // Email do comprador brasileiro real

      payload = {
        reason: plan.name || 'Plano de Assinatura',
        external_reference: `reg_${registrationId}`,
        payer_email: payer_email,
        auto_recurring: {
          frequency: frequency,
          frequency_type: frequency_type,
          transaction_amount: amount,
          currency_id: 'BRL',
          start_date: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        },
      };

      // Adicionar URLs apenas se BACK_URL_BASE existir (produção)
      if (BACK_URL_BASE) {
        payload.back_url = `${BACK_URL_BASE}/return/subscription/success`;
        payload.notification_url = `${BACK_URL_BASE}/api/webhook`;
      }
    } else {
      // Lógica original sem cadastro
      amount = Number(body.amount) || 10.0;
      frequency = Number(body.frequency) || 1;
      frequency_type = body.frequency_type || 'months';
      payer_email = body.payer_email || 'testuser7399@testuser.com'; // Email do comprador brasileiro real

      payload = {
        reason: body.planTitle || 'Plano de Assinatura',
        external_reference: body.external_reference || ('sub_' + Date.now()),
        auto_recurring: {
          frequency: frequency,
          frequency_type: frequency_type,
          transaction_amount: amount,
          currency_id: 'BRL',
          start_date: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        },
        payer_email: payer_email,
      };

      // Adicionar URLs apenas se BACK_URL_BASE existir (produção)
      if (BACK_URL_BASE) {
        payload.back_url = `${BACK_URL_BASE}/return/subscription/success`;
        payload.notification_url = `${BACK_URL_BASE}/api/webhook`;
      }
    }

    // Validação final dos campos obrigatórios
    console.log('🔍 Validando campos obrigatórios:');
    console.log('  - amount:', amount, '(tipo:', typeof amount, ')');
    console.log('  - payer_email:', payer_email);
    console.log('  - frequency:', frequency);
    console.log('  - frequency_type:', frequency_type);

    if (!amount || !payer_email) {
      console.error('❌ Campos obrigatórios faltando:', { amount, payer_email });
      return res.status(400).json({ error: 'Campos obrigatórios faltando: amount e payer_email' });
    }

    // Log do payload que será enviado para o MP
    console.log('📤 Payload para Mercado Pago:');
    console.log(JSON.stringify(payload, null, 2));

    // Log para confirmar token antes de criar assinatura
    console.log("🔑 Access token em uso:", process.env.MP_ACCESS_TOKEN?.slice(0, 15) + "...");

    // Usar preApproval do SDK v2
    console.log('🚀 Criando assinatura no Mercado Pago...');
    const preApprovalData = await preApproval.create({ body: payload });
    console.log('✅ Resposta do MP:', JSON.stringify(preApprovalData, null, 2));
    
    const mpSubscriptionId = preApprovalData.id || null;
    // Priorizar sandbox_init_point para tokens de teste (suporta TEST- e APP_USR)
    const isTestToken = process.env.MP_ACCESS_TOKEN?.startsWith('TEST-') || process.env.MP_ACCESS_TOKEN?.startsWith('APP_USR');
    const mpInitPoint = isTestToken 
      ? (preApprovalData.sandbox_init_point || preApprovalData.init_point)
      : (preApprovalData.init_point || preApprovalData.sandbox_init_point);
    const mpStatus = preApprovalData.status || null;

    console.log('🔗 Init Point gerado:', mpInitPoint);
    console.log('📋 Dados completos MP:', { 
      id: mpSubscriptionId, 
      status: mpStatus,
      init_point: preApprovalData.init_point,
      sandbox_init_point: preApprovalData.sandbox_init_point 
    });

    // Salvar no Supabase
    try {
      await supabase.from('mp_subscription').insert([{ 
        mp_subscription_id: mpSubscriptionId, 
        mp_init_point: mpInitPoint, 
        status: mpStatus, 
        raw_response: preApprovalData 
      }]);
    } catch (dbErr) {
      console.warn('Failed to persist mp_subscriptions:', dbErr?.message || dbErr);
    }

    return res.status(201).json({ 
      ok: true, 
      init_point: mpInitPoint, 
      mp_subscription_id: mpSubscriptionId, 
      status: mpStatus, 
      registration_id: registrationId 
    });
  } catch (err) {
    console.error('❌ Erro Mercado Pago:', JSON.stringify(err, null, 2));
    console.error('🔍 Detalhes do erro:');
    console.error('  - Message:', err?.message);
    console.error('  - Status:', err?.status);
    console.error('  - Cause:', err?.cause);
    console.error('  - API Response:', err?.apiResponse);
    
    // Se é erro 400 do Mercado Pago, retornar 400, senão 500
    const statusCode = err?.status === 400 ? 400 : 500;
    return res.status(statusCode).json({ 
      error: err?.message || String(err),
      status: err?.status,
      cause: err?.cause,
      api_response: err?.apiResponse
    });
  }
});

// Endpoint antigo (deprecado)
app.post("/api/register-business", async (req, res) => {
  try {
    // Recebe dados do front
    const registration = req.body;
    console.log("📥 Dados recebidos do front:", registration);

    const {
      establishment_name,
      category,
      address,
      location,
      photos,
      whatsapp,
      phone,
      description,
      plan_id,
      payer_email,
      amount,
      frequency,
      frequency_type,
    } = registration;

    // 1. Salvar cadastro de negócio no Supabase
    const { data, error } = await supabase
      .from("business_registrations")
      .insert([
        {
          establishment_name,
          category,
          address,
          location,
          photos,
          whatsapp,
          phone,
          description,
          plan_id,
          created_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (error) throw error;
    console.log("✅ Cadastro inserido no Supabase:", data);

    // 2. Criar assinatura no Mercado Pago via SDK
    const startDate = new Date(Date.now() + 10 * 60 * 1000);
    startDate.setSeconds(0, 0);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setSeconds(0, 0);

   const payload = {
  reason: "Plano de Assinatura",
  external_reference: "sub_" + Date.now(),
  auto_recurring: {
    frequency: frequency || 1,
    frequency_type: frequency_type || "months",
    transaction_amount: amount || 49.9,
    currency_id: "BRL",
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
  },
  back_url: `${process.env.PUBLIC_URL_NGROK}/return/subscription/success`,
  notification_url: `${process.env.PUBLIC_URL_NGROK}/api/webhook`,
  payer_email: registration.payer_email || "comprador_teste@teste.com",
};

console.log("📦 Payload enviado ao Mercado Pago (SDK):", JSON.stringify(payload, null, 2));

    const subscription = await preApproval.create({ body: payload });

    console.log("✅ Assinatura criada no MP:", subscription.id);

    // 3. Retorna para o front: id do cadastro + link do pagamento
    res.json({
      success: true,
      business: data,
      subscription,
    });
  } catch (err) {
    console.error("❌ Erro no fluxo completo:", err.message, err.response?.data || "");
    res.status(500).json({
      error: true,
      message: err.message,
      details: err.response?.data || null,
    });
  }
});

/* =============================
   CRIAR PREFERÊNCIA (Checkout Pro)
============================= */
app.post('/api/create-preference', async (req, res) => {
  try {
    const pref = {
      items: [
        {
          title: req.body.description || "Plano de Assinatura",
          unit_price: Number(req.body.amount),
          quantity: 1,
        },
      ],
      payer: { email: req.body.payer_email },
      external_reference: req.body.external_reference,
      back_urls: {
        success: `${process.env.PUBLIC_URL_NGROK}/payment/success`,
        failure: `${process.env.PUBLIC_URL_NGROK}/payment/failure`,
        pending: `${process.env.PUBLIC_URL_NGROK}/payment/pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.PUBLIC_URL_NGROK}/api/payment-webhook`,
    };

    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(pref),
    });

    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ message: data?.message || 'Erro ao criar preferência' });
    }
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message || 'Erro interno' });
  }
});

/* =============================
   START SERVER
============================= */
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`🚀 Server on http://localhost:${port}`));
