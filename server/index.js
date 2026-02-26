import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import logger, { requestLoggerMiddleware } from "./services/logger.js";
import { sendNewSubscriptionNotification, sendSubscriptionConfirmationToCustomer } from "./services/emailService.js";
import stripeWebhookRouter from './routes/stripeWebhook.js';
import { scannerBlockerMiddleware } from "./middleware/scannerBlocker.js";
import healthRouter from './routes/health.js';

// ─── Carrega SEMPRE o .env do próprio diretório do servidor ───────────────────
// Usa caminho absoluto para não depender do cwd do PM2
const __envDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__envDir, '.env') });
// ─────────────────────────────────────────────────────────────────────────────

logger.info('ENV carregado', {
  path: join(__envDir, '.env'),
  SUPABASE_URL: process.env.SUPABASE_URL ? '✅' : '❌ AUSENTE',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? '✅' : '❌ AUSENTE',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? '✅' : '❌ AUSENTE',
  AWS_REGION: process.env.AWS_REGION ? '✅' : '❌ AUSENTE',
  EMAIL_FROM: process.env.EMAIL_FROM ? '✅' : '❌ AUSENTE (e-mails falharão!)'
});

// --- Inicializar Supabase (precisa estar disponível no webhook) ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
logger.info('✅ Supabase client created');

// --- Inicializar Stripe (precisa estar disponível no webhook) ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: "2024-06-20"
});
logger.info('✅ Stripe client created');

const app = express();

// ─────────────────────────────────────────────────────────────────────────────
// 🛡️ SECURITY HARDENING (Fase 1)
// ─────────────────────────────────────────────────────────────────────────────

// Helmet: Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Desabilitar para não quebrar assets estáticos
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Permitir CORS para recursos
}));
logger.info('✅ Helmet security headers ativado');

// Remover header "X-Powered-By"
app.disable('x-powered-by');

// Trust proxy (atrás de nginx/load balancer com HTTPS)
app.set('trust proxy', 1);
logger.info('✅ Trust proxy configurado (HTTPS/nginx aware)');

// ─────────────────────────────────────────────────────────────────────────────
// 🛡️ Scanner Blocker (bloqueia paths óbvios de scanner)
// ─────────────────────────────────────────────────────────────────────────────
app.use(scannerBlockerMiddleware);
logger.info('✅ Scanner blocker ativado (/.env, /.git, /vendor, *.php, etc)');

// ─────────────────────────────────────────────────────────────────────────────
// Stripe Webhook dedicado (raw body + assinatura)
// Precisa vir ANTES de express.json()
// ─────────────────────────────────────────────────────────────────────────────
app.use(stripeWebhookRouter);

