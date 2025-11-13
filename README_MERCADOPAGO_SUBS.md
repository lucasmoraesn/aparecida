# 📋 Mercado Pago - Assinaturas Recorrentes (Preapproval)

Documentação completa da implementação de assinaturas recorrentes usando Mercado Pago Preapproval.

---

## 🎯 Visão Geral

Sistema de assinaturas mensais automatizado onde:
- Cliente autoriza cobrança recorrente uma única vez
- Mercado Pago cobra automaticamente todo mês
- Webhooks notificam sobre pagamentos e mudanças de status
- Sistema registra todos os pagamentos e mantém estado sincronizado

---

## 🔄 Fluxo Completo

```
1. Cliente preenche formulário de cadastro
   ↓
2. Backend cria registro no DB (business_registrations)
   ↓
3. Frontend chama POST /api/create-subscription
   ↓
4. Backend:
   - Busca informações do plano
   - Cria preapproval no Mercado Pago
   - Salva assinatura no DB (status='pending')
   - Retorna init_point
   ↓
5. Frontend redireciona para init_point do MP
   ↓
6. Cliente autoriza cobrança mensal no checkout MP
   ↓
7. MP processa primeiro pagamento
   ↓
8. MP envia webhook "authorized_payment"
   ↓
9. Backend:
   - Consulta detalhes do pagamento
   - Registra em payments
   - Atualiza assinatura (status='active', next_charge_at)
   ↓
10. MP redireciona para /subscription/success
    ↓
11. Cliente vê confirmação da assinatura ativa
    ↓
12. Todo mês: MP cobra → envia webhook → backend registra
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabela `subscriptions`

```sql
CREATE TABLE subscriptions (
  id BIGSERIAL PRIMARY KEY,
  business_id BIGINT NOT NULL REFERENCES business_registrations(id),
  preapproval_id VARCHAR(255) NOT NULL UNIQUE,
  plan_id BIGINT REFERENCES business_plans(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  amount_cents INTEGER NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 1,
  frequency_type VARCHAR(20) NOT NULL DEFAULT 'months',
  next_charge_at TIMESTAMP,
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  customer_tax_id VARCHAR(20),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Status possíveis:**
- `pending`: Aguardando autorização do cliente
- `active`: Ativa e cobrando mensalmente
- `paused`: Pausada temporariamente
- `cancelled`: Cancelada

### Tabela `payments`

```sql
CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  business_id BIGINT NOT NULL REFERENCES business_registrations(id),
  subscription_id BIGINT REFERENCES subscriptions(id),
  mp_payment_id VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL,
  amount_cents INTEGER NOT NULL,
  payment_method VARCHAR(50),
  paid_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 🔌 API Endpoints

### POST `/api/create-subscription`

Cria uma assinatura recorrente no Mercado Pago.

**Request:**
```json
{
  "planId": 1,
  "businessId": 123,
  "customer": {
    "email": "test_user_123456@testuser.com",
    "name": "João Silva",
    "tax_id": "12345678909"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "init_point": "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_id=xxx",
  "preapproval_id": "2c938084726fca480172775e32580206",
  "subscription_id": 42
}
```

**Response (Error):**
```json
{
  "error": true,
  "message": "Plano não encontrado"
}
```

### POST `/api/payment-webhook`

Recebe notificações do Mercado Pago sobre pagamentos e mudanças de status.

**Tipos de notificação:**

#### 1. `authorized_payment` (Pagamento mensal aprovado)

```json
{
  "type": "authorized_payment",
  "data": {
    "id": "123456789"
  }
}
```

**Ações do backend:**
1. Consulta `GET /authorized_payments/{id}` no MP
2. Registra pagamento na tabela `payments`
3. Atualiza assinatura para `active`
4. Calcula e salva `next_charge_at` (+30 dias)

#### 2. `preapproval` (Mudança de status da assinatura)

```json
{
  "type": "preapproval",
  "data": {
    "id": "2c938084726fca480172775e32580206"
  }
}
```

**Ações do backend:**
1. Consulta `GET /preapproval/{id}` no MP
2. Atualiza `status` na tabela `subscriptions`

---

## 🔑 Variáveis de Ambiente

### Backend (`server/.env`)

```env
# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-1234567890123456-010100-abcdef1234567890abcdef1234567890-123456789

# URL pública para webhooks e back_urls
PUBLIC_URL_NGROK=https://seu-dominio.ngrok-free.app

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua_service_role_key_aqui

# Servidor
PORT=3001
```

### Frontend (`.env.local`)

```env
# Mercado Pago (opcional, se usar SDK no frontend)
VITE_MERCADO_PAGO_PUBLIC_KEY=TEST-abc12345-678901-def234-ghi567890

# URL pública
VITE_PUBLIC_URL_NGROK=https://seu-dominio.ngrok-free.app

# URL da API
VITE_API_URL=http://localhost:3001

# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

---

## 📦 Payload do Preapproval

### Request para Mercado Pago API

```javascript
const preapprovalBody = {
  back_url: 'https://seu-dominio.com/subscription/success?business_id=123',
  reason: 'Plano Premium',
  external_reference: '123',
  payer_email: 'test_user_123456@testuser.com',
  auto_recurring: {
    frequency: 1,
    frequency_type: 'months',
    transaction_amount: 99.90,
    currency_id: 'BRL'
  }
};

const response = await mercadopago.preapproval.create({ body: preapprovalBody });
```

### Response do Mercado Pago

```json
{
  "id": "2c938084726fca480172775e32580206",
  "payer_id": 123456,
  "payer_email": "test_user_123456@testuser.com",
  "back_url": "https://seu-dominio.com/subscription/success?business_id=123",
  "init_point": "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_id=xxx",
  "sandbox_init_point": "https://sandbox.mercadopago.com.br/subscriptions/checkout?preapproval_id=xxx",
  "status": "pending",
  "reason": "Plano Premium",
  "external_reference": "123",
  "auto_recurring": {
    "frequency": 1,
    "frequency_type": "months",
    "transaction_amount": 99.90,
    "currency_id": "BRL"
  }
}
```

---

## 🧪 Testes em Sandbox

### 1. Criar Contas de Teste

Acesse: https://www.mercadopago.com.br/developers/panel/test-users

Crie:
- **Vendedor de Teste**: Use o Access Token dele no backend
- **Comprador de Teste**: Use o email dele no formulário

### 2. Testar Criação de Assinatura

```bash
# 1. Iniciar ngrok
ngrok http 3001

# 2. Atualizar URLs nos .env com a URL do ngrok

# 3. Reiniciar backend
cd server
npm run dev

# 4. Iniciar frontend
npm run dev

# 5. Acessar
http://localhost:5173/cadastrar-negocio
```

### 3. Fluxo de Teste

1. Preencher formulário com:
   - Email: `test_user_123456@testuser.com`
   - Nome: Qualquer
   - Dados do negócio: Qualquer

2. Será redirecionado para checkout do MP

3. No checkout, use dados de teste do comprador:
   - Email: Email do comprador de teste
   - Senha: Senha do comprador de teste

4. Autorizar assinatura

5. Será redirecionado para `/subscription/success`

6. Verificar no terminal do backend:
   ```
   📩 Webhook recebido: { type: 'authorized_payment', data: { id: '123' } }
   💳 Detalhes da cobrança: { status: 'approved', ... }
   ✅ Pagamento registrado e assinatura ativada
   ```

7. Verificar no Supabase:
   - Tabela `subscriptions`: status='active'
   - Tabela `payments`: registro do pagamento

### 4. Simular Pagamentos Mensais

No sandbox, o MP não cobra automaticamente todo mês. Para testar:

**Opção 1: Usar API de simulação (se disponível)**
```bash
curl -X POST \
  https://api.mercadopago.com/preapproval/PREAPPROVAL_ID/authorized_payments \
  -H 'Authorization: Bearer YOUR_TEST_ACCESS_TOKEN'
```

**Opção 2: Testar webhook manualmente**
```bash
curl -X POST http://localhost:3001/api/payment-webhook \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "authorized_payment",
    "data": { "id": "PAYMENT_ID" }
  }'
```

---

## 🐛 Troubleshooting

### Webhook não está sendo chamado

**Verificar:**
1. ngrok está rodando?
2. URL do ngrok está atualizada nos `.env`?
3. Backend está rodando?
4. Logs do ngrok mostram a requisição chegando?

**Solução:**
```bash
# Terminal 1: ngrok
ngrok http 3001

# Terminal 2: Backend
cd server
npm run dev

# Copie a URL do ngrok e atualize nos .env
```

### Assinatura não ativa após pagamento

**Verificar:**
1. Webhook foi recebido? (ver logs do backend)
2. Consulta ao MP retornou sucesso?
3. Tabela `payments` tem o registro?

**Debug:**
```javascript
// No backend, adicione logs:
console.log('💳 Authorized Payment:', authorizedPayment);
console.log('🔍 Subscription found:', subscription);
```

### Erro: "Plano não encontrado"

**Verificar:**
1. Tabela `business_plans` tem dados?
2. `planId` enviado existe?

**Solução:**
```sql
-- Verificar planos
SELECT * FROM business_plans;

-- Inserir plano de teste se necessário
INSERT INTO business_plans (name, price, features)
VALUES ('Plano Teste', 49.90, '["Recurso 1", "Recurso 2"]');
```

---

## 📊 Monitoramento

### Consultas Úteis

```sql
-- Listar todas as assinaturas ativas
SELECT s.*, bp.name as plan_name
FROM subscriptions s
LEFT JOIN business_plans bp ON s.plan_id = bp.id
WHERE s.status = 'active'
ORDER BY s.created_at DESC;

-- Listar pagamentos recentes
SELECT p.*, s.preapproval_id
FROM payments p
LEFT JOIN subscriptions s ON p.subscription_id = s.id
ORDER BY p.created_at DESC
LIMIT 10;

-- Total de receita por mês
SELECT 
  DATE_TRUNC('month', paid_at) as month,
  COUNT(*) as total_payments,
  SUM(amount_cents) / 100 as total_revenue
FROM payments
WHERE status = 'approved'
GROUP BY month
ORDER BY month DESC;
```

---

## 🚀 Deploy em Produção

### Checklist

- [ ] Trocar credenciais de TESTE para PRODUÇÃO
- [ ] Atualizar `PUBLIC_URL_NGROK` para domínio real
- [ ] Configurar webhook no painel do MP: `https://seu-dominio.com/api/payment-webhook`
- [ ] Testar assinatura em produção com cartão real
- [ ] Validar webhook em produção
- [ ] Configurar monitoramento de falhas
- [ ] Configurar alertas para pagamentos recusados

### Configurar Webhook no Painel MP

1. Acesse: https://www.mercadopago.com.br/developers/panel/webhooks
2. Crie novo webhook
3. URL: `https://seu-dominio.com/api/payment-webhook`
4. Eventos: `authorized_payment`, `preapproval`
5. Salvar

---

## 📚 Referências

- [Preapproval - Mercado Pago Docs](https://www.mercadopago.com.br/developers/pt/docs/subscriptions/integration)
- [Webhooks - Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/subscriptions/additional-content/notifications/webhooks)
- [Conta de Teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards)

---

**Última atualização:** Novembro 2025  
**Branch:** `revert/voltar-mercadopago`
