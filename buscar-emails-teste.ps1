# Script para buscar os emails dos usuários de teste do Mercado Pago

$ACCESS_TOKEN = "TEST-1751150062149495-111118-36265247e49252183b6f880f29458144-2936869089"

Write-Host "🔍 Buscando usuários de teste no Mercado Pago..." -ForegroundColor Cyan
Write-Host ""

try {
    # Endpoint da API do Mercado Pago para listar usuários de teste
    $url = "https://api.mercadopago.com/users/test_search"
    
    $headers = @{
        "Authorization" = "Bearer $ACCESS_TOKEN"
        "Content-Type" = "application/json"
    }
    
    Write-Host "📡 Fazendo requisição para: $url" -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
    
    if ($response -and $response.Count -gt 0) {
        Write-Host "✅ Encontrados $($response.Count) usuário(s) de teste:" -ForegroundColor Green
        Write-Host ""
        
        foreach ($user in $response) {
            Write-Host "════════════════════════════════════════════════" -ForegroundColor DarkGray
            Write-Host "👤 ID: " -NoNewline -ForegroundColor Yellow
            Write-Host $user.id -ForegroundColor White
            
            Write-Host "📧 Email: " -NoNewline -ForegroundColor Yellow
            Write-Host $user.email -ForegroundColor White -BackgroundColor DarkGreen
            
            Write-Host "🏷️  Nickname: " -NoNewline -ForegroundColor Yellow
            Write-Host $user.nickname -ForegroundColor White
            
            Write-Host "🌍 Site: " -NoNewline -ForegroundColor Yellow
            Write-Host $user.site_id -ForegroundColor White
            Write-Host ""
        }
        
        Write-Host "════════════════════════════════════════════════" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "📋 COPIE O EMAIL DO COMPRADOR ACIMA E USE NO FORMULÁRIO!" -ForegroundColor Green -BackgroundColor Black
        Write-Host ""
        
    } else {
        Write-Host "⚠️  Nenhum usuário de teste encontrado" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "💡 Você precisa criar usuários de teste em:" -ForegroundColor Cyan
        Write-Host "   https://www.mercadopago.com.br/developers/panel/test-users" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Erro ao buscar usuários de teste:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 SOLUÇÃO:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://www.mercadopago.com.br/developers/panel/test-users" -ForegroundColor White
    Write-Host "2. Veja seus usuários de teste criados" -ForegroundColor White
    Write-Host "3. Copie o EMAIL do usuário tipo COMPRADOR (buyer)" -ForegroundColor White
    Write-Host "4. O email terá o formato: test_user_[ID]@testuser.com" -ForegroundColor White
}

Write-Host ""
Write-Host "✅ Script finalizado" -ForegroundColor Cyan
