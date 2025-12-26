# 🚀 SCRIPTS PRONTOS PARA COPIAR E COLAR

Copie cada bloco e cole diretamente no terminal SSH. Executará automaticamente!

---

## 1️⃣ PREPARAR SERVIDOR (Copy & Paste)

```bash
apt update && apt upgrade -y && apt install -y curl git wget npm nodejs && npm install -g pm2 && pm2 startup && pm2 save && echo "✅ Servidor preparado!"
```

---

## 2️⃣ CRIAR PASTAS (Copy & Paste)

```bash
mkdir -p /var/www/backend /var/www/frontend /var/log/app && ls -la /var/www/ && echo "✅ Pastas criadas!"
```

---

## 3️⃣ CLONAR E INSTALAR BACKEND (Copy & Paste)

**Substitua SEU_USUARIO e SEU_REPO:**

```bash
cd /var/www/backend && \
git clone https://github.com/SEU_USUARIO/SEU_REPO.git . && \
npm install && \
echo "✅ Backend clonado e dependências instaladas!"
```

---

## 4️⃣ CRIAR .env DO BACKEND (Copy & Paste)

**Edite antes de colar (substitua os valores):**

```bash
cat > /var/www/backend/.env << 'EOF'
PORT=3001
NODE_ENV=production

SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxx

FRONTEND_URL=https://aparecidadonortesp.com.br
EOF

echo "✅ .env criado!"
cat /var/www/backend/.env
```

---

## 5️⃣ TESTAR BACKEND (Copy & Paste)

```bash
cd /var/www/backend && npm start
```

**Você verá:**
```
🚀 Server on http://localhost:3001
✅ Server is ready and listening for requests
```

**Parar: CTRL+C**

---

## 6️⃣ INICIAR BACKEND COM PM2 (Copy & Paste)

```bash
cd /var/www/backend && \
pm2 start index.js --name "aparecida-backend" --env NODE_ENV=production && \
pm2 save && \
pm2 logs aparecida-backend
```

---

## 7️⃣ CLONAR E BUILD FRONTEND (Copy & Paste)

**Substitua SEU_USUARIO e SEU_REPO:**

```bash
cd /var/www/frontend && \
git clone https://github.com/SEU_USUARIO/SEU_REPO.git . && \
npm install && \
npm run build && \
echo "✅ Frontend pronto em /var/www/frontend/dist"
```

---

## 8️⃣ INSTALAR NGINX (Copy & Paste)

```bash
apt install -y nginx && \
systemctl enable nginx && \
systemctl start nginx && \
systemctl status nginx
```

---

## 9️⃣ CRIAR CONFIG NGINX (Copy & Paste)

```bash
cat > /etc/nginx/sites-available/aparecidadonortesp.com.br << 'EOF'
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/webhook {
        proxy_pass http://127.0.0.1:3001/api/webhook;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size 10M;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

ln -s /etc/nginx/sites-available/aparecidadonortesp.com.br /etc/nginx/sites-enabled/ && \
rm -f /etc/nginx/sites-enabled/default && \
nginx -t && \
systemctl restart nginx && \
echo "✅ Nginx configurado!"
```

---

## 🔟 INSTALAR HTTPS (Copy & Paste)

### Parte 1: Instalar Certbot
```bash
apt install -y certbot python3-certbot-nginx && \
echo "✅ Certbot instalado!"
```

### Parte 2: Gerar Certificado

**⚠️ IMPORTANTE: DNS JÁ DEVE ESTAR PROPAGADO!**

Se DNS ainda não propagou:
```bash
nslookup aparecidadonortesp.com.br
# Deve retornar 72.60.251.96
```

Se retornar algo diferente, **espere mais tempo** e tente novamente.

Depois, execute:
```bash
certbot --nginx -d aparecidadonortesp.com.br -d www.aparecidadonortesp.com.br
```

**Responder:**
- Email: seu-email@example.com
- Agree to terms? Y
- Share email? N
- Redirect HTTP to HTTPS? 2 (yes)

### Verificar SSL:
```bash
certbot certificates && \
nginx -t && \
curl https://aparecidadonortesp.com.br
```

---

## 📋 VERIFICAÇÃO RÁPIDA (Copy & Paste)

Testar tudo de uma vez:

```bash
echo "🔍 VERIFICAÇÃO DE DEPLOYMENT"
echo ""
echo "1️⃣  Backend rodando?"
pm2 list
echo ""
echo "2️⃣  Nginx rodando?"
systemctl status nginx
echo ""
echo "3️⃣  Backend respondendo?"
curl http://127.0.0.1:3001 2>/dev/null | head -c 100
echo ""
echo "4️⃣  Frontend respondendo?"
curl http://127.0.0.1/ 2>/dev/null | head -c 100
echo ""
echo "5️⃣  API passando?"
curl http://127.0.0.1/api/ 2>/dev/null | head -c 100
echo ""
echo "✅ Verificação concluída!"
```

---

## 📊 ÚTIL - COMANDOS FREQUENTES

### Ver Logs do Backend
```bash
pm2 logs aparecida-backend
```

### Reiniciar Backend
```bash
pm2 restart aparecida-backend
```

### Ver Logs do Nginx
```bash
tail -f /var/log/nginx/error.log
```

### Reiniciar Nginx
```bash
systemctl restart nginx
```

### Ver Processos Node
```bash
ps aux | grep node
```

### Verificar Porta 3001
```bash
lsof -i :3001
```

### Espaço em Disco
```bash
df -h
```

### Memória Disponível
```bash
free -h
```

---

## 🆘 TROUBLESHOOTING RÁPIDO

### Backend não inicia
```bash
cd /var/www/backend
npm start
# Ver o erro específico
```

### Nginx erro 502
```bash
pm2 restart aparecida-backend
systemctl restart nginx
curl http://127.0.0.1:3001
```

### DNS não propagou
```bash
nslookup aparecidadonortesp.com.br
# Aguarde 5-30 minutos
```

### Certificado SSL falha
```bash
# Certificar que DNS já propagou
nslookup aparecidadonortesp.com.br

# Tentar novamente
certbot renew --force-renewal
```

---

## ⏱️ TEMPO ESTIMADO

- Preparar servidor: 2-3 minutos
- Clonar backend: 1-2 minutos
- Clonar frontend: 2-3 minutos
- Build frontend: 1-2 minutos
- Configurar Nginx: 1 minuto
- Gerar SSL: 2-3 minutos
- **TOTAL: ~12-16 minutos**

---

## 🎯 CHECKLIST RÁPIDO

- [ ] Servidor preparado
- [ ] Pastas criadas
- [ ] Backend clonado e instalado
- [ ] .env criado
- [ ] Backend testado
- [ ] Backend iniciado com PM2
- [ ] Frontend clonado
- [ ] Frontend buildado
- [ ] Nginx instalado
- [ ] Config Nginx criada
- [ ] Nginx testado
- [ ] DNS apontando
- [ ] SSL gerado
- [ ] HTTPS funcionando

**Todos checados? 🚀 SITE ONLINE!**

---

**Dica Final:** Copie cada bloco um de cada vez e aguarde a conclusão antes de passar para o próximo!
