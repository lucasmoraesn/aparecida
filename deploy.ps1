Write-Host "1. Build local..."
npm run build
if ($LASTEXITCODE -ne 0) { 
    Write-Error "Falha no build"
    exit $LASTEXITCODE 
}

Write-Host "2. Compactar..."
# Verifica se a pasta dist existe
if (-not (Test-Path "dist")) {
    Write-Error "Pasta dist não encontrada!"
    exit 1
}

# Remove arquivo antigo se existir
if (Test-Path "frontend-update.tar.gz") {
    Remove-Item "frontend-update.tar.gz"
}

# Executa o tar
tar -czf frontend-update.tar.gz -C dist .
if ($LASTEXITCODE -ne 0) { 
    Write-Error "Falha ao compactar"
    exit $LASTEXITCODE 
}

Write-Host "3. Enviar para o servidor (root@72.60.251.96)..."
scp frontend-update.tar.gz root@72.60.251.96:/var/www/frontend/
if ($LASTEXITCODE -ne 0) { 
    Write-Error "Falha no envio via SCP"
    exit $LASTEXITCODE 
}

Write-Host "4. Atualizar no servidor..."
ssh root@72.60.251.96 "cd /var/www/frontend/dist && rm -rf * && cd .. && tar -xzf frontend-update.tar.gz -C dist && rm frontend-update.tar.gz"
if ($LASTEXITCODE -ne 0) { 
    Write-Error "Falha na execução remota via SSH"
    exit $LASTEXITCODE 
}

Write-Host "Deploy concluído com sucesso!"
