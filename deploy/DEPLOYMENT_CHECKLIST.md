# ✅ CHECKLIST DE DEPLOYMENT

## 📝 Antes de começar

- [ ] Repositórios do frontend e backend estão no GitHub/GitLab
- [ ] Arquivo `.env` preparado com as credenciais do Supabase e Stripe
- [ ] SSH da VPS funcionando (`ssh root@72.60.251.96`)
- [ ] Domínio aponta para a VPS (DNS propagado)

---

## 🎯 Passo a Passo

### 1️⃣ Conectar na VPS
```bash
ssh root@72.60.251.96
# Cole a senha quando pedir
```

### 2️⃣ Criar pastas
```bash
mkdir -p /var/www/backend
mkdir -p /var/www/frontend
```

### 3️⃣ Deploy Backend
```bash
cd /var/www/backend
git clone SEU_REPO_BACKEND .
npm install
```
- [ ] Backend clonado
- [ ] npm install concluído

### 4️⃣ Deploy Frontend
```bash
cd /var/www/frontend
git clone SEU_REPO_FRONTEND .
npm install
npm run build
```
- [ ] Frontend clonado
- [ ] npm install concluído
- [ ] Build gerado (pasta `dist/`)

### 5️⃣ Instalar Nginx e PM2
```bash
apt update && apt upgrade -y
apt install -y nginx npm git curl

npm install -g pm2
pm2 startup
pm2 save
```
- [ ] Nginx instalado
- [ ] PM2 instalado e configurado

### 6️⃣ Configurar .env do Backend
```bash
nano /var/www/backend/.env
```
Adicionar:
```
PORT=3001
NODE_ENV=production
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```
- [ ] Arquivo `.env` criado com todas as variáveis

### 7️⃣ Iniciar Backend com PM2
```bash
cd /var/www/backend
pm2 start index.js --name "aparecida-backend"
pm2 save

# Verificar
pm2 list
pm2 logs aparecida-backend
```
- [ ] Backend rodando em 3001

### 8️⃣ Configurar Nginx
```bash
nano /etc/nginx/sites-available/aparecidadonortesp.com.br
```

Colar:
```nginx
server {
    listen 80;
    server_name aparecidadonortesp.com.br www.aparecidadonortesp.com.br;

    root /var/www/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ativar:
```bash
ln -s /etc/nginx/sites-available/aparecidadonortesp.com.br /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```
- [ ] Arquivo de config criado
- [ ] Nginx testado
- [ ] Nginx reiniciado

### 9️⃣ HTTPS com Let's Encrypt
```bash
apt install -y certbot python3-certbot-nginx

certbot --nginx -d aparecidadonortesp.com.br -d www.aparecidadonortesp.com.br
# Responder com email e escolher redirect para HTTPS
```
- [ ] SSL instalado
- [ ] Acesso HTTPS funcionando

### 🔟 Verificar tudo
```bash
# Backend rodando?
curl http://localhost:3001

# Nginx OK?
systemctl status nginx

# PM2 OK?
pm2 list

# Logs
pm2 logs aparecida-backend
tail -f /var/log/nginx/error.log
```
- [ ] Backend respondendo
- [ ] Nginx ativo
- [ ] PM2 OK
- [ ] Site acessível

---

## 🌐 Resultado Final

Seu site estará online em:
- https://aparecidadonortesp.com.br
- Frontend: Servido pelo Nginx
- Backend: Rodando via PM2
- API: /api/... → 127.0.0.1:3001

---

## 🆘 Troubleshooting

**Backend não inicia:**
```bash
pm2 logs aparecida-backend
# Verificar se .env está correto
```

**Nginx erro 502:**
```bash
# Backend está rodando?
pm2 list
# Reiniciar
pm2 restart aparecida-backend
systemctl restart nginx
```

**DNS não propagou:**
- Aguardar 5-30 minutos
- Testar: `nslookup aparecidadonortesp.com.br`

**Certificado SSL falhou:**
```bash
# Tentar novamente após DNS propagar
certbot renew
```

---

**Data de criação:** 2025-12-16  
**Versão:** 1.0
