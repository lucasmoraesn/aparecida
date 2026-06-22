/**
 * 📧 RESEND EMAIL SERVICE
 *
 * Serviço centralizado para envio de e-mails usando Resend.
 *
 * Variável de ambiente necessária:
 *   RESEND_API_KEY   — Chave de API do Resend
 *   RESEND_FROM      — Endereço de envio (ex: noreply@aparecidadonortesp.com.br)
 *   ADMIN_EMAIL      — E-mail do administrador para notificações
 *
 * Documentação: https://resend.com/docs
 */

import { Resend } from 'resend';

// ─────────────────────────────────────────────────────────────────────────────
// Singleton do cliente Resend
// ─────────────────────────────────────────────────────────────────────────────

let _resendClient = null;

function getResendClient() {
    if (!_resendClient) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey || !String(apiKey).trim()) {
            throw new Error('❌ [RESEND] RESEND_API_KEY não configurado no .env');
        }
        _resendClient = new Resend(apiKey);
    }
    return _resendClient;
}

// ─────────────────────────────────────────────────────────────────────────────
// Função base de envio
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Envia um e-mail via Resend.
 *
 * @param {Object}          params
 * @param {string|string[]} params.to      - Destinatário(s)
 * @param {string}          params.subject - Assunto
 * @param {string}          params.html    - Corpo HTML
 * @param {string}          [params.text]  - Corpo texto alternativo
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
export async function sendEmail({ to, subject, html, text }) {
    try {
        const resend = getResendClient();
        
        // ⚠️ CRÍTICO: Garantir que RESEND_FROM está SEMPRE definido
        const fromAddress = process.env.RESEND_FROM;
        if (!fromAddress || !String(fromAddress).trim()) {
            throw new Error('❌ [RESEND] RESEND_FROM não configurado no .env — configure com um e-mail verificado no Resend');
        }
        
        const toAddresses = Array.isArray(to) ? to : [to];

        const response = await resend.emails.send({
            from: fromAddress,
            to: toAddresses,
            subject,
            html,
            text: text || html,
        });

        if (response.error) {
            throw new Error(response.error.message || 'Erro ao enviar e-mail via Resend');
        }

        console.log(`✅ [RESEND] E-mail enviado com sucesso`);
        console.log(`   Para: ${toAddresses.join(', ')}`);
        console.log(`   Assunto: ${subject}`);
        console.log(`   MessageId: ${response.data?.id}`);

        return { success: true, messageId: response.data?.id };

    } catch (err) {
        console.error('❌ [RESEND] Erro ao enviar e-mail:', err.message);
        return { success: false, error: err.message };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Funções de alto nível (usam templates)
// ─────────────────────────────────────────────────────────────────────────────

import { buildPaymentConfirmationEmail } from '../emails/paymentConfirmation.js';
import { buildSubscriptionCanceledEmail } from '../emails/subscriptionCanceled.js';
import { buildTestEmail } from '../emails/testEmail.js';
import { buildNewsletterWelcomeEmail } from '../emails/newsletterWelcome.js';

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
 * Envia e-mail de teste para validar a configuração do Resend.
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
        console.warn('⚠️  [RESEND] ADMIN_EMAIL não configurado — notificação interna ignorada.');
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

/**
 * Envia e-mail de boas-vindas para novo inscrito na newsletter.
 *
 * @param {Object} params
 * @param {string} params.email - E-mail do inscrito
 */
export async function sendNewsletterWelcomeEmail({ email }) {
    const { subject, html, text } = buildNewsletterWelcomeEmail({ email });
    return sendEmail({ to: email, subject, html, text });
}

/**
 * Notifica o administrador que um novo motorista foi cadastrado e aguarda aprovação.
 *
 * @param {Object} params
 * @param {string} params.nome     - Nome do motorista
 * @param {string} params.whatsapp - WhatsApp do motorista
 * @param {string} params.plano    - Plano contratado (basico/destaque/premium)
 * @param {string} [params.email]  - E-mail do motorista (do Stripe)
 */
export async function sendNewMotoristaNotification({ nome, whatsapp, plano, email }) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
        console.warn('⚠️  [RESEND] ADMIN_EMAIL não configurado — notificação de motorista ignorada.');
        return { success: false, error: 'ADMIN_EMAIL não configurado' };
    }

    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const planoBadge = plano === 'premium' ? '⭐ Premium' : plano === 'destaque' ? '🔶 Destaque' : '🔵 Básico';
    const subject = `🚗 Novo Motorista Aguardando Aprovação: ${nome}`;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><title>Novo Motorista</title></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:40px 0;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);padding:32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:24px;">🚗 Novo Motorista Cadastrado</h1>
      <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">Aguardando sua aprovação</p>
    </div>
    <div style="padding:32px;">
      <p style="font-size:15px;color:#374151;">Um novo motorista se cadastrou no <strong>Explore Aparecida</strong> e está aguardando aprovação.</p>
      <table style="width:100%;background:#f8fafc;border-radius:6px;border-left:4px solid #3b82f6;margin:20px 0;">
        <tr><td style="padding:20px;">
          <p style="margin:0 0 8px;color:#6b7280;font-size:13px;"><strong>Nome:</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#111827;font-weight:600;">${nome}</p>
          <p style="margin:0 0 8px;color:#6b7280;font-size:13px;"><strong>WhatsApp:</strong></p>
          <p style="margin:0 0 16px;font-size:15px;color:#111827;">${whatsapp}</p>
          ${email ? `<p style="margin:0 0 8px;color:#6b7280;font-size:13px;"><strong>E-mail:</strong></p><p style="margin:0 0 16px;font-size:15px;color:#111827;">${email}</p>` : ''}
          <p style="margin:0 0 8px;color:#6b7280;font-size:13px;"><strong>Plano:</strong></p>
          <p style="margin:0;font-size:16px;color:#111827;font-weight:600;">${planoBadge}</p>
        </td></tr>
      </table>
      <p style="font-size:13px;color:#6b7280;margin:0;">Data do cadastro: ${now}</p>
    </div>
  </div>
