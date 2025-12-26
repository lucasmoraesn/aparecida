# 🚀 Backend - Explore Aparecida

Sistema backend completo com pagamentos (Stripe), assinaturas e **notificações automáticas por e-mail**.

---

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Estrutura](#-estrutura)
- [Configuração](#-configuração)
- [E-mails e Notificações](#-emails-e-notificações) ⭐ **NOVO!**
- [Comandos](#-comandos)
- [Webhooks](#-webhooks)
- [Testes](#-testes)

---

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Supabase** - Banco de dados PostgreSQL
- **Stripe** - Pagamentos e assinaturas
- **Resend** - Envio de e-mails ⭐ **NOVO!**

---

## 📁 Estrutura

```
server/
├── index.js                    # Servidor principal + webhooks
├── app.js                      # Configuração do Express
├── package.json                # Dependências
├── .env                        # Variáveis de ambiente
│
├── services/                   # Serviços
│   └── emailService.js        # 📧 Serviço de e-mail (Resend) ⭐ NOVO!
│
├── payments/                   # Lógica de pagamentos
│   └── ...
│
├── tests/                      # Testes automatizados
│   └── ...
│
├── utils/                      # Utilitários
│   └── logger.js
│
├── test-email.js              # 🧪 Script de teste de e-mails ⭐ NOVO!
│
└── docs/                       # Documentação ⭐ NOVO!
    ├── EMAIL_NOTIFICATIONS_GUIDE.md
    ├── RESUMO_NOTIFICACOES.md
    ├── EXEMPLOS_EMAIL_VISUAL.md
    ├── COMANDOS_RAPIDOS_EMAIL.md
    └── IMPLEMENTACAO_RESUMO_EXECUTIVO.md
```

---

## ⚙️ Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie o arquivo `.env`:

```env
# Supabase
SUPABASE_URL=sua_url_aqui
SUPABASE_SERVICE_KEY=sua_chave_aqui

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (E-mails) ⭐ NOVO!
RESEND_API_KEY=re_...
FROM_EMAIL=Explore Aparecida <onboarding@resend.dev>
ADMIN_EMAIL=seu-email@dominio.com

# URLs
PUBLIC_URL=https://seu-dominio.com.br
FRONTEND_URL=https://seu-dominio.com.br

# Servidor
PORT=3001
```

### 3. Iniciar Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

---

## 📧 E-mails e Notificações

### ⭐ NOVO: Sistema de Notificações Automáticas

O sistema envia **automaticamente** um e-mail para o administrador sempre que um cliente assina um plano.

### 🎯 Como Funciona

```
Cliente assina plano
    ↓
Stripe processa pagamento
    ↓
Webhook notifica backend
    ↓
Backend ativa assinatura
    ↓
📧 E-mail enviado automaticamente
```

### 🧪 Testar E-mails

```bash
# Teste simples
npm run test:email

# Teste de notificação
npm run test:email:notification

# Teste completo
npm run test:email:all
```

### 📚 Documentação Completa

- **Guia Completo:** [EMAIL_NOTIFICATIONS_GUIDE.md](EMAIL_NOTIFICATIONS_GUIDE.md)
- **Comandos Rápidos:** [COMANDOS_RAPIDOS_EMAIL.md](COMANDOS_RAPIDOS_EMAIL.md)
- **Exemplos Visuais:** [EXEMPLOS_EMAIL_VISUAL.md](EXEMPLOS_EMAIL_VISUAL.md)
- **Resumo Executivo:** [IMPLEMENTACAO_RESUMO_EXECUTIVO.md](IMPLEMENTACAO_RESUMO_EXECUTIVO.md)

### 🔑 Configurações Necessárias

1. **API Key do Resend:**
   - Acesse: https://resend.com/api-keys
   - Copie a chave
   - Adicione no `.env`: `RESEND_API_KEY=re_...`

2. **E-mail de destino:**
   - Configure no `.env`: `ADMIN_EMAIL=seu-email@dominio.com`

3. **Testar:**
   ```bash
   npm run test:email
   ```

### 📬 O Que o E-mail Contém

- 🏢 Nome do estabelecimento
- 📧 E-mail do estabelecimento
- 👤 E-mail do cliente
- 💎 Plano contratado
- 💰 Valor mensal
- 🆔 ID da assinatura
- 📅 Data e hora

---

## 🚀 Comandos

```bash
# Desenvolvimento
npm run dev                      # Inicia com nodemon (auto-reload)

# Produção
npm start                        # Inicia servidor
npm run start:prod              # Inicia em modo produção

# Testes
npm test                        # Executa testes unitários
npm run test:watch              # Testes em modo watch
npm run test:coverage           # Cobertura de testes

# E-mails ⭐ NOVO!
npm run test:email              # Teste simples de e-mail
npm run test:email:notification # Teste de notificação
npm run test:email:all          # Testa todos os e-mails
```

---

## 🔗 Webhooks

### Endpoint Principal

```
POST /api/webhook
```

### Eventos Tratados

| Evento | Descrição | Ação |
|--------|-----------|------|
| `checkout.session.completed` | Checkout finalizado | Ativa assinatura + **Envia e-mail** ⭐ |
| `customer.subscription.deleted` | Assinatura cancelada | Cancela no banco |
| `invoice.payment_succeeded` | Pagamento recorrente OK | Registra pagamento |
| `invoice.payment_failed` | Falha no pagamento | Registra falha |

### 📧 Disparo de E-mails

O e-mail é enviado automaticamente no evento `checkout.session.completed`:

```javascript
// Fluxo interno
Webhook recebido
  ↓
Validar assinatura Stripe
  ↓
Ativar assinatura no banco
  ↓
Buscar dados do estabelecimento
  ↓
Buscar dados do plano
  ↓
📧 Enviar e-mail via Resend
  ↓
Logar resultado
```

---

## 🧪 Testes

### Testes Unitários

```bash
npm test
```

### Testes de E-mail ⭐ NOVO!

```bash
# Teste rápido
npm run test:email

# Teste detalhado
npm run test:email:notification

# Teste completo
npm run test:email:all
```

### Teste de Webhook (Stripe CLI)

```bash
# Instalar Stripe CLI
stripe listen --forward-to localhost:3001/api/webhook

# Disparar evento de teste
stripe trigger checkout.session.completed
```

---

## 📊 Monitoramento

### Logs do Servidor

O servidor loga todos os eventos importantes:

```
🔔 WEBHOOK RECEBIDO!
✅ Assinatura ativada
📧 Preparando envio de e-mail...
✅ E-mail enviado com sucesso!
   Email ID: abc123...
```

### Dashboard do Resend ⭐

Acesse: https://resend.com/emails

Você pode ver:
- E-mails enviados
- Taxa de entrega
- Aberturas e cliques
- Erros e bounces

### Dashboard do Stripe

Acesse: https://dashboard.stripe.com

- Pagamentos recebidos
- Assinaturas ativas
- Webhooks recebidos
- Logs de eventos

---

## 🔒 Segurança

### Validações Implementadas

- ✅ Validação de assinatura do webhook Stripe
- ✅ CORS configurado
- ✅ Variáveis sensíveis em .env
- ✅ Service key do Supabase (admin)
- ✅ Tratamento de erros

### Boas Práticas

- Nunca commitar `.env`
- Rotacionar API keys periodicamente
- Monitorar logs de erro
- Usar HTTPS em produção

---

## 🐛 Troubleshooting

### E-mail não chega? ⭐

```bash
# 1. Verificar configuração
cat .env | grep EMAIL

# 2. Testar envio
npm run test:email

# 3. Ver logs
npm run dev
```

**Verifique também:**
- Caixa de spam
- API key do Resend está correta
- E-mail de destino está correto

### Webhook não funciona?

```bash
# Ver logs em tempo real
npm run dev

# Testar com Stripe CLI
stripe listen --forward-to localhost:3001/api/webhook
stripe trigger checkout.session.completed
```

### Erros de conexão?

```bash
# Verificar variáveis
cat .env

# Testar Supabase
node test-supabase.js

# Testar Stripe
node test-stripe.js
```

---

## 📚 Documentação Adicional

### E-mails e Notificações ⭐

- [Guia Completo](EMAIL_NOTIFICATIONS_GUIDE.md)
- [Comandos Rápidos](COMANDOS_RAPIDOS_EMAIL.md)
- [Exemplos Visuais](EXEMPLOS_EMAIL_VISUAL.md)
- [Resumo Executivo](IMPLEMENTACAO_RESUMO_EXECUTIVO.md)
- [Resumo das Notificações](RESUMO_NOTIFICACOES.md)

### Outros

- [Deploy Backend](../deploy/backend/README.md)
- [Guia de Deploy](../GUIA_DEPLOY_BACKEND.md)
- [Status do Projeto](../STATUS_ATUAL.txt)

---

## 🎯 Status

| Componente | Status | Versão |
|------------|--------|--------|
| Backend API | ✅ Ativo | 1.0.0 |
| Webhooks Stripe | ✅ Ativo | - |
| Banco Supabase | ✅ Ativo | - |
| **E-mails Resend** ⭐ | ✅ Ativo | **NOVO!** |
| Testes | ✅ OK | - |

---

## 🔗 Links Úteis

- **Dashboard Stripe:** https://dashboard.stripe.com
- **Dashboard Supabase:** https://supabase.com/dashboard
- **Dashboard Resend:** https://resend.com ⭐
- **Logs Resend:** https://resend.com/emails ⭐
- **API Keys Resend:** https://resend.com/api-keys ⭐

---

## 👨‍💻 Desenvolvimento

### Estrutura de Branches

```
main          → Produção
develop       → Desenvolvimento
feature/*     → Novas funcionalidades
bugfix/*      → Correções
```

### Deploy

```bash
# Build (se necessário)
npm run build

# Deploy
git push origin main
```

---

## 📝 Changelog

### v1.1.0 (26/12/2025) ⭐ NOVO!

- ✅ Adicionado sistema de notificações por e-mail
- ✅ Integração com Resend
- ✅ E-mail automático em novas assinaturas
- ✅ Template HTML responsivo
- ✅ Scripts de teste
- ✅ Documentação completa

### v1.0.0

- ✅ Sistema de pagamentos Stripe
- ✅ Webhooks implementados
- ✅ CRUD de assinaturas
- ✅ Integração Supabase

---

## 📞 Suporte

**Desenvolvedor:** Lucas Moraes  
**E-mail:** lucasmoraesn@hotmail.com  
**Projeto:** Explore Aparecida  

---

**Última atualização:** 26 de dezembro de 2025  
**Status:** ✅ Funcionando em produção  
**Novidade:** 📧 Sistema de e-mails ativo!
