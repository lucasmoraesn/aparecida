import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
console.log("[MERCADO_PAGO_ACCESS_TOKEN]", process.env.MERCADO_PAGO_ACCESS_TOKEN);

console.log("[MERCADO_PAGO_ACCESS_TOKEN length]", process.env.MERCADO_PAGO_ACCESS_TOKEN?.length);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", /\.ngrok-free\.app$/],
  })
);

// --- SDK v2 Mercado Pago ---
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});
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

/* =============================
   CADASTRAR NEGÓCIO + CRIAR ASSINATURA
============================= */
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
      back_url: `${process.env.VITE_PUBLIC_URL_NGROK}/return/subscription/success`,
      notification_url: `${process.env.VITE_PUBLIC_URL_NGROK}/api/webhook`,
      payer_email: registration.payer_email || "comprador_teste@teste.com",
    };

    console.log("📦 Payload enviado ao MP (SDK):", JSON.stringify(payload, null, 2));

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
   CADASTRAR NEGÓCIO + CRIAR ASSINATURA
============================= */
app.post("/api/register-business", async (req, res) => {
  // ... (seu código atual)
});

/* =============================
   CRIAR PREFERÊNCIA (Checkout Pro)
============================= */
app.post('/api/create-preference', async (req, res) => {
  try {
    const pref = {
      items: [
        {
          title: req.body.description,
          unit_price: req.body.amount,
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
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
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
   WEBHOOK DE PAGAMENTO (Checkout Pro)
============================= */
app.post('/api/payment-webhook', async (req, res) => {
  try {
    console.log('📩 Webhook recebido do Mercado Pago:', req.body);

    const { type, data } = req.body;

    // Webhook do MP envia notification type "payment"
    if (type === 'payment' && data?.id) {
      const paymentId = data.id;
      
      // Consultar detalhes do pagamento na API do MP
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('❌ Erro ao consultar pagamento:', response.statusText);
        return res.status(200).json({ received: true }); // Retorna 200 para não reenviar
      }

      const payment = await response.json();
      console.log('💳 Detalhes do pagamento:', payment);

      const externalReference = payment.external_reference;
      const status = payment.status;

      if (externalReference) {
        // Atualizar status no Supabase
        const { error: updateError } = await supabase
          .from('business_registrations')
          .update({ 
            payment_status: status,
            updated_at: new Date().toISOString()
          })
          .eq('id', externalReference);

        if (updateError) {
          console.error('❌ Erro ao atualizar status no Supabase:', updateError);
        } else {
          console.log(`✅ Status do pedido ${externalReference} atualizado para: ${status}`);
        }
      }
    }

    // Sempre retornar 200 para o MP não reenviar
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.status(200).json({ received: true }); // Retorna 200 mesmo com erro
  }
});

/* =============================
   START SERVER
============================= */
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`🚀 Server on http://localhost:${port}`));