</body>
</html>`;

    const text = `🚗 NOVO MOTORISTA AGUARDANDO APROVAÇÃO — Explore Aparecida

Nome: ${nome}
WhatsApp: ${whatsapp}
${email ? `E-mail: ${email}\n` : ''}Plano: ${planoBadge}

Data do cadastro: ${now}`;

    return sendEmail({ to: adminEmail, subject, html, text });
}

/**
 * Envia notificação de análise para um motorista.
 *
 * @param {Object} params
 * @param {string} params.motoristaEmail - E-mail do motorista
 * @param {string} params.motoristaName  - Nome do motorista
 * @param {string} params.status         - Status (aprovado/rejeitado)
 * @param {string} [params.motivo]       - Motivo da rejeição (se aplicável)
 */
export async function sendMotoristaAnaliseEmail({ motoristaEmail, motoristaName, status, motivo }) {
    const isApproved = status === 'aprovado';
    const subject = isApproved ? `✅ Motorista Aprovado: ${motoristaName}` : `❌ Motorista Rejeitado: ${motoristaName}`;
    
    const statusBadge = isApproved ? '✅ APROVADO' : '❌ REJEITADO';
    const bgColor = isApproved ? '#28a745' : '#dc3545';
    const gradientColor = isApproved ? '#1d7e2a' : '#a11a2e';

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><title>${statusBadge}</title></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:40px 0;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,${gradientColor},${bgColor});padding:32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:24px;">${statusBadge}</h1>
    </div>
    <div style="padding:32px;">
      <p style="font-size:15px;color:#374151;">Olá <strong>${motoristaName}</strong>,</p>
      <p style="font-size:15px;color:#374151;">Sua inscrição foi <strong style="color:${bgColor};">${status === 'aprovado' ? 'aprovada' : 'rejeitada'}</strong> por nossa equipe.</p>
      ${motivo ? `<div style="background:#f8f9fa;border-left:4px solid ${bgColor};padding:15px;border-radius:4px;margin:20px 0;"><p style="margin:0;font-size:14px;color:#374151;"><strong>Motivo:</strong></p><p style="margin:8px 0 0;font-size:14px;color:#6c757d;">${motivo}</p></div>` : ''}
      <p style="font-size:15px;color:#374151;margin-top:20px;">Para dúvidas, entre em contato com nosso suporte.</p>
    </div>
  </div>
</body>
</html>`;

    const text = `${statusBadge}

Olá ${motoristaName},

Sua inscrição foi ${status === 'aprovado' ? 'aprovada' : 'rejeitada'} por nossa equipe.
${motivo ? `Motivo: ${motivo}\n` : ''}
Para dúvidas, entre em contato com nosso suporte.`;

    return sendEmail({ to: motoristaEmail, subject, html, text });
}

