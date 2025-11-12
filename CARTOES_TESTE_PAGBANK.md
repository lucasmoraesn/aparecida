# 💳 Cartões de Teste PagBank - Guia Rápido

## ✅ Cartões que APROVAM o Pagamento

### Visa
```
Número: 4111 1111 1111 1111
Validade: 12/2030
CVV: 123
Nome: Jose da Silva
CPF: 123.456.789-09
```

### Mastercard
```
Número: 5555 5555 5555 4444
Validade: 12/2030
CVV: 123
Nome: Jose da Silva
CPF: 123.456.789-09
```

### Amex
```
Número: 3782 822463 10005
Validade: 12/2030
CVV: 1234 (4 dígitos)
Nome: Jose da Silva
CPF: 123.456.789-09
```

### Elo
```
Número: 6362 9700 0000 0005
Validade: 12/2030
CVV: 123
Nome: Jose da Silva
CPF: 123.456.789-09
```

---

## ❌ Cartões que RECUSAM o Pagamento (Sandbox)

⚠️ **ATENÇÃO:** No ambiente **sandbox**, o PagBank **APROVA TODOS OS CARTÕES** automaticamente.

Para testar cenários de recusa, você precisa:
1. Usar o ambiente de **produção** (não recomendado para testes)
2. Ou simular erros manualmente no código

**Cartões de teste que deveriam recusar (mas no sandbox aprovam):**

### Saldo Insuficiente
```
Número: 4000 0000 0000 0010
Validade: 12/2030
CVV: 123
```

### Cartão Expirado
```
Número: 4000 0000 0000 0069
Validade: 12/2030
CVV: 123
```

---

## 🧪 Como Testar na sua Plataforma

### 1. Iniciar o Servidor (se não estiver rodando)
```powershell
cd c:\projetos\aparecida\server
npm run dev
```

### 2. Acessar o Frontend
```
http://localhost:5173
```

### 3. Fazer um Pagamento de Teste

**Dados para preencher no formulário:**

```
📧 Email: teste@sandbox.pagseguro.com.br
👤 Nome: Jose da Silva
🆔 CPF: 123.456.789-09

💳 Cartão: 4111 1111 1111 1111
📅 Validade: 12/2030
🔒 CVV: 123

💰 Valor: Qualquer valor (ex: R$ 10,00)
```

---

## 📊 Verificando o Resultado

### No Console do Navegador (F12)
Você verá logs do processo de pagamento.

### No Terminal do Servidor
Verá logs sanitizados:
```
📦 PagBank - Criando pedido:
{
  "reference_id": "order_...",
  "amount": "R$ 10",
  "customer": "teste@sandbox.pagseguro.com.br",
  "payload": {
    "card": {
      "number": "**** **** **** 1111",  ← Mascarado!
      "cvv": "***"                       ← Mascarado!
    }
  }
}

✅ PagBank - Pedido criado: {
  order_id: 'ORDE_XXXXX',
  status: 'PAID'
}
```

### No Banco de Dados (Supabase)
```sql
-- Ver último pedido criado
SELECT * FROM pagbank_orders 
ORDER BY created_at DESC 
LIMIT 1;

-- Ver webhooks recebidos (se configurado)
SELECT * FROM payment_webhooks 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## 🔍 Testando Cenários Específicos

### Teste 1: Pagamento Aprovado ✅
```javascript
// Use qualquer cartão de teste acima
// Resultado esperado: status = "PAID"
```

### Teste 2: Múltiplas Parcelas
```javascript
// No formulário, selecione 3x sem juros
// O PagBank processa normalmente
```

### Teste 3: Valores Diferentes
```javascript
// Teste com:
// - R$ 1,00 (mínimo)
// - R$ 10,00 (padrão)
// - R$ 100,00
// - R$ 1.000,00
```

---

## 🚨 Problemas Comuns

### ❌ Erro 401 - "Invalid credentials"
**Causa:** Token inválido ou expirado
**Solução:**
1. Verificar `PAGBANK_TOKEN` no `.env`
2. Gerar novo token: https://dev.pagseguro.uol.com.br/credentials

### ❌ Erro 400 - "Invalid card"
**Causa:** Formato do cartão incorreto
**Solução:**
- Remover espaços do número do cartão
- Verificar se o formato está correto
- Usar cartões da lista acima

### ❌ Erro de CORS
**Causa:** Frontend e backend em origens diferentes
**Solução:**
- Verificar se `VITE_API_URL` está correto no frontend
- Backend já está configurado para aceitar `localhost:5173`

---

## 📝 Dados de Teste Rápidos (Copiar/Colar)

**CPF:** `12345678909` (sem formatação)

**Email:** `teste@sandbox.pagseguro.com.br`

**Nome:** `Jose da Silva`

**Cartão:** `4111111111111111` (sem espaços)

**Validade:** Mês: `12` / Ano: `2030`

**CVV:** `123`

---

## 🎯 Próximos Passos Após Teste

1. ✅ Se o pagamento foi aprovado → Tudo funcionando!
2. 📊 Verificar dados no Supabase
3. 🔔 Configurar webhook (ngrok) para receber notificações
4. 🚀 Preparar para produção

---

## 🔗 Links Úteis

- **Painel PagBank Sandbox:** https://sandbox.pagseguro.uol.com.br/
- **Documentação de Cartões:** https://dev.pagseguro.uol.com.br/docs/checkout-cartoes-de-teste
- **API Reference:** https://dev.pagseguro.uol.com.br/reference/orders-api

---

**Dica:** 💡 No sandbox, TODOS os cartões são aprovados. Para testar recusas reais, você precisará do ambiente de produção.
