import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

let _sesClient;

function buildSESClient() {
  const region = process.env.AWS_REGION || "us-east-2";

  /**
   * NÃO coloque credenciais aqui.
   * Deixe o SDK resolver automaticamente:
   * - Local (Windows): AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY ou AWS_PROFILE
   * - EC2: IAM Role via IMDS
   */
  return new SESClient({ region });
}

function getSESClient() {
  if (!_sesClient) _sesClient = buildSESClient();
  return _sesClient;
}

function normalizeToAddresses(to) {
  const arr = Array.isArray(to) ? to : [to];
  const cleaned = arr.map((x) => String(x || "").trim()).filter(Boolean);
  return cleaned;
}

export async function sendEmail({ to, subject, html, text }) {
  const toAddresses = normalizeToAddresses(to);

  if (toAddresses.length === 0) {
    throw new Error('sendEmail: parâmetro "to" é obrigatório');
  }
  if (!subject || !String(subject).trim()) {
    throw new Error('sendEmail: parâmetro "subject" é obrigatório');
  }
  if (!html && !text) {
    throw new Error('sendEmail: informe "html" e/ou "text"');
  }

  const fromAddress = process.env.EMAIL_FROM;
  if (!fromAddress || !String(fromAddress).trim()) {
    throw new Error(
      "sendEmail: EMAIL_FROM não configurado (precisa ser remetente/identidade verificada no SES)"
    );
  }

  const region = process.env.AWS_REGION || "us-east-2";
  const ses = getSESClient();

  const command = new SendEmailCommand({
    Source: fromAddress,
    Destination: { ToAddresses: toAddresses },
    Message: {
      Subject: { Data: String(subject), Charset: "UTF-8" },
      Body: {
        ...(html ? { Html: { Data: String(html), Charset: "UTF-8" } } : {}),
        ...(text ? { Text: { Data: String(text), Charset: "UTF-8" } } : {}),
      },
    },
  });

  try {
    const response = await ses.send(command);

    console.log("✅ SES Email enviado", {
      messageId: response?.MessageId,
      to: toAddresses,
      from: fromAddress,
      region,
    });

    return { messageId: response?.MessageId };
  } catch (err) {
    // Log rico (isso é o que vai te salvar)
    console.error("❌ SES Falha ao enviar email", {
      name: err?.name,
      message: err?.message,
      code: err?.code || err?.Code,
      requestId: err?.$metadata?.requestId,
      httpStatusCode: err?.$metadata?.httpStatusCode,
      region,
      from: fromAddress,
      to: toAddresses,
    });

    /**
     * Erros típicos:
     * - CredentialsProviderError: local sem credenciais AWS
     * - MessageRejected: SES sandbox ou destinatário/remetente não verificado
     * - AccessDeniedException: IAM sem ses:SendEmail/ses:SendRawEmail
     */
    throw err;
  }
}