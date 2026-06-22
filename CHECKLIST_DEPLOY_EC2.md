# CHECKLIST RÁPIDO - DEPLOY EC2 APARECIDA

## ✅ PRÉ-REQUISITOS (ANTES DE COMEÇAR)
- [ ] EC2 Ubuntu 22.04 LTS rodando
- [ ] Chave SSH (.pem) com permissões 400
- [ ] Security Group com portas 22, 80, 443 abertas
- [ ] Supabase URL e Service Key prontos
- [ ] Stripe Secret Key e Webhook Secret prontos
- [ ] Resend API Key pronto
- [ ] Domínio apontando para IP da EC2 (ou Route 53 configurado)

---

## 🏠 FASE 1: SEU COMPUTADOR (LOCAL)

### Passo 1: Executar script de preparação
```powershell
cd C:\projetos\aparecida
.\deploy-prepare.ps1
```
**Resultado esperado:** Arquivo `aparecida-prod.zip` (~30-50MB)

### Passo 2: Editar credenciais
```powershell
# Editar com seus valores reais
notepad env.prod.reference
```
**Credenciais necessárias:**
- VITE_SUPABASE_URL
- SUPABASE_SERVICE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- AWS_ACCESS_KEY_ID (se usar SES)
- AWS_SECRET_ACCESS_KEY (se usar SES)

### Passo 3: Upload para EC2
```bash
# Opção 1: Via SCP (direto)
scp -i "C:\caminho\sua-chave.pem" aparecida-prod.zip ubuntu@seu-ip-ec2:/home/ubuntu/

# Opção 2: Via S3
aws s3 cp aparecida-prod.zip s3://seu-bucket/deploy/
# Depois na EC2:
aws s3 cp s3://seu-bucket/deploy/aparecida-prod.zip .
```

---

## 🌐 FASE 2: EC2 UBUNTU

### Passo 1: Conectar na EC2
```bash
ssh -i "C:\caminho\sua-chave.pem" ubuntu@seu-ip-ec2
```

### Passo 2: Descompactar e preparar
```bash
cd /home/ubuntu
unzip -q aparecida-prod.zip
rm aparecida-prod.zip

# Deve ter: dist, public, server, package.json, index.html
ls -la
```

### Passo 3: Upload arquivo de deploy automático
```bash
# ANTES DE TUDO: Faça upload do script de setup
# Do seu computador:
scp -i "chave.pem" deploy-ec2-setup.sh ubuntu@seu-ip-ec2:/home/ubuntu/

# Na EC2:
chmod +x /home/ubuntu/deploy-ec2-setup.sh
```

### Passo 4: Executar deploy automático
```bash
bash /home/ubuntu/deploy-ec2-setup.sh seu-dominio.com.br
```

**O script faz automaticamente:**
✅ Atualiza sistema Ubuntu
✅ Instala Node.js 18
✅ Instala PM2
✅ Instala Nginx
✅ Instala Certbot
✅ Instala dependências backend
✅ Configura .env template
✅ Configura PM2 e inicia backend
✅ Configura Nginx
✅ Gera certificado SSL Let's Encrypt
✅ Inicia Nginx

### Passo 5: Configurar credenciais (OBRIGATÓRIO)
```bash
nano /home/ubuntu/.env

# Editar:
# VITE_SUPABASE_URL=
# SUPABASE_SERVICE_KEY=
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=

# Salvar: CTRL+X, Y, ENTER
```

### Passo 6: Reiniciar backend com credenciais novas
```bash
pm2 restart aparecida-backend
```

---

## ✅ VALIDAÇÃO E TESTES

### Teste 1: Backend respondendo
```bash
curl http://localhost:3001
# Deve retornar JSON com "message": "..."
```

### Teste 2: Nginx funcionando
```bash
sudo systemctl status nginx
# Deve estar "active (running)"
```

### Teste 3: Frontend via browser
```
https://seu-dominio.com.br
# Deve carregar sem SSL warnings
```

### Teste 4: API via domínio
```bash
curl https://seu-dominio.com.br/api/health
# Deve retornar JSON
```

