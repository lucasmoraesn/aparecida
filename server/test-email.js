/**
 * 🧪 SCRIPT DE TESTE - E-MAIL SERVICE
 * 
 * Este script testa o envio de e-mails usando o Resend.
 * 
 * COMO USAR:
 * 1. Certifique-se de que o .env está configurado com:
 *    - RESEND_API_KEY
 *    - FROM_EMAIL (opcional, usa onboarding@resend.dev por padrão)
 *    - ADMIN_EMAIL (e-mail que receberá as notificações)
 * 
 * 2. Execute: node test-email.js
 * 
 * MODOS DE TESTE:
 * - node test-email.js              → Envia e-mail de teste simples
 * - node test-email.js notification → Simula notificação de nova assinatura
 */

import dotenv from 'dotenv';
import { sendTestEmail, sendNewSubscriptionNotification, sendSubscriptionConfirmationToCustomer } from './services/emailService.js';

dotenv.config();

// Cores para o terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, icon, message) {
  console.log(`${color}${icon} ${message}${colors.reset}`);
}

async function validateEnvironment() {
  log(colors.cyan, '🔍', 'Validando configurações de ambiente...\n');
  
  const configs = [
    { key: 'RESEND_API_KEY', value: process.env.RESEND_API_KEY, required: true },
    { key: 'FROM_EMAIL', value: process.env.FROM_EMAIL, required: false },
    { key: 'ADMIN_EMAIL', value: process.env.ADMIN_EMAIL, required: true }
  ];

  let hasErrors = false;

  configs.forEach(({ key, value, required }) => {
    if (value) {
      const displayValue = key === 'RESEND_API_KEY' 
        ? value.substring(0, 10) + '...' 
        : value;
      log(colors.green, '✓', `${key}: ${displayValue}`);
    } else {
      if (required) {
        log(colors.red, '✗', `${key}: NÃO CONFIGURADA (OBRIGATÓRIA)`);
        hasErrors = true;
      } else {
        log(colors.yellow, '⚠', `${key}: Não configurada (usando padrão)`);
      }
    }
  });

  console.log('');

  if (hasErrors) {
    log(colors.red, '❌', 'Erro: Variáveis obrigatórias não configuradas!');
    log(colors.yellow, '💡', 'Configure o arquivo .env antes de continuar.');
    process.exit(1);
  }

  log(colors.green, '✅', 'Ambiente configurado corretamente!\n');
}

async function testSimpleEmail() {
  log(colors.magenta, '📧', 'TESTE 1: E-mail Simples de Validação\n');
  
  const recipient = process.env.ADMIN_EMAIL || process.env.CUSTOMER_TEST_EMAIL;
  
  if (!recipient) {
    log(colors.red, '❌', 'Nenhum e-mail de destino configurado!');
    return;
  }

  log(colors.blue, '→', `Enviando e-mail de teste para: ${recipient}`);
  
  const result = await sendTestEmail(recipient);
  
  if (result.success) {
    log(colors.green, '✅', 'E-mail de teste enviado com sucesso!');
    log(colors.cyan, 'ℹ', `Email ID: ${result.emailId}`);
    log(colors.yellow, '📬', 'Verifique sua caixa de entrada (e spam também)');
  } else {
    log(colors.red, '❌', 'Falha ao enviar e-mail:');
    console.error(result.error);
  }
}

