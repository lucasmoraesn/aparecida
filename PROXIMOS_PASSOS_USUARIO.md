# PRÓXIMOS PASSOS — O QUE VOCÊ PRECISA FAZER AGORA

Você tem **TODO O BACKEND PRONTO**. Abaixo está o caminho que você deve seguir:

---

## ⚡ ATALHO RÁPIDO (5 minutos)

Se você quer **testar AGORA**:

```bash
# 1️⃣ Abrir terminal PowerShell neste diretório
.\test-backend.ps1 -Type hotels -Email "seu-email@example.com"

# 2️⃣ Quando pedir "session_id", ir para:
#    https://stripe.com → Test Mode
#    Clicar "Test your integration"
#    Pagar com 4242 4242 4242 4242 (VÁLIDO)
#    Copiar o session_id da URL
#    Colar no terminal

# 3️⃣ Apertar Enter e ver TUDO passar ✅
```

---

## 📋 ROTEIRO COMPLETO (Se NÃO fez os pré-requisitos)

### **PASSO 1: Aplicar Migration no Supabase** (5 min)

❌ **ANTES:** As tabelas `hotels` e `restaurantes` NÃO existem no banco

✅ **DEPOIS:** Tabelas criadas com status, índices, RLS

**Como?**

1. Abrir **Supabase Dashboard** → seu projeto
2. Ir para **SQL Editor**
3. Novo Query
4. Copiar TUDO do arquivo: [RESUMO_TECNICO_BACKEND.md](RESUMO_TECNICO_BACKEND.md)
   - Ou usar: `supabase/migrations/20260408_standardize_business_registration.sql`
5. Colar e executar (Ctrl+Enter)
6. ✅ Confirmado: aparece "CREATE TABLE hotels" + "CREATE TABLE restaurantes"

**Verificação:**

```sql
-- Rodar isso no Supabase SQL:
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('hotels', 'restaurantes');
-- Deve retornar 2 linhas
```

---

### **PASSO 2: Criar Preços no Stripe** (10 min)

❌ **ANTES:** Endpoints `/api/create-hotels-subscription` não sabem qual é o price_id

✅ **DEPOIS:** Price IDs ligados ao código

**Como?**

1. Ir para https://dashboard.stripe.com
2. **Products** (sidebar esquerda)
3. **Add product** (botão azul)

Criar 4 produtos:

```
NOME: "Plano Básico - Hotel"
PRICE: $39.90/month (ou BRL 39.90/month)
↓ Copiar o price_id: price_XXXXX...

NOME: "Plano Destaque - Hotel"
PRICE: $49.90/month
↓ Copiar o price_id

NOME: "Plano Básico - Restaurante"
PRICE: $39.90/month
↓ Copiar o price_id

NOME: "Plano Destaque - Restaurante"
PRICE: $49.90/month
↓ Copiar o price_id
```

4. Abrir `server/services/businessRegistrationService.js`
5. Procurar por `BUSINESS_CONFIG` (linha ~20)
6. Substituir os `price_id` placeholders:

```javascript
// ANTES:
hotel: {
  table: 'hotels',
  priceIds: {
    basico: 'price_HOTEL_BASICO_PLACEHOLDER',
    destaque: 'price_HOTEL_DESTAQUE_PLACEHOLDER'
  }
}

// DEPOIS:
hotel: {
  table: 'hotels',
  priceIds: {
    basico: 'price_1ABC123XYZ...',    // ← Seu price_id real de Stripe
    destaque: 'price_2DEF456UVW...'   // ← Seu price_id real de Stripe
  }
}
```

---

### **PASSO 3: Testar o Backend** (10-15 min)

Opção A: **Script Automático (RECOMENDADO)**

```bash
# PowerShell
.\test-backend.ps1 -Type hotels -Email "teste@example.com"
#
# Resultado esperado:
# ✅ Step 1: Create Checkout Session
# ✅ Step 2: Payment (simulated)
# ✅ Step 3: Register Business
# ✅ Step 4: Email sent to admin
# ✅ Step 5: List pending items
# ✅ Step 6: Approve item
# ✅ Step 7: Verify public listing
```

Opção B: **Manual com cURL**

Abrir `TESTE_BACKEND_HOTELS.md` → Copiar-colar cada comando

---

### **PASSO 4: Verificar se Tudo Funcionou** (5 min)

Executar estas queries no **Supabase SQL**:

