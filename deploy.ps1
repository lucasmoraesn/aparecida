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

Write-Host "3. Enviar para o servidor (ubuntu@52.14.244.186)..."
scp -i "C:\Users\Lucas\OneDrive\Documentos\aparecida-server.pem" frontend-update.tar.gz ubuntu@52.14.244.186:/home/ubuntu/
if ($LASTEXITCODE -ne 0) { 
    Write-Error "Falha no envio via SCP"
    exit $LASTEXITCODE 
}

Write-Host "4. Atualizar no servidor..."
ssh -i "C:\Users\Lucas\OneDrive\Documentos\aparecida-server.pem" ubuntu@52.14.244.186 "sudo rm -rf /var/www/html/* && sudo tar -xzf /home/ubuntu/frontend-update.tar.gz -C /var/www/html && sudo chown -R www-data:www-data /var/www/html && sudo rm /home/ubuntu/frontend-update.tar.gz"
if ($LASTEXITCODE -ne 0) { 
    Write-Error "Falha na execução remota via SSH"
    exit $LASTEXITCODE 
}

Write-Host "Deploy concluído com sucesso!"
