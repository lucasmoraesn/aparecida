/**
 * 🧪 SCRIPT DE TESTE — Resend
 *
 * Testa o envio de e-mails via Resend sem iniciar o servidor Express.
 *
 * Uso:
 *   node test-email.js seu@email.com
 *
 * Variáveis de ambiente necessárias no .env:
 *   RESEND_API_KEY=re_seu_api_key
 *   RESEND_FROM=Explore Aparecida <noreply@aparecidadonortesp.com.br>
 */

import 'dotenv/config';
import { sendTestEmail } from './services/emailService.js';

const recipient = process.argv[2];

if (!recipient) {
  console.error('❌ Informe o e-mail de destino como argumento.');
  console.error('   Uso: node test-email.js seu@email.com');
  process.exit(1);
}

// Validação das variáveis de ambiente
const required = ['RESEND_API_KEY', 'RESEND_FROM'];
const missing = required.filter(k => !process.env[k]);

if (missing.length > 0) {
  console.error('\n❌ Variáveis de ambiente faltando:');
  missing.forEach(k => console.error(`   - ${k}`));
  console.error('\nConfigure no .env e tente novamente.\n');
  process.exit(1);
}

console.log('\n🧪 Testando envio de e-mail via Resend...\n');
console.log(`   Para: ${recipient}`);
console.log(`   De: ${process.env.RESEND_FROM}\n`);

try {
  const result = await sendTestEmail(recipient);
  
  if (result.success) {
    console.log('\n✅ E-mail enviado com sucesso!');
    console.log(`   MessageId: ${result.messageId}\n`);
    console.log('📬 Verifique sua caixa de entrada (e a pasta de spam).\n');
    process.exit(0);
  } else {
    console.error('\n❌ Falha ao enviar e-mail:');
    console.error(`   ${result.error}\n`);
    process.exit(1);
  }
} catch (err) {
  console.error('\n❌ Erro ao enviar e-mail:');
  console.error(`   ${err.message}\n`);
  process.exit(1);
}