/**
 * Envia notificação de novo estabelecimento para o administrador.
 *
 * @param {Object} params
 * @param {string} params.businessName   - Nome do estabelecimento
 * @param {string} params.businessEmail  - E-mail do estabelecimento
 * @param {string} params.businessPhone  - Telefone do estabelecimento
 * @param {string} [params.businessType] - Tipo de negócio
 */
export async function sendNewBusinessNotification({ businessName, businessEmail, businessPhone, businessType }) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
        console.warn('⚠️  [RESEND] ADMIN_EMAIL não configurado — notificação de negócio ignorada.');
        return { success: false, error: 'ADMIN_EMAIL não configurado' };
    }

    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const subject = `🏪 Novo Estabelecimento Registrado: ${businessName}`;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><title>Novo Estabelecimento</title></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:40px 0;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#ff7e5f,#feb47b);padding:32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:24px;">🏪 Novo Estabelecimento</h1>
    </div>
    <div style="padding:32px;">
      <p style="font-size:16px;color:#333;">Um novo estabelecimento foi registrado.</p>
      <table style="width:100%;background:#f8f9fa;border-radius:6px;border-left:4px solid #ff7e5f;">
        <tr><td style="padding:20px;">
          <p style="margin:0 0 8px;color:#6c757d;font-size:14px;"><strong>Nome:</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#212529;font-weight:600;">${businessName}</p>
          <p style="margin:0 0 8px;color:#6c757d;font-size:14px;"><strong>E-mail:</strong></p>
          <p style="margin:0 0 16px;font-size:15px;color:#212529;">${businessEmail}</p>
          <p style="margin:0 0 8px;color:#6c757d;font-size:14px;"><strong>Telefone:</strong></p>
          <p style="margin:0 0 16px;font-size:15px;color:#212529;">${businessPhone}</p>
          ${businessType ? `<p style="margin:0 0 8px;color:#6c757d;font-size:14px;"><strong>Tipo:</strong></p><p style="margin:0;font-size:15px;color:#212529;">${businessType}</p>` : ''}
        </td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:13px;color:#6c757d;">${now}</p>
    </div>
  </div>
</body>
</html>`;

    const text = `🏪 NOVO ESTABELECIMENTO — Explore Aparecida

Nome: ${businessName}
E-mail: ${businessEmail}
Telefone: ${businessPhone}
${businessType ? `Tipo: ${businessType}\n` : ''}
${now}`;

    return sendEmail({ to: adminEmail, subject, html, text });
}

/**
 * Envia notificação de análise para um estabelecimento.
 *
 * @param {Object} params
 * @param {string} params.businessEmail - E-mail do estabelecimento
 * @param {string} params.businessName  - Nome do estabelecimento
 * @param {string} params.status        - Status (aprovado/rejeitado)
 * @param {string} [params.motivo]      - Motivo da rejeição (se aplicável)
 */
export async function sendBusinessAnalisisEmail({ businessEmail, businessName, status, motivo }) {
    const isApproved = status === 'aprovado';
    const subject = isApproved ? `✅ Estabelecimento Aprovado: ${businessName}` : `❌ Estabelecimento Rejeitado: ${businessName}`;
    
    const statusBadge = isApproved ? '✅ APROVADO' : '❌ REJEITADO';
    const bgColor = isApproved ? '#28a745' : '#dc3545';
    const gradientColor = isApproved ? '#1d7e2a' : '#a11a2e';

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><title>${statusBadge}</title></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:40px 0;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,${gradientColor},${bgColor});padding:32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:24px;">${statusBadge}</h1>
    </div>
    <div style="padding:32px;">
      <p style="font-size:15px;color:#374151;">Olá <strong>${businessName}</strong>,</p>
      <p style="font-size:15px;color:#374151;">Seu estabelecimento foi <strong style="color:${bgColor};">${status === 'aprovado' ? 'aprovado' : 'rejeitado'}</strong> por nossa equipe.</p>
      ${motivo ? `<div style="background:#f8f9fa;border-left:4px solid ${bgColor};padding:15px;border-radius:4px;margin:20px 0;"><p style="margin:0;font-size:14px;color:#374151;"><strong>Motivo:</strong></p><p style="margin:8px 0 0;font-size:14px;color:#6c757d;">${motivo}</p></div>` : ''}
      <p style="font-size:15px;color:#374151;margin-top:20px;">Para dúvidas, entre em contato com nosso suporte.</p>
    </div>
  </div>
</body>
</html>`;

    const text = `${statusBadge}

Olá ${businessName},

Seu estabelecimento foi ${status === 'aprovado' ? 'aprovado' : 'rejeitado'} por nossa equipe.
${motivo ? `Motivo: ${motivo}\n` : ''}
Para dúvidas, entre em contato com nosso suporte.`;

    return sendEmail({ to: businessEmail, subject, html, text });
}

