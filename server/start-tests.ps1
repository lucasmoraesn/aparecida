# 🧪 SCRIPT DE TESTES AWS SES — Explore Aparecida
# 
# Uso:
#   .\start-tests.ps1
# 
# Ou execute os comandos individuais abaixo

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         🧪 AWS SES TEST SUITE - EXPLORE APARECIDA             ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Escolha um teste para executar:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1️⃣  Diagnosticar configuração AWS SES"
Write-Host "  2️⃣  Teste Interativo (menu com 4 opções)"
Write-Host "  3️⃣  Simular Pagamento Completo"
Write-Host "  4️⃣  Iniciar servidor + testes locais"
Write-Host "  5️⃣  Ver guia completo de testes"
Write-Host ""

$choice = Read-Host "Escolha (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "▶ npm run diagnose:ses" -ForegroundColor Green
        Write-Host ""
        npm run diagnose:ses
    }
    "2" {
        Write-Host ""
        Write-Host "▶ npm run test:ses" -ForegroundColor Green
        Write-Host ""
        npm run test:ses
    }
    "3" {
        Write-Host ""
        Write-Host "Digite o business_id (ou deixe em branco para exemplos):" -ForegroundColor Yellow
        $businessId = Read-Host "ID"
        
        if ([string]::IsNullOrWhiteSpace($businessId)) {
            Write-Host ""
            Write-Host "Exemplos de business_id:" -ForegroundColor Cyan
            Write-Host "  550e8400-e29b-41d4-a716-446655440000"
            Write-Host ""
            Write-Host "Execute novamente com: npm run test:payment '<id>'" -ForegroundColor Yellow
        } else {
            Write-Host ""
            Write-Host "▶ npm run test:payment" -ForegroundColor Green
            Write-Host ""
            npm run test:payment $businessId
        }
    }
    "4" {
        Write-Host ""
        Write-Host "Iniciando servidor local (npm run dev)..." -ForegroundColor Green
        Write-Host "O servidor estará disponível em: http://localhost:3001" -ForegroundColor Cyan
        Write-Host ""
        npm run dev
    }
    "5" {
        Write-Host ""
        Write-Host "Veja o arquivo: TEST_GUIDE.md" -ForegroundColor Green
        Write-Host ""
        Write-Host "Você pode abrir com:" -ForegroundColor Yellow
        Write-Host '  code TEST_GUIDE.md' -ForegroundColor Gray
        Write-Host ""
    }
    default {
        Write-Host ""
        Write-Host "❌ Opção inválida" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host ""
