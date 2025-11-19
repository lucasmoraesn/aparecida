# 🧪 GUIA DE TESTE - ASSINATURA MENSAL MERCADO PAGO

## ✅ CONFIGURAÇÃO CONCLUÍDA

### 📋 Credenciais de Teste Configuradas

**Conta VENDEDOR:**
- User ID: `2998106582`
- Usuário: `TESTUSER6922...`
- Email: `test_user_2998106582@testuser.com`

**Conta COMPRADOR:**
- User ID: `2997967263`
- Usuário: `TESTUSER8281...`
- **Email: `test_user_2997967263@testuser.com` (USE ESTE NO FORMULÁRIO)**

**Credenciais Mercado Pago (Sandbox):**
- **Public Key:** `TEST-75a469e4-f464-43c2-9e60-266b6b299180`
- **Access Token:** `TEST-1751150062149495-111118-36265247e49252183b6f880f29458144-2936869089`

---

## 🚀 COMO EXECUTAR O TESTE

### 1️⃣ Preparar o Ambiente

```powershell
# Terminal 1 - Backend
cd server
npm install
node index.js
```

```powershell
# Terminal 2 - Frontend
cd c:\projetos\aparecida
npm install
npm run dev
```

```powershell
# Terminal 3 - Ngrok (para webhooks)
ngrok http 3001
```

**⚠️ IMPORTANTE:** Após iniciar o Ngrok, copie a URL (ex: `https://abc123.ngrok-free.app`) e atualize nos arquivos `.env`:
- `.env` (frontend): `VITE_PUBLIC_URL_NGROK=https://abc123.ngrok-free.app`
- `server/.env` (backend): `PUBLIC_URL_NGROK=https://abc123.ngrok-free.app`

### 2️⃣ Acessar o Sistema

1. Abra o navegador em `http://localhost:5173`
2. Navegue até **"Cadastre seu Negócio"** (menu ou `/business-registration`)

### 3️⃣ Preencher o Formulário

1. **Escolha um Plano** (Básico, Intermediário ou Premium)
2. Preencha todos os campos obrigatórios:
   - Nome do Estabelecimento
   - Categoria
   - Endereço
   - Localização no mapa
   - **Mínimo 3 fotos** (JPG/PNG)
   - WhatsApp
   - Descrição
3. **E-mail para Pagamento:** Use um email de teste qualquer (ex: `comprador@teste.com`)
4. Aceite os termos
5. Clique em **"Finalizar Cadastro e Pagar"**

### 4️⃣ Realizar o Pagamento no Mercado Pago

Você será redirecionado para o checkout do Mercado Pago (ambiente sandbox).

**Para testar com cartão de crédito:**

#### 🔹 Cartões de Teste Aprovados
```
Mastercard: 5031 4332 1540 6351
Expira: 11/25
CVV: 123
Titular: APRO (qualquer nome funciona)
CPF: 19119119100
```

```
Visa: 4509 9535 6623 3704
Expira: 11/25
CVV: 123
Titular: APRO
CPF: 19119119100
```

#### 🔹 Outros Status de Teste
Para testar diferentes cenários, use estes nomes no campo "Titular do Cartão":

| Nome no Cartão | Resultado | Status |
|----------------|-----------|--------|
| `APRO` | ✅ Aprovado | `approved` |
| `OTHE` | ✅ Aprovado (outro método) | `approved` |
| `CONT` | ⏳ Pendente | `pending` |
| `CALL` | ⚠️ Recusado - Ligar para autorizar | `rejected` |
| `FUND` | ❌ Recusado - Fundos insuficientes | `rejected` |
| `SECU` | ❌ Recusado - Código de segurança | `rejected` |
| `EXPI` | ❌ Recusado - Cartão vencido | `rejected` |
| `FORM` | ❌ Recusado - Erro no formulário | `rejected` |

### 5️⃣ Verificar Webhook

Após a aprovação do pagamento, o Mercado Pago enviará um webhook para:
```
https://seu-ngrok.ngrok-free.app/api/payment-webhook
```

Verifique os logs no terminal do backend:
```
📩 Webhook recebido do Mercado Pago
💳 Detalhes do pagamento: {...}
✅ Pagamento registrado: xxxxx
✅ Assinatura ativada: xxxxx
```

### 6️⃣ Verificar no Banco de Dados

Execute no Supabase (SQL Editor):