/**
 * Envia e-mail de confirmação de compra do Ebook com link de download.
 *
 * @param {Object} params
 * @param {string} params.email             - E-mail do comprador
 * @param {string} params.checkoutSessionId - ID da sessão de checkout do Stripe
 * @param {number} params.amountPaid        - Valor total pago (em reais)
 */
export async function sendEbookPurchaseConfirmation({ email, checkoutSessionId, amountPaid }) {
    const downloadUrl = `${process.env.PUBLIC_URL_NGROK || 'https://aparecidadonortesp.com.br'}/api/ebook/download?session_id=${checkoutSessionId}`;
    const priceFormatted = Number(amountPaid).toFixed(2).replace('.', ',');
    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    const subject = `📖 Seu Kit Oficial do Romeiro 2026 está pronto!`;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Seu Kit Oficial do Romeiro 2026</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
    <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 40px 32px; text-align: center; color: #ffffff;">
      <span style="font-size: 48px;">📖</span>
      <h1 style="margin: 16px 0 8px 0; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">Kit Oficial do Romeiro 2026</h1>
      <p style="margin: 0; font-size: 16px; color: #bfdbfe; font-weight: 500;">Obrigado pela sua compra! Seu guia está liberado.</p>
    </div>
    
    <div style="padding: 40px 32px;">
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-top: 0;">
        Olá! Agradecemos por adquirir o <strong>Kit Oficial do Romeiro 2026</strong>. Com este guia digital, você terá em suas mãos todas as informações necessárias para fazer uma romaria inesquecível, segura e abençoada.
      </p>
      
      <div style="background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #3b82f6; padding: 24px; margin: 32px 0;">
        <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #1f2937; font-weight: 600;">Resumo do Pedido</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4b5563;">
          <tr>
            <td style="padding: 6px 0; font-weight: 500;">Produto:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #1f2937;">Kit Oficial do Romeiro 2026 (PDF)</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 500;">Valor Pago:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #10b981;">R$ ${priceFormatted}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 500;">Data do Pagamento:</td>
            <td style="padding: 6px 0; text-align: right;">${now}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; text-decoration: none; padding: 16px 36px; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2); transition: all 0.2s ease;">
          📥 Baixar Meu Kit Romeiro PDF
        </a>
        <p style="margin: 12px 0 0 0; font-size: 12px; color: #6b7280;">Este link é seguro e ficará disponível para download por 24 horas.</p>
      </div>

      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

      <h4 style="margin: 0 0 12px 0; font-size: 15px; color: #1f2937; font-weight: 600;">O que você vai encontrar no seu Kit:</h4>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6; color: #4b5563;">
        <li style="margin-bottom: 8px;"><strong>Roteiros Exclusivos:</strong> Planejamentos detalhados de 1, 2 e 3 dias em Aparecida.</li>
        <li style="margin-bottom: 8px;"><strong>Hospedagem & Alimentação:</strong> Dicas práticas de onde ficar e comer bem.</li>
        <li style="margin-bottom: 8px;"><strong>Checklist Completo:</strong> O que levar na mala para evitar imprevistos.</li>
        <li style="margin-bottom: 8px;"><strong>Evite Erros:</strong> Dicas essenciais do que NÃO fazer durante sua romaria.</li>
      </ul>

      <p style="font-size: 14px; color: #6b7280; margin-top: 32px; line-height: 1.5;">
        Se você tiver qualquer problema com o download, responda a este e-mail ou entre em contato com nosso suporte através do WhatsApp no portal. Estamos aqui para ajudar!
      </p>
    </div>
    
    <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">&copy; 2026 Explore Aparecida. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>`;

    const text = `📖 KIT OFICIAL DO ROMEIRO 2026 — Explore Aparecida

Olá! Agradecemos por adquirir o Kit Oficial do Romeiro 2026.

Valor Pago: R$ ${priceFormatted}
Data do Pagamento: ${now}

Para fazer o download seguro do seu PDF, acesse o link abaixo (válido por 24 horas):
${downloadUrl}

Dúvidas ou suporte? Entre em contato conosco pelo portal Explore Aparecida.

Abraços e boa romaria!
Equipe Explore Aparecida`;

    return sendEmail({ to: email, subject, html, text });
}

