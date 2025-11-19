# 🔥 SOLUÇÃO DEFINITIVA - ERRO "Both payer and collector must be real or test users"

## ❌ PROBLEMA IDENTIFICADO

Você está usando credenciais da sua **CONTA REAL**, não das **CONTAS DE TESTE**.

O Mercado Pago exige que para testes de assinatura:
- ✅ VENDEDOR = conta de teste
- ✅ COMPRADOR = conta de teste
- ✅ Ambos criados pela mesma conta de desenvolvedor

---

## 🎯 SOLUÇÃO - PASSO A PASSO

### 1️⃣ CRIAR USUÁRIOS DE TESTE

**Acesse:** https://www.mercadopago.com.br/developers/panel/test-users

**Crie 2 usuários:**

1. **Vendedor (Seller)**
   - Clique em "Criar usuário de teste"
   - Tipo: **Vendedor**
   - País: Brasil
   - Clique em "Criar"

2. **Comprador (Buyer)**
   - Clique em "Criar usuário de teste"
   - Tipo: **Comprador**
   - País: Brasil
   - Clique em "Criar"

**Anote:**
- ✅ Email do vendedor
- ✅ Senha do vendedor
- ✅ Email do comprador
- ✅ Senha do comprador

---

### 2️⃣ OBTER ACCESS TOKEN DO VENDEDOR

**Método 1 - Pelo Painel (Mais fácil):**

1. Na lista de usuários de teste, encontre o **VENDEDOR**
2. Clique nos **3 pontinhos** → **Ver detalhes**
3. Copie o **Access Token** que começa com `TEST-`
4. Copie também o **Public Key** que começa com `TEST-`

**Método 2 - Fazendo Login:**

1. Abra uma aba anônima
2. Acesse: https://www.mercadopago.com.br
3. Faça login com o **email e senha do VENDEDOR de teste**
4. Vá em: **Seu negócio → Configurações → Credenciais**
5. Escolha **Credenciais de teste**
6. Copie:
   - **Public Key** (começa com `TEST-`)
   - **Access Token** (começa com `TEST-`)

---

### 3️⃣ CONFIGURAR O BACKEND COM AS CREDENCIAIS CORRETAS

Edite `server/.env`:

```env
# Mercado Pago - CONTAS DE TESTE
MERCADO_PAGO_ACCESS_TOKEN=TEST-xxxxxxxxx-xxxxxx-xxxxxxxx-xxxxxxxx
MERCADO_PAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# URL pública do backend (Ngrok)
PUBLIC_URL_NGROK=https://sua-url.ngrok-free.app

# Supabase
SUPABASE_URL=https://rhkwickoweflamflgzeo.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

PORT=3001
```

⚠️ **IMPORTANTE:** Use o Access Token **DO VENDEDOR DE TESTE**, não da sua conta real!

---

### 4️⃣ CONFIGURAR O FRONTEND

Edite `.env`:

```env
# Supabase
VITE_SUPABASE_URL=https://rhkwickoweflamflgzeo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# URL da API backend
VITE_API_URL=http://localhost:3001

# URL pública do backend (Ngrok)
VITE_PUBLIC_URL_NGROK=https://sua-url.ngrok-free.app

# Mercado Pago Public Key (TESTE)
VITE_MERCADO_PAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Email do COMPRADOR de teste (para usar no formulário)
VITE_TEST_BUYER_EMAIL=test_user_123456@testuser.com
```

---

### 5️⃣ USAR O EMAIL CORRETO NO FORMULÁRIO

No campo **"E-mail para Pagamento"** do formulário, você DEVE usar o email do **COMPRADOR DE TESTE**.

**Formato do email:** `test_user_[ID]@testuser.com`

**Exemplo:** `test_user_8281623049456451088@testuser.com`

🔴 **NÃO USE:**
- ❌ Gmail pessoal
- ❌ Email inventado
- ❌ Email aleatório

✅ **USE APENAS:** O email do usuário COMPRADOR de teste que você criou

---

### 6️⃣ AJUSTAR O CÓDIGO PARA VALIDAR O EMAIL DE TESTE

Vou ajustar o código para garantir que apenas emails de teste sejam aceitos durante o desenvolvimento.

---

## 🧪 CHECKLIST FINAL

Antes de testar novamente, confirme:

- [ ] Criei 2 usuários de teste (Vendedor e Comprador)
- [ ] Copiei o Access Token DO VENDEDOR de teste
- [ ] Copiei o Public Key DO VENDEDOR de teste
- [ ] Atualizei `server/.env` com as credenciais corretas
- [ ] Atualizei `.env` (frontend) com o Public Key correto
- [ ] Anotei o EMAIL do COMPRADOR de teste
- [ ] Vou usar APENAS o email do comprador de teste no formulário
- [ ] Reiniciei o servidor backend
- [ ] Reiniciei o frontend

---

## 🎯 APÓS CONFIGURAR TUDO

1. **Reinicie o servidor:**
```powershell
cd server
npm start
```

2. **Preencha o formulário usando:**
   - Email para pagamento: `test_user_[SEU_ID]@testuser.com`

3. **No checkout do Mercado Pago:**
   - Use os cartões de teste (veja TESTE_ASSINATURA_MENSAL.md)

---

## 📚 LINKS ÚTEIS

- **Painel de usuários de teste:** https://www.mercadopago.com.br/developers/panel/test-users
- **Documentação:** https://www.mercadopago.com.br/developers/pt/docs/testing/test-users
- **Credenciais de teste:** https://www.mercadopago.com.br/developers/panel/credentials

---

**✨ Depois de seguir todos esses passos, o erro "Both payer and collector must be real or test users" será resolvido!**
