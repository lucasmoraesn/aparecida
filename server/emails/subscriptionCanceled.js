/**
 * 📧 TEMPLATE: Assinatura Cancelada
 *
 * @param {Object} params
 * @param {string} params.customerName  - Nome do cliente / estabelecimento
 * @param {string} params.planName      - Nome do plano cancelado
 * @param {string} [params.canceledAt]  - Data do cancelamento (ISO string)
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildSubscriptionCanceledEmail({ customerName, planName, canceledAt }) {
    const canceledAtFormatted = canceledAt
        ? new Date(canceledAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
        : new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const domain = process.env.PRODUCTION_DOMAIN || 'https://aparecidadonortesp.com.br';

    const subject = `😔 Assinatura Cancelada — ${planName}`;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Assinatura Cancelada</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background-color:#f5f5f5;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table role="presentation" style="width:600px;max-width:90%;background:#ffffff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6c757d 0%,#495057 100%);padding:40px 30px;text-align:center;border-radius:8px 8px 0 0;">
              <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:700;">😔 Assinatura Cancelada</h1>
              <p style="margin:10px 0 0;color:rgba(255,255,255,0.85);font-size:16px;">Sentiremos sua falta!</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 30px;">
              <p style="margin:0 0 20px;font-size:16px;color:#333;">Olá, <strong>${customerName}</strong>,</p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#333;">
                Sua assinatura no <strong>Explore Aparecida</strong> foi cancelada. Seu perfil ficará visível até o fim do período já pago.
              </p>

              <!-- Detalhes -->
              <table role="presentation" style="width:100%;background:#f8f9fa;border-radius:6px;border-left:4px solid #dc3545;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px;font-size:14px;color:#6c757d;"><strong style="color:#495057;">Plano Cancelado:</strong></p>
                    <p style="margin:0 0 16px;font-size:18px;color:#212529;font-weight:600;">${planName}</p>

                    <p style="margin:0 0 8px;font-size:14px;color:#6c757d;"><strong style="color:#495057;">Data do Cancelamento:</strong></p>
                    <p style="margin:0;font-size:15px;color:#212529;">${canceledAtFormatted}</p>
                  </td>
                </tr>
              </table>

              <!-- Reativação -->
              <table role="presentation" style="width:100%;background:#fff3cd;border-radius:6px;border:1px solid #ffc107;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px;font-size:15px;color:#856404;font-weight:600;">💡 Mudou de ideia?</p>
                    <p style="margin:0;font-size:14px;color:#856404;line-height:1.6;">
                      Você pode reativar sua assinatura a qualquer momento e continuar aparecendo para milhares de visitantes de Aparecida do Norte.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" style="width:100%;margin:0 0 24px;">
                <tr>
                  <td align="center">
                    <a href="${domain}" style="display:inline-block;padding:14px 36px;background:#667eea;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">
                      Reativar Assinatura
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;color:#6c757d;line-height:1.6;">
                Obrigado por ter feito parte do Explore Aparecida. Esperamos te ver novamente em breve!
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

    const text = `😔 ASSINATURA CANCELADA — Explore Aparecida

Olá, ${customerName},

Sua assinatura foi cancelada. Sentiremos sua falta!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETALHES DO CANCELAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Plano Cancelado: ${planName}
• Data do Cancelamento: ${canceledAtFormatted}

💡 Mudou de ideia? Reative em: ${domain}

Obrigado por ter feito parte do Explore Aparecida!

---
Explore Aparecida — ${now}`;

    return { subject, html, text };
}
