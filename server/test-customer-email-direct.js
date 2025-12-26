import dotenv from 'dotenv';
import { sendSubscriptionConfirmationToCustomer } from './services/emailService.js';

dotenv.config();

console.log('🔍 Testando envio direto ao cliente...\n');

sendSubscriptionConfirmationToCustomer({
  customerEmail: 'lucasmoraesn@hotmail.com',
  businessName: 'Restaurante Teste Direto',
  planName: 'Plano Premium',
  planPrice: 4900,
  nextChargeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
})
.then(result => {
  console.log('\n📊 RESULTADO COMPLETO:');
  console.log(JSON.stringify(result, null, 2));
  
  if (result.success) {
    console.log('\n✅ E-mail enviado com sucesso!');
    console.log('   Verifique: lucasmoraesn@hotmail.com');
  } else {
    console.log('\n❌ Falha no envio:', result.error);
  }
})
.catch(error => {
  console.error('\n❌ Erro:', error);
});
