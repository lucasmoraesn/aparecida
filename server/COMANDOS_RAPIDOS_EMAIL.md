# ⚡ Comandos Rápidos - Notificações por E-mail

## 🧪 Testar E-mails

### Teste Simples (Validar Configuração)
```powershell
cd server
npm run test:email
```
ou
```powershell
cd server
node test-email.js
```

### Teste de Notificação (Simular Assinatura)
```powershell
cd server
npm run test:email:notification
```
ou
```powershell
cd server
node test-email.js notification
```

### Teste Completo (Todos os Tipos)
```powershell
cd server
npm run test:email:all
```
ou
```powershell
cd server
node test-email.js all
```

---

## 📝 Alterar E-mail de Destino

### Editar Arquivo
```powershell
code server\.env
```

### Alterar Linha
```env
ADMIN_EMAIL=seu-novo-email@dominio.com
```

### Salvar e Testar
```powershell
cd server
npm run test:email
```

---

## 🔍 Ver Logs do Servidor

### Modo Desenvolvimento
```powershell
cd server
npm run dev
```

### Ver Webhooks em Tempo Real
Os logs aparecerão automaticamente quando:
- Webhook recebido
- Assinatura ativada
- E-mail enviado

Exemplo:
```
🔔 WEBHOOK RECEBIDO!
✅ Assinatura ativada
📧 Preparando envio de e-mail...
✅ E-mail enviado com sucesso!
   Email ID: abc123...
```

---

## 📧 Acessar Dashboard do Resend

### Ver E-mails Enviados
```
https://resend.com/emails
```

### Gerenciar API Keys
```
https://resend.com/api-keys
```

### Adicionar Domínio
```
https://resend.com/domains
```

---

## 🐛 Problemas Comuns

### E-mail não chega?

1. **Verificar variáveis:**
```powershell
cd server
Get-Content .env | Select-String "EMAIL"
```

2. **Testar novamente:**
```powershell
npm run test:email
```

3. **Ver logs detalhados:**
```powershell
npm run dev
# Fazer uma compra de teste
```

### Erro "API key not found"?

```powershell
# Verificar se existe
cd server
Get-Content .env | Select-String "RESEND"

# Deve mostrar:
# RESEND_API_KEY=re_...
```

Se não mostrar, adicione:
```env
RESEND_API_KEY=re_sua_chave_aqui
```

---

## 🔧 Comandos de Manutenção

### Reinstalar Dependências
```powershell
cd server
npm install
```

### Atualizar Resend
```powershell
cd server
npm update resend
```

### Ver Versão do Resend
```powershell
cd server
npm list resend
```

---

## 📚 Arquivos Importantes

### Serviço de E-mail
```powershell
code server\services\emailService.js
```

### Script de Teste
```powershell
code server\test-email.js
```

### Webhook
```powershell
code server\index.js
```

### Variáveis de Ambiente
```powershell
code server\.env
```

### Documentação
```powershell
code server\EMAIL_NOTIFICATIONS_GUIDE.md
code server\RESUMO_NOTIFICACOES.md
code server\EXEMPLOS_EMAIL_VISUAL.md
```

---

## 🚀 Deploy em Produção

### Antes de Fazer Deploy

1. **Verificar variáveis:**
```powershell
cd server
cat .env
```

2. **Testar localmente:**
```powershell
npm run test:email:all
```

3. **Garantir que está funcionando:**
- [ ] E-mails chegam na caixa de entrada
- [ ] Template aparece corretamente
- [ ] Informações estão corretas

### Depois do Deploy

1. **Fazer compra de teste:**
- Use cartão de teste do Stripe
- Finalize o checkout
- Aguarde o webhook

2. **Verificar recebimento:**
- Cheque seu e-mail
- Veja dashboard do Resend
- Confira logs do servidor

---

## 📊 Monitoramento

### Dashboard do Resend
```
https://resend.com/emails
```

Mostra:
- ✅ E-mails enviados
- ✅ Taxa de entrega
- ✅ Aberturas
- ✅ Erros/bounces

### Logs do Servidor
```powershell
# Servidor em produção (exemplo)
ssh usuario@seu-servidor
cd /caminho/projeto/server
tail -f logs/server.log
```

---

## 🎯 One-Liners Úteis

### Teste rápido
```powershell
cd server; npm run test:email
```

### Ver configuração
```powershell
cd server; Get-Content .env | Select-String "EMAIL|RESEND"
```

### Reiniciar servidor
```powershell
cd server; npm run dev
```

### Ver últimos logs
```powershell
# PowerShell
Get-Content server\logs\*.log -Tail 50
```

---

## 📞 Contatos de Suporte

### Resend
- **Email:** support@resend.com
- **Docs:** https://resend.com/docs
- **Status:** https://status.resend.com

### Stripe
- **Dashboard:** https://dashboard.stripe.com
- **Webhooks:** https://dashboard.stripe.com/webhooks
- **Logs:** https://dashboard.stripe.com/logs

---

## ✅ Checklist Diário

### Manhã
- [ ] Verificar e-mails de novas assinaturas
- [ ] Checar dashboard do Resend
- [ ] Ver logs do servidor

### Semana
- [ ] Revisar taxa de entrega
- [ ] Verificar bounces
- [ ] Conferir assinaturas novas

### Mês
- [ ] Analisar total de assinaturas
- [ ] Revisar template do e-mail
- [ ] Atualizar informações se necessário

---

**Criado:** 26/12/2025
**Status:** ✅ Ativo e Funcional
**Última atualização:** 26/12/2025
