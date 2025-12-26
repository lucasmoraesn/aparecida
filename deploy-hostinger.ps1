# Script de Deploy para Hostinger VPS
$SERVER = "root@72.60.251.96"

Write-Host "=== PASSO 1: Instalar Node.js ===" -ForegroundColor Green
ssh $SERVER "apt update && apt upgrade -y && apt install -y curl && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs && node -v && npm -v"

Write-Host "`n=== PASSO 2: Configurar Backend ===" -ForegroundColor Green
ssh $SERVER "mkdir -p /var/www/backend && cd /var/www/backend && ls -la"

Write-Host "`n=== PASSO 3: Configurar Frontend ===" -ForegroundColor Green
ssh $SERVER "mkdir -p /var/www/frontend && cd /var/www/frontend && ls -la"

Write-Host "`n=== PASSO 4: Instalar Nginx ===" -ForegroundColor Green
ssh $SERVER "apt install -y nginx && nginx -v"

Write-Host "`n=== PASSO 5: Instalar PM2 ===" -ForegroundColor Green
ssh $SERVER "npm install -g pm2 && pm2 -v"

Write-Host "`n=== Deploy inicial concluído ===" -ForegroundColor Cyan
