# 📊 ESTRATÉGIA DE DEPLOY - COMPLETO vs INCREMENTAL

## 🎯 Qual Deploy Usar?

---

## 📋 COMPARAÇÃO VISUAL

```
┌─────────────────────┬──────────────────┬──────────────────┐
│ Aspecto             │ Completo         │ Incremental      │
├─────────────────────┼──────────────────┼──────────────────┤
│ Tempo               │ 30-40 min        │ 10-15 min        │
│ Downtime            │ 30-60 seg        │ 5-10 seg         │
│ Risco               │ Médio            │ Muito Baixo      │
│ Controle            │ Médio            │ Máximo           │
│ Arquivos enviados   │ 100%             │ Apenas mudanças  │
│ npm install         │ Sempre           │ Se necessário    │
│ Backup              │ Manual           │ Automático       │
│ Rollback            │ Difícil          │ Um comando       │
│ Confirmações        │ Poucas           │ Muitas           │
└─────────────────────┴──────────────────┴──────────────────┘
```

---

## ✅ USE DEPLOY COMPLETO QUANDO:

### ✓ Primeira implantação
```
Primeira vez subindo para EC2
→ Use: deploy-ec2-setup.sh
→ Tempo: 50 minutos
→ Risco: Planejado e testado
```

### ✓ Mudança completa na arquitetura
```
Migrando de Webpack para Vite
Mudando estrutura de pastas
Refatorando projeto inteiro
→ Use: GUIA_DEPLOY_EC2_UBUNTU.md
→ Tempo: 1 hora
→ Risco: Médio mas calculado
```

### ✓ Atualização de Node.js ou dependências críticas
```
Atualizando Node 16 → 18
Atualizando Express major version
Mudando banco de dados
→ Use: Deploy Completo
→ Tempo: 1-2 horas
→ Risco: Alto, mas necessário
```

### ✓ Ambiente novo (staging, production, etc)
```
Novo servidor, nova EC2
→ Use: deploy-ec2-setup.sh
→ Tempo: 50 minutos
→ Risco: Zero (é novo)
```

---

## ⚡ USE DEPLOY INCREMENTAL QUANDO:

### ⚡ Hotfix rápido
```
Corrigir bug descoberto em produção
Mudança em 1-2 arquivos
Tipo: Bug crítico precisa subir hoje
→ Use: deploy-incremental.ps1
→ Tempo: 10 minutos
→ Risco: Muito baixo
```

### ⚡ Feature pequena finalizada
```
Adicionar novo componente React
Criar nova rota backend
Mudança em < 5 arquivos
→ Use: deploy-incremental.ps1
→ Tempo: 10-15 minutos
→ Risco: Muito baixo
```

### ⚡ Atualizações de CSS/UI
```
Melhorar visual
Corrigir layout
Mudar cores/fonts
→ Use: deploy-incremental.ps1
→ Tempo: 5 minutos
→ Risco: Muito baixo
```

### ⚡ Atualizações de copy (textos)
```
Corrigir texto no site
Atualizar descrições
Mudança em strings
→ Use: deploy-incremental.ps1
→ Tempo: 5 minutos
→ Risco: Muito baixo
```

### ⚡ Atualizações de API endpoints
```
Adicionar novo endpoint
Corrigir lógica de rota
Mudança no backend
→ Use: deploy-incremental.ps1
→ Tempo: 10 minutos
→ Risco: Muito baixo
```

---

## 🎓 EXEMPLOS PRÁTICOS

### Exemplo 1: Corrigir Typo
```
Cenário: Usuário viu erro no site
Mudança: 1 arquivo (src/components/Header.tsx)
Estratégia: Deploy Incremental
Tempo: 5 minutos
Risco: Muito baixo

npm run build
rsync dist/
post-deploy-validate.sh
✅ Corrigido!
```

### Exemplo 2: Novo Feature
```
Cenário: Feature de dashboard pronta
Mudanças: 5 arquivos (src/pages/Dashboard.tsx, etc)
Estratégia: Deploy Incremental
Tempo: 15 minutos
Risco: Muito baixo

Validações:
- Build OK
- Backend OK (se mudou)
- Teste local OK
Deploy incremental
✅ Feature live!
```

### Exemplo 3: Atualização de Dependência
```
Cenário: Stripe SDK atualizado
Mudanças: package.json, server/payments/*
Estratégia: Deploy Incremental
Tempo: 20 minutos
Risco: Baixo-Médio

Considerar:
- npm install necessário
- Validação extra no backend
- Testar pagamentos
Deploy incremental com validações extra
✅ Atualizado!
```

### Exemplo 4: Servidor Novo
```
Cenário: Migrar para EC2 nova
Mudanças: Tudo (primeiríssima vez)
Estratégia: Deploy Completo
Tempo: 50 minutos
Risco: Planejado

Use: deploy-ec2-setup.sh
Resultado: Sistema completo
✅ Novo servidor online!
```

