/**
 * 📧 TEMPLATE: E-mail de Teste
 *
 * Usado para validar a configuração do Resend.
 *
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildTestEmail() {
    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    const subject = '🧪 Teste de E-mail — Resend configurado!';

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teste de E-mail</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background-color:#f5f5f5;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table role="presentation" style="width:600px;max-width:90%;background:#ffffff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 30px;text-align:center;border-radius:8px 8px 0 0;">
              <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:700;">✅ Teste Bem-Sucedido!</h1>
              <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:16px;">Resend + API Key funcionando</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 30px;">
              <p style="margin:0 0 20px;font-size:16px;color:#333;line-height:1.6;">
                O serviço de e-mail via <strong>Resend</strong> está configurado e funcionando corretamente.
                A autenticação via <strong>API Key</strong> está operacional.
              </p>

              <table role="presentation" style="width:100%;background:#f8f9fa;border-radius:6px;border-left:4px solid #667eea;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px;font-size:14px;color:#6c757d;"><strong style="color:#495057;">Provedor:</strong></p>
                    <p style="margin:0 0 16px;font-size:15px;color:#212529;">Resend (v6.12.3)</p>

                    <p style="margin:0 0 8px;font-size:14px;color:#6c757d;"><strong style="color:#495057;">Autenticação:</strong></p>
                    <p style="margin:0 0 16px;font-size:15px;color:#212529;">API Key (RESEND_API_KEY)</p>

                    <p style="margin:0 0 8px;font-size:14px;color:#6c757d;"><strong style="color:#495057;">Remetente:</strong></p>
                    <p style="margin:0 0 16px;font-size:15px;color:#212529;">${process.env.RESEND_FROM || 'noreply@aparecidadonortesp.com.br'}</p>

                    <p style="margin:0 0 8px;font-size:14px;color:#6c757d;"><strong style="color:#495057;">Status:</strong></p>
                    <p style="margin:0 0 16px;font-size:15px;color:#212529;">🟢 Pronto para Produção</p>

                    <p style="margin:0 0 8px;font-size:14px;color:#6c757d;"><strong style="color:#495057;">Data/Hora:</strong></p>
                    <p style="margin:0;font-size:15px;color:#212529;">${now}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;color:#6c757d;line-height:1.6;">
                Você pode agora usar o Resend para enviar e-mails transacionais de confirmação de pagamento, cancelamento de assinatura e notificações do sistema.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 30px;background:#f8f9fa;text-align:center;border-radius:0 0 8px 8px;border-top:1px solid #e9ecef;">
              <p style="margin:0 0 4px;font-size:14px;color:#6c757d;"><strong>Explore Aparecida</strong></p>
              <p style="margin:0;font-size:12px;color:#adb5bd;">Sistema de E-mails — Resend</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text = `✅ TESTE BEM-SUCEDIDO — Resend

O serviço de e-mail via Resend está configurado e funcionando!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFIGURAÇÃO ATUAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Provedor: Resend (v6.12.3)
• Autenticação: API Key (RESEND_API_KEY)
• Remetente: ${process.env.RESEND_FROM || 'noreply@aparecidadonortesp.com.br'}
• Status: 🟢 Pronto para Produção
• Data/Hora: ${now}

---
Explore Aparecida — Sistema de E-mails`;

    return { subject, html, text };
}
