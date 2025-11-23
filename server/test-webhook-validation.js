import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: "2024-06-20"
});

console.log('🧪 TESTE DE VALIDAÇÃO DO WEBHOOK\n');

// Simular payload e assinatura
const payload = JSON.stringify({
  id: 'evt_test_webhook',
  object: 'event',
  type: 'checkout.session.completed'
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

console.log('📋 Configuração:');
console.log('   STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Configurada' : '❌ FALTA');
console.log('   STRIPE_WEBHOOK_SECRET:', webhookSecret ? '✅ Configurada' : '❌ FALTA');
console.log('   Valor:', webhookSecret);

if (!webhookSecret) {
  console.error('\n❌ STRIPE_WEBHOOK_SECRET não configurado no .env!');
  process.exit(1);
}

if (!webhookSecret.startsWith('whsec_')) {
  console.error('\n⚠️ STRIPE_WEBHOOK_SECRET parece inválido!');
  console.error('   Deve começar com "whsec_"');
  console.error('   Valor atual:', webhookSecret);
  process.exit(1);
}

console.log('\n✅ Configuração válida!');
console.log('\n💡 PRÓXIMOS PASSOS:');
console.log('1. Certifique-se que ngrok está rodando:');
console.log('   ngrok http 3001');
console.log('\n2. Configure o webhook no Stripe Dashboard:');
console.log('   URL: https://seu-ngrok-url/api/webhook');
console.log('   Eventos: checkout.session.completed, customer.subscription.deleted,');
console.log('            invoice.payment_succeeded, invoice.payment_failed');
console.log('\n3. Copie o Signing Secret do Dashboard e cole no .env');
console.log('\n4. Reinicie o servidor: npm start');
