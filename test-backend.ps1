# ============================================================================
# TESTE AUTOMATIZADO: Backend Hotels/Restaurantes
# Windows PowerShell 5.1+
# ============================================================================
# Uso: .\test-backend.ps1 -Type hotels -Email hotel@test.com
# ============================================================================

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('hotels', 'restaurantes')]
    [string]$Type,
    
    [Parameter(Mandatory=$true)]
    [string]$Email,
    
    [string]$ApiBase = "http://localhost:3001",
    [string]$AdminPassword = "admin123"
)

$ErrorActionPreference = "Stop"

# ─────────────────────────────────────────────────────────
# FUNÇÕES AUXILIARES
# ─────────────────────────────────────────────────────────

function Log {
    param([string]$Message, [string]$Level = "INFO")
    $colors = @{
        "INFO"    = "Cyan"
        "SUCCESS" = "Green"
        "ERROR"   = "Red"
        "WARN"    = "Yellow"
    }
    Write-Host "[$Level] $Message" -ForegroundColor $colors[$Level]
}

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Uri,
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [string]$TestName
    )
    
    Log "🧪 $TestName" "INFO"
    
    try {
        $params = @{
            Method      = $Method
            Uri         = $Uri
            Headers     = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params["Body"] = $Body | ConvertTo-Json -Depth 10
        }
        
        $response = Invoke-RestMethod @params
        Log "✅ Sucesso" "SUCCESS"
        return $response
    }
    catch {
        Log "❌ Erro: $($_.Exception.Message)" "ERROR"
        return $null
    }
}

# ─────────────────────────────────────────────────────────
# TESTES
# ─────────────────────────────────────────────────────────

Clear-Host
Log "════════════════════════════════════════════════════"
Log "TESTE: Backend $($Type.ToUpper())" "INFO"
Log "════════════════════════════════════════════════════"
Log "API Base: $ApiBase"
Log "Email: $Email"
Log ""

# ─────────────────────────────────────────────────────────
# 1. CRIAR SESSÃO STRIPE
# ─────────────────────────────────────────────────────────

$PriceMap = @{
    "hotels"       = "price_1TK30uJRpc53eVmKbuPx37LJ"
    "restaurantes" = "price_1TK32IJRpc53eVmKZ5G4rC0X"
}

$PriceId = $PriceMap[$Type]
$CreateCheckoutUri = "$ApiBase/api/create-$Type-subscription"

$checkoutBody = @{
    priceId     = $PriceId
    successUrl  = "$ApiBase/cadastro-sucesso?type=$Type&session_id={CHECKOUT_SESSION_ID}"
    cancelUrl   = "$ApiBase/planos-$Type"
}

$checkoutResponse = Test-Endpoint -Method "POST" -Uri $CreateCheckoutUri `
    -Body $checkoutBody -TestName "1. Criar Stripe Checkout"

if (-not $checkoutResponse) {
    Log "Não foi possível criar sessão. Verifique:" "ERROR"
    Log "  - Price ID está correto: $PriceId" "WARN"
    Log "  - Stripe keys estão configuradas" "WARN"
    exit 1
}

$checkoutUrl = $checkoutResponse.checkoutUrl
Log "   Checkout URL: $checkoutUrl" "INFO"
Log ""
Log "📝 Abra a URL acima no navegador e complete o pagamento com:" "WARN"
Log "   Cartão: 4242 4242 4242 4242" "WARN"
Log "   Data: qualquer data futura" "WARN"
Log "   CVC: qualquer 3 dígitos" "WARN"
Log ""

$sessionId = Read-Host "Cole o session_id da URL de sucesso (cs_test_...)"

if ([string]::IsNullOrWhiteSpace($sessionId)) {
    Log "Session ID vazio!" "ERROR"
    exit 1
}

Log ""

# ─────────────────────────────────────────────────────────
# 2. VERIFICAR SESSÃO
# ─────────────────────────────────────────────────────────

$checkSessionUri = "$ApiBase/api/check-session?session_id=$sessionId&type=$Type"

$sessionCheck = Test-Endpoint -Method "GET" -Uri $checkSessionUri `
    -TestName "2. Verificar Sessão Stripe"

