# 📧 Guia de Notificações por E-mail

## ✅ Implementação Concluída

Sistema de notificações por e-mail usando **Resend** integrado ao webhook do Stripe.

---

## 📋 O Que Foi Implementado

### 1. **Serviço de E-mail** (`server/services/emailService.js`)
- ✅ Função para enviar notificações de novas assinaturas
- ✅ Template HTML profissional e responsivo
- ✅ Versão texto alternativa
- ✅ Função de teste de e-mail
- ✅ Tratamento de erros robusto

### 2. **Integração no Webhook** (`server/index.js`)
- ✅ Importação do serviço de e-mail
- ✅ Disparo automático no evento `checkout.session.completed`
- ✅ Busca de dados do estabelecimento e plano
- ✅ Envio não-bloqueante (não quebra webhook se falhar)

### 3. **Script de Teste** (`server/test-email.js`)
- ✅ Validação de configurações
- ✅ Teste simples de e-mail
- ✅ Teste de notificação completa
- ✅ Interface colorida no terminal

### 4. **Documentação** (`server/env.example`)
- ✅ Variáveis de ambiente documentadas
- ✅ Instruções de configuração

---

## 🚀 Como Usar

### **1. Configurar Variáveis de Ambiente**

Edite seu arquivo `server/.env` e adicione:

```env
# Resend (obter em: https://resend.com/api-keys)
RESEND_API_KEY=re_sua_chave_aqui

# E-mail remetente (use onboarding@resend.dev para testes)
FROM_EMAIL=Explore Aparecida <onboarding@resend.dev>

# E-mail que receberá as notificações
ADMIN_EMAIL=aparecidatoursp@hotmail.com
```

### **2. Testar Envio de E-mails**

```powershell
# Teste simples
cd server
node test-email.js

# Teste de notificação de assinatura
node test-email.js notification

# Testar todos os tipos
node test-email.js all
```

### **3. Verificar se Funciona**

1. Execute o teste: `node test-email.js`
2. Verifique sua caixa de entrada (e spam!)
3. Se receber o e-mail: ✅ **Tudo configurado!**

---

## 📨 Quando os E-mails São Enviados

Os e-mails de notificação são enviados **automaticamente** quando:

- ✅ Um cliente finaliza o checkout do Stripe
- ✅ O pagamento é confirmado
- ✅ A assinatura é ativada no banco de dados

**Evento:** `checkout.session.completed` (Webhook do Stripe)

---

## 🎨 O Que o E-mail Contém

### Para o Administrador:
- 📌 Nome do estabelecimento
- 📧 E-mail do estabelecimento
- 📧 E-mail do cliente (se disponível)
- 💳 Plano contratado
- 💰 Valor mensal
- 🔑 ID da assinatura
- 📅 Data e hora
- 🔗 Link para painel admin (se configurado)

---

## ⚙️ Configurações Avançadas

### **Usar Domínio Personalizado no Resend**

1. Acesse: https://resend.com/domains
2. Adicione seu domínio
3. Configure os registros DNS
4. Aguarde verificação
5. Atualize `FROM_EMAIL` no `.env`:
   ```env
   FROM_EMAIL=Notificações <notificacoes@aparecidadonortesp.com.br>
   ```

### **Múltiplos Destinatários**

Edite `server/services/emailService.js`:

```javascript
to: [
  process.env.ADMIN_EMAIL,
  'vendas@empresa.com',
  'financeiro@empresa.com'
]
```

### **Customizar Template**

O template HTML está em `sendNewSubscriptionNotification()`.
Você pode modificar:
- Cores (gradiente, textos)
- Logo da empresa
- Estrutura do e-mail
- Informações exibidas

---

## 🔍 Troubleshooting

### **E-mail não chega**

1. ✅ Verifique spam/lixeira
2. ✅ Confirme `RESEND_API_KEY` está correta
3. ✅ Verifique `ADMIN_EMAIL` está correto
4. ✅ Execute: `node test-email.js`
5. ✅ Veja logs do servidor durante webhook

### **Erro: "API key not found"**

```env
# Certifique-se de ter a chave no .env
RESEND_API_KEY=re_sua_chave_aqui
```

### **E-mail vai para spam**

- Use domínio verificado no Resend
- Configure SPF, DKIM e DMARC
- Evite palavras spam no assunto
- Use remetente profissional

### **Ver logs de envio**

Os logs aparecem no terminal do servidor:
```
📧 Preparando envio de e-mail de notificação...
✅ E-mail enviado com sucesso!
   Email ID: abc123...
   Para: seu-email@dominio.com
```

---

## 📊 Monitoramento

### **Painel do Resend**

Acesse: https://resend.com/emails

Você pode ver:
- ✅ E-mails enviados
- ✅ Status de entrega
- ✅ Aberturas (se habilitado)
- ✅ Cliques
- ✅ Bounces e reclamações

### **Logs do Servidor**

Todos os envios são logados:
```javascript
console.log('✅ E-mail enviado com sucesso!');
console.log('   Email ID:', result.emailId);
```

---

## 🎯 Melhores Práticas

### ✅ **E-mail de Destino**
- Use e-mail profissional/corporativo
- Configure múltiplos destinatários se necessário
- Mantenha separado do e-mail de suporte

### ✅ **Segurança**
- Nunca commite `.env` no Git
- Use variáveis de ambiente
- Rotacione API keys periodicamente

### ✅ **Confiabilidade**
- O webhook não falha se e-mail falhar
- Erros são logados mas não param o processo
- E-mails têm retry automático do Resend

### ✅ **Personalização**
- Adapte o template à sua marca
- Use domínio verificado em produção
- Adicione logo da empresa

---

## 🔗 Links Úteis

- **Resend Dashboard:** https://resend.com/
- **Documentação Resend:** https://resend.com/docs
- **Verificar Domínio:** https://resend.com/domains
- **API Keys:** https://resend.com/api-keys
- **Logs de E-mail:** https://resend.com/emails

---

## 📝 Próximos Passos (Opcional)

### **Adicionar Mais Notificações**

1. **Cancelamento de assinatura**
2. **Falha de pagamento**
3. **Renovação bem-sucedida**
4. **Boas-vindas ao cliente**

### **Template de Boas-vindas**

Enviar e-mail para o cliente após assinatura:
```javascript
// No webhook, após ativar assinatura
await sendWelcomeEmail({
  customerEmail: business.email,
  businessName: business.name,
  planName: plan.name
});
```

---

## ✅ Checklist de Verificação

Antes de ir para produção:

- [ ] Testei envio com `node test-email.js`
- [ ] Recebi e-mail de teste com sucesso
- [ ] Variáveis de ambiente configuradas
- [ ] `ADMIN_EMAIL` está correto
- [ ] Simulei uma compra de teste
- [ ] Recebi notificação da compra
- [ ] E-mails não vão para spam
- [ ] (Opcional) Domínio verificado no Resend
- [ ] Logs do servidor mostram envios

---

**🎉 Implementação concluída! Sistema pronto para uso em produção.**
