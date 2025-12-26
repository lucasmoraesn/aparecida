# Script de Deploy Completo - Aparecida do Norte
$SERVER = "root@72.60.251.96"

Write-Host "`n=== PASSO 1: Enviando Backend ===" -ForegroundColor Green
Write-Host "Copiando arquivos do backend para o servidor..." -ForegroundColor Cyan

# Criar arquivo temporário excluindo node_modules
$excludeFile = "rsync-exclude.txt"
"node_modules/", "*.log", ".env", "dist/", "coverage/" | Out-File -FilePath $excludeFile -Encoding ASCII

# Copiar arquivos do backend (exceto node_modules)
scp -r server/* ${SERVER}:/var/www/backend/

Write-Host "`n=== PASSO 2: Instalando dependências do Backend ===" -ForegroundColor Green
ssh $SERVER "cd /var/www/backend && npm install"

Write-Host "`n=== PASSO 3: Iniciando Backend com PM2 ===" -ForegroundColor Green
ssh $SERVER "cd /var/www/backend && pm2 delete backend 2>/dev/null; pm2 start npm --name 'backend' -- run start && pm2 save"

Write-Host "`n=== PASSO 4: Enviando Frontend ===" -ForegroundColor Green
Write-Host "Copiando arquivos do frontend para o servidor..." -ForegroundColor Cyan

# Criar lista de arquivos para copiar (excluindo node_modules e dist)
scp package.json ${SERVER}:/var/www/frontend/
scp -r src ${SERVER}:/var/www/frontend/
scp index.html ${SERVER}:/var/www/frontend/
scp vite.config.ts ${SERVER}:/var/www/frontend/
scp tsconfig.json ${SERVER}:/var/www/frontend/
scp tsconfig.app.json ${SERVER}:/var/www/frontend/
scp tsconfig.node.json ${SERVER}:/var/www/frontend/
scp tailwind.config.js ${SERVER}:/var/www/frontend/
scp postcss.config.js ${SERVER}:/var/www/frontend/
scp -r public ${SERVER}:/var/www/frontend/

Write-Host "`n=== PASSO 5: Instalando dependências e fazendo build do Frontend ===" -ForegroundColor Green
ssh $SERVER "cd /var/www/frontend && npm install && npm run build"

Write-Host "`n=== PASSO 6: Configurando SSL com Let's Encrypt ===" -ForegroundColor Green
ssh $SERVER "certbot --nginx -d aparecidadonortesp.com.br -d www.aparecidadonortesp.com.br --non-interactive --agree-tos --email admin@aparecidadonortesp.com.br --redirect"

Write-Host "`n=== PASSO 7: Verificando status ===" -ForegroundColor Green
ssh $SERVER "pm2 status && nginx -t && systemctl status nginx --no-pager | head -20"

Write-Host "`n=== DEPLOY COMPLETO! ===" -ForegroundColor Cyan
Write-Host "Site: https://www.aparecidadonortesp.com.br" -ForegroundColor Yellow
Write-Host "API: https://www.aparecidadonortesp.com.br/api/plans" -ForegroundColor Yellow
