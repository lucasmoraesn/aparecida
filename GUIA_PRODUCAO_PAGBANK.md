# 🚀 Guia: Deploy em Produção - PagBank

## ⚠️ PRÉ-REQUISITOS

Antes de colocar em produção, você PRECISA:

1. ✅ **Conta PagBank Verificada**
   - Documentos enviados e aprovados
   - Conta bancária vinculada
   - Acesse: https://pagseguro.uol.com.br/

2. ✅ **Domínio Próprio** (ou subdomínio)
   - Exemplo: `api.seusite.com`
   - Necessário para HTTPS

3. ✅ **Servidor com SSL**
   - PagBank exige HTTPS em produção
   - Certificado Let's Encrypt (grátis)

---

## 📋 PASSO A PASSO

### 1. Obter Token de Produção

1. Acesse: https://dev.pagseguro.uol.com.br/credentials
2. Selecione **"Produção"** (não Sandbox)
3. Clique em **"Gerar novo token"**
4. Copie o token (começa com algo diferente do sandbox)

⚠️ Se não conseguir gerar, sua conta ainda não foi aprovada.

---

### 2. Configurar Backend (.env)

Edite `server/.env`:

```env
# ============================================
# PAGBANK - PRODUÇÃO
# ============================================
PAGBANK_TOKEN=seu_token_de_producao_aqui
PAGBANK_BASE_URL=https://api.pagseguro.com
PAGBANK_WEBHOOK_SECRET=seu_secret_aqui

# ============================================
# SERVIDOR
# ============================================
NODE_ENV=production
PORT=3001

# ============================================
# DOMÍNIO DE PRODUÇÃO
# ============================================
PRODUCTION_DOMAIN=https://seu-dominio.com
```

---

### 3. Deploy do Backend

#### Opção A: Vercel (Mais Fácil) ✅

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Fazer deploy
cd server
vercel

# 3. Configurar variáveis de ambiente no painel Vercel
# Acesse: https://vercel.com/dashboard
# Settings > Environment Variables
# Adicione: PAGBANK_TOKEN, PAGBANK_BASE_URL, etc.
```

#### Opção B: Railway ✅

```bash
# 1. Criar conta em: https://railway.app/
# 2. Conectar com GitHub
# 3. Deploy automático do repositório
# 4. Adicionar variáveis de ambiente no painel
```

#### Opção C: VPS/DigitalOcean

```bash
# 1. Criar droplet Ubuntu
# 2. Instalar Node.js
# 3. Configurar Nginx com SSL (Let's Encrypt)
# 4. PM2 para gerenciar processo
# 5. Configurar .env
```

---

### 4. Configurar Webhook

1. Acesse: https://dev.pagseguro.uol.com.br/webhooks
2. Adicione URL: `https://sua-api.com/api/pagbank/webhook`
3. Copie o **Secret** gerado
4. Adicione ao `.env`: `PAGBANK_WEBHOOK_SECRET=secret_aqui`

---

### 5. Deploy do Frontend

```bash
# Build do frontend
npm run build

# Deploy (Vercel, Netlify, etc)
vercel --prod
```

Atualize `.env` do frontend:

```env
VITE_API_URL=https://sua-api-backend.com
```

---

## 🧪 TESTAR EM PRODUÇÃO

### ⚠️ IMPORTANTE: Você será cobrado de verdade!

**Teste 1: Pagamento Pequeno**

Use seu próprio cartão e faça um pagamento de **R$ 1,00** para testar.

```javascript
// Dados do teste
Email: seu-email@real.com
Nome: Seu Nome Real
CPF: Seu CPF Real
Cartão: Seu Cartão Real
Valor: R$ 1,00
```

**Verifique:**
- ✅ Pagamento processado com sucesso
- ✅ Dinheiro aparece no seu PagBank
- ✅ Webhook recebido (se configurado)
- ✅ Dados salvos no Supabase

---

## 💰 TAXAS DO PAGBANK

| Método | Taxa |
|--------|------|
| **Cartão de Crédito** | ~3% a 4% |
| **Débito** | ~2% a 3% |
| **PIX** | ~1% a 2% |

**Exemplo:**
- Venda: R$ 100,00
- Taxa (3%): R$ 3,00
- Você recebe: R$ 97,00

---

## 🔒 SEGURANÇA

### ✅ O que já está implementado:

- ✅ HTTPS obrigatório
- ✅ Verificação de assinatura HMAC
- ✅ Logs sanitizados (sem PAN/CVV)
- ✅ CORS restritivo
- ✅ Validação de dados

### 🔧 Recomendado adicionar:

- Rate limiting (limitar requisições por IP)
- Monitoramento (Sentry, Datadog)
- Backup automático do banco
- Logs centralizados

---

## 📊 MONITORAMENTO

### Verificar após deploy:

1. **Logs do servidor**
   ```bash
   # Ver logs em tempo real
   vercel logs --follow
   ```

2. **Dashboard PagBank**
   - https://pagseguro.uol.com.br/
   - Ver transações em tempo real

3. **Supabase**
   - Ver registros salvos
   - Monitorar queries

---

## 🆘 TROUBLESHOOTING

### Erro: "Invalid API key"
- ✅ Verifique se está usando token de PRODUÇÃO
- ✅ Token não expirou
- ✅ Conta PagBank está ativa

### Erro: "HTTPS required"
- ✅ Certifique-se que servidor usa HTTPS
- ✅ Certificado SSL válido

### Pagamento não aparece
- ✅ Aguarde alguns minutos
- ✅ Verifique webhook configurado
- ✅ Veja logs do PagBank

---

## 📞 SUPORTE

**PagBank:**
- Portal: https://dev.pagseguro.uol.com.br/
- Documentação: https://dev.pagseguro.uol.com.br/reference/
- Suporte: através do portal

---

## ✅ CHECKLIST FINAL

Antes de ir para produção:

- [ ] Token de produção obtido
- [ ] HTTPS configurado
- [ ] SSL válido
- [ ] Webhook configurado
- [ ] Variáveis de ambiente atualizadas
- [ ] Teste com R$ 1,00 bem-sucedido
- [ ] Backup do banco configurado
- [ ] Monitoramento ativo
- [ ] Logs sanitizados verificados
- [ ] CORS configurado para domínio correto

---

**Boa sorte! 🚀**
