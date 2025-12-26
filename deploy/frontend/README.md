# 🎨 FRONTEND - Deploy para VPS

## 📋 O que fazer:

### Opção 1: Git Clone (RECOMENDADO)
```bash
# Na VPS, após SSH:
mkdir -p /var/www/frontend
cd /var/www/frontend
git clone SEU_REPO_FRONTEND .
npm install
npm run build
```

### Opção 2: Upload via ZIP
1. Compacte a pasta raiz do projeto (excluindo `node_modules`)
2. Faça upload via SFTP (WinSCP)
3. Na VPS:
```bash
cd /var/www/frontend
unzip frontend.zip
rm frontend.zip
npm install
npm run build
```

## 🏗️ Build

```bash
# Gerar arquivos de produção
npm run build

# Resultado: pasta "dist/" com os arquivos prontos
```

## 📂 Estrutura esperada após build

```
/var/www/frontend/
├── dist/
│   ├── index.html
│   ├── assets/
│   └── ...
├── src/
├── package.json
└── vite.config.ts
```

## ✅ Verificar

Nginx automaticamente servirá os arquivos de `dist/`

```bash
# Testar Nginx
nginx -t

# Reiniciar Nginx
systemctl restart nginx

# Ver logs
tail -f /var/log/nginx/error.log
```

---

**Arquivo de config:** `vite.config.ts`  
**Pasta de build:** `dist/`  
**Rota SPA:** Todas as rotas → `index.html`
