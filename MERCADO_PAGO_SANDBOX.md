# 🚀 Guia Completo: Mercado Pago Checkout Pro (Sandbox)

Este documento contém todas as instruções para configurar e testar o **Mercado Pago Checkout Pro** em modo **Sandbox**.

---

## 📋 Índice

1. [Criar Conta de Teste](#1-criar-conta-de-teste)
2. [Obter Credenciais](#2-obter-credenciais)
3. [Configurar Variáveis de Ambiente](#3-configurar-variáveis-de-ambiente)
4. [Configurar Webhook com ngrok](#4-configurar-webhook-com-ngrok)
5. [Testar Pagamento](#5-testar-pagamento)
6. [Cartões de Teste](#6-cartões-de-teste)
7. [Validar Webhook](#7-validar-webhook)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Criar Conta de Teste

### Passo 1: Acesse o Dashboard do Mercado Pago
1. Faça login em: https://www.mercadopago.com.br/developers/panel
2. Navegue até **Suas aplicações** → selecione sua aplicação
3. Vá em **Contas de teste** no menu lateral

### Passo 2: Criar Vendedor e Comprador de Teste
```
Vendedor (Seller): Para receber pagamentos
- Email: test_user_12345678@testuser.com (gerado automaticamente)
- Senha: qatest1234

Comprador (Buyer): Para fazer compras
- Email: test_user_87654321@testuser.com (gerado automaticamente)  
- Senha: qatest1234
```

**⚠️ IMPORTANTE:** Sempre use as credenciais do **vendedor** no backend e o email do **comprador** no frontend.

---

## 2. Obter Credenciais

### Access Token (Backend)
1. Faça login com a conta de **vendedor de teste**
2. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
3. Vá em **Credenciais de teste**
4. Copie o **Access Token**

```
Exemplo:
TEST-1234567890123456-010100-abcdef1234567890abcdef1234567890-123456789
```

### Public Key (Frontend - Opcional)
Se precisar usar o SDK no frontend:
```
Exemplo:
TEST-abc123-010100-def456-ghi789
```

---

## 3. Configurar Variáveis de Ambiente

### Backend (`server/.env`)
```env
# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=TEST-1234567890123456-010100-abcdef1234567890abcdef1234567890-123456789

# URL pública (ngrok ou similar) para webhooks
PUBLIC_URL_NGROK=https://seu-dominio.ngrok-free.app

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua_service_role_key_aqui

# Servidor
PORT=3001
```

### Frontend (`.env.local`)
```env
# Mercado Pago
VITE_MERCADO_PAGO_PUBLIC_KEY=TEST-abc123-010100-def456-ghi789

# URL pública (ngrok ou similar) - usada para back_urls
VITE_PUBLIC_URL_NGROK=https://seu-dominio.ngrok-free.app

# URL da API backend
VITE_API_URL=http://localhost:3001
```

---

## 4. Configurar Webhook com ngrok

### Passo 1: Instalar ngrok
```bash
# Windows (via Chocolatey)
choco install ngrok

# Ou baixe direto: https://ngrok.com/download
```

### Passo 2: Iniciar túnel ngrok
```bash
ngrok http 3001
```

**Output esperado:**
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3001
```

### Passo 3: Atualizar variáveis de ambiente
Copie a URL `https://abc123.ngrok-free.app` e atualize:
- `PUBLIC_URL_NGROK` no `server/.env`
- `VITE_PUBLIC_URL_NGROK` no `.env.local`

### Passo 4: Reiniciar servidor backend
```bash
cd server
npm run dev
```

---

## 5. Testar Pagamento

### Fluxo Completo
```
1. Usuário preenche formulário de cadastro
2. Escolhe plano e vai para página de pagamento
3. Frontend chama POST /api/create-preference
4. Backend retorna init_point (URL do checkout)
5. Frontend redireciona: window.location.href = init_point
6. Usuário completa pagamento no Mercado Pago
7. MP envia notificação para /api/payment-webhook
8. Backend atualiza status no Supabase
9. Usuário é redirecionado para página de sucesso
```

### Teste Manual
1. Acesse: http://localhost:5173/cadastrar-negocio
2. Preencha o formulário
3. Escolha um plano
4. Clique em "Criar Pagamento"
5. Você será redirecionado para o checkout do MP
6. Use um dos **cartões de teste** (ver seção abaixo)

---

## 6. Cartões de Teste

### 🟢 Pagamento Aprovado
```
Cartão: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: APRO (deve ser exatamente "APRO")
CPF: Qualquer válido
```

### 🔴 Pagamento Recusado
```
Cartão: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: OCHO (deve ser exatamente "OCHO")
```

### ⏸️ Pagamento Pendente
```
Cartão: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: CONT (deve ser exatamente "CONT")
```

**⚠️ IMPORTANTE:** O nome do titular determina o status do pagamento no sandbox!

---

## 7. Validar Webhook

### Verificar logs do servidor
Após fazer um pagamento, você deve ver no terminal do backend:
```
📩 Webhook recebido do Mercado Pago: { type: 'payment', data: { id: '123456789' } }
💳 Detalhes do pagamento: { id: 123456789, status: 'approved', ... }
✅ Status do pedido ABC123 atualizado para: approved
```

### Verificar Supabase
1. Acesse: https://app.supabase.com
2. Vá em **Table Editor** → `business_registrations`
3. Verifique se o campo `payment_status` foi atualizado para `approved`

### Testar webhook manualmente (opcional)
```bash
# Via PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/payment-webhook" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"type":"payment","data":{"id":"123456789"}}'
```

---

## 8. Troubleshooting

### ❌ Erro: "Credenciais do Mercado Pago Sandbox não configuradas"
**Solução:** Verifique se `VITE_MERCADO_PAGO_PUBLIC_KEY` está definido no `.env.local`

### ❌ Webhook não está sendo chamado
**Possíveis causas:**
1. ngrok não está rodando → rode `ngrok http 3001`
2. URL do ngrok não foi atualizada nas variáveis de ambiente
3. Servidor backend não está rodando

**Solução:** Certifique-se de que:
```bash
# Terminal 1: ngrok
ngrok http 3001

# Terminal 2: Backend
cd server
npm run dev

# Terminal 3: Frontend
npm run dev
```

### ❌ Pagamento não atualiza no Supabase
**Verificar:**
1. Logs do servidor backend (deve aparecer o webhook)
2. Se `external_reference` foi enviado corretamente
3. Se `SUPABASE_SERVICE_KEY` está correta no `server/.env`

### ❌ Redirecionamento não funciona
**Verificar:**
1. Se `init_point` foi retornado pela API
2. Se `VITE_PUBLIC_URL_NGROK` está correta no `.env.local`
3. Console do navegador para erros

---

## 🎯 Checklist Final

Antes de fazer o deploy em produção:

- [ ] Testar pagamento aprovado com cartão APRO
- [ ] Testar pagamento recusado com cartão OCHO
- [ ] Validar que webhook atualiza Supabase
- [ ] Verificar página de sucesso após pagamento
- [ ] Verificar página de falha após recusa
- [ ] Testar em diferentes navegadores
- [ ] Verificar logs do servidor (sem erros)
- [ ] Verificar logs do ngrok (webhook recebido)

---

## 📚 Documentação Oficial

- [Checkout Pro - Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing)
- [Contas de teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards)
- [Webhooks](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/your-integrations/notifications/webhooks)

---

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs do servidor backend
2. Verifique o console do navegador
3. Consulte a [documentação oficial](https://www.mercadopago.com.br/developers)
4. Revise este guia completamente

---

**Última atualização:** Novembro 2025