### Exemplo 5: Mudança Crítica no Backend
```
Cenário: Mudar autenticação
Mudanças: Muitos arquivos de backend
Estratégia: Deploy Incremental (mais seguro) com extra validações
Tempo: 20 minutos
Risco: Médio

Passos:
1. Teste local completo (TESTE_LOCAL_PRE_DEPLOY.md)
2. Deploy incremental
3. Validações extra (health checks + testes API)
4. Monitorar 15 minutos
✅ Mudança crítica online!
```

---

## 🚨 MATRIZ DE DECISÃO

```
┌─────────────────────────────┬───────────────┬──────────────┐
│ Pergunta                    │ SIM → Completo│ NÃO → Incr.  │
├─────────────────────────────┼───────────────┼──────────────┤
│ É primeira implantação?     │ ✓ Completo    │ ➜            │
│ Mudou Node/npm/deps major?  │ ✓ Completo    │ ➜            │
│ Mudou arquitetura sistema?  │ ✓ Completo    │ ➜            │
│ Refatorou tudo?             │ ✓ Completo    │ ➜            │
│                             │               │              │
│ É hotfix < 5 arquivos?      │ ➜             │ ✓ Incremental│
│ Nova feature < 10 arquivos? │ ➜             │ ✓ Incremental│
│ Mudança CSS/UI?             │ ➜             │ ✓ Incremental│
│ Apenas strings/copy?        │ ➜             │ ✓ Incremental│
│ Novo endpoint API?          │ ➜             │ ✓ Incremental│
└─────────────────────────────┴───────────────┴──────────────┘
```

---

## 🔍 CHECKLIST: Qual Strategy Usar?

### Responda estas perguntas:

1. **É a primeira vez subindo?**
   - SIM → Deploy Completo
   - NÃO → Próxima pergunta

2. **Mudou dependências (package.json)?**
   - SIM → Deploy Completo (mais seguro)
   - NÃO → Próxima pergunta

3. **Mudou mais de 10 arquivos?**
   - SIM → Deploy Completo
   - NÃO → Deploy Incremental

4. **Precisa mudar configuração server?**
   - SIM → Deploy Completo
   - NÃO → Deploy Incremental

5. **É um hotfix urgente?**
   - SIM → Deploy Incremental
   - NÃO → Choose based on risk level

---

## 📊 GUIA RÁPIDO

### Quando tem dúvida:
```
Use Deploy Incremental com validações extra
- Menos risco
- Pode fazer rollback fácil
- Mais controle
```

### Checklist de Segurança:
```
Antes de Deploy Incremental:
[ ] Teste local passou
[ ] Build OK
[ ] Sem erros de sintaxe
[ ] Dependências OK (se mudou)
[ ] .env intacto
[ ] Backup criado
```

---

## 🔄 WORKFLOW RECOMENDADO

### Seu Dia de Desenvolvimento:
```
1. Fazer mudanças localmente
2. Committar no Git
3. Fazer teste local (TESTE_LOCAL_PRE_DEPLOY.md)
4. Se passou:
   → Deploy Incremental (10-15 min)
5. Se falhou:
   → Corrigir localmente
   → Retry
```

### Para Hotfixes Urgentes:
```
1. Bug descoberto em produção
2. Fix rápida (< 30 min)
3. Teste local validação (5 min)
4. Deploy Incremental (5 min)
5. Monitorar (5 min)
Total: 15 minutos!
```

### Para Features Grandes:
```
1. Desenvolvimento (horas/dias)
2. Teste local completo (30 min)
3. Code review (15 min)
4. Deploy Incremental (15 min)
5. Validação QA (30 min)
```

---

## 💡 DICAS PRO

✅ **Sempre teste localmente antes** (TESTE_LOCAL_PRE_DEPLOY.md)  
✅ **Use dry-run para ver o que vai acontecer** (deploy-incremental.ps1 -DryRun)  
✅ **Faça backup automático** (scripts fazem sozinhos)  
✅ **Tenha rollback pronto** (um comando: post-deploy-rollback.sh)  
✅ **Monitore 5 minutos após deploy**  
✅ **Documente tudo** (git commit mensagens claras)  

---

## 🎯 DECISÃO FINAL

| Situação | Estratégia | Tempo |
|----------|-----------|-------|
| Primeira vez | Completo | 50 min |
| Hotfix bug | Incremental | 10 min |
| Nova feature | Incremental | 15 min |
| UI/CSS | Incremental | 5 min |
| Novo server | Completo | 50 min |
| Atualizar deps | Completo ou Incremental* | 20-40 min |
| Refatorar tudo | Completo | 1-2 horas |

*Depende da mudança

---

## 🚀 PRÓXIMAS AÇÕES

### Para Deploy Completo:
```
Seguir: GUIA_DEPLOY_EC2_UBUNTU.md
```

### Para Deploy Incremental:
```
Seguir: DEPLOY_INCREMENTAL_RAPIDO.md
Executar: deploy-incremental.ps1
```

### Para Testar Localmente:
```
Seguir: TESTE_LOCAL_PRE_DEPLOY.md
```

---

**Escolha a estratégia que melhor se encaixa no seu caso!**
