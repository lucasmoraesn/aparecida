# 🧪 Script de Teste de Pagamento - Aparecida do Norte

Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🧪 TESTE DE PAGAMENTO - APARECIDA DO NORTE  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Pedir email do usuário
$email = Read-Host "📧 Digite o email para receber a confirmação"

if ([string]::IsNullOrWhiteSpace($email)) {
    Write-Host "❌ Email não pode estar vazio!" -ForegroundColor Red
    exit 1
}

# Validar formato de email simples
if ($email -notmatch "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$") {
    Write-Host "❌ Email inválido!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Criando pagamento de teste..." -ForegroundColor Yellow

try {
    # Fazer requisição para criar sessão de pagamento
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/test-payment" -Method POST -ContentType "application/json" -Body (@{email=$email} | ConvertTo-Json)
    
    Write-Host ""
    Write-Host "✅ Pagamento criado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Detalhes:" -ForegroundColor Cyan
    Write-Host "   Email:    $($response.customer_email)"
    Write-Host "   Session:  $($response.session_id)"
    Write-Host "   Valor:    R$ 2,00"
    Write-Host ""
    Write-Host "💳 Cartão de teste: 4242 4242 4242 4242" -ForegroundColor Yellow
    Write-Host "   Data: 12/27 (qualquer mês/ano futuro)" -ForegroundColor Yellow
    Write-Host "   CVC: 123 (qualquer 3 dígitos)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔗 Abrindo checkout no navegador..." -ForegroundColor Green
    Write-Host ""
    
    # Abrir URL no navegador
    Start-Process $response.url
    
    Write-Host "✅ Após fazer o pagamento, você receberá um email em: $email" -ForegroundColor Green
    Write-Host "   ⏱️  Leva usuário 5-10 segundos para processar" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erro ao criar pagamento:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
