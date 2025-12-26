# 🚀 GUIA PASSO A PASSO - DEPLOY BACKEND HOSTINGER

Este guia te ajuda a fazer o deploy do backend Node.js na Hostinger VPS.

## 📋 Informações do Servidor

- **IP**: 72.60.251.96
- **Usuário**: root
- **Porta Backend**: 3001
- **Caminho Backend**: /var/www/backend
- **Domínio**: aparecidadonortesp.com.br

---

## 🎯 OPÇÃO 1: Deploy Automatizado (Recomendado)

Execute o script PowerShell que faz tudo automaticamente:

```powershell
.\deploy-backend-hostinger.ps1
```

O script irá:
1. ✅ Compactar o código do backend
2. ✅ Fazer upload para o servidor
3. ✅ Instalar dependências
4. ✅ Configurar PM2
5. ✅ Configurar Nginx
6. ✅ Testar o backend

**IMPORTANTE**: Você precisará configurar o arquivo `.env` manualmente no servidor com suas credenciais.

---

## 🎯 OPÇÃO 2: Deploy Manual

### PASSO 1: Conectar no servidor

```bash
ssh root@72.60.251.96
```

### PASSO 2: Preparar o ambiente

```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verificar versões
node --version  # deve ser v20.x
npm --version   # deve ser 10.x

# Instalar PM2
npm install -g pm2

# Criar diretórios
mkdir -p /var/www/backend
mkdir -p /var/log/app
```

### PASSO 3: Upload do código

**Opção A - Via SCP (do seu computador local):**

```powershell
# No PowerShell (local)
# Primeiro compactar (excluindo node_modules)
cd c:\projetos\aparecida\server
tar -czf backend.tar.gz --exclude=node_modules --exclude=test*.js --exclude=criar-*.js --exclude=diagnostico-*.js .

# Enviar para o servidor
scp backend.tar.gz root@72.60.251.96:/var/www/backend/

# No servidor, extrair
ssh root@72.60.251.96
cd /var/www/backend
tar -xzf backend.tar.gz
rm backend.tar.gz
```

**Opção B - Via Git:**

```bash
# No servidor
cd /var/www/backend
git clone https://SEU_USUARIO:SEU_TOKEN@github.com/SEU_REPO/backend.git .
# Ou se já configurou SSH:
git clone git@github.com:SEU_USUARIO/SEU_REPO.git .
```

### PASSO 4: Configurar variáveis de ambiente

```bash
cd /var/www/backend
nano .env
```

Cole este conteúdo (substitua pelos valores reais):

```env
# ============================================
# SERVER
# ============================================
PORT=3001
NODE_ENV=production

# ============================================
# SUPABASE
# ============================================
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...sua-chave-service-role
SUPABASE_ANON_KEY=eyJhbGc...sua-chave-anon

# ============================================
# STRIPE
# ============================================
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# ============================================
# PUBLIC DOMAIN
# ============================================
PRODUCTION_DOMAIN=https://aparecidadonortesp.com.br
```

**Salvar**: `Ctrl + O`, `Enter`, `Ctrl + X`

### PASSO 5: Instalar dependências

```bash
cd /var/www/backend
npm install --production
```

### PASSO 6: Iniciar com PM2

```bash
cd /var/www/backend

# Iniciar aplicação
pm2 start index.js --name aparecida-backend --time

# Ver status
pm2 status

# Ver logs
pm2 logs aparecida-backend

# Salvar configuração do PM2
pm2 save

# Configurar para iniciar automaticamente no boot
pm2 startup
# Copie e execute o comando que aparecerá
```

### PASSO 7: Configurar Nginx

```bash
# Instalar Nginx se não estiver instalado
apt install -y nginx

# Criar arquivo de configuração
nano /etc/nginx/sites-available/aparecida.conf
```

Cole esta configuração:

```nginx
server {
    listen 80;
    server_name aparecidadonortesp.com.br www.aparecidadonortesp.com.br;

    # Frontend (Vite build)
    root /var/www/frontend/dist;
    index index.html;

    # SPA: sempre devolver index.html
    location / {
        try_files $uri /index.html;
    }

    # API (Node backend em 3001)
    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**Salvar**: `Ctrl + O`, `Enter`, `Ctrl + X`

```bash
# Ativar o site
ln -sf /etc/nginx/sites-available/aparecida.conf /etc/nginx/sites-enabled/

# Remover configuração padrão
rm -f /etc/nginx/sites-enabled/default

