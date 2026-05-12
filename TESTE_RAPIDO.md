# 🚀 COMO TESTAR O BACKEND — INSTRUÇÕES RÁPIDAS

## ✅ PRÉ-REQUISITOS MÍNIMOS

```bash
# 1. Banco de dados
# Abra: https://supabase.com/dashboard → Projeto → SQL Editor
# Cole e execute: supabase/migrations/20260408_standardize_business_registration.sql

# 2. Preços Stripe (criar no Dashboard do Stripe)
# Stripe Dashboard → Products → Criar:
#   - Hotel Básico: price_HOTEL_BASICO (R$ 39.90/mês)
#   - Restaurante Básico: price_REST_BASICO (R$ 39.90/mês)

# 3. Atualizar businessRegistrationService.js com seus Price IDs reais
# server/services/businessRegistrationService.js
#   └─ Substitua: 'price_HOTEL_BASICO' pelo ID real (linha ~12)
#   └─ Substitua: 'price_REST_BASICO' pelo ID real (linha ~18)

# 4. Verificar .env do servidor
# server/.env
#   ADMIN_PASSWORD=admin123
#   ADMIN_EMAIL=seu-email@gmail.com  ← Será notificado
```

---

## 🧪 TESTE RÁPIDO (5 minutos)

### **Opção 1: Script Automático (Windows)**

```powershell
# Terminal PowerShell (qualquer diretório)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
cd c:\projetos\aparecida
.\test-backend.ps1 -Type hotels -Email "seuemail@test.com"

# Seguir as instruções do script
```

### **Opção 2: Manual (Postman/cURL)**

**Passo 1:** Criar Checkout
```bash
curl -X POST http://localhost:5000/api/create-hotels-subscription \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_HOTEL_BASICO",
    "successUrl": "http://localhost:5173/cadastro-sucesso?type=hotels&session_id={CHECKOUT_SESSION_ID}",
    "cancelUrl": "http://localhost:5173/planos-hotels"
  }'
```

**Passo 2:** Copiar `checkoutUrl` → Abrir no navegador

**Passo 3:** Pagar com cartão de teste: `4242 4242 4242 4242` (exp: any, CVC: any)

**Passo 4:** Copiar `session_id` da URL de sucesso (ex: `cs_test_xxx`)

**Passo 5:** Registrar Hotel
```bash
curl -X POST http://localhost:5000/api/register-hotels \
  -F "sessionId=cs_test_xxx" \
  -F 'businessData={
    "nome": "Hotel Teste",
    "whatsapp": "5512987654321",
    "telefone": "5512987654321",
    "email": "hotel@test.com",
    "endereco": "Rua Teste 123",
    "cidades": ["Aparecida"],
    "descricao": "Teste"
  }'
```

**Passo 6:** Aprovar (substitua `ID_DO_HOTEL` pela resposta anterior)
```bash
curl -X POST http://localhost:5000/api/admin/aprovar-hotels \
  -H "Content-Type: application/json" \
  -H "x-admin-password: admin123" \
  -d '{"id": "ID_DO_HOTEL"}'
```

**Passo 7:** Verificar se aparece publicamente
```bash
curl http://localhost:5000/api/hotels
# Deve conter seu hotel registrado
```

---

## 📋 RESULTADOS ESPERADOS

| Passo | O Que Esperar | Status |
|-------|---|---|
| Criar Checkout | URL do Stripe retornada | ✅ |
| Após pagamento | Redireciona para cadastro | ✅ |
| Registrar | Hotel com `status: pending_review` | ✅ |
| Email ao Admin | Notificação recebida | ✅ |
| Email ao Proprietário | "Sob análise" | ✅ |
| Listar Pendentes | `GET /api/admin/hotels-pendentes` retorna hotel | ✅ |
| Aprovar | `POST /api/admin/aprovar-hotels` muda status para `active` | ✅ |
| Listar Públicos | `GET /api/hotels` inclui hotel aprovado | ✅ |

---

## 🚨 ERROS COMUNS & SOLUÇÕES

### ❌ "Price ID inválido"
**Causa:** Price ID não existe no Stripe ou não foi criado

**Solução:**
- Abra Stripe Dashboard → Products
- Procure por "Hotel Básico"
- Copie o Price ID (começa com `price_`)
- Atualize em `businessRegistrationService.js` linha 12

