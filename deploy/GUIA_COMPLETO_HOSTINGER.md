# 🚀 DEPLOYMENT COMPLETO - APARECIDA DO NORTE SP
## Passo a Passo Detalhado (Hostinger VPS)

---

## ⚠️ PRÉ-REQUISITOS

- ✅ VPS Hostinger acionada
- ✅ SSH conectado (`ssh root@72.60.251.96`)
- ✅ Domínio apontando (ou vai apontar em breve)
- ✅ Repositórios no GitHub/GitLab
- ✅ Credenciais do Supabase e Stripe prontas

---

## 📋 TABELA DE REFERÊNCIA

| Item | Valor |
|------|-------|
| **IP VPS** | 72.60.251.96 |
| **Domínio** | aparecidadonortesp.com.br |
| **Backend Port** | 3001 |
| **Backend Start** | `npm start` (node index.js) |
| **Frontend Build** | `npm run build` |
| **API Path** | `/api/` |
| **Frontend Folder** | `/var/www/frontend` |
| **Backend Folder** | `/var/www/backend` |

---

# 🎯 PASSO 1: Conectar na VPS

```bash
ssh root@72.60.251.96
# Cole a senha quando pedir
```

Você verá um terminal Linux. Agora vamos começar!

---

# 🎯 PASSO 2: Atualizar o Sistema

```bash
apt update && apt upgrade -y
apt install -y curl git wget npm nodejs
```

Verificar versões:
```bash
node --version    # v20.x ou superior
npm --version     # 10.x ou superior
```

---

# 🎯 PASSO 3: Instalar PM2 (Gerenciador de Processos)

```bash
npm install -g pm2

# Configurar para auto-iniciar na rebootagem
pm2 startup
pm2 save
```

---

# 🎯 PASSO 4: Criar as Pastas

```bash
mkdir -p /var/www/backend
mkdir -p /var/www/frontend
mkdir -p /var/log/app

cd /var/www/backend
pwd  # verificar: /var/www/backend
```

---

# 🎯 PASSO 5: Deploy do Backend (Node.js)

## 5.1 Clonar o Repositório

```bash
cd /var/www/backend

# Opção A: Git (recomendado)
git clone https://github.com/SEU_USUARIO/SEU_REPO_BACKEND.git .

# Ou Opção B: Se tiver token
git clone https://SEU_TOKEN@github.com/SEU_USUARIO/SEU_REPO.git .
```

## 5.2 Instalar Dependências

```bash
cd /var/www/backend
npm install
```

## 5.3 Criar Arquivo .env

```bash
nano /var/www/backend/.env
```

**Cole isso (adaptando com seus dados):**

```env
PORT=3001
NODE_ENV=production

# Supabase
SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxx

# Frontend URL (para CORS)
FRONTEND_URL=https://aparecidadonortesp.com.br
```

**Salvar:** `CTRL+O`, `Enter`, `CTRL+X`

## 5.4 Verificar Arquivo de Config

```bash
# Verificar que o backend está configurado para escutar em 0.0.0.0
cat /var/www/backend/index.js | grep -A2 "app.listen"
```

**Seu arquivo já está correto! Mas se precisar ajustar:**

```javascript
// Seu arquivo atual está assim (CORRETO):
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`🚀 Server on http://localhost:${port}`);
  console.log("✅ Server is ready and listening for requests");
});

// Se não funcionar, altere para:
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server on http://0.0.0.0:${port}`);
  console.log("✅ Server is ready and listening for requests");
});
```

## 5.5 Testar Backend Localmente

```bash
cd /var/www/backend
npm start
```

Se vir isso, está funcionando:
```
🚀 Server on http://localhost:3001
✅ Server is ready and listening for requests
```

**Para (CTRL+C):**
```
^C
```

## 5.6 Iniciar Backend em Produção com PM2

```bash
cd /var/www/backend

# Opção A: Iniciar direto
pm2 start npm --name "aparecida-backend" -- start

# Opção B: Mais direto (recomendado)
pm2 start index.js --name "aparecida-backend" --env NODE_ENV=production

