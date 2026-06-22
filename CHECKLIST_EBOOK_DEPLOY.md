# 📖 CHECKLIST: Deploy do Ebook (Kit do Romeiro 2026)

## ✅ Passo 1: Variáveis de Ambiente

Adicione estas linhas ao seu `.env` em **produção**:

```
# ─────────────────────────────────────────────────────────────────────────────
# EBOOK — Kit do Romeiro 2026
# ─────────────────────────────────────────────────────────────────────────────
EBOOK_PRICE_CENTS=1990
SUPABASE_EBOOKS_BUCKET=ebooks
EBOOK_FILE_NAME=kit-romeiro-2026.pdf
```

## ✅ Passo 2: Verificar Bucket no Supabase

- [ ] Ir para Supabase Dashboard → Storage
- [ ] Verificar se existe bucket chamado `ebooks`
- [ ] Verificar se o arquivo `kit-romeiro-2026.pdf` está lá
- [ ] Se não existir, executar o setup script:
  ```bash
  cd server
  node scripts/setup-ebook.js
  ```

## ✅ Passo 3: Testar Rotas

### Em Desenvolvimento (localhost:5173):
```bash
# 1. Iniciar checkout
curl http://localhost:3001/api/ebook/create-checkout

# 2. Verificar sessão
curl http://localhost:3001/api/ebook/check-session?session_id=TEST_ID

# 3. Download (deve retornar 403 se não pago)
curl http://localhost:3001/api/ebook/download?session_id=TEST_ID
```

### Em Produção:
Substituir `localhost:3001` por seu domínio, ex:
```bash
curl https://aparecidadonortesp.com.br/api/ebook/download?session_id=TEST_ID
```

## ✅ Passo 4: Reiniciar Serviço

Após atualizar `.env`, reiniciar o backend:
```bash
# Em EC2/VPS
pm2 restart backend

# Ou Docker
docker restart seu-container-backend
```

## 🔍 Troubleshooting

### Erro: "API route not found"
- [ ] Verificar se rota está registrada: `app.use('/api/ebook', createEbookRouter())`
- [ ] Verificar se `.env` tem `SUPABASE_EBOOKS_BUCKET=ebooks`
- [ ] Testar com curl direto no servidor

### Erro: "Compra não encontrada"
- [ ] Normal! Significa que `session_id` é inválido ou a compra não foi criada no Stripe
- [ ] Fazer checkout completo primeiro

### Erro: "Signed URL não gerada"
- [ ] Verificar se bucket `ebooks` existe no Supabase
- [ ] Verificar se arquivo `kit-romeiro-2026.pdf` está no bucket
- [ ] Verificar permissões RLS do bucket

## 📝 Checklist de Deploy

- [ ] Variáveis de ambiente atualizadas
- [ ] Bucket `ebooks` criado no Supabase
- [ ] PDF enviado para bucket
- [ ] Backend reiniciado
- [ ] Testar rota `/api/ebook/create-checkout` (deve retornar `{ success: true, checkoutUrl }`
- [ ] Testar fluxo completo: checkout → sucesso → download

## 🚀 Próximas Melhorias

- [ ] Adicionar webhook para enviar email com link de download
- [ ] Implementar limite de downloads (ex: máximo 5 downloads por compra)
- [ ] Adicionar tracking de downloads nos eventos do Google Analytics
- [ ] Atualizar documentação de integração para parceiros