/* =============================
   WEBHOOK STRIPE
   
   ⚠️ IMPORTANTE: Esta rota DEVE vir ANTES do express.json()
   O Stripe precisa do body raw para validar a assinatura
   
   Eventos tratados:
   - checkout.session.completed: Checkout finalizado com sucesso
   - customer.subscription.deleted: Assinatura cancelada
   - invoice.payment_succeeded: Pagamento recorrente bem-sucedido
   - invoice.payment_failed: Falha no pagamento recorrente
============================= */
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('\n🔔 WEBHOOK RECEBIDO!');
  console.log('   Timestamp:', new Date().toISOString());
  console.log('   Body is Buffer:', Buffer.isBuffer(req.body));
  console.log('   Body length:', req.body?.length);

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET não configurado');
      return res.status(500).json({ error: 'Webhook secret não configurado' });
    }

    // Log dos primeiros chars para confirmar qual secret está em uso
    console.log('🔐 Secret em uso:', webhookSecret.substring(0, 14) + '...');
    console.log('   Assinatura recebida:', sig?.substring(0, 30) + '...');

    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log('✅ Webhook verificado:', event.type);

  } catch (err) {
    console.error('❌ Falha na verificação do webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Responder imediatamente para o Stripe
  res.status(200).json({ received: true });

  // 3. Processar evento de forma assíncrona
  try {
    switch (event.type) {

      // A) CHECKOUT COMPLETADO
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('📦 checkout.session.completed:', session.id);
        console.log('   Customer ID:', session.customer);
        console.log('   Subscription ID:', session.subscription);
        console.log('   Mode:', session.mode);

        // 🔍 RASTREAMENTO DE ORIGEM DO EMAIL (Debug)
        console.log('\n🔍 [DEBUG] Rastreando origem do email:');
        console.log('   session.customer_details?.email:', session.customer_details?.email || '(não definido)');
        console.log('   session.customer_email:', session.customer_email || '(não definido)');
        console.log('   session.metadata?.customerEmail:', session.metadata?.customerEmail || '(não definido)');
        console.log('   process.env.EMAIL_FROM:', process.env.EMAIL_FROM || '❌ NÃO CONFIGURADO!');

        // Buscar assinatura pelo stripe_checkout_session_id
        const { data: subscription, error: findError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('stripe_checkout_session_id', session.id)
          .single();

        if (findError || !subscription) {
          console.error('❌ Assinatura não encontrada para session:', session.id);
          console.error('   Erro Supabase:', findError);
          break;
        }

        console.log('✅ Assinatura encontrada no banco:', subscription.id);
        console.log('   business_id:', subscription.business_id);
        console.log('   Atualizando com dados do Stripe...');

        // Atualizar assinatura com dados do Stripe
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            external_subscription_id: session.subscription,
            stripe_customer_id: session.customer,
            status: 'active',
            next_charge_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 dias
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.id);

        if (updateError) {
          console.error('❌ Erro ao atualizar assinatura:', updateError);
        } else {
          console.log(`✅ Assinatura ${subscription.id} ATIVADA COM SUCESSO!`);
          console.log('   external_subscription_id:', session.subscription);
          console.log('   stripe_customer_id:', session.customer);

          // 📧 ENVIAR E-MAIL DE NOTIFICAÇÃO PARA O ADMIN
          try {
            console.log('📧 Preparando envio de e-mail de notificação...');

            // Buscar dados do estabelecimento
            const { data: business, error: businessError } = await supabase
              .from('business_registrations')
              .select('establishment_name, contact_email, whatsapp')
              .eq('id', subscription.business_id)
              .single();

            if (businessError || !business) {
              console.error('⚠️ Não foi possível buscar dados do estabelecimento:', businessError);
            } else {
              // 🔍 LOG: Email do Supabase
              console.log('🔍 [DEBUG] Email do Supabase:');
              console.log('   business.contact_email:', business.contact_email || '(não definido)');

              // Buscar dados do plano
              const { data: plan, error: planError } = await supabase
                .from('business_plans')
                .select('name, price')
                .eq('id', subscription.plan_id)
                .single();

              if (planError || !plan) {
                console.error('⚠️ Não foi possível buscar dados do plano:', planError);
              } else {
                console.log('✅ Dados do plano encontrados:', plan.name);
                
                // 🔍 LOG: Email que será usado como DESTINATÁRIO
                // ⚠️ CRÍTICO: SEMPRE usar session.customer_details?.email (pagador real)
                // Nunca usar business.contact_email pois pode não estar verificado no SES
                const stripeCustomerEmail = session.customer_details?.email;
                const emailParaAdmin = process.env.ADMIN_EMAIL;
                const emailParaCliente = stripeCustomerEmail; // ✅ Use ONLY Stripe email
                
                console.log('\n🔍 [DEBUG] Emails que serão usados:');
                console.log('   FROM (remetente):', process.env.EMAIL_FROM);
                console.log('   TO (admin):', emailParaAdmin);
                console.log('   TO (cliente - Stripe payer):', emailParaCliente);
                console.log('   FROM_SOURCE: process.env.EMAIL_FROM ✅');
                console.log('   TO_SOURCE (cliente): session.customer_details?.email ✅');

                // Enviar e-mail de notificação para o ADMIN
                const planPriceCents = Math.round(Number(plan.price) * 100);

                const emailResult = await sendNewSubscriptionNotification({
                  businessName: business.establishment_name,
                  businessEmail: business.establishment_name, // Para contexto apenas (não é TO)
                  planName: plan.name,
                  planPrice: planPriceCents,
                  subscriptionId: subscription.id,
                  customerEmail: stripeCustomerEmail // ✅ Use Stripe email
                });

                if (emailResult.success) {
                  console.log('✅ E-mail de notificação enviado ao admin com sucesso!');
                  console.log('   Email ID:', emailResult.emailId);
                } else {
                  console.error('❌ Falha ao enviar e-mail ao admin:', emailResult.error);
                }

                // 📧 ENVIAR E-MAIL DE CONFIRMAÇÃO PARA O CLIENTE
                console.log('📧 Enviando e-mail de confirmação para o cliente...');
                const customerEmailResult = await sendSubscriptionConfirmationToCustomer({
                  customerEmail: stripeCustomerEmail, // ✅ Use ONLY Stripe email
                  businessName: business.establishment_name,
                  planName: plan.name,
                  planPrice: planPriceCents,
                  nextChargeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                });

                if (customerEmailResult.success) {
                  console.log('✅ E-mail de confirmação enviado ao cliente com sucesso!');
                  console.log('   Email ID:', customerEmailResult.emailId);
                  console.log('   Para:', customerEmailResult.recipient);
                } else {
                  console.error('❌ Falha ao enviar e-mail ao cliente:', customerEmailResult.error);
                }
              }
            }
          } catch (emailError) {
            console.error('❌ Erro ao processar envio de e-mail:', emailError);
            // Não quebrar o webhook por falha no e-mail
          }
        }

        break;
      }

      // B) ASSINATURA CANCELADA
      case 'customer.subscription.deleted': {
        const stripeSubscription = event.data.object;
        console.log('🚫 customer.subscription.deleted:', stripeSubscription.id);

        // Buscar assinatura pelo external_subscription_id (stripe subscription id)
        const { data: subscription, error: findError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('external_subscription_id', stripeSubscription.id)
          .single();

        if (findError || !subscription) {
          console.error('❌ Assinatura não encontrada:', stripeSubscription.id);
          break;
        }

        // Atualizar status para cancelado
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.id);

        if (updateError) {
          console.error('❌ Erro ao cancelar assinatura:', updateError);
        } else {
          console.log(`✅ Assinatura ${subscription.id} CANCELADA`);
        }

        break;
      }

      // C) PAGAMENTO RECORRENTE BEM-SUCEDIDO
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log('💰 invoice.payment_succeeded:', invoice.id);
        console.log('   Subscription ID do Stripe:', invoice.subscription);
        console.log('   Amount paid:', invoice.amount_paid);
        console.log('   Billing reason:', invoice.billing_reason);

        // Validar se invoice.subscription existe
        if (!invoice.subscription) {
          console.log('ℹ️ Invoice sem subscription_id - pagamento avulso (setup inicial)');
          console.log('   Isso é normal na primeira cobrança. O checkout.session.completed já processou.');
          break;
        }

        // Buscar assinatura pelo external_subscription_id (que é o stripe subscription_id)
        const { data: subscription, error: findError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('external_subscription_id', invoice.subscription)
          .single();

        if (findError || !subscription) {
          console.error('❌ Assinatura não encontrada no banco para subscription_id:', invoice.subscription);
          console.error('   Erro Supabase:', findError);
          console.log('💡 DICA: Verifique se checkout.session.completed foi processado primeiro');
          break;
        }

        console.log('✅ Assinatura encontrada:', subscription.id);
        console.log('   business_id:', subscription.business_id);

        // Registrar pagamento na tabela payments
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            business_id: subscription.business_id,
            subscription_id: subscription.id,
            external_payment_id: invoice.id,
            status: 'approved',
            amount_cents: invoice.amount_paid,
            payment_method: invoice.payment_method_types?.[0] || 'card',
            paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (paymentError) {
          console.error('❌ Erro ao registrar pagamento:', paymentError);
        } else {
          console.log(`✅ Pagamento registrado com sucesso!`);
          console.log('   Valor:', (invoice.amount_paid / 100).toFixed(2), 'BRL');
        }

        // Atualizar next_charge_at (+30 dias)
        await supabase
          .from('subscriptions')
          .update({
            next_charge_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.id);

        console.log('✅ Próxima cobrança atualizada para +30 dias');

        break;
      }

      // D) FALHA NO PAGAMENTO
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('❌ invoice.payment_failed:', invoice.id);

        // Buscar assinatura
        const { data: subscription, error: findError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('external_subscription_id', invoice.subscription)
          .single();

        if (findError || !subscription) {
          console.error('❌ Assinatura não encontrada para invoice:', invoice.subscription);
          break;
        }

        // Registrar tentativa de pagamento falha
        await supabase
          .from('payments')
          .insert({
            business_id: subscription.business_id,
            subscription_id: subscription.id,
            external_payment_id: invoice.id,
            status: 'failed',
            amount_cents: invoice.amount_due,
            payment_method: invoice.payment_method_types?.[0] || 'card',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        console.log(`⚠️ Pagamento FALHOU para assinatura ${subscription.id}`);

        break;
      }

      default:
        console.log(`ℹ️ Evento não tratado: ${event.type}`);
    }

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
  }

  // Sempre responder com 200 OK (Stripe requer confirmação)
  res.status(200).json({ received: true });
});

/* =============================
   BODY PARSERS
   
   ⚠️ ATENÇÃO: Vêm DEPOIS do webhook
   O webhook já tem seu próprio express.raw()
============================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────────────────────────
// CORS com validação (apenas origens confiáveis - RESTRITIVO)
// ─────────────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  // Production
  'https://aparecidadonortesp.com.br',
  'https://www.aparecidadonortesp.com.br',
  // Development (Vite)
  'http://localhost:5173',
  // Fallback para dev se necessário
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined
].filter(Boolean); // Remove undefined

app.use(cors({
  origin: (origin, callback) => {
    // Requisições sem origin são permitidas (mobile app, server-to-server, Postman)
    // Requisições COM origin precisam estar na whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS REJEITADO - Origin não autorizado: ${origin}`);
      callback(new Error('CORS: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Stripe-Signature',  // ← Para webhook Stripe
    'X-Requested-With'   // ← XMLHttpRequest
  ],
  exposedHeaders: [
    'X-RateLimit-Limit',      // ← Rate limit info
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset'
  ],
  maxAge: 86400, // 24h cache para preflight
  preflightContinue: false
}));
logger.info(`✅ CORS configurado (Production: 2 origins + Dev: ${process.env.NODE_ENV === 'development' ? 'YES' : 'NO'})`);

// ─────────────────────────────────────────────────────────────────────────────
// Rate Limiting
// ─────────────────────────────────────────────────────────────────────────────

// Rate limit geral: 100 req/15min por IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: '❌ Muitas requisições, tente novamente em alguns minutos',
  standardHeaders: true, // Retorna rate limit info nos headers
  skip: (req) => req.path === '/api/webhook' // Webhook tem seu próprio limit
});

app.use(generalLimiter);

// Rate limit específico para webhook: 30 req/min por IP (Stripe pode enviar múltiplos)
const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30,
  message: '❌ Webhook rate limit excedido',
  skip: (req) => req.path !== '/api/webhook'
});

app.use(webhookLimiter);
logger.info('✅ Rate limiting ativado (geral + webhook)');

// ─────────────────────────────────────────────────────────────────────────────
// Request Logging Middleware (com requestId)
// ─────────────────────────────────────────────────────────────────────────────
app.use(requestLoggerMiddleware);
logger.info('✅ Request logging middleware ativado');

// Middleware para debug de requisições
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');

  // Log de todas as requisições para debug
  console.log(`📥 ${req.method} ${req.path}`, {
    origin: req.headers.origin,
    userAgent: req.headers['user-agent']?.substring(0, 50)
  });

  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// Health Check Routes (sem dependências de banco/Stripe)
// ─────────────────────────────────────────────────────────────────────────────
app.use(healthRouter);
logger.info('✅ Health check endpoints: GET /health, GET /ready');

// Endpoint para buscar planos disponíveis
app.get("/api/plans", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("business_plans")
      .select("id, name, price, description, features, is_active")
      .eq("is_active", true) // Apenas planos ativos
      .order("price", { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error("Erro ao buscar planos:", err);

    // Retornar planos padrão em caso de erro
    const defaultPlans = [
      {
        id: "1",
        name: "Básico",
        price: 49.90,
        description: "Perfil básico do estabelecimento",
        features: ["Perfil básico do estabelecimento", "Até 5 fotos", "Informações de contato", "Suporte por e-mail"],
        is_active: true
      },
      {
        id: "2",
        name: "Intermediário",
        price: 99.90,
        description: "Perfil completo do estabelecimento",
        features: ["Perfil completo do estabelecimento", "Até 10 fotos", "Destaque na busca", "Suporte prioritário", "Relatórios básicos"],
        is_active: true
      },
      {
        id: "3",
        name: "Premium",
        price: 199.90,
        description: "Perfil premium com destaque",
        features: ["Perfil premium com destaque", "Fotos ilimitadas", "Destaque máximo na busca", "Suporte 24/7", "Relatórios avançados", "Promoções exclusivas"],
        is_active: true
      }
    ];

    res.json(defaultPlans);
  }
});

/* =============================
   VERIFICAR SESSÃO DO STRIPE
   
   Usado pela tela de sucesso do frontend para verificar
   se o checkout foi completado e obter dados da sessão.
============================= */
app.get("/api/check-session", async (req, res) => {
  try {
    const { session_id } = req.query;

    // Validar parâmetro obrigatório
    if (!session_id) {
      return res.status(400).json({
        success: false,
        error: "session_id é obrigatório"
      });
    }

    console.log("🔍 Verificando sessão Stripe:", session_id);

    // Buscar sessão no Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      console.error("❌ Sessão não encontrada:", session_id);
      return res.status(404).json({
        success: false,
        error: "Sessão não encontrada"
      });
    }

    console.log("✅ Sessão encontrada:", {
      id: session.id,
      customer: session.customer,
      subscription: session.subscription,
      payment_status: session.payment_status,
      status: session.status
    });

    // Retornar dados da sessão
    return res.json({
      success: true,
      sessionId: session.id,
      customerId: session.customer,
      subscriptionId: session.subscription,
      status: session.status,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total
    });

  } catch (err) {
    console.error("❌ Erro ao verificar sessão:", err.message);

    // Tratar erro específico de sessão não encontrada
    if (err.statusCode === 404) {
      return res.status(404).json({
        success: false,
        error: "Sessão não encontrada"
      });
    }

    // Erro genérico
    return res.status(500).json({
      success: false,
      error: "Erro ao verificar sessão",
      message: err.message
    });
  }
});

/* =============================
   CADASTRAR NEGÓCIO + CRIAR ASSINATURA
============================= */
app.post("/api/register-business", async (req, res) => {
  try {
    const registration = req.body;
    console.log("📥 Dados recebidos do front:", JSON.stringify(registration, null, 2));

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
      admin_email,
      contact_email,
      card_number,
      card_exp_month,
      card_exp_year,
      card_security_code,
      card_holder_name,
      card_holder_tax_id,
    } = registration;

    // Validação de campos obrigatórios
    if (!establishment_name || !category || !address || !location || !photos || !whatsapp || !description || !plan_id) {
      console.error("❌ Campos obrigatórios faltando:", {
        establishment_name: !!establishment_name,
        category: !!category,
        address: !!address,
        location: !!location,
        photos: !!photos,
        whatsapp: !!whatsapp,
        description: !!description,
        plan_id: !!plan_id
      });
      return res.status(400).json({
        error: true,
        message: "Campos obrigatórios faltando"
      });
    }

    console.log("✅ Validação de campos passou");

    // 1. Salvar cadastro de negócio no Supabase
    const normalizedPlanId = (typeof plan_id === 'string' && /^\d+$/.test(plan_id))
      ? parseInt(plan_id, 10)
      : plan_id;

    const insertData = {
      establishment_name,
      category,
      address,
      location,
      photos,
      whatsapp,
      phone,
      description,
      plan_id: normalizedPlanId,
      admin_email,
      contact_email,
      payer_email,
      created_at: new Date().toISOString(),
    };

    console.log("📦 Dados a serem inseridos:", JSON.stringify(insertData, null, 2));

    const { data, error } = await supabase
      .from("business_registrations")
      .insert([insertData])
      .select("id")
      .single();

    if (error) {
      console.error("❌ Erro detalhado do Supabase:", JSON.stringify(error, null, 2));
      throw new Error(`Erro no Supabase: ${error.message} - ${error.details || ''} - ${error.hint || ''}`);
    }
    console.log("✅ Cadastro inserido no Supabase:", data);

    // 2. Retorna apenas o businessId para o front
    res.json({
      success: true,
      business_id: data.id,
      businessId: data.id, // Compatibilidade
    });

  } catch (err) {
    console.error("❌ Erro no fluxo completo:");
    console.error("   Message:", err.message);
    console.error("   Stack:", err.stack);
    console.error("   Details:", err.response?.data || err.details || "");

    res.status(500).json({
      error: true,
      message: err.message || "Erro ao processar cadastro",
      details: err.details || err.response?.data || err.hint || null,
      code: err.code || null
    });
  }
});

