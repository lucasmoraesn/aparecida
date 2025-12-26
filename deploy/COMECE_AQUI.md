# 📌 COMECE AQUI - GUIA RÁPIDO

## 🎯 Seu Projeto

| Item | Detalhes |
|------|----------|
| **IP VPS** | 72.60.251.96 |
| **Domínio** | aparecidadonortesp.com.br |
| **Backend** | Node.js + Express + Supabase + Stripe |
| **Frontend** | React + Vite |
| **Porta Backend** | 3001 |
| **API Path** | /api/ |

---

## 🚀 POR ONDE COMEÇAR?

### 📂 Você tem 4 guias nesta pasta:

1. **GUIA_COMPLETO_HOSTINGER.md** ⭐ **COMECE AQUI!**
   - Passo a passo detalhado
   - Explica cada comando
   - Com verificações após cada etapa

2. **SCRIPTS_COPY_PASTE.md**
   - Scripts prontos para copiar/colar
   - Para quem quer ir rápido

3. **CHECKLIST_VISUAL.md**
   - Checklist visual com tudo que fazer
   - Marca conforme conclui

4. **DEPLOYMENT_CHECKLIST.md**
   - Checklist inicial simples

---

## ⚡ RESUMO DO PROCESS (5 Passos Gigantes)

```
1. SSH na VPS                  →  ssh root@72.60.251.96
2. Preparar Servidor           →  apt update && apt upgrade -y...
3. Clonar Backend              →  git clone ...
4. Clonar Frontend             →  git clone ...
5. Configurar Nginx + SSL      →  nginx + certbot
```

---

## 🎬 COMEÇAR AGORA

### ✅ Passo 1: Conectar na VPS

```bash
ssh root@72.60.251.96
# Cole a senha quando pedir
```

### ✅ Passo 2: Preparar Servidor (copiar e colar tudo)

```bash
apt update && apt upgrade -y
apt install -y curl git wget npm nodejs
npm install -g pm2
pm2 startup
pm2 save
mkdir -p /var/www/backend /var/www/frontend
```

### ✅ Passo 3: Clonar Backend

```bash
cd /var/www/backend
git clone https://github.com/SEU_USUARIO/SEU_REPO_BACKEND.git .
npm install
```

**Depois criar .env com suas credenciais Supabase e Stripe**

### ✅ Passo 4: Iniciar Backend

```bash
cd /var/www/backend
npm start  # Testar

# Depois iniciar com PM2
pm2 start index.js --name "aparecida-backend"
pm2 save
```

### ✅ Passo 5: Clonar Frontend

```bash
cd /var/www/frontend
git clone https://github.com/SEU_USUARIO/SEU_REPO_FRONTEND.git .
npm install
npm run build
```

### ✅ Passo 6: Configurar Nginx

```bash
apt install -y nginx

# Criar arquivo de config (veja GUIA_COMPLETO_HOSTINGER.md)
nano /etc/nginx/sites-available/aparecidadonortesp.com.br

# Ativar
ln -s /etc/nginx/sites-available/aparecidadonortesp.com.br /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

### ✅ Passo 7: Apontar DNS na Hostinger

1. Painel Hostinger → DNS
2. A record: aparecidadonortesp.com.br → 72.60.251.96
3. A record: www.aparecidadonortesp.com.br → 72.60.251.96
4. Aguardar 5-30 minutos

### ✅ Passo 8: HTTPS com Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx

# Depois que DNS propagar:
certbot --nginx -d aparecidadonortesp.com.br -d www.aparecidadonortesp.com.br
```

---

## 📞 SE TIVER DÚVIDA

- Vá para **GUIA_COMPLETO_HOSTINGER.md**
- Se quiser copy/paste: **SCRIPTS_COPY_PASTE.md**
- Se quiser checklist: **CHECKLIST_VISUAL.md**

---

## ✅ RESULTADO FINAL

```
https://aparecidadonortesp.com.br ✅

Frontend: React servido por Nginx
Backend: Node rodando em 3001
API: /api/ → 127.0.0.1:3001
HTTPS: Automático com Let's Encrypt
```

---

## 📊 INFORMAÇÕES DO SEU PROJETO

**Backend:** 
- Arquivo principal: `server/index.js`
- Comando para iniciar: `npm start` (roda `node index.js`)
- Porta: 3001
- Usa .env com Supabase + Stripe

**Frontend:**
- Arquivo de config: `vite.config.ts`
- Comando de build: `npm run build`
- Build folder: `dist/`
- React SPA (rota única)

**API:**
- Caminho: `/api/`
- Webhook: `/api/webhook` (Stripe)

---

**Última atualização:** 16 de Dezembro de 2025

**Você está pronto para fazer o deployment! 🚀**
