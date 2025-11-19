Write-Output "🔍 CAPTURANDO JSON DA PREFERENCE PARA SUPORTE MP"
Write-Output ""

$sub = '{"planId":"8f0ec576-9c7d-46d2-b60e-e084ae3769e6","businessId":"1a53c789-f562-47a8-a46b-a9929e173f2e","customer":{"email":"test_user_7399030955017435892@testuser.com","name":"Comprador Teste","tax_id":"12345678909"}}'

Write-Output "Criando preference..."
$r = Invoke-RestMethod -Uri "http://localhost:3001/api/create-subscription" -Method POST -Body $sub -ContentType "application/json"

Write-Output ""
Write-Output "✅ Preference criada!"
Write-Output ""
Write-Output "🔗 Link: $($r.init_point)"
Write-Output ""
Write-Output "📋 Agora verifique o terminal do servidor (onde está rodando 'node index.js')"
Write-Output "   Procure pela seção 'JSON PARA ENVIAR AO SUPORTE DO MP'"
Write-Output "   Copie todo o JSON que aparece entre as linhas ========"
Write-Output ""
Write-Output "💡 DICA: O JSON já está formatado e pronto para copiar!"
