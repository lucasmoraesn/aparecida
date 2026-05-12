# 🔄 DEPLOY INCREMENTAL SEGURO - VPS/EC2

## 🎯 Objetivo
Deploy **apenas dos arquivos modificados** com máximo controle e mínimo downtime.

---

## ⚠️ REGRAS CRÍTICAS

```
❌ NÃO alterar arquivos que não foram modificados
❌ NÃO recriar projeto
❌ NÃO mexer no banco Supabase
❌ NÃO alterar Stripe
❌ NÃO alterar .env existente
❌ NÃO enviar node_modules
❌ NÃO substituir configs sem backup
❌ NÃO apagar arquivos sem confirmação

✅ Fazer backup antes de qualquer alteração
✅ Pedir confirmação antes de ações destrutivas
✅ Validar antes de reiniciar
✅ Ter plano de rollback
```

---

## 📋 ARQUITETURA ATUAL (ASSUMA)

```
EC2/VPS Ubuntu:
├─ /home/ubuntu/dist/          # Frontend (React build)
├─ /home/ubuntu/server/        # Backend (Node.js)
├─ /home/ubuntu/package.json   # Frontend deps
├─ /home/ubuntu/server/package.json
├─ /home/ubuntu/.env           # Credenciais (NUNCA alterar!)
└─ PM2 rodando backend em :3001
```

---

## 🔍 FASE 1: IDENTIFICAR O QUE MUDOU (Local)

### Passo 1.1: Fazer diff do Frontend
```bash
# No seu computador, pasta do projeto
cd c:\projetos\aparecida

# Ver últimas mudanças
git diff --name-only HEAD~5..HEAD | grep -E "src/|public/"

# Ou, listar arquivos modificados recentemente
dir /s /tc dist/
```

### Passo 1.2: Fazer diff do Backend
```bash
cd server

# Ver que arquivos mudaram em /server
git diff --name-only HEAD~5..HEAD

# Ver se package.json mudou (IMPORTANTE!)
git diff package.json
git diff package-lock.json
```

### Passo 1.3: Criar arquivo de mudanças
```bash
# Salvar lista de mudanças para referência
git diff --name-only HEAD > changes.txt
cat changes.txt
```

**Exemplo esperado:**
```
src/pages/Home.tsx
src/components/Header.tsx
server/routes/products.js
server/index.js
package.json
```

---

## 🏗️ FASE 2: PREPARAR FRONTEND (Local)

### Passo 2.1: Build do Frontend
```bash
cd c:\projetos\aparecida

# Limpar build anterior (OPCIONAL, mas recomendado)
# rm -r dist

# Build novo
npm run build

# Verificar que foi criado
ls -la dist/

# Resultado esperado:
# - index.html
# - assets/index-xxx.js
# - assets/index-xxx.css
```

**Tamanho esperado:** ~5-10MB (sem dependencies)

### Passo 2.2: Validar Build
```bash
# Verificar que não tem erros
npm run build 2>&1 | grep -i error

# Se não retornar nada, está OK
```

### Passo 2.3: Testar Localmente (RECOMENDADO)
```bash
# Iniciar preview local
npm run preview

# Verificar em browser: http://localhost:4173
# Se tudo OK, pode fazer deploy
```

---

## 📦 FASE 3: PREPARAR BACKEND (Local)

### Passo 3.1: Validar dependências
```bash
cd server

# Ver se package.json tem mudanças
git diff package.json

# Se mudou, instalar localmente
npm install

# Ver se package-lock.json foi atualizado
git status package-lock.json
```

### Passo 3.2: Validar sintaxe JavaScript
```bash
# Verificar se tem erros de sintaxe
npm run lint

# Ou testar manualmente
node -c index.js  # -c = check syntax only
```

### Passo 3.3: Validar .env
```bash
# Verificar que .env.test está pronto (se fizer teste local)
cat .env.test

# Deve ter todas as credenciais necessárias
```

---

## 📤 FASE 4: UPLOAD INCREMENTAL COM RSYNC (EC2)

### Passo 4.1: Preparar rsync
```bash
# Windows PowerShell - Verificar se tem rsync
rsync --version

# Se não tiver, instalar via WSL ou Git Bash
# ou usar SCP alternativo
```

### Passo 4.2: Upload Frontend (apenas mudanças)
```bash
# Fazer BACKUP primeiro (IMPORTANTE!)
ssh -i "chave.pem" ubuntu@seu-ip-ec2 "cd /home/ubuntu && tar -czf dist-backup-$(date +%Y%m%d-%H%M%S).tar.gz dist/ 2>/dev/null || echo 'Sem backup anterior'"

# Upload com rsync (apenas arquivos modificados)
rsync -avz --delete -e "ssh -i C:\aws\sua-chave.pem" dist/ ubuntu@seu-ip-ec2:/home/ubuntu/dist/

# Parâmetros:
# -a: archive (preserva permissões, timestamps)
# -v: verbose (mostra progresso)
# -z: compress (comprime durante transfer)
# --delete: remove arquivos que não existem localmente
# -e: especificar SSH

# Validar upload
ssh -i "chave.pem" ubuntu@seu-ip-ec2 "ls -la /home/ubuntu/dist/ | head -20"
```

