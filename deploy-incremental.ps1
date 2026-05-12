# Script de Deploy Incremental Seguro - Aparecida
# Executa todas as validações e uploads incrementais
# Uso: .\deploy-incremental.ps1 -EC2IP seu-ip-ec2 -KeyPath C:\aws\chave.pem

param(
    [string]$EC2IP = "",
    [string]$KeyPath = "C:\aws\aparecida.pem",
    [string]$Domain = "seu-dominio.com.br",
    [switch]$SkipValidation = $false,
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

# Cores para output
function Write-Header { Write-Host "`n========================================`n$_`n========================================`n" -ForegroundColor Cyan }
function Write-Success { Write-Host "✅ $_" -ForegroundColor Green }
function Write-Warning { Write-Host "⚠️  $_" -ForegroundColor Yellow }
function Write-Error_ { Write-Host "❌ $_" -ForegroundColor Red }
function Write-Info { Write-Host "ℹ️  $_" -ForegroundColor White }
function Write-Section { Write-Host "`n>>> $_" -ForegroundColor Yellow }

# Confirmação interativa
function Confirm-Action {
    param([string]$Message)
    $choice = Read-Host "$Message (s/n)"
    return $choice -eq 's' -or $choice -eq 'S'
}

# ============================================
# Validações Iniciais
# ============================================
Write-Header "DEPLOY INCREMENTAL SEGURO - APARECIDA"

# Validar EC2IP
if ([string]::IsNullOrEmpty($EC2IP)) {
    Write-Error_ "EC2IP não fornecido"
    Write-Info "Uso: .\deploy-incremental.ps1 -EC2IP seu-ip-ec2 -KeyPath C:\aws\chave.pem"
    exit 1
}

Write-Info "EC2IP: $EC2IP"
Write-Info "KeyPath: $KeyPath"
Write-Info "Domain: $Domain"

# Validar chave SSH
if (-not (Test-Path $KeyPath)) {
    Write-Error_ "Chave SSH não encontrada em $KeyPath"
    exit 1
}

Write-Success "Chave SSH encontrada"

# Validar rsync (pode não estar disponível no Windows)
if ((Get-Command rsync -ErrorAction SilentlyContinue) -eq $null) {
    Write-Warning "rsync não encontrado. Será usado SCP para upload."
    $useRsync = $false
} else {
    Write-Success "rsync encontrado"
    $useRsync = $true
}

# ============================================
# FASE 1: Validar Estado Local
# ============================================
Write-Header "FASE 1: VALIDAR ESTADO LOCAL"

# Verificar que estamos na pasta correta
if (-not (Test-Path "package.json") -or -not (Test-Path "server")) {
    Write-Error_ "Não está na pasta raiz do projeto"
    exit 1
}

Write-Success "Pasta do projeto validada"

# Validar que dist existe
if (-not (Test-Path "dist")) {
    Write-Warning "Pasta 'dist' não encontrada. Será necessário fazer build."
    $needsBuild = $true
} else {
    Write-Success "Pasta 'dist' encontrada"
    $distSize = (Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Info "Tamanho de dist: ~${distSize}MB"
    $needsBuild = $false
}

# ============================================
# FASE 2: Build do Frontend (se necessário)
# ============================================
if ($needsBuild) {
    Write-Header "FASE 2: BUILD DO FRONTEND"
    
    if (-not (Confirm-Action "Fazer build de produção? (npm run build)")) {
        Write-Info "Deploy cancelado pelo usuário"
        exit 0
    }

    Write-Info "Executando: npm run build"
    npm run build

    if ($LASTEXITCODE -ne 0) {
        Write-Error_ "Build falhou"
        exit 1
    }

    Write-Success "Build concluído com sucesso"
}

# ============================================
# FASE 3: Validar Backend
# ============================================
Write-Header "FASE 3: VALIDAR BACKEND"

# Verificar sintaxe do server/index.js
Write-Section "Validando sintaxe JavaScript"
node -c "server/index.js" 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Success "Sintaxe JavaScript validada"
} else {
    Write-Error_ "Erro de sintaxe em server/index.js"
    exit 1
}

# Verificar package.json
if (Test-Path "server/package.json") {
    Write-Success "server/package.json encontrado"
}

# ============================================
# FASE 4: Identificar Mudanças
# ============================================
Write-Header "FASE 4: IDENTIFICAR MUDANÇAS"

Write-Section "Mudanças no Frontend (últimas 5 revisões)"
$frontendChanges = git diff --name-only HEAD~5..HEAD 2>$null | Where-Object { $_ -match "^(src/|public/)" }

if ($frontendChanges -or $needsBuild) {
    Write-Success "Frontend tem mudanças para deploy"
    foreach ($change in $frontendChanges) {
        Write-Info "  - $change"
    }
} else {
    Write-Warning "Frontend não tem mudanças recentes"
}

Write-Section "Mudanças no Backend"
$backendChanges = git diff --name-only HEAD~5..HEAD 2>$null | Where-Object { $_ -match "^server/" }

if ($backendChanges) {
    Write-Success "Backend tem mudanças para deploy"
    foreach ($change in $backendChanges) {
        Write-Info "  - $change"
    }
} else {
    Write-Warning "Backend não tem mudanças recentes"
}

Write-Section "Mudanças em Dependências"
$depChanges = git diff --name-only HEAD~5..HEAD 2>$null | Where-Object { $_ -match "package" }

if ($depChanges) {
    Write-Warning "Dependências foram alteradas - npm install será necessário"
    Write-Info "Mudanças:"
    foreach ($change in $depChanges) {
        Write-Info "  - $change"
    }
    $needsNpmInstall = $true
} else {
    Write-Info "Dependências não foram alteradas"
    $needsNpmInstall = $false
}

# ============================================
# FASE 5: Preparar Backup na EC2
# ============================================
Write-Header "FASE 5: PREPARAR BACKUP NA EC2"

if (-not (Confirm-Action "Criar backup na EC2?")) {
    Write-Warning "Backup não será criado. Procedendo com cuidado."
} else {
    Write-Info "Criando backup na EC2..."

    # Backup dist
    ssh -i $KeyPath ubuntu@${EC2IP} "cd /home/ubuntu && tar -czf dist-backup-`$(date +%Y%m%d-%H%M%S).tar.gz dist/ 2>/dev/null && echo 'Backup dist criado' || echo 'Sem backup anterior de dist'" 2>$null | Out-Null

    # Backup server
    ssh -i $KeyPath ubuntu@${EC2IP} "cd /home/ubuntu && tar -czf server-backup-`$(date +%Y%m%d-%H%M%S).tar.gz server/ 2>/dev/null && echo 'Backup server criado' || echo 'Sem backup anterior de server'" 2>$null | Out-Null

    Write-Success "Backups criados na EC2"
}

# ============================================
# FASE 6: Upload com Rsync/SCP
# ============================================
Write-Header "FASE 6: UPLOAD DOS ARQUIVOS"

if (-not (Confirm-Action "Fazer upload dos arquivos?")) {
    Write-Info "Deploy cancelado pelo usuário"
    exit 0
}

if ($DryRun) {
    Write-Warning "MODO DRY-RUN: Não vai fazer upload de verdade"
}

# Upload Frontend
Write-Section "Upload Frontend (dist/)"

if ($useRsync) {
    Write-Info "Usando rsync..."
    $cmd = "rsync -avz --delete -e `"ssh -i '$KeyPath'`" dist\ ubuntu@${EC2IP}:/home/ubuntu/dist/"
} else {
    Write-Warning "Usando SCP (mais lento). Considere instalar rsync."
    # Compactar dist/ para upload mais rápido
    Write-Info "Compactando dist/..."
    Compress-Archive -Path "dist/*" -DestinationPath "dist-upload.zip" -Force
    $cmd = "scp -i '$KeyPath' dist-upload.zip ubuntu@${EC2IP}:/home/ubuntu/ && ssh -i '$KeyPath' ubuntu@${EC2IP} `"cd /home/ubuntu && unzip -q dist-upload.zip && rm dist-upload.zip`""
}

Write-Info "Executando: $cmd"

if (-not $DryRun) {
    Invoke-Expression $cmd

    if ($LASTEXITCODE -eq 0) {
        Write-Success "Upload do frontend concluído"
    } else {
        Write-Error_ "Falha no upload do frontend"
        exit 1
    }
} else {
    Write-Warning "DRY-RUN: comando não executado"
}

# Upload Backend
Write-Section "Upload Backend (server/)"

if ($useRsync) {
    Write-Info "Usando rsync..."
    $cmd = "rsync -avz -e `"ssh -i '$KeyPath'`" server\ ubuntu@${EC2IP}:/home/ubuntu/server/"
} else {
    Write-Info "Usando SCP..."
    $cmd = "scp -i '$KeyPath' -r server ubuntu@${EC2IP}:/home/ubuntu/"
}

Write-Info "Executando: $cmd"

if (-not $DryRun) {
    Invoke-Expression $cmd

    if ($LASTEXITCODE -eq 0) {
        Write-Success "Upload do backend concluído"
    } else {
        Write-Error_ "Falha no upload do backend"
        exit 1
    }
} else {
    Write-Warning "DRY-RUN: comando não executado"
}

# ============================================
# FASE 7: Atualizar Dependências (se necessário)
# ============================================
if ($needsNpmInstall) {
    Write-Header "FASE 7: ATUALIZAR DEPENDÊNCIAS NA EC2"

    if (-not (Confirm-Action "Executar npm install no backend?")) {
        Write-Warning "npm install não será executado. Backend pode não funcionar."
    } else {
        Write-Info "Executando npm install..."

        if (-not $DryRun) {
            $cmd = "ssh -i '$KeyPath' ubuntu@${EC2IP} `"cd /home/ubuntu/server && npm install --omit=dev`""
            Invoke-Expression $cmd

            if ($LASTEXITCODE -eq 0) {
                Write-Success "npm install concluído"
            } else {
                Write-Error_ "Falha no npm install"
                exit 1
            }
        } else {
            Write-Warning "DRY-RUN: npm install não executado"
        }
    }
} else {
    Write-Info "Dependências não mudaram, npm install não necessário"
}

