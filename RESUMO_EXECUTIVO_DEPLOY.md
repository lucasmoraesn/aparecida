# 🚀 RESUMO EXECUTIVO - DEPLOY APARECIDA EC2

## Gerado em: 2026-05-08

---

## 📋 O QUE FOI PREPARADO

Você tem tudo pronto para fazer deploy do Aparecida em uma EC2 Ubuntu nova. Foram criados:

| Arquivo | Descrição |
|---------|-----------|
| `.deployignore` | Especifica quais arquivos NÃO enviar para produção |
| `deploy-prepare.ps1` | Script PowerShell que automatiza preparação local |
| `deploy-ec2-setup.sh` | Script bash que automatiza setup completo na EC2 |
| `GUIA_DEPLOY_EC2_UBUNTU.md` | Guia detalhado com TODOS os comandos explicados |
| `CHECKLIST_DEPLOY_EC2.md` | Checklist rápido para referência durante deploy |
| `RESUMO_EXECUTIVO_DEPLOY.md` | Este arquivo (visão geral) |

---

## 🎯 ARQUITETURA FINAL

```
┌─────────────────────────────────────────────────────────┐
│                    AWS EC2 Ubuntu 22.04                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │              NGINX (Reverse Proxy)                  │  │
│  │   - Porta 80 (redireciona para 443)                │  │
│  │   - Porta 443 (HTTPS com Let's Encrypt)           │  │
│  │   - Servir arquivos /dist (frontend React)        │  │
│  │   - Proxy /api/* → http://localhost:3001          │  │
│  └────────────────────────────────────────────────────┘  │
│           ↓ Proxy para localhost:3001                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │        PM2 + Node.js Backend (Cluster Mode)        │  │
│  │   - Porta 3001 (Express API)                       │  │
│  │   - Auto-restart em falhas                         │  │
│  │   - Log centralizado                              │  │
│  │   - Auto-start no boot                            │  │
│  └────────────────────────────────────────────────────┘  │
│                      ↓                                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │        Supabase (PostgreSQL Database)              │  │
│  │   - Remote, acesso seguro via Service Key         │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────┘

Fluxo:
1. Usuário acessa: https://seu-dominio.com.br
2. Nginx recebe requisição HTTPS
3. Nginx serve arquivos /dist (frontend React)
4. Frontend faz requisição AJAX para /api/*
5. Nginx faz proxy para http://localhost:3001
6. Express backend processa e acessa Supabase
7. Resposta volta para frontend
```

---

## ⚡ QUICK START - 3 COMANDOS PRINCIPAIS

### 1️⃣ NO SEU COMPUTADOR (Preparar)
```powershell
cd C:\projetos\aparecida
.\deploy-prepare.ps1
```
**Tempo:** ~5 minutos  
**Resultado:** `aparecida-prod.zip` (~40MB)

### 2️⃣ FAZER UPLOAD PARA EC2
```bash
# Opção simples (se tem SSH configurado):
scp -i chave.pem aparecida-prod.zip ubuntu@seu-ip-ec2:/home/ubuntu/

# Depois na EC2:
unzip aparecida-prod.zip
```

### 3️⃣ NA EC2 (Fazer deploy automático)
```bash
# Após upload do arquivo deploy-ec2-setup.sh:
bash deploy-ec2-setup.sh seu-dominio.com.br
```
**Tempo:** ~3-5 minutos  
**Resultado:** Site online em https://seu-dominio.com.br

---

## 📊 STACK TÉCNICO

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | React + TypeScript + Vite | 18 / 5 / 5.0 |
| **Backend** | Node.js + Express | 18 LTS / 4.22 |
| **Database** | Supabase (PostgreSQL) | Latest |
| **Server** | Nginx + PM2 | Latest |
| **SSL/TLS** | Let's Encrypt (Certbot) | Free |
| **Email** | AWS SES | Optional |
| **Payments** | Stripe | v20 |

---

## 🔒 SEGURANÇA INCLUÍDA

✅ HTTPS/SSL com Let's Encrypt (renovação automática)  
✅ HTTP → HTTPS redirect automático  
✅ Helmet.js (security headers)  
✅ Rate limiting  
✅ CORS configurado  
✅ Bot blocker  
✅ PM2 rodando com usuário Ubuntu (não root)  
✅ Variáveis de ambiente protegidas  
✅ .env não versionado (.gitignore)  

---

## 📝 CHECKLIST PRÉ-DEPLOY (15 min)

- [ ] EC2 rodando (t3.micro ou maior)
- [ ] Security Group com portas 22, 80, 443 abertas
- [ ] Chave SSH (.pem) com permissões corretas
- [ ] Supabase URL pronta
- [ ] Supabase Service Key pronta
- [ ] Stripe Secret Key pronta
- [ ] Stripe Webhook Secret pronto
- [ ] Domínio apontando para IP da EC2
- [ ] AWS SES configurado (se vai enviar emails)
- [ ] Arquivo `deploy-prepare.ps1` testado localmente
- [ ] Arquivo `aparecida-prod.zip` gerado (~40MB)
- [ ] Credenciais em `env.prod.reference`

---

## 🚀 FLUXO COMPLETO (Passo a Passo)

### ETAPA 1: Preparação Local (5-10 min)
1. Executar `deploy-prepare.ps1`
   - Faz build do frontend (Vite)
   - Instala dependências
   - Valida estrutura
   - Compacta em zip

2. Editar `env.prod.reference` com credenciais

3. Upload de `aparecida-prod.zip` para EC2

