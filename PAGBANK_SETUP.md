# 🏦 Configuração PagBank (PagSeguro) - Guia Completo

## 📋 Índice
1. [Criar Conta de Desenvolvedor](#criar-conta)
2. [Obter Token de Sandbox](#obter-token)
3. [Configurar Ambiente](#configurar-ambiente)
4. [Cartões de Teste](#cartões-de-teste)
5. [Configurar Webhooks](#webhooks)
6. [Testar Integração](#testar)
7. [Produção](#produção)

---

## 1. 🆕 Criar Conta de Desenvolvedor {#criar-conta}

1. Acesse: https://dev.pagseguro.uol.com.br/
2. Clique em **"Criar conta"** ou **"Entrar"** se já tiver
3. Preencha os dados cadastrais
4. Confirme seu email

---

## 2. 🔑 Obter Token de Sandbox {#obter-token}

### Passo a Passo:

1. **Acesse o painel de credenciais:**
   - URL: https://dev.pagseguro.uol.com.br/credentials

2. **Gere um Token de Sandbox:**
   - Clique em **"Gerar novo token"**
   - Escolha **"Sandbox"** (ambiente de testes)
   - Copie o token gerado (começa com algo como: `B6D5C8D...`)

3. **⚠️ IMPORTANTE:**
   - Guarde o token em local seguro
   - NUNCA comite o token no Git
   - Use `.env` para armazenar credenciais

---

## 3. ⚙️ Configurar Ambiente {#configurar-ambiente}

### Backend (server/.env):

```bash
# PagBank (PagSeguro) - SANDBOX
PAGBANK_TOKEN=SEU_TOKEN_SANDBOX_AQUI
PAGBANK_EMAIL=seu-email@sandbox.pagseguro.com.br
PAGBANK_BASE_URL=https://sandbox.api.pagseguro.com

# Supabase
SUPABASE_URL=sua_url_supabase
SUPABASE_SERVICE_KEY=sua_service_key

# Ngrok (para webhooks)
PUBLIC_URL_NGROK=https://seu-subdominio.ngrok-free.app
```

### Instalar Dependências:

```bash
cd server
npm install axios
```

### Iniciar Servidor:

```bash
cd server
node index.js
```

**Saída esperada:**
```
✅ PagBank client configurado (SANDBOX)
   Base URL: https://sandbox.api.pagseguro.com
🔍 SUPABASE_URL: https://...
🚀 Server on http://localhost:3001
```

---

## 4. 💳 Cartões de Teste {#cartões-de-teste}

### 🟢 Cartão APROVADO:

```
Número: 4111 1111 1111 1111
CVV: 123
Validade: 12/2030
Nome: JOSE SILVA
CPF: 12345678909
```

### 🔴 Cartão NEGADO:

```
Número: 4000 0000 0000 0010
CVV: 123
Validade: 12/2030
```

### 🟡 Outros Cartões:

Documentação completa: https://dev.pagseguro.uol.com.br/reference/testing-cards

---

## 5. 🔔 Configurar Webhooks {#webhooks}

### O que são webhooks?

Webhooks são notificações automáticas que o PagBank envia quando há mudanças no status de um pagamento (aprovado, negado, etc).

### Configurar com Ngrok:

1. **Instalar Ngrok:**
   ```bash
   # Windows (Chocolatey)
   choco install ngrok
   
   # Ou baixar: https://ngrok.com/download
   ```

2. **Iniciar túnel HTTPS:**
   ```bash
   ngrok http 3001
   ```

3. **Copiar URL HTTPS:**
   ```
   Forwarding: https://9b2dae30ed84.ngrok-free.app -> http://localhost:3001
   ```

4. **Atualizar .env:**
   ```bash
   PUBLIC_URL_NGROK=https://9b2dae30ed84.ngrok-free.app
   ```

5. **Configurar no portal PagBank:**
   - Acesse: https://dev.pagseguro.uol.com.br/webhooks
   - Adicione a URL: `https://SEU_SUBDOMINIO.ngrok-free.app/pagbank/webhook`
   - Selecione eventos: `PAYMENT`, `ORDER`

### Testar Webhook:

Após processar um pagamento, verifique os logs do servidor:

```
📥 PagBank Webhook recebido:
   Headers: { ... }
   Body: { id: "ORDE_XXX", status: "PAID" }
```

---

## 6. 🧪 Testar Integração {#testar}

### Teste via Frontend:

1. **Iniciar aplicação:**
   ```bash
   # Terminal 1 - Backend
   cd server
   node index.js
   
   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Acessar formulário:**
   - URL: http://localhost:5173

3. **Preencher dados:**
   - Nome do estabelecimento: `Teste Restaurante`
   - Categoria: `Restaurante`
   - Email: `comprador@sandbox.pagseguro.com.br`
   - Cartão: `4111 1111 1111 1111`
   - CVV: `123`
   - Validade: `12/2030`
   - Nome: `JOSE SILVA`
   - CPF: `12345678909`

4. **Enviar formulário**

5. **Verificar resposta:**
   ```json
   {
     "success": true,
     "business_id": "uuid-aqui",
     "order_id": "ORDE_XXX",
     "status": "PAID",
     "message": "Pagamento aprovado!"
   }
   ```

### Teste via API (curl):

```bash
curl -X POST http://localhost:3001/api/register-business \
  -H "Content-Type: application/json" \
  -d '{
    "establishment_name": "Teste API",
    "category": "Restaurante",
    "address": "Rua Teste, 123",
    "plan_id": "UUID_DO_PLANO",
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

## 7. 🚀 Produção {#produção}

### Quando migrar para produção:

1. **Gerar Token de Produção:**
   - Acesse: https://dev.pagseguro.uol.com.br/credentials
   - Gere um token de **PRODUÇÃO**

2. **Atualizar .env:**
   ```bash
   # PagBank (PagSeguro) - PRODUÇÃO
   PAGBANK_TOKEN=SEU_TOKEN_PRODUCAO_AQUI
   PAGBANK_BASE_URL=https://api.pagseguro.com
   ```

3. **Usar cartões REAIS:**
   - Não funcionam mais cartões de teste
   - Use cartões reais de clientes

4. **Webhook em domínio público:**
   - Substitua Ngrok por domínio real: `https://seudominio.com/pagbank/webhook`

5. **Validar Webhook:**
   - Implemente validação de assinatura (futuro)

---

## 📚 Referências

- [Documentação PagBank](https://dev.pagseguro.uol.com.br/reference/api-overview)
- [Criar Pedido (Orders API)](https://dev.pagseguro.uol.com.br/reference/criar-pedido)
- [Webhooks](https://dev.pagseguro.uol.com.br/reference/webhooks-intro)
- [Cartões de Teste](https://dev.pagseguro.uol.com.br/reference/testing-cards)
- [Status de Pagamento](https://dev.pagseguro.uol.com.br/reference/status-de-pagamento)

---

## ❓ Troubleshooting

### Erro: "PAGBANK_TOKEN não configurado"

**Solução:** Configure o token no arquivo `server/.env`

### Erro: "401 Unauthorized"

**Solução:** 
- Verifique se o token está correto
- Confirme se está usando token de SANDBOX para testes

### Erro: "400 Bad Request - Invalid card"

**Solução:**
- Use cartões de teste da documentação
- Verifique formato: sem espaços, 16 dígitos

### Webhook não recebe notificações

**Solução:**
- Confirme se Ngrok está rodando
- Verifique se a URL está configurada no portal PagBank
- Teste manualmente: `curl https://SEU_NGROK.ngrok-free.app/pagbank/webhook`

---

## 💡 Próximos Passos

- [ ] Implementar validação de assinatura do webhook
- [ ] Adicionar recorrência mensal (API PagBank Recorrente)
- [ ] Criar painel de administração para gerenciar pagamentos
- [ ] Implementar 3DS (autenticação 3D Secure) para maior segurança
- [ ] Adicionar logs estruturados de pagamentos no Supabase

---

**Desenvolvido por:** Equipe Aparecida Turismo
**Última atualização:** Novembro 2025