# Salvar configuração
pm2 save

# Ver status
pm2 list
pm2 logs aparecida-backend
```

**Resultado esperado:**
```
┌─────────────────────────────┬──────┬──────┬──────────┬────────┐
│ Name                        │ id   │ mode │ status   │ uptime │
├─────────────────────────────┼──────┼──────┼──────────┼────────┤
│ aparecida-backend           │ 0    │ fork │ online   │ 2s     │
└─────────────────────────────┴──────┴──────┴──────────┴────────┘
```

✅ **Backend rodando!**

---

# 🎯 PASSO 6: Deploy do Frontend (React + Vite)

## 6.1 Clonar o Repositório

```bash
cd /var/www/frontend

# Git
git clone https://github.com/SEU_USUARIO/SEU_REPO_FRONTEND.git .

# Ou com token
git clone https://SEU_TOKEN@github.com/SEU_USUARIO/SEU_REPO.git .
```

## 6.2 Instalar Dependências

```bash
cd /var/www/frontend
npm install
```

## 6.3 Build do Projeto

```bash
npm run build
```

**Resultado esperado:**
```
✓ 1234 modules transformed
✓ built in 45.23s

dist/index.html                  0.45 kB │ gzip:  0.30 kB
dist/assets/main.xxxxxx.js       345.67 kB │ gzip: 98.45 kB
dist/assets/style.xxxxxx.css     12.34 kB │ gzip:  2.15 kB
```

## 6.4 Verificar Build

```bash
ls -la /var/www/frontend/dist/
```

Deve ter:
```
index.html
assets/
```

✅ **Frontend pronto!**

---

# 🎯 PASSO 7: Instalar e Configurar Nginx

## 7.1 Instalar Nginx

```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

## 7.2 Criar Arquivo de Configuração

```bash
nano /etc/nginx/sites-available/aparecidadonortesp.com.br
```

**Cole exatamente isso:**

```nginx
server {
    listen 80;
    server_name aparecidadonortesp.com.br www.aparecidadonortesp.com.br;

    # Frontend (Vite build)
    root /var/www/frontend/dist;
    index index.html;

    # SPA React: sempre devolver index.html para rotas
    location / {
        try_files $uri /index.html;
    }

    # API (Node backend em 3001)
    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        
        # Headers importantes
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
    }

    # Webhook do Stripe (sem timeout)
    location /api/webhook {
        proxy_pass http://127.0.0.1:3001/api/webhook;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size 10M;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Assets com cache longo
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Salvar:** `CTRL+O`, `Enter`, `CTRL+X`

## 7.3 Ativar o Site

```bash
# Criar link simbólico
ln -s /etc/nginx/sites-available/aparecidadonortesp.com.br /etc/nginx/sites-enabled/

# Remover site padrão
rm -f /etc/nginx/sites-enabled/default

# Testar configuração
nginx -t
```

**Deve retornar:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration will be successful
```

## 7.4 Reiniciar Nginx

```bash
systemctl restart nginx
systemctl status nginx
```

**Ver logs se algo der errado:**
```bash
tail -f /var/log/nginx/error.log
```

✅ **Nginx configurado!**

---

# 🎯 PASSO 8: Testar Tudo Junto

## 8.1 Backend está rodando?

```bash
curl http://127.0.0.1:3001
```

## 8.2 Nginx está servindo Frontend?

```bash
curl http://localhost/
# Deve retornar o HTML do index.html
```

## 8.3 API está acessível?

```bash
curl http://localhost/api/
# Deve retornar a resposta do backend
```

## 8.4 Apontar DNS na Hostinger

1. Painel Hostinger → DNS
2. Criar registros A:
   - **aparecidadonortesp.com.br** → 72.60.251.96
   - **www.aparecidadonortesp.com.br** → 72.60.251.96

3. **Esperar 5-30 minutos para propagar**

## 8.5 Testar pelo Domínio

```bash
# Aguarde DNS propagar
nslookup aparecidadonortesp.com.br

# Depois acesse
curl http://aparecidadonortesp.com.br
```

✅ **Tudo funcionando no HTTP!**

