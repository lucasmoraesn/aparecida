import { getSupabaseAdmin } from '../lib/supabaseAdmin.js';
import { sendEbookPurchaseConfirmation } from './emailService.js';

export const EBOOK_PAID_STATUSES = new Set(['paid', 'approved']);

export const EBOOK_STORAGE_BUCKET = process.env.SUPABASE_EBOOKS_BUCKET || 'ebooks';
export const EBOOK_FILE_NAME = 'kit-romeiro-2026.pdf';
export const EBOOK_SIGNED_URL_TTL_SECONDS = 86400;

export function isEbookPurchasePaid(status) {
  return EBOOK_PAID_STATUSES.has(status);
}

/**
 * @param {import('stripe').Stripe.Checkout.Session} session
 */
export async function markEbookPurchasePaid(session) {
  if (session.payment_status !== 'paid') {
    console.log(
      `ℹ️ Sessão ${session.id} ainda não está paga (payment_status=${session.payment_status}).`
    );
    return { updated: false, reason: 'not_paid' };
  }

  const buyerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    session.metadata?.buyer_email;
  const amountPaid = (session.amount_total ?? 0) / 100;
  const paymentIntent =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const payload = {
    status: 'paid',
    email: buyerEmail,
    amount_paid: amountPaid,
    stripe_payment_intent: paymentIntent,
    stripe_customer_id:
      typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null,
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('ebook_purchases')
    .update(payload)
    .eq('stripe_checkout_session_id', session.id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('❌ Erro ao atualizar compra do Ebook no Supabase:', error);
    throw error;
  }

  if (!data) {
    const { error: upsertError } = await supabase.from('ebook_purchases').upsert(
      {
        stripe_checkout_session_id: session.id,
        ...payload,
      },
      { onConflict: 'stripe_checkout_session_id' }
    );

    if (upsertError) {
      console.error('❌ Erro ao criar compra do Ebook via upsert:', upsertError);
      throw upsertError;
    }
  }

  if (buyerEmail) {
    try {
      await sendEbookPurchaseConfirmation({
        email: buyerEmail,
        checkoutSessionId: session.id,
        amountPaid,
      });
    } catch (emailErr) {
      console.error('❌ Erro ao enviar e-mail de confirmação do Ebook:', emailErr);
    }
  }

  return { updated: true, email: buyerEmail, amountPaid };
}

export async function createPendingEbookPurchase(sessionId) {
  const { error } = await getSupabaseAdmin().from('ebook_purchases').insert({
    stripe_checkout_session_id: sessionId,
    status: 'pending',
    amount_paid: 0,
  });

  if (error && error.code !== '23505') {
    throw error;
  }
}

export async function getEbookPurchaseBySessionId(sessionId) {
  const { data, error } = await getSupabaseAdmin()
    .from('ebook_purchases')
    .select('*')
    .eq('stripe_checkout_session_id', sessionId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function reconcileEbookPurchaseFromStripe(stripe, sessionId) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    return { found: false };
  }

  if (session.payment_status === 'paid') {
    await markEbookPurchasePaid(session);
    return {
      found: true,
      status: 'paid',
      email:
        session.customer_details?.email ||
        session.customer_email ||
        session.metadata?.buyer_email,
    };
  }

  return { found: true, status: 'pending' };
}

export async function createEbookDownloadSignedUrl() {
  const { data, error } = await getSupabaseAdmin().storage
    .from(EBOOK_STORAGE_BUCKET)
    .createSignedUrl(EBOOK_FILE_NAME, EBOOK_SIGNED_URL_TTL_SECONDS, {
      download: 'Kit-Oficial-do-Romeiro-2026.pdf', // Nome amigável para download
    });

  if (error || !data?.signedUrl) {
    throw error || new Error('Signed URL não gerada');
  }

  return data.signedUrl;
}