### Passo 4.3: Upload Backend (apenas mudanças)
```bash
# Fazer BACKUP primeiro
ssh -i "chave.pem" ubuntu@seu-ip-ec2 "cd /home/ubuntu && tar -czf server-backup-$(date +%Y%m%d-%H%M%S).tar.gz server/ 2>/dev/null || echo 'Sem backup'"

# Upload server/ (CUIDADO: não delete files)
rsync -avz -e "ssh -i C:\aws\sua-chave.pem" server/ ubuntu@seu-ip-ec2:/home/ubuntu/server/

# NÃO usar --delete em /server para não perder arquivos

# Validar upload
ssh -i "chave.pem" ubuntu@seu-ip-ec2 "ls -la /home/ubuntu/server/ | head -20"
```

### Passo 4.4: Upload package.json SE MUDOU
```bash
# Apenas se package.json ou package-lock.json foram alterados

# Upload
rsync -avz -e "ssh -i C:\aws\sua-chave.pem" package.json server/package.json server/package-lock.json ubuntu@seu-ip-ec2:/home/ubuntu/

# Validar
ssh -i "chave.pem" ubuntu@seu-ip-ec2 "cat /home/ubuntu/package.json | head -10"
```

---

## 🔧 FASE 5: ATUALIZAR DEPENDÊNCIAS NA EC2

### Passo 5.1: Conectar na EC2
```bash
ssh -i "C:\aws\sua-chave.pem" ubuntu@seu-ip-ec2
```

### Passo 5.2: Verificar se package.json mudou
```bash
# Na EC2:
cd /home/ubuntu

# Comparar package.json com package-lock.json
diff <(cat package.json | jq -S .dependencies) <(cat server/package-lock.json | jq -S '.packages."".dependencies' 2>/dev/null) || echo "Mudanças detectadas"

# Mais simples: ver data de modificação
ls -la package.json server/package.json
stat package.json
```

### Passo 5.3: Instalar dependências SOMENTE se mudaram
```bash
# Na EC2:
cd /home/ubuntu/server

# Verificar versão de npm
npm --version

# Instalar APENAS se mudou package.json
npm install --omit=dev

# Validar instalação
npm list | head -20

# Verificar se criou node_modules
du -sh node_modules/
```

---

## ✅ FASE 6: VALIDAÇÕES PRÉ-RESTART

### Passo 6.1: Validar Nginx
```bash
# Na EC2:
sudo nginx -t

# Resultado esperado:
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Passo 6.2: Validar Backend (antes de restart)
```bash
# Na EC2:

# Ver se backend está rodando
pm2 status

# Ver logs atuais (sem erros)
pm2 logs aparecida-backend --lines 20 --nostream

# Verificar porta 3001
netstat -tlnp | grep 3001

# Testar se responde
curl http://localhost:3001/health
```

### Passo 6.3: Validar Frontend
```bash
# Na EC2:

# Verificar que dist/ foi atualizado
ls -la dist/ | head -10

# Verificar permissões
ls -ld dist/

# Resultado esperado:
# drwxr-xr-x ubuntu:ubuntu
```

### Passo 6.4: Ver erros no Nginx
```bash
# Na EC2:
tail -20 /var/log/nginx/error.log

# Se tiver algo, investigar ANTES de restart
```

---

## 🚀 FASE 7: RESTART SEGURO

### Passo 7.1: Fazer backup de estado
```bash
# Na EC2:

# Salvar estado atual
pm2 save

# Listar apps
pm2 list
```

### Passo 7.2: Restart do Backend
```bash
# Na EC2:

# Opção 1: Restart gradual (recomendado)
pm2 restart aparecida-backend --wait-ready

# Opção 2: Restart normal
pm2 restart aparecida-backend

# Aguardar 5 segundos
sleep 5
```

### Passo 7.3: Reload do Nginx
```bash
# Na EC2:

# Recarregar (sem parar)
sudo systemctl reload nginx

# Validar
sudo systemctl status nginx
```

---

## 🧪 FASE 8: VALIDAÇÕES PÓS-DEPLOY

### Passo 8.1: Backend está respondendo?
```bash
# Na EC2:

# Testar health
curl http://localhost:3001/health

# Deve retornar: {"status":"ok"}
```

### Passo 8.2: Frontend está acessível?
```bash
# Local (seu computador):

# Testar em browser
curl -I https://seu-dominio.com.br

# Deve retornar: HTTP/2 200

# Ou fazer download de index.html
curl https://seu-dominio.com.br | head -20
```

### Passo 8.3: API funciona de ponta a ponta?
```bash
# Local:

