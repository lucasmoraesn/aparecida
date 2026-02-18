/**
 * 📧 TEMPLATE: Boas-vindas à Newsletter
 *
 * @param {Object} params
 * @param {string} params.email - E-mail do inscrito
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildNewsletterWelcomeEmail({ email }) {
    const domain = process.env.PRODUCTION_DOMAIN || 'https://aparecidadonortesp.com.br';
    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    const subject = '🎉 Bem-vindo(a) à Newsletter — Explore Aparecida!';

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo à Newsletter</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background-color:#f5f5f5;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table role="presentation" style="width:600px;max-width:90%;background:#ffffff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 30px;text-align:center;border-radius:8px 8px 0 0;">
              <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:700;">🎉 Bem-vindo(a)!</h1>
              <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:16px;">Você agora faz parte da nossa comunidade</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 30px;">
              <p style="margin:0 0 20px;font-size:16px;color:#333;line-height:1.6;">
                Olá! Sua inscrição na newsletter do <strong>Explore Aparecida</strong> foi confirmada com sucesso. 🙌
              </p>

              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#333;">
                Você receberá em primeira mão:
              </p>

              <table role="presentation" style="width:100%;background:#f8f9fa;border-radius:6px;border-left:4px solid #667eea;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 10px;font-size:15px;color:#212529;">🏨 <strong>Novos estabelecimentos</strong> cadastrados na plataforma</p>
                    <p style="margin:0 0 10px;font-size:15px;color:#212529;">🎊 <strong>Eventos e festas</strong> em Aparecida do Norte</p>
                    <p style="margin:0 0 10px;font-size:15px;color:#212529;">💡 <strong>Dicas e roteiros</strong> para aproveitar ao máximo a cidade</p>
                    <p style="margin:0;font-size:15px;color:#212529;">🔥 <strong>Promoções exclusivas</strong> dos parceiros</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" style="width:100%;margin:0 0 24px;">
                <tr>
                  <td align="center">
                    <a href="${domain}" style="display:inline-block;padding:14px 36px;background:#667eea;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">
                      Explorar Aparecida Agora
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#6c757d;line-height:1.6;text-align:center;">
                Para cancelar sua inscrição, acesse <a href="${domain}" style="color:#667eea;">${domain}</a>
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

    const text = `🎉 BEM-VINDO(A) À NEWSLETTER — Explore Aparecida!

Sua inscrição foi confirmada com sucesso!

Você receberá em primeira mão:
• Novos estabelecimentos cadastrados na plataforma
• Eventos e festas em Aparecida do Norte
• Dicas e roteiros para aproveitar ao máximo a cidade
• Promoções exclusivas dos parceiros

Acesse: ${domain}

---
Para cancelar sua inscrição, acesse ${domain}
Explore Aparecida — ${now}`;

    return { subject, html, text };
}
