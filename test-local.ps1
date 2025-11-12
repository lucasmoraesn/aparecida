$body = @{
    plan_id = "b6192eba-cf12-4bbf-bd91-686d961b1f13"
    establishment_name = "Estabelecimento Teste"
    category = "restaurant"
    address = "Rua Teste, 123"
    location = "São Paulo, SP"
    whatsapp = "11987654321"
    phone = "11987654321"
    description = "Teste de pagamento"
    payer_email = "joao@exemplo.com"
    card_number = "4111111111111111"
    card_exp_month = "12"
    card_exp_year = "2030"
    card_security_code = "123"
    card_holder_name = "JOAO SILVA"
    card_holder_tax_id = "12345678909"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3001/api/register-business" -Method Post -Body $body -ContentType "application/json"
$response | ConvertTo-Json -Depth 5
