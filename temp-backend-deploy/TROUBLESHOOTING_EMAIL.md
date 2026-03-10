# ❌ Troubleshooting: E-mail não chega

Se você rodou tudo e a assinatura fica ativa, mas o e-mail não chega, aqui estão as soluções.

---

## 🔍 PASSO 1: Verifique o log da aplicação

O servidor está rodando em desenvolvimento local?

```powershell
cd c:\projetos\aparecida\server
npm run dev
```

Quando o webhook é acionado, você deve ver:

```
🔔 WEBHOOK RECEBIDO!
✅ Webhook verificado: checkout.session.completed
✅ Assinatura encontrada no banco
✅ Assinatura ATIVADA COM SUCESSO!
📧 Preparando envio de e-mail de notificação...
✅ [SES] E-mail enviado com sucesso
   Para: seu@email.com
   Assunto: 🎉 Nova Assinatura: ...
   MessageId: 0102019...
```

### Se você vê "❌ [SES] Erro ao enviar e-mail"

O erro será mostrado na próxima linha. Procure por:
- `UnrecognizedClientException` → Credenciais AWS inválidas
- `MessageRejected` → Endereço não verificado
- `Throttling` → Muitos e-mails muito rápido

---

## 🔍 PASSO 2: Verifique o .env

Abra `server/.env` e confirme:

```env
AWS_REGION=us-east-2
EMAIL_FROM=Explore Aparecida <noreply@aparecidadonortesp.com.br>
ADMIN_EMAIL=aparecidatoursp@hotmail.com
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Atenção especial:**
- `EMAIL_FROM` deve ser um e-mail **verificado** no SES
- `ADMIN_EMAIL` é para onde as notificações vão
- `AWS_REGION` deve ser `us-east-2`

---

## 🔍 PASSO 3: Verifique Endereços no SES

Acesse: https://us-east-2.console.aws.amazon.com/ses/

Busque por "Verified identities" e confirme:
- ✅ `noreply@aparecidadonortesp.com.br` está lá
- ✅ Status: "verified"

Se não estiver:
1. Clique em "Create identity"
2. Escolha "Email address"
3. Digite: `noreply@aparecidadonortesp.com.br`
4. Clique em "Create"
5. Confirme o link que receberá por e-mail

---

## 🔍 PASSO 4: Verifique se está em Sandbox

Ainda no console SES:

**Se vir "Your account is in the Amazon SES sandbox":**
- Limite: ~200 e-mails por dia
- Todos os destinatários precisam ser verificados

**Solução:**
1. Abra a aba "Account dashboard"
2. Procure por "Request production access" (ou "Send quota")
3. Clique em "Request production access"
4. Preencha o formulário
5. Aguarde aprovação (geralmente 24h)

---

## 🔍 PASSO 5: Teste SES Diretamente

Se os logs dizem que foi enviado mas não chegou, teste sem o Stripe:

```powershell
npm run test:ses
# Escolha opção 1 (E-mail simples)
# Digite seu e-mail
```

**Se passar:**
- OS SES está funcionando ✅
- O problema pode ser na integração com Stripe/Webhook

**Se falhar:**
- Há um problema com SES
- Veja os logs detalhados

---

## 🔍 PASSO 6: Verifique Configuração de Webhook

Se o e-mail de teste funciona mas o webhook não envia:

### Local (desarrollo)

Você está rodando **Stripe CLI**?

```powershell
stripe listen --forward-to http://localhost:3001/api/webhook
```

Este comando gera um `STRIPE_WEBHOOK_SECRET` (começa com `whsec_`).

**Você copiou corretamente para `.env`?**

```env
STRIPE_WEBHOOK_SECRET=whsec_test_123...
```

⚠️ **Importante:** Este é DIFERENTE do secret de produção!

### Em Produção (EC2)

O webhook está configurado?

```powershell
# Dashboard Stripe
# Settings → Webhooks → Add endpoint
# URL: https://aparecidadonortesp.com.br/api/webhook
# Events: checkout.session.completed, invoice.payment_succeeded, etc
```

---

## 🔍 PASSO 7: Verifique Credenciais AWS

Se estiver rodando LOCAL e vir erro de credenciais:

```powershell
aws configure
# vai pedir:
# AWS Access Key ID: sk_...
# AWS Secret Access Key: ...
# Default region: us-east-2
# Default output format: json
```

**Não sabe suas credenciais?**

1. Acesse: https://console.aws.amazon.com/
2. Click no seu usuário (canto superior direito)
3. "Security credentials"
4. "Access keys"
5. "Create access key"

---

## 📧 Testes Específicos por Fase

### Fase 1: SES Básico

```powershell
npm run diagnose:ses
# Deve passar em TODOS os checks
```

### Fase 2: Envio Simples

```powershell
npm run test:ses
# Opção 1: Teste simples
# Você recebe o e-mail em 30 segundos?
```

### Fase 3: Webhook

```powershell
npm run test:payment "seu-business-id"
# Você recebe 2 e-mails (admin + cliente)?
```

### Fase 4: Pagamento Real

1. Servidor + Stripe CLI rodando
2. Faça checkout no frontend
3. Use cartão: 4242 4242 4242 4242
4. Recebe confirmação por e-mail?

---

## 📊 Checklist Completo

- [ ] Diagnóstico passou: `npm run diagnose:ses`
- [ ] Endereço verificado no SES (console AWS)
- [ ] .env tem EMAIL_FROM, ADMIN_EMAIL, AWS_REGION
- [ ] Teste simples funciona: `npm run test:ses`
- [ ] Simulação funciona: `npm run test:payment`
- [ ] Webhook configurado no dashboard Stripe
- [ ] STRIPE_WEBHOOK_SECRET no .env
- [ ] Backend rodando: `npm run dev`
- [ ] Stripe CLI ativo (se development)
- [ ] E-mail recebido após pagamento

---

## 💬 Ainda não conseguiu?

Cole aqui:

1. Output do `npm run diagnose:ses`
2. Os logs quando você faz checkout (na console do servidor)
3. O erro exato que aparece

E vamos resolver! 🔧
