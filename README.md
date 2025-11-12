# 🏛️ Portal de Turismo de Aparecida - Integração PagBank

Sistema de cadastro de estabelecimentos com pagamento integrado via **PagBank (PagSeguro)**.

## 🚀 Como rodar

### 1. Backend

```bash
# Copiar e configurar variáveis de ambiente
cp server/.env.example server/.env

# Editar server/.env e adicionar:
# PAGBANK_TOKEN=seu_token_sandbox
# PAGBANK_BASE_URL=https://sandbox.api.pagseguro.com
# SUPABASE_URL=sua_url
# SUPABASE_SERVICE_KEY=sua_key

# Instalar dependências
cd server
npm install

# Iniciar servidor
node index.js
```

**Saída esperada:**
```
✅ PagBank client configurado (SANDBOX)
🚀 Server on http://localhost:3001
```

### 2. Frontend

```bash
# Copiar e configurar variáveis de ambiente
cp .env.example .env

# Editar .env e adicionar:
# VITE_SUPABASE_URL=sua_url
# VITE_SUPABASE_ANON_KEY=sua_key
# VITE_API_URL=http://localhost:3001

# Instalar dependências
npm install

# Iniciar aplicação
npm run dev
```

### 3. Ngrok (para webhooks - opcional)

```bash
ngrok http 3001

# Copiar URL HTTPS gerada e adicionar no server/.env:
# PUBLIC_URL_NGROK=https://seu-subdominio.ngrok-free.app
```

---

## 📚 Documentação Completa

- **[PAGBANK_SETUP.md](./PAGBANK_SETUP.md)** - Guia completo de configuração PagBank
- **[README_PAGAMENTO.md](./README_PAGAMENTO.md)** - Detalhes da integração de pagamentos

---

## 🧪 Testar Pagamento

### Via Frontend:
1. Acesse: http://localhost:5173
2. Preencha o formulário de cadastro
3. Use cartão de teste:
   - **Número:** `4111 1111 1111 1111`
   - **CVV:** `123`
   - **Validade:** `12/2030`
   - **Nome:** `JOSE SILVA`
   - **CPF:** `12345678909`

### Via API (curl/Postman):

```bash
curl -X POST http://localhost:3001/api/register-business \
  -H "Content-Type: application/json" \
  -d '{
    "establishment_name": "Restaurante Teste",
    "category": "Restaurante",
    "address": "Rua Teste, 123",
    "plan_id": "UUID_DO_PLANO_NO_SUPABASE",
    "payer_email": "comprador@sandbox.pagseguro.com.br",
    "card_number": "4111111111111111",
    "card_exp_month": "12",
    "card_exp_year": "2030",
    "card_security_code": "123",
    "card_holder_name": "JOSE SILVA",
    "card_holder_tax_id": "12345678909"
  }'
```

---

## 🔔 Webhooks

Configure webhooks no portal PagBank para receber notificações de pagamento:

1. Acesse: https://dev.pagseguro.uol.com.br/webhooks
2. Adicione URL: `https://seu-ngrok.ngrok-free.app/pagbank/webhook`
3. Selecione eventos: `PAYMENT`, `ORDER`

---

## 📁 Estrutura do Projeto

```
aparecida/
├── server/
│   ├── payments/
│   │   ├── pagbankClient.js     # Cliente HTTP PagBank
│   │   └── pagbankService.js    # Lógica de negócio
│   ├── index.js                  # API principal
│   └── .env                      # Credenciais (não commitar!)
├── src/
│   ├── pages/
│   │   └── BusinessRegistration.tsx  # Formulário com cartão
│   └── lib/
│       └── businessService.ts    # Chamadas API
└── PAGBANK_SETUP.md             # Documentação completa
```

---

## ⚙️ Tecnologias

- **Backend:** Node.js + Express
- **Frontend:** React + TypeScript + Vite
- **Banco de Dados:** Supabase (PostgreSQL)
- **Pagamento:** PagBank (PagSeguro) API
- **Túnel HTTPS:** Ngrok

---

## 🆘 Troubleshooting

### Backend não inicia
```
❌ PAGBANK_TOKEN não configurado no .env!
```
**Solução:** Adicione o token no `server/.env`

### Pagamento recusado
**Solução:** Use cartões de teste da [documentação PagBank](https://dev.pagseguro.uol.com.br/reference/testing-cards)

### Webhook não recebe notificações
**Solução:** 
- Confirme se Ngrok está rodando
- Verifique se a URL está configurada no portal PagBank

---

## 📞 Suporte

- **PagBank Developer:** https://dev.pagseguro.uol.com.br/
- **Documentação API:** https://dev.pagseguro.uol.com.br/reference/api-overview

---

**Desenvolvido com ❤️ para Aparecida (SP)**
