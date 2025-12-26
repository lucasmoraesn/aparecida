# ✅ CHECKLIST - DEPLOY BACKEND HOSTINGER

## 🎯 Método Rápido (Recomendado)

Execute no PowerShell:
```powershell
.\deploy-backend-hostinger.ps1
```

**Depois do script rodar**, você precisará:

1. **Configurar .env no servidor**:
   ```bash
   ssh root@72.60.251.96 "nano /var/www/backend/.env"
   ```
   
   Cole suas credenciais:
   ```env
   PORT=3001
   NODE_ENV=production
   SUPABASE_URL=https://...
   SUPABASE_SERVICE_KEY=eyJ...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

2. **Reiniciar o backend**:
   ```bash
   ssh root@72.60.251.96 "pm2 restart aparecida-backend"
   ```

3. **Testar**:
   - http://72.60.251.96/api/health
   - http://aparecidadonortesp.com.br/api/health

---

## 📝 Checklist Manual

### Pré-requisitos
- [ ] Acesso SSH ao servidor (72.60.251.96)
- [ ] Credenciais do Supabase prontas
- [ ] Credenciais do Stripe prontas
- [ ] Código do backend atualizado

### No Servidor
- [ ] Node.js v20+ instalado
- [ ] PM2 instalado globalmente
- [ ] Diretório /var/www/backend criado
- [ ] Código do backend no servidor
- [ ] Dependências instaladas (npm install)
- [ ] Arquivo .env configurado
- [ ] Backend rodando via PM2
- [ ] PM2 configurado para auto-start
- [ ] Nginx instalado
- [ ] Nginx configurado para proxy /api/
- [ ] Nginx testado e recarregado

### Testes
- [ ] `curl http://localhost:3001/health` funciona
- [ ] `curl http://127.0.0.1/api/health` funciona via Nginx
- [ ] Backend acessível pelo IP externo
- [ ] Backend acessível pelo domínio
- [ ] Logs do PM2 sem erros críticos
- [ ] Logs do Nginx sem erros

### Pós-Deploy
- [ ] SSL configurado (Certbot)
- [ ] Webhook do Stripe configurado
- [ ] Testar criação de checkout session
- [ ] Testar webhook com evento real
- [ ] Monitoramento configurado

---

## 🚀 Comandos Rápidos

### Deploy automatizado:
```powershell
.\deploy-backend-hostinger.ps1
```

### Verificar status:
```bash
ssh root@72.60.251.96 "pm2 status"
```

### Ver logs:
```bash
ssh root@72.60.251.96 "pm2 logs aparecida-backend --lines 30"
```

### Reiniciar:
```bash
ssh root@72.60.251.96 "pm2 restart aparecida-backend"
```

### Testar:
```powershell
Invoke-WebRequest http://72.60.251.96/api/health
```

---

## ⚠️ Importante

1. **Nunca commite o arquivo .env no Git**
2. **Use credenciais de PRODUÇÃO do Stripe** (sk_live_...)
3. **Configure o webhook do Stripe** para apontar para seu domínio
4. **Mantenha o PM2 atualizado**: `npm update -g pm2`
5. **Configure SSL o mais rápido possível** (Certbot é grátis)

---

## 🆘 Problemas Comuns

### Backend não responde
```bash
ssh root@72.60.251.96
cd /var/www/backend
pm2 logs aparecida-backend
```

### Erro 502 Bad Gateway
```bash
# Verificar se backend está rodando
pm2 status
# Verificar porta
netstat -tuln | grep 3001
# Reiniciar
pm2 restart aparecida-backend
systemctl restart nginx
```

### Variáveis de ambiente não carregam
```bash
# Verificar se .env existe
cat /var/www/backend/.env
# Reiniciar PM2
pm2 restart aparecida-backend
```

---

## 📞 Próximos Passos

Após o backend estar funcionando:

1. ✅ Deploy do frontend
2. ✅ Configurar SSL (HTTPS)
3. ✅ Configurar webhooks do Stripe
4. ✅ Testar fluxo completo de pagamento
5. ✅ Configurar monitoramento (opcional)
6. ✅ Configurar backups (opcional)