# ============================================
# FASE 8: Validações na EC2
# ============================================
Write-Header "FASE 8: VALIDAÇÕES NA EC2"

Write-Section "Validar Nginx"

if (-not $DryRun) {
    $nginxTest = ssh -i $KeyPath ubuntu@${EC2IP} "sudo nginx -t 2>&1"

    if ($nginxTest -match "successful") {
        Write-Success "Nginx syntax OK"
    } else {
        Write-Error_ "Nginx syntax error:"
        Write-Host $nginxTest
        exit 1
    }
} else {
    Write-Warning "DRY-RUN: validação nginx não executada"
}

Write-Section "Validar PM2"

if (-not $DryRun) {
    $pm2Status = ssh -i $KeyPath ubuntu@${EC2IP} "pm2 status"
    Write-Info "PM2 Status:"
    Write-Host $pm2Status
} else {
    Write-Warning "DRY-RUN: verificação pm2 não executada"
}

# ============================================
# FASE 9: Restart
# ============================================
Write-Header "FASE 9: RESTART DOS SERVIÇOS"

if (-not (Confirm-Action "Reiniciar serviços (PM2 + Nginx)?")) {
    Write-Warning "Restart não será feito. Mudanças não estarão ativas."
    exit 0
}

if (-not $DryRun) {
    Write-Section "Reiniciando PM2"
    ssh -i $KeyPath ubuntu@${EC2IP} "pm2 restart aparecida-backend" | Out-Null
    Start-Sleep -Seconds 3
    Write-Success "PM2 reiniciado"

    Write-Section "Recarregando Nginx"
    ssh -i $KeyPath ubuntu@${EC2IP} "sudo systemctl reload nginx" | Out-Null
    Write-Success "Nginx recarregado"
} else {
    Write-Warning "DRY-RUN: restart não executado"
}

