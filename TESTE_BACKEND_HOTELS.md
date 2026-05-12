# GUIA DE TESTES: Backend Hotels/Restaurantes
## Padronização Completa ✅

---

## ⚙️ PRÉ-REQUISITOS

### 1. **Banco de Dados - Aplicar Migration**

```bash
# Terminal do Supabase CLI
supabase migration up

# Ou manualmente:
# 1. Abra https://supabase.com/dashboard → seu projeto
# 2. SQL Editor → Paste o SQL de migrations/20260408_standardize_business_registration.sql
# 3. Clique RUN
```

✅ **Verificar:**
```sql
-- Executar no Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('hotels', 'restaurantes');
```

Deve retornar 2 linhas.

---

### 2. **Preparar Preços Stripe**

Você precisa criar Price IDs para Hotels e Restaurantes no Stripe Dashboard:

```
Painel Stripe → Products → Create Product
├─ Product: "Hotel - Plano Básico"
│  └─ Price: $39.90/month → Price ID: price_HOTEL_BASICO
├─ Product: "Hotel - Plano Destaque"
│  └─ Price: $49.90/month → Price ID: price_HOTEL_DESTAQUE
└─ Product: "Restaurante - Plano Básico"
   └─ Price: $39.90/month → Price ID: price_REST_BASICO
```

Depois, atualize no `server/services/businessRegistrationService.js`:

```javascript
restaurante: {
  priceIds: {
    'price_REST_BASICO': { nome: 'basico', ... },  // ← Use o Price ID real
    'price_REST_DESTAQUE': { nome: 'destaque', ... },
  }
}
```

---

### 3. **Verificar .env Server**

```bash
# server/.env
ADMIN_PASSWORD=admin123  # Qualquer senha para testes
ADMIN_EMAIL=seu-email@example.com  # Email onde receberá notificações
```

---

## 🧪 TESTES MANUAIS (via cURL ou Postman)

### **TEST 1: Criar Sessão Stripe (Hotel)**

```bash
curl -X POST http://localhost:5000/api/create-hotels-subscription \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_HOTEL_BASICO",
    "successUrl": "http://localhost:5173/cadastro-sucesso?type=hotels&session_id={CHECKOUT_SESSION_ID}",
    "cancelUrl": "http://localhost:5173/planos-hotels"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "checkoutUrl": "https://checkout.stripe.com/pay/cs_..."
}
```

✅ Copiar `checkoutUrl` e **abrir no navegador**. Completar checkout com cartão de teste.

---

### **TEST 2: Verificar Sessão depois do Pagamento**

```bash
# Após completar o checkout, você recebe:
# http://localhost:5173/cadastro-sucesso?type=hotels&session_id=cs_test_xxx

curl -X GET "http://localhost:5000/api/check-session?session_id=cs_test_xxx&type=hotels"
```

**Resposta esperada:**
```json
{
  "success": true,
  "session": {
    "id": "cs_test_xxx",
    "payment_status": "paid",
    "customer_email": "customer@example.com"
  }
}
```

---

### **TEST 3: Registrar Hotel**

```bash
curl -X POST http://localhost:5000/api/register-hotels \
  -H "Content-Type: multipart/form-data" \
  -F "sessionId=cs_test_xxx" \
  -F 'businessData={
    "nome": "Hotel Teste Aparecida",
    "whatsapp": "5512987654321",
    "telefone": "5512987654321",
    "email": "hotel@example.com",
    "endereco": "Rua das Flores, 123",
    "cidades": ["Aparecida", "Guaratinguetá"],
    "descricao": "Hotel próximo à Basílica"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "hotel": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "Hotel Teste Aparecida",
    "status": "pending_review"
  }
}
```

✅ Salve o `hotel.id` para os próximos testes.

---

### **TEST 4: Verificar Emails Enviados**

✅ Você deve ter recebido 2 e-mails:
1. **Email para ADMIN** (ADMIN_EMAIL no .env)
   - Assunto: `🏨 Hotel Aguardando Aprovação: Hotel Teste Aparecida`
   - Botão: Nenhum (admin acessa painel admin)

2. **Email para PROPRIETÁRIO** (email do formulário)
   - Assunto: `Seu perfil está em análise — Explore Aparecida`
   - Conteúdo: "Seu perfil será aprovado em até 24 horas"

---

### **TEST 5: Listar Hotéis Pendentes (Admin)**

```bash
curl -X GET http://localhost:5000/api/admin/hotels-pendentes \
  -H "x-admin-password: admin123"
```

**Resposta esperada:**
```json
{
  "success": true,
  "registros": [
    {
      "id": "550e8400-e29b-...",
      "nome": "Hotel Teste Aparecida",
      "status": "pending_review",
      "data": {...}
    }
  ]
}
```

