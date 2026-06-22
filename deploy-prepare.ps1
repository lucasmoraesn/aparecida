# Script de Preparação para Deploy - Aparecida
# Executa todas as etapas da FASE 1 automaticamente
# Uso: .\deploy-prepare.ps1

param(
    [string]$ProjectPath = (Get-Location),
    [switch]$SkipValidation = $false
)

$ErrorActionPreference = "Stop"

# Cores para output
function Write-Header { Write-Host "`n========================================`n$_`n========================================`n" -ForegroundColor Cyan }
function Write-Success { Write-Host "✅ $_" -ForegroundColor Green }
function Write-Warning { Write-Host "⚠️  $_" -ForegroundColor Yellow }
function Write-Error_ { Write-Host "❌ $_" -ForegroundColor Red }
function Write-Info { Write-Host "ℹ️  $_" -ForegroundColor White }

# ============================================
# Validações Iniciais
# ============================================
Write-Header "FASE 1: PREPARAÇÃO LOCAL - APARECIDA"

Write-Info "Validando pré-requisitos..."

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Success "Node.js encontrado: $nodeVersion"
} catch {
    Write-Error_ "Node.js não encontrado. Instale em https://nodejs.org/"
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Success "npm encontrado: v$npmVersion"
} catch {
    Write-Error_ "npm não encontrado."
    exit 1
}

# ============================================
# Passo 1: Validar .deployignore
# ============================================
Write-Header "Passo 1: Validando .deployignore"

$deployIgnorePath = Join-Path $ProjectPath ".deployignore"
if (Test-Path $deployIgnorePath) {
    Write-Success ".deployignore encontrado"
} else {
    Write-Error_ ".deployignore não encontrado em $deployIgnorePath"
    exit 1
}

# ============================================
# Passo 2: Frontend - Instalar dependências
# ============================================
Write-Header "Passo 2: Instalando dependências do Frontend"

Write-Info "Executando: npm install"
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Error_ "Falha ao instalar dependências do frontend"
    exit 1
}

Write-Success "Dependências do frontend instaladas"

# ============================================
# Passo 3: Frontend - Build
# ============================================
Write-Header "Passo 3: Gerando build de produção (Frontend)"

Write-Info "Executando: npm run build"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Error_ "Falha ao gerar build de produção"
    exit 1
}

Write-Success "Build de produção gerado com sucesso"

# Validar que dist existe
$distPath = Join-Path $ProjectPath "dist"
if (Test-Path $distPath) {
    $distSize = (Get-ChildItem $distPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Success "Pasta 'dist' criada (~${distSize}MB)"
} else {
    Write-Error_ "Pasta 'dist' não foi criada"
    exit 1
}

# ============================================
# Passo 4: Backend - Instalar dependências
# ============================================
Write-Header "Passo 4: Instalando dependências do Backend"

$serverPath = Join-Path $ProjectPath "server"
Push-Location $serverPath

Write-Info "Executando: npm install"
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Error_ "Falha ao instalar dependências do backend"
    Pop-Location
    exit 1
}

Write-Success "Dependências do backend instaladas"

# Validar package-lock.json
if (Test-Path "package-lock.json") {
    Write-Success "package-lock.json encontrado"
}

Pop-Location

# ============================================
# Passo 5: Validar estrutura
# ============================================
Write-Header "Passo 5: Validando estrutura do projeto"

$requiredDirs = @("dist", "public", "server", "src")
$requiredFiles = @("package.json", "index.html")

foreach ($dir in $requiredDirs) {
    $path = Join-Path $ProjectPath $dir
    if (Test-Path $path) {
        Write-Success "Pasta '$dir' encontrada"
    } else {
        Write-Error_ "Pasta '$dir' não encontrada em $ProjectPath"
    }
}

foreach ($file in $requiredFiles) {
    $path = Join-Path $ProjectPath $file
    if (Test-Path $path) {
        $size = (Get-Item $path).Length / 1KB
        Write-Success "Arquivo '$file' encontrado (~${size}KB)"
    } else {
        Write-Error_ "Arquivo '$file' não encontrado"
    }
}

# ============================================
# Passo 6: Compactar arquivos
# ============================================
Write-Header "Passo 6: Compactando para upload"

# Criar pasta temporária
$tempDir = "C:\temp\aparecida-prod-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

Write-Info "Pasta temporária: $tempDir"

# Arquivos e pastas a copiar
$itemsToCopy = @("dist", "public", "server", "package.json", "package-lock.json", "index.html")

Write-Info "Copiando arquivos necessários..."
foreach ($item in $itemsToCopy) {
    $source = Join-Path $ProjectPath $item
    $dest = Join-Path $tempDir $item
    
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $dest -Recurse -Force | Out-Null
        Write-Success "  ✓ $item"
    } else {
        Write-Warning "  ⊗ $item (não encontrado, pulando)"
    }
}

# Compactar
$zipPath = Join-Path $ProjectPath "aparecida-prod.zip"
Write-Info "Compactando em $zipPath..."

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force

# Validar tamanho
$zipSize = (Get-Item $zipPath).Length / 1MB
if ($zipSize -gt 100) {
    Write-Warning "Arquivo compactado tem ${zipSize}MB. Considere aumentar limites de upload."
} else {
    Write-Success "Arquivo compactado: ${zipSize}MB"
}

# Limpar temporário
Remove-Item -Path $tempDir -Recurse -Force

# ============================================
# Passo 7: Criar referência .env
# ============================================
Write-Header "Passo 7: Criando arquivo de referência .env"

$envProdPath = Join-Path $ProjectPath "env.prod.reference"
if (-not (Test-Path $envProdPath)) {
    @"
# ============================================
# REFERÊNCIA - Copie para EC2 e preencha com valores reais
# ============================================

# SUPABASE CONFIGURATION
VITE_SUPABASE_URL=sua_url_supabase_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_URL=sua_url_supabase_aqui
SUPABASE_SERVICE_KEY=sua_service_key_aqui

# STRIPE CONFIGURATION
STRIPE_SECRET_KEY=sk_live_sua_chave_aqui
STRIPE_WEBHOOK_SECRET=whsec_sua_webhook_secret_aqui

# RESEND (Emails Transacionais)
RESEND_API_KEY=re_sua_api_key_aqui
RESEND_FROM=noreply@aparecida.com.br
VITE_ADMIN_EMAIL=admin@aparecida.com.br

# SERVER CONFIGURATION
NODE_ENV=production
PORT=3001
"@ | Out-File -Encoding UTF8 $envProdPath

    Write-Success "Arquivo env.prod.reference criado"
} else {
    Write-Info "Arquivo env.prod.reference já existe"
}

# ============================================
# Resumo Final
# ============================================
Write-Header "✅ RESUMO DA PREPARAÇÃO"

Write-Info "Arquivos preparados para upload:"
Write-Info "  📦 aparecida-prod.zip (~${zipSize}MB)"
Write-Info "  📄 env.prod.reference (preencha com valores reais)"
Write-Info "  📋 GUIA_DEPLOY_EC2_UBUNTU.md (guia de deployment)"

Write-Info "`nPróximas etapas:"
Write-Info "1. Editar env.prod.reference com valores de produção"
Write-Info "2. Upload aparecida-prod.zip para EC2 (via SCP ou S3)"
Write-Info "3. Seguir GUIA_DEPLOY_EC2_UBUNTU.md na EC2"

Write-Success "`nPreparação concluída com sucesso!"
Write-Info "Você pode agora fazer upload do arquivo para a EC2."