# Testar chamada API via domínio
curl https://seu-dominio.com.br/api/health

# Deve retornar resposta do backend
```

### Passo 8.4: Ver logs
```bash
# Na EC2:

# Logs do backend
pm2 logs aparecida-backend --lines 50

# Logs do Nginx
sudo tail -50 /var/log/nginx/access.log
sudo tail -50 /var/log/nginx/error.log
```

### Passo 8.5: Monitorar por erros
```bash
# Na EC2:

# Monitor em tempo real (30 segundos)
pm2 monit &
sleep 30
killall pm2

# Ou ver status
pm2 status
```

---

## ⚠️ SE ALGO DEU ERRADO

### Rollback Frontend
```bash
# Na EC2:
cd /home/ubuntu

# Listar backups
ls -lh dist-backup-*.tar.gz

# Restaurar backup
rm -rf dist/
tar -xzf dist-backup-DATAMAISRECENTE.tar.gz

# Recarregar nginx
sudo systemctl reload nginx
```

### Rollback Backend
```bash
# Na EC2:
cd /home/ubuntu

# Listar backups
ls -lh server-backup-*.tar.gz

# Restaurar backup
rm -rf server/
tar -xzf server-backup-DATAMAISRECENTE.tar.gz

# Reinstalar dependências
cd server
npm install --omit=dev

# Reiniciar
pm2 restart aparecida-backend
```

### Se banco de dados ficou em estado inconsistente
```bash
# Contactar desenvolvedor ou Supabase support
# Banco está em Supabase remoto, não é afetado pelo deploy local

# Ver logs do Supabase:
# supabase.com → seu projeto → Logs
```

---

## 📊 CHECKLIST DEPLOY INCREMENTAL

### Antes de começar
- [ ] Não tem mudanças não commitadas no Git
- [ ] Todas as mudanças estão em branches mergeadas
- [ ] Package.json/lock está sincronizado
- [ ] .env na EC2 está intacto
- [ ] Backup do estado atual tomado

### Frontend
- [ ] `npm run build` executado com sucesso
- [ ] Arquivos em `dist/` foram validados
- [ ] Teste local passou (npm run preview)
- [ ] Backup de dist/ criado na EC2
- [ ] Upload com rsync completado
- [ ] Arquivos validados na EC2

### Backend
- [ ] Mudanças em `/server` validadas
- [ ] Sintaxe JavaScript verificada
- [ ] Backup de /server/ criado
- [ ] Upload com rsync completado
- [ ] Arquivos validados na EC2
- [ ] Dependências atualizadas (se necessário)

### Validações
- [ ] nginx -t retorna sucesso
- [ ] PM2 status OK
- [ ] Backend responde em http://localhost:3001/health
- [ ] Frontend carrega sem erro em https://seu-dominio.com.br
- [ ] API responde em https://seu-dominio.com.br/api/health
- [ ] Logs sem erros

### Pós-Deploy
- [ ] Monitorar por 5 minutos
- [ ] Validar funcionalidades críticas
- [ ] Verificar logs periodicamente
- [ ] Documentar mudanças

---

## 🎯 RESUMO RÁPIDO (Deploy Incremental)

```
1. LOCAL:
   npm run build
   git diff (identificar mudanças)

2. BACKUP:
   ssh → tar -czf backup

3. UPLOAD:
   rsync -avz dist/
   rsync -avz server/

4. EC2:
   npm install (se package mudou)
   nginx -t
   pm2 restart aparecida-backend

5. VALIDAÇÃO:
   curl http://localhost:3001/health
   curl https://seu-dominio.com.br/api/health
   Ver logs

6. ROLLBACK (se necessário):
   tar -xzf backup
   pm2 restart aparecida-backend
```

---

## 🛠️ DIFERENÇAS: INCREMENTAL vs COMPLETO

| Aspecto | Incremental | Completo |
|---------|-------------|----------|
| **Tempo** | 5-10 min | 30 min |
| **Downtime** | 5-10 sec | 30 sec |
| **Risco** | Baixo | Médio |
| **Controle** | Máximo | Médio |
| **Caso uso** | Hotfixes | Novo deploy |
| **npm install** | Só se mudou | Sempre |
| **Backup** | Automático | Manual |

---

## 📝 COMANDOS ESSENCIAIS

```bash
# Fazer diff
git diff --name-only HEAD~5..HEAD

# Build
npm run build

# Backup na EC2
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz folder/

# Upload rsync
rsync -avz -e "ssh -i chave.pem" local/ ubuntu@ip:/remote/

# Validar nginx
sudo nginx -t

# Restart PM2
pm2 restart aparecida-backend

# Ver logs
pm2 logs aparecida-backend --lines 50

# Health check
curl http://localhost:3001/health
```

---

**⚠️ LEMBRE-SE: Máximo cuidado com produção!**