---

### **TEST 6: Aprovar Hotel**

```bash
curl -X POST http://localhost:5000/api/admin/aprovar-hotels \
  -H "Content-Type: application/json" \
  -H "x-admin-password: admin123" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Resposta esperada:**
```json
{
  "success": true
}
```

---

### **TEST 7: Listar Hotéis Ativos (Admin)**

```bash
curl -X GET http://localhost:5000/api/admin/hotels-ativos \
  -H "x-admin-password: admin123"
```

**Resposta esperada:**
```json
{
  "success": true,
  "registros": [
    {
      "id": "550e8400-e29b-...",
      "nome": "Hotel Teste Aparecida",
      "status": "active"
    }
  ]
}
```

---

### **TEST 8: API Pública - Listar Hotéis (Visitante)**

```bash
curl -X GET http://localhost:5000/api/hotels
```

**Resposta esperada:**
```json
{
  "success": true,
  "hotels": [
    {
      "id": "550e8400-e29b-...",
      "nome": "Hotel Teste Aparecida",
      "whatsapp": "5512987654321",
      "descricao": "Hotel próximo à Basílica",
      ...
    }
  ]
}
```

✅ Hotel deve aparecer aqui APÓS aprovação.

---

### **TEST 9: Rejeitar Hotel (Admin)**

```bash
curl -X POST http://localhost:5000/api/admin/rejeitar-hotels \
  -H "Content-Type: application/json" \
  -H "x-admin-password: admin123" \
  -d '{
    "id": "550e8400-e29b-...",
    "reason": "Informações incompletas"
  }'
```

**Resposta esperada:**
```json
{
  "success": true
}
```

---

## 📋 CHECKLIST DE VALIDAÇÃO

- [ ] **BD**: Tabelas `hotels` e `restaurantes` criadas (migration aplicada)
- [ ] **Preços Stripe**: Hotel e Restaurante com Price IDs criados
- [ ] **TEST 1**: Criar sessão Stripe retorna `checkoutUrl` válida
- [ ] **TEST 2**: Após pagamento, `check-session` retorna `payment_status: paid`
- [ ] **TEST 3**: Registrar hotel cria registro com `status: pending_review`
- [ ] **TEST 4**: Dois e-mails recebidos (admin + proprietário)
- [ ] **TEST 5**: Hotel aparece em `hotels-pendentes` com status correto
- [ ] **TEST 6**: Aprovar hotel muda status para `active`
- [ ] **TEST 7**: Hotel aparece em `hotels-ativos`
- [ ] **TEST 8**: Hotel aparece em `/api/hotels` (lista pública)
- [ ] **TEST 9**: Rejeitar hotel muda status para `rejected`

---

## 🚨 TROUBLESHOOTING

### ❌ "Price ID inválido"
```
Solução: Verifique se o Price ID existe no Stripe Dashboard
         E se foi atualizado em businessRegistrationService.js
```

### ❌ "ADMIN_EMAIL não configurado"
```
Solução: Adicione ADMIN_EMAIL no server/.env
         Teste: echo $ADMIN_EMAIL
```

### ❌ "Tabela 'hotels' não existe"
```
Solução: Aplique a migration SQL no Supabase SQL Editor
         Verifique se criou ambas as tabelas (hotels + restaurantes)
```

### ❌ "Erro ao fazer upload da foto"
```
Solução: Verifique se o bucket 'hoteis-fotos' existe no Storage
         Crie manualmente se necessário
```

### ❌ "session.id está undefined"
```
Solução: Stripe session pode não estar sendo criada corretamente
         Verifique logs do servidor: console.log() nos endpoints
         Valide o Price ID
```

---

## 🎯 PRÓXIMAS ETAPAS

Após validar TODOS os testes:

1. **Criar Páginas Frontend**
   - [x] Backend pronto
   - [ ] PlanosHotels.tsx
   - [ ] CadastroSucessoHotels.tsx
   - [ ] AdminHotels.tsx

2. **Criar Páginas Restaurantes**
   - [ ] PlanosRestaurantes.tsx
   - [ ] CadastroSucessoRestaurantes.tsx
   - [ ] AdminRestaurantes.tsx

3. **Integrar com Webhook Stripe**
   - [ ] Atualizar webhook para detectar `type: hotel/restaurante`
   - [ ] Garantir que status é atualizado for all types

---

## 💡 DICAS

- Use **Postman** para testes mais visuais
- Cartão de teste Stripe: `4242 4242 4242 4242` (exp: any, CVC: any)
- Logs do servidor: Verifique terminal do `npm run dev`
- Supabase Dashboard: Verifique dados inseridos em tempo real

