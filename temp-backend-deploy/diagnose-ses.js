#!/usr/bin/env node

/**
 * 🔍 DIAGNOSTIC SCRIPT — AWS SES
 * 
 * Verifica todos os pré-requisitos necessários para enviar e-mails via SES
 */

import 'dotenv/config';
import { SESClient, GetAccountSendingEnabledCommand, ListVerifiedEmailAddressesCommand, GetSendQuotaCommand } from '@aws-sdk/client-ses';

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║           🔍 DIAGNÓSTICO AWS SES - EXPLORE APARECIDA           ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// ───────────────────────────────────────────────────────────────────────────
// 1. Verificar variáveis de ambiente
// ───────────────────────────────────────────────────────────────────────────

console.log('📋 PASSO 1: Variáveis de Ambiente');
console.log('─'.repeat(60));

const requiredEnvVars = {
  'AWS_REGION': process.env.AWS_REGION,
  'EMAIL_FROM': process.env.EMAIL_FROM,
  'ADMIN_EMAIL': process.env.ADMIN_EMAIL,
};

let envOk = true;
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: ${value}`);
  } else {
    console.log(`❌ ${key}: NÃO CONFIGURADO`);
    envOk = false;
  }
});

if (!envOk) {
  console.log('\n⚠️  Adicione as variáveis faltando no .env\n');
  process.exit(1);
}

// ───────────────────────────────────────────────────────────────────────────
// 2. Verificar acesso ao AWS
// ───────────────────────────────────────────────────────────────────────────

console.log('\n📋 PASSO 2: Conectando ao AWS SES...');
console.log('─'.repeat(60));

let sesClient;
try {
  sesClient = new SESClient({
    region: process.env.AWS_REGION,
  });
  console.log(`✅ Cliente SES criado para região: ${process.env.AWS_REGION}`);
} catch (err) {
  console.error('❌ Erro ao criar cliente SES:', err.message);
  console.log('\n💡 DICA: Verifique se você tem credenciais AWS configuradas');
  console.log('   - Na EC2: IAM Role deve estar attachado');
  console.log('   - Localmente: AWS CLI com credenciais ou variáveis de env');
  console.log('   - Docker: Variáveis AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY\n');
  process.exit(1);
}

// ───────────────────────────────────────────────────────────────────────────
// 3. Verificar sending enabled
// ───────────────────────────────────────────────────────────────────────────

console.log('\n📋 PASSO 3: Verificando se SES está habilitado...');
console.log('─'.repeat(60));

try {
  const enabledResponse = await sesClient.send(new GetAccountSendingEnabledCommand({}));
  console.log(`✅ SES Habilitado: ${enabledResponse.Enabled ? 'SIM' : 'NÃO'}`);
  
  if (!enabledResponse.Enabled) {
    console.log('❌ SES NÃO ESTÁ HABILITADO NESTA CONTA');
    console.log('   Vá para: https://us-east-2.console.aws.amazon.com/ses/\n');
  }
} catch (err) {
  console.error('❌ Erro ao verificar sending enabled:', err.message);
  console.log('⚠️  Pode ser um problema de permissões IAM\n');
}

// ───────────────────────────────────────────────────────────────────────────
// 4. Listar endereços verificados
// ───────────────────────────────────────────────────────────────────────────

console.log('\n📋 PASSO 4: Endereços verificados no SES');
console.log('─'.repeat(60));

try {
  const verifiedResponse = await sesClient.send(new ListVerifiedEmailAddressesCommand({}));
  const verified = verifiedResponse.VerifiedEmailAddresses || [];
  
  console.log(`Total de endereços verificados: ${verified.length}`);
  
  if (verified.length === 0) {
    console.log('❌ NENHUM ENDEREÇO VERIFICADO NO SES!');
    console.log('\n💡 PARA RESOLVER:');
    console.log('   1. Vá para: https://us-east-2.console.aws.amazon.com/ses/');
    console.log('   2. Clique em "Verified identities" (ou "Verified email addresses")');
    console.log('   3. Clique em "Create identity" (ou "Verify a New Email Address")');
    console.log('   4. Adicione: noreply@aparecidadonortesp.com.br');
    console.log('   5. Confirme o link no seu e-mail\n');
  } else {
    verified.forEach(email => {
      const isFrom = email === process.env.EMAIL_FROM.match(/<(.+)>/)?.[1] || process.env.EMAIL_FROM;
      const status = isFrom ? '✅ EMAIL_FROM' : '⚠️ ';
      console.log(`   ${status} ${email}`);
    });
  }
} catch (err) {
  console.error('❌ Erro ao listar endereços verificados:', err.message);
}

// ───────────────────────────────────────────────────────────────────────────
// 5. Verificar quota de envio
// ───────────────────────────────────────────────────────────────────────────

console.log('\n📋 PASSO 5: Quota de envio (Sandbox ou Produção)');
console.log('─'.repeat(60));

try {
  const quotaResponse = await sesClient.send(new GetSendQuotaCommand({}));
  
  console.log(`Max 24h emails     : ${quotaResponse.Max24HourSend || 'N/A'}`);
  console.log(`Max rate (por seg)  : ${quotaResponse.MaxSendRate || 'N/A'}`);
  console.log(`Enviados nas 24h    : ${quotaResponse.Sent24Hour || 'N/A'}`);
  
  if ((quotaResponse.Max24HourSend || 0) <= 200) {
    console.log('\n⚠️  ESTÁ EM SANDBOX MODE!');
    console.log('   Limite: ~200 e-mails por dia');
    console.log('   Solução: Requerer acesso à produção via console AWS');
  } else {
    console.log('\n✅ MODO PRODUÇÃO ATIVADO!');
  }
} catch (err) {
  console.error('❌ Erro ao verificar quota:', err.message);
}

// ───────────────────────────────────────────────────────────────────────────
// 6. Resumo e próximos passos
// ───────────────────────────────────────────────────────────────────────────

console.log('\n' + '═'.repeat(60));
console.log('📋 RESUMO DO DIAGNÓSTICO');
console.log('═'.repeat(60) + '\n');

console.log('✅ Se tudo passou acima:');
console.log('   npm run test-email seu@email.com\n');

console.log('❌ Se algo falhou:');
console.log('   1. Verifique as mensagens de erro acima');
console.log('   2. Vá para: https://us-east-2.console.aws.amazon.com/ses/');
console.log('   3. Verifique se o domínio está verificado');
console.log('   4. Se estiver em Sandbox, saia dele\n');

console.log('Para mais ajuda:');
console.log('   - AWS SES Docs: https://docs.aws.amazon.com/ses/');
console.log('   - Console AWS: https://us-east-2.console.aws.amazon.com/ses/\n');

process.exit(0);
