# 📑 Índice Completo de Documentação

**Explore Aparecida - Documentação Técnica v2.0 (Resend)**

---

## 🎯 Comece Por Aqui

| Documento | Tempo | Conteúdo |
|-----------|-------|----------|
| [README_PROJETO.md](README_PROJETO.md) | 10 min | **PRINCIPAL** — Quick start, estrutura, APIs |
| [COMECE_AQUI_3_PASSOS.md](COMECE_AQUI_3_PASSOS.md) | 5 min | 3 passos simples para rodar localmente |
| [GUIA_RAPIDO_RESEND.md](GUIA_RAPIDO_RESEND.md) | 5 min | Como usar Resend para emails transacionais |

---

## 🚀 Deployment

| Documento | Ambiente | Descrição |
|-----------|----------|-----------|
| [GUIA_DEPLOY_EC2_UBUNTU.md](GUIA_DEPLOY_EC2_UBUNTU.md) | **EC2 Ubuntu** | Passo-a-passo completo, nginx, SSL, PM2 |
| [CHECKLIST_DEPLOY_EC2.md](CHECKLIST_DEPLOY_EC2.md) | EC2 | Checklist rápido pré/durante/pós deploy |
| [DEPLOY_COMPLETO_PRONTO.md](DEPLOY_COMPLETO_PRONTO.md) | EC2 | Guia visual com diagrama de fluxo |
| [DEPLOY_INCREMENTAL_COMPLETO.md](DEPLOY_INCREMENTAL_COMPLETO.md) | EC2 | Deploy incremental (sem downtime) |
| [DEPLOY_INCREMENTAL_RAPIDO.md](DEPLOY_INCREMENTAL_RAPIDO.md) | EC2 | Deploy rápido (downtime tolerável) |
| [DEPLOY_INCREMENTAL_SEGURO.md](DEPLOY_INCREMENTAL_SEGURO.md) | EC2 | Deploy com validações de segurança |

---

## 🔧 Integração & Configuração

### Payment Gateway (Stripe)

| Documento | Tópico |
|-----------|--------|
| [PRICING_CARD_GUIA.md](PRICING_CARD_GUIA.md) | Componentes de pricing, testes com Stripe |
| [STRIPE_INTEGRACAO_COMPLETA.md](STRIPE_INTEGRACAO_COMPLETA.md) | Webhooks, assinaturas, tratamento de erros |

### Email (Resend)

| Documento | Tópico |
|-----------|--------|
| [GUIA_RAPIDO_RESEND.md](GUIA_RAPIDO_RESEND.md) | **Usar para emails** |
| [MIGRACAO_SES_PARA_RESEND_COMPLETA.md](MIGRACAO_SES_PARA_RESEND_COMPLETA.md) | Histórico da migração AWS SES → Resend |

### Network & CORS

| Documento | Tópico |
|-----------|--------|
| [CORS_CONFIGURATION.md](CORS_CONFIGURATION.md) | Como configurar CORS entre frontend/backend |

---

## 🧪 Testes & Validação

| Documento | Tipo | Descrição |
|-----------|------|-----------|
| [CHECKLIST_VALIDACAO_FINAL.md](CHECKLIST_VALIDACAO_FINAL.md) | Pre-Deploy | Checklist de validações críticas |
| [DEPLOY_INCREMENTAL_STATUS_FINAL.md](DEPLOY_INCREMENTAL_STATUS_FINAL.md) | Post-Deploy | Validar após deploy |
| [post-deploy-validate.sh](post-deploy-validate.sh) | Script | Validar saúde do sistema pós-deploy |

---

## 🏗️ Arquitetura & Design

| Documento | Foco |
|-----------|------|
| [CODIGO_ATUALIZADO_REFERENCIA.md](CODIGO_ATUALIZADO_REFERENCIA.md) | Estrutura de código, padrões |
| [EXEMPLOS_INTEGRACAO_CODIGO.md](EXEMPLOS_INTEGRACAO_CODIGO.md) | Exemplos práticos de como usar APIs |
| [BOOKING_FORM_DOCS.md](BOOKING_FORM_DOCS.md) | Formulário de reservas |

---

## 📊 Análise & Estratégia

| Documento | Conteúdo |
|-----------|----------|
| [ESTRATEGIA_DEPLOYMENT.md](ESTRATEGIA_DEPLOYMENT.md) | Estratégia geral de deployment |
| [ESTRATEGIA_CONVERSAO_SEO.md](ESTRATEGIA_CONVERSAO_SEO.md) | SEO e conversão |
| [COMPARACAO_ANTES_DEPOIS.md](COMPARACAO_ANTES_DEPOIS.md) | Análise de antes/depois |

