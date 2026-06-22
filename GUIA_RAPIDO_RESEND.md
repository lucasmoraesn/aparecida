# 🚀 Guia Rápido: Usando Resend

## 1️⃣ Configuração (5 minutos)

### Passo 1: Criar conta Resend
```bash
# Ir para https://resend.com
# Criar conta com seu email
# Confirmar email
```

### Passo 2: Obter API Key
```bash
# Dashboard → API Keys
# Copiar chave (ex: re_xxx...)
```

### Passo 3: Configurar .env
```bash
# server/.env
RESEND_API_KEY=re_seu_api_key_aqui
RESEND_FROM=Explore Aparecida <noreply@aparecidadonortesp.com.br>
ADMIN_EMAIL=seu-email@aparecida.com.br
```

## 2️⃣ Testar (2 minutos)

### Teste Simples
```bash
cd server
node test-email.js seu@email.com
```

**Resultado esperado:**
```
✅ E-mail enviado com sucesso!
   MessageId: 01234567-89ab-cdef-0123-456789abcdef
```

### Teste Interativo
```bash
node test-ses-complete.js

# Menu aparecerá:
# 1️⃣  E-mail de teste simples
# 2️⃣  Notificação de nova assinatura (admin)
# 3️⃣  Confirmação de assinatura (cliente)
# 4️⃣  E-mail customizado
```

## 3️⃣ Usar no Código

### Importar Funções
```javascript
import { 
  sendEmail,
  sendPaymentConfirmation,
  sendNewSubscriptionNotification,
  sendMotoristaAnaliseEmail
} from './services/emailService.js';
```

### Enviar E-mail Genérico
```javascript
await sendEmail({
  to: 'customer@example.com',
  subject: 'Bem-vindo!',
  html: '<h1>Olá!</h1><p>Bem-vindo ao Explore Aparecida</p>',
  text: 'Bem-vindo ao Explore Aparecida'
});
```

### Notificar Admin sobre Nova Assinatura
```javascript
await sendNewSubscriptionNotification({
  businessName: 'Pousada do Vale',
  businessEmail: 'contact@pousadadovale.com.br',
  planName: 'Premium',
  planPrice: 29900,  // em centavos
  subscriptionId: 'sub_1234567890'
});
```

### Aprovar/Rejeitar Motorista
```javascript
await sendMotoristaAnaliseEmail({
  motoristaEmail: 'driver@example.com',
  motoristaName: 'João Silva',
  status: 'aprovado',  // ou 'rejeitado'
  motivo: undefined    // opcional, se rejeitado
});
```

## 4️⃣ Monitorar

### Dashboard Resend
```
https://resend.com/dashboard
```

Você verá:
- ✅ Emails enviados com sucesso
- ❌ Emails falhados
- 📊 Estatísticas de entrega
- 📧 Detalhes de cada email

### Logs no Backend
```bash
# Ver logs (se usando pm2)
pm2 logs aparecida-backend

# Ou ver arquivo de log
tail -f server/logs/app.log
```

## 5️⃣ Troubleshooting

### ❌ "RESEND_API_KEY não configurado"
```bash
# Verificar .env
cat server/.env | grep RESEND

# Se vazio, adicionar:
echo 'RESEND_API_KEY=re_seu_api_key_aqui' >> server/.env
```

### ❌ "E-mail rejeitado"
**Causas comuns:**
- ❌ RESEND_FROM não verificado no Resend
- ❌ Domínio não verificado (para volumes maiores)
- ❌ Email destinatário inválido

**Solução:**
```bash
# 1. Verificar domínio em https://resend.com/domains
# 2. Usar email verificado em RESEND_FROM
# 3. Validar email destinatário
```

### ❌ "rate limit"
```
# Plano grátis: 100 emails/dia
# Se precisar mais, fazer upgrade em https://resend.com/pricing
```

## 6️⃣ Estrutura de E-mails

### Confirmação de Pagamento
```javascript
await sendPaymentConfirmation({
  customerEmail: 'customer@example.com',
  customerName: 'João Silva',
  planName: 'Plano Premium',
  amount: 29900,        // centavos
  invoiceId: 'inv_123',
  nextCharge: '2026-06-20'
});
```

### Cancelamento de Assinatura
```javascript
await sendSubscriptionCanceled({
  customerEmail: 'customer@example.com',
  customerName: 'João Silva',
  planName: 'Plano Premium',
  canceledAt: new Date().toISOString()
});
```

### Newsletter Bem-vindo
```javascript
await sendNewsletterWelcomeEmail({
  email: 'subscriber@example.com'
});
```

## 📚 Documentação Completa

- **Funções disponíveis:** server/services/resendEmailService.js (linhas 1-50)
- **Exemplos de uso:** server/test-ses-complete.js
- **Oficial Resend:** https://resend.com/docs

## 🎯 Dicas Importantes

✅ **DO:**
- Sempre teste em desenvolvimento primeiro
- Use templates HTML profissionais
- Monitore entrega no dashboard
- Mantenha RESEND_API_KEY seguro
- Use Cc/Bcc apenas quando necessário

❌ **DON'T:**
- ❌ Não coloque RESEND_API_KEY em código
- ❌ Não commit .env em git
- ❌ Não envie para listas de spam
- ❌ Não use emails de teste em produção

## 🔐 Segurança

```javascript
// ✅ CORRETO
const apiKey = process.env.RESEND_API_KEY;

// ❌ ERRADO
const apiKey = 're_abc123xyz...'; // NUNCA em código!
```

## ✅ Checklist de Deployment

- [ ] RESEND_API_KEY está em EC2
- [ ] RESEND_FROM está verificado no Resend
- [ ] ADMIN_EMAIL está correto
- [ ] Teste simples funcionou
- [ ] Monitorar logs após deploy
- [ ] Validar email em dashboard Resend

---

**Pronto para usar!** 🚀
