# Deploy Rápido do Frontend - HOTFIX
$SERVER = "root@72.60.251.96"
$FRONTEND_DEST = "/var/www/frontend"

Write-Host "🚀 DEPLOY HOTFIX - Frontend" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Yellow

# 1. Upload dos arquivos dist
Write-Host "`n📦 Fazendo backup e upload do novo build..." -ForegroundColor Cyan
ssh $SERVER 'cd /var/www/frontend; if [ -d dist ]; then mv dist dist.backup.$(date +%Y%m%d_%H%M%S); fi'

Write-Host "`n📤 Enviando arquivos..." -ForegroundColor Cyan
scp -r dist ${SERVER}:${FRONTEND_DEST}/

# 2. Verificar se foi enviado corretamente
Write-Host "`n✅ Verificando deploy..." -ForegroundColor Green
ssh $SERVER 'ls -lh /var/www/frontend/dist/'

Write-Host "`n🎉 Deploy concluído!" -ForegroundColor Green
Write-Host "Teste agora: https://aparecidadonortesp.com.br/cadastrar-negocio" -ForegroundColor Green
