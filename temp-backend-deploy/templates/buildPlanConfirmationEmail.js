function formatMoneyFromCents({ amountCents, currency }) {
  const safeCurrency = (currency || 'brl').toString().toUpperCase();
  const value = (Number(amountCents) || 0) / 100;

  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: safeCurrency,
    }).format(value);
  } catch {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }
}

export function buildPlanConfirmationEmail({
  planName,
  amountTotalCents,
  currency = 'brl',
  customerEmail,
}) {
  const safePlanName = planName || 'Seu plano';
  const totalFormatted = formatMoneyFromCents({ amountCents: amountTotalCents, currency });
  const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const subject = `✅ Pagamento confirmado — ${safePlanName}`;

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f6f8;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
      <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(16,24,40,0.08);">
        <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:28px 24px;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;line-height:1.25;">Pagamento confirmado</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Obrigado por assinar o Explore Aparecida</p>
        </div>

        <div style="padding:24px;">
          <p style="margin:0 0 16px;color:#111827;font-size:15px;line-height:1.6;">
            Recebemos o seu pagamento com sucesso.
          </p>

          <div style="background:#f9fafb;border:1px solid #eef2f7;border-radius:10px;padding:16px 16px 12px;">
            <p style="margin:0 0 8px;color:#6b7280;font-size:12px;">Plano</p>
            <p style="margin:0 0 14px;color:#111827;font-size:16px;font-weight:700;">${safePlanName}</p>

            <p style="margin:0 0 8px;color:#6b7280;font-size:12px;">Valor</p>
            <p style="margin:0;color:#16a34a;font-size:20px;font-weight:800;">${totalFormatted}</p>
          </div>

          ${customerEmail ? `<p style="margin:16px 0 0;color:#6b7280;font-size:13px;">E-mail: ${customerEmail}</p>` : ''}
          <p style="margin:8px 0 0;color:#9ca3af;font-size:12px;">${now}</p>

          <p style="margin:18px 0 0;color:#111827;font-size:14px;line-height:1.6;">
            Se você tiver qualquer dúvida, é só responder este e-mail.
          </p>
        </div>

        <div style="padding:16px 24px;background:#0b1220;color:#9ca3af;text-align:center;">
          <p style="margin:0;font-size:12px;">Explore Aparecida — Confirmação de Plano</p>
        </div>
      </div>
    </div>
  </body>
</html>`;

  const text = `✅ Pagamento confirmado — Explore Aparecida

Plano: ${safePlanName}
Valor: ${totalFormatted}
${customerEmail ? `E-mail: ${customerEmail}\n` : ''}
Data: ${now}

Se você tiver qualquer dúvida, responda este e-mail.
`;

  return { subject, html, text };
}