/* =============================
   CRIAR ASSINATURA COM STRIPE BILLING
   
   Fluxo:
   1. Validar dados recebidos
   2. Buscar plano no Supabase
   3. Criar Stripe Customer
   4. Criar Stripe Checkout Session (mode: subscription)
   5. Salvar subscription no Supabase com status "pending"
   6. Retornar checkoutUrl para o frontend
============================= */
app.post('/api/create-subscription', async (req, res) => {
  try {
    const { planId, businessId, customer } = req.body;
    console.log("📥 Criando assinatura Stripe:", { planId, businessId, customer });

    // 1. Validar dados obrigatórios
    if (!planId || !businessId) {
      return res.status(400).json({
        error: 'planId e businessId são obrigatórios'
      });
    }

    if (!customer || !customer.email) {
      return res.status(400).json({
        error: 'Email do cliente é obrigatório'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return res.status(400).json({
        error: 'Email inválido'
      });
    }

    // 2. Buscar plano no Supabase
    const { data: plan, error: planError } = await supabase
      .from('business_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      console.error("❌ Plano não encontrado:", planError);
      return res.status(404).json({
        error: 'Plano não encontrado',
        details: planError?.message
      });
    }

    console.log("✅ Plano encontrado:", plan.name, "- R$", plan.price ?? plan.price_cents);

    // Validar e converter preço
    // Suporta tanto `price` (em reais) quanto `price_cents`
    const planPrice = (typeof plan.price === 'number' || typeof plan.price === 'string')
      ? Number(plan.price)
      : (typeof plan.price_cents === 'number' ? plan.price_cents / 100 : NaN);
    if (isNaN(planPrice) || planPrice <= 0) {
      console.error("❌ Preço do plano inválido:", plan.price);
      return res.status(500).json({
        error: 'Preço do plano inválido',
        details: `O plano ${plan.name} tem preço inválido: ${plan.price}`
      });
    }

    // 3. Criar Stripe Customer
    console.log("🔵 Criando Stripe Customer...");
    const stripeCustomer = await stripe.customers.create({
      email: customer.email,
      name: customer.name || 'Cliente Aparecida',
      metadata: {
        business_id: businessId.toString(),
        plan_id: planId.toString(),
        source: 'aparecida_platform'
      }
    });
    console.log("✅ Stripe Customer criado:", stripeCustomer.id);

    // 4. Criar Stripe Checkout Session (modo subscription)
    console.log("🔵 Criando Stripe Checkout Session...");

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: {
            name: plan.name,
            description: plan.description || `Plano ${plan.name} - Aparecida`,
          },
          unit_amount: Math.round(planPrice * 100), // Converter para centavos
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
        },
        quantity: 1,
      }],
      success_url: `${frontendUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/subscription/cancel`,
      metadata: {
        business_id: businessId.toString(),
        plan_id: planId.toString(),
      },
    });

    console.log("✅ Checkout Session criada:", session.id);
    console.log("   URL:", session.url);

    // 5. Salvar assinatura no Supabase com status "pending"
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        business_id: businessId,
        plan_id: planId,
        external_subscription_id: null, // Será preenchido pelo webhook
        stripe_customer_id: stripeCustomer.id,
        stripe_checkout_session_id: session.id,
        status: 'pending',
        amount_cents: Math.round(planPrice * 100),
        frequency: 1,
        frequency_type: 'months',
        customer_email: customer.email,
        customer_name: customer.name || null,
        customer_tax_id: customer.tax_id || null,
      })
      .select()
      .single();

    if (subError) {
      console.error("❌ Erro ao salvar assinatura no Supabase:", subError);
      // Tentar limpar o customer criado no Stripe
      try {
        await stripe.customers.del(stripeCustomer.id);
      } catch (cleanupError) {
        console.error("⚠️ Erro ao limpar Stripe Customer:", cleanupError);
      }
      return res.status(500).json({
        error: 'Erro ao salvar assinatura no banco de dados',
        details: subError.message
      });
    }

    console.log("✅ Assinatura salva no Supabase:", subscription.id);

    // 6. Retornar checkoutUrl para o frontend
    return res.json({
      success: true,
      checkoutUrl: session.url,
      subscription_id: subscription.id,
      stripe_customer_id: stripeCustomer.id,
      stripe_session_id: session.id
    });

  } catch (error) {
    console.error("❌ Erro ao criar assinatura:", error);
    return res.status(500).json({
      error: "Erro ao criar assinatura",
      message: error.message,
      details: error.stack
    });
  }
});

