# Como Testar — Explore Aparecida Backend

## Pré-requisitos

- Node.js 18+
- Variáveis de ambiente configuradas no `.env` (veja `env.example`)
- Instância EC2 com IAM Role configurada para SES

---

## 1. Testar Envio de E-mail (Amazon SES)

> ⚠️ Este teste só funciona na **instância EC2** (onde a IAM Role está disponível).

```bash
# Na EC2, dentro do diretório server:
node test-email.js seu@email.com
```

**Resultado esperado:**
```
✅ E-mail de teste enviado com sucesso!
   MessageId: 0102019...
```

**Se falhar, verifique:**
1. IAM Role da EC2 tem permissão `ses:SendEmail`
2. Domínio verificado no SES (us-east-2)
3. Se estiver em sandbox, o destinatário precisa ser verificado
4. `EMAIL_FROM` usa endereço verificado no SES

---

## 2. Testar Webhook do Stripe

### Com Stripe CLI (local):

```bash
# Instalar Stripe CLI
# https://stripe.com/docs/stripe-cli

# Escutar e encaminhar eventos para o servidor local
stripe listen --forward-to http://localhost:3001/api/webhook

# Em outro terminal, disparar evento de teste
stripe trigger checkout.session.completed
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_succeeded
```

### Em produção:

Configure o webhook no [Dashboard Stripe](https://dashboard.stripe.com/webhooks):
- **URL:** `https://aparecidadonortesp.com.br/api/webhook`
- **Eventos:** `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`

---

## 3. Testar API de Planos

```bash
curl http://localhost:3001/api/plans
```

---

## 4. Testar Health Check

```bash
curl http://localhost:3001/health
# Resposta: {"ok":true}
```

---

## Variáveis de Ambiente Necessárias

| Variável | Descrição |
|---|---|
| `AWS_REGION` | Região do SES (`us-east-2`) |
| `EMAIL_FROM` | Remetente verificado no SES |
| `ADMIN_EMAIL` | E-mail do administrador |
| `STRIPE_SECRET_KEY` | Chave secreta do Stripe |
| `STRIPE_WEBHOOK_SECRET` | Segredo do webhook Stripe |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_KEY` | Service role key do Supabase |
