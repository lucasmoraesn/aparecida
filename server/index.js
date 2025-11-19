import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
console.log('🔍 DEBUG index.js:');
console.log('  PUBLIC_URL_NGROK:', process.env.PUBLIC_URL_NGROK);
console.log('  SUPABASE_URL:', process.env.SUPABASE_URL);

const app = express();

app.use(express.json());

// CORS configurado para aceitar requisições do frontend
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// Middleware para debug de requisições
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Log de todas as requisições para debug
  console.log(`📥 ${req.method} ${req.path}`, {
    origin: req.headers.origin,
    userAgent: req.headers['user-agent']?.substring(0, 50)
  });
  
  next();
});

// --- Supabase (usando service_role no backend) ---
console.log("[SUPABASE_URL]", process.env.SUPABASE_URL);
console.log("[SUPABASE_SERVICE_KEY]", process.env.SUPABASE_SERVICE_KEY?.slice(0, 20) + "...");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
console.log("✅ Supabase client created");

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
      amount,
      frequency,
      frequency_type,
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
    const insertData = {
      establishment_name,
      category,
      address,
      location,
      photos,
      whatsapp,
      phone,
      description,
      plan_id: parseInt(plan_id), // Garantir que é número
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
   CRIAR ASSINATURA
   TODO: Integrar com Stripe Subscriptions
   
   Referências:
   - Stripe Checkout: https://stripe.com/docs/checkout
   - Stripe Subscriptions: https://stripe.com/docs/billing/subscriptions/build-subscriptions
   
   Passos necessários:
   1. Criar Stripe Customer com customer.email
   2. Criar Stripe Price baseado no planPrice
   3. Criar Stripe Checkout Session com mode='subscription'
   4. Retornar session.url para redirect
   5. Configurar webhook do Stripe para processar eventos
============================= */
app.post('/api/create-subscription', async (req, res) => {
  try {
    const { planId, businessId, customer } = req.body;
    console.log("📥 Criando assinatura:", { planId, businessId, customer });

    // Validar email do cliente
    if (!customer || !customer.email) {
      return res.status(400).json({ error: 'Email do cliente é obrigatório' });
    }

    // 1. Buscar plano
    const { data: plan, error: planError } = await supabase
      .from('business_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    console.log("🔍 Dados do plano carregado do Supabase:", plan);

    // Validar e converter price
    const planPrice = Number(plan.price);
    if (isNaN(planPrice) || planPrice <= 0) {
      console.error("❌ ERRO: plan.price é inválido:", plan.price);
      return res.status(500).json({ 
        error: 'Preço do plano inválido',
        details: `O plano ${plan.name} tem price inválido: ${plan.price}`
      });
    }

    console.log("✅ Preço do plano validado:", planPrice);

    // 2. Criar assinatura "pending" no banco
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        business_id: businessId,
        plan_id: planId,
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
      console.error("❌ Erro ao criar assinatura no banco:", subError);
      return res.status(500).json({ error: 'Erro ao criar assinatura no banco' });
    }

    console.log("✅ Assinatura criada no DB:", subscription.id);

    // TODO: STRIPE INTEGRATION
    // 3. Criar Stripe Checkout Session
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // 
    // const session = await stripe.checkout.sessions.create({
    //   customer_email: customer.email,
    //   line_items: [{
    //     price_data: {
    //       currency: 'brl',
    //       product_data: {
    //         name: plan.name,
    //         description: plan.description,
    //       },
    //       unit_amount: Math.round(planPrice * 100), // Centavos
    //       recurring: {
    //         interval: 'month',
    //         interval_count: 1,
    //       },
    //     },
    //     quantity: 1,
    //   }],
    //   mode: 'subscription',
    //   success_url: `${process.env.PUBLIC_URL_NGROK || 'http://localhost:5173'}/subscription/success?subscription_id=${subscription.id}`,
    //   cancel_url: `${process.env.PUBLIC_URL_NGROK || 'http://localhost:5173'}/subscription/cancel`,
    //   metadata: {
    //     subscription_id: subscription.id,
    //     business_id: businessId,
    //     plan_id: planId,
    //   },
    // });
    //
    // // 4. Atualizar subscription com stripe_session_id
    // await supabase
    //   .from('subscriptions')
    //   .update({
    //     stripe_session_id: session.id,
    //     status: 'initiated'
    //   })
    //   .eq('id', subscription.id);
    //
    // return res.json({
    //   success: true,
    //   subscription_id: subscription.id,
    //   checkout_url: session.url
    // });

    // TEMPORÁRIO: Retornar erro informando que Stripe não está configurado
    return res.status(501).json({
      error: "Integração de pagamento não configurada",
      message: "Stripe ainda não foi integrado. Configure STRIPE_SECRET_KEY e implemente o checkout.",
      subscription_id: subscription.id
    });

  } catch (error) {
    console.error("❌ Erro ao criar assinatura:", error);
    return res.status(500).json({
      error: "Erro ao criar assinatura",
      details: error.message
    });
  }
});

/* =============================
   WEBHOOK DE PAGAMENTO
   TODO: Integrar com Stripe Webhooks
   
   Referências:
   - Stripe Webhooks: https://stripe.com/docs/webhooks
   - Verificação de assinatura: https://stripe.com/docs/webhooks/signatures
   
   Eventos importantes:
   - checkout.session.completed: Quando checkout é finalizado
   - customer.subscription.created: Assinatura criada
   - customer.subscription.updated: Status mudou (ativa, pausada, cancelada)
   - invoice.payment_succeeded: Pagamento recorrente bem-sucedido
   - invoice.payment_failed: Falha no pagamento
============================= */
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    console.log('📩 Webhook recebido');
    
    // TODO: STRIPE WEBHOOK INTEGRATION
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const sig = req.headers['stripe-signature'];
    // const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    //
    // let event;
    // try {
    //   event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    // } catch (err) {
    //   console.error('⚠️ Webhook signature verification failed:', err.message);
    //   return res.status(400).send(`Webhook Error: ${err.message}`);
    // }
    //
    // console.log('📩 Event type:', event.type);
    //
    // // Responder imediatamente
    // res.status(200).json({ received: true });
    //
    // // Processar evento de forma assíncrona
    // (async () => {
    //   try {
    //     switch (event.type) {
    //       case 'checkout.session.completed':
    //         const session = event.data.object;
    //         const subscriptionId = session.metadata.subscription_id;
    //         
    //         await supabase
    //           .from('subscriptions')
    //           .update({
    //             stripe_subscription_id: session.subscription,
    //             stripe_customer_id: session.customer,
    //             status: 'active',
    //             activated_at: new Date().toISOString(),
    //           })
    //           .eq('id', subscriptionId);
    //         
    //         console.log(`✅ Assinatura ${subscriptionId} ativada`);
    //         break;
    //
    //       case 'invoice.payment_succeeded':
    //         const invoice = event.data.object;
    //         const stripeSubscriptionId = invoice.subscription;
    //         
    //         // Buscar assinatura
    //         const { data: sub } = await supabase
    //           .from('subscriptions')
    //           .select('id, business_id')
    //           .eq('stripe_subscription_id', stripeSubscriptionId)
    //           .single();
    //         
    //         if (sub) {
    //           // Registrar pagamento
    //           await supabase
    //             .from('payments')
    //             .insert([{
    //               business_id: sub.business_id,
    //               subscription_id: sub.id,
    //               stripe_invoice_id: invoice.id,
    //               status: 'approved',
    //               amount_cents: invoice.amount_paid,
    //               paid_at: new Date().toISOString(),
    //             }]);
    //           
    //           console.log(`✅ Pagamento registrado para assinatura ${sub.id}`);
    //         }
    //         break;
    //
    //       case 'customer.subscription.updated':
    //         const subscription = event.data.object;
    //         
    //         await supabase
    //           .from('subscriptions')
    //           .update({ status: subscription.status })
    //           .eq('stripe_subscription_id', subscription.id);
    //         
    //         console.log(`✅ Status da assinatura atualizado: ${subscription.status}`);
    //         break;
    //     }
    //   } catch (innerError) {
    //     console.error('❌ Erro ao processar webhook:', innerError);
    //   }
    // })();

    // TEMPORÁRIO: Retornar OK mas não processar nada
    console.log('⚠️ Webhook recebido mas Stripe não está configurado');
    res.status(200).json({ 
      received: true, 
      message: 'Webhook endpoint disponível mas Stripe não configurado',
      timestamp: new Date().toISOString() 
    });

  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
});

/* =============================
   START SERVER
============================= */
const port = process.env.PORT || 3001;

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(port, () => {
  console.log(`🚀 Server on http://localhost:${port}`);
  console.log("✅ Server is ready and listening for requests");
  console.log("⚠️  AVISO: Integração de pagamento (Stripe) ainda não configurada");
});
