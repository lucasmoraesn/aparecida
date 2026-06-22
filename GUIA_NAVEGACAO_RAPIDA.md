# 🗺️ Guia de Navegação Rápida

**Aparecida Project - Onde Encontrar O Que Precisa**

---

## 🎯 3 Arquivos PRINCIPAIS

### 1️⃣ [README_PROJETO.md](README_PROJETO.md) ⭐⭐⭐
**COMECE AQUI - Leia primeiro**

- ✅ Overview completo do projeto
- ✅ Quick start em 4 passos
- ✅ Estrutura de pastas explicada
- ✅ APIs principais listadas
- ✅ Troubleshooting básico
- ⏱️ **10 minutos de leitura**

```
Próximo arquivo depois disso → GUIA_RAPIDO_RESEND.md
```

---

### 2️⃣ [GUIA_RAPIDO_RESEND.md](GUIA_RAPIDO_RESEND.md) ⭐⭐⭐
**Como usar Resend para emails**

- ✅ Setup em 5 minutos
- ✅ Como testar envio de email
- ✅ Exemplos de código
- ✅ Dashboard monitoring
- ✅ Troubleshooting email
- ⏱️ **5 minutos de setup**

```
Depois → GUIA_DEPLOY_EC2_UBUNTU.md (quando pronto para deploy)
```

---

### 3️⃣ [INDEX.md](INDEX.md) ⭐⭐
**Índice Completo - Mapa de Navegação**

- ✅ Lista de todos os documentos
- ✅ Categorizado por tópico
- ✅ Tempo estimado para cada doc
- ✅ "Como encontrar o que precisa"
- ✅ Referência rápida de scripts
- ⏱️ **2 minutos para navegar**

```
Use este arquivo quando não sabe aonde procurar
```

---

## 📚 DOCUMENTOS POR NECESSIDADE

### "Quero começar agora"
1. [README_PROJETO.md](README_PROJETO.md) — 10 min
2. [COMECE_AQUI_3_PASSOS.md](COMECE_AQUI_3_PASSOS.md) — 5 min
3. `npm run dev` and start coding

### "Como configuro emails?"
1. [GUIA_RAPIDO_RESEND.md](GUIA_RAPIDO_RESEND.md) — 5 min
2. Criar conta em https://resend.com
3. `node test-email.js seu@email.com`

### "Como faço deploy em produção?"
1. [GUIA_DEPLOY_EC2_UBUNTU.md](GUIA_DEPLOY_EC2_UBUNTU.md) — Complete guide
2. [CHECKLIST_DEPLOY_EC2.md](CHECKLIST_DEPLOY_EC2.md) — Pre/during/post
3. Execute os passos em ordem

### "Preciso de um checklist"
→ [CHECKLIST_DEPLOY_EC2.md](CHECKLIST_DEPLOY_EC2.md)

### "Como integro Stripe?"
→ [STRIPE_INTEGRACAO_COMPLETA.md](STRIPE_INTEGRACAO_COMPLETA.md)

### "Quero entender a arquitetura"
→ [CODIGO_ATUALIZADO_REFERENCIA.md](CODIGO_ATUALIZADO_REFERENCIA.md)

### "Preciso ver exemplos de código"
→ [EXEMPLOS_INTEGRACAO_CODIGO.md](EXEMPLOS_INTEGRACAO_CODIGO.md)

### "Qual é a história de migração?"
→ [MIGRACAO_SES_PARA_RESEND_COMPLETA.md](MIGRACAO_SES_PARA_RESEND_COMPLETA.md)

### "Status atual do projeto?"
→ [CONCLUSAO_LIMPEZA_PROFISSIONAL.md](CONCLUSAO_LIMPEZA_PROFISSIONAL.md)

### "Antes e depois da migração"
→ [ANTES_E_DEPOIS_TRANSFORMACAO.md](ANTES_E_DEPOIS_TRANSFORMACAO.md)

---

## 🚀 QUICK START COMMANDS

```bash
# Frontend
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build

# Backend
cd server
npm install          # Install server dependencies
npm run dev          # Start dev server (http://localhost:3001)
npm start            # Production mode

# Email Testing
cd server
node test-email.js seu@email.com              # Simple test
npm run test:email:interactive                # Interactive menu

# Payment Testing
cd server
npm run test:payment                          # Simulate webhook

# Environment Check
npm run check:env                             # Validate variables
```

---

## 🔧 IMPORTANT FILES & LOCATIONS

| Arquivo | Localização | Propósito |
|---------|-----------|----------|
| **.env** | `server/.env` | Variáveis de produção |
| **.env.example** | `server/.env.example` | Template com dummy values |
| **Email Service** | `server/services/resendEmailService.js` | 12 funções de email |
| **Email Tests** | `server/test-*.js` | Scripts de teste |
| **Frontend Config** | `vite.config.ts` | Build e dev config |
| **Backend Config** | `server/index.js` | Express setup |
| **Deployment Guide** | `GUIA_DEPLOY_EC2_UBUNTU.md` | Step-by-step deploy |

---

## 📋 ENVIRONMENT VARIABLES

