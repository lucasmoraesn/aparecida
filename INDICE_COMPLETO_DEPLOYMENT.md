# 📚 ÍNDICE COMPLETO - DEPLOY APARECIDA EC2

## 🗺️ MAPA DE DOCUMENTAÇÃO

```
DEPLOY APARECIDA AWS EC2
│
├─ 📋 LEIA PRIMEIRO
│  ├─ RESUMO_EXECUTIVO_DEPLOY.md ⭐ COMECE AQUI
│  └─ CHECKLIST_DEPLOY_EC2.md (referência rápida)
│
├─ 🔧 CONFIGURAÇÃO LOCAL (Seu Computador)
│  ├─ deploy-prepare.ps1 (script automático)
│  ├─ TESTE_LOCAL_PRE_DEPLOY.md (validar antes)
│  └─ env.prod.reference (credenciais)
│
├─ 📤 UPLOAD PARA EC2
│  ├─ GUIA_SSH_SCP.md (como conectar e fazer upload)
│  └─ aparecida-prod.zip (arquivo compactado)
│
├─ 🚀 SETUP NA EC2 (Ubuntu)
│  ├─ deploy-ec2-setup.sh (script automático)
│  ├─ GUIA_DEPLOY_EC2_UBUNTU.md (detalhado)
│  └─ .env (credenciais na EC2)
│
└─ 🧪 TESTES E VALIDAÇÃO
   ├─ Testes locais
   ├─ Testes na EC2
   └─ Monitoramento pós-deploy
```

---

## ⏱️ TEMPO TOTAL ESTIMADO

| Etapa | Tempo | Esforço |
|-------|-------|---------|
| 📚 Ler documentação | 10 min | Baixo |
| 🔧 Preparar localmente (build) | 5 min | Baixo |
| 🧪 Teste local (opcional) | 15 min | Médio |
| 📤 Upload para EC2 | 5 min | Baixo |
| 🚀 Setup automático EC2 | 10 min | Muito Baixo |
| ✅ Validação e testes | 5 min | Médio |
| **TOTAL** | **50 min** | **-** |

---

## 📖 GUIA PASSO A PASSO

### ETAPA 1: Preparação (15 minutos)

**Leia (5 min):**
```
1. RESUMO_EXECUTIVO_DEPLOY.md → Entender visão geral
2. CHECKLIST_DEPLOY_EC2.md → Checklist pré-requisitos
```

**Execute (10 min):**
```
1. PowerShell em C:\projetos\aparecida
2. .\deploy-prepare.ps1
3. Resultado: aparecida-prod.zip criado
```

### ETAPA 2: Validação Local (Opcional, 15 minutos)

**Se quiser testar antes de fazer deploy real:**
```
1. Ler: TESTE_LOCAL_PRE_DEPLOY.md
2. Iniciar backend e frontend localmente
3. Validar que funciona
4. Se passou, pode fazer deploy com confiança
```

### ETAPA 3: Upload (5 minutos)

**Ler:**
```
1. GUIA_SSH_SCP.md → Como conectar e fazer upload
```

**Execute:**
```bash
# PowerShell:
scp -i "C:\aws\chave.pem" aparecida-prod.zip ubuntu@seu-ip-ec2:/home/ubuntu/
scp -i "C:\aws\chave.pem" deploy-ec2-setup.sh ubuntu@seu-ip-ec2:/home/ubuntu/
```

### ETAPA 4: Deploy Automático na EC2 (10 minutos)

**Conectar:**
```bash
ssh -i "C:\aws\chave.pem" ubuntu@seu-ip-ec2
```

**Executar setup:**
```bash
cd /home/ubuntu
unzip -q aparecida-prod.zip
chmod +x deploy-ec2-setup.sh
bash deploy-ec2-setup.sh seu-dominio.com.br
```