app.post('/api/test-plan-2', async (req, res) => {
  try {
    const { customer_email, business_id, plan_id } = req.body;

    // Validação de campos obrigatórios
    if (!customer_email) {
      return res.status(400).json({
        error: 'customer_email é obrigatório'
      });
    }

    if (!business_id) {
      return res.status(400).json({
        error: 'business_id é obrigatório'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      return res.status(400).json({
        error: 'Email inválido'
      });
    }

    // Validar que business_id existe
    const { data: businessExists, error: businessError } = await supabase
      .from('business_registrations')
      .select('id')
      .eq('id', business_id)
      .single();

    if (businessError || !businessExists) {
      return res.status(404).json({
        error: 'Estabelecimento não encontrado',
        details: businessError?.message
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const amountCents = 200; // R$ 2,00

    // 1. Criar sessão Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: customer_email,
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'Teste real R$ 2,00',
          },
          unit_amount: amountCents,
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
        },
        quantity: 1,
      }],
      success_url: `${frontendUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/subscription/cancel`,
      metadata: {
        business_id: business_id.toString(),
        plan_id: plan_id ? plan_id.toString() : null,
      },
    });

    console.log('✅ Sessão Stripe criada:', session.id);

    // 2. Salvar no Supabase com TODOS os campos obrigatórios
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        business_id: business_id,
        plan_id: plan_id || null,
        stripe_checkout_session_id: session.id,
        status: 'pending',
        amount_cents: amountCents,
        frequency: 1,
        frequency_type: 'months',
        customer_email: customer_email,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (subError) {
      console.error('❌ Erro ao salvar assinatura no Supabase:', subError);
      // Tentar limpar a sessão no Stripe
      try {
        await stripe.checkout.sessions.expire(session.id);
      } catch (cleanupError) {
        console.error('⚠️ Erro ao limpar sessão Stripe:', cleanupError);
      }
      return res.status(500).json({
        error: 'Erro ao salvar assinatura no banco de dados',
        details: subError.message
      });
    }

    console.log('✅ Assinatura salva no Supabase:', subscription.id);

    return res.json({
      success: true,
      checkoutUrl: session.url,
      subscription_id: subscription.id,
      stripe_session_id: session.id,
      business_id: business_id,
      amount_cents: amountCents
    });

  } catch (error) {
    console.error('❌ Erro ao criar checkout test-plan-2:', error);
    return res.status(500).json({
      error: 'Erro ao criar checkout',
      message: error.message
    });
  }
});

