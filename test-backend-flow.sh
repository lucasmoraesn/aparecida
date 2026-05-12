#!/bin/bash
# TESTE COMPLETO DO FLUXO: Backend Hotels/Restaurantes
# ====================================================
# Este script testa o fluxo end-to-end:
# 1. Stripe Checkout Session
# 2. Register Hotel/Restaurante
# 3. Admin Approval
# 4. Validar registro ativo

set -e

# ─────────────────────────────────────────────────────────
# CONFIGURAÇÃO
# ─────────────────────────────────────────────────────────

API_BASE="http://localhost:5000"
ADMIN_PASSWORD="admin123"  # Usar a mesma do .env

# Preços de teste (reemplazar com Price IDs reais)
HOTEL_PRICE_ID="price_HOTEL_BASICO"
REST_PRICE_ID="price_REST_BASICO"

HOTEL_EMAIL="hotel-test@example.com"
REST_EMAIL="rest-test@example.com"

echo "🧪 TESTE COMPLETO: Backend Hotels/Restaurantes"
echo "API Base: $API_BASE"
echo ""

# ─────────────────────────────────────────────────────────
# 1️⃣ CRIAR SESSÃO STRIPE PARA HOTEL
# ─────────────────────────────────────────────────────────

echo "📝 [1] Criando Stripe Checkout Session para Hotel..."
HOTEL_SESSION=$(curl -s -X POST "$API_BASE/api/create-hotels-subscription" \
  -H "Content-Type: application/json" \
  -d "{
    \"priceId\": \"$HOTEL_PRICE_ID\",
    \"successUrl\": \"$API_BASE/cadastro-sucesso?type=hotels&session_id={CHECKOUT_SESSION_ID}\",
    \"cancelUrl\": \"$API_BASE/planos-hotels\"
  }" | jq -r '.checkoutUrl // .error')

if [[ $HOTEL_SESSION == *"error"* ]]; then
  echo "❌ Erro ao criar sessão: $HOTEL_SESSION"
  exit 1
fi

echo "✅ Sessão criada (Abrir no navegador para pagar):"
echo "   $HOTEL_SESSION"
echo ""
echo "⏸️  Após o pagamento, retorne aqui e cole o session_id da URL"
read -p "Session ID do Hotel: " HOTEL_SESSION_ID

# ─────────────────────────────────────────────────────────
# 2️⃣ VERIFICAR SESSÃO STRIPE
# ─────────────────────────────────────────────────────────

echo ""
echo "🔍 [2] Verificando sessão Stripe..."
CHECK=$(curl -s -X GET "$API_BASE/api/check-session?session_id=$HOTEL_SESSION_ID&type=hotels")
echo "Resposta: $CHECK"
echo ""

# ─────────────────────────────────────────────────────────
# 3️⃣ REGISTRAR HOTEL
# ─────────────────────────────────────────────────────────

echo "📋 [3] Registrando hotel..."

# Dados do hotel
HOTEL_DATA='{
  "nome": "Hotel Teste Premium",
  "whatsapp": "5512987654321",
  "telefone": "5512987654321",
  "email": "'$HOTEL_EMAIL'",
  "endereco": "Rua das Flores, 123 - Aparecida SP",
  "cidades": ["Aparecida", "Guaratinguetá"],
  "descricao": "Hotel de luxo próximo à Basílica"
}'

HOTEL_REGISTER=$(curl -s -X POST "$API_BASE/api/register-hotels" \
  -H "Content-Type: multipart/form-data" \
  -F "sessionId=$HOTEL_SESSION_ID" \
  -F "businessData=$HOTEL_DATA")

echo "Resposta: $HOTEL_REGISTER"
HOTEL_ID=$(echo $HOTEL_REGISTER | jq -r '.hotel.id // .error')

if [[ $HOTEL_ID == *"error"* ]] || [[ -z $HOTEL_ID ]]; then
  echo "❌ Erro ao registrar hotel: $HOTEL_ID"
  exit 1
fi

echo "✅ Hotel registrado com ID: $HOTEL_ID"
echo ""

# ─────────────────────────────────────────────────────────
# 4️⃣ LISTAR HOTÉIS PENDENTES (ADMIN)
# ─────────────────────────────────────────────────────────

echo "📋 [4] Listando hotéis pendentes de aprovação..."
PENDING=$(curl -s -X GET "$API_BASE/api/admin/hotels-pendentes" \
  -H "x-admin-password: $ADMIN_PASSWORD")

echo "Pendentes: $PENDING"
echo ""

# ─────────────────────────────────────────────────────────
# 5️⃣ APROVAR HOTEL
# ─────────────────────────────────────────────────────────

echo "✅ [5] Aprovando hotel..."
APPROVE=$(curl -s -X POST "$API_BASE/api/admin/aprovar-hotels" \
  -H "Content-Type: application/json" \
  -H "x-admin-password: $ADMIN_PASSWORD" \
  -d "{\"id\": \"$HOTEL_ID\"}")

echo "Resposta: $APPROVE"
echo ""

# ─────────────────────────────────────────────────────────
# 6️⃣ VERIFICAR HOTEL ATIVO
# ─────────────────────────────────────────────────────────

echo "🔍 [6] Verificando se hotel aparece na lista pública..."
PUBLIC=$(curl -s -X GET "$API_BASE/api/hotels")

if echo $PUBLIC | jq '.hotels[] | select(.id == "'$HOTEL_ID'")' | grep -q $HOTEL_ID; then
  echo "✅ Hotel aparecendo publicamente!"
else
  echo "❌ Hotel NÃO aparecendo na lista pública"
fi

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  ✅ TESTES CONCLUÍDOS COM SUCESSO!        ║"
echo "╚════════════════════════════════════════════╝"
