# ============================================
# SCRIPT DE DEPLOY DO BACKEND - HOSTINGER VPS
# ============================================

$ErrorActionPreference = "Continue"
$SERVER = "root@72.60.251.96"
$BACKEND_PATH = "/var/www/backend"

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "   DEPLOY DO BACKEND - HOSTINGER VPS" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# ============================================
# PASSO 1: Preparar o codigo localmente
# ============================================
Write-Host "PASSO 1: Preparando arquivos do backend..." -ForegroundColor Green

# Criar pasta temporaria
$tempDir = ".\temp-backend-deploy"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

# Copiar arquivos do backend (excluindo node_modules)
Write-Host "   -> Copiando arquivos do servidor..." -ForegroundColor Yellow
Copy-Item -Path ".\server\*" -Destination $tempDir -Recurse -Exclude "node_modules", "test*.js", "criar-*.js", "atualizar-*.js", "diagnostico-*.js", "listar-*.js", "remover-*.js", "testar-*.js", "verificar-*.js", "voltar-*.js", "__mocks__"

# Criar arquivo .tar.gz
Write-Host "   -> Compactando arquivos..." -ForegroundColor Yellow
$tarFile = "backend-deploy.tar.gz"
tar -czf $tarFile -C $tempDir .

if (Test-Path $tarFile) {
    Write-Host "   [OK] Arquivo criado: $tarFile" -ForegroundColor Green
} else {
    Write-Host "   [ERRO] Erro ao criar arquivo .tar.gz" -ForegroundColor Red
    exit 1
}

# ============================================
# PASSO 2: Upload para o servidor
# ============================================
Write-Host "`nPASSO 2: Fazendo upload para o servidor..." -ForegroundColor Green

# Criar pasta no servidor se nao existir
ssh $SERVER "mkdir -p $BACKEND_PATH"

# Upload do arquivo
Write-Host "   -> Enviando arquivo..." -ForegroundColor Yellow
scp $tarFile ${SERVER}:${BACKEND_PATH}/

# ============================================
# PASSO 3: Configurar no servidor
# ============================================
Write-Host "`nPASSO 3: Configurando no servidor..." -ForegroundColor Green

ssh $SERVER @"
cd $BACKEND_PATH
echo '   -> Extraindo arquivos...'
tar -xzf backend-deploy.tar.gz
rm backend-deploy.tar.gz
echo '   [OK] Arquivos extraidos'

echo '   -> Verificando Node.js...'
if ! command -v node &> /dev/null; then
    echo '   [AVISO] Node.js nao instalado. Instalando...'
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi
node --version
npm --version

echo '   -> Instalando dependencias...'
npm install --production

echo '   [OK] Dependencias instaladas'
"@

