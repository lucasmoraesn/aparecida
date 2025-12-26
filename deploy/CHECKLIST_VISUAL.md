# ✅ CHECKLIST VISUAL - DEPLOYMENT HOSTINGER

## 🎯 FASE 1: PREPARAÇÃO (No seu PC)

- [ ] Repositório Backend está no GitHub/GitLab
- [ ] Repositório Frontend está no GitHub/GitLab
- [ ] Credenciais Supabase prontas
- [ ] Credenciais Stripe prontas
- [ ] .env template revisado
- [ ] VPS Hostinger acionada
- [ ] SSH testado

**Status:** ⏳ Aguardando ação

---

## 🌐 FASE 2: CONECTAR NA VPS (Terminal SSH)

```bash
ssh root@72.60.251.96
```

- [ ] SSH conectado com sucesso
- [ ] Você vê o prompt do Linux

**Comandos rápidos:**
```bash
whoami              # Deve retornar: root
pwd                 # Deve retornar: /root
```

**Status:** ⏳ Aguardando ação

---

## 📦 FASE 3: PREPARAR SERVIDOR

```bash
apt update && apt upgrade -y
apt install -y curl git wget npm nodejs
npm install -g pm2
pm2 startup
pm2 save
```

- [ ] Sistema atualizado
- [ ] Node.js instalado (verificar: `node --version`)
- [ ] NPM instalado (verificar: `npm --version`)
- [ ] PM2 instalado (verificar: `pm2 --version`)

**Verificar:**
```bash
node --version    # v20.x ou superior
npm --version     # 10.x ou superior
pm2 --version     # 5.x ou superior
```

**Status:** ⏳ Aguardando ação

---

## 📁 FASE 4: CRIAR PASTAS

```bash
mkdir -p /var/www/backend
mkdir -p /var/www/frontend
mkdir -p /var/log/app
```

- [ ] Pasta `/var/www/backend` criada
- [ ] Pasta `/var/www/frontend` criada

**Verificar:**
```bash
ls -la /var/www/
```

**Status:** ⏳ Aguardando ação

---

## 🚀 FASE 5: DEPLOY BACKEND

### 5.1 Clonar Repositório
```bash
cd /var/www/backend
git clone https://github.com/SEU_USUARIO/SEU_REPO_BACKEND.git .
npm install
```

- [ ] Backend clonado com sucesso
- [ ] Dependências instaladas
- [ ] Pasta contém `index.js`
- [ ] Pasta contém `package.json`

**Verificar:**
```bash
ls -la /var/www/backend/
```

### 5.2 Criar .env
```bash
nano /var/www/backend/.env
```

**Colar (adaptando seus dados):**
```
PORT=3001
NODE_ENV=production
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://aparecidadonortesp.com.br
```

- [ ] Arquivo `.env` criado
- [ ] Todas as variáveis preenchidas
- [ ] PORT = 3001
- [ ] NODE_ENV = production

**Verificar:**
```bash
cat /var/www/backend/.env | grep PORT
```

### 5.3 Testar Backend
```bash
cd /var/www/backend
npm start
```

Você deve ver:
```
🚀 Server on http://localhost:3001
✅ Server is ready and listening for requests
```

Parar: `CTRL+C`

- [ ] Backend iniciou sem erros
- [ ] Porta 3001 funcionando
- [ ] Logs mostram sucesso

### 5.4 Iniciar com PM2
```bash
cd /var/www/backend
pm2 start index.js --name "aparecida-backend" --env NODE_ENV=production
pm2 save
```

- [ ] PM2 iniciou o backend
- [ ] Status = online
- [ ] Processo está em execução

**Verificar:**
```bash
pm2 list
pm2 logs aparecida-backend
```

**Status:** ⏳ Aguardando ação

---

## 🎨 FASE 6: DEPLOY FRONTEND

### 6.1 Clonar Repositório
```bash
cd /var/www/frontend
git clone https://github.com/SEU_USUARIO/SEU_REPO_FRONTEND.git .
npm install
```

