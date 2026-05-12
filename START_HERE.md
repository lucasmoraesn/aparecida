# 🚀 COMECE AQUI - 2 MINUTOS

## Tudo pronto! Execute AGORA:

### Seu PC (PowerShell):
```powershell
cd C:\projetos\aparecida
.\deploy-incremental.ps1 -EC2IP seu-ip-ec2 -KeyPath C:\aws\chave.pem
```

**Substitua:**
- `seu-ip-ec2` → IP da sua EC2
- `C:\aws\chave.pem` → Caminho da sua chave SSH

### Na EC2 (após o script terminar):
```bash
bash post-deploy-validate.sh
```

### Pronto! 🎉

---

## Documentos Criados:

| Para Fazer | Leia |
|-----------|------|
| Fazer agora | DEPLOY_INCREMENTAL_RAPIDO.md |
| Tem dúvida qual usar | ESTRATEGIA_DEPLOYMENT.md |
| Ver todos | INDICE_DEPLOYMENT_TODOS.md |
| Entender tudo | DEPLOY_INCREMENTAL_SEGURO.md |
| Testar antes | TESTE_LOCAL_PRE_DEPLOY.md |

---

## Se deu erro:
```bash
bash post-deploy-rollback.sh
```

---

**Leia a documentação enquanto os scripts executam!**
