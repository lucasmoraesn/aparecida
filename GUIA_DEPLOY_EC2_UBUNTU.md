# GUIA COMPLETO DE DEPLOY - AWS EC2 Ubuntu

## 📋 PRÉ-REQUISITOS

### Você precisa ter:
- [ ] Uma instância EC2 Ubuntu 22.04 LTS (ou similar) rodando
- [ ] Acesso via SSH configurado
- [ ] Supabase URL e Service Key prontos
- [ ] Stripe Secret Key pronto
- [ ] AWS SES configurado (opcional, mas recomendado)
- [ ] Domínio configurado no Route 53 ou DNS apontando para EC2
- [ ] Security Group da EC2 com portas 22, 80, 443 abertas

---

## 🚀 FASE 1: PREPARAÇÃO LOCAL (Seu computador)

### Passo 1.1 - Validar estrutura local
```bash
# Execute este comando na raiz do projeto aparecida
cd c:\projetos\aparecida

# Verificar que .deployignore foi criado
type .deployignore

# Listar arquivos que serão enviados
# Os arquivos listados aqui é o que vai para EC2
```

### Passo 1.2 - Fazer build do frontend
```bash
# No diretório raiz do projeto
npm install

# Gerar build de produção (TypeScript + Vite)
npm run build

# Validar que a pasta dist foi criada
dir dist

# Resultado esperado: pasta "dist" com arquivos HTML/JS/CSS otimizados
```

### Passo 1.3 - Validar dependências do backend
```bash
cd server

# Ver versão do Node (deve ser 18+)
node --version

# Instalar dependências do backend
npm install

# Validar que package-lock.json foi criado
ls -la

cd ..
```

### Passo 1.4 - Criar arquivo .env de produção local (para referência)
```bash
# Copiar arquivo de exemplo
copy env.example env.prod.local

# Editar com seus valores de produção (NÃO será enviado, só para referência)
# - VITE_SUPABASE_URL
# - SUPABASE_SERVICE_KEY
# - STRIPE_SECRET_KEY
# - AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY (se usar SES)
```

### Passo 1.5 - Compactar apenas os arquivos necessários
```powershell
# PowerShell - Criar arquivo compactado

# Criar pasta temporária
$tempDir = "C:\temp\aparecida-prod"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

# Copiar estrutura necessária (sem .deployignore)
$filesToCopy = @(
    "dist",
    "public",
    "server",
    "package.json",
    "index.html"
)

foreach ($item in $filesToCopy) {
    if (Test-Path $item) {
        Copy-Item -Path $item -Destination "$tempDir\$item" -Recurse -Force
    }
}

# Compactar
Compress-Archive -Path "$tempDir\*" -DestinationPath "aparecida-prod.zip" -Force

# Validar tamanho (deve ser < 50MB com node_modules removidos)
(Get-Item "aparecida-prod.zip").Length / 1MB

# Limpar temporário
Remove-Item -Path $tempDir -Recurse -Force
```

**✅ Checkpoint 1:** Você deve ter um arquivo `aparecida-prod.zip` < 50MB

---

## 📤 FASE 2: UPLOAD PARA EC2

### Passo 2.1 - Fazer upload do arquivo zip
```bash
# Use SCP ou S3. Exemplo com SCP:
# Substitua seu-ip-ec2 e caminho da chave

scp -i "C:\caminho\sua-chave.pem" aparecida-prod.zip ubuntu@seu-ip-ec2:/home/ubuntu/

# Ou usando S3 (melhor para arquivos grandes):
aws s3 cp aparecida-prod.zip s3://seu-bucket/deploy/
```

---

## 🔧 FASE 3: CONFIGURAÇÃO NA EC2 (Execute via SSH)

### Passo 3.1 - Conectar na EC2
```bash
ssh -i "C:\caminho\sua-chave.pem" ubuntu@seu-ip-ec2
```

### Passo 3.2 - Preparar servidor
```bash
# Atualizar pacotes do Ubuntu
sudo apt-get update
sudo apt-get upgrade -y

# Instalar Node.js 18 (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Instalar Nginx
sudo apt-get install -y nginx

# Instalar Certbot para HTTPS
sudo apt-get install -y certbot python3-certbot-nginx

# Verificar instalações
node --version  # v18.x.x
npm --version   # 9.x.x
pm2 --version   # 5.x.x
```