if (-not $sessionCheck) {
    Log "Sessão não verificada. Verificar:" "ERROR"
    Log "  - Session ID está correto" "WARN"
    exit 1
}

Log "   Status: $($sessionCheck.session.payment_status)" "INFO"
Log ""

# ─────────────────────────────────────────────────────────
# 3. REGISTRAR NEGÓCIO
# ─────────────────────────────────────────────────────────

$businessName = if ($Type -eq "hotels") { "Hotel Teste" } else { "Restaurante Teste" }
$businessData = @{
    nome        = $businessName
    whatsapp    = "5512987654321"
    telefone    = "5512987654321"
    email       = $Email
    endereco    = "Rua Teste, 123 - Aparecida SP"
    cidades     = @("Aparecida", "Guaratinguetá")
    descricao   = "Teste de registro padronizado"
}

$registerUri = "$ApiBase/api/register-$Type"

Log "🧪 3. Registrar $businessName" "INFO"

try {
    $multipart = @{
        sessionId    = $sessionId
        businessData = ($businessData | ConvertTo-Json)
    }
    
    # PowerShell 7+ com -Form
    $registerResponse = Invoke-RestMethod -Method "POST" -Uri $registerUri `
        -Form $multipart -ErrorAction Stop
    
    Log "✅ Sucesso" "SUCCESS"
    
    $registeredId = $registerResponse.($Type).id
    Log "   ID registrado: $registeredId" "INFO"
}
catch {
    Log "❌ Erro: $($_.Exception.Message)" "ERROR"
    exit 1
}

Log ""

# ─────────────────────────────────────────────────────────
# 4. LISTAR PENDENTES (ADMIN)
# ─────────────────────────────────────────────────────────

$headers = @{
    "x-admin-password" = $AdminPassword
}

$pendingUri = "$ApiBase/api/admin/$Type-pendentes"

$pendingList = Test-Endpoint -Method "GET" -Uri $pendingUri `
    -Headers $headers -TestName "4. Listar $Type Pendentes"

if ($pendingList) {
    Log "   Encontrados: $($pendingList.registros.Count)" "INFO"
    Log ""
}

# ─────────────────────────────────────────────────────────
# 5. APROVAR
# ─────────────────────────────────────────────────────────

$approveUri = "$ApiBase/api/admin/aprovar-$Type"
$approveBody = @{
    id = $registeredId
}

$approve = Test-Endpoint -Method "POST" -Uri $approveUri `
    -Headers $headers -Body $approveBody -TestName "5. Aprovar"

Log ""

# ─────────────────────────────────────────────────────────
# 6. LISTAR ATIVOS (ADMIN)
# ─────────────────────────────────────────────────────────

$activeUri = "$ApiBase/api/admin/$Type-ativos"

$activeList = Test-Endpoint -Method "GET" -Uri $activeUri `
    -Headers $headers -TestName "6. Listar $Type Ativos"

if ($activeList) {
    Log "   Encontrados: $($activeList.registros.Count)" "INFO"
}

Log ""

# ─────────────────────────────────────────────────────────
# 7. API PÚBLICA
# ─────────────────────────────────────────────────────────

$publicUri = "$ApiBase/api/$Type"

$publicList = Test-Endpoint -Method "GET" -Uri $publicUri `
    -TestName "7. Listar $Type Públicos (Visitante)"

if ($publicList) {
    Log "   Encontrados: $($publicList.$Type.Count)" "INFO"
    $found = $publicList.$Type | Where-Object { $_.id -eq $registeredId }
    if ($found) {
        Log "✅ Registro aparece na lista pública!" "SUCCESS"
    }
    else {
        Log "❌ Registro NÃO aparece na lista pública" "ERROR"
    }
}

Log ""
Log "════════════════════════════════════════════════════"
Log "✅ TESTES CONCLUÍDOS" "SUCCESS"
Log "════════════════════════════════════════════════════"
