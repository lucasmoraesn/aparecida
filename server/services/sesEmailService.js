/**
 * 📧 SES EMAIL SERVICE — Amazon SES (AWS SDK v3)
 *
 * Serviço centralizado para envio de e-mails usando Amazon SES.
 *
 * Autenticação: IAM Role da instância EC2 (sem credenciais no .env).
 * O SDK AWS detecta automaticamente as credenciais via Instance Metadata Service (IMDS).
 *
 * Variável de ambiente necessária:
 *   AWS_REGION   — Região do SES (us-east-2)
 *   EMAIL_FROM   — Endereço verificado no SES
 *                  Ex: "Explore Aparecida <noreply@aparecidadonortesp.com.br>"
 *
 * Permissões IAM necessárias na Role da EC2:
 *   - ses:SendEmail
 *   - ses:SendRawEmail
 */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// ─────────────────────────────────────────────────────────────────────────────
// Singleton do cliente SES
// Sem credenciais explícitas — usa IAM Role da EC2 automaticamente
// ─────────────────────────────────────────────────────────────────────────────

let _sesClient = null;

function getSESClient() {
    if (!_sesClient) {
        _sesClient = new SESClient({
            region: process.env.AWS_REGION || 'us-east-2',
            // Sem "credentials" aqui — o SDK usa a IAM Role da EC2 via IMDS
        });
    }
    return _sesClient;
}

