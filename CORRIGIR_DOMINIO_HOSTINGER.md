# 🔧 CORRIGIR DOMÍNIO - HOSTINGER

## 🎯 Problema Identificado

O domínio `aparecidadonortesp.com.br` está sendo servido pelo **hPanel da Hostinger**, não pelo **Nginx** que configuramos.

Por isso:
- ✅ A API funciona pelo IP: `http://72.60.251.96/api/health`
- ❌ A API NÃO funciona pelo domínio: `http://aparecidadonortesp.com.br/api/health`
- ❌ O frontend não consegue acessar `/api/plans`

---

## 🚀 Solução: Desativar o Site no hPanel

### OPÇÃO 1: Via hPanel (Recomendado)

1. **Acesse o hPanel da Hostinger**
   - URL: https://hpanel.hostinger.com
   - Faça login com suas credenciais

2. **Vá até "Websites"**
   - Procure pelo site `aparecidadonortesp.com.br`

3. **Remova ou Desative o Site**
   - Clique em "Gerenciar"
   - Procure pela opção "Excluir site" ou "Desativar"
   - Ou mude o DocumentRoot para `/var/www/frontend/dist`

4. **Aguarde alguns minutos**
   - O hPanel pode levar alguns minutos para aplicar as mudanças

---

### OPÇÃO 2: Forçar Apache a Parar (Via SSH)

Se o hPanel estiver usando Apache, podemos pará-lo:

```bash
ssh root@72.60.251.96

# Verificar se Apache está rodando
systemctl status apache2

# Parar Apache (se estiver rodando)
systemctl stop apache2
systemctl disable apache2

# Garantir que Nginx está rodando
systemctl status nginx
systemctl restart nginx
```

---

### OPÇÃO 3: Mudar a Porta do Apache

Se você não pode parar o Apache, mude sua porta:

```bash
ssh root@72.60.251.96

# Editar arquivo de portas do Apache
nano /etc/apache2/ports.conf

# Mudar de:
# Listen 80
# Para:
# Listen 8080

# Salvar: Ctrl+O, Enter, Ctrl+X

# Reiniciar Apache
systemctl restart apache2

# Garantir que Nginx está na porta 80
systemctl restart nginx
```

---

### OPÇÃO 4: Configurar Virtual Host no hPanel

Se você quer manter o hPanel ativo:

1. No hPanel, vá em **Advanced** > **Apache Configuration**
2. Adicione um arquivo de configuração:

```apache
<VirtualHost *:80>
    ServerName aparecidadonortesp.com.br
    ServerAlias www.aparecidadonortesp.com.br
    
    # Redirecionar para Nginx
    ProxyPass / http://127.0.0.1:8080/
    ProxyPassReverse / http://127.0.0.1:8080/
</VirtualHost>
```

3. Configure o Nginx para rodar na porta 8080

---

## 🧪 Como Testar

Depois de aplicar a solução, teste:

### 1. Testar a API pelo domínio

```powershell
# Do seu computador
Invoke-WebRequest http://aparecidadonortesp.com.br/api/health
```

Deve retornar:
```json
{"ok":true}
```

### 2. Testar no navegador

Abra: http://aparecidadonortesp.com.br/api/health

Deve mostrar: `{"ok":true}`

### 3. Testar os planos

Abra: http://aparecidadonortesp.com.br/api/plans

Deve retornar uma lista de planos em JSON.

---

## 🔍 Verificar o Que Está Servindo o Domínio

```bash
ssh root@72.60.251.96

# Ver qual processo está na porta 80
netstat -tuln | grep ':80'

# Ver qual processo está usando a porta
lsof -i :80

# Ou
ss -tlnp | grep :80
```

Se aparecer **Apache** ou **httpd**, você precisa desativá-lo.

Se aparecer **nginx**, está correto!

---

## ✅ Confirmação de Sucesso

Quando tudo estiver funcionando:

1. ✅ `http://aparecidadonortesp.com.br/api/health` retorna `{"ok":true}`
2. ✅ `http://aparecidadonortesp.com.br/api/plans` retorna JSON com planos
3. ✅ O frontend consegue carregar os planos sem erro
4. ✅ O console do navegador não mostra mais `ERR_CONNECTION_REFUSED`

---

## 📞 Caso Ainda Não Funcione

Se após essas mudanças ainda não funcionar:

1. **Limpe o cache do navegador**
   - Ctrl + Shift + Delete
   - Marque "Cached images and files"
   - Limpar dados

2. **Teste em modo anônimo**
   - Ctrl + Shift + N (Chrome)
   - Ctrl + Shift + P (Firefox)

3. **Aguarde propagação DNS**
   - Pode levar até 24h (geralmente é instantâneo)

4. **Verifique os logs**
   ```bash
   ssh root@72.60.251.96
   
   # Logs do Nginx
   tail -f /var/log/nginx/access.log
   tail -f /var/log/nginx/error.log
   
   # Logs do Backend
   pm2 logs aparecida-backend
   ```

---

## 🎯 Próximos Passos (Após Corrigir)

1. ✅ Testar cadastro de negócios
2. ✅ Testar checkout com Stripe
3. ✅ Configurar SSL/HTTPS (Let's Encrypt)
4. ✅ Configurar webhook do Stripe
