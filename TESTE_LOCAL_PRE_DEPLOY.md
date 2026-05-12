# GUIA DE TESTE LOCAL - Antes do Deploy

## 🎯 Objetivo
Testar a aplicação localmente (como será na EC2) ANTES de fazer deploy real.

---

## 📋 Pré-requisitos
- Node.js 18+ instalado
- npm 9+ instalado
- Supabase URL e credenciais prontos
- Stripe keys prontos

---

## ⚡ TESTE RÁPIDO (5 minutos)

### Terminal 1: Preparar Backend
```bash
# Navegar para pasta backend
cd c:\projetos\aparecida\server

# Criar arquivo .env.test (cópia de credenciais)
copy .env.example .env.test

# Editar .env.test com valores REAIS
notepad .env.test

# Adicionar:
SUPABASE_URL=sua_url_aqui
SUPABASE_SERVICE_KEY=sua_chave_aqui
STRIPE_SECRET_KEY=sk_live_xxx
NODE_ENV=production
PORT=3001
```

### Terminal 2: Iniciar Backend
```bash
cd c:\projetos\aparecida\server

# Instalar (se não tiver):
npm install

# Rodar em produção local
set NODE_ENV=production
node index.js

# Ou usar dotenv:
npx dotenv -e .env.test node index.js
```

**Resultado esperado:**
```
✅ Aparecida Backend running on port 3001
✅ Supabase connected
```

### Terminal 3: Testar Backend
```bash
# Testar se está respondendo
curl http://localhost:3001

# Testar rota de health
curl http://localhost:3001/health

# Testar API de produtos
curl http://localhost:3001/products
```

### Terminal 4: Iniciar Frontend
```bash
cd c:\projetos\aparecida

# Instalar se não tiver:
npm install

# Build para produção
npm run build

# Servir build (preview)
npm run preview
```

**Resultado esperado:**
```
  > Local:   http://localhost:4173/
  > press h to show help
```

### Browser: Testar tudo
1. Abrir http://localhost:4173
2. Ver se página carrega
3. Checar console (F12) se tem erros
4. Testar funcionalidades:
   - Carregar produtos
   - Clicar em botões
   - Fazer busca
   - Submeter formulário

---

## 🧪 TESTE COMPLETO (15 minutos)

### Teste 1: Frontend carrega
```
✅ http://localhost:4173 carrega sem erro
✅ F12 Console não tem erros vermelhos
✅ Página responsiva (testar mobile com F12 → device mode)
```

### Teste 2: Backend conecta ao Supabase
```bash
# Na pasta server com .env.test preenchido:
node index.js

# Verificar que conectou ao Supabase
# (deve estar nos logs sem erro de ECONNREFUSED)
```

### Teste 3: API endpoints funcionam
```bash
# Terminal novo:
curl -X GET http://localhost:3001/health -H "Content-Type: application/json"

# Deve retornar:
# {"status":"ok","timestamp":"..."}
```

### Teste 4: Frontend consegue fazer requisição API
```bash
# No console do browser (http://localhost:4173):
fetch('http://localhost:4173/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

**Resultado esperado:**
```
✅ Resposta do backend chega no frontend
✅ JSON é parseado corretamente
```

### Teste 5: Banco de dados conecta
```bash
# Fazer requisição que acessa banco:
curl http://localhost:3001/products

# Deve retornar array de produtos ou lista vazia (sem erro)
```

### Teste 6: Emails podem ser enviados (opcional)
```bash
# Se configurou SES, testar:
curl -X POST http://localhost:3001/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"seu-email@test.com"}'

# Deve receber email de teste
```

### Teste 7: Stripe webhook mock
```bash
# Se quer testar Stripe:
curl -X POST http://localhost:3001/stripe-webhook \
  -H "Content-Type: application/json" \
  -H "stripe-signature: test" \
  -d '{"type":"payment_intent.succeeded"}'

# Deve processar sem erro
```

---

## ✅ CHECKLIST DE TESTES

- [ ] Frontend carrega em http://localhost:4173
- [ ] Backend responde em http://localhost:3001
- [ ] /api/health retorna 200 OK
- [ ] Nenhum erro no console (F12)
- [ ] Supabase conecta (verificar logs)
- [ ] Endpoints /api/* funcionam
- [ ] Database queries retornam dados
- [ ] Não há CORS errors
- [ ] Não há erros de certificado SSL (local não precisa)
- [ ] Página responsiva em mobile

---

## 🐛 TROUBLESHOOTING TESTE LOCAL

### ❌ "ECONNREFUSED pada 3001"
```bash
# Backend não iniciou

# Solução:
1. Verificar se Node.js instalado: node --version
2. Verificar se .env.test preenchido: cat server/.env.test
3. Ver erro completo: node server/index.js (sem dotenv)
4. Porta 3001 ocupada? lsof -i :3001
```

### ❌ "CORS error"
```bash
# Frontend em :4173 não consegue acessar backend em :3001

# Verificar backend logs se CORS está configurado:
# No arquivo server/index.js, deve ter:
# app.use(cors())
```

### ❌ "Cannot find module 'supabase'"
```bash
# Dependências não instaladas

# Solução:
cd server
npm install
```

### ❌ "Cannot connect to Supabase"
```bash
# SUPABASE_URL ou SUPABASE_SERVICE_KEY errados

# Verificar:
cat server/.env.test | grep SUPABASE

# Obter valores corretos do dashboard Supabase e refazer
```

### ❌ "Stripe key invalid"
```bash
# STRIPE_SECRET_KEY errado ou não começa com sk_

# Verificar:
cat server/.env.test | grep STRIPE
# Deve ser: STRIPE_SECRET_KEY=sk_live_... ou sk_test_...
```

---

## 📊 VALIDAR BUILD DE PRODUÇÃO

Após testes locais funcionando, validar build:

```bash
# Terminal:
cd c:\projetos\aparecida

# Build TypeScript + Vite
npm run build

# Verificar arquivos gerados
dir dist

# Deve ter:
# index.html
# assets/index-xxx.js
# assets/index-xxx.css
```

---

## 🚀 DEPOIS DOS TESTES

Se TODOS os testes acima passam, você está pronto para:

1. Executar `deploy-prepare.ps1`
2. Fazer upload para EC2
3. Executar `deploy-ec2-setup.sh` na EC2

---

## 📝 COMPARAÇÃO LOCAL vs PRODUÇÃO

| Aspecto | Local | Produção |
|---------|-------|----------|
| **URL Frontend** | http://localhost:4173 | https://seu-dominio.com.br |
| **URL Backend** | http://localhost:3001 | https://seu-dominio.com.br/api |
| **CORS** | Proxy Vite | Nginx proxy |
| **SSL** | Não (local) | Let's Encrypt |
| **Database** | Supabase (mesma) | Supabase (mesma) |
| **Server** | Node direto | PM2 + Nginx |
| **Restart** | Manual | PM2 automático |
| **Logs** | Console | PM2 + Nginx logs |

---

## 🎯 RESUMO

✅ Teste tudo localmente ANTES de fazer deploy real  
✅ Use .env.test com credenciais reais  
✅ Valide frontend + backend + database  
✅ Se passar nestes testes, é 99% que funcionará na EC2  

---

**Tempo estimado:** 15-20 minutos para testes completos
