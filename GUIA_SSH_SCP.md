# GUIA SSH E UPLOAD SCP - EC2 AWS

## 📋 PRÉ-REQUISITOS

- [ ] Chave SSH (.pem) salva em seu computador
- [ ] IP público da EC2
- [ ] Security Group com porta 22 aberta

---

## 🔑 CONFIGURAR CHAVE SSH (Primeira vez)

### Passo 1: Fazer Download da Chave
1. Abrir AWS Console
2. Ir em EC2 → Key Pairs
3. Selecionar sua chave
4. Download (arquivo .pem)
5. Guardar em local seguro, ex: `C:\aws\sua-chave.pem`

### Passo 2: Configurar Permissões (Windows)
```powershell
# PowerShell como Administrador

# Navegar até arquivo
cd C:\aws

# Ver propriedades
icacls sua-chave.pem

# Remover herança e deixar apenas seu usuário (importante!)
icacls sua-chave.pem /reset
icacls sua-chave.pem /grant:r "$env:USERNAME`:F"
icacls sua-chave.pem /inheritance:r

# Validar (deve ter só seu usuário com Full Control)
icacls sua-chave.pem
```

**Resultado esperado:**
```
sua-chave.pem USUARIO:(F)
```

### Passo 3: Converter .pem para PPK (PuTTY, opcional)
Se for usar PuTTY em vez de SSH nativo:

1. Download PuTTYgen
2. Abrir PuTTYgen
3. File → Load Private Key → sua-chave.pem
4. Save private key → sua-chave.ppk
5. Guardar .ppk

---

## 🌐 CONECTAR NA EC2 VIA SSH

### Opção 1: PowerShell (Nativo, Recomendado)
```powershell
# Encontrar IP público da EC2
# AWS Console → EC2 Instances → sua instância → Public IPv4

# Conectar
ssh -i "C:\aws\sua-chave.pem" ubuntu@seu-ip-ec2

# Exemplo:
ssh -i "C:\aws\aparecida.pem" ubuntu@54.123.45.67
```

**Primeira conexão:** Digitará "yes" para adicionar à known_hosts

### Opção 2: PuTTY (GUI)
1. Abrir PuTTY
2. Host Name: `ubuntu@seu-ip-ec2`
3. Connection → SSH → Auth
4. Browse → Selecionar sua-chave.ppk
5. Open

### Opção 3: Windows Terminal
```bash
ssh -i "C:\aws\sua-chave.pem" ubuntu@seu-ip-ec2
```

### Opção 4: VSCode
1. Instalar "Remote - SSH" extension
2. Abrir Command Palette (Ctrl+Shift+P)
3. Remote-SSH: Connect to Host
4. Colocar `ubuntu@seu-ip-ec2`
5. Selecionar chave SSH
6. Pronto! Pode editar arquivos direto

---

## 📤 UPLOAD DE ARQUIVOS (SCP)

### Comando SCP Básico
```bash
scp -i "caminho-chave" arquivo-local ubuntu@seu-ip-ec2:caminho-remoto
```

### Exemplo 1: Upload do ZIP
```powershell
# PowerShell no seu computador
cd C:\projetos\aparecida

# Fazer upload
scp -i "C:\aws\sua-chave.pem" aparecida-prod.zip ubuntu@54.123.45.67:/home/ubuntu/

# Resultado esperado (sem erro):
# aparecida-prod.zip          100%  45MB
```

### Exemplo 2: Upload do Script de Setup
```powershell
# Upload script bash
scp -i "C:\aws\sua-chave.pem" deploy-ec2-setup.sh ubuntu@54.123.45.67:/home/ubuntu/
```

### Exemplo 3: Upload múltiplos arquivos
```powershell
# Comprimir vários arquivos
Compress-Archive -Path deploy-prepare.ps1, deploy-ec2-setup.sh, GUIA_DEPLOY_EC2_UBUNTU.md -DestinationPath helpers.zip

# Upload
scp -i "C:\aws\sua-chave.pem" helpers.zip ubuntu@54.123.45.67:/home/ubuntu/
```

### Exemplo 4: Download de arquivo (remoto → local)
```powershell
# Download arquivo de logs
scp -i "C:\aws\sua-chave.pem" ubuntu@54.123.45.67:/var/log/nginx/error.log ./

# Salva em C:\projetos\aparecida\error.log
```

---

## 🔄 FLUXO COMPLETO: UPLOAD E SETUP

### Passo 1: Preparar localmente
```powershell
cd C:\projetos\aparecida

# Executar script de preparação
.\deploy-prepare.ps1

# Resultado: aparecida-prod.zip criado
```

### Passo 2: Upload do ZIP
```powershell
scp -i "C:\aws\sua-chave.pem" aparecida-prod.zip ubuntu@seu-ip-ec2:/home/ubuntu/

# Validar no EC2:
ssh -i "C:\aws\sua-chave.pem" ubuntu@seu-ip-ec2 ls -lh aparecida-prod.zip
```

### Passo 3: Upload do script de setup
```powershell
scp -i "C:\aws\sua-chave.pem" deploy-ec2-setup.sh ubuntu@seu-ip-ec2:/home/ubuntu/
```

### Passo 4: Conectar e descompactar
```bash
# Via SSH
ssh -i "C:\aws\sua-chave.pem" ubuntu@seu-ip-ec2

