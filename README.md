# Integração Mercado Pago - Pagamento Avulso e Assinaturas (Preapproval)

## Como rodar

```sh
# Backend
cp server/.env.example server/.env  # preencher MP_ACCESS_TOKEN (VENDEDOR de teste)
npm run dev --prefix server

# ngrok (em outro terminal)
ngrok http 3001

# Frontend
cp .env.local.example .env.local    # preencher VITE_PUBLIC_URL_NGROK com a URL do ngrok
npm run dev
```

## Webhook

Configurar webhook no painel do Mercado Pago (Developers → Webhooks):

- URL: https://SEU_SUBDOMINIO.ngrok-free.app/api/webhook

## Teste de assinatura via PowerShell

```powershell
Invoke-RestMethod -Method POST -Uri "https://SEU_SUBDOMINIO.ngrok-free.app/api/create-subscription" -Headers @{ "Content-Type" = "application/json" } -Body '{"planTitle":"Plano Profissional","amount":49,"frequency":1,"frequency_type":"months","payer_email":"COMPRADOR_TESTE@email.com"}'
```

Abra o `init_point` retornado e autorize. Você será redirecionado para http://localhost:5173/sucesso.

## Observações

- MP_ACCESS_TOKEN = vendedor (teste)
- payer_email = comprador (teste)
- Webhooks: preapproval para status de assinatura; authorized_payment para cada cobrança.

## Exemplo de uso no front

```ts
import { iniciarAssinatura } from "@/lib/assinatura";
// ...
async function onAssinar(plano: { titulo: string; preco: number }, payerEmail: string) {
  await iniciarAssinatura({
    planTitle: plano.titulo,
    amount: plano.preco,
    payer_email: payerEmail,
  });
}
```
