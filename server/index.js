import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ⚠️ CRÍTICO: Carregar .env ANTES de qualquer outro import que use process.env
const __envDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__envDir, '.env') });
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { getSupabaseAdmin } from './lib/supabaseAdmin.js';
import createEbookRouter from './routes/ebook.js';
import { handleEbookStripeEvent } from './webhooks/stripeEbookHandler.js';
import Stripe from "stripe";
import logger, { requestLoggerMiddleware } from "./services/logger.js";
import { sendNewSubscriptionNotification, sendSubscriptionConfirmationToCustomer, sendNewMotoristaNotification, sendMotoristaAnaliseEmail } from "./services/emailService.js";
import stripeWebhookRouter from './routes/stripeWebhook.js';
import multer from 'multer';
import * as businessRegistrationService from './services/businessRegistrationService.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB
import { scannerBlockerMiddleware } from "./middleware/scannerBlocker.js";
import healthRouter from './routes/health.js';
import { ensureEbookPurchasesTable } from './services/databaseInitService.js';

// ─────────────────────────────────────────────────────────────────────────────

logger.info('ENV carregado', {
  path: join(__envDir, '.env'),
  SUPABASE_URL: process.env.SUPABASE_URL ? '✅' : '❌ AUSENTE',
  SUPABASE_SECRET_KEY: (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY) ? '✅' : '❌ AUSENTE',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? '✅' : '❌ AUSENTE',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? '✅' : '❌ AUSENTE',
  RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅' : '❌ AUSENTE',
  RESEND_FROM: process.env.RESEND_FROM ? '✅' : '❌ AUSENTE (e-mails falharão!)'
});

