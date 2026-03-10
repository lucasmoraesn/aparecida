# 🚀 QUICK START — Testar AWS SES em 5 minutos

## 1️⃣ Diagnosticar Configuração (2 min)

```powershell
cd c:\projetos\aparecida\server
npm run diagnose:ses
```

**O que ele verifica:**
- ✅ Variáveis de ambiente (.env)
- ✅ Acesso ao AWS
- ✅ Endereços verificados
- ✅ Se está em Sandbox ou Produção

**Se passar em tudo** → vai pro passo 2

**Se falhar** → veja a seção *Erros Comuns* abaixo

---

## 2️⃣ Testar Envio de E-mails (2 min)

### Opção A: Teste Simples (mais rápido)

```powershell
npm run test:ses
# Escolha opção 1
# Digite seu e-mail
```

### Opção B: Simular Pagamento Completo

Primeiro, encontre um `business_id`:

```sql
-- Execute no Supabase
SELECT id, establishment_name FROM business_registrations LIMIT 1;
```

Depois:

```powershell
npm run test:payment "seu-business-id-aqui"
```

---

## ✅ Se Chegou até Aqui

Os e-mails devem estar chegando! Verifique a caixa de entrada (e spam).

---

## ❌ Erros Comuns

### "Cliente SES não criado"
→ Você está em desenvolvimento local? Precisa configurar AWS CLI:
```powershell
aws configure
# Adicione seu Access Key e Secret Key
```

### "Nenhum endereço verificado"
→ Acesse: https://us-east-2.console.aws.amazon.com/ses/
→ Clique em "Create identity"
→ Adicione: `noreply@aparecidadonortesp.com.br`
→ Confirme no seu e-mail

### "Sandbox Mode" (limit: 200/dia)
→ Request Production Access no console AWS

### "E-mail não chega"
→ Verifique spam
→ Espere 30 segundos
→ Verifique os logs: `npm run dev`

---

## 📚 Guia Completo

```powershell
# Ver guia detalhado
code TEST_GUIDE.md
```

---

## 💭 Próximo Passo: Testar com Pagamento Real

Quando os testes acima funcionarem:

1. Inicie servidor: `npm run dev`
2. Inicie Stripe CLI: `stripe listen --forward-to http://localhost:3001/api/webhook`
3. Vá ao frontend, faça um pagamento com cartão `4242 4242 4242 4242`
4. Verifique se recebeu o e-mail de confirmação

Pronto! 🎉