```sql
-- Ver assinaturas criadas
SELECT id, business_id, plan_id, status, preapproval_id, created_at 
FROM subscriptions 
ORDER BY created_at DESC 
LIMIT 5;

-- Ver pagamentos registrados
SELECT id, subscription_id, mp_payment_id, status, amount_cents, paid_at 
FROM payments 
ORDER BY created_at DESC 
LIMIT 5;

-- Ver cadastros de negócios
SELECT id, establishment_name, plan_id, created_at 
FROM business_registrations 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## 🔍 ARQUIVOS CORRIGIDOS

### ✅ Alterações Realizadas:

1. **`.env`** (frontend)
   - ✅ Adicionado `VITE_MERCADO_PAGO_PUBLIC_KEY=TEST-75a469e4-f464-43c2-9e60-266b6b299180`
   - ✅ Adicionado comentários com as contas de teste

2. **`server/.env`** (backend)
   - ✅ Confirmado `MERCADO_PAGO_ACCESS_TOKEN` correto
   - ✅ Confirmado `MERCADO_PAGO_PUBLIC_KEY` correto
   - ✅ Adicionado comentários com as contas de teste

3. **`server/index.js`**
   - ✅ Adicionado log do ambiente (SANDBOX/PRODUÇÃO)
   - ✅ Confirmado uso correto da variável `MERCADO_PAGO_ACCESS_TOKEN`

4. **`server/app.js`**
   - ✅ Corrigido uso de `MP_ACCESS_TOKEN` para `MERCADO_PAGO_ACCESS_TOKEN`
   - ✅ Adicionado log do ambiente

5. **`src/components/MercadoPagoButton.tsx`**
   - ✅ Corrigido `VITE_MP_PUBLIC_KEY_SANDBOX` para `VITE_MERCADO_PAGO_PUBLIC_KEY`

6. **`src/lib/assinatura.ts`**
   - ✅ Corrigido para usar `VITE_API_URL` ou `VITE_PUBLIC_URL_NGROK`
   - ✅ Adicionado comentário sobre conta COMPRADOR

7. **`src/lib/businessService.ts`**
   - ✅ Corrigido para usar `VITE_API_URL` ou `VITE_PUBLIC_URL_NGROK`

---

## 📊 FLUXO COMPLETO DA ASSINATURA

```
1. Frontend (BusinessRegistration.tsx)
   ↓ Envia formulário com dados + plano
   
2. Backend (POST /api/register-business)
   ↓ Salva cadastro no Supabase → retorna businessId
   
3. Backend (POST /api/create-subscription)
   ↓ Cria registro na tabela 'subscriptions'
   ↓ Cria PreApproval no Mercado Pago (SDK v2)
   ↓ Retorna init_point (URL checkout)
   
4. Frontend
   ↓ Redireciona usuário para init_point
   
5. Mercado Pago (Checkout)
   ↓ Usuário preenche dados do cartão
   ↓ Processa pagamento
   
6. Mercado Pago → Webhook (POST /api/payment-webhook)
   ↓ Envia notificação de pagamento
   ↓ Backend consulta status do pagamento
   ↓ Registra na tabela 'payments'
   ↓ Atualiza status da assinatura para 'active'
   
7. Assinatura Ativa ✅
```

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### ❌ Erro: "Credenciais do Mercado Pago não configuradas"
**Solução:** Verifique se as variáveis de ambiente estão corretas:
- Frontend: `VITE_MERCADO_PAGO_PUBLIC_KEY`
- Backend: `MERCADO_PAGO_ACCESS_TOKEN` e `MERCADO_PAGO_PUBLIC_KEY`

### ❌ Webhook não está sendo recebido
**Solução:**
1. Confirme que o Ngrok está rodando
2. Atualize `PUBLIC_URL_NGROK` no `server/.env`
3. Reinicie o servidor backend
4. Verifique logs do Ngrok: `ngrok http 3001` (você verá as requisições)

### ❌ Erro: "PUBLIC URL (ngrok) not configured"
**Solução:** Configure a variável `PUBLIC_URL_NGROK` no `server/.env`

### ❌ Pagamento recusado no teste
**Solução:** Use o nome `APRO` no campo "Titular do Cartão"

### ❌ Erro ao criar preapproval
**Solução:** Verifique se:
1. O Access Token está correto
2. Começa com `TEST-` (ambiente sandbox)
3. O plano tem valor maior que R$ 0.50

---

## 📚 Documentação Oficial

- [Mercado Pago - Assinaturas (PreApproval)](https://www.mercadopago.com.br/developers/pt/docs/subscriptions/introduction)
- [Mercado Pago - Cartões de Teste](https://www.mercadopago.com.br/developers/pt/docs/testing/test-cards)
- [Mercado Pago - Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)
- [SDK Node.js v2](https://github.com/mercadopago/sdk-nodejs)

---

## ✅ CHECKLIST FINAL

- [ ] Backend rodando (`node server/index.js`)
- [ ] Frontend rodando (`npm run dev`)
- [ ] Ngrok rodando e URL atualizada nos `.env`
- [ ] Variáveis de ambiente corretas (PUBLIC_KEY e ACCESS_TOKEN)
- [ ] Supabase configurado e tabelas criadas
- [ ] Teste de cadastro + assinatura realizado
- [ ] Webhook recebido e processado
- [ ] Dados salvos no banco corretamente

---

## 🎯 PRÓXIMOS PASSOS (Produção)

Quando for para produção:

1. **Obter credenciais de PRODUÇÃO** no Mercado Pago
2. **Substituir** as credenciais de teste pelas de produção
3. **Remover** prefixo `TEST-` das variáveis
4. **Configurar** domínio real (não usar Ngrok)
5. **Ativar** webhooks no painel do Mercado Pago
6. **Testar** com valores reais pequenos primeiro

---

**✨ TUDO CONFIGURADO E PRONTO PARA TESTE!**
