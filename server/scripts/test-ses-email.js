/**
 * 🧪 SCRIPT DE TESTE — Amazon SES com IAM Role
 *
 * Executa um envio de e-mail de teste sem iniciar o servidor Express.
 * Usa a IAM Role da EC2 para autenticação — sem credenciais no .env.
 *
 * Uso (na instância EC2):
 *   node scripts/test-ses-email.js seu@email.com
 *
 * Pré-requisito: variáveis de ambiente configuradas no server/.env
 *   - AWS_REGION=us-east-2
 *   - EMAIL_FROM=noreply@aparecidadonortesp.com.br
 */

import 'dotenv/config';
import { sendTestEmail } from '../services/sesEmailService.js';

const recipient = process.argv[2];

if (!recipient) {
    console.error('❌ Informe o e-mail de destino como argumento.');
    console.error('   Uso: node scripts/test-ses-email.js seu@email.com');
    process.exit(1);
}

// Validação das variáveis de ambiente (sem credenciais AWS — usa IAM Role)
const required = ['AWS_REGION', 'EMAIL_FROM'];
const missing = required.filter(k => !process.env[k]);

if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente faltando no .env:');
    missing.forEach(k => console.error(`   - ${k}`));
    process.exit(1);
}

console.log('');
console.log('🚀 Iniciando teste de envio via Amazon SES (IAM Role)...');
console.log(`   Remetente   : ${process.env.EMAIL_FROM}`);
console.log(`   Destinatário: ${recipient}`);
console.log(`   Região AWS  : ${process.env.AWS_REGION}`);
console.log(`   Autenticação: IAM Role da EC2 (automática)`);
console.log('');

try {
    const result = await sendTestEmail(recipient);

    if (result.success) {
        console.log('✅ E-mail de teste enviado com sucesso!');
        console.log(`   MessageId: ${result.messageId}`);
        console.log('');
        console.log('📬 Verifique sua caixa de entrada (e a pasta de spam).');
    } else {
        console.error('❌ Falha ao enviar e-mail:', result.error);
        console.error('');
        console.error('Dicas de diagnóstico:');
        console.error('  1. Verifique se a IAM Role da EC2 tem permissão ses:SendEmail');
        console.error('  2. Verifique se o domínio está verificado no SES (us-east-2)');
        console.error('  3. Se estiver em sandbox, o destinatário também precisa ser verificado');
        console.error('  4. Confirme que EMAIL_FROM usa um endereço verificado no SES');
        process.exit(1);
    }
} catch (err) {
    console.error('❌ Erro inesperado:', err.message);
    process.exit(1);
}
