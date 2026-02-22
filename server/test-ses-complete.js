#!/usr/bin/env node

/**
 * 🧪 TESTE COMPLETO AWS SES
 * 
 * Script interativo para testar o envio de e-mails via AWS SES
 * com diferentes tipos de e-mails (confirmação, notificação, etc)
 */

import 'dotenv/config';
import readline from 'readline';
import { sendEmail, sendNewSubscriptionNotification, sendSubscriptionConfirmationToCustomer } from './services/sesEmailService.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

// ───────────────────────────────────────────────────────────────────────────
// MAIN
// ───────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║       🧪 TESTE COMPLETO AWS SES - EXPLORE APARECIDA           ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // Validar ambiente
  const required = ['AWS_REGION', 'EMAIL_FROM', 'ADMIN_EMAIL'];
  const missing = required.filter(k => !process.env[k]);

  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente faltando:');
    missing.forEach(k => console.error(`   - ${k}`));
    console.error('\nAdicione no .env e tente novamente.\n');
    process.exit(1);
  }

  console.log('✅ Variáveis de ambiente: OK\n');

  // Menu
  console.log('Escolha um tipo de teste:\n');
  console.log('  1️⃣  E-mail de teste simples');
  console.log('  2️⃣  Notificação de nova assinatura (admin)');
  console.log('  3️⃣  Confirmação de assinatura (cliente)');
  console.log('  4️⃣  E-mail customizado\n');

  const choice = await ask('Opcão (1-4): ');

  switch (choice.trim()) {
    case '1':
      await testSimpleEmail();
      break;
    case '2':
      await testAdminNotification();
      break;
    case '3':
      await testCustomerConfirmation();
      break;
    case '4':
      await testCustomEmail();
      break;
    default:
      console.log('❌ Opção inválida\n');
  }

  rl.close();
}

// ───────────────────────────────────────────────────────────────────────────
// TESTE 1: E-mail Simples
// ───────────────────────────────────────────────────────────────────────────