### Passo 3.3 - Descompactar arquivo
```bash
# Navegar para home
cd /home/ubuntu

# Descompactar (se enviou via SCP)
unzip -q aparecida-prod.zip
rm aparecida-prod.zip

# Ou, se enviou para S3
aws s3 cp s3://seu-bucket/deploy/aparecida-prod.zip .
unzip -q aparecida-prod.zip
rm aparecida-prod.zip

# Resultado:
ls -la
# deve ter: dist  public  server  package.json  index.html
```

### Passo 3.4 - Instalar dependências do backend
```bash
cd /home/ubuntu/server

# Instalar dependências de produção
npm install --omit=dev

# Validar instalação
npm list | head -20
```

### Passo 3.5 - Criar arquivo .env de produção
```bash
# Voltar para pasta raiz
cd /home/ubuntu

# Criar arquivo .env
sudo tee .env > /dev/null <<EOF
# ============================================
# SUPABASE CONFIGURATION
# ============================================
VITE_SUPABASE_URL=sua_url_supabase_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_URL=sua_url_supabase_aqui
SUPABASE_SERVICE_KEY=sua_service_key_aqui

# ============================================
# STRIPE CONFIGURATION
# ============================================
STRIPE_SECRET_KEY=sk_live_sua_chave_aqui
STRIPE_WEBHOOK_SECRET=whsec_sua_webhook_secret_aqui

# ============================================
# AWS SES (Emails)
# ============================================
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=sua_access_key_aqui
AWS_SECRET_ACCESS_KEY=sua_secret_key_aqui
EMAIL_FROM=noreply@aparecida.com.br
VITE_ADMIN_EMAIL=admin@aparecida.com.br

# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=production
PORT=3001
EOF

# Validar arquivo criado
cat .env
```

---

## 🚀 FASE 4: INICIAR APLICAÇÃO COM PM2

### Passo 4.1 - Criar arquivo de configuração PM2
```bash
# Criar arquivo de configuração
sudo tee /home/ubuntu/ecosystem.config.js > /dev/null <<EOF
module.exports = {
  apps: [
    {
      name: 'aparecida-backend',
      script: './server/index.js',
      cwd: '/home/ubuntu',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/pm2/aparecida-error.log',
      out_file: '/var/log/pm2/aparecida-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      ignore_watch: ['node_modules', 'dist'],
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '30s'
    }
  ]
};
EOF

# Validar
cat /home/ubuntu/ecosystem.config.js
```

### Passo 4.2 - Iniciar aplicação com PM2
```bash
# Naveguar para pasta do projeto
cd /home/ubuntu

# Iniciar com PM2 usando arquivo de configuração
pm2 start ecosystem.config.js

# Validar que o processo está rodando
pm2 status
pm2 logs aparecida-backend --lines 50

# Configurar PM2 para iniciar no boot
pm2 startup
pm2 save

# Copiar comando de saída da linha anterior e executar:
# sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

### Passo 4.3 - Validar backend rodando
```bash
# Testar se backend está respondendo
curl http://localhost:3001

# Deve retornar algo como:
# {"message":"Aparecida Backend - Up and running","timestamp":"..."}

