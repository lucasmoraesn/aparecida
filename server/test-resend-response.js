import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

console.log('🔍 Teste de resposta do Resend...\n');

resend.emails.send({
  from: 'Explore Aparecida <onboarding@resend.dev>',
  to: 'lucasmoraesn@hotmail.com',
  subject: 'Teste de Estrutura de Resposta',
  html: '<p>Testando a estrutura da resposta do Resend</p>'
})
.then(result => {
  console.log('📊 RESPOSTA COMPLETA DO RESEND:');
  console.log(JSON.stringify(result, null, 2));
  console.log('\n📋 Estrutura:');
  console.log('  result:', typeof result);
  console.log('  result.data:', result.data);
  console.log('  result.id:', result.id);
  console.log('  result.data?.id:', result.data?.id);
})
.catch(error => {
  console.error('❌ Erro:', error);
});
