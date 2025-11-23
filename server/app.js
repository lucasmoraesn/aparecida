import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { PagBankWebhookService } from './payments/pagbankWebhook.js';
import { safeLog, safeErrorLog } from './utils/logger.js';

dotenv.config();

console.log('🔍 DEBUG app.js:');
console.log('  PUBLIC_URL_NGROK:', process.env.PUBLIC_URL_NGROK);
console.log('  SUPABASE_URL:', process.env.SUPABASE_URL);

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

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
console.log('✅ Supabase client created');

// Health-check
app.get('/health', (_req, res) => res.json({ ok: true }));

/* =============================
   TODO: Este arquivo (app.js) parece ser um servidor alternativo
   que não está sendo usado atualmente. O servidor principal é index.js.
   
   Se este arquivo não for necessário, considere removê-lo.
   Se for usado, adicione aqui as rotas necessárias sem Mercado Pago.
============================= */

export default app;
