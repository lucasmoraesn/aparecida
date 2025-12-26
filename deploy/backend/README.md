# 📦 BACKEND - Deploy para VPS

## 📋 O que fazer:

### Opção 1: Git Clone (RECOMENDADO)
```bash
# Na VPS, após SSH:
mkdir -p /var/www/backend
cd /var/www/backend
git clone SEU_REPO_BACKEND .
npm install
```

### Opção 2: Upload via ZIP
1. Compacte a pasta `server/` como `backend.zip`
2. Faça upload via SFTP (WinSCP)
3. Na VPS:
```bash
cd /var/www/backend
unzip backend.zip
rm backend.zip
npm install
```

## 🔧 Configuração .env

Criar arquivo `/var/www/backend/.env` com:

```
PORT=3001
NODE_ENV=production

SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## 🚀 Iniciar Backend

```bash
# Com PM2
pm2 start index.js --name "aparecida-backend"
pm2 save

# Ver logs
pm2 logs aparecida-backend

# Reiniciar
pm2 restart aparecida-backend
```

## ✅ Verificar

```bash
# Backend rodando?
curl http://localhost:3001

# Webhook pronto?
curl http://localhost:3001/api/webhook
```

---

**Arquivo principal:** `server/index.js`  
**Porta:** 3001  
**Rota de API:** `/api/`
