
# Script de Deploy Completo - Aparecida do Norte
$HOST = "52.14.244.186"
$USER = "ubuntu"
$KEY  = "C:\Users\Lucas\OneDrive\Documentos\aparecida-server.pem"
$SERVER = "${USER}@${HOST}"


Write-Host "`n=== PASSO 1: Enviando Backend ===" -ForegroundColor Green
Write-Host "Copiando arquivos do backend para o servidor..." -ForegroundColor Cyan

scp -i $KEY -r server/* "${SERVER}:/var/www/backend/"

Write-Host "`n=== PASSO 2: Instalando dependências do Backend ===" -ForegroundColor Green
ssh -i $KEY $SERVER "cd /var/www/backend && npm install"

Write-Host "`n=== PASSO 3: Iniciando Backend com PM2 ===" -ForegroundColor Green
ssh -i $KEY $SERVER "cd /var/www/backend && pm2 delete backend 2>/dev/null; pm2 start npm --name 'backend' -- run start && pm2 save"

Write-Host "`n=== PASSO 4: Enviando Frontend ===" -ForegroundColor Green
Write-Host "Copiando arquivos do frontend para o servidor..." -ForegroundColor Cyan

scp -i $KEY package.json "${SERVER}:/var/www/frontend/"
scp -i $KEY -r src "${SERVER}:/var/www/frontend/"
scp -i $KEY index.html "${SERVER}:/var/www/frontend/"
scp -i $KEY vite.config.ts "${SERVER}:/var/www/frontend/"
scp -i $KEY tsconfig.json "${SERVER}:/var/www/frontend/"
scp -i $KEY tsconfig.app.json "${SERVER}:/var/www/frontend/"
scp -i $KEY tsconfig.node.json "${SERVER}:/var/www/frontend/"
scp -i $KEY tailwind.config.js "${SERVER}:/var/www/frontend/"
scp -i $KEY postcss.config.js "${SERVER}:/var/www/frontend/"
scp -i $KEY -r public "${SERVER}:/var/www/frontend/"

Write-Host "`n=== PASSO 5: Instalando dependências e fazendo build do Frontend ===" -ForegroundColor Green
ssh -i $KEY $SERVER "cd /var/www/frontend && npm install && npm run build"

Write-Host "`n=== PASSO 6: Configurando SSL com Let's Encrypt ===" -ForegroundColor Green
ssh -i $KEY $SERVER "sudo certbot --nginx -d aparecidadonortesp.com.br -d www.aparecidadonortesp.com.br --non-interactive --agree-tos --email admin@aparecidadonortesp.com.br --redirect"

Write-Host "`n=== PASSO 7: Verificando status ===" -ForegroundColor Green
ssh -i $KEY $SERVER "pm2 status && sudo nginx -t && sudo systemctl status nginx --no-pager | head -20"

Write-Host "`n=== DEPLOY COMPLETO! ===" -ForegroundColor Cyan
Write-Host "Site: https://www.aparecidadonortesp.com.br" -ForegroundColor Yellow
Write-Host "API: https://www.aparecidadonortesp.com.br/api/plans" -ForegroundColor Yellow
