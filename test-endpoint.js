// Teste simples do endpoint /api/create-subscription
const testData = {
  planTitle: "Plano Básico Teste",
  amount: 29.90,
  frequency: 1,
  frequency_type: "months",
  payer_email: "testuser7399@testuser.com"  // Email do comprador brasileiro real
};

console.log('🧪 Testando endpoint /api/create-subscription');
console.log('📤 Dados de teste:', JSON.stringify(testData, null, 2));

fetch('http://localhost:3001/api/create-subscription', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('📊 Status:', response.status);
  console.log('📊 Status Text:', response.statusText);
  return response.json();
})
.then(data => {
  console.log('✅ Resposta:', JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('❌ Erro no teste:', error);
});