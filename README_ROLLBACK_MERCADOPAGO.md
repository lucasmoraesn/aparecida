# 🔄 Rollback: Mercado Pago (Checkout Pro)

Este documento descreve o rollback do PagBank para o Mercado Pago (Checkout Pro).

---

## 🎯 Objetivo

Reverter a integração do PagBank e restaurar o Mercado Pago (Checkout Pro) como gateway de pagamento principal.

---

## 📦 O que foi alterado

### ✅ Backend (`server/`)
- ✅ Dependência `mercadopago` restaurada no `package.json`
- ✅ Endpoint `/api/create-preference` restaurado (Checkout Pro)
- ✅ Webhook `/api/payment-webhook` implementado
- ✅ Variáveis de ambiente atualizadas no `.env.example`:
  - `MERCADO_PAGO_ACCESS_TOKEN`
  - `PUBLIC_URL_NGROK`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_KEY`

### ✅ Frontend
- ✅ Fluxo de redirect restaurado (preferência → init_point → window.location.href)
- ✅ Serviço `MercadoPagoSandboxService` usando endpoint do backend
- ✅ Variáveis de ambiente atualizadas no `.env.local.example`:
  - `VITE_MERCADO_PAGO_PUBLIC_KEY`
  - `VITE_PUBLIC_URL_NGROK`
  - `VITE_API_URL`

### ✅ Documentação
- ✅ `MERCADO_PAGO_SANDBOX.md` criado com instruções completas
- ✅ SDK do Mercado Pago mantido no `index.html`

---

## 🚀 Como testar

### 1. Configurar ambiente
```bash
# Backend
cd server
cp .env.example .env
# Edite .env com suas credenciais

# Frontend
cd ..
cp .env.local.example .env.local
# Edite .env.local com suas credenciais
```

### 2. Instalar dependências
```bash
# Backend
cd server
npm install

# Frontend
cd ..
npm install
```

### 3. Iniciar ngrok
```bash
ngrok http 3001
```
Copie a URL gerada (ex: `https://abc123.ngrok-free.app`) e atualize nos arquivos `.env` e `.env.local`.

### 4. Iniciar servidores
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
npm run dev
```

### 5. Testar pagamento
1. Acesse: http://localhost:5173/cadastrar-negocio
2. Preencha o formulário
3. Escolha um plano
4. Clique em "Criar Pagamento"
5. Você será redirecionado para o checkout do Mercado Pago
6. Use os cartões de teste (veja `MERCADO_PAGO_SANDBOX.md`)

### 6. Validar webhook
- Verifique logs do servidor backend
- Verifique se o status foi atualizado no Supabase

---

## 🧪 Cartões de Teste

### Aprovado
```
Cartão: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: APRO
```

### Recusado
```
Cartão: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: OCHO
```

**Veja mais em:** `MERCADO_PAGO_SANDBOX.md`

---

## 📋 Fluxo de Pagamento

```
1. Usuário preenche formulário → /cadastrar-negocio
2. Escolhe plano → /payment
3. Frontend → POST /api/create-preference
4. Backend → Cria preferência no MP
5. Backend → Retorna { init_point, sandbox_init_point }
6. Frontend → window.location.href = init_point
7. Usuário paga no checkout do MP
8. MP → POST /api/payment-webhook (notificação)
9. Backend → Consulta pagamento na API do MP
10. Backend → Atualiza status no Supabase
11. Usuário → Redirecionado para /payment/success
```

---

## 🔧 Endpoints

### POST `/api/create-preference`
Cria uma preferência de pagamento (Checkout Pro)

**Request:**
```json
{
  "amount": 49.90,
  "description": "Cadastro - Meu Estabelecimento",
  "payer_email": "test_user_123456@testuser.com",
  "external_reference": "abc123"
}
```

**Response:**
```json
{
  "id": "1234567890",
  "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=xxx",
  "sandbox_init_point": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=xxx"
}
```

### POST `/api/payment-webhook`
Recebe notificações do Mercado Pago

**Request (enviado pelo MP):**
```json
{
  "type": "payment",
  "data": {
    "id": "123456789"
  }
}
```

**Ações:**
1. Consulta detalhes do pagamento na API do MP
2. Extrai `external_reference` e `status`
3. Atualiza `business_registrations` no Supabase

---

## 🆚 Diferenças: PagBank vs Mercado Pago

| Aspecto | PagBank | Mercado Pago |
|---------|---------|--------------|
| **Fluxo** | Transparent Checkout (formulário na página) | Redirect (checkout externo) |
| **Implementação** | Mais complexo (SDK + 3DS) | Mais simples (redirect) |
| **UX** | Usuário fica na página | Usuário sai da página |
| **Segurança** | PCI DSS necessário | PCI DSS delegado ao MP |
| **Webhook** | Assinatura HMAC | Simples (consulta API) |

---

## 📚 Documentação

- `MERCADO_PAGO_SANDBOX.md` - Guia completo de sandbox e testes
- [Checkout Pro - Docs oficiais](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing)
- [Contas de teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards)

---

## ⚠️ Notas Importantes

### Branch
- Branch atual: `revert/voltar-mercadopago`
- Branch PagBank preservada: `main` (antes do rollback)

### Produção
Antes de ir para produção:
1. Troque credenciais de **teste** para **produção**
2. Remova referências a "sandbox" nos logs
3. Ajuste back_urls para domínio de produção
4. Configure webhook no painel do MP

### Webhook em Produção
No painel do Mercado Pago:
1. Vá em **Suas aplicações** → sua app → **Webhooks**
2. Configure: `https://seu-dominio.com/api/payment-webhook`
3. Eventos: `payment`

---

## 🎯 Checklist de Deploy

- [ ] Credenciais de produção configuradas
- [ ] Webhook configurado no painel do MP
- [ ] URL de produção nos `.env`
- [ ] Testar pagamento em produção
- [ ] Validar webhook em produção
- [ ] Monitorar logs

---

**Última atualização:** Novembro 2025
**Branch:** `revert/voltar-mercadopago`