### Teste 5: Logs
```bash
# Ver logs do backend em tempo real
pm2 logs aparecida-backend --lines 50

# Ver logs do Nginx
sudo tail -50 /var/log/nginx/error.log
sudo tail -50 /var/log/nginx/access.log
```

---

## 🚨 TROUBLESHOOTING RÁPIDO

### ❌ "Backend não responde"
```bash
# Verificar status PM2
pm2 status
pm2 logs aparecida-backend --lines 100

# Reiniciar
pm2 restart aparecida-backend

# Se .env tem erro:
nano /home/ubuntu/.env
pm2 restart aparecida-backend
```

### ❌ "SSL certificate error"
```bash
# Verificar certificado
sudo openssl x509 -in /etc/letsencrypt/live/seu-dominio/cert.pem -noout -text

# Renovar manualmente
sudo certbot renew --force-renewal

# Recarregar nginx
sudo systemctl reload nginx
```

### ❌ "Frontend não carrega"
```bash
# Verificar arquivos
ls -la /home/ubuntu/dist

# Permissões
ls -ld /home/ubuntu/dist

# Testar nginx
sudo nginx -t
sudo systemctl restart nginx
```

### ❌ "Connection refused na porta 3001"
```bash
# Verificar se porta está em uso
netstat -tlnp | grep 3001

# Verificar .env
cat /home/ubuntu/.env | grep PORT

# Reiniciar PM2
pm2 restart all
```

---

## 📊 MONITORAMENTO CONTÍNUO

### Ver status em tempo real
```bash
pm2 monit
# Pressione Q para sair
```

### Ver logs em tempo real
```bash
pm2 logs aparecida-backend --lines 50
# Pressione CTRL+C para sair
```

### Comandos úteis
```bash
pm2 status              # Status de todos processos
pm2 restart all         # Reiniciar tudo
pm2 stop all            # Parar tudo
pm2 start all           # Iniciar tudo
pm2 delete aparecida-backend  # Remover app
pm2 save                # Salvar config
pm2 resurrect           # Restaurar última config
```

---

## 🔐 SEGURANÇA PÓS-DEPLOY

- [ ] .env contém apenas credenciais, sem ser versionado
- [ ] Nginx redirecionando HTTP → HTTPS
- [ ] SSL certificate válido (não auto-assinado)
- [ ] Security headers configurados (X-Frame-Options, etc)
- [ ] PM2 rodando com usuário `ubuntu` (não root)
- [ ] Backups configurados (opcional)
- [ ] Monitoramento ativo (CloudWatch, opcional)

---

## 📈 PÓS-DEPLOY

### Verificar status
```bash
# Acessar a aplicação
curl -I https://seu-dominio.com.br

# Deve retornar: HTTP/2 200
```

### Configurar renovação SSL
```bash
# Já configurada automaticamente, mas validar:
sudo certbot renew --dry-run

# Verificar data de expiração
sudo openssl x509 -in /etc/letsencrypt/live/seu-dominio/cert.pem -noout -enddate
```

### (Opcional) Configurar CloudWatch Logs
```bash
# Instalar CloudWatch agent
# Documentação: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/
```

---

## 📞 SUPORTE RÁPIDO

Se algo não funciona:

1. **Checar logs**: `pm2 logs aparecida-backend --lines 200`
2. **Reiniciar tudo**: `pm2 restart all`
3. **Validar .env**: `cat /home/ubuntu/.env`
4. **Testar conexão backend**: `curl http://localhost:3001`
5. **Validar nginx**: `sudo nginx -t`
6. **Checar certificado**: `sudo certbot certificates`

---

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

1. Configure CloudWatch alarms para monitorar a EC2
2. Configure auto-scaling se necessário
3. Configure RDS backup (opcional, já tem Supabase)
4. Configure S3 para armazenar imagens
5. Implemente CI/CD pipeline (GitHub Actions, etc)
6. Configure DNS failover (Route 53)
7. Implemente log aggregation centralizado

---

**Última atualização:** 2026-05-08
**Versão:** 1.0
