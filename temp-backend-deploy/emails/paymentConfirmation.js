/**
 * 📧 TEMPLATE: Confirmação de Pagamento
 *
 * @param {Object} params
 * @param {string} params.customerName  - Nome do cliente / estabelecimento
 * @param {string} params.planName      - Nome do plano contratado
 * @param {number} params.amount        - Valor pago em centavos
 * @param {string} params.invoiceId     - ID da fatura / payment intent
 * @param {string} [params.nextCharge]  - Data da próxima cobrança (ISO string)
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildPaymentConfirmationEmail({ customerName, planName, amount, invoiceId, nextCharge }) {
    const priceFormatted = (amount / 100).toFixed(2).replace('.', ',');
    const nextChargeFormatted = nextCharge
        ? new Date(nextCharge).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'a definir';
    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const domain = process.env.PRODUCTION_DOMAIN || 'https://aparecidadonortesp.com.br';

    const subject = `✅ Pagamento Confirmado — ${planName}`;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pagamento Confirmado</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background-color:#f5f5f5;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table role="presentation" style="width:600px;max-width:90%;background:#ffffff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#28a745 0%,#20c997 100%);padding:40px 30px;text-align:center;border-radius:8px 8px 0 0;">
              <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:700;">✅ Pagamento Confirmado!</h1>
              <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:16px;">Sua assinatura está ativa</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 30px;">
              <p style="margin:0 0 20px;font-size:16px;color:#333;">Olá, <strong>${customerName}</strong>! 👋</p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#333;">
                Recebemos seu pagamento com sucesso. Seu perfil no <strong>Explore Aparecida</strong> está ativo e visível para milhares de visitantes.
              </p>

              <!-- Detalhes -->
              <table role="presentation" style="width:100%;background:#f8f9fa;border-radius:6px;border-left:4px solid #28a745;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px;font-size:14px;color:#6c757d;"><strong style="color:#495057;">Plano:</strong></p>
                    <p style="margin:0 0 16px;font-size:18px;color:#212529;font-weight:600;">${planName}</p>

                    <p style="margin:0 0 8px;font-size:14px;color:#6c757d;"><strong style="color:#495057;">Valor Pago:</strong></p>
                    <p style="margin:0 0 16px;font-size:28px;color:#28a745;font-weight:700;">R$ ${priceFormatted}</p>

                    <p style="margin:0 0 8px;font-size:14px;color:#6c757d;"><strong style="color:#495057;">Próxima Cobrança:</strong></p>
                    <p style="margin:0 0 16px;font-size:15px;color:#212529;">${nextChargeFormatted}</p>

                    <p style="margin:0;font-size:12px;color:#adb5bd;">ID da Fatura: <code style="background:#fff;padding:2px 6px;border-radius:3px;">${invoiceId}</code></p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" style="width:100%;margin:0 0 24px;">
                <tr>
                  <td align="center">
                    <a href="${domain}" style="display:inline-block;padding:14px 36px;background:#667eea;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">
                      Acessar Plataforma
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;color:#6c757d;line-height:1.6;">
                Dúvidas? Acesse <a href="${domain}" style="color:#667eea;">${domain}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 30px;background:#f8f9fa;text-align:center;border-radius:0 0 8px 8px;border-top:1px solid #e9ecef;">
              <p style="margin:0 0 4px;font-size:14px;color:#6c757d;"><strong>Explore Aparecida</strong></p>
              <p style="margin:0;font-size:12px;color:#adb5bd;">${now}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text = `✅ PAGAMENTO CONFIRMADO — Explore Aparecida

Olá, ${customerName}!

Recebemos seu pagamento com sucesso.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETALHES DO PAGAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Plano: ${planName}
• Valor Pago: R$ ${priceFormatted}
• Próxima Cobrança: ${nextChargeFormatted}
• ID da Fatura: ${invoiceId}

Acesse a plataforma: ${domain}

---
Explore Aparecida — ${now}`;

    return { subject, html, text };
}