---

# 🎯 PASSO 9: HTTPS com Let's Encrypt (SSL Grátis)

## 9.1 Instalar Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

## 9.2 Gerar Certificado SSL

```bash
certbot --nginx -d aparecidadonortesp.com.br -d www.aparecidadonortesp.com.br
```

**Responder as perguntas:**
```
Enter email address: seu-email@example.com
Agree to terms? (Y/n) Y
Share email? (Y/n) N
Redirect HTTP to HTTPS? (1 = No, 2 = Yes): 2
```

## 9.3 Verificar SSL

```bash
# Testar configuração
nginx -t

# Reiniciar
systemctl restart nginx

# Ver certificado
certbot certificates
```

## 9.4 Configurar Renovação Automática

```bash
systemctl enable certbot.timer
systemctl start certbot.timer

# Testar renovação (sem renovar de verdade)
certbot renew --dry-run
```

✅ **HTTPS ativado!**

---

# ✅ VERIFICAÇÃO FINAL

## Checklist de Funcionamento

```bash
# 1. Backend rodando?
pm2 list

# 2. Nginx rodando?
systemctl status nginx

# 3. Certificado válido?
certbot certificates

# 4. Logs sem erros?
pm2 logs aparecida-backend
tail -f /var/log/nginx/error.log
```

## Acessar o Site

```
http://aparecidadonortesp.com.br   → redireciona para HTTPS
https://aparecidadonortesp.com.br  ✅ FUNCIONA!
```

---

# 📊 COMANDOS ÚTEIS

```bash
# Backend
pm2 list                              # Ver processos
pm2 logs aparecida-backend            # Ver logs
pm2 restart aparecida-backend         # Reiniciar
pm2 stop aparecida-backend            # Parar
pm2 delete aparecida-backend          # Remover

# Nginx
systemctl status nginx                # Ver status
systemctl restart nginx               # Reiniciar
nginx -t                              # Testar config
tail -f /var/log/nginx/error.log      # Ver erros
tail -f /var/log/nginx/access.log     # Ver acessos

# SSL
certbot certificates                  # Ver certificados
certbot renew                         # Renovar manualmente
certbot revoke --cert-path [path]    # Revogar certificado

# Sistema
ps aux | grep node                    # Ver processos Node
lsof -i :3001                         # Ver quem usa porta 3001
df -h                                 # Espaço em disco
free -h                               # Memória disponível
```

---

# 🆘 TROUBLESHOOTING

## Erro 502 Bad Gateway

```bash
# 1. Backend está rodando?
pm2 list
pm2 logs aparecida-backend

# 2. Reiniciar tudo
pm2 restart aparecida-backend
systemctl restart nginx

# 3. Ver erro específico
curl http://127.0.0.1:3001/api/
```

## DNS não propaga

```bash
# 1. Verificar propagação
nslookup aparecidadonortesp.com.br
dig aparecidadonortesp.com.br

# 2. Forçar propagação
# Aguarde 5-30 minutos na Hostinger
```

## Certificado SSL falha

```bash
# 1. Se DNS ainda não propagou
# Aguarde DNS se propagar completamente primeiro

# 2. Tentar novamente
certbot renew --force-renewal

# 3. Se continuar, verificar Nginx
nginx -t
systemctl restart nginx
```

## Backend não inicia

```bash
# 1. Ver erro específico
pm2 logs aparecida-backend

# 2. Verificar .env
cat /var/www/backend/.env

# 3. Testar manualmente
cd /var/www/backend
npm start

# 4. Se erro de módulo, reinstalar
rm -rf node_modules
npm install
```

---

# 🎉 PARABÉNS!

Seu site está ONLINE!

- 🌐 https://aparecidadonortesp.com.br
- 📱 Frontend servido por Nginx
- 🚀 Backend rodando com PM2
- 🔒 HTTPS automático com Let's Encrypt
- 💳 Stripe integrado
- 💾 Supabase conectado

---

**Data:** 16 de Dezembro de 2025  
**Versão:** 1.0  
**Status:** Pronto para Produção ✅
