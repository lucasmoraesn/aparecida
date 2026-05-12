# ✅ DEPLOY INCREMENTAL - TUDO PRONTO PARA USAR

## 🎉 STATUS: COMPLETO E TESTADO

Foram criados **8 documentos** + **3 scripts** para fazer deploy incremental seguro e eficiente.

---

## 📁 ARQUIVOS CRIADOS

### 📄 Documentação (Organize por Seu Caso)

#### 🚀 COMECE AQUI (Escolha um):

1. **DEPLOY_INCREMENTAL_RAPIDO.md** ⭐ (MAIS RÁPIDO)
   - 3 passos simples para deploy imediato
   - 10-15 minutos total
   - Ideal: Hotfixes, updates rápidas
   - Leia quando: Tem pressa

2. **ESTRATEGIA_DEPLOYMENT.md** ⭐ (MELHOR ESCOLHA)
   - Compara Complete vs Incremental
   - Ajuda na decisão
   - Ideal: Primeira vez que vai decidir
   - Leia quando: Tem dúvida qual usar

3. **INDICE_DEPLOYMENT_TODOS.md** ⭐ (REFERÊNCIA)
   - Índice de TODOS os arquivos
   - Qual usar em cada situação
   - Ideal: Navegação
   - Leia quando: Perdeu em qual abrir

#### 📚 Documentação Detalhada:

4. **DEPLOY_INCREMENTAL_SEGURO.md**
   - 8 fases de deploy incremental
   - Segurança máxima
   - Ideal: Updates importantes
   - Leia quando: Quer entender cada detalhe

5. **DEPLOY_INCREMENTAL_COMPLETO.md**
   - Resumo completo com checklist
   - Troubleshooting incluído
   - Ideal: Referência geral
   - Leia quando: Quer resumo de tudo

6. **TESTE_LOCAL_PRE_DEPLOY.md**
   - Como validar localmente antes
   - Evita quebrar produção
   - Ideal: Antes de qualquer deploy
   - Leia quando: Quer testar primeiro

7. **GUIA_SSH_SCP.md**
   - Configurar SSH e upload
   - Troubleshooting de conexão
   - Ideal: Problema com SSH
   - Leia quando: Erro de conexão

8. **GUIA_DEPLOY_EC2_UBUNTU.md**
   - Deploy completo do zero
   - 7 fases de setup
   - Ideal: Primeira implantação
   - Leia quando: Novo servidor

---

### 🤖 Scripts Automáticos (Use em Ordem)

#### Para Deploy Incremental (Seu Caso):

```powershell
1️⃣ deploy-incremental.ps1
   Quando: No seu PC
   O quê: Build, identifica mudanças, upload, restart
   Como: .\deploy-incremental.ps1 -EC2IP seu-ip -KeyPath chave.pem
   Tempo: 15 minutos

2️⃣ post-deploy-validate.sh
   Quando: Na EC2 após deploy
   O quê: Valida tudo, restart, health checks
   Como: bash post-deploy-validate.sh
   Tempo: 2 minutos

3️⃣ post-deploy-rollback.sh (Se erro)
   Quando: Na EC2 se algo deu errado
   O quê: Restaura backup automático
   Como: bash post-deploy-rollback.sh
   Tempo: 3 minutos
```

---

## 🚀 USAR AGORA: 3 PASSOS

### Passo 1: Seu Computador (Windows)

```powershell
# Abra PowerShell
cd C:\projetos\aparecida

# Opção A: Ver o que vai fazer (recomendado primeiro)
.\deploy-incremental.ps1 -EC2IP seu-ip-ec2 -KeyPath C:\aws\chave.pem -DryRun

# Opção B: Fazer de verdade
.\deploy-incremental.ps1 -EC2IP seu-ip-ec2 -KeyPath C:\aws\chave.pem
```

**O script automaticamente:**
- ✅ Valida estrutura local
- ✅ Faz build
- ✅ Identifica mudanças
- ✅ Cria backup na EC2
- ✅ Upload incremental (rsync)
- ✅ Pede confirmação em cada etapa
- ✅ Mostra progresso detalhado

### Passo 2: Na EC2 (Linux)

```bash
# SSH para EC2
ssh -i "C:\aws\chave.pem" ubuntu@seu-ip-ec2

# Validar e restart
bash post-deploy-validate.sh
```

**O script automaticamente:**
- ✅ Valida arquivos uploaded
- ✅ Verifica Nginx
- ✅ npm install se necessário
- ✅ Restart PM2
- ✅ Reload Nginx
- ✅ Health checks
- ✅ Mostra logs

### Passo 3: Pronto!

```bash
# Testar
curl https://seu-dominio.com.br/api/health

# Monitorar
pm2 logs aparecida-backend --lines 50

# Se tudo OK, você está LIVE! 🎉
```

---

## 📊 FLUXO VISUAL

```
SEU PC:
  npm run build
       ↓
  .\deploy-incremental.ps1
       ↓ (build + upload + ssh commands)
       
EC2:
  bash post-deploy-validate.sh
       ↓ (validate + restart)
       
RESULTADO:
  ✅ ONLINE! Seu site atualizado
  
SE ERROR:
  bash post-deploy-rollback.sh
       ↓ (automático rollback)
  ✅ Volta ao estado anterior
```

---

## ⚡ CASOS DE USO

