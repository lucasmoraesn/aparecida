# 📦 Comandos de Deploy - Aparecida

## 🚀 Deploy Frontend (AWS - Production)

**Servidor:** `ubuntu@52.14.244.186`
**Caminho no servidor:** `/var/www/html`
**Certificado:** `C:\Users\Lucas\OneDrive\Documentos\aparecida-server.pem`

### Comando Rápido (PowerShell):
```powershell
.\deploy.ps1
```

### Passos Manuais (se rodar sem script):
```powershell
# 1. Build local
npm run build

# 2. Compactar
tar -czf frontend-update.tar.gz -C dist .

# 3. Enviar para servidor
scp -i "C:\Users\Lucas\OneDrive\Documentos\aparecida-server.pem" frontend-update.tar.gz ubuntu@52.14.244.186:/home/ubuntu/

# 4. Descompactar no servidor e atualizar permissões
ssh -i "C:\Users\Lucas\OneDrive\Documentos\aparecida-server.pem" ubuntu@52.14.244.186 `
  "sudo rm -rf /var/www/html/* && `
   sudo tar -xzf /home/ubuntu/frontend-update.tar.gz -C /var/www/html && `
   sudo chown -R www-data:www-data /var/www/html && `
   sudo rm /home/ubuntu/frontend-update.tar.gz"
```

---

## 🔧 Deploy Backend (AWS)

**Arquivo script:** `deploy-backend-hotfix.ps1`

```powershell
.\deploy-backend-hotfix.ps1
```

---

## 🏠 Deploy Hostinger (Alternativo)

Se precisar fazer deploy na Hostinger:

```powershell
.\deploy-hostinger.ps1
```

---

## 📋 Deploy Completo (Frontend + Backend)

Para fazer deploy de tudo de uma vez:

```powershell
.\deploy-completo.ps1
```

---

## ✅ Checklist Antes de Fazer Deploy

- [ ] Testes locais passando: `npm run build`
- [ ] Sem erros TypeScript
- [ ] Mudanças commitadas no Git
- [ ] Certificado SSH disponível em: `C:\Users\Lucas\OneDrive\Documentos\aparecida-server.pem`
- [ ] Conexão com internet estável

---

## 🔐 Dados de Conexão

| Campo | Valor |
|-------|-------|
| **IP Servidor** | `52.14.244.186` |
| **Usuário SSH** | `ubuntu` |
| **Chave SSH** | `aparecida-server.pem` |
| **Diretório Frontend** | `/var/www/html` |
| **Servidor Web** | Nginx |

---

## 🐛 Troubleshooting

### Erro: "Permission denied"
Verifique se o arquivo `.pem` tem as permissões corretas:
```powershell
# No Windows, geralmente não é necessário, mas se tiver problema:
# Use apenas a chave SSH especificada no comando
```

### Erro: "Permission denied (publickey)"
A chave SSH pode estar expirada ou incorreta. Verifique o caminho:
```powershell
# Confirme que o arquivo existe:
Test-Path "C:\Users\Lucas\OneDrive\Documentos\aparecida-server.pem"
```

### Build falha
Limpe dependências e reconstrua:
```powershell
rm -Recurse node_modules
npm install
npm run build
```

---

## 📝 Notas

- O deploy compacta apenas os arquivos em `dist/`
- Usa HTTPS com certificado SSL no servidor
- Nginx com reverse proxy para backend
- Logs disponíveis em `/var/log/nginx/`

---

**Última atualização:** March 10, 2026