**Script faz tudo automaticamente:**
- ✅ Atualiza Ubuntu
- ✅ Instala Node.js, PM2, Nginx
- ✅ Instala dependências
- ✅ Configura PM2
- ✅ Configura Nginx
- ✅ Gera certificado SSL
- ✅ Inicia tudo

### ETAPA 5: Configuração Manual (2 minutos)

**Editar credenciais:**
```bash
# Na EC2, via SSH:
nano /home/ubuntu/.env

# Adicionar valores REAIS:
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Salvar: CTRL+X, Y, ENTER
```

**Reiniciar backend:**
```bash
pm2 restart aparecida-backend
```

### ETAPA 6: Validação Final (5 minutos)

**Testar no browser:**
```
https://seu-dominio.com.br
```

**Verificar no terminal:**
```bash
# Ver status
pm2 status

# Ver logs
pm2 logs aparecida-backend --lines 50

# Testar API
curl https://seu-dominio.com.br/api/health
```

---

## 📁 ARQUIVOS CRIADOS

| Arquivo | Tipo | Descrição | Prioridade |
|---------|------|-----------|-----------|
| `.deployignore` | Config | O que NÃO enviar para produção | ⭐⭐⭐ |
| `RESUMO_EXECUTIVO_DEPLOY.md` | Doc | **LEIA PRIMEIRO** - Visão geral | ⭐⭐⭐ |
| `CHECKLIST_DEPLOY_EC2.md` | Doc | Checklist rápido de referência | ⭐⭐⭐ |
| `deploy-prepare.ps1` | Script | Automatiza preparação local | ⭐⭐⭐ |
| `deploy-ec2-setup.sh` | Script | Automatiza setup EC2 (UPLOAD!) | ⭐⭐⭐ |
| `GUIA_DEPLOY_EC2_UBUNTU.md` | Doc | Guia detalhado com todos comandos | ⭐⭐ |
| `GUIA_SSH_SCP.md` | Doc | Como conectar e fazer upload | ⭐⭐ |
| `TESTE_LOCAL_PRE_DEPLOY.md` | Doc | Teste local antes de deploy | ⭐ |

---

## 🎯 FLUXO VISUAL

```
┌─────────────────────────────────────────────────────────────┐
│  SEU COMPUTADOR (Local)                                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Ler RESUMO_EXECUTIVO_DEPLOY.md                          │
│     └→ Entender arquitetura e pré-requisitos               │
│                                                               │
│  2. Executar .\deploy-prepare.ps1                          │
│     └→ Gera aparecida-prod.zip (~40MB)                     │
│                                                               │
│  3. Editar env.prod.reference                              │
│     └→ Adicionar credenciais (Supabase, Stripe, AWS)      │
│                                                               │
│  4. (OPCIONAL) Testar localmente                           │
│     └→ TESTE_LOCAL_PRE_DEPLOY.md                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
                     Upload via SCP
              (GUIA_SSH_SCP.md para ajuda)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  AWS EC2 (Ubuntu)                                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Receber upload: aparecida-prod.zip + deploy-ec2-setup.sh│
│                                                               │
│  2. Descompactar: unzip aparecida-prod.zip                 │
│                                                               │
│  3. Executar: bash deploy-ec2-setup.sh seu-dominio.com.br  │
│     └→ Instala tudo automaticamente                         │
│                                                               │
│  4. Editar .env com credenciais REAIS                       │
│                                                               │
│  5. Reiniciar: pm2 restart aparecida-backend               │
│                                                               │
│  6. Validar: https://seu-dominio.com.br                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
                      ✅ ONLINE!
```

---

## 🛡️ SEGURANÇA (Importante!)

- [ ] Nunca committar `.env` no Git
- [ ] Chave SSH (.pem) com permissões 400
- [ ] Credenciais em local seguro (password manager)
- [ ] Nginx redirecionando HTTP → HTTPS
- [ ] Certificado SSL Let's Encrypt (renovação automática)
- [ ] Backend rodando com usuário `ubuntu` (não root)
- [ ] PM2 configurado para auto-restart em falhas