| Situação | Tempo | Comando |
|----------|-------|---------|
| **Hotfix bug** | 10 min | deploy-incremental.ps1 |
| **Nova feature** | 15 min | deploy-incremental.ps1 |
| **UI/CSS** | 5 min | deploy-incremental.ps1 |
| **Texto/copy** | 5 min | deploy-incremental.ps1 |
| **Novo endpoint** | 10 min | deploy-incremental.ps1 |
| **Erro, reverter** | 3 min | post-deploy-rollback.sh |
| **Testar antes** | 20 min | TESTE_LOCAL_PRE_DEPLOY.md |

---

## 🛡️ PROTEÇÕES INCLUÍDAS

```
✅ Backup automático antes de cada deploy
✅ Confirmações em etapas críticas
✅ Validações pré-deploy
✅ Validações pós-deploy
✅ Rollback com um comando
✅ Health checks automáticos
✅ Logs detalhados
✅ .env não é alterado
✅ Dry-run disponível para teste
```

---

## 📋 CHECKLIST PRÉ-DEPLOY

- [ ] Mudanças commitadas no Git
- [ ] npm run build testado
- [ ] Sem erros de sintaxe
- [ ] .env intacto
- [ ] EC2 acessível
- [ ] Chave SSH OK
- [ ] PM2 rodando
- [ ] Nginx rodando

---

## 💡 DICAS PRO

✅ Use `-DryRun` primeiro para ver tudo que vai acontecer  
✅ Monitore por 5 minutos após deploy  
✅ Use git commit com mensagens claras  
✅ Tenha terminal de logs aberta: `pm2 monit`  
✅ Teste localmente antes de qualquer deploy  
✅ Seja confortável com comando de rollback  

---

## 🎯 ROADMAP DE APRENDIZADO

### Passo 1: Decisão (5 min)
```
Leia: ESTRATEGIA_DEPLOYMENT.md
Decida: Incremental é sua escolha?
→ SIM: Prossiga para Passo 2
→ NÃO: Leia GUIA_DEPLOY_EC2_UBUNTU.md
```

### Passo 2: Preparação (10 min)
```
Leia: DEPLOY_INCREMENTAL_RAPIDO.md
Ou: TESTE_LOCAL_PRE_DEPLOY.md
```

### Passo 3: Execução (20 min)
```
Execute: .\deploy-incremental.ps1 -EC2IP seu-ip -KeyPath chave.pem
```

### Passo 4: Validação (5 min)
```
Execute: bash post-deploy-validate.sh
```

### Passo 5: Monitoramento (5 min)
```
Monitore: pm2 logs aparecida-backend
```

---

## 🆘 TROUBLESHOOTING RÁPIDO

### Backend não responde
```bash
pm2 logs aparecida-backend --lines 100
pm2 restart aparecida-backend
```

### Frontend carrega, API falha
```bash
sudo nginx -t
sudo tail -50 /var/log/nginx/error.log
```

### npm install falhou
```bash
cd server
rm -rf node_modules package-lock.json
npm install --omit=dev
```

### Tudo deu errado
```bash
bash post-deploy-rollback.sh
# Automático, sem perguntas
```

---

## 📞 REFERÊNCIA RÁPIDA

```bash
# Build local
npm run build

# Deploy incremental (automático)
.\deploy-incremental.ps1 -EC2IP seu-ip -KeyPath chave.pem

# Validar na EC2
bash post-deploy-validate.sh

# Ver logs
pm2 logs aparecida-backend --lines 50

# Rollback se erro
bash post-deploy-rollback.sh

# Health check
curl http://localhost:3001/health
```

---

## 🌟 PRÓXIMO PASSO

### Opção 1: Fazer Agora (Recomendado)
```powershell
.\deploy-incremental.ps1 -EC2IP seu-ip-ec2 -KeyPath C:\aws\chave.pem -DryRun
```
Depois (se tudo OK):
```powershell
.\deploy-incremental.ps1 -EC2IP seu-ip-ec2 -KeyPath C:\aws\chave.pem
```

### Opção 2: Estudar Primeiro
```
Leia: ESTRATEGIA_DEPLOYMENT.md
Depois: DEPLOY_INCREMENTAL_RAPIDO.md
Depois execute
```

### Opção 3: Testar Localmente
```
Seguir: TESTE_LOCAL_PRE_DEPLOY.md
npm run preview (testar local)
Depois fazer deploy incremental
```

---

## ✨ VOCÊ ESTÁ PRONTO!

```
✅ Documentação completa
✅ Scripts prontos
✅ Proteções incluídas
✅ Troubleshooting documentado
✅ Rollback automático
✅ Health checks

Comece agora: .\deploy-incremental.ps1
```

---

## 📚 TODOS OS ARQUIVOS

**Documentação (8):**
1. DEPLOY_INCREMENTAL_RAPIDO.md ⭐
2. ESTRATEGIA_DEPLOYMENT.md ⭐
3. INDICE_DEPLOYMENT_TODOS.md ⭐
4. DEPLOY_INCREMENTAL_SEGURO.md
5. DEPLOY_INCREMENTAL_COMPLETO.md
6. TESTE_LOCAL_PRE_DEPLOY.md
7. GUIA_SSH_SCP.md
8. GUIA_DEPLOY_EC2_UBUNTU.md

**Scripts (3):**
1. deploy-incremental.ps1
2. post-deploy-validate.sh
3. post-deploy-rollback.sh

**Total:** 11 arquivos prontos para usar

---

**Boa sorte! 🚀**

Qualquer dúvida, abra a documentação correspondente.
Execute os scripts com `-Verbose` ou `-h` para mais detalhes.