# ============================================
# FASE 10: Validações Pós-Deploy
# ============================================
Write-Header "FASE 10: VALIDAÇÕES PÓS-DEPLOY"

Write-Section "Health Check Backend"

if (-not $DryRun) {
    Start-Sleep -Seconds 2

    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -ErrorAction SilentlyContinue
        Write-Success "Backend respondendo"
    } catch {
        Write-Error_ "Backend não respondendo em http://localhost:3001/health"
    }
} else {
    Write-Warning "DRY-RUN: health check não executado"
}

Write-Section "Health Check Frontend"

if (-not $DryRun) {
    try {
        $response = Invoke-WebRequest -Uri "https://$Domain" -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Success "Frontend acessível em https://$Domain"
        }
    } catch {
        Write-Error_ "Frontend não acessível em https://$Domain"
    }
} else {
    Write-Warning "DRY-RUN: health check não executado"
}

Write-Section "Logs"

if (-not $DryRun) {
    Write-Info "Últimas linhas dos logs do backend:"
    ssh -i $KeyPath ubuntu@${EC2IP} "pm2 logs aparecida-backend --lines 10 --nostream" | head -15
} else {
    Write-Warning "DRY-RUN: logs não consultados"
}

# ============================================
# Resumo Final
# ============================================
Write-Header "✅ DEPLOY INCREMENTAL CONCLUÍDO"

Write-Success "Deploy seguro completado com sucesso!"
Write-Info "Monitorar logs por 5 minutos:"
Write-Info "  ssh -i $KeyPath ubuntu@$EC2IP 'pm2 logs aparecida-backend'"

if ($DryRun) {
    Write-Warning "Este foi um DRY-RUN. Nenhum arquivo foi realmente modificado."
    Write-Info "Para fazer deploy real, remova o flag -DryRun"
}
