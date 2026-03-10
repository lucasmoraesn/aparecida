# Explore Aparecida — Backend

Backend Node.js + Express para o SaaS **Explore Aparecida**.

## Stack

- **Runtime:** Node.js 18+ (ESM)
- **Framework:** Express
- **Banco de dados:** Supabase (PostgreSQL)
- **Pagamentos:** Stripe (Checkout + Webhooks)
- **E-mail:** Amazon SES (AWS SDK v3, autenticação via IAM Role)

---

## Estrutura

```
server/
├── index.js                  # Servidor principal + webhook Stripe
├── services/
│   ├── sesEmailService.js    # Serviço de e-mail (Amazon SES)
│   └── emailService.js       # Re-export para compatibilidade
├── emails/
│   ├── paymentConfirmation.js   # Template: confirmação de pagamento
│   ├── subscriptionCanceled.js  # Template: cancelamento de assinatura
│   └── testEmail.js             # Template: e-mail de teste
├── routes/
│   └── stripeWebhook.js      # Rota dedicada para webhook Stripe
├── scripts/
│   └── test-ses-email.js     # Script de teste do SES
├── DNS_SES_CONFIG.md         # Guia de configuração DNS para SES
└── env.example               # Exemplo de variáveis de ambiente
```

---

## Instalação

```bash
cd server
npm install
```

---

## Configuração

Copie o arquivo de exemplo e preencha com seus valores:

```bash
cp env.example .env
```

**Variáveis obrigatórias:**

```env
# Servidor
PORT=3001
NODE_ENV=production
PRODUCTION_DOMAIN=https://aparecidadonortesp.com.br
FRONTEND_URL=https://aparecidadonortesp.com.br

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Amazon SES (autenticação via IAM Role da EC2 — sem credenciais aqui)
AWS_REGION=us-east-2
EMAIL_FROM=Explore Aparecida <noreply@aparecidadonortesp.com.br>
ADMIN_EMAIL=admin@aparecidadonortesp.com.br
```

---

## Execução

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

---

## E-mail (Amazon SES)

O serviço de e-mail usa **Amazon SES** com autenticação via **IAM Role da EC2**.

- **Sem credenciais AWS no `.env`** — o SDK detecta automaticamente via IMDS
- **Região:** `us-east-2` (Ohio)
- **Permissões IAM necessárias:** `ses:SendEmail`, `ses:SendRawEmail`

### Testar envio (na EC2):

```bash
node test-email.js seu@email.com
```

### Configuração DNS:

Consulte o arquivo [`DNS_SES_CONFIG.md`](./DNS_SES_CONFIG.md) para os registros DKIM, MX, SPF e DMARC necessários.

---

## Webhook Stripe

O endpoint `/api/webhook` recebe eventos do Stripe e:

1. Verifica a assinatura com `stripe.webhooks.constructEvent`
2. Atualiza o banco de dados (Supabase)
3. Envia e-mails transacionais via SES

**Eventos tratados:**
- `checkout.session.completed` → ativa assinatura + envia e-mail ao admin e ao cliente
- `customer.subscription.deleted` → cancela assinatura no banco
- `invoice.payment_succeeded` → registra pagamento recorrente
- `invoice.payment_failed` → registra falha de pagamento

---

## Scripts disponíveis

```bash
npm run dev          # Servidor com hot-reload (nodemon)
npm start            # Servidor de produção
npm test             # Testes unitários (vitest)
node test-email.js   # Teste de envio via SES (rodar na EC2)
```