```bash
# Frontend (raiz do projeto)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...

# Backend (server/.env)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx...
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
RESEND_API_KEY=re_xxx              # ← Add this
RESEND_FROM=Explore Aparecida <noreply@aparecidadonortesp.com.br>
ADMIN_EMAIL=seu_email@seu_dominio.com
NODE_ENV=production
```

---

## ✅ PRE-DEPLOYMENT CHECKLIST

Use: [CHECKLIST_DEPLOY_EC2.md](CHECKLIST_DEPLOY_EC2.md)

```
Antes de fazer deploy:
☐ Todos os .env variables configurados
☐ RESEND_API_KEY adicionado
☐ npm run check:env passa
☐ Tests passando localmente
☐ Stripe webhook URL pronto
☐ EC2 instance criada
☐ Security groups configurados
☐ SSL certificate pronto
```

---

## 🆘 TROUBLESHOOTING

### "Como testo emails localmente?"
```bash
cd server
node test-email.js seu@email.com
```

### "Email service não está funcionando"
```bash
npm run check:env
# Check: RESEND_API_KEY set? RESEND_FROM valid?
```

### "Deploy falhou"
```bash
cd server
npm run check:env
# Verificar: variáveis, permissões, conectividade
```

### "Não consigo encontrar um documento"
→ Vá para [INDEX.md](INDEX.md) e procure pelo tópico

---

## 📞 HELP & RESOURCES

| Recurso | URL |
|---------|-----|
| **Resend Docs** | https://resend.com/docs |
| **Stripe Docs** | https://stripe.com/docs |
| **Supabase Docs** | https://supabase.com/docs |
| **React Docs** | https://react.dev |
| **Express Docs** | https://expressjs.com |
| **Vite Docs** | https://vitejs.dev |

---

## 🎯 RECOMMENDED READING ORDER

### For First-Time Setup:
1. README_PROJETO.md (10 min)
2. COMECE_AQUI_3_PASSOS.md (5 min)
3. GUIA_RAPIDO_RESEND.md (5 min)
4. Start coding! 🚀

### For Production Deploy:
1. GUIA_DEPLOY_EC2_UBUNTU.md (complete guide)
2. CHECKLIST_DEPLOY_EC2.md (checklist)
3. DEPLOY_COMPLETO_PRONTO.md (visual guide)
4. Execute step-by-step

### For Understanding Everything:
1. README_PROJETO.md
2. CODIGO_ATUALIZADO_REFERENCIA.md
3. EXEMPLOS_INTEGRACAO_CODIGO.md
4. STRIPE_INTEGRACAO_COMPLETA.md

---

## 🔍 SEARCH TIPS

**Use Ctrl+P (or Cmd+P) in VS Code:**

```
Procurando por...          Arquivo
────────────────────────   ─────────────────────────
Como começar               README_PROJETO.md
Setup email               GUIA_RAPIDO_RESEND.md
Deploy                    GUIA_DEPLOY_EC2_UBUNTU.md
Arquitetura               CODIGO_ATUALIZADO_REFERENCIA.md
Exemplos de código        EXEMPLOS_INTEGRACAO_CODIGO.md
Stripe                    STRIPE_INTEGRACAO_COMPLETA.md
Checklist                 CHECKLIST_DEPLOY_EC2.md
Tudo sobre tudo           INDEX.md
```

---

## ✨ DOCUMENT STATUS

```
🟢 PRODUCTION READY:
  ✅ README_PROJETO.md
  ✅ GUIA_RAPIDO_RESEND.md
  ✅ GUIA_DEPLOY_EC2_UBUNTU.md
  ✅ STRIPE_INTEGRACAO_COMPLETA.md
  ✅ Todos os checklists

🟡 REFERENCE:
  ✅ CODIGO_ATUALIZADO_REFERENCIA.md
  ✅ EXEMPLOS_INTEGRACAO_CODIGO.md
  ✅ MIGRACAO_SES_PARA_RESEND_COMPLETA.md

🟢 STATUS & SUMMARY:
  ✅ CONCLUSAO_LIMPEZA_PROFISSIONAL.md
  ✅ ANTES_E_DEPOIS_TRANSFORMACAO.md
  ✅ INDEX.md
```

---

## 🎓 NEXT STEPS

### Step 1: Understand (20 min)
→ Read [README_PROJETO.md](README_PROJETO.md)

### Step 2: Setup Local (10 min)
→ Follow [COMECE_AQUI_3_PASSOS.md](COMECE_AQUI_3_PASSOS.md)

### Step 3: Setup Email (8 min)
→ Follow [GUIA_RAPIDO_RESEND.md](GUIA_RAPIDO_RESEND.md)

### Step 4: Deploy (2 hours)
→ Follow [GUIA_DEPLOY_EC2_UBUNTU.md](GUIA_DEPLOY_EC2_UBUNTU.md)

### Step 5: Success! 🎉
→ Your app is live

---

**Version:** 2.0 (Resend)  
**Status:** ✅ Complete & Production-Ready  
**Last Updated:** 21/05/2026

**Remember:** When in doubt, start with [README_PROJETO.md](README_PROJETO.md) 📖