### ❌ "Tabela 'hotels' não existe"
**Causa:** Migration não foi aplicada

**Solução:**
- Abra Supabase Dashboard → SQL Editor
- Execute: `SELECT * FROM hotels LIMIT 1`
- Se der erro, cole e execute: `supabase/migrations/20260408_standardize_business_registration.sql`

### ❌ "session_id não encontrado após pagamento"
**Causa:** Erro na URL de sucesso do Stripe

**Solução:**
- Teste manualmente: `GET /api/check-session?session_id=cs_test_xxx`
- Verifique se a URL de sucesso está correta no endpoint

### ❌ "Nenhum e-mail recebido"
**Causa:** ADMIN_EMAIL não configurado ou SES não passou

**Solução:**
- Verificar: `echo $ADMIN_EMAIL` (no .env do servidor)
- Verificar logs do servidor: procure por `[SES]`
- Se for localhost: emails não são enviados (configure em produção)

### ❌ "Hotel não aparece publicamente após aprovação"
**Causa:** RLS (Row Level Security) bloqueando leitura

**Solução:**
- Supabase Dashboard → SQL Editor
- Execute: 
```sql
SELECT * FROM hotels WHERE id = 'SEU_ID' AND status = 'active';
```
- Se vazio: verificar se status foi realmente atualizado para 'active'

---

## 📞 VERIFICAÇÃO RÁPIDA DO BD

```sql
-- Supabase Dashboard → SQL Editor

-- 1. Verificar tabelas criadas
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('hotels', 'restaurantes');

-- 2. Contar registros por status
SELECT status, COUNT(*) 
FROM hotels 
GROUP BY status;

-- 3. Ver último hotel registrado
SELECT id, nome, status, created_at 
FROM hotels 
ORDER BY created_at DESC 
LIMIT 1;

-- 4. Verificar registros com erro
SELECT * FROM hotels 
WHERE status IN ('pending_review', 'rejected')
LIMIT 10;
```

---

## ✅ CHECKLIST PÓS-TESTES

- [ ] Migration aplicada (tabelas `hotels` + `restaurantes` existem)
- [ ] Price IDs criados no Stripe
- [ ] Script principal roda até o fim sem erros
- [ ] Hotel registrado com status `pending_review`
- [ ] 2 e-mails recebidos (admin + proprietário)
- [ ] Listar pendentes mostra hotel
- [ ] Aprovar muda status para `active`
- [ ] Hotel aparece em `GET /api/hotels` {
- [ ] Restaurante segue same flow com `restaurantes`

---

## 🎯 PRÓXIMAS ETAPAS (Após Testes Passarem)

1. **Frontend - Páginas Hotels**
   ```
   src/pages/PlanosHotels.tsx
   src/pages/CadastroSucessoHotels.tsx
   src/pages/AdminHotels.tsx
   ```

2. **Frontend - Páginas Restaurantes**
   ```
   src/pages/PlanosRestaurantes.tsx
   src/pages/CadastroSucessoRestaurantes.tsx
   src/pages/AdminRestaurantes.tsx
   ```

3. **Webhooks** (já feito ✅)
   - Detecta tipo via metadata
   - Salva stripe_subscription_id

---

## 💡 DICAS

- Teste sempre **admin** antes de testes públicos
- Use cartão `4242 4242 4242 4242` para testes ilimitados no Stripe
- Logs do servidor: procure por `✅` (sucesso) e `❌` (erro)
- Supabase: sempre verificar dados inseridos em tempo real
- Postman: Use para testes visuais e salvar requests

---

## 📞 PRECISA DE AJUDA?

Se algo der errado:

1. **Verificar logs do servidor**
   ```bash
   # Terminal onde node está rodando
   # Procure por: ❌ [Type] Error
   ```

2. **Verificar Supabase**
   - Dashboard → Seu Projeto → SQL Editor
   - Execute queries de verificação acima

3. **Verificar Stripe**
   - Dashboard → Webhooks (ver último evento)
   - Dashboard → Test Clock (simular tempo)

4. **Reiniciar servidor**
   ```bash
   # Terminal do servidor
   Ctrl+C
   npm run dev
   ```

