/**
 * 📧 EMAIL SERVICE - RESEND
 * 
 * Serviço centralizado para envio de e-mails usando Resend
 * Docs: https://resend.com/docs/send-with-nodejs
 */

import { Resend } from 'resend';

// Função para obter instância do Resend (lazy initialization)
function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY não configurada no .env');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

/**
 * Envia notificação de nova assinatura para o administrador
 * 
 * @param {Object} params - Parâmetros da notificação
 * @param {string} params.businessName - Nome do estabelecimento
 * @param {string} params.businessEmail - E-mail do estabelecimento
 * @param {string} params.planName - Nome do plano contratado
 * @param {number} params.planPrice - Valor do plano (em centavos)
 * @param {string} params.subscriptionId - ID da assinatura
 * @param {string} params.customerEmail - E-mail do cliente (opcional)
 * @returns {Promise<Object>} Resultado do envio
 */
export async function sendNewSubscriptionNotification({
  businessName,
  businessEmail,
  planName,
  planPrice,
  subscriptionId,
  customerEmail
}) {
  try {
    const resend = getResendClient();
    const priceFormatted = (planPrice / 100).toFixed(2).replace('.', ',');
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova Assinatura</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        
        <!-- Container principal -->
        <table role="presentation" style="width: 600px; max-width: 90%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                🎉 Nova Assinatura!
              </h1>
            </td>
          </tr>
          
          <!-- Conteúdo -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #333333;">
                Uma <strong>nova assinatura</strong> foi realizada no Explore Aparecida!
              </p>
              
              <!-- Card de informações -->
              <table role="presentation" style="width: 100%; background-color: #f8f9fa; border-radius: 6px; border-left: 4px solid #667eea; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    
                    <p style="margin: 0 0 12px; font-size: 14px; color: #6c757d;">
                      <strong style="color: #495057;">Estabelecimento:</strong>
                    </p>
                    <p style="margin: 0 0 20px; font-size: 16px; color: #212529; font-weight: 600;">
                      ${businessName}
                    </p>
                    
                    <p style="margin: 0 0 12px; font-size: 14px; color: #6c757d;">
                      <strong style="color: #495057;">E-mail:</strong>
                    </p>
                    <p style="margin: 0 0 20px; font-size: 16px; color: #212529;">
                      <a href="mailto:${businessEmail}" style="color: #667eea; text-decoration: none;">
                        ${businessEmail}
                      </a>
                    </p>
                    
                    ${customerEmail ? `
                    <p style="margin: 0 0 12px; font-size: 14px; color: #6c757d;">
                      <strong style="color: #495057;">E-mail do Cliente:</strong>
                    </p>
                    <p style="margin: 0 0 20px; font-size: 16px; color: #212529;">
                      <a href="mailto:${customerEmail}" style="color: #667eea; text-decoration: none;">
                        ${customerEmail}
                      </a>
                    </p>
                    ` : ''}
                    
                    <p style="margin: 0 0 12px; font-size: 14px; color: #6c757d;">
                      <strong style="color: #495057;">Plano Contratado:</strong>
                    </p>
                    <p style="margin: 0 0 20px; font-size: 16px; color: #212529; font-weight: 600;">
                      ${planName}
                    </p>
                    
                    <p style="margin: 0 0 12px; font-size: 14px; color: #6c757d;">
                      <strong style="color: #495057;">Valor Mensal:</strong>
                    </p>
                    <p style="margin: 0; font-size: 24px; color: #28a745; font-weight: 700;">
                      R$ ${priceFormatted}
                    </p>
                    
                  </td>
                </tr>
              </table>
              
              <!-- Informações técnicas -->
              <table role="presentation" style="width: 100%; background-color: #fff3cd; border-radius: 6px; border: 1px solid #ffc107; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; font-size: 14px; color: #856404;">
                      <strong>ID da Assinatura:</strong><br>
                      <code style="background-color: #ffffff; padding: 4px 8px; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 13px;">
                        ${subscriptionId}
                      </code>
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #6c757d;">
                O pagamento foi processado com sucesso e a assinatura está <strong style="color: #28a745;">ativa</strong>.
              </p>
              
              <!-- Botão -->
              <table role="presentation" style="width: 100%; margin: 0 0 24px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.PRODUCTION_DOMAIN || 'https://aparecidadonortesp.com.br'}/admin" 
                       style="display: inline-block; padding: 14px 32px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      Ver no Painel Admin
                    </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #6c757d;">
                <strong>Explore Aparecida</strong>
              </p>
              <p style="margin: 0; font-size: 12px; color: #adb5bd;">
                Notificação automática do sistema de assinaturas
              </p>
              <p style="margin: 12px 0 0; font-size: 12px; color: #adb5bd;">
                ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
    `.trim();

    // Versão texto alternativa
    const text = `
🎉 NOVA ASSINATURA - Explore Aparecida

Uma nova assinatura foi realizada!

DADOS DO ESTABELECIMENTO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Estabelecimento: ${businessName}
• E-mail: ${businessEmail}
${customerEmail ? `• E-mail do Cliente: ${customerEmail}\n` : ''}• Plano: ${planName}
• Valor Mensal: R$ ${priceFormatted}

INFORMAÇÕES TÉCNICAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• ID da Assinatura: ${subscriptionId}
• Status: ATIVA ✓

Data: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}

---
Explore Aparecida - Sistema de Assinaturas
${process.env.PRODUCTION_DOMAIN || 'https://aparecidadonortesp.com.br'}
    `.trim();

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Explore Aparecida <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      subject: `🎉 Nova Assinatura: ${businessName} - ${planName}`,
      html,
      text
    });

    if (error) {
      console.error('❌ Erro do Resend:', error);
      return {
        success: false,
        error: error
      };
    }

    console.log('✅ E-mail enviado com sucesso!');
    console.log('   Email ID:', data?.id);
    console.log('   Para:', process.env.ADMIN_EMAIL);
    
    return {
      success: true,
      emailId: data?.id,
      recipient: process.env.ADMIN_EMAIL
    };

  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
    
    // Não lançar erro para não quebrar o webhook
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Envia e-mail de teste para validar configuração
 * 
 * @param {string} recipientEmail - E-mail de destino do teste
 * @returns {Promise<Object>} Resultado do envio
 */
export async function sendTestEmail(recipientEmail) {
  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Explore Aparecida <onboarding@resend.dev>',
      to: recipientEmail,
      subject: '🧪 Teste de E-mail - Explore Aparecida',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Teste de E-mail</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 40px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h1 style="color: #667eea; margin-bottom: 20px;">✅ Teste Bem-Sucedido!</h1>
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Parabéns! O serviço de e-mail está configurado corretamente.
    </p>
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      <strong>Configuração atual:</strong><br>
      API Key: ${process.env.RESEND_API_KEY ? '✓ Configurada' : '✗ Não configurada'}<br>
      From Email: ${process.env.FROM_EMAIL || 'onboarding@resend.dev'}<br>
      Data/Hora: ${new Date().toLocaleString('pt-BR')}
    </p>
  </div>
</body>
</html>
      `,
      text: `
✅ TESTE BEM-SUCEDIDO!

Parabéns! O serviço de e-mail está configurado corretamente.

Configuração atual:
- API Key: ${process.env.RESEND_API_KEY ? '✓ Configurada' : '✗ Não configurada'}
- From Email: ${process.env.FROM_EMAIL || 'onboarding@resend.dev'}
- Data/Hora: ${new Date().toLocaleString('pt-BR')}

---
Explore Aparecida - Sistema de E-mails
      `
    });

    if (error) {
      console.error('❌ Erro do Resend:', error);
      return {
        success: false,
        error: error
      };
    }

    return {
      success: true,
      emailId: data?.id,
      emailId: result.data?.id,
      message: 'E-mail de teste enviado com sucesso!'
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Envia e-mail de confirmação de assinatura para o cliente
 * 
 * @param {Object} params - Parâmetros do e-mail
 * @param {string} params.customerEmail - E-mail do cliente
 * @param {string} params.businessName - Nome do estabelecimento
 * @param {string} params.planName - Nome do plano
 * @param {number} params.planPrice - Valor do plano (em centavos)
 * @param {string} params.nextChargeDate - Data da próxima cobrança
 * @returns {Promise<Object>} Resultado do envio
 */
export async function sendSubscriptionConfirmationToCustomer({
  customerEmail,
  businessName,
  planName,
  planPrice,
  nextChargeDate
}) {
  try {
    const resend = getResendClient();
    const priceFormatted = (planPrice / 100).toFixed(2).replace('.', ',');
    const nextChargeDateFormatted = new Date(nextChargeDate).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Assinatura Confirmada</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        
        <!-- Container principal -->
        <table role="presentation" style="width: 600px; max-width: 90%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                🎉 Bem-vindo!
              </h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 18px; opacity: 0.95;">
                Sua assinatura foi confirmada
              </p>
            </td>
          </tr>
          
          <!-- Conteúdo -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #333333;">
                Olá, <strong>${businessName}</strong>! 👋
              </p>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #333333;">
                Parabéns! Sua assinatura no <strong>Explore Aparecida</strong> foi ativada com sucesso. 
                Agora seu estabelecimento faz parte da nossa plataforma!
              </p>
              
              <!-- Card de informações do plano -->
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 30px;">
                    
                    <p style="margin: 0 0 8px; font-size: 14px; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 1px;">
                      Seu Plano
                    </p>
                    <h2 style="margin: 0 0 20px; font-size: 28px; color: #ffffff; font-weight: 700;">
                      ${planName}
                    </h2>
                    
                    <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px;">
                      <p style="margin: 0 0 8px; font-size: 14px; color: rgba(255,255,255,0.9);">
                        Valor Mensal
                      </p>
                      <p style="margin: 0; font-size: 36px; color: #ffffff; font-weight: 700;">
                        R$ ${priceFormatted}
                      </p>
                    </div>
                    
                  </td>
                </tr>
              </table>
              
              <!-- Informações importantes -->
              <table role="presentation" style="width: 100%; background-color: #f8f9fa; border-radius: 6px; border-left: 4px solid #28a745; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    
                    <p style="margin: 0 0 16px; font-size: 16px; color: #212529; font-weight: 600;">
                      📅 Informações da Cobrança
                    </p>
                    
                    <p style="margin: 0 0 8px; font-size: 14px; color: #6c757d;">
                      <strong style="color: #495057;">Status do Pagamento:</strong><br>
                      <span style="color: #28a745; font-weight: 600;">✓ Aprovado</span>
                    </p>
                    
                    <p style="margin: 0; font-size: 14px; color: #6c757d;">
                      <strong style="color: #495057;">Próxima Cobrança:</strong><br>
                      ${nextChargeDateFormatted}
                    </p>
                    
                  </td>
                </tr>
              </table>
              
              <!-- O que você ganha -->
              <h3 style="margin: 0 0 16px; font-size: 20px; color: #212529; font-weight: 600;">
                🎁 O Que Você Ganha
              </h3>
              
              <table role="presentation" style="width: 100%; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #28a745; font-size: 20px; margin-right: 10px;">✓</span>
                    <span style="color: #495057; font-size: 15px;">Visibilidade para milhares de turistas</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #28a745; font-size: 20px; margin-right: 10px;">✓</span>
                    <span style="color: #495057; font-size: 15px;">Página dedicada com fotos e informações</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #28a745; font-size: 20px; margin-right: 10px;">✓</span>
                    <span style="color: #495057; font-size: 15px;">Destaque nos resultados de busca</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #28a745; font-size: 20px; margin-right: 10px;">✓</span>
                    <span style="color: #495057; font-size: 15px;">Suporte dedicado da nossa equipe</span>
                  </td>
                </tr>
              </table>
              
              <!-- Próximos passos -->
              <table role="presentation" style="width: 100%; background-color: #fff3cd; border-radius: 6px; border: 1px solid #ffc107; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px; font-size: 16px; color: #856404; font-weight: 600;">
                      📋 Próximos Passos
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #856404; line-height: 1.6;">
                      1. Mantenha seus dados atualizados<br>
                      2. Adicione fotos de qualidade do seu estabelecimento<br>
                      3. Responda aos comentários dos clientes<br>
                      4. Acompanhe suas estatísticas
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Botão -->
              <table role="presentation" style="width: 100%; margin: 0 0 24px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.PRODUCTION_DOMAIN || 'https://aparecidadonortesp.com.br'}" 
                       style="display: inline-block; padding: 16px 40px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      Acessar Plataforma
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #6c757d;">
                <strong>Precisa de ajuda?</strong><br>
                Nossa equipe está à disposição para qualquer dúvida ou suporte que você precisar.
              </p>
              
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6c757d;">
                Atenciosamente,<br>
                <strong style="color: #495057;">Equipe Explore Aparecida</strong>
              </p>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #6c757d;">
                <strong>Explore Aparecida</strong>
              </p>
              <p style="margin: 0 0 8px; font-size: 12px; color: #adb5bd;">
                Conectando turistas aos melhores estabelecimentos
              </p>
              <p style="margin: 0; font-size: 12px; color: #adb5bd;">
                ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
    `.trim();

    const text = `
🎉 BEM-VINDO AO EXPLORE APARECIDA!

Olá, ${businessName}!

Sua assinatura foi confirmada com sucesso!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETALHES DA SUA ASSINATURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Plano: ${planName}
💰 Valor Mensal: R$ ${priceFormatted}
✅ Status: Pagamento Aprovado
📅 Próxima Cobrança: ${nextChargeDateFormatted}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
O QUE VOCÊ GANHA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Visibilidade para milhares de turistas
✓ Página dedicada com fotos e informações
✓ Destaque nos resultados de busca
✓ Suporte dedicado da nossa equipe

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRÓXIMOS PASSOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Mantenha seus dados atualizados
2. Adicione fotos de qualidade do seu estabelecimento
3. Responda aos comentários dos clientes
4. Acompanhe suas estatísticas

Acesse a plataforma: ${process.env.PRODUCTION_DOMAIN || 'https://aparecidadonortesp.com.br'}

---
Precisa de ajuda? Nossa equipe está à disposição!

Atenciosamente,
Equipe Explore Aparecida

${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
    `.trim();

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Explore Aparecida <onboarding@resend.dev>',
      to: customerEmail,
      subject: `🎉 Assinatura Confirmada - ${planName}`,
      html,
      text
    });

    if (error) {
      console.error('❌ Erro do Resend:', error);
      return {
        success: false,
        error: error
      };
    }

    console.log('✅ E-mail de confirmação enviado ao cliente!');
    console.log('   Email ID:', data?.id);
    console.log('   Para:', customerEmail);
    
    return {
      success: true,
      emailId: data?.id,
      recipient: customerEmail
    };

  } catch (error) {
    console.error('❌ Erro ao enviar e-mail ao cliente:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Envia e-mail de boas-vindas para novo inscrito na newsletter
 * 
 * @param {Object} params - Parâmetros do e-mail
 * @param {string} params.email - E-mail do inscrito
 * @returns {Promise<Object>} Resultado do envio
 */
export async function sendNewsletterWelcomeEmail({ email }) {
  try {
    const resend = getResendClient();
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo à Newsletter - Explore Aparecida</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                                🎉 Bem-vindo à Newsletter!
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">
                                Explore Aparecida do Norte
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                Olá! 👋
                            </p>
                            
                            <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                Obrigado por se inscrever na newsletter do <strong>Explore Aparecida</strong>!
                            </p>

                            <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                A partir de agora você receberá:
                            </p>

                            <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 1.8;">
                                <li>📍 <strong>Novos estabelecimentos parceiros</strong> - Restaurantes, hotéis e lojas</li>
                                <li>🎊 <strong>Eventos especiais</strong> - Romarias, festas e celebrações</li>
                                <li>💡 <strong>Dicas de turismo</strong> - Roteiros e pontos turísticos</li>
                                <li>🎁 <strong>Promoções exclusivas</strong> - Ofertas especiais dos nossos parceiros</li>
                            </ul>

                            <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                                    💡 <strong>Dica:</strong> Adicione nosso e-mail à sua lista de contatos para não perder nenhuma novidade!
                                </p>
                            </div>

                            <p style="margin: 20px 0 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                Estamos felizes em ter você conosco! 🙏
                            </p>
                        </td>
                    </tr>

                    <!-- CTA -->
                    <tr>
                        <td style="padding: 0 30px 40px 30px; text-align: center;">
                            <a href="https://www.aparecidadonortesp.com.br" 
                               style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                                Visitar o Site
                            </a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                                <strong>Explore Aparecida</strong><br>
                                Portal de Turismo de Aparecida do Norte - SP
                            </p>
                            
                            <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                                Não quer mais receber nossos e-mails?<br>
                                <a href="https://www.aparecidadonortesp.com.br" style="color: #6b7280; text-decoration: underline;">
                                    Cancelar inscrição
                                </a>
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const textContent = `
🎉 BEM-VINDO À NEWSLETTER - EXPLORE APARECIDA

Olá!

Obrigado por se inscrever na newsletter do Explore Aparecida!

A partir de agora você receberá:

• Novos estabelecimentos parceiros - Restaurantes, hotéis e lojas
• Eventos especiais - Romarias, festas e celebrações
• Dicas de turismo - Roteiros e pontos turísticos
• Promoções exclusivas - Ofertas especiais dos nossos parceiros

Estamos felizes em ter você conosco!

Visite nosso site: https://www.aparecidadonortesp.com.br

---
Explore Aparecida
Portal de Turismo de Aparecida do Norte - SP

Para cancelar sua inscrição, acesse: https://www.aparecidadonortesp.com.br
    `.trim();

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Explore Aparecida <contato@aparecidadonortesp.com.br>',
      to: email,
      subject: '🎉 Bem-vindo à Newsletter do Explore Aparecida!',
      html: htmlContent,
      text: textContent
    });

    if (error) {
      console.error('❌ Erro do Resend ao enviar e-mail de newsletter:', error);
      return { success: false, error };
    }

    console.log(`✅ E-mail de boas-vindas enviado para: ${email}`);
    
    return {
      success: true,
      emailId: data?.id,
      recipient: email
    };

  } catch (error) {
    console.error('❌ Erro ao enviar e-mail de newsletter:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}