---

## 🆘 SUPORTE RÁPIDO

### Se não sabe por onde começar:
1. Leia: `RESUMO_EXECUTIVO_DEPLOY.md`
2. Rode: `.\deploy-prepare.ps1`
3. Siga: `CHECKLIST_DEPLOY_EC2.md`

### Se tem erro de SSH/SCP:
→ Consulte: `GUIA_SSH_SCP.md`

### Se quer entender tudo em detalhe:
→ Leia: `GUIA_DEPLOY_EC2_UBUNTU.md`

### Se quer testar localmente primeiro:
→ Siga: `TESTE_LOCAL_PRE_DEPLOY.md`

### Se algo deu errado:
1. Ver logs: `pm2 logs aparecida-backend`
2. Consultar: Seção "Troubleshooting" em cada documento
3. Validar .env está preenchido corretamente

---

## ✅ PRÉ-REQUISITOS FINAIS (Checklist)

Antes de começar, tenha tudo isso:

**AWS & EC2:**
- [ ] EC2 t3.micro ou maior rodando
- [ ] Ubuntu 22.04 LTS
- [ ] IP público acessível
- [ ] Chave SSH (.pem) em C:\aws\
- [ ] Security Group com 22, 80, 443 abertos

**Domínio & DNS:**
- [ ] Domínio registrado
- [ ] Apontando para IP da EC2
- [ ] DNS propagado

**Credenciais:**
- [ ] Supabase URL
- [ ] Supabase Service Key
- [ ] Stripe Secret Key
- [ ] Stripe Webhook Secret
- [ ] Resend API Key

**Local:**
- [ ] Node.js 18+ instalado
- [ ] npm 9+ instalado
- [ ] PowerShell no Windows
- [ ] SSH nativo ou PuTTY instalado

---

## 🎓 ESTRUTURA DE APRENDIZADO

```
Iniciante:
1. RESUMO_EXECUTIVO_DEPLOY.md (5 min)
2. CHECKLIST_DEPLOY_EC2.md (2 min)
3. Executar deploy (20 min)

Intermediário:
1. Ler tudo acima
2. GUIA_DEPLOY_EC2_UBUNTU.md (20 min)
3. Entender cada comando
4. Fazer testes pós-deploy

Avançado:
1. Tudo acima
2. TESTE_LOCAL_PRE_DEPLOY.md (15 min)
3. Implementar CI/CD
4. Setup CloudWatch
5. Auto-scaling
```

---

## 📞 PRÓXIMAS AÇÕES

**Imediato:**
1. Ler `RESUMO_EXECUTIVO_DEPLOY.md`
2. Rodar `deploy-prepare.ps1`
3. Fazer upload para EC2
4. Executar `deploy-ec2-setup.sh`

**Hoje:**
1. Testar todas funcionalidades
2. Verificar emails
3. Testar pagamento Stripe

**Próxima semana:**
1. Configurar monitoring
2. Implementar backups
3. Setup CI/CD

---

## 📊 ESTATÍSTICAS

| Métrica | Valor |
|---------|-------|
| Documentos criados | 8 |
| Scripts automáticos | 2 |
| Tempo leitura total | 60 min |
| Tempo execução | 20 min |
| Taxa sucesso esperada | 99%+ |

---

## 🎉 BORA COMEÇAR?

### Próximo passo número 1:
```
Abrir: C:\projetos\aparecida\RESUMO_EXECUTIVO_DEPLOY.md
```

### Próximo passo número 2:
```powershell
cd C:\projetos\aparecida
.\deploy-prepare.ps1
```

---

**Criado com 💙 para tornar seu deploy seguro, rápido e confiável**

**Versão:** 1.0  
**Atualizado:** 2026-05-08  
**Autor:** Suporte Deploy Aparecida