---

## 📌 Referência Rápida

### Scripts Úteis

```bash
# Frontend
npm run dev                 # Desenvolvimento
npm run build              # Build de produção
npm run deploy:prepare     # Preparar para deploy

# Backend
npm run dev                # Desenvolvimento
npm start                  # Produção
npm run check:env          # Validar variáveis
npm run test:email         # Testar email
npm run test:payment       # Testar pagamento
```

### Variáveis de Ambiente

```bash
# Frontend (raiz)
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

# Backend (server/.env)
SUPABASE_URL
SUPABASE_SERVICE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY              # ← Para emails
RESEND_FROM
ADMIN_EMAIL
```

### Principais Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/webhook` | Webhook Stripe |
| GET | `/api/plans` | Listar planos |
| POST | `/api/subscriptions` | Criar assinatura |
| POST | `/api/business` | Registrar negócio |

---

## 🔍 Como Encontrar o Que Precisa

**"Como faço deploy?"**
→ Comece com [GUIA_DEPLOY_EC2_UBUNTU.md](GUIA_DEPLOY_EC2_UBUNTU.md)

**"Como configuro emails?"**
→ [GUIA_RAPIDO_RESEND.md](GUIA_RAPIDO_RESEND.md)

**"Preciso de um checklist?"**
→ [CHECKLIST_DEPLOY_EC2.md](CHECKLIST_DEPLOY_EC2.md)

**"Como testo o sistema?"**
→ [COMECE_AQUI_3_PASSOS.md](COMECE_AQUI_3_PASSOS.md) → Seção testes

**"Quero entender a arquitetura?"**
→ [README_PROJETO.md](README_PROJETO.md) + [CODIGO_ATUALIZADO_REFERENCIA.md](CODIGO_ATUALIZADO_REFERENCIA.md)

**"Como integro Stripe?"**
→ [STRIPE_INTEGRACAO_COMPLETA.md](STRIPE_INTEGRACAO_COMPLETA.md)

**"Preciso fazer deployment incremental?"**
→ [DEPLOY_INCREMENTAL_COMPLETO.md](DEPLOY_INCREMENTAL_COMPLETO.md)

---

## 📈 Status de Documentação

✅ **Completo** — [README_PROJETO.md](README_PROJETO.md)
✅ **Completo** — [GUIA_DEPLOY_EC2_UBUNTU.md](GUIA_DEPLOY_EC2_UBUNTU.md)
✅ **Completo** — [GUIA_RAPIDO_RESEND.md](GUIA_RAPIDO_RESEND.md)
✅ **Completo** — [STRIPE_INTEGRACAO_COMPLETA.md](STRIPE_INTEGRACAO_COMPLETA.md)
✅ **Completo** — Checklists de deploy
📝 **Atualizado** — Configuração de emails (Resend)

---

## 🔐 Segurança

**NUNCA commitar:**
- ❌ `.env` (variáveis de ambiente)
- ❌ `*.key` ou `*.pem` (chaves SSH)
- ❌ `credentials.json` ou arquivos de credenciais

**SEMPRE usar:**
- ✅ `.env.example` com valores dummy
- ✅ Secrets do GitHub/GitLab para CI/CD
- ✅ Variáveis de ambiente em produção

---

## 🚀 Próximos Passos Recomendados

1. **Ler [README_PROJETO.md](README_PROJETO.md)** — Overview completo
2. **Seguir [COMECE_AQUI_3_PASSOS.md](COMECE_AQUI_3_PASSOS.md)** — Setup local
3. **Configurar [GUIA_RAPIDO_RESEND.md](GUIA_RAPIDO_RESEND.md)** — Emails
4. **Estudar [STRIPE_INTEGRACAO_COMPLETA.md](STRIPE_INTEGRACAO_COMPLETA.md)** — Pagamentos
5. **Preparar [GUIA_DEPLOY_EC2_UBUNTU.md](GUIA_DEPLOY_EC2_UBUNTU.md)** — Deploy

---

## 📞 Contato & Suporte

- 📧 **Email:** aparecidatoursp@hotmail.com
- 🐛 **Issues:** GitHub Repository
- 📚 **Docs Externas:**
  - [Supabase](https://supabase.com/docs)
  - [Stripe](https://stripe.com/docs)
  - [Resend](https://resend.com/docs)
  - [React](https://react.dev)
  - [Express](https://expressjs.com)

---

**Versão:** 2.0 (Resend)  
**Última atualização:** 21/05/2026  
**Mantido por:** Engenharia Senior
