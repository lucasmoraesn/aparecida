import express from 'express';
import {
  createPendingEbookPurchase,
  createEbookDownloadSignedUrl,
  getEbookPurchaseBySessionId,
  isEbookPurchasePaid,
  reconcileEbookPurchaseFromStripe,
} from '../services/ebookPurchaseService.js';

/**
 * @param {{ stripe: import('stripe').default }} deps
 */
export function createEbookRouter({ stripe }) {
  const router = express.Router();

  router.post('/create-checkout', async (req, res) => {
    try {
      const priceCents = parseInt(process.env.EBOOK_PRICE_CENTS || '1990', 10);
      const publicUrl =
        process.env.PUBLIC_URL_NGROK ||
        process.env.FRONTEND_URL ||
        process.env.PRODUCTION_DOMAIN ||
        'http://localhost:5173';

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: 'Kit Oficial do Romeiro 2026',
                description:
                  'O guia digital definitivo para planejar sua romaria em Aparecida SP com segurança, economia e fé.',
              },
              unit_amount: priceCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${publicUrl}/ebook/sucesso?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${publicUrl}/ebook/cancelado`,
        metadata: { type: 'ebook' },
      });

      await createPendingEbookPurchase(session.id);

      res.json({ success: true, checkoutUrl: session.url });
    } catch (err) {
      console.error('❌ Erro ao criar checkout de Ebook:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erro ao iniciar checkout de pagamento',
        message: err.message,
      });
    }
  });

  router.get('/check-session', async (req, res) => {
    try {
      const sessionId = req.query.session_id;

      if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'session_id é obrigatório',
        });
      }

      let purchase = await getEbookPurchaseBySessionId(sessionId);

      if (!purchase) {
        const reconciled = await reconcileEbookPurchaseFromStripe(stripe, sessionId);
        if (!reconciled.found) {
          return res.status(404).json({ success: false, error: 'Compra não encontrada' });
        }
        return res.json({
          success: true,
          status: reconciled.status,
          email: reconciled.email,
        });
      }

      if (!isEbookPurchasePaid(purchase.status)) {
        const reconciled = await reconcileEbookPurchaseFromStripe(stripe, sessionId);
        if (reconciled.status === 'paid') {
          purchase = await getEbookPurchaseBySessionId(sessionId);
        }
      }

      return res.json({
        success: true,
        status: isEbookPurchasePaid(purchase?.status) ? 'paid' : purchase?.status || 'pending',
        email: purchase?.email,
      });
    } catch (err) {
      console.error('❌ Erro ao verificar sessão do Ebook:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erro ao verificar compra',
        message: err.message,
      });
    }
  });

  router.get('/download', async (req, res) => {
    try {
      const sessionId = req.query.session_id;

      if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ error: 'session_id é obrigatório' });
      }

      const purchase = await getEbookPurchaseBySessionId(sessionId);

      if (!purchase) {
        return res.status(403).json({ error: 'Compra não encontrada' });
      }

      if (!isEbookPurchasePaid(purchase.status)) {
        const reconciled = await reconcileEbookPurchaseFromStripe(stripe, sessionId);
        if (reconciled.status !== 'paid') {
          return res.status(403).json({ error: 'Pagamento pendente ou não confirmado' });
        }
      }

      const signedUrl = await createEbookDownloadSignedUrl();
      return res.redirect(signedUrl);
    } catch (err) {
      console.error('❌ Erro no download do Ebook:', err.message);
      res.status(500).json({
        error: 'Erro ao gerar link de download',
        message: err.message,
      });
    }
  });

  return router;
}

export default createEbookRouter;
