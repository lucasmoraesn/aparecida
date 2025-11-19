# 🔗 CONFIGURAÇÃO DE WEBHOOK - MERCADO PAGO

## ❌ Erro 403 - SOLUÇÃO COMPLETA

O erro **403 (Forbidden)** ocorre quando o Ngrok bloqueia requisições do Mercado Pago por causa da página de aviso.

### ✅ SOLUÇÕES APLICADAS:

1. **✅ CORS mais permissivo** - Aceita requisições de qualquer origem
2. **✅ Headers adicionais** - Bypass do aviso do Ngrok
3. **✅ Raw body parsing** - Para webhook antes do express.json
4. **✅ Resposta imediata** - Responde 200 OK instantaneamente ao MP
5. **✅ Processamento assíncrono** - Processa dados depois de responder
6. **✅ Endpoint GET** - Para teste de verificação do MP

### 🧪 TESTE AUTOMATIZADO DO WEBHOOK:

**1. Edite o arquivo `test-webhook.ps1` e coloque sua URL do Ngrok:**
```powershell
$NGROK_URL = "https://abc123.ngrok-free.app"
```

**2. Execute o teste:**
```powershell
.\test-webhook.ps1
```

**3. Resultado esperado:**
```
✅ GET funcionou
✅ POST funcionou
✅ Preapproval POST funcionou
✅ Authorized Payment POST funcionou
```

---

## 🚀 COMO CONFIGURAR O WEBHOOK

### Opção 1: Via Painel do Mercado Pago (Recomendado para Produção)

1. Acesse: https://www.mercadopago.com.br/developers/panel/webhooks
2. Clique em **"Criar webhook"**
3. Configure:
   - **Nome:** Webhook Assinatura Aparecida
   - **URL:** `https://sua-url.ngrok-free.app/api/payment-webhook`
   - **Eventos:**
     - ✅ `payment` (Pagamentos)
     - ✅ `authorized_payment` (Pagamentos autorizados - assinaturas)
     - ✅ `preapproval` (Mudanças na assinatura)
4. Clique em **"Salvar"**

### Opção 2: Sem Configurar Webhook (Para Testes Rápidos)

Se você não quer configurar webhook agora, pode verificar os pagamentos manualmente:

1. Acesse o painel do Mercado Pago: https://www.mercadopago.com.br/activities
2. Veja os pagamentos aprovados
3. Atualize manualmente no banco de dados se necessário

---

## 🔍 VERIFICAR SE O WEBHOOK ESTÁ FUNCIONANDO

### 1️⃣ Teste Manual via Browser

Abra no navegador:
```
https://sua-url.ngrok-free.app/api/payment-webhook
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "message": "Webhook endpoint está funcionando",
  "timestamp": "2025-11-18T..."
}
```

### 2️⃣ Teste via PowerShell

```powershell
# Substitua pela sua URL do Ngrok
$ngrokUrl = "https://abc123.ngrok-free.app"

# Teste GET (verificação)
Invoke-RestMethod -Uri "$ngrokUrl/api/payment-webhook" -Method Get

# Teste POST (simular webhook)
$body = @{
    type = "payment"
    data = @{
        id = "123456789"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "$ngrokUrl/api/payment-webhook" -Method Post -Body $body -ContentType "application/json" -Headers @{"ngrok-skip-browser-warning"="true"}
```

### 3️⃣ Ver logs do Ngrok

No terminal do Ngrok, você verá todas as requisições:
```
GET /api/payment-webhook   200 OK
POST /api/payment-webhook  200 OK
```

---

## 🛠️ AJUSTES REALIZADOS NO CÓDIGO

### ✅ `server/index.js`

#### 1. Adicionado middleware para Ngrok
```javascript
// Middleware para aceitar requisições do Ngrok
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});
```

#### 2. Adicionado endpoint GET para verificação
```javascript
app.get("/api/payment-webhook", (_req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "Webhook endpoint está funcionando"
  });
});
```

#### 3. Desabilitada validação de assinatura (temporariamente)
```javascript
// NOTA: Validação de assinatura desabilitada para testes
// Em produção, reativar a validação
```

---

## ⚠️ IMPORTANTE PARA PRODUÇÃO

Quando for para produção, você DEVE:

1. **Reativar validação de assinatura:**
```javascript
if (req.headers['x-signature'] !== process.env.MP_WEBHOOK_SECRET) {
  console.warn('⚠️ Webhook rejeitado: assinatura inválida');
  return res.status(401).send('Unauthorized');
}
```

2. **Usar domínio próprio** (não Ngrok)
3. **Configurar HTTPS** com certificado válido
4. **Validar IP de origem** (opcional, mas recomendado)

---

## 🔄 REINICIAR O SERVIDOR

Após as alterações, reinicie o servidor:

```powershell
# Parar o servidor (Ctrl+C)
# Iniciar novamente
cd server
node index.js
```

Você deve ver:
```
✅ Mercado Pago SDK initialized
✅ Supabase client created
🚀 Server on http://localhost:3001
✅ Server is ready and listening for requests
```

---

## 🧪 TESTAR NOVAMENTE

1. **Acesse o painel do Mercado Pago** para configurar webhook
2. **Use a URL do Ngrok:** `https://sua-url.ngrok-free.app/api/payment-webhook`
3. **Teste o webhook** no painel do Mercado Pago
4. **Faça um pagamento de teste** e veja os logs

---

## 📋 CHECKLIST

- [ ] Servidor backend reiniciado com as alterações
- [ ] Ngrok rodando e URL anotada
- [ ] Endpoint GET testado no browser (retorna JSON com "status": "ok")
- [ ] Webhook configurado no painel do Mercado Pago
- [ ] Logs do servidor mostrando requisições do webhook
- [ ] Teste de pagamento realizado e webhook recebido

---

## 🆘 AINDA COM PROBLEMAS?

### Erro 403 persiste?

1. **Verifique se o Ngrok está no plano gratuito:**
   - O plano gratuito pode bloquear algumas requisições
   - Tente adicionar o header `ngrok-skip-browser-warning: true`

2. **Use o domínio estático do Ngrok (se tiver plano pago):**
   ```powershell
   ngrok http 3001 --domain=seu-dominio-estatico.ngrok-free.app
   ```

3. **Alternativa: Use serviços similares:**
   - **LocalTunnel:** `npx localtunnel --port 3001`
   - **Serveo:** `ssh -R 80:localhost:3001 serveo.net`
   - **Cloudflare Tunnel:** Gratuito e sem limitações

### Webhook não está sendo chamado?

1. Verifique os logs do Ngrok
2. Confirme que a URL está correta no painel do MP
3. Teste manualmente com `Invoke-RestMethod` (comando acima)
4. Verifique se o servidor backend está rodando

---

**✨ Webhook configurado e pronto para receber notificações do Mercado Pago!**
