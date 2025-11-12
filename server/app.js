import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { PagBankWebhookService } from './payments/pagbankWebhook.js';
import { safeLog, safeErrorLog } from './utils/logger.js';

dotenv.config();

console.log("🚀 APP.JS INICIADO - Servidor app.js está rodando!");
console.log("🔑 Token carregado:", process.env.MERCADO_PAGO_ACCESS_TOKEN?.slice(0, 10) + "...");

// Normalize and validate public URL (ngrok) for callbacks
const rawPublicUrl = process.env.VITE_PUBLIC_URL_NGROK || process.env.PUBLIC_URL_NGROK || process.env.PUBLIC_URL || process.env.VITE_PUBLIC_URL;
let BACK_URL_BASE = null;
if (rawPublicUrl) {
  try {
    const u = new URL(String(rawPublicUrl).trim());
    BACK_URL_BASE = u.origin + u.pathname.replace(/\/$/, '');
  } catch (e) {
    BACK_URL_BASE = null;
  }
}

const app = express();

// CORS com configuração para produção
const allowedOrigins = [
  'http://localhost:5173',
  /\.ngrok-free\.app$/,
];

// Adicionar domínio de produção se configurado
if (process.env.PRODUCTION_DOMAIN) {
  allowedOrigins.push(process.env.PRODUCTION_DOMAIN);
  allowedOrigins.push(new RegExp(`^https?://${process.env.PRODUCTION_DOMAIN.replace(/^https?:\/\//, '')}$`));
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Rota de webhook PagBank - DEVE vir ANTES do express.json()
// O PagBank requer acesso ao raw body para verificação de assinatura
app.post('/api/pagbank/webhook', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    safeLog("📨 Webhook PagBank recebido", {
      headers: {
        'content-type': req.headers['content-type'],
        'x-pagbank-signature': req.headers['x-pagbank-signature'] ? 'presente' : 'ausente',
      },
    });

    // Obter raw body e signature
    const rawBody = req.body.toString('utf8');
    const signature = req.headers['x-pagbank-signature'];

    // Parse do payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseError) {
      safeErrorLog("❌ Erro ao parsear payload do webhook", {
        error: parseError.message,
      });
      return res.status(400).json({
        success: false,
        error: "Invalid JSON payload",
      });
    }

    // Processar webhook
    const result = await PagBankWebhookService.handleWebhook(
      signature,
      rawBody,
      payload
    );

    if (!result.success) {
      // Assinatura inválida - retornar 401
      safeErrorLog("⚠️  Webhook com assinatura inválida", {
        webhook_id: result.webhook_id,
      });
      return res.status(401).json({
        success: false,
        error: result.error,
        webhook_id: result.webhook_id,
      });
    }

    // Sucesso - retornar 200
    safeLog("✅ Webhook processado com sucesso", {
      webhook_id: result.webhook_id,
      event_type: result.event_type,
    });

    return res.status(200).json({
      success: true,
      webhook_id: result.webhook_id,
      event_type: result.event_type,
    });
  } catch (error) {
    safeErrorLog("❌ Erro ao processar webhook PagBank", {
      error: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Middleware JSON para outras rotas
app.use(express.json());

const MP_USE_SANDBOX = (String(process.env.MP_USE_SANDBOX || '').toLowerCase() === 'true')
  || (process.env.MERCADO_PAGO_ACCESS_TOKEN || '').toUpperCase().startsWith('TEST');
const MP_API_BASE = "https://api.mercadopago.com";

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Health-check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Keep the create-subscription endpoint minimal (same logic as index.js)
 app.post('/api/create-subscription', async (req, res) => {
   try {
     if (!BACK_URL_BASE) {
       return res.status(400).json({ error: true, message: 'PUBLIC URL (ngrok) not configured' });
     }

     const body = req.body || {};
     let amount, frequency, frequency_type, payer_email, payload, registrationId = null;

     if (body.plan_id) {
       // Criar cadastro de negócio primeiro
       const { plan_id, establishment_name, category, address, location, photos, whatsapp, phone, description } = body;

       // Buscar plano
       const { data: plan, error: planError } = await supabase
         .from('business_plans')
         .select('*')
         .eq('id', plan_id)
         .single();

       if (planError || !plan) {
         return res.status(400).json({ error: true, message: 'Plano inválido' });
       }

       // Inserir cadastro
       const { data: regData, error: regError } = await supabase
         .from('business_registration')
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
       payer_email = body.payer_email || 'test_user_3786201454678535828@testuser.com';

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
         back_url: `${BACK_URL_BASE}/return/subscription/success`,
         notification_url: `${BACK_URL_BASE}/api/webhook`,
       };
     } else {
       // Lógica original sem cadastro
       amount = Number(body.amount) || 10.0;
       frequency = Number(body.frequency) || 1;
       frequency_type = body.frequency_type || 'months';
       payer_email = body.payer_email || 'test_user_3786201454678535828@testuser.com';

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
         back_url: `${BACK_URL_BASE}/return/subscription/success`,
         notification_url: `${BACK_URL_BASE}/api/webhook`,
         payer_email: payer_email,
       };
     }

     if (typeof fetch === "undefined") {
       const mod = await import("node-fetch");
       global.fetch = mod.default;
     }

     const MP_API_BASE = "https://api.mercadopago.com";

     console.log("🔍 MP DEBUG:", {
       tokenPrefix: process.env.MERCADO_PAGO_ACCESS_TOKEN?.slice(0, 6),
       tokenLength: process.env.MERCADO_PAGO_ACCESS_TOKEN?.length,
     });

     console.log("🔍 MP DEBUG:", {
       tokenPrefix: process.env.MERCADO_PAGO_ACCESS_TOKEN?.slice(0, 5),
       url: `${MP_API_BASE}/preapproval`,
     });

     const r = await fetch(`${MP_API_BASE}/preapproval`, {
       method: "POST",
       headers: {
         Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
         "Content-Type": "application/json",
       },
       body: JSON.stringify(payload),
     });

     const data = await r.json().catch(() => null);
     if (!r.ok) return res.status(r.status).json({ error: true, details: data });

     const mpSubscriptionId = data.id || null;
     const mpInitPoint = data.init_point || data.sandbox_init_point || null;
     const mpStatus = data.status || null;

     try {
       await supabase.from('mp_subscriptions').insert([{ mp_subscription_id: mpSubscriptionId, mp_init_point: mpInitPoint, status: mpStatus, raw_response: data }]);
     } catch (dbErr) {
       console.warn('failed to persist mp_subscriptions:', dbErr?.message || dbErr);
     }

     return res.status(201).json({ ok: true, init_point: mpInitPoint, mp_subscription_id: mpSubscriptionId, status: mpStatus, registration_id: registrationId });
   } catch (err) {
     return res.status(500).json({ error: true, message: err?.message || String(err) });
   }
 });

export default app;