- [ ] Frontend clonado com sucesso
- [ ] Dependências instaladas
- [ ] Pasta contém `vite.config.ts`
- [ ] Pasta contém `package.json`

**Verificar:**
```bash
ls -la /var/www/frontend/
```

### 6.2 Build do Projeto
```bash
cd /var/www/frontend
npm run build
```

Você deve ver:
```
✓ built in 45.23s
```

- [ ] Build completado com sucesso
- [ ] Pasta `dist/` foi criada
- [ ] `dist/index.html` existe

**Verificar:**
```bash
ls -la /var/www/frontend/dist/
```

**Status:** ⏳ Aguardando ação

---

## 🌐 FASE 7: NGINX

### 7.1 Instalar
```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

- [ ] Nginx instalado
- [ ] Nginx iniciado
- [ ] Nginx habilitado para auto-start

**Verificar:**
```bash
systemctl status nginx
```

### 7.2 Criar Configuração
```bash
nano /etc/nginx/sites-available/aparecidadonortesp.com.br
```

**Colar a configuração do guia completo**

- [ ] Arquivo criado
- [ ] Arquivo tem 80+ linhas
- [ ] Contém frontend e proxy API

### 7.3 Ativar Site
```bash
ln -s /etc/nginx/sites-available/aparecidadonortesp.com.br /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

- [ ] Site ativado
- [ ] Nginx teste passou
- [ ] Nginx reiniciado

**Verificar:**
```bash
curl http://localhost/
```

**Status:** ⏳ Aguardando ação

---

## 🔒 FASE 8: APONTAR DNS

1. Painel Hostinger → DNS
2. Criar registros A:

- [ ] **aparecidadonortesp.com.br** → 72.60.251.96
- [ ] **www.aparecidadonortesp.com.br** → 72.60.251.96
- [ ] **Aguardar 5-30 minutos**

**Verificar:**
```bash
nslookup aparecidadonortesp.com.br
# Deve retornar 72.60.251.96
```

**Status:** ⏳ Aguardando ação

---

## 🔐 FASE 9: HTTPS (SSL/TLS)

### 9.1 Instalar Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

- [ ] Certbot instalado

### 9.2 Gerar Certificado
```bash
certbot --nginx -d aparecidadonortesp.com.br -d www.aparecidadonortesp.com.br
```

**Respostas:**
- Email: seu-email@example.com
- Agree: Y
- Share email: N
- Redirect to HTTPS: 2

- [ ] Certificado gerado com sucesso
- [ ] Nginx reconfigurado
- [ ] HTTPS ativado

**Verificar:**
```bash
certbot certificates
nginx -t
curl https://aparecidadonortesp.com.br
```

**Status:** ⏳ Aguardando ação

---

## ✅ VERIFICAÇÃO FINAL

```bash
# 1. Backend
pm2 list                              # deve mostrar "online"
curl http://127.0.0.1:3001           # deve responder

# 2. Frontend
curl http://127.0.0.1/               # deve retornar HTML

# 3. API
curl http://127.0.0.1/api/           # deve passar para 3001

# 4. HTTPS
curl https://aparecidadonortesp.com.br  # deve funcionar

# 5. DNS
nslookup aparecidadonortesp.com.br   # deve retornar 72.60.251.96
```

---

## 🎉 RESULTADO FINAL

Todos os itens checados?

- [ ] Backend rodando em :3001
- [ ] Frontend servido por Nginx
- [ ] Domínio apontando
- [ ] HTTPS funcionando
- [ ] API acessível via /api/
- [ ] Sem erros nos logs

**Se SIM:** 🚀 **SEU SITE ESTÁ ONLINE!**

```
https://aparecidadonortesp.com.br ✅
```

**Se NÃO:** Verifique os logs (veja Troubleshooting no guia completo)

---

## 📊 RESUMO DE PORTS E PATHS

| Serviço | Port | Path | Status |
|---------|------|------|--------|
| Nginx | 80 | / | ✅ |
| Nginx SSL | 443 | / | ✅ |
| Backend | 3001 | /api/ | ✅ |
| Frontend | - (Nginx) | / | ✅ |

---

**Última atualização:** 16 de Dezembro de 2025
