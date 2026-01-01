# 🧪 GUIA DE TESTES - MODO SANDBOX

## 📋 Configuração Atual

### ✅ Produção (.env)
- **Stripe:** Modo LIVE (pagamentos reais)
- **Webhook:** `https://aparecidadonortesp.com.br/api/webhook`
- **Secret:** `whsec_xbF9Xm7u6rkJ1VMhH3DCYlaIsM4hMhWF`

### 🧪 Teste (.env.test)
- **Stripe:** Modo TEST (sandbox)
- **Webhook:** `https://aparecidadonortesp.com.br/api/webhook`
- **Secret:** `whsec_RGLP7GQcub0kCsHHLmodg02G3gc8XSma`

---

## 🚀 Como Testar Novas Funcionalidades

### **1. Alternar para Modo de Teste**

```powershell
# Parar o servidor de produção
pm2 stop aparecida-backend

# Usar credenciais de teste
cd C:\projetos\aparecida\server
Copy-Item .env.test .env -Force

# Reiniciar servidor
pm2 restart aparecida-backend
```

---

### **2. Testar no Stripe Dashboard**

1. Acesse: https://dashboard.stripe.com/test/webhooks
2. Clique no webhook configurado
3. Vá em "Enviar evento de teste"
4. Escolha um evento (ex: `checkout.session.completed`)
5. Clique em "Enviar evento de teste"

---

### **3. Testar com Cartões de Teste**

Use estes cartões de teste do Stripe:

| Cenário | Número do Cartão | CVC | Data |
|---------|------------------|-----|------|
| ✅ Sucesso | `4242 4242 4242 4242` | Qualquer 3 dígitos | Qualquer data futura |
| ❌ Recusado | `4000 0000 0000 0002` | Qualquer 3 dígitos | Qualquer data futura |
| 🔒 Requer 3D Secure | `4000 0025 0000 3155` | Qualquer 3 dígitos | Qualquer data futura |

**Mais cartões:** https://stripe.com/docs/testing#cards

---

### **4. Verificar Logs**

```powershell
# Ver logs do servidor
pm2 logs aparecida-backend

# Ver apenas erros
pm2 logs aparecida-backend --err

# Ver logs em tempo real
pm2 logs aparecida-backend --lines 100
```

---

### **5. Testar Eventos de Webhook**

#### **A) Assinatura Completada**
```bash
# No Stripe Dashboard > Webhooks > Enviar evento de teste
# Selecionar: checkout.session.completed
```

#### **B) Assinatura Cancelada**
```bash
# Selecionar: customer.subscription.deleted
```

#### **C) Pagamento Bem-Sucedido**
```bash
# Selecionar: invoice.payment_succeeded
```

#### **D) Pagamento Falhado**
```bash
# Selecionar: invoice.payment_failed
```

---

### **6. Voltar para Produção**

```powershell
# Parar servidor
pm2 stop aparecida-backend

# Restaurar credenciais de produção
cd C:\projetos\aparecida\server

# ⚠️ CUIDADO: Certifique-se de que .env tem as credenciais LIVE
# Verificar arquivo .env antes de continuar!
notepad .env

# Reiniciar servidor
pm2 restart aparecida-backend

# Verificar se está em modo LIVE
pm2 logs aparecida-backend --lines 20
```

---

## 🔍 Verificações Importantes

### **Antes de Testar:**
```powershell
# Verificar qual ambiente está ativo
Select-String -Path "C:\projetos\aparecida\server\.env" -Pattern "STRIPE_SECRET_KEY"
```

- Se começar com `sk_test_` → Modo TESTE ✅
- Se começar com `sk_live_` → Modo PRODUÇÃO ⚠️

### **Após Testar:**
```powershell
# SEMPRE verificar se voltou para produção
Select-String -Path "C:\projetos\aparecida\server\.env" -Pattern "STRIPE_SECRET_KEY"
```

---

## ⚠️ IMPORTANTE - CHECKLIST

Antes de voltar para produção:

- [ ] Testar funcionalidade no modo TESTE
- [ ] Verificar logs sem erros
- [ ] Restaurar arquivo .env com credenciais LIVE
- [ ] Verificar que STRIPE_SECRET_KEY começa com `sk_live_`
- [ ] Reiniciar servidor com `pm2 restart`
- [ ] Verificar logs do servidor em produção
- [ ] Fazer um teste real com valor baixo (R$ 1,00)

---

## 📚 Recursos

- **Stripe Dashboard (Teste):** https://dashboard.stripe.com/test
- **Stripe Dashboard (Produção):** https://dashboard.stripe.com
- **Documentação Stripe:** https://stripe.com/docs
- **Cartões de Teste:** https://stripe.com/docs/testing#cards

---

## 🆘 Troubleshooting

### Webhook retorna erro 401/403
```powershell
# Verificar se STRIPE_WEBHOOK_SECRET está correto
Select-String -Path "C:\projetos\aparecida\server\.env" -Pattern "STRIPE_WEBHOOK_SECRET"
```

### Servidor não responde
```powershell
# Verificar status do PM2
pm2 status

# Reiniciar servidor
pm2 restart aparecida-backend

# Ver logs
pm2 logs aparecida-backend
```

### Email de teste não chega
- Verificar RESEND_API_KEY no .env
- Acessar: https://resend.com/emails
- Verificar logs do Resend

---

**Data:** 28/12/2025  
**Webhook de Teste Configurado:** ✅  
**Secret de Teste:** `whsec_RGLP7GQcub0kCsHHLmodg02G3gc8XSma`