app.post('/api/test-plan-4', async (req, res) => {
  try {
    const { customer_email, business_id, plan_id } = req.body;

    // Validação de campos obrigatórios
    if (!customer_email) {
      return res.status(400).json({
        error: 'customer_email é obrigatório'
      });
    }

    if (!business_id) {
      return res.status(400).json({
        error: 'business_id é obrigatório'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      return res.status(400).json({
        error: 'Email inválido'
      });
    }

    // Validar que business_id existe
    const { data: businessExists, error: businessError } = await supabase
      .from('business_registrations')
      .select('id')
      .eq('id', business_id)
      .single();

    if (businessError || !businessExists) {
      return res.status(404).json({
        error: 'Estabelecimento não encontrado',
        details: businessError?.message
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const amountCents = 400; // R$ 4,00

    // 1. Criar sessão Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: customer_email,
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'Teste real R$ 4,00',
          },
          unit_amount: amountCents,
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
        },
        quantity: 1,
      }],
      success_url: `${frontendUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/subscription/cancel`,
      metadata: {
        business_id: business_id.toString(),
        plan_id: plan_id ? plan_id.toString() : null,
      },
    });

    console.log('✅ Sessão Stripe criada:', session.id);

    // 2. Salvar no Supabase com TODOS os campos obrigatórios
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        business_id: business_id,
        plan_id: plan_id || null,
        stripe_checkout_session_id: session.id,
        status: 'pending',
        amount_cents: amountCents,
        frequency: 1,
        frequency_type: 'months',
        customer_email: customer_email,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (subError) {
      console.error('❌ Erro ao salvar assinatura no Supabase:', subError);
      // Tentar limpar a sessão no Stripe
      try {
        await stripe.checkout.sessions.expire(session.id);
      } catch (cleanupError) {
        console.error('⚠️ Erro ao limpar sessão Stripe:', cleanupError);
      }
      return res.status(500).json({
        error: 'Erro ao salvar assinatura no banco de dados',
        details: subError.message
      });
    }

    console.log('✅ Assinatura salva no Supabase:', subscription.id);

    return res.json({
      success: true,
      checkoutUrl: session.url,
      subscription_id: subscription.id,
      stripe_session_id: session.id,
      business_id: business_id,
      amount_cents: amountCents
    });

  } catch (error) {
    console.error('❌ Erro ao criar checkout test-plan-4:', error);
    return res.status(500).json({
      error: 'Erro ao criar checkout',
      message: error.message
    });
  }
});

