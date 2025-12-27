import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { sendNewSubscriptionNotification, sendSubscriptionConfirmationToCustomer } from "./services/emailService.js";

// Carregar .env.local se existir, senão .env
dotenv.config({ path: '.env.local' });
if (!process.env.STRIPE_SECRET_KEY) {
  dotenv.config(); // Fallback para .env
}
console.log('🔍 DEBUG index.js:');
console.log('  SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('  STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Configurada' : '❌ Não configurada');
console.log('  STRIPE_KEY_TYPE:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? '🧪 TEST MODE' : '🔴 LIVE MODE');
console.log('  STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ Configurada' : '❌ Não configurada');

// --- Inicializar Supabase (precisa estar disponível no webhook) ---
console.log("[SUPABASE_URL]", process.env.SUPABASE_URL);
console.log("[SUPABASE_SERVICE_KEY]", process.env.SUPABASE_SERVICE_KEY?.slice(0, 20) + "...");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
console.log("✅ Supabase client created");

// --- Inicializar Stripe (precisa estar disponível no webhook) ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: "2024-06-20"
});
console.log("✅ Stripe client created");

const app = express();

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
  console.log('   Headers:', JSON.stringify(req.headers, null, 2));
  console.log('   Body type:', typeof req.body);
  console.log('   Body is Buffer:', Buffer.isBuffer(req.body));
  console.log('   Body length:', req.body?.length);
  
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // 1. Verificar assinatura do webhook
    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET não configurado');
      return res.status(500).json({ 
        error: 'Webhook secret não configurado' 
      });
    }

    console.log('🔐 Tentando validar assinatura...');
    console.log('   Signature header:', sig);
    console.log('   Webhook secret:', webhookSecret);
    
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
              // Buscar dados do plano
              const { data: plan, error: planError } = await supabase
                .from('business_plans')
                .select('name, price, price_cents')
                .eq('id', subscription.plan_id)
                .single();

              if (planError || !plan) {
                console.error('⚠️ Não foi possível buscar dados do plano:', planError);
              } else {
                // Enviar e-mail de notificação para o ADMIN
                const planPriceCents = (typeof plan.price_cents === 'number' && Number.isFinite(plan.price_cents))
                  ? plan.price_cents
                  : Math.round(Number(plan.price) * 100);

                const emailResult = await sendNewSubscriptionNotification({
                  businessName: business.establishment_name,
                  businessEmail: business.contact_email || session.customer_details?.email,
                  planName: plan.name,
                  planPrice: planPriceCents,
                  subscriptionId: subscription.id,
                  customerEmail: session.customer_details?.email
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
                  customerEmail: business.contact_email || session.customer_details?.email,
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
});

/* =============================
   BODY PARSERS
   
   ⚠️ ATENÇÃO: Vêm DEPOIS do webhook
   O webhook já tem seu próprio express.raw()
============================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple CORS - just allow everything
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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

// Health-check
app.get("/health", (_req, res) => res.json({ ok: true }));

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
    const { customer_email } = req.body;

    if (!customer_email) {
      return res.status(400).json({ 
        error: 'customer_email é obrigatório' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      return res.status(400).json({ 
        error: 'Email inválido' 
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
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
          unit_amount: 200,
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
        },
        quantity: 1,
      }],
      success_url: `${frontendUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/subscription/cancel`,
    });

    return res.json({
      url: session.url
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
    const { customer_email } = req.body;

    if (!customer_email) {
      return res.status(400).json({ 
        error: 'customer_email é obrigatório' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      return res.status(400).json({ 
        error: 'Email inválido' 
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
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
          unit_amount: 400,
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
        },
        quantity: 1,
      }],
      success_url: `${frontendUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/subscription/cancel`,
    });

    return res.json({
      url: session.url
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
import { fileURLToPath } from 'url';
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
