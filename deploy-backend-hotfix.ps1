# HOTFIX Backend - envia apenas index.js e reinicia PM2
$ErrorActionPreference = "Stop"

$SERVER = "root@72.60.251.96"
$BACKEND_PATH = "/var/www/backend"

Write-Host "🚑 HOTFIX - Backend (index.js)" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Yellow

# 1) Upload do index.js atualizado
Write-Host "`n📤 Enviando server/index.js para produção..." -ForegroundColor Cyan
scp .\server\index.js ${SERVER}:${BACKEND_PATH}/index.js

# 2) Instalar deps (se necessário) e reiniciar PM2
Write-Host "`n🔁 Reiniciando PM2..." -ForegroundColor Cyan
ssh $SERVER "cd $BACKEND_PATH; npm install --production; pm2 restart aparecida-backend; pm2 status | head -n 30"

Write-Host "`n✅ Hotfix aplicado." -ForegroundColor Green
Write-Host "Teste agora: https://aparecidadonortesp.com.br/cadastrar-negocio" -ForegroundColor Green