async function testSubscriptionNotification() {
  log(colors.magenta, '📧', 'TESTE 2: Notificação de Nova Assinatura (ADMIN)\n');
  
  log(colors.blue, '→', 'Simulando dados de uma nova assinatura...');
  
  const mockData = {
    businessName: 'Restaurante Teste LTDA',
    businessEmail: 'contato@restauranteteste.com.br',
    planName: 'Plano Premium',
    planPrice: 4900, // R$ 49,00 em centavos
    subscriptionId: 'sub_test_' + Date.now(),
    customerEmail: 'cliente@email.com'
  };

  log(colors.cyan, 'ℹ', 'Dados da simulação:');
  console.log('   Estabelecimento:', mockData.businessName);
  console.log('   Plano:', mockData.planName);
  console.log('   Valor: R$', (mockData.planPrice / 100).toFixed(2));
  console.log('');

  const result = await sendNewSubscriptionNotification(mockData);
  
  if (result.success) {
    log(colors.green, '✅', 'Notificação enviada ao admin com sucesso!');
    log(colors.cyan, 'ℹ', `Email ID: ${result.emailId}`);
    log(colors.cyan, 'ℹ', `Destinatário: ${result.recipient}`);
    log(colors.yellow, '📬', 'Verifique sua caixa de entrada (e spam também)');
  } else {
    log(colors.red, '❌', 'Falha ao enviar notificação:');
    console.error(result.error);
  }
}

async function testCustomerConfirmation() {
  log(colors.magenta, '📧', 'TESTE 3: E-mail de Confirmação (CLIENTE)\n');
  
  log(colors.blue, '→', 'Simulando e-mail de boas-vindas ao cliente...');
  
  const mockData = {
    customerEmail: process.env.CUSTOMER_TEST_EMAIL || process.env.ADMIN_EMAIL,
    businessName: 'Restaurante Bella Vista',
    planName: 'Plano Premium',
    planPrice: 4900,
    nextChargeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  log(colors.cyan, 'ℹ', 'Dados da simulação:');
  console.log('   Cliente:', mockData.businessName);
  console.log('   E-mail:', mockData.customerEmail);
  console.log('   Plano:', mockData.planName);
  console.log('   Valor: R$', (mockData.planPrice / 100).toFixed(2));
  console.log('');

  const result = await sendSubscriptionConfirmationToCustomer(mockData);
  
  if (result.success) {
    log(colors.green, '✅', 'E-mail de confirmação enviado ao cliente com sucesso!');
    log(colors.cyan, 'ℹ', `Email ID: ${result.emailId}`);
    log(colors.cyan, 'ℹ', `Destinatário: ${result.recipient}`);
    log(colors.yellow, '📬', 'Verifique a caixa de entrada do cliente (e spam)');
  } else {
    log(colors.red, '❌', 'Falha ao enviar e-mail ao cliente:');
    console.error(result.error);
  }
}

async function runTests() {
  console.log('\n');
  log(colors.bright + colors.cyan, '╔══════════════════════════════════════════════╗', '');
  log(colors.bright + colors.cyan, '║', '  🧪 TESTE DE E-MAIL - RESEND SERVICE       ║');
  log(colors.bright + colors.cyan, '╚══════════════════════════════════════════════╝', '');
  console.log('\n');

  try {
    // 1. Validar ambiente
    await validateEnvironment();

    // 2. Determinar modo de teste
    const mode = process.argv[2];

    if (mode === 'notification') {
      await testSubscriptionNotification();
    } else if (mode === 'customer') {
      await testCustomerConfirmation();
    } else if (mode === 'all') {
      await testSimpleEmail();
      console.log('\n' + '─'.repeat(50) + '\n');
      await testSubscriptionNotification();
      console.log('\n' + '─'.repeat(50) + '\n');
      await testCustomerConfirmation();
    } else {
      await testSimpleEmail();
    }

    console.log('\n');
    log(colors.green, '✅', 'Testes concluídos!');
    console.log('\n');
    log(colors.yellow, '💡', 'DICAS:');
    console.log('   • Verifique sua caixa de spam se não receber');
    console.log('   • Use "node test-email.js notification" para testar notificação admin');
    console.log('   • Use "node test-email.js customer" para testar e-mail do cliente');
    console.log('   • Use "node test-email.js all" para testar todos os e-mails');
    console.log('\n');

  } catch (error) {
    log(colors.red, '❌', 'Erro durante os testes:');
    console.error(error);
    process.exit(1);
  }
}

// Executar testes
runTests();