/* =============================
   START SERVER
============================= */

// Serve frontend static files from dist
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple possible locations for dist
const possiblePaths = [
  path.join(__dirname, '../dist'),
  path.join(__dirname, '../../../dist'),
  path.join(process.cwd(), 'dist'),
  '/var/www/frontend/dist',
  '/opt/render/project/dist',
  '/app/dist'
];

let distPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(path.join(p, 'index.html'))) {
    distPath = p;
    break;
  }
}

if (!distPath) {
  console.warn('⚠️  dist/index.html not found in any expected location');
  distPath = possiblePaths[0]; // Use default anyway
}

console.log(`📂 Serving static files from: ${distPath}`);

// Serve static files
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't redirect API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  // Serve index.html for SPA routing
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 3001;

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server on http://0.0.0.0:${port}`);
  console.log("✅ Server is ready and listening for requests");
  console.log("💳 Stripe Billing integrado e ativo");
  console.log(`   Webhook endpoint: https://www.aparecidadonortesp.com.br/api/webhook`);
  console.log(`   Success URL: ${process.env.FRONTEND_URL || 'https://www.aparecidadonortesp.com.br'}/subscription/success`);
}).on('error', (err) => {
  console.error('❌ Erro ao iniciar servidor:', err);
  process.exit(1);
});
