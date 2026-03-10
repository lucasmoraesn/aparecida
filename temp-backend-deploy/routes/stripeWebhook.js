/**
 * 🔗 STRIPE WEBHOOK — Alias/Redirect
 *
 * Este arquivo agora redireciona POST /webhook/stripe → POST /api/webhook
 * A lógica completa do webhook foi centralizada no index.js (POST /api/webhook).
 *
 * Mantido para compatibilidade caso o endpoint antigo esteja configurado
 * em algum lugar (Stripe Dashboard, Nginx, etc).
 */

import express from 'express';

const router = express.Router();

// Redireciona com 307 (preserva método POST e body)
router.post(
    '/webhook/stripe',
    express.raw({ type: 'application/json' }),
    (req, res) => {
        console.log('↪️  [Alias] POST /webhook/stripe → redirecionando para /api/webhook');
        res.redirect(307, '/api/webhook');
    }
);

export default router;
