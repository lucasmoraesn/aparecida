# 🔑 OBTER EMAIL DAS CONTAS DE TESTE - MERCADO PAGO

# Configure seu Access Token
$ACCESS_TOKEN = "TEST-1751150062149495-111118-36265247e49252183b6f880f29458144-2936869089"

Write-Host "🔍 Buscando informações das contas de teste..." -ForegroundColor Cyan

# Buscar usuários de teste
$url = "https://api.mercadopago.com/users/test_search"

try {
    $response = Invoke-RestMethod -Uri $url -Method Get -Headers @{
        "Authorization" = "Bearer $ACCESS_TOKEN"
        "Content-Type" = "application/json"
    }

    Write-Host "`n✅ Contas de teste encontradas:" -ForegroundColor Green
    
    foreach ($user in $response) {
        Write-Host "`n📧 Usuário: $($user.nickname)" -ForegroundColor Yellow
        Write-Host "   Email: $($user.email)" -ForegroundColor White
        Write-Host "   ID: $($user.id)" -ForegroundColor Gray
        Write-Host "   Site: $($user.site_id)" -ForegroundColor Gray
    }

    Write-Host "`n" -ForegroundColor Cyan
    Write-Host "=" -ForegroundColor Cyan -NoNewline
    Write-Host "=" * 70 -ForegroundColor Cyan
    Write-Host "📋 USE ESTES EMAILS NO FORMULÁRIO:" -ForegroundColor Yellow
    Write-Host "=" -ForegroundColor Cyan -NoNewline
    Write-Host "=" * 70 -ForegroundColor Cyan
    Write-Host "`n"

    $comprador = $response | Where-Object { $_.nickname -like "*TESTUSER8281623049456451088*" -or $_.id -eq "8281623049456451088" }
    if ($comprador) {
        Write-Host "🛒 EMAIL DO COMPRADOR (use no formulário):" -ForegroundColor Green
        Write-Host "   $($comprador.email)" -ForegroundColor White -BackgroundColor DarkGreen
    }

} catch {
    Write-Host "`n❌ Erro ao buscar contas:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    Write-Host "`n💡 SOLUÇÃO ALTERNATIVA:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://www.mercadopago.com.br/developers/panel/test-users" -ForegroundColor White
    Write-Host "2. Veja a lista de usuários de teste" -ForegroundColor White
    Write-Host "3. Copie o EMAIL do usuário COMPRADOR (buyer)" -ForegroundColor White
}

Write-Host "`n✅ Script finalizado!" -ForegroundColor Cyan
