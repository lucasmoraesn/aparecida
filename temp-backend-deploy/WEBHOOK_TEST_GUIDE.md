/**
 * 🧪 TESTE LOCAL DE WEBHOOK — Stripe CLI
 *
 * Use este script para testar webhooks localmente com o Stripe CLI.
 * NÃO use em produção.
 *
 * Passo 1: Inicie o listener do Stripe CLI:
 *   stripe listen --forward-to http://localhost:3001/api/webhook
 *
 * Passo 2: Copie o webhook secret que o CLI mostrar (whsec_...) e
 *   cole em STRIPE_WEBHOOK_SECRET_CLI abaixo (ou no .env.local).
 *
 * Passo 3: Rode o servidor localmente com o secret do CLI:
 *   STRIPE_WEBHOOK_SECRET=<secret_do_cli> npm run dev
 *
 * Passo 4: Em outro terminal, dispare o evento:
 *   stripe trigger checkout.session.completed
 *
 * ⚠️ IMPORTANTE:
 *   - O secret do CLI começa com whsec_ mas é DIFERENTE do secret do painel.
 *   - NUNCA coloque o secret do CLI no .env da EC2 (produção).
 *   - O .env da EC2 deve sempre ter o secret do PAINEL do Stripe.
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║         GUIA DE TESTE LOCAL — WEBHOOK STRIPE CLI             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  PRODUÇÃO (EC2):                                             ║
║  STRIPE_WEBHOOK_SECRET = secret do PAINEL do Stripe          ║
║  Dashboard → Webhooks → seu endpoint → Signing secret        ║
║                                                              ║
║  DESENVOLVIMENTO LOCAL (Stripe CLI):                         ║
║  1. stripe listen --forward-to http://localhost:3001/api/webhook
║  2. Copie o "webhook signing secret" que o CLI mostrar       ║
║  3. Use: STRIPE_WEBHOOK_SECRET=whsec_cli... npm run dev      ║
║  4. stripe trigger checkout.session.completed                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);