```sql
-- Deve haver 1 hotel pendente
SELECT * FROM hotels WHERE status = 'pending_review';

-- Deve haver 1 hotel ativo
SELECT * FROM hotels WHERE status = 'active';

-- Stripes subscription id salvo?
SELECT stripe_subscription_id FROM hotels WHERE status = 'active';
```

Checar emails:
- ✅ Email admin recebido? (novo hotel em análise)
- ✅ Email proprietário recebido? (perfil em análise)

---

## 🎨 PASSO 5: Frontend (Depois que tudo passar)

### **A. Criar 3 páginas para Hotels**

Arquivo: `src/pages/PlanosHotels.tsx`

```typescript
// Copiar de: PlanosMotoristas.tsx
// Trocar:
//   - "motorista" → "hotels"
//   - "Motorista" → "Hotel"
//   - PlanosMotoristas → PlanosHotels
//   - priceIdBasico → priceIdHotel
```

Arquivo: `src/pages/CadastroSucessoHotels.tsx`

```typescript
// Copiar de: CadastroSucessoMotorista.tsx
// Trocar: "motorista" → "hotels"
```

Arquivo: `src/pages/AdminHotels.tsx`

```typescript
// Copiar de: AdminMotoristas.tsx
// Trocar: "motorista" → "hotels"
```

### **B. Repetir para Restaurantes**

```
src/pages/PlanosRestaurantes.tsx    ← Cópia de PlanosHotels (trocar "hotels" → "restaurantes")
src/pages/CadastroSucessoRestaurantes.tsx
src/pages/AdminRestaurantes.tsx
```

### **C. Atualizar Rotas**

`src/App.tsx` → adicionar:

```typescript
import PlanosHotels from './pages/PlanosHotels';
import CadastroSucessoHotels from './pages/CadastroSucessoHotels';
import AdminHotels from './pages/AdminHotels';
// ... idem restaurantes

<Route path="/planos/hotels" element={<PlanosHotels />} />
<Route path="/cadastro-sucesso" element={<CadastroSucessoHotels />} />
<Route path="/admin/hotels" element={<AdminHotels />} />
// ... idem restaurantes
```

---

## 🎯 FLUXOGRAMA VISUAL

```
┌─────────────────────────────────────────┐
│ VOCÊ ESTÁ AQUI:                         │
│ ✅ Backend 100% Pronto                  │
│ ✅ Testes Inclusos                      │
│ ⏳ Frontend Ainda Não Existe            │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
    ┌────────┐   ┌──────────┐
    │TESTAR? │   │FRONTEND? │
    └───┬────┘   └──────────┘
        │
   ✅ 3 passos rápidos:
   1. Migration
   2. Preços Stripe  
   3. Test script
```

---

## 📞 SE ALGO DER ERRO

| Erro | Solução |
|------|---------|
| "Migration not found" | Abrir Supabase SQL, colar SQL manual |
| "Price ID invalid" | Voltar ao Stripe, copiar price_id correto |
| "Email not sent" | Verificar `.env` tem SES_KEY + SES_SECRET |
| "Status 500" | Verificar console do servidor (npm start) |

---

## ✨ ESTIMATIVA DE TEMPO

| Etapa | Tempo | Status |
|-------|-------|--------|
| Migration | 5 min | ⏳ Fazer agora |
| Stripe Prices | 10 min | ⏳ Fazer agora |
| Backend Test | 15 min | ⏳ Fazer agora |
| Frontend Hotels | 1 hora | ⏳ Depois |
| Frontend Restaurantes | 1 hora | ⏳ Depois |
| **TOTAL** | **~3h** | ⏳ |

---

## 🚀 RESUMO FINAL

**O que você TEM agora:**
- ✅ Banco de dados (migration)
- ✅ Endpoints genéricos (/api/create-hotels-subscription, etc)
- ✅ Lógica de pagamento (Stripe)
- ✅ Lógica de emails (admin + proprietário)
- ✅ Admin panel endpoints
- ✅ Testes automáticos
- ✅ Documentação completa

**O que você PRECISA FAZER:**
1. Rodar migration (5 min)
2. Criar prices Stripe (10 min)
3. Rodar `.\test-backend.ps1` (resultado: ✅)
4. Criar 6 páginas frontend (2-3h)
5. Testar e-2-e no localhost
6. Deploy!

**Próximo comando:**
```bash
.\test-backend.ps1 -Type hotels -Email "seu@email.com"
```

---

**Quando tiver dúvidas:**
- Backend: ver `RESUMO_TECNICO_BACKEND.md`
- Testes: ver `TESTE_RAPIDO.md`
- Detalhes: ver `TESTE_BACKEND_HOTELS.md`
