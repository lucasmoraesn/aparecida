/**
 * 🔗 STRIPE WEBHOOK — Rota dedicada com validação de assinatura
 *
 * Endpoint: POST /webhook/stripe
 *
 * IMPORTANTE: Esta rota DEVE usar express.raw() (não express.json()).
 * A verificação de assinatura do Stripe exige o body bruto (Buffer).
 *
 * Variáveis de ambiente necessárias:
 *   STRIPE_SECRET_KEY      — Chave secreta do Stripe (sk_live_... ou sk_test_...)
 *   STRIPE_WEBHOOK_SECRET  — Segredo do webhook (whsec_...)
 *                            Obtido em: Dashboard Stripe > Webhooks > Signing secret
 */

import express from 'express';
import Stripe from 'stripe';
import {
    sendPaymentConfirmation,
    sendSubscriptionCanceled,
    sendNewSubscriptionNotification,
} from '../services/sesEmailService.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Inicialização do Stripe (lazy singleton)
// ─────────────────────────────────────────────────────────────────────────────

let _stripe = null;

function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY não configurada no .env');
    }
    if (!_stripe) {
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
    }
    return _stripe;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /webhook/stripe
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/webhook/stripe',
    express.raw({ type: 'application/json' }), // ← obrigatório para verificação de assinatura
    async (req, res) => {
        const stripe = getStripe();
        const sig = req.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('❌ [Webhook] STRIPE_WEBHOOK_SECRET não configurado');
            return res.status(500).json({ error: 'Webhook secret não configurado' });
        }

        // ── 1. Verificar assinatura ──────────────────────────────────────────────
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } catch (err) {
            console.error(`❌ [Webhook] Assinatura inválida: ${err.message}`);
            return res.status(400).json({ error: `Webhook Error: ${err.message}` });
        }

        console.log(`📨 [Webhook] Evento recebido: ${event.type} (${event.id})`);

        // ── 2. Processar eventos ─────────────────────────────────────────────────
        try {
            switch (event.type) {

                // ── Pagamento confirmado (pagamento único) ───────────────────────────
                case 'payment_intent.succeeded': {
                    const pi = event.data.object;
                    console.log(`💰 [Webhook] payment_intent.succeeded — ${pi.id} — R$ ${(pi.amount / 100).toFixed(2)}`);

                    const customerEmail = pi.receipt_email || pi.metadata?.customer_email;
                    const customerName = pi.metadata?.customer_name || 'Cliente';
                    const planName = pi.metadata?.plan_name || 'Plano Explore Aparecida';

                    if (customerEmail) {
                        await sendPaymentConfirmation({
                            customerEmail,
                            customerName,
                            planName,
                            amount: pi.amount,
                            invoiceId: pi.id,
                        });
                    } else {
                        console.warn('⚠️  [Webhook] payment_intent sem e-mail do cliente — e-mail não enviado');
                    }
                    break;
                }

                // ── Fatura paga (assinatura recorrente) ──────────────────────────────
                case 'invoice.payment_succeeded': {
                    const invoice = event.data.object;
                    console.log(`🧾 [Webhook] invoice.payment_succeeded — ${invoice.id}`);

                    // Só processa faturas de renovação de assinatura
                    if (invoice.subscription && invoice.billing_reason === 'subscription_cycle') {
                        const customerEmail = invoice.customer_email;
                        const customerName = invoice.customer_name || 'Cliente';
                        const planName = invoice.lines?.data?.[0]?.description || 'Plano Explore Aparecida';
                        const nextCharge = new Date(invoice.period_end * 1000).toISOString();

                        if (customerEmail) {
                            await sendPaymentConfirmation({
                                customerEmail,
                                customerName,
                                planName,
                                amount: invoice.amount_paid,
                                invoiceId: invoice.id,
                                nextCharge,
                            });
                        }
                    }
                    break;
                }

                // ── Falha de pagamento ───────────────────────────────────────────────
                case 'invoice.payment_failed': {
                    const invoice = event.data.object;
                    console.warn(`⚠️  [Webhook] invoice.payment_failed — ${invoice.id} — cliente: ${invoice.customer_email}`);
                    // TODO: implementar e-mail de aviso de falha de pagamento
                    break;
                }

                // ── Nova assinatura criada ───────────────────────────────────────────
                case 'customer.subscription.created': {
                    const sub = event.data.object;
                    console.log(`🆕 [Webhook] customer.subscription.created — ${sub.id}`);

                    const customer = await stripe.customers.retrieve(sub.customer);
                    const planName = sub.items?.data?.[0]?.price?.nickname || 'Plano Explore Aparecida';
                    const amount = sub.items?.data?.[0]?.price?.unit_amount || 0;

                    await sendNewSubscriptionNotification({
                        businessName: customer.name || 'Novo Cliente',
                        businessEmail: customer.email || '',
                        planName,
                        planPrice: amount,
                        subscriptionId: sub.id,
                        customerEmail: customer.email,
                    });
                    break;
                }

                // ── Assinatura cancelada ─────────────────────────────────────────────
                case 'customer.subscription.deleted': {
                    const sub = event.data.object;
                    console.log(`❌ [Webhook] customer.subscription.deleted — ${sub.id}`);

                    const customer = await stripe.customers.retrieve(sub.customer);
                    const planName = sub.items?.data?.[0]?.price?.nickname || 'Plano Explore Aparecida';
                    const canceledAt = sub.canceled_at
                        ? new Date(sub.canceled_at * 1000).toISOString()
                        : new Date().toISOString();

                    if (customer.email) {
                        await sendSubscriptionCanceled({
                            customerEmail: customer.email,
                            customerName: customer.name || 'Cliente',
                            planName,
                            canceledAt,
                        });
                    }
                    break;
                }

                // ── Assinatura atualizada ────────────────────────────────────────────
                case 'customer.subscription.updated': {
                    const sub = event.data.object;
                    console.log(`🔄 [Webhook] customer.subscription.updated — ${sub.id} — status: ${sub.status}`);
                    break;
                }

                // ── Checkout concluído ───────────────────────────────────────────────
                case 'checkout.session.completed': {
                    const session = event.data.object;
                    console.log(`🛒 [Webhook] checkout.session.completed — ${session.id}`);
                    break;
                }

                default:
                    console.log(`ℹ️  [Webhook] Evento não tratado: ${event.type}`);
            }

            // Responder ao Stripe com sucesso (obrigatório dentro de 30s)
            res.json({ received: true, eventType: event.type });

        } catch (err) {
            console.error(`❌ [Webhook] Erro ao processar evento ${event.type}:`, err.message);
            // Retornar 200 mesmo com erro interno para o Stripe não reenviar o evento
            res.json({ received: true, error: err.message });
        }
    }
);

export default router;