// --- Inicializar Supabase (service role — apenas backend) ---
const supabase = getSupabaseAdmin();
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

  // 3. Processar evento de forma assíncrona (com idempotência)
  try {
    console.log(`📌 Event ID: ${event.id} (para rastreamento de duplicação)`);

    // 🔹 VERIFICAÇÃO DIRETA E EXPLÍCITA DE EBOOK
    // Sem dependência de função auxiliar - verificação rígida aqui
    if (event.data.object?.metadata?.type === 'ebook') {
      console.log(`📖 [EBOOK ROUTE] Evento: ${event.type} — session ${event.data.object.id}`);
      
      // Processar ebook e sair (nunca entra no switch de subscription)
      await handleEbookStripeEvent(event);
      return;
    }

    // 🔹 ROTA DE SUBSCRIPTION (apenas eventos que NÃO são ebook)
    // Verificação: se chegou aqui, é garantido que NÃO é ebook
    console.log(`💳 [SUBSCRIPTION ROUTE] Evento: ${event.type} — metadata.type: ${event.data.object?.metadata?.type || 'N/A'}`);

    switch (event.type) {

      // A) CHECKOUT COMPLETADO
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('📦 checkout.session.completed:', session.id);
        console.log('   Customer ID:', session.customer);
        console.log('   Subscription ID:', session.subscription);
        console.log('   Mode:', session.mode);
        console.log('   Metadata:', session.metadata);

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
          // Verificar se é um checkout de motorista, hotel ou restaurante
          const businessType = session.metadata?.type;
          
          if (['motorista', 'hotel', 'restaurante'].includes(businessType) && session.subscription) {
            console.log(`🔗 Checkout de ${businessType} detectado — salvando stripe_subscription_id`);
            
            const config = businessRegistrationService.BUSINESS_CONFIG[businessType];
            if (config) {
              const { error: updateErr } = await supabase
                .from(config.table)
                .update({ stripe_subscription_id: session.subscription })
                .eq('stripe_session_id', session.id);
              
              if (updateErr) {
                logger.error(`❌ Erro ao salvar stripe_subscription_id no ${businessType}:`, updateErr);
              } else {
                logger.info(`✅ stripe_subscription_id salvo no ${businessType} para session:`, session.id);
              }
            }
          } else {
            console.error('❌ Assinatura não encontrada para session:', session.id);
            if (findError) {
              console.error('   Erro detalhado do Supabase:', JSON.stringify(findError, null, 2));
            }
            console.error('   Erro Supabase:', findError);
          }
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
          // Mesmo sem encontrar no subscriptions, tentar desativar motorista pelo stripe_subscription_id
        } else {
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
        }

        // Desativar motorista vinculado (independente de ter assinatura no banco)
        const { data: motorista, error: motoFindErr } = await supabase
          .from('motoristas')
          .select('id, nome')
          .eq('stripe_subscription_id', stripeSubscription.id)
          .single();

        if (!motoFindErr && motorista) {
          const { error: motoDeactivateErr } = await supabase
            .from('motoristas')
            .update({ ativo: false })
            .eq('id', motorista.id);

          if (motoDeactivateErr) {
            console.error('❌ Erro ao desativar motorista:', motoDeactivateErr);
          } else {
            console.log(`✅ Motorista ${motorista.nome} desativado por cancelamento de assinatura`);
          }
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
          // Verificar se é pagamento de motorista
          const { data: motorista, error: motoFindErr } = await supabase
            .from('motoristas')
            .select('id, nome, ativo')
            .eq('stripe_subscription_id', invoice.subscription)
            .single();

          if (!motoFindErr && motorista) {
            if (!motorista.ativo) {
              const { error: motoActivateErr } = await supabase
                .from('motoristas')
                .update({ ativo: true })
                .eq('id', motorista.id);

              if (motoActivateErr) {
                console.error('❌ Erro ao reativar motorista:', motoActivateErr);
              } else {
                console.log(`✅ Motorista ${motorista.nome} REATIVADO após pagamento bem-sucedido`);
              }
            } else {
              console.log(`ℹ️ Motorista ${motorista.nome} já estava ativo`);
            }
          } else {
            console.error('❌ Assinatura não encontrada no banco para subscription_id:', invoice.subscription);
            console.error('   Erro Supabase:', findError);
            console.log('💡 DICA: Verifique se checkout.session.completed foi processado primeiro');
          }
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
  // Resposta já foi enviada no início (linha ~125)
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
  // Development (Vite usa 5173, 5174, 5175... se a porta estiver ocupada)
  ...(process.env.NODE_ENV === 'development' || !process.env.NODE_ENV ? [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
  ] : []),
].filter(Boolean);

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
    'X-Requested-With',  // ← XMLHttpRequest
    'X-Admin-Password'   // ← Admin endpoints
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
   EBOOK (KIT DO ROMEIRO 2026) ROTAS
============================= */
app.use('/api/ebook', createEbookRouter({ stripe }));

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
      content_authorization,
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

    // 1. Salvar em business_registrations (tabela de referência para subscriptions)
    console.log("📝 Salvando em tabela 'business_registrations'");
    
    const normalizedPlanId = (typeof plan_id === 'string' && /^\d+$/.test(plan_id))
      ? parseInt(plan_id, 10)
      : plan_id;

    const businessRegData = {
      establishment_name,
      category,
      address,
      location: Array.isArray(location) ? location.join(', ') : location,
      photos: Array.isArray(photos) ? photos : [photos], // Salvar como array JSON
      whatsapp,
      phone: phone || null,
      description,
      plan_id: normalizedPlanId,
      admin_email,
      contact_email,
    };

    console.log("📦 Dados para business_registrations:", JSON.stringify(businessRegData, null, 2));

    const { data: businessReg, error: businessRegError } = await supabase
      .from("business_registrations")
      .insert([businessRegData])
      .select("id")
      .single();

    if (businessRegError) {
      console.error("❌ Erro ao inserir em business_registrations:", businessRegError);
      return res.status(500).json({
        error: true,
        message: "Erro ao salvar cadastro",
        details: businessRegError.message
      });
    }

    console.log("✅ Cadastro salvo em business_registrations:", businessReg.id);

    return res.json({
      success: true,
      business_id: businessReg.id,
      businessId: businessReg.id, // Compatibilidade
    });

  } catch (err) {
    console.error("❌ Erro no fluxo de registro:");
    console.error("   Message:", err.message);
    console.error("   Stack:", err.stack);

    res.status(500).json({
      error: true,
      message: err.message || "Erro ao processar cadastro",
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
    // Logs extremamente detalhados
    console.log("\n========== CRIAR ASSINATURA ==========");
    console.log("📥 Body recebido COMPLETO:", JSON.stringify(req.body, null, 2));
    
    const { planId, businessId, customer } = req.body;
    console.log("📊 Dados extraídos:", {
      planId: planId,
      businessId: businessId,
      businessIdType: typeof businessId,
      customerEmail: customer?.email,
      customerName: customer?.name
    });

    // 1. Validar dados obrigatórios
    if (!planId || !businessId) {
      console.error("❌ Validação falhou: planId ou businessId ausentes");
      return res.status(400).json({
        success: false,
        error: 'planId e businessId são obrigatórios',
        received: { planId, businessId }
      });
    }

    if (!customer || !customer.email) {
      console.error("❌ Validação falhou: email ausente");
      return res.status(400).json({
        success: false,
        error: 'Email do cliente é obrigatório',
        received: { customer }
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      console.error("❌ Email inválido:", customer.email);
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    console.log("✅ Validações básicas passaram");

    // 2. Buscar plano no Supabase
    console.log("🔍 Buscando plano com ID:", planId);
    const { data: plan, error: planError } = await supabase
      .from('business_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError) {
      console.error("❌ Erro ao buscar plano:", planError);
      return res.status(404).json({
        success: false,
        error: 'Plano não encontrado',
        details: planError?.message,
        planId: planId
      });
    }

    if (!plan) {
      console.error("❌ Plano não encontrado para ID:", planId);
      return res.status(404).json({
        success: false,
        error: 'Plano não existe no banco de dados'
      });
    }

    console.log("✅ Plano encontrado:", { id: plan.id, name: plan.name, price: plan.price });

    // Validar e converter preço
    const planPrice = (typeof plan.price === 'number' || typeof plan.price === 'string')
      ? Number(plan.price)
      : (typeof plan.price_cents === 'number' ? plan.price_cents / 100 : NaN);
    
    console.log("💰 Preço convertido:", { originalPrice: plan.price, convertedPrice: planPrice });
    
    if (isNaN(planPrice) || planPrice <= 0) {
      console.error("❌ Preço inválido:", { price: plan.price, planPrice });
      return res.status(400).json({
        success: false,
        error: 'Preço do plano inválido',
        details: `Preço recebido: ${plan.price}, convertido: ${planPrice}`
      });
    }

    // 3. Criar Stripe Customer
    console.log("🔵 Criando Stripe Customer com email:", customer.email);
    let stripeCustomer;
    try {
      stripeCustomer = await stripe.customers.create({
        email: customer.email,
        name: customer.name || 'Cliente Aparecida',
        metadata: {
          business_id: businessId.toString(),
          plan_id: planId.toString(),
          source: 'aparecida_platform'
        }
      });
      console.log("✅ Stripe Customer criado:", stripeCustomer.id);
    } catch (stripeError) {
      console.error("❌ Erro ao criar Stripe Customer:", stripeError);
      return res.status(500).json({
        success: false,
        error: 'Erro ao criar cliente no Stripe',
        details: stripeError.message
      });
    }

    // 4. Criar Stripe Checkout Session
    console.log("🔵 Criando Stripe Checkout Session...");
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    console.log("   Frontend URL:", frontendUrl);
    
    let session;
    try {
      session = await stripe.checkout.sessions.create({
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
            unit_amount: Math.round(planPrice * 100),
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
    } catch (stripeError) {
      console.error("❌ Erro ao criar Stripe Session:", stripeError);
      try {
        await stripe.customers.del(stripeCustomer.id);
      } catch (e) {
        console.error("⚠️ Erro ao deletar customer de limpeza:", e);
      }
      return res.status(500).json({
        success: false,
        error: 'Erro ao criar sessão de checkout',
        details: stripeError.message
      });
    }

    // 5. Salvar assinatura no Supabase
    console.log("\n📝 Preparando para salvar na tabela 'subscriptions'");
    const subscriptionData = {
      business_id: businessId,
      plan_id: planId,
      external_subscription_id: null,
      status: 'pending',
      amount_cents: Math.round(planPrice * 100),
      frequency: 1,
      frequency_type: 'months',
      customer_email: customer.email,
      customer_name: customer.name || null,
      customer_tax_id: customer.tax_id || null,
    };
    console.log("📦 Dados para inserir:", JSON.stringify(subscriptionData, null, 2));

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert([subscriptionData])
      .select()
      .single();

    if (subError) {
      console.error("❌ ERRO AO SALVAR ASSINATURA:");
      console.error("   Código:", subError.code);
      console.error("   Mensagem:", subError.message);
      console.error("   Detalhes:", subError.details);
      console.error("   Hint:", subError.hint);
      
      // Tentar limpar Stripe Customer
      try {
        await stripe.customers.del(stripeCustomer.id);
        console.log("✅ Stripe Customer deletado após erro");
      } catch (cleanupError) {
        console.error("⚠️ Erro ao limpar Stripe Customer:", cleanupError);
      }
      
      return res.status(500).json({
        success: false,
        error: 'Erro ao salvar assinatura no banco de dados',
        details: {
          code: subError.code,
          message: subError.message,
          hint: subError.hint,
          details: subError.details
        }
      });
    }

    console.log("✅ Assinatura salva com sucesso:", subscription);
    console.log("========== FIM CRIAR ASSINATURA ==========\n");

    // 6. Retornar checkoutUrl para o frontend
    return res.json({
      success: true,
      checkoutUrl: session.url,
      subscription_id: subscription.id,
      stripe_customer_id: stripeCustomer.id,
      stripe_session_id: session.id
    });

  } catch (error) {
    console.error("\n❌ ERRO NÃO TRATADO EM create-subscription:");
    console.error("   Message:", error.message);
    console.error("   Stack:", error.stack);
    console.error("   Erro completo:", error);
    
    return res.status(500).json({
      success: false,
      error: "Erro ao criar assinatura",
      message: error.message,
      type: error.constructor.name
    });
  }
});

/* =============================
   CRIAR ASSINATURA PARA MOTORISTAS (Fluxo Direto)
============================= */
app.post('/api/create-motorista-subscription', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    if (!priceId) return res.status(400).json({ error: 'priceId é obrigatório' });

    // Usa o Url passado pelo frontend (no caso do teste vem puro localhost), fallback para o Origin ou o FRONTEND_URL
    const frontendUrl = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';

    const safeSuccessUrl = successUrl || `${frontendUrl}/cadastro-sucesso?session_id={CHECKOUT_SESSION_ID}`;
    const safeCancelUrl = cancelUrl || `${frontendUrl}/planos-motoristas`;

    // Cria sessão de checkout apenas com o ID do Price
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: safeSuccessUrl,
      cancel_url: safeCancelUrl,
      metadata: { type: 'motorista' },
    });

    res.json({ success: true, checkoutUrl: session.url });
  } catch (error) {
    console.error("❌ Erro em create-motorista-subscription:", error);
    res.status(500).json({ error: "Erro ao iniciar pagamento", details: error.message });
  }
});

/* =============================
   REGISTRAR MOTORISTA APÓS SUCESSO DO PAGAMENTO
============================= */
app.post('/api/register-motorista', (req, res, next) => {
  upload.single('foto')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer erro:', err.message);
      return res.status(400).json({ error: 'Erro no upload do arquivo: ' + err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const sessionId = req.body.sessionId;
    const rawMotoristaData = req.body.motoristaData;
    const motoristaData = typeof rawMotoristaData === 'string'
      ? JSON.parse(rawMotoristaData)
      : rawMotoristaData;
    if (!sessionId || !motoristaData) {
      return res.status(400).json({ error: 'sessionId e motoristaData são obrigatórios' });
    }

    console.log("🔍 Validando sessão Stripe para Motorista:", sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
    
    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Pagamento não confirmado ou sessão inválida' });
    }

    const priceId = session.line_items?.data[0]?.price?.id;
    let destaque = false;
    let verificado = false;
    let planoNome = 'basico';

    if (priceId === 'price_1TGkA6JRpc53eVmKCYLeNscU') {  // Básico R$39,90
      planoNome = 'basico';
      destaque = false;
      verificado = false;
    } else if (priceId === 'price_1TGkA6JRpc53eVmKJE8ff09p') {  // Destaque R$49,90
      planoNome = 'destaque';
      destaque = true;
      verificado = true;
    } else if (priceId === 'price_1TGkA7JRpc53eVmKM0gNo3FZ') {  // Premium R$89,90
      planoNome = 'premium';
      destaque = true;
      verificado = true;
    }
    
    // Upload da foto no backend usando service role (bypassa RLS)
    let fotoUrl = '';
    if (req.file) {
      try {
        const ext = req.file.originalname.split('.').pop() || 'jpg';
        const fileName = `motorista_${Date.now()}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('motoristas-fotos')
          .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
            cacheControl: '3600',
            upsert: true
          });
        if (uploadError) {
          console.error('❌ Erro ao fazer upload da foto:', uploadError);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('motoristas-fotos')
            .getPublicUrl(fileName);
          fotoUrl = publicUrlData?.publicUrl || '';
          console.log('✅ Foto enviada ao Storage:', fotoUrl);
        }
      } catch (fotoError) {
        console.error('❌ Erro inesperado no upload da foto:', fotoError);
      }
    }

    // Inserir usando a SERVICE_KEY do Supabase para ignorar RLS
    console.log("✅ Pagamento validado, criando motorista no banco...", { planoNome, destaque });
    const { data, error } = await supabase
      .from('motoristas')
      .insert({
        nome: motoristaData.nome,
        whatsapp: motoristaData.whatsapp,
        telefone: motoristaData.whatsapp, // Mesmo valor como fallback
        veiculo: motoristaData.veiculo,
        passageiros: motoristaData.passageiros,
        cidades: motoristaData.cidades, // array ou string
        descricao: motoristaData.descricao || '',
        foto_url: fotoUrl,
        plano: planoNome,
        destaque: destaque,
        verificado: verificado,
        ativo: false, // Aguarda aprovação do administrador
        stripe_session_id: sessionId 
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Erro ao inserir motorista no Supabase:", error);
      return res.status(500).json({ error: "Erro ao salvar cadastro", details: error.message });
    }

    console.log("✅ Motorista cadastrado com sucesso:", data.id);

    // Notificações por e-mail (sem bloquear a resposta)
    const driverEmail = session.customer_details?.email;

    try {
      await sendNewMotoristaNotification({
        nome: motoristaData.nome,
        whatsapp: motoristaData.whatsapp,
        plano: planoNome,
        email: driverEmail,
      });
      console.log('✅ E-mail de notificação enviado ao admin');
    } catch (emailErr) {
      console.error('⚠️ Erro ao enviar e-mail ao admin:', emailErr.message);
    }

    try {
      if (driverEmail) {
        await sendMotoristaAnaliseEmail({ nome: motoristaData.nome, email: driverEmail });
        console.log('✅ E-mail de análise enviado ao motorista:', driverEmail);
      }
    } catch (emailErr) {
      console.error('⚠️ Erro ao enviar e-mail de análise ao motorista:', emailErr.message);
    }

    res.json({ success: true, motorista: data });
  } catch (error) {
    console.error("❌ Erro em register-motorista:", error);
    res.status(500).json({ error: "Erro interno", details: error.message });
  }
});

// ─── ADMIN: Motoristas Pendentes ──────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'super_segredo_token_jwt_aparecida_tour_2026_xyz';

function checkAdminPassword(req, res) {
  // Mantém retrocompatibilidade com 'x-admin-password' e também com 'Authorization: Bearer <token>'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const senha = req.headers['x-admin-password'] || req.body?.adminPassword;

  // 1. Tentar validar via JWT
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.role === 'admin') {
        return true;
      }
    } catch (err) {
      console.warn('⚠️ Token JWT inválido ou expirado:', err.message);
      res.status(401).json({ error: 'Sessão expirada ou inválida. Faça login novamente.', code: 'TOKEN_EXPIRED' });
      return false;
    }
  }

  // 2. Se não houver JWT, tentar validar via senha antiga (para testes, Postman e retrocompatibilidade)
  if (senha === ADMIN_PASSWORD) {
    return true;
  }

  res.status(401).json({ error: 'Não autorizado' });
  return false;
}

// Endpoint de login real do Administrador (JWT)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Senha é obrigatória' });
  }

  if (password === ADMIN_PASSWORD) {
    // Gerar token JWT com expiração de 24 horas
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ success: true, token, role: 'admin' });
  }

  return res.status(401).json({ error: 'Senha incorreta. Tente novamente.' });
});


app.get('/api/admin/motoristas-pendentes', async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const { data, error } = await supabase
      .from('motoristas')
      .select('id, nome, foto_url, whatsapp, telefone, veiculo, passageiros, cidades, descricao, plano, stripe_session_id')
      .eq('ativo', false)
      .order('id', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, motoristas: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/admin/motoristas-ativos', async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const { data, error } = await supabase
      .from('motoristas')
      .select('id, nome, foto_url, whatsapp, telefone, veiculo, passageiros, cidades, descricao, plano, stripe_session_id')
      .eq('ativo', true)
      .order('id', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, motoristas: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/aprovar-motorista', async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'id obrigatório' });
  try {
    const { error } = await supabase.from('motoristas').update({ ativo: true }).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/rejeitar-motorista', async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'id obrigatório' });
  try {
    const { error } = await supabase.from('motoristas').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── Endpoint público: lista motoristas aprovados ─────────────────────────────
app.get('/api/motoristas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('motoristas')
      .select('id, nome, foto_url, whatsapp, veiculo, passageiros, cidades, descricao, plano, verificado')
      .eq('ativo', true)
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, motoristas: data || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// ─────────────────────────────────────────────────────────────────────────────

/* =============================
   ENDPOINTS GENÉRICOS: HOTELS, RESTAURANTES, ETC
   Reutiliza a mesma lógica de Motoristas
============================= */

/**
 * Criar assinatura para qualquer tipo de negócio
 * POST /api/create-{tipo}-subscription
 * Tipos: hotels, restaurantes
 */
app.post('/api/create-:businessType-subscription', async (req, res) => {
  try {
    const { businessType } = req.params;
    const { priceId, successUrl, cancelUrl } = req.body;

    // Validar tipo
    if (!['hotels', 'restaurantes'].includes(businessType)) {
      return res.status(400).json({ error: 'Tipo de negócio inválido' });
    }
    if (!priceId) {
      return res.status(400).json({ error: 'priceId é obrigatório' });
    }

    const frontendUrl = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';
    const safeSuccessUrl = successUrl || `${frontendUrl}/cadastro-sucesso?type=${businessType}&session_id={CHECKOUT_SESSION_ID}`;
    const safeCancelUrl = cancelUrl || `${frontendUrl}/planos-${businessType}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: safeSuccessUrl,
      cancel_url: safeCancelUrl,
      metadata: { type: businessType.slice(0, -1), businessType } // 'hotel' ou 'restaurante'
    });

    logger.info(`✅ Sessão Stripe criada para ${businessType}`, { sessionId: session.id });
    res.json({ success: true, checkoutUrl: session.url });
  } catch (error) {
    logger.error(`❌ Erro em create-${req.params.businessType}-subscription:`, error);
    res.status(500).json({ error: "Erro ao iniciar pagamento", details: error.message });
  }
});

/**
 * Registrar novo negócio (Hotel, Restaurante)
 * POST /api/register-{tipo}
 */
app.post('/api/register-:businessType', (req, res, next) => {
  upload.array('fotos', 5)(req, res, (err) => {
    if (err) {
      logger.error('❌ Multer erro:', err.message);
      return res.status(400).json({ error: 'Erro no upload do arquivo: ' + err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { businessType: businessTypeParam } = req.params;
    const { sessionId } = req.body;
    const businessType = businessTypeParam.slice(0, -1); // volta 'hotels' → 'hotel'
    
    // Validar tipo
    if (!['hotel', 'restaurante'].includes(businessType)) {
      return res.status(400).json({ error: 'Tipo de negócio inválido' });
    }

    const rawData = req.body.businessData;
    const businessData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

    if (!sessionId || !businessData) {
      return res.status(400).json({ error: 'sessionId e businessData são obrigatórios' });
    }

    logger.info(`🔍 Processando registro para ${businessType}:`, sessionId);

    // Upload de múltiplas fotos
    let photoUrls = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        const photoUrl = await businessRegistrationService.uploadBusinessPhoto(file, businessType);
        if (photoUrl) {
          photoUrls.push(photoUrl);
        }
      }
    }

    // Registrar negócio com array de fotos
    const registered = await businessRegistrationService.registerBusiness(
      businessType,
      sessionId,
      businessData,
      photoUrls // Passar array em vez de string única
    );

    logger.info(`✅ ${businessType} registrado com sucesso:`, registered.id);
    res.json({ success: true, [businessType]: registered });
  } catch (error) {
    logger.error(`❌ Erro em register-${req.params.businessType}:`, error);
    res.status(500).json({ error: "Erro interno", details: error.message });
  }
});

/**
 * ADMIN: Listar pendentes por tipo (de business_registrations)
 * GET /api/admin/:businessType-pendentes
 */
app.get('/api/admin/:businessType-pendentes', async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const { businessType } = req.params;
    
    logger.info(`🔵 GET /:businessType-pendentes recebido:`, { businessType });
    
    // Mapear: 'motoristas-pendentes' → 'motorista', 'hotéis-pendentes' → 'hotel', etc
    const tipoMap = {
      'motoristas-pendentes': 'motorista',
      'hotéis-pendentes': 'hotel',
      'restaurantes-pendentes': 'restaurante'
    };
    const tipo = tipoMap[businessType];
    
    logger.info(`🔍 Tipo mapeado:`, { businessType, tipo });
    
    if (!tipo) {
      logger.warn(`❌ Tipo não encontrado no mapa`, { businessType, tipoMap });
      return res.status(400).json({ error: `Tipo inválido: ${businessType}. Tipos aceitos: ${Object.keys(tipoMap).join(', ')}` });
    }
    
    // Se é motorista, busca na tabela motoristas (status ativo=false = pendente)
    if (tipo === 'motorista') {
      logger.info(`📋 Buscando motoristas com ativo=false`);
      const { data, error } = await supabase
        .from('motoristas')
        .select('*')
        .eq('ativo', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      logger.info(`✅ Motoristas encontrados:`, data?.length);
      return res.json({ success: true, motoristas: data || [] });
    }

    // Se é hotel ou restaurante, busca em business_registrations com status='pending'
    const categoryMap = {
      'hotel': 'Hotel',
      'restaurante': 'Restaurante',
    };
    
    const category = categoryMap[tipo];
    logger.info(`📋 Buscando ${tipo} em business_registrations`, { category, status: 'pending' });

    const { data, error } = await supabase
      .from('business_registrations')
      .select('*')
      .eq('category', category)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error(`❌ Erro Supabase ao buscar pendentes:`, error);
      throw error;
    }

    logger.info(`✅ ${tipo} encontrados:`, { count: data?.length || 0, data: data?.map(d => ({ id: d.id, establishment_name: d.establishment_name })) });

    // Retorna com a chave correta do tipo
    const key = tipo === 'hotel' ? 'hotéis' : 'restaurantes';
    res.json({ success: true, [key]: data || [] });
  } catch (error) {
    logger.error(`❌ Erro ao listar pendentes:`, error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ADMIN: Listar ativos por tipo (de business_registrations)
 * GET /api/admin/:businessType-ativos
 */
app.get('/api/admin/:businessType-ativos', async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const { businessType } = req.params;
    
    // Mapear: 'motoristas-ativos' → 'motorista', 'hotéis-ativos' → 'hotel', etc
    const tipoMap = {
      'motoristas-ativos': 'motorista',
      'hotéis-ativos': 'hotel',
      'restaurantes-ativos': 'restaurante'
    };
    const tipo = tipoMap[businessType];
    
    if (!tipo) {
      return res.status(400).json({ error: `Tipo inválido: ${businessType}` });
    }
    
    // Se é motorista, busca na tabela motoristas (ativo=true)
    if (tipo === 'motorista') {
      const { data, error } = await supabase
        .from('motoristas')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return res.json({ success: true, motoristas: data || [] });
    }

    // Se é hotel ou restaurante, busca em business_registrations com status='approved'
    const categoryMap = {
      'hotel': 'Hotel',
      'restaurante': 'Restaurante',
    };
    
    const category = categoryMap[tipo];

    const { data, error } = await supabase
      .from('business_registrations')
      .select('*')
      .eq('category', category)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Retorna com a chave correta do tipo
    const key = tipo === 'hotel' ? 'hotéis' : 'restaurantes';
    res.json({ success: true, [key]: data || [] });
  } catch (error) {
    logger.error(`❌ Erro ao listar ativos:`, error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ADMIN: Aprovar registro
 * POST /api/admin/aprovar-{tipo}
 */
app.post('/api/admin/aprovar-:businessType', async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const { businessType } = req.params;
    // Mapear plural português para singular: 'motoristas' → 'motorista', 'hotéis' → 'hotel', 'restaurantes' → 'restaurante'
    const tipoMap = {
      'motoristas': 'motorista',
      'hotéis': 'hotel',
      'restaurantes': 'restaurante'
    };
    const tipo = tipoMap[businessType];
    let { id } = req.body;

    if (!tipo) return res.status(400).json({ error: `Tipo de negócio inválido: ${businessType}` });
    if (!id) return res.status(400).json({ error: 'id obrigatório. Recebido: ' + JSON.stringify(id) });

    // Converter ID para número se necessário
    const numId = parseInt(String(id), 10);
    if (isNaN(numId)) {
      return res.status(400).json({ error: `ID inválido: ${id} não é um número` });
    }

    logger.info(`🔵 Aprovar ${tipo}:`, { businessType, id, numId });

    // Se é motorista, usa o service existente
    if (tipo === 'motorista') {
      await businessRegistrationService.approveBusiness(tipo, id);
      logger.info(`✅ motorista aprovado:`, id);
      return res.json({ success: true });
    }

    // Se é hotel ou restaurante, atualiza em business_registrations
    if (!['hotel', 'restaurante'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo inválido' });
    }

    const { error } = await supabase
      .from('business_registrations')
      .update({ status: 'approved' })
      .eq('id', numId);

    if (error) {
      logger.error(`❌ Erro Supabase ao aprovar ${tipo} id=${numId}:`, error);
      throw error;
    }
    
    logger.info(`✅ ${tipo} aprovado: id=${numId}`);
    res.json({ success: true });
  } catch (error) {
    logger.error(`❌ Erro ao aprovar:`, error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ADMIN: Rejeitar registro
 * POST /api/admin/rejeitar-{tipo}
 */
app.post('/api/admin/rejeitar-:businessType', async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const { businessType } = req.params;
    // Mapear plural português para singular: 'motoristas' → 'motorista', 'hotéis' → 'hotel', 'restaurantes' → 'restaurante'
    const tipoMap = {
      'motoristas': 'motorista',
      'hotéis': 'hotel',
      'restaurantes': 'restaurante'
    };
    const tipo = tipoMap[businessType];
    let { id, reason } = req.body;

    if (!tipo) return res.status(400).json({ error: `Tipo de negócio inválido: ${businessType}` });
    if (!id) return res.status(400).json({ error: 'id obrigatório. Recebido: ' + JSON.stringify(id) });

    // Converter ID para número se necessário
    const numId = parseInt(String(id), 10);
    if (isNaN(numId)) {
      return res.status(400).json({ error: `ID inválido: ${id} não é um número` });
    }

    logger.info(`🔵 Rejeitar ${tipo}:`, { businessType, id, numId, reason });

    // Se é motorista, usa o service existente
    if (tipo === 'motorista') {
      await businessRegistrationService.rejectBusiness(tipo, id, reason);
      logger.info(`✅ motorista rejeitado:`, id);
      return res.json({ success: true });
    }

    // Se é hotel ou restaurante, atualiza em business_registrations
    if (!['hotel', 'restaurante'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo inválido' });
    }

    const { error } = await supabase
      .from('business_registrations')
      .update({ status: 'rejected' })
      .eq('id', numId);

    if (error) {
      logger.error(`❌ Erro Supabase ao rejeitar ${tipo} id=${numId}:`, error);
      throw error;
    }
    
    logger.info(`✅ ${tipo} rejeitado: id=${numId}`);
    res.json({ success: true });
  } catch (error) {
    logger.error(`❌ Erro ao rejeitar:`, error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PÚBLICO: Listar registros ativos por tipo
 * GET /api/{tipo}s
 */
app.get('/api/:businessType', async (req, res) => {
  try {
    const { businessType } = req.params;
    const tipo = businessType.slice(0, -1); // 'hotels' → 'hotel'

    if (!['hotel', 'restaurante'].includes(tipo)) {
      return res.status(404).json({ error: 'Tipo não encontrado' });
    }

    const registros = await businessRegistrationService.getActiveRegistrations(tipo);
    logger.info(`✅ Retornados ${registros.length} ${tipo}s públicos`);
    res.json({ success: true, [businessType]: registros });
  } catch (error) {
    logger.error(`❌ Erro ao listar ${businessType}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────

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

const server = app.listen(port, '0.0.0.0', async () => {
  console.log(`🚀 Server on http://0.0.0.0:${port}`);
  console.log("✅ Server is ready and listening for requests");
  
  // Inicializar banco de dados
  await ensureEbookPurchasesTable();
  
  console.log("💳 Stripe Billing integrado e ativo");
  console.log(`   Webhook endpoint: https://www.aparecidadonortesp.com.br/api/webhook`);
  console.log(`   Success URL: ${process.env.FRONTEND_URL || 'https://www.aparecidadonortesp.com.br'}/subscription/success`);
});

// Permitir reutilizar a porta imediatamente (evita EADDRINUSE após restart)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${port} já está em uso. Aguardando liberação...`);
    setTimeout(() => server.listen(port, '0.0.0.0'), 3000);
  } else {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  console.log('📴 SIGTERM recebido, encerrando gracefully...');
  server.close(() => {
    console.log('✅ Servidor encerrado');
    process.exit(0);
  });
});