async function testSimpleEmail() {
  console.log('\n📧 TESTE 1: E-MAIL DE TESTE SIMPLES\n');

  const email = await ask('Seu e-mail de destino: ').catch(() => 'seu@email.com');

  if (!email) {
    console.log('❌ E-mail inválido\n');
    return;
  }

  console.log('\n🚀 Enviando e-mail de teste...\n');

  const result = await sendEmail({
    to: email,
    subject: '🧪 E-mail de Teste — Explore Aparecida',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2>🧪 E-mail de Teste</h2>
        <p>Se você recebeu este e-mail, significa que AWS SES está funcionando corretamente!</p>
        <p>
          <strong>Informações:</strong><br/>
          Data/Hora: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}<br/>
          Remetente: ${process.env.EMAIL_FROM}
        </p>
        <p style="color:#666;font-size:12px;">Este é um e-mail de teste automático.</p>
      </div>
    `,
    text: `E-mail de teste — Se você recebeu isto, AWS SES está OK!`
  });

  if (result.success) {
    console.log('✅ E-MAIL ENVIADO COM SUCESSO!\n');
    console.log(`   MessageId: ${result.messageId}`);
    console.log(`   Para: ${email}`);
    console.log(`   Remetente: ${process.env.EMAIL_FROM}\n`);
    console.log('💡 Verifique sua caixa de entrada (ou spam) em poucos segundos!\n');
  } else {
    console.log('❌ ERRO AO ENVIAR\n');
    console.log(`   Erro: ${result.error}\n`);
    console.log('🔍 Dicas de resolução:');
    console.log('   1. Rodou diagnose:ses? npm run diagnose:ses');
    console.log('   2. E-mail de origem verificado no SES?');
    console.log('   3. Você tem permissões SES na sua conta AWS?\n');
  }
}

// ───────────────────────────────────────────────────────────────────────────
// TESTE 2: Notificação Admin
// ───────────────────────────────────────────────────────────────────────────

async function testAdminNotification() {
  console.log('\n📧 TESTE 2: NOTIFICAÇÃO DE NOVA ASSINATURA (ADMIN)\n');

  const businessName = await ask('Nome do estabelecimento (padrão: "Pizza Express"): ') || 'Pizza Express';
  const businessEmail = await ask('E-mail do estabelecimento (padrão: "pizza@example.com"): ') || 'pizza@example.com';
  const planName = await ask('Nome do plano (padrão: "Plano Pro"): ') || 'Plano Pro';
  const planPrice = await ask('Preço do plano (padrão: 29.90): ') || '29.90';

  console.log('\n🚀 Enviando notificação ao admin...\n');

  const result = await sendNewSubscriptionNotification({
    businessName,
    businessEmail,
    planName,
    planPrice: Math.round(parseFloat(planPrice) * 100), // Converter para centavos
    subscriptionId: `sub_test_${Date.now()}`,
    customerEmail: businessEmail
  });

  if (result.success) {
    console.log('✅ NOTIFICAÇÃO ENVIADA COM SUCESSO!\n');
    console.log(`   MessageId: ${result.messageId}`);
    console.log(`   Para: ${process.env.ADMIN_EMAIL}`);
    console.log(`   Estabelecimento: ${businessName}`);
    console.log(`   Plano: ${planName}\n`);
    console.log('💡 Verifique o inbox do admin em poucos segundos!\n');
  } else {
    console.log('❌ ERRO AO ENVIAR\n');
    console.log(`   Erro: ${result.error}\n`);
  }
}

// ───────────────────────────────────────────────────────────────────────────
// TESTE 3: Confirmação Cliente
// ───────────────────────────────────────────────────────────────────────────

async function testCustomerConfirmation() {
  console.log('\n📧 TESTE 3: CONFIRMAÇÃO DE ASSINATURA (CLIENTE)\n');

  const customerEmail = await ask('E-mail do cliente: ');
  
  if (!customerEmail) {
    console.log('❌ E-mail inválido\n');
    return;
  }

  const businessName = await ask('Nome do estabelecimento (padrão: "Meu Restaurante"): ') || 'Meu Restaurante';
  const planName = await ask('Nome do plano (padrão: "Plano Básico"): ') || 'Plano Básico';
  const planPrice = await ask('Preço do plano (padrão: 19.90): ') || '19.90';

  console.log('\n🚀 Enviando confirmação ao cliente...\n');

  const result = await sendSubscriptionConfirmationToCustomer({
    customerEmail,
    businessName,
    planName,
    planPrice: Math.round(parseFloat(planPrice) * 100),
    nextChargeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });

  if (result.success) {
    console.log('✅ CONFIRMAÇÃO ENVIADA COM SUCESSO!\n');
    console.log(`   MessageId: ${result.messageId}`);
    console.log(`   Para: ${customerEmail}`);
    console.log(`   Plano: ${planName}\n`);
    console.log('💡 O cliente deve receber o e-mail em poucos segundos!\n');
  } else {
    console.log('❌ ERRO AO ENVIAR\n');
    console.log(`   Erro: ${result.error}\n`);
  }
}

// ───────────────────────────────────────────────────────────────────────────
// TESTE 4: E-mail Customizado
// ───────────────────────────────────────────────────────────────────────────

async function testCustomEmail() {
  console.log('\n📧 TESTE 4: E-MAIL CUSTOMIZADO\n');

  const to = await ask('E-mail de destino: ');
  const subject = await ask('Assunto: ');
  const text = await ask('Corpo (texto simples): ');

  if (!to || !subject || !text) {
    console.log('❌ Dados incompletos\n');
    return;
  }

  console.log('\n🚀 Enviando e-mail customizado...\n');

  const result = await sendEmail({
    to,
    subject,
    html: `<p>${text.replace(/\n/g, '<br/>')}</p>`,
    text
  });

  if (result.success) {
    console.log('✅ E-MAIL ENVIADO COM SUCESSO!\n');
    console.log(`   MessageId: ${result.messageId}`);
    console.log(`   Para: ${to}\n`);
  } else {
    console.log('❌ ERRO AO ENVIAR\n');
    console.log(`   Erro: ${result.error}\n`);
  }
}

// ───────────────────────────────────────────────────────────────────────────
// RUN
// ───────────────────────────────────────────────────────────────────────────

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
