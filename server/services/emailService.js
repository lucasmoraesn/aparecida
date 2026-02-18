/**
 * 📧 EMAIL SERVICE (compatibilidade retroativa)
 *
 * Re-exporta as funções do sesEmailService.js para manter
 * compatibilidade com imports existentes no index.js.
 *
 * Todos os e-mails são enviados via Amazon SES com IAM Role da EC2.
 */

export {
  sendEmail,
  sendPaymentConfirmation,
  sendSubscriptionCanceled,
  sendTestEmail,
  sendNewSubscriptionNotification,
  sendSubscriptionConfirmationToCustomer,
} from './sesEmailService.js';
