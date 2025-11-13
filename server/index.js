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

    // 2. Retorna apenas o businessId para o front
    res.json({
      success: true,
      businessId: data.id,
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
   CRIAR ASSINATURA (Preapproval)
============================= */
app.post('/api/create-subscription', async (req, res) => {
  try {
    const { planId, businessId, customer } = req.body;
    console.log("📥 Criando assinatura:", { planId, businessId, customer });

    // 1. Buscar informações do plano
    const { data: plan, error: planError } = await supabase
      .from('business_plans')
      .select('name, price')
      .eq('id', planId)
      .single();

    if (planError) throw new Error('Plano não encontrado');

    // 2. Criar preapproval no Mercado Pago
    const preapprovalBody = {
      back_url: `${process.env.PUBLIC_URL_NGROK}/subscription/success?business_id=${businessId}`,
      reason: plan.name,
      external_reference: businessId.toString(),
      payer_email: customer.email,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: plan.price,
        currency_id: 'BRL',
      },
    };

    console.log("📦 Payload Preapproval:", JSON.stringify(preapprovalBody, null, 2));

    const mpResponse = await preApproval.create({ body: preapprovalBody });

    console.log("✅ Preapproval criado no MP:", mpResponse.id);

    // 3. Salvar assinatura no banco
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert([{
        business_id: businessId,
        preapproval_id: mpResponse.id,
        plan_id: planId,
        status: 'pending',
        amount_cents: Math.round(plan.price * 100),
        frequency: 1,
        frequency_type: 'months',
        customer_email: customer.email,
        customer_name: customer.name || null,
        customer_tax_id: customer.tax_id || null,
      }])
      .select()
      .single();

    if (subError) {
      console.error("❌ Erro ao salvar assinatura:", subError);
      throw new Error('Erro ao salvar assinatura no banco');
    }

    console.log("✅ Assinatura salva no DB:", subscription.id);

    // 4. Retornar init_point para redirecionamento
    res.json({
      success: true,
      init_point: mpResponse.init_point || mpResponse.sandbox_init_point,
      preapproval_id: mpResponse.id,
      subscription_id: subscription.id,
    });

  } catch (err) {
    console.error("❌ Erro ao criar assinatura:", err.message);
    res.status(500).json({
      error: true,
      message: err.message,
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

    // Webhook de pagamento autorizado da assinatura (authorized_payment)
    if (type === 'authorized_payment' && data?.id) {
      const authorizedPaymentId = data.id;
      
      console.log('💰 Cobrança autorizada:', authorizedPaymentId);
      
      // Consultar detalhes da cobrança
      const response = await fetch(`https://api.mercadopago.com/authorized_payments/${authorizedPaymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('❌ Erro ao consultar cobrança:', response.statusText);
        return res.status(200).json({ received: true });
      }

      const authorizedPayment = await response.json();
      console.log('💳 Detalhes da cobrança:', authorizedPayment);

      const preapprovalId = authorizedPayment.preapproval_id;
      const paymentStatus = authorizedPayment.status;
      const amount = authorizedPayment.transaction_amount;

      if (preapprovalId) {
        // Buscar assinatura pelo preapproval_id
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('id, business_id')
          .eq('preapproval_id', preapprovalId)
          .single();

        if (subscription) {
          // Registrar pagamento
          await supabase
            .from('payments')
            .insert([{
              business_id: subscription.business_id,
              subscription_id: subscription.id,
              mp_payment_id: authorizedPaymentId,
              status: paymentStatus,
              amount_cents: Math.round(amount * 100),
              payment_method: 'subscription',
              paid_at: paymentStatus === 'approved' ? new Date().toISOString() : null,
            }]);

          // Atualizar assinatura para 'active' e calcular next_charge_at
          if (paymentStatus === 'approved') {
            const nextCharge = new Date();
            nextCharge.setMonth(nextCharge.getMonth() + 1);

            await supabase
              .from('subscriptions')
              .update({
                status: 'active',
                next_charge_at: nextCharge.toISOString(),
              })
              .eq('id', subscription.id);

            console.log(`✅ Pagamento ${authorizedPaymentId} registrado e assinatura ${subscription.id} ativada`);
          }
        }
      }
    }

    // Webhook de mudanças no preapproval (paused, cancelled, etc)
    if (type === 'preapproval' && data?.id) {
      const preapprovalId = data.id;
      
      console.log('📋 Atualização de preapproval:', preapprovalId);
      
      // Consultar detalhes do preapproval
      const response = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('❌ Erro ao consultar preapproval:', response.statusText);
        return res.status(200).json({ received: true });
      }

      const preapproval = await response.json();
      console.log('📄 Detalhes do preapproval:', preapproval);

      const status = preapproval.status;

      // Atualizar status da assinatura no banco
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ status: status })
        .eq('preapproval_id', preapprovalId);

      if (!updateError) {
        console.log(`✅ Assinatura ${preapprovalId} atualizada para: ${status}`);
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