# ============================================
# PASSO 4: Configurar variaveis de ambiente
# ============================================
Write-Host "`nPASSO 4: Configurando variaveis de ambiente..." -ForegroundColor Green
Write-Host "   [IMPORTANTE] Voce precisa configurar o arquivo .env no servidor!" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Execute este comando para editar o .env no servidor:" -ForegroundColor Cyan
Write-Host "   ssh $SERVER `"nano $BACKEND_PATH/.env`"" -ForegroundColor White
Write-Host ""
Write-Host "   Cole estas variáveis (substitua pelos valores reais):" -ForegroundColor Cyan
Write-Host @"
   
   PORT=3001
   NODE_ENV=production
   
   # Supabase
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_SERVICE_KEY=sua-chave-service-role
   SUPABASE_ANON_KEY=sua-chave-anon
   
   # Stripe
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...

"@ -ForegroundColor White

$continuar = Read-Host "`n   Voce ja configurou o .env? (s/n)"
if ($continuar -ne "s") {
    Write-Host "`n   [AVISO] Configure o .env antes de continuar!" -ForegroundColor Yellow
    Write-Host "   Comando: ssh $SERVER `"nano $BACKEND_PATH/.env`"" -ForegroundColor Cyan
    exit 0
}

# ============================================
# PASSO 5: Configurar PM2
# ============================================
Write-Host "`nPASSO 5: Configurando PM2..." -ForegroundColor Green

ssh $SERVER @"
# Instalar PM2 se nao estiver instalado
if ! command -v pm2 &> /dev/null; then
    echo '   -> Instalando PM2...'
    npm install -g pm2
fi

cd $BACKEND_PATH

# Parar processo anterior se existir
pm2 stop aparecida-backend 2>/dev/null || true
pm2 delete aparecida-backend 2>/dev/null || true

# Iniciar novo processo
echo '   -> Iniciando backend com PM2...'
pm2 start index.js --name aparecida-backend --time

# Configurar para iniciar automaticamente
pm2 startup
pm2 save

echo '   -> Status do PM2:'
pm2 status
pm2 logs aparecida-backend --lines 20
"@

# ============================================
# PASSO 6: Configurar Nginx
# ============================================
Write-Host "`nPASSO 6: Configurando Nginx..." -ForegroundColor Green

# Upload da configuracao do Nginx
Write-Host "   -> Enviando configuracao do Nginx..." -ForegroundColor Yellow
scp nginx-aparecida.conf ${SERVER}:/etc/nginx/sites-available/aparecida.conf

ssh $SERVER @"
# Criar link simbolico
ln -sf /etc/nginx/sites-available/aparecida.conf /etc/nginx/sites-enabled/

# Testar configuracao
echo '   -> Testando configuracao do Nginx...'
nginx -t

# Recarregar Nginx
echo '   -> Recarregando Nginx...'
systemctl reload nginx

echo '   [OK] Nginx configurado'
"@

# ============================================
# PASSO 7: Testar
# ============================================
Write-Host "`nPASSO 7: Testando o backend..." -ForegroundColor Green

Start-Sleep -Seconds 2

Write-Host "   -> Testando endpoint de health check..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "http://72.60.251.96/api/health" -UseBasicParsing -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 200) {
    Write-Host "   [OK] Backend respondendo corretamente!" -ForegroundColor Green
    Write-Host "   Resposta: $($response.Content)" -ForegroundColor White
} else {
    Write-Host "   [AVISO] Backend nao esta respondendo como esperado" -ForegroundColor Yellow
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Yellow
}

# ============================================
# Limpeza
# ============================================
Write-Host "`nLimpando arquivos temporarios..." -ForegroundColor Green
Remove-Item -Recurse -Force $tempDir
Remove-Item -Force $tarFile

# ============================================
# FINALIZACAO
# ============================================
Write-Host "`n============================================================" -ForegroundColor Green
Write-Host "   DEPLOY DO BACKEND CONCLUIDO!" -ForegroundColor Green
Write-Host "============================================================`n" -ForegroundColor Green

Write-Host "Proximos passos:`n" -ForegroundColor Cyan
Write-Host "   1. Verifique os logs do PM2:" -ForegroundColor White
Write-Host "      ssh $SERVER `"pm2 logs aparecida-backend`"`n" -ForegroundColor Yellow

Write-Host "   2. Teste os endpoints da API:" -ForegroundColor White
Write-Host "      http://72.60.251.96/api/health" -ForegroundColor Yellow
Write-Host "      http://aparecidadonortesp.com.br/api/health`n" -ForegroundColor Yellow

Write-Host "   3. Configure o webhook do Stripe para:" -ForegroundColor White
Write-Host "      https://aparecidadonortesp.com.br/api/webhook`n" -ForegroundColor Yellow

Write-Host "   4. Comandos úteis do PM2:" -ForegroundColor White
Write-Host "      pm2 status              # Ver status" -ForegroundColor Yellow
Write-Host "      pm2 logs               # Ver todos os logs" -ForegroundColor Yellow
Write-Host "      pm2 restart aparecida-backend  # Reiniciar" -ForegroundColor Yellow
Write-Host "      pm2 stop aparecida-backend     # Parar" -ForegroundColor Yellow
Write-Host "      pm2 start aparecida-backend    # Iniciar`n" -ForegroundColor Yellow
