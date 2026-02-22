#!/usr/bin/env node

/**
 * 🧪 SIMULAR PAGAMENTO COMPLETO
 * 
 * Simula um webhook de checkout.session.completed do Stripe
 * para testar o fluxo completo de pagamento + e-mail
 * 
 * Uso:
 *   node simulate-payment.js <business_id>
 * 
 * Exemplo:
 *   node simulate-payment.js 550e8400-e29b-41d4-a716-446655440000
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { sendNewSubscriptionNotification, sendSubscriptionConfirmationToCustomer } from './services/sesEmailService.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function simulate() {
  const businessId = process.argv[2];

  if (!businessId) {
    console.log('\n❌ Uso: node simulate-payment.js <business_id>\n');
    console.log('Exemplos:');
    console.log('  node simulate-payment.js 550e8400-e29b-41d4-a716-446655440000\n');
    process.exit(1);
  }

  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║       🧪 SIMULAÇÃO DE PAGAMENTO - EXPLORE APARECIDA           ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log(`🔍 Buscando estabelecimento com ID: ${businessId}\n`);

  try {
    // 1. Buscar estabelecimento
    const { data: business, error: businessError } = await supabase
      .from('business_registrations')
      .select('id, establishment_name, contact_email, whatsapp')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      console.error('❌ Estabelecimento não encontrado:\n', businessError);
      process.exit(1);
    }

    console.log('✅ Estabelecimento encontrado:');
    console.log(`   Nome: ${business.establishment_name}`);
    console.log(`   E-mail: ${business.contact_email}`);
    console.log(`   WhatsApp: ${business.whatsapp}\n`);

    // 2. Buscar planos disponíveis
    console.log('🔍 Buscando planos disponíveis...\n');

    const { data: plans, error: plansError } = await supabase
      .from('business_plans')
      .select('id, name, price')
      .eq('status', 'active')
      .limit(5);

    if (plansError || !plans || plans.length === 0) {
      console.error('❌ Nenhum plano ativo encontrado:\n', plansError);
      process.exit(1);
    }

    console.log('✅ Planos disponíveis:');
    plans.forEach((plan, idx) => {
      console.log(`   ${idx + 1}. ${plan.name} - R$ ${(plan.price).toFixed(2)}`);
    });
    console.log('');

    // Para teste, usar o primeiro plano
    const selectedPlan = plans[0];
    console.log(`📦 Usando plano: ${selectedPlan.name} (R$ ${(selectedPlan.price).toFixed(2)})\n`);

    // 3. Criar assinatura simulada
    console.log('📝 Criando assinatura simulada...\n');

    const stripeCheckoutSessionId = `cs_test_${Date.now()}`;
    const stripeCustomerId = `cus_test_${Date.now()}`;
    const externalSubscriptionId = `sub_test_${Date.now()}`;

    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert([
        {
          business_id: businessId,
          plan_id: selectedPlan.id,
          stripe_checkout_session_id: stripeCheckoutSessionId,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (subscriptionError || !subscription) {
      console.error('❌ Erro ao criar assinatura:\n', subscriptionError);
      process.exit(1);
    }

    console.log('✅ Assinatura criada:');
    console.log(`   ID: ${subscription.id}`);
    console.log(`   Status: ${subscription.status}`);
    console.log(`   Checkout Session: ${stripeCheckoutSessionId}\n`);

    // 4. Simular webhook - atualizar assinatura
    console.log('🔔 Simulando webhook checkout.session.completed...\n');

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        external_subscription_id: externalSubscriptionId,
        stripe_customer_id: stripeCustomerId,
        status: 'active',
        next_charge_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('❌ Erro ao atualizar assinatura:\n', updateError);
      process.exit(1);
    }

    console.log('✅ Assinatura ATIVADA!\n');

    // 5. Enviar e-mails
    console.log('📧 Enviando notificações por e-mail...\n');

    // E-mail para admin
    console.log('   1️⃣  E-mail ao ADMIN...');
    const adminResult = await sendNewSubscriptionNotification({
      businessName: business.establishment_name,
      businessEmail: business.contact_email,
      planName: selectedPlan.name,
      planPrice: Math.round(selectedPlan.price * 100),
      subscriptionId: subscription.id,
      customerEmail: business.contact_email
    });

    if (adminResult.success) {
      console.log(`      ✅ Enviado (MessageId: ${adminResult.messageId})\n`);
    } else {
      console.log(`      ❌ Erro: ${adminResult.error}\n`);
    }

    // E-mail para cliente
    console.log('   2️⃣  E-mail ao CLIENTE...');
    const customerResult = await sendSubscriptionConfirmationToCustomer({
      customerEmail: business.contact_email,
      businessName: business.establishment_name,
      planName: selectedPlan.name,
      planPrice: Math.round(selectedPlan.price * 100),
      nextChargeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    if (customerResult.success) {
      console.log(`      ✅ Enviado (MessageId: ${customerResult.messageId})\n`);
    } else {
      console.log(`      ❌ Erro: ${customerResult.error}\n`);
    }

    // 6. Resumo
    console.log('═'.repeat(60));
    console.log('✅ SIMULAÇÃO CONCLUÍDA COM SUCESSO!\n');
    console.log('Resumo do que foi feito:');
    console.log(`  ✓ Criada assinatura para: ${business.establishment_name}`);
    console.log(`  ✓ Plano: ${selectedPlan.name} (R$ ${(selectedPlan.price).toFixed(2)})`);
    console.log(`  ✓ E-mail ao admin: ${process.env.ADMIN_EMAIL}`);
    console.log(`  ✓ E-mail ao cliente: ${business.contact_email}\n`);
    console.log('💡 Verifique os e-mails em poucos segundos!\n');

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
    process.exit(1);
  }
}

simulate();
