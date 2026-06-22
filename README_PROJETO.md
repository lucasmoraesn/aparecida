# 🌴 Explore Aparecida

**Plataforma de Turismo Inteligente com Pagamentos Recorrentes**

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![Stripe](https://img.shields.io/badge/Stripe-💳-blueviolet)
![Resend](https://img.shields.io/badge/Resend-📧-orange)
![Supabase](https://img.shields.io/badge/Supabase-🗄️-green)

---

## 📌 Quick Links

- **🚀 [Como Começar](#como-começar)** — Setup local em 5 minutos
- **📧 [Configurar Emails (Resend)](#configurar-emails)** — Guia rápido
- **🚁 [Deploy em Produção](#deployment)** — Para EC2/Ubuntu
- **🧪 [Testar Sistema](#testes)** — Scripts de validação
- **📚 [Documentação Completa](#documentação)** — Referência técnica

---

## 🎯 O Projeto

Sistema completo de **Turismo + Pagamentos Recorrentes** com:

✅ **Autenticação** — Supabase Auth (Magic Links)  
✅ **Pagamentos** — Stripe (Cartão de Crédito)  
✅ **Assinaturas** — Recorrência automática com Webhook  
✅ **Emails** — Transacionais via Resend  
✅ **Dashboard** — React TypeScript + Tailwind  
✅ **Backend** — Node.js Express + Supabase  

---

## 🚀 Como Começar

### 1️⃣ Clonar e Instalar

```bash
git clone <seu-repo>
cd aparecida

# Frontend
npm install

# Backend
cd server && npm install && cd ..
```

### 2️⃣ Variáveis de Ambiente

```bash
# Raiz (Frontend)
cp env.example .env.local
# Editar com suas credenciais Supabase e Stripe

# Backend
cp server/.env.example server/.env
# Editar com Resend API Key
```

Variáveis mínimas necessárias:
```
# .env.local
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# server/.env
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
RESEND_API_KEY=...
```

### 3️⃣ Rodar Localmente

```bash
# Terminal 1: Frontend
npm run dev
# Acessa em http://localhost:5173

# Terminal 2: Backend
cd server && npm run dev
# Roda em http://localhost:3001
```

### 4️⃣ Testar Fluxo Completo

```bash
# No navegador
http://localhost:5173

# Fazer registro e pagamento com cartão de teste:
# Card: 4242 4242 4242 4242
# Exp: Qualquer futuro (ex: 12/25)
# CVC: Qualquer 3 dígitos
```

---

## 📧 Configurar Emails

### Pré-requisito: Conta Resend

1. Criar conta em https://resend.com
2. Ir em **API Keys** e copiar sua chave
3. (Opcional) Verificar domínio para volumes maiores

### Adicionar ao .env

```bash
# server/.env
RESEND_API_KEY=re_seu_api_key_aqui
RESEND_FROM=Explore Aparecida <noreply@seu-dominio.com.br>
ADMIN_EMAIL=seu-email@seu-dominio.com.br
```

### Testar Envio

```bash
cd server
node test-email.js seu@email.com
```

**Resultado esperado:**
```
✅ E-mail enviado com sucesso!
   MessageId: abc123def456...
```

Para teste interativo com menu:
```bash
node test-ses-complete.js
```

📖 Leia [GUIA_RAPIDO_RESEND.md](GUIA_RAPIDO_RESEND.md) para detalhes

---

## 🚁 Deployment

### Deploy em EC2 Ubuntu

#### Passo 1: Preparar localmente

```bash
npm run build
npm run deploy:prepare
```

Isso gera `aparecida-prod.zip` e `env.prod.reference`

#### Passo 2: Upload para EC2

```bash
scp -i sua-chave.pem aparecida-prod.zip ubuntu@seu-ip-ec2:/home/ubuntu/
```

#### Passo 3: Configurar na EC2

```bash
# SSH na EC2
ssh -i sua-chave.pem ubuntu@seu-ip-ec2

# Descompactar
cd /home/ubuntu
unzip aparecida-prod.zip

# Instalar dependências
npm install --omit=dev
cd server && npm install --omit=dev && cd ..

# Criar .env (preencher com valores reais)
nano .env
```

#### Passo 4: Iniciar com PM2

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar aplicação
pm2 start ecosystem.config.js

# Configurar auto-restart
pm2 startup
pm2 save
```

#### Passo 5: Configurar Nginx

Usar template em `nginx-aparecida-ssl.conf`

```bash
sudo cp nginx-aparecida-ssl.conf /etc/nginx/sites-available/aparecida
sudo ln -s /etc/nginx/sites-available/aparecida /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

📖 Leia [GUIA_DEPLOY_EC2_UBUNTU.md](GUIA_DEPLOY_EC2_UBUNTU.md) para passo-a-passo completo

---

## 🧪 Testes

### Verificar Variáveis de Ambiente

```bash
cd server
npm run check:env
```

### Testar Webhooks Stripe

```bash
# Simular pagamento
cd server
node simulate-payment.js <business_id>
```

### Teste de Pagamento Completo

1. Acesse http://localhost:5173
2. Registre um novo negócio
3. Escolha um plano e faça checkout
4. Use cartão de teste: `4242 4242 4242 4242`
5. Confirme pagamento
6. Verifique email de confirmação

---

## 📚 Documentação

### Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| [README.md](README.md) | Este arquivo |
| [GUIA_RAPIDO_RESEND.md](GUIA_RAPIDO_RESEND.md) | Como usar Resend para emails |
| [GUIA_DEPLOY_EC2_UBUNTU.md](GUIA_DEPLOY_EC2_UBUNTU.md) | Deploy completo em EC2 |
| [MIGRACAO_SES_PARA_RESEND_COMPLETA.md](MIGRACAO_SES_PARA_RESEND_COMPLETA.md) | Histórico da migração SES → Resend |
| [COMECE_AQUI_3_PASSOS.md](COMECE_AQUI_3_PASSOS.md) | Primeiros passos rápidos |
| [server/README.md](server/README.md) | Documentação do backend |

### Estrutura de Pastas

```
aparecida/
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/             # Páginas (rotas)
│   ├── lib/               # Utilitários, serviços
│   ├── App.tsx            # Componente raiz
│   └── main.tsx           # Entry point
│
├── server/                # Backend Express
│   ├── services/          # Lógica de negócio
│   │   └── emailService.js     # Integração Resend
│   ├── routes/            # Rotas API
│   ├── middleware/        # Middlewares (CORS, auth, etc)
│   ├── .env               # Variáveis (GITIGNORE)
│   ├── package.json       # Dependências
│   └── index.js           # Server principal
│
├── docs/                  # Documentação
├── public/                # Assets estáticos
├── .github/               # GitHub Actions, workflows
├── package.json           # Dependências frontend
├── vite.config.ts         # Config Vite
├── tsconfig.json          # Config TypeScript
├── tailwind.config.js     # Config Tailwind
└── README.md              # Este arquivo
```

---

## 🔐 Variáveis de Ambiente

### Frontend (.env.local)

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=seu_anon_key_aqui
```

### Backend (server/.env)

```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=seu_service_key_aqui

# Stripe
STRIPE_SECRET_KEY=sk_test_ou_sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (Emails)
RESEND_API_KEY=re_...
RESEND_FROM=Explore Aparecida <noreply@seu-dominio.com.br>
ADMIN_EMAIL=admin@seu-dominio.com.br

# Servidor
PORT=3001
NODE_ENV=development
PRODUCTION_DOMAIN=http://localhost:5173
```

---

## 🔗 APIs Principais

### POST /api/webhook
Webhook do Stripe para processar eventos de pagamento.

**Eventos tratados:**
- `checkout.session.completed` — Pagamento bem-sucedido
- `customer.subscription.updated` — Assinatura modificada
- `customer.subscription.deleted` — Assinatura cancelada
- `invoice.payment_succeeded` — Cobrança recorrente bem-sucedida
- `invoice.payment_failed` — Falha na cobrança recorrente

### GET /api/plans
Listar planos disponíveis.

```json
[
  {
    "id": "price_...",
    "name": "Básico",
    "price": 2999,
    "interval": "month"
  }
]
```

### POST /api/subscriptions
Criar assinatura (checkout session do Stripe).

---

## 🐛 Troubleshooting

### E-mail não está sendo enviado
1. Verificar `RESEND_API_KEY` em `server/.env`
2. Verificar `RESEND_FROM` está verificado no Resend
3. Rodar: `cd server && npm run check:env`
4. Testar: `node test-email.js seu@email.com`

### Webhook não recebendo eventos
1. Verificar `STRIPE_WEBHOOK_SECRET` está correto
2. Verificar URL pública é acessível
3. Checar logs: `tail -f server/logs/*.log`
4. Dashboard Stripe → Webhooks → Eventos

### Erro de conexão Supabase
1. Verificar URL e chaves no `.env`
2. Certificar que projeto Supabase está ativo
3. Testar com: `npm run check:env`

---

## 📞 Suporte

### Links Úteis
- **Resend Docs:** https://resend.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **Express Docs:** https://expressjs.com

### Contato
- 📧 Email: aparecidatoursp@hotmail.com
- 🔗 Repositório: `<seu-repo-aqui>`

---

## 📝 License

MIT

---

**Versão:** 2.0 (Resend)  
**Última atualização:** 21/05/2026  
**Status:** ✅ Production Ready