# Na EC2:
cd /home/ubuntu
unzip -q aparecida-prod.zip
ls -la

# Deve ter: dist, public, server, package.json, index.html
```

### Passo 5: Executar setup automático
```bash
# Ainda no SSH:
chmod +x deploy-ec2-setup.sh
bash deploy-ec2-setup.sh seu-dominio.com.br

# Aguardar conclusão (5-10 min)
```

---

## 📊 COMPARAÇÃO: UPLOAD MÉTODOS

| Método | Vantagem | Desvantagem |
|--------|----------|-----------|
| **SCP** | Rápido, nativo SSH | Linha comando |
| **WinSCP** | GUI, fácil | Aplicação extra |
| **AWS S3** | Bom para arquivos grandes | Precisa configurar bucket |
| **Rsync** | Bom para updates | Mais complexo |
| **GitHub** | Versionado, rastreável | Precisa committar |

### Recomendação: **SCP** (mais rápido e simples)

---

## 🆘 TROUBLESHOOTING SSH/SCP

### ❌ "Permission denied (publickey)"
```bash
# Chave incorreta ou caminho errado

# Validar:
1. Arquivo .pem existe e é legível
2. Permissões corretas: icacls sua-chave.pem
3. IP e usuário corretos: ubuntu@seu-ip-ec2
4. EC2 rodando
```

### ❌ "Connection timed out"
```bash
# Security Group sem porta 22

# Solução:
1. AWS Console → Security Groups
2. Adicionar inbound rule:
   - Type: SSH
   - Port: 22
   - Source: Your IP (ou 0.0.0.0/0 se tiver VPN)
3. Aguardar 30s e tentar novamente
```

### ❌ "No such file or directory"
```bash
# Caminho local ou remoto incorreto

# Validar:
scp -i chave.pem arquivo.zip ubuntu@ip:/home/ubuntu/
#                    ↑ arquivo existe?         ↑ remoto existe?
```

### ❌ "scp: command not found"
```bash
# SSH nativo do Windows não instalado

# Solução:
# Windows 10+: Já tem ssh nativo
# Se não tiver:
# - Usar PuTTY + WinSCP
# - Ou instalar OpenSSH pelo Windows Features
```

---

## ⚡ ATALHOS ÚTEIS

### Criar alias para SSH (PowerShell)
```powershell
# Adicionar ao perfil PowerShell:
# $PROFILE

# Adicionar linhas:
function Connect-EC2 {
    ssh -i "C:\aws\sua-chave.pem" ubuntu@seu-ip-ec2
}

function Upload-EC2 {
    param($file)
    scp -i "C:\aws\sua-chave.pem" $file ubuntu@seu-ip-ec2:/home/ubuntu/
}

# Usar:
Connect-EC2
Upload-EC2 aparecida-prod.zip
```

### Script PowerShell automático
```powershell
# Salvar como: deploy-to-ec2.ps1

param(
    [string]$IP = "seu-ip-ec2",
    [string]$KeyPath = "C:\aws\sua-chave.pem"
)

# Upload ZIP
Write-Host "Fazendo upload..."
scp -i $KeyPath aparecida-prod.zip ubuntu@${IP}:/home/ubuntu/

# Upload script
scp -i $KeyPath deploy-ec2-setup.sh ubuntu@${IP}:/home/ubuntu/

# Conectar e executar
Write-Host "Conectando e configurando..."
ssh -i $KeyPath ubuntu@${IP} "cd /home/ubuntu && unzip -q aparecida-prod.zip && chmod +x deploy-ec2-setup.sh && bash deploy-ec2-setup.sh seu-dominio.com.br"
```

**Uso:**
```powershell
.\deploy-to-ec2.ps1 -IP 54.123.45.67
```

---

## 📝 REFERÊNCIA RÁPIDA

```bash
# Conectar SSH
ssh -i "chave.pem" ubuntu@seu-ip-ec2

# Upload arquivo
scp -i "chave.pem" arquivo ubuntu@seu-ip-ec2:/home/ubuntu/

# Upload pasta
scp -i "chave.pem" -r pasta/ ubuntu@seu-ip-ec2:/home/ubuntu/

# Download arquivo
scp -i "chave.pem" ubuntu@seu-ip-ec2:/arquivo ./

# Executar comando remoto
ssh -i "chave.pem" ubuntu@seu-ip-ec2 "comando aqui"

# Ver logs em tempo real
ssh -i "chave.pem" ubuntu@seu-ip-ec2 "tail -f /var/log/arquivo.log"
```

---

## ✅ CHECKLIST PRÉ-DEPLOY

- [ ] Chave .pem obtida do AWS
- [ ] Permissões da chave configuradas (icacls)
- [ ] SSH testado: `ssh -i chave.pem ubuntu@ip` conecta OK
- [ ] SCP testado: consegue fazer upload de arquivo
- [ ] aparecida-prod.zip criado (~40MB)
- [ ] deploy-ec2-setup.sh pronto para upload
- [ ] EC2 IP público conhecida e acessível
- [ ] Security Group permite porta 22
- [ ] Domínio pronto para apontar para EC2

---

**Próximo passo:** Upload de arquivos + execute `deploy-ec2-setup.sh`