### ETAPA 2: Setup EC2 (5-10 min)
1. SSH para EC2
2. Descompactar arquivo
3. Executar `deploy-ec2-setup.sh seu-dominio.com.br`
   - Instala Node.js, PM2, Nginx, Certbot
   - Configura PM2 para auto-start
   - Configura Nginx como reverse proxy
   - Gera certificado SSL
   - Inicia tudo automaticamente

### ETAPA 3: Configuração de Credenciais (2 min)
1. Editar `/home/ubuntu/.env` na EC2
2. Adicionar valores reais (Supabase, Stripe, etc)
3. Reiniciar backend: `pm2 restart aparecida-backend`

### ETAPA 4: Validação (3 min)
1. Acessar https://seu-dominio.com.br
2. Verificar se página carrega
3. Testar endpoints /api/*
4. Verificar logs PM2

**Tempo Total:** 15-25 minutos

---

## 🧪 VALIDAÇÃO LOCAL (ANTES DE DEPLOY)

Se quiser testar localmente antes de fazer deploy para EC2:

```bash
# Terminal 1: Backend
cd server
npm run start:prod

# Terminal 2: Frontend (teste)
npm run preview
```

Acesso: http://localhost:4173 (frontend) + backend em :3001

---

## 🛠️ COMANDOS ESSENCIAIS NA EC2

```bash
# Ver status da aplicação
pm2 status

# Ver logs em tempo real
pm2 logs aparecida-backend --lines 50

# Reiniciar backend
pm2 restart aparecida-backend

# Ver status do Nginx
sudo systemctl status nginx

# Recarregar Nginx
sudo systemctl reload nginx

# Editar credenciais
nano /home/ubuntu/.env

# Ver certificado SSL
sudo certbot certificates
```

---

## 🚨 POSSÍVEIS PROBLEMAS E SOLUÇÕES

### Problema: "Backend não conecta ao Supabase"
**Solução:** Editar `/home/ubuntu/.env` e adicionar SUPABASE_URL e SUPABASE_SERVICE_KEY corretos

### Problema: "HTTPS não funciona"
**Solução:** Verificar certificado com `sudo certbot certificates` e domínio correto no nginx

### Problema: "Frontend carrega mas API retorna 404"
**Solução:** Verificar se Nginx proxy está configurado com `sudo nginx -t` e logs com `sudo tail -50 /var/log/nginx/error.log`

### Problema: "Node_modules gigante"
**Solução:** Usar `npm install --omit=dev` na EC2 (script já faz isto)

### Problema: "Porta 3001 já em uso"
**Solução:** `lsof -i :3001` e matar processo antigo ou usar outra porta no .env

---

## 📈 PRÓXIMAS ETAPAS (Pós-Deploy)

### Imediato (hoje)
- [ ] Testar todas as funcionalidades do site
- [ ] Verificar emails sendo enviados
- [ ] Testar pagamento Stripe (modo teste)
- [ ] Validar logs

### Curto Prazo (próxima semana)
- [ ] Configurar monitoring (CloudWatch)
- [ ] Configurar alertas
- [ ] Teste de carga
- [ ] Backup strategy

### Médio Prazo
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Auto-scaling (se necessário)
- [ ] CDN (CloudFront)
- [ ] Logs centralizados

---

## 📞 ONDE ENCONTRAR AJUDA

| Recurso | Local |
|---------|--------|
| **Guia Detalhado** | `GUIA_DEPLOY_EC2_UBUNTU.md` |
| **Checklist Rápido** | `CHECKLIST_DEPLOY_EC2.md` |
| **Scripts** | `deploy-prepare.ps1` e `deploy-ec2-setup.sh` |
| **Estrutura .deployignore** | `.deployignore` |
| **Logs Backend** | `pm2 logs aparecida-backend` |
| **Logs Nginx** | `/var/log/nginx/error.log` |

---

## 💾 BACKUP DO .ENV (IMPORTANTE)

⚠️ **NUNCA** commitar `.env` no Git  
✅ **SEMPRE** ter cópia segura da chave Stripe, Supabase, etc  
✅ Guardar em password manager ou vault seguro

---

## ✅ VALIDAÇÃO FINAL PRÉ-DEPLOY

Antes de começar, confirme que tem tudo:

```
Pre-requisitos AWS:
  ✅ EC2 t3.micro ou maior rodando
  ✅ Ubuntu 22.04 LTS
  ✅ Security Group com 22, 80, 443 abertos
  ✅ Chave SSH (.pem) com chmod 400
  
Domínio:
  ✅ Registrado
  ✅ Apontando para IP da EC2
  ✅ DNS propagado (verificar com: nslookup seu-dominio.com.br)

Credenciais:
  ✅ Supabase URL
  ✅ Supabase Service Key
  ✅ Stripe Secret Key
  ✅ Stripe Webhook Secret
  ✅ AWS SES Keys (optional)

Arquivos Locais:
  ✅ deploy-prepare.ps1 existe
  ✅ aparecida-prod.zip gerado
  ✅ env.prod.reference preenchido
  ✅ deploy-ec2-setup.sh pronto para upload
```

---

## 🎉 PRONTO?

Se tudo checado acima, você está pronto para:

1. Executar `.\deploy-prepare.ps1` (seu computador)
2. Upload `aparecida-prod.zip` para EC2
3. Executar `bash deploy-ec2-setup.sh seu-dominio.com.br` (na EC2)
4. Acessar https://seu-dominio.com.br

**Tempo total:** 20-30 minutos do início ao fim

---

**Criado com ❤️ para deploy seguro, rápido e confiável**  
**Versão:** 1.0  
**Último update:** 2026-05-08
