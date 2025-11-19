# ✅ CHECKLIST - CONFIGURAÇÃO PARA PRODUÇÃO

## 🔐 Credenciais Atualizadas

✅ **Backend (`server/.env`):**
- MERCADO_PAGO_ACCESS_TOKEN=APP_USR-4717777958316897-110714-dd8b529fb0a0e7d490850b417db76a5a-166610013
- MERCADO_PAGO_PUBLIC_KEY=APP_USR-4cb6b8eb-f91f-4b6b-8eb9-f83aaacb910b

✅ **O sistema agora usa automaticamente:**
- Domínio de produção: `www.mercadopago.com.br` (detecta pelo APP_USR-)
- Pagamentos reais serão processados
- CPF válido já configurado: 19119119100

---

## 🚀 PRÓXIMOS PASSOS

### 1️⃣ **Reiniciar o Servidor Backend**
```powershell
cd c:\projetos\aparecida\server
npm start
```

### 2️⃣ **Verificar Ngrok**
O ngrok já está rodando em: `https://0b3a54039e64.ngrok-free.app`
- ✅ Webhook configurado: `https://0b3a54039e64.ngrok-free.app/api/payment-webhook`

### 3️⃣ **Testar com Pagamento Real**

**IMPORTANTE:** Use valores baixos para teste (ex: R$ 0,50 ou R$ 1,00)

Para testar, crie uma assinatura:
```powershell
$sub = '{"planId":"8f0ec576-9c7d-46d2-b60e-e084ae3769e6","businessId":"1a53c789-f562-47a8-a46b-a9929e173f2e","customer":{"email":"seu-email@real.com","name":"Seu Nome","tax_id":"CPF_REAL"}}';
$r = Invoke-RestMethod -Uri "http://localhost:3001/api/create-subscription" -Method POST -Body $sub -ContentType "application/json";
Write-Output $r.init_point
```

**⚠️ ATENÇÃO:** 
- Não use mais cartões de teste
- Use cartão real válido
- O pagamento será cobrado de verdade
- Recomendado testar com valor mínimo primeiro

---

## 🔍 DIFERENÇAS: SANDBOX vs PRODUÇÃO

| Item | Sandbox (TEST-) | Produção (APP_USR-) |
|------|----------------|---------------------|
| Domínio | sandbox.mercadopago.com.br | www.mercadopago.com.br |
| Cartões | Cartões de teste | Cartões reais |
| Pagamentos | Fictícios | **Cobrados de verdade** |
| CPF | Pode ser fake | Deve ser válido |
| Webhook | Deve funcionar | Deve funcionar |

---

## 📋 VALIDAÇÕES ANTES DE PRODUÇÃO

✅ **Backend:**
- [ ] Servidor rodando sem erros
- [ ] Ngrok ativo e configurado
- [ ] Webhook respondendo (testar após primeiro pagamento)
- [ ] Supabase conectado

✅ **Planos configurados:**
- [ ] Básico: R$ 49,90
- [ ] Intermediário: R$ 99,90  
- [ ] Premium: R$ 199,90

✅ **Frontend:**
- [ ] Formulário de cadastro funcionando
- [ ] Redirecionamento para Mercado Pago OK
- [ ] Página de sucesso configurada

---

## 🎯 TESTE RECOMENDADO EM PRODUÇÃO

1. **Criar plano de teste barato** (R$ 0,50) no banco:
```sql
INSERT INTO business_plans (id, name, price, description, features, is_active)
VALUES (
  gen_random_uuid(),
  'Teste Produção',
  0.50,
  'Plano para teste de produção',
  ARRAY['Teste'],
  true
);
```

2. **Fazer primeira compra real** com esse plano
3. **Validar webhook** recebendo notificação
4. **Confirmar** dados salvos no Supabase (subscriptions, payments)
5. **Depois** ativar os planos reais

---

## ⚠️ SEGURANÇA

- ✅ Access Token está apenas no backend (correto!)
- ✅ Public Key não é exposta no frontend (correto!)
- ✅ CORS configurado para localhost e ngrok
- ⚠️ **Antes do deploy final:** atualizar CORS para domínio real

---

## 📞 SUPORTE

Se houver problemas:
1. Verificar logs do servidor backend
2. Verificar logs do ngrok
3. Testar webhook manualmente: https://0b3a54039e64.ngrok-free.app/api/payment-webhook
4. Consultar documentação: https://www.mercadopago.com.br/developers/

---

🎉 **SISTEMA PRONTO PARA PRODUÇÃO!**
