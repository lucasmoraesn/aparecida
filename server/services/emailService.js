/**
 * 📧 EMAIL SERVICE (compatibilidade retroativa)
 *
 * Re-exporta as funções do resendEmailService.js para manter
 * compatibilidade com imports existentes no código.
 *
 * Todos os e-mails são enviados via Resend.
 * Documentação: https://resend.com/docs
 */

export {
  sendEmail,
  sendPaymentConfirmation,
  sendSubscriptionCanceled,
  sendTestEmail,
  sendNewSubscriptionNotification,
  sendSubscriptionConfirmationToCustomer,
  sendNewsletterWelcomeEmail,
  sendNewMotoristaNotification,
  sendMotoristaAnaliseEmail,
  sendNewBusinessNotification,
  sendBusinessAnalisisEmail,
  sendEbookPurchaseConfirmation,
} from './resendEmailService.js';
