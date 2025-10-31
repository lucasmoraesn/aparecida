# 🚀 Configuração Rápida do Mercado Pago Sandbox

## ✅ O que já foi implementado:

1. ✅ **Serviço MercadoPagoSandboxService** criado
2. ✅ **Página de pagamento atualizada** para Sandbox
3. ✅ **Dependência mercadopago** instalada
4. ✅ **Guia completo** criado (MERCADO_PAGO_SANDBOX_SETUP.md)

## 🔧 Próximos passos para você:

### 1. Configurar arquivo `.env.local`:

Crie o arquivo `.env.local` na raiz do projeto com:

```env
# Supabase Configuration
SUPABASE_PASSWORD=@Varredor27@@
SUPABASE_URL=https://rhkwickoweflamflgzeo.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoa3dpY2tvd2VmbGFtZmxnemVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjIyODMsImV4cCI6MjA3MDMzODI4M30.Pz7Vsh0HQL17g-CRWJD7CHrX_KzN4YYFl57XxxNjJUQ

# Mercado Pago Sandbox Configuration
VITE_MERCADO_PAGO_ACCESS_TOKEN=APP_USR-4608108578465711-101014-7a20dddc6a29e8ba910afa03de6da1d9-2631380670
VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR-bb931ba5-fd10-4522-b446-6073b7aacff1

# Vite Environment Variables
VITE_SUPABASE_URL=https://rhkwickoweflamflgzeo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoa3dpY2tvd2VmbGFtZmxnemVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjIyODMsImV4cCI6MjA3MDMzODI4M30.Pz7Vsh0HQL17g-CRWJD7CHrX_KzN4YYFl57XxxNjJUQ

# Admin Email
VITE_ADMIN_EMAIL=admin@aparecida.com

# Ngrok URL (substitua pela sua URL)
VITE_NGROK_URL=https://sua-url-ngrok.ngrok.io
```

### 2. Obter credenciais do Sandbox:

1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Selecione "Sandbox"
3. Copie o **Access Token** e **Public Key**
4. Substitua no `.env.local` (novo formato `APP_USR`)

### 3. Configurar Ngrok:

```bash
# Instalar Ngrok (se não tiver)
npm install -g ngrok

# Expor o projeto
ngrok http 5173

# Copiar a URL gerada e atualizar VITE_NGROK_URL no .env.local
```

### 4. Testar o fluxo:

1. **Iniciar o projeto:**
   ```bash
   npm run dev
   ```

2. **Acessar:** `http://localhost:5173/cadastrar-negocio`

3. **Preencher formulário** e selecionar plano

4. **Clicar em "Finalizar Cadastro e Pagar"**

5. **Escolher método:**
   - **Checkout Mercado Pago**: Redireciona para página completa
   - **PIX**: Gera código QR

6. **Usar dados de teste:**
   - Email: `test_user_123456@testuser.com`
   - CPF: `12345678909`
   - Cartão: `5031 4332 1540 6351` (CVV: 123, Validade: 11/25)

## 🎯 Dados de teste do Sandbox:

**Comprador de teste:**
- Email: `test_user_123456@testuser.com`
- CPF: `12345678909`

**Cartões de teste:**
- Mastercard: `5031 4332 1540 6351`
- Visa: `4509 9535 6623 3704`
- CVV: `123`
- Data: `11/25`

## 🚨 Solução de problemas:

### Botão não funciona:
1. Verificar console do navegador (F12)
2. Confirmar se `.env.local` está na raiz
3. Reiniciar o servidor após criar `.env.local`

### Erro de credenciais:
1. Verificar se as credenciais começam com `APP_USR` (novo formato)
2. Confirmar se estão no painel Sandbox
3. Verificar se não há espaços extras

### Erro de CORS:
1. Usar Ngrok para URL pública
2. Verificar se `VITE_NGROK_URL` está configurado

## 📞 Suporte:

Se encontrar problemas, verifique:
1. Console do navegador (F12)
2. Terminal onde o projeto está rodando
3. Guia completo em `MERCADO_PAGO_SANDBOX_SETUP.md`

---

**🎉 Com essa configuração, seu sistema de pagamento Sandbox estará funcionando!**