# Ou teste a rota de health
curl http://localhost:3001/health
```

**✅ Checkpoint 2:** Backend deve estar rodando em http://localhost:3001

---

## 🌐 FASE 5: CONFIGURAR NGINX COMO REVERSE PROXY

### Passo 5.1 - Criar configuração Nginx
```bash
# Criar arquivo de configuração
sudo tee /etc/nginx/sites-available/aparecida > /dev/null <<'EOF'
# Redirecionar HTTP para HTTPS
server {
    listen 80;
    server_name seu-dominio.com.br www.seu-dominio.com.br;
    
    # Certbot
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirecionar para HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name seu-dominio.com.br www.seu-dominio.com.br;
    
    # Certificados SSL (serão criados com Certbot)
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com.br/privkey.pem;
    
    # Configurações SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Compressão
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    gzip_min_length 1000;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Frontend React - Servir arquivos estáticos
    location / {
        root /home/ubuntu/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API Proxy
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files (public folder)
    location /images/ {
        root /home/ubuntu/public;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location /fonts/ {
        root /home/ubuntu/public;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Validar sintaxe nginx
sudo nginx -t
```

### Passo 5.2 - Habilitar site e testar
```bash
# Criar symlink
sudo ln -sf /etc/nginx/sites-available/aparecida /etc/nginx/sites-enabled/

# Remover default se necessário
sudo rm /etc/nginx/sites-enabled/default

# Validar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl restart nginx

# Verificar status
sudo systemctl status nginx
```

### Passo 5.3 - Configurar HTTPS com Let's Encrypt (Certbot)
```bash
# Primeiro editar o arquivo nginx para colocar seu domínio
# Substitua 'seu-dominio.com.br' no arquivo acima

# Gerar certificado SSL
sudo certbot certonly --nginx -d seu-dominio.com.br -d www.seu-dominio.com.br

# Você será solicitado para confirmar email

# Configurar renovação automática
sudo certbot renew --dry-run

# Validar que certificado foi criado
sudo ls -la /etc/letsencrypt/live/seu-dominio.com.br/
```

### Passo 5.4 - Recarregar Nginx com SSL
```bash
sudo systemctl restart nginx

# Testar
curl -I https://seu-dominio.com.br
# Deve retornar 200 OK
```

**✅ Checkpoint 3:** HTTPS deve estar funcionando e redirecionar HTTP

---

## 🧪 FASE 6: TESTES E VALIDAÇÃO

### Passo 6.1 - Testar frontend
```bash
# Via browser ou curl
curl -I https://seu-dominio.com.br

# Deve retornar 200 e arquivos HTML/CSS/JS
```

### Passo 6.2 - Testar backend
```bash
# Testar rota health
curl https://seu-dominio.com.br/api/health

# Deve retornar JSON com status "ok"
```

### Passo 6.3 - Verificar logs
```bash
# Ver logs do backend
pm2 logs aparecida-backend --lines 100

# Ver logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Passo 6.4 - Testar integração Supabase
```bash
# Fazer requisição que acesse banco de dados
curl -X GET https://seu-dominio.com.br/api/products \
  -H "Content-Type: application/json"

# Deve retornar dados do banco ou erro esperado
```

---

## 📋 FASE 7: PÓS-DEPLOY (Checklist)

- [ ] Frontend carregando corretamente em HTTPS
- [ ] Backend respondendo em /api/health
- [ ] Supabase conectando corretamente
- [ ] Stripe webhook funcionando (testar pagamento de teste)
- [ ] Emails sendo enviados via SES
- [ ] Logs sendo registrados corretamente
- [ ] DNS apontando para EC2
- [ ] Certificado SSL válido (renovação automática configurada)
- [ ] PM2 configurado para iniciar no boot
- [ ] Backups configurados (opcional)
- [ ] Monitoramento configurado (CloudWatch, opcional)

---

## 🚨 TROUBLESHOOTING

### Frontend não carrega
```bash
# Verificar se dist existe
ls -la /home/ubuntu/dist

# Verificar permissões
ls -ld /home/ubuntu/dist

# Verificar nginx logs
sudo tail -50 /var/log/nginx/error.log
```

### Backend não responde
```bash
# Verificar se PM2 está rodando
pm2 status

# Verificar logs do PM2
pm2 logs aparecida-backend --lines 200

# Tentar reiniciar
pm2 restart aparecida-backend

# Verificar porta 3001
netstat -tlnp | grep 3001
```

### Supabase não conecta
```bash
# Verificar .env
cat /home/ubuntu/.env | grep SUPABASE

# Testar conexão
node -e "require('dotenv').config(); console.log(process.env.SUPABASE_URL)"
```

---

## 📈 SCALING E OTIMIZAÇÃO (Futuro)

- Usar AWS CloudFront para CDN
- Configurar RDS para Postgres (já está com Supabase, mas backup)
- Auto-scaling group para múltiplas instâncias
- Load balancer (ALB/NLB)
- CloudWatch para monitoramento
- S3 para armazenar imagens
- ElastiCache para cache

