# 🧪 Teste do Webhook - PowerShell

# Configure a URL do seu Ngrok
$NGROK_URL = "https://SUA-URL-AQUI.ngrok-free.app"

Write-Host "🔍 Testando webhook em: $NGROK_URL" -ForegroundColor Cyan

# 1. Teste GET (verificação do endpoint)
Write-Host "`n1️⃣ Teste GET /api/payment-webhook" -ForegroundColor Yellow
try {
    $getResponse = Invoke-RestMethod -Uri "$NGROK_URL/api/payment-webhook" -Method Get -Headers @{
        "ngrok-skip-browser-warning" = "true"
    }
    Write-Host "✅ GET funcionou:" -ForegroundColor Green
    Write-Host ($getResponse | ConvertTo-Json) -ForegroundColor Green
} catch {
    Write-Host "❌ Erro no GET: $_" -ForegroundColor Red
}

# 2. Teste POST (simular webhook do Mercado Pago)
Write-Host "`n2️⃣ Teste POST /api/payment-webhook (simulando MP)" -ForegroundColor Yellow

$webhookBody = @{
    type = "payment"
    data = @{
        id = "123456789"
    }
    action = "payment.created"
} | ConvertTo-Json

try {
    $postResponse = Invoke-RestMethod -Uri "$NGROK_URL/api/payment-webhook" -Method Post -Body $webhookBody -ContentType "application/json" -Headers @{
        "ngrok-skip-browser-warning" = "true"
        "x-signature" = "test-signature"
        "x-request-id" = "test-request-id"
    }
    Write-Host "✅ POST funcionou:" -ForegroundColor Green
    Write-Host ($postResponse | ConvertTo-Json) -ForegroundColor Green
} catch {
    Write-Host "❌ Erro no POST: $_" -ForegroundColor Red
}

# 3. Teste de assinatura (preapproval)
Write-Host "`n3️⃣ Teste POST /api/payment-webhook (preapproval)" -ForegroundColor Yellow

$preapprovalBody = @{
    type = "preapproval"
    data = @{
        id = "abc123def456"
    }
    action = "preapproval.created"
} | ConvertTo-Json

try {
    $preapprovalResponse = Invoke-RestMethod -Uri "$NGROK_URL/api/payment-webhook" -Method Post -Body $preapprovalBody -ContentType "application/json" -Headers @{
        "ngrok-skip-browser-warning" = "true"
    }
    Write-Host "✅ Preapproval POST funcionou:" -ForegroundColor Green
    Write-Host ($preapprovalResponse | ConvertTo-Json) -ForegroundColor Green
} catch {
    Write-Host "❌ Erro no Preapproval POST: $_" -ForegroundColor Red
}

# 4. Teste de authorized_payment (cobrança recorrente)
Write-Host "`n4️⃣ Teste POST /api/payment-webhook (authorized_payment)" -ForegroundColor Yellow

$authorizedPaymentBody = @{
    type = "authorized_payment"
    data = @{
        id = "789xyz"
    }
    action = "authorized_payment.created"
} | ConvertTo-Json

try {
    $authorizedResponse = Invoke-RestMethod -Uri "$NGROK_URL/api/payment-webhook" -Method Post -Body $authorizedPaymentBody -ContentType "application/json" -Headers @{
        "ngrok-skip-browser-warning" = "true"
    }
    Write-Host "✅ Authorized Payment POST funcionou:" -ForegroundColor Green
    Write-Host ($authorizedResponse | ConvertTo-Json) -ForegroundColor Green
} catch {
    Write-Host "❌ Erro no Authorized Payment POST: $_" -ForegroundColor Red
}

Write-Host "`n✅ Testes concluídos!" -ForegroundColor Cyan
Write-Host "`n📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Se todos os testes passaram, configure o webhook no painel do Mercado Pago" -ForegroundColor White
Write-Host "2. Use a URL: $NGROK_URL/api/payment-webhook" -ForegroundColor White
Write-Host "3. Selecione os eventos: payment, authorized_payment, preapproval" -ForegroundColor White
Write-Host "`n🔗 Painel do MP: https://www.mercadopago.com.br/developers/panel/webhooks" -ForegroundColor Cyan
