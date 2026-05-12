# 🎯 COMECE AQUI - 3 PASSOS PARA DEPLOY

## Olá! Tudo está pronto. Você precisa fazer apenas 3 passos:

---

## ⚡ PASSO 1: PREPARAR LOCALMENTE (Seu Computador)

**Abra PowerShell e execute:**

```powershell
cd C:\projetos\aparecida
.\deploy-prepare.ps1
```

**O que faz:**
- ✅ Faz build do React (Vite)
- ✅ Instala dependências
- ✅ Valida tudo
- ✅ Compacta em ZIP (~40MB)

**Tempo:** 5 minutos

**Resultado esperado:** Arquivo `aparecida-prod.zip` criado

---

## 📤 PASSO 2: FAZER UPLOAD PARA EC2

**Execute no PowerShell:**

```powershell
# Substitua seu-ip-ec2 e caminho da chave

scp -i "C:\aws\sua-chave.pem" aparecida-prod.zip ubuntu@seu-ip-ec2:/home/ubuntu/

scp -i "C:\aws\sua-chave.pem" deploy-ec2-setup.sh ubuntu@seu-ip-ec2:/home/ubuntu/
```

**Tempo:** 5 minutos

---

## 🚀 PASSO 3: EXECUTAR SETUP NA EC2

**Via SSH:**

```bash
ssh -i "C:\aws\sua-chave.pem" ubuntu@seu-ip-ec2

# Na EC2:
cd /home/ubuntu
unzip -q aparecida-prod.zip
chmod +x deploy-ec2-setup.sh
bash deploy-ec2-setup.sh seu-dominio.com.br
```

**O script faz automaticamente:**
- ✅ Instala Node.js, PM2, Nginx, Certbot
- ✅ Configura backend com PM2
- ✅ Configura frontend estático
- ✅ Configura Nginx
- ✅ Gera certificado SSL Let's Encrypt
- ✅ Inicia tudo

**Tempo:** 10 minutos

**Resultado:** Site online em `https://seu-dominio.com.br`

---

## ✏️ PASSO 4: ADICIONAR CREDENCIAIS (IMPORTANTE!)

Ainda na EC2:

```bash
nano /home/ubuntu/.env

# Adicionar valores REAIS:
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
EMAIL_FROM=noreply@seu-dominio.com.br

# Salvar: CTRL+X → Y → ENTER
```

Depois reiniciar:
```bash
pm2 restart aparecida-backend
```

---

## ✅ VALIDAÇÃO FINAL

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs aparecida-backend --lines 50

# No browser:
https://seu-dominio.com.br
# Deve carregar sem erro e sem SSL warning
```

---

## 📚 DOCUMENTAÇÃO DISPONÍVEL

Se precisar de ajuda ou mais detalhes:

| Documento | Para QUÊ |
|-----------|----------|
| `RESUMO_EXECUTIVO_DEPLOY.md` | Visão geral arquitetura |
| `CHECKLIST_DEPLOY_EC2.md` | Checklist rápido |
| `GUIA_DEPLOY_EC2_UBUNTU.md` | Todos os comandos em detalhe |
| `GUIA_SSH_SCP.md` | Como conectar SSH e fazer upload |
| `TESTE_LOCAL_PRE_DEPLOY.md` | Testar localmente antes |
| `INDICE_COMPLETO_DEPLOYMENT.md` | Mapa de tudo |
| `DEPLOY_COMPLETO_PRONTO.md` | Resumo final |

---

## 🆘 PROBLEMAS COMUNS

### "Permission denied (publickey)"
→ Chave SSH caminho ou permissões incorretas  
→ Leia: `GUIA_SSH_SCP.md`

### "Backend não conecta ao Supabase"
→ .env não tem SUPABASE_URL/SERVICE_KEY  
→ Editar: `nano /home/ubuntu/.env`

### "Frontend carrega mas API retorna erro"
→ Verificar logs: `pm2 logs aparecida-backend`

### "HTTPS com SSL warning"
→ Aguardar certificado ser gerado (até 5 min)  
→ Verificar: `sudo certbot certificates`

---

## ⏱️ TEMPO TOTAL

| Etapa | Tempo |
|-------|-------|
| Preparação local | 5 min |
| Upload | 5 min |
| Setup EC2 | 10 min |
| Adicionar credenciais | 2 min |
| Validação | 3 min |
| **TOTAL** | **25 min** |

---

## 🎯 PÓS-DEPLOY (Próximas horas)

1. **Testar funcionalidades:**
   - Carregar página
   - Clicar em botões
   - Fazer buscas
   - Enviar formulários

2. **Testar integração Supabase:**
   - Verificar se dados carregam
   - Verificar se consegue salvar dados

3. **Testar Stripe (opcional):**
   - Fazer pagamento de teste
   - Verificar webhook

4. **Testar emails (opcional):**
   - Enviar email de teste
   - Verificar se chega

5. **Verificar logs:**
   - `pm2 logs aparecida-backend`
   - `/var/log/nginx/error.log`

---

## 📋 CHECKLIST PRÉ-DEPLOY

- [ ] EC2 Ubuntu rodando
- [ ] Security Group com 22, 80, 443 abertas
- [ ] Chave SSH (.pem) em C:\aws\
- [ ] Supabase URL pronta
- [ ] Supabase Service Key pronta
- [ ] Stripe Secret Key pronta
- [ ] Domínio apontando para IP EC2
- [ ] Arquivo deploy-prepare.ps1 testado
- [ ] aparecida-prod.zip criado (~40MB)

---

## 🎉 VOCÊ ESTÁ PRONTO!

**Próximo comando:**
```powershell
cd C:\projetos\aparecida
.\deploy-prepare.ps1
```

**Depois de criar o ZIP:**
```bash
scp -i "chave.pem" aparecida-prod.zip ubuntu@seu-ip-ec2:/home/ubuntu/
```

**Depois na EC2:**
```bash
bash deploy-ec2-setup.sh seu-dominio.com.br
```

---

## 💡 DICAS

- ✅ Teste localmente primeiro se quer segurança extra (TESTE_LOCAL_PRE_DEPLOY.md)
- ✅ Não esqueça de preencher .env com valores REAIS
- ✅ Se algo der errado, os logs são seus amigos (pm2 logs / nginx logs)
- ✅ Certificado SSL é grátis e automático
- ✅ Backend reinicia automaticamente em caso de falha

---

## 🚀 BOA SORTE!

Seu site estará online em menos de 30 minutos.

Se tiver dúvidas, leia os documentos de suporte criados para você.

**Todos os comandos, guias e scripts já estão prontos.**

---

*Criado com ❤️ para simplicidade máxima*
