import { markEbookPurchasePaid } from '../services/ebookPurchaseService.js';

/**
 * Trata eventos Stripe relacionados ao Kit do Romeiro (pagamento único).
 * 
 * ⚠️ PREMISSA: Chamado APENAS quando event.data.object?.metadata?.type === 'ebook'
 * A verificação rígida é feita no webhook principal (server/index.js)
 * 
 * @param {import('stripe').Stripe.Event} event
 * @returns {Promise<void>}
 * @throws {Error} Se evento não for suportado ou processamento falhar
 */
export async function handleEbookStripeEvent(event) {
  const session = event.data.object;
  
  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      console.log(`✅ [EBOOK] ${event.type} — processando compra do Kit Romeiro`);
      console.log(`   Session ID: ${session.id}`);
      console.log(`   Payment Status: ${session.payment_status}`);
      console.log(`   Amount: ${(session.amount_total / 100).toFixed(2)} BRL`);
      
      await markEbookPurchasePaid(session);
      return;
    }

    case 'checkout.session.async_payment_failed': {
      console.warn(`⚠️ [EBOOK] Pagamento assíncrono falhou para session ${session.id}`);
      console.log(`   Tipo de pagamento: ${session.payment_method_types?.join(', ') || 'desconhecido'}`);
      // Aqui você poderia adicionar lógica de retry ou notificação ao usuário
      return;
    }

    default: {
      console.warn(`⚠️ [EBOOK] Evento ${event.type} não é tratado para ebook. Ignorando.`);
      return;
    }
  }
}
