/**
 * 🧪 Teste de envio via Amazon SES com IAM Role (AWS SDK v3)
 * Roda na EC2: node test-ses.js seu@email.com
 */

import 'dotenv/config';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const recipient = process.argv[2] || 'aparecidatoursp@hotmail.com';

console.log('\n🚀 Testando Amazon SES com IAM Role da EC2...');
console.log(`   Região  : us-east-2`);
console.log(`   Para    : ${recipient}`);
console.log(`   Auth    : IAM Role (sem credenciais no .env)\n`);

const ses = new SESClient({ region: 'us-east-2' });

const command = new SendEmailCommand({
    Source: process.env.EMAIL_FROM || 'noreply@aparecidadonortesp.com.br',
    Destination: { ToAddresses: [recipient] },
    Message: {
        Subject: { Data: '✅ Teste SES — IAM Role EC2 funcionando!', Charset: 'UTF-8' },
        Body: {
            Text: { Data: 'E-mail enviado com sucesso usando IAM Role na EC2, sem AWS_ACCESS_KEY ou SECRET_KEY.', Charset: 'UTF-8' },
        },
    },
});

try {
    const response = await ses.send(command);
    console.log('✅ E-mail enviado com sucesso!');
    console.log(`   MessageId: ${response.MessageId}`);
} catch (err) {
    console.error('❌ Erro:', err.message);
    if (err.name === 'CredentialsProviderError') {
        console.error('   → IAM Role não encontrada. Verifique se a role está atribuída à instância EC2.');
    } else if (err.name === 'MessageRejected') {
        console.error('   → E-mail rejeitado. Verifique se o domínio está verificado no SES.');
        console.error('   → Se estiver em sandbox, o destinatário também precisa ser verificado.');
    }
    process.exit(1);
}