// ─────────────────────────────────────────────────────────────────────────────
// Função base de envio
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Envia um e-mail via Amazon SES.
 *
 * @param {Object}          params
 * @param {string|string[]} params.to      - Destinatário(s)
 * @param {string}          params.subject - Assunto
 * @param {string}          params.html    - Corpo HTML
 * @param {string}          params.text    - Corpo texto alternativo
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
export async function sendEmail({ to, subject, html, text }) {
    try {
        const ses = getSESClient();
        const fromAddress = process.env.EMAIL_FROM || 'noreply@aparecidadonortesp.com.br';
        const toAddresses = Array.isArray(to) ? to : [to];

        const command = new SendEmailCommand({
            Source: fromAddress,
            Destination: {
                ToAddresses: toAddresses,
            },
            Message: {
                Subject: { Data: subject, Charset: 'UTF-8' },
                Body: {
                    Html: { Data: html, Charset: 'UTF-8' },
                    Text: { Data: text, Charset: 'UTF-8' },
                },
            },
        });

        const response = await ses.send(command);

        console.log(`✅ [SES] E-mail enviado com sucesso`);
        console.log(`   Para: ${toAddresses.join(', ')}`);
        console.log(`   Assunto: ${subject}`);
        console.log(`   MessageId: ${response.MessageId}`);

        return { success: true, messageId: response.MessageId };

    } catch (err) {
        console.error('❌ [SES] Erro ao enviar e-mail:', err.message);
        // Não propaga o erro para não interromper o fluxo do webhook
        return { success: false, error: err.message };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Funções de alto nível (usam templates)
// ─────────────────────────────────────────────────────────────────────────────

import { buildPaymentConfirmationEmail } from '../emails/paymentConfirmation.js';
import { buildSubscriptionCanceledEmail } from '../emails/subscriptionCanceled.js';
import { buildTestEmail } from '../emails/testEmail.js';

/**
 * Envia e-mail de confirmação de pagamento ao cliente.
 *
 * @param {Object} params
 * @param {string} params.customerEmail - E-mail do destinatário
 * @param {string} params.customerName  - Nome do cliente / estabelecimento
 * @param {string} params.planName      - Nome do plano
 * @param {number} params.amount        - Valor pago em centavos
 * @param {string} params.invoiceId     - ID da fatura
 * @param {string} [params.nextCharge]  - Data da próxima cobrança (ISO)
 */
export async function sendPaymentConfirmation(params) {
    const { customerEmail, ...rest } = params;
    const { subject, html, text } = buildPaymentConfirmationEmail(rest);
    return sendEmail({ to: customerEmail, subject, html, text });
}

/**
 * Envia e-mail de aviso de cancelamento de assinatura ao cliente.
 *
 * @param {Object} params
 * @param {string} params.customerEmail - E-mail do destinatário
 * @param {string} params.customerName  - Nome do cliente / estabelecimento
 * @param {string} params.planName      - Nome do plano cancelado
 * @param {string} [params.canceledAt]  - Data do cancelamento (ISO)
 */
export async function sendSubscriptionCanceled(params) {
    const { customerEmail, ...rest } = params;
    const { subject, html, text } = buildSubscriptionCanceledEmail(rest);
    return sendEmail({ to: customerEmail, subject, html, text });
}

/**
 * Envia e-mail de teste para validar a configuração do SES.
 *
 * @param {string} recipientEmail - E-mail de destino do teste
 */
export async function sendTestEmail(recipientEmail) {
    const { subject, html, text } = buildTestEmail();
    return sendEmail({ to: recipientEmail, subject, html, text });
}

/**
 * Envia notificação interna de nova assinatura para o administrador.
 *
 * @param {Object} params
 * @param {string} params.businessName    - Nome do estabelecimento
 * @param {string} params.businessEmail   - E-mail do estabelecimento
 * @param {string} params.planName        - Nome do plano
 * @param {number} params.planPrice       - Valor do plano em centavos
 * @param {string} params.subscriptionId  - ID da assinatura Stripe
 * @param {string} [params.customerEmail] - E-mail do cliente (opcional)
 */
export async function sendNewSubscriptionNotification({
    businessName,
    businessEmail,
    planName,
    planPrice,
    subscriptionId,
    customerEmail,
}) {
    const priceFormatted = (planPrice / 100).toFixed(2).replace('.', ',');
    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
        console.warn('⚠️  [SES] ADMIN_EMAIL não configurado — notificação interna ignorada.');
        return { success: false, error: 'ADMIN_EMAIL não configurado' };
    }

    const subject = `🎉 Nova Assinatura: ${businessName} — ${planName}`;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><title>Nova Assinatura</title></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:40px 0;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:26px;">🎉 Nova Assinatura!</h1>
    </div>
    <div style="padding:32px;">
      <p style="font-size:16px;color:#333;">Uma nova assinatura foi realizada no <strong>Explore Aparecida</strong>.</p>
      <table style="width:100%;background:#f8f9fa;border-radius:6px;border-left:4px solid #667eea;">
        <tr><td style="padding:20px;">
          <p style="margin:0 0 8px;color:#6c757d;font-size:14px;"><strong>Estabelecimento:</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#212529;font-weight:600;">${businessName}</p>
          <p style="margin:0 0 8px;color:#6c757d;font-size:14px;"><strong>E-mail:</strong></p>
          <p style="margin:0 0 16px;font-size:15px;color:#212529;">${businessEmail}</p>
          ${customerEmail ? `<p style="margin:0 0 8px;color:#6c757d;font-size:14px;"><strong>E-mail do Cliente:</strong></p><p style="margin:0 0 16px;font-size:15px;color:#212529;">${customerEmail}</p>` : ''}
          <p style="margin:0 0 8px;color:#6c757d;font-size:14px;"><strong>Plano:</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#212529;font-weight:600;">${planName}</p>
          <p style="margin:0 0 8px;color:#6c757d;font-size:14px;"><strong>Valor Mensal:</strong></p>
          <p style="margin:0 0 16px;font-size:24px;color:#28a745;font-weight:700;">R$ ${priceFormatted}</p>
          <p style="margin:0;font-size:12px;color:#adb5bd;">ID da Assinatura: <code>${subscriptionId}</code></p>
        </td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:13px;color:#6c757d;">${now}</p>
    </div>
  </div>
</body>
</html>`;

    const text = `🎉 NOVA ASSINATURA — Explore Aparecida

Estabelecimento: ${businessName}
E-mail: ${businessEmail}
${customerEmail ? `E-mail do Cliente: ${customerEmail}\n` : ''}Plano: ${planName}
Valor Mensal: R$ ${priceFormatted}
ID da Assinatura: ${subscriptionId}

${now}`;

    return sendEmail({ to: adminEmail, subject, html, text });
}

/**
 * Envia e-mail de confirmação de assinatura para o cliente.
 * Alias de sendPaymentConfirmation com os parâmetros do index.js.
 *
 * @param {Object} params
 * @param {string} params.customerEmail  - E-mail do destinatário
 * @param {string} params.businessName   - Nome do estabelecimento
 * @param {string} params.planName       - Nome do plano
 * @param {number} params.planPrice      - Valor do plano em centavos
 * @param {string} [params.nextChargeDate] - Data da próxima cobrança (ISO)
 */
export async function sendSubscriptionConfirmationToCustomer({
    customerEmail,
    businessName,
    planName,
    planPrice,
    nextChargeDate,
}) {
    return sendPaymentConfirmation({
        customerEmail,
        customerName: businessName,
        planName,
        amount: planPrice,
        invoiceId: 'assinatura-nova',
        nextCharge: nextChargeDate,
    });
}