# Testar configuração
nginx -t

# Se o teste passar, recarregar Nginx
systemctl reload nginx

# Verificar status
systemctl status nginx
```

### PASSO 8: Testar o backend

```bash
# No servidor
curl http://localhost:3001/health
curl http://127.0.0.1/api/health
```

**Do seu computador:**

```powershell
# Testar pelo IP
Invoke-WebRequest -Uri "http://72.60.251.96/api/health" -UseBasicParsing

# Testar pelo domínio (se DNS já estiver configurado)
Invoke-WebRequest -Uri "http://aparecidadonortesp.com.br/api/health" -UseBasicParsing
```

---

## 🔍 Verificar Logs

```bash
# Logs do PM2
pm2 logs aparecida-backend

# Logs do Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Ver últimas 50 linhas
pm2 logs aparecida-backend --lines 50
```

---

## 🔄 Comandos Úteis do PM2

```bash
# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs aparecida-backend

# Reiniciar aplicação
pm2 restart aparecida-backend

# Parar aplicação
pm2 stop aparecida-backend

# Iniciar aplicação
pm2 start aparecida-backend

# Ver informações detalhadas
pm2 show aparecida-backend

# Monitorar recursos
pm2 monit
```

---

## 🔄 Atualizar o Backend (Deploy de Nova Versão)

```bash
# Conectar no servidor
ssh root@72.60.251.96

# Ir para o diretório
cd /var/www/backend

# Se usar Git
git pull origin main

# Se usar upload manual, primeiro envie o novo código
# scp backend.tar.gz root@72.60.251.96:/var/www/backend/
# tar -xzf backend.tar.gz
# rm backend.tar.gz

# Instalar novas dependências (se houver)
npm install --production

# Reiniciar aplicação
pm2 restart aparecida-backend

# Ver logs
pm2 logs aparecida-backend
```

---

## 🔐 Configurar SSL/HTTPS (Recomendado)

```bash
# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Obter certificado SSL gratuito
certbot --nginx -d aparecidadonortesp.com.br -d www.aparecidadonortesp.com.br

# Seguir as instruções interativas
# O Certbot irá automaticamente:
# - Obter o certificado
# - Configurar o Nginx para HTTPS
# - Configurar redirecionamento HTTP -> HTTPS

# Testar renovação automática
certbot renew --dry-run
```

---

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Ver logs detalhados
pm2 logs aparecida-backend --err

# Verificar arquivo .env
cat /var/www/backend/.env

# Tentar iniciar manualmente para ver erros
cd /var/www/backend
node index.js
```

### Nginx retorna 502 Bad Gateway

```bash
# Verificar se o backend está rodando
pm2 status
curl http://localhost:3001/health

# Ver logs do Nginx
tail -f /var/log/nginx/error.log

# Reiniciar serviços
pm2 restart aparecida-backend
systemctl restart nginx
```

### Portas em uso

```bash
# Ver o que está usando a porta 3001
lsof -i :3001
netstat -tuln | grep 3001

# Matar processo na porta 3001 (se necessário)
fuser -k 3001/tcp
```

### Webhook do Stripe não funciona

1. Verificar se o endpoint está acessível:
   ```bash
   curl -X POST https://aparecidadonortesp.com.br/api/webhook
   ```

2. Verificar logs:
   ```bash
   pm2 logs aparecida-backend | grep webhook
   ```

3. No Stripe Dashboard:
   - Ir em Developers > Webhooks
   - Adicionar endpoint: `https://aparecidadonortesp.com.br/api/webhook`
   - Selecionar eventos: 
     - `checkout.session.completed`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

---

## ✅ Checklist Final

- [ ] Node.js instalado (v20+)
- [ ] PM2 instalado e configurado
- [ ] Backend rodando em /var/www/backend
- [ ] Arquivo .env configurado com credenciais corretas
- [ ] PM2 rodando o backend (pm2 status)
- [ ] Nginx instalado e configurado
- [ ] Configuração do Nginx testada (nginx -t)
- [ ] API respondendo em http://IP/api/health
- [ ] API respondendo em http://dominio/api/health
- [ ] SSL configurado (opcional, mas recomendado)
- [ ] Webhook do Stripe configurado

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs: `pm2 logs aparecida-backend`
2. Verifique o Nginx: `tail -f /var/log/nginx/error.log`
3. Teste a conexão com o Supabase
4. Verifique as credenciais do Stripe
5. Certifique-se de que as portas estão abertas no firewall
