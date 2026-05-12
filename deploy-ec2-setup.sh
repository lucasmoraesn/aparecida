#!/bin/bash

# Script de Deploy Automático - Aparecida na EC2 Ubuntu
# Execute na EC2 após descompactar aparecida-prod.zip
# Uso: bash deploy-ec2-setup.sh seu-dominio.com.br

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de output
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# ============================================
# Validações
# ============================================
print_header "VALIDAÇÃO PRÉ-REQUISITOS"

# Verificar se é Ubuntu/Debian
if ! grep -q "Ubuntu\|Debian" /etc/os-release; then
    print_error "Este script é para Ubuntu/Debian. Sistema detectado:"
    cat /etc/os-release | grep PRETTY_NAME
    exit 1
fi

print_success "Sistema operacional compatível"

# Verificar se rodando como ubuntu
if [ "$USER" != "ubuntu" ] && [ "$EUID" -eq 0 ]; then
    print_warning "Rodando como root. Recomenda-se como ubuntu."
fi

# Verificar domínio
if [ -z "$1" ]; then
    print_error "Domínio não fornecido"
    echo "Uso: bash deploy-ec2-setup.sh seu-dominio.com.br"
    exit 1
fi

DOMAIN="$1"
print_info "Domínio: $DOMAIN"

# Verificar se aparecida-prod.zip foi descompactado
if [ ! -d "$HOME/server" ] || [ ! -d "$HOME/dist" ]; then
    print_error "Pasta 'server' e 'dist' não encontradas"
    print_info "Execute: unzip aparecida-prod.zip"
    exit 1
fi

print_success "Estrutura de arquivos validada"

# ============================================
# FASE 1: Atualizar sistema
# ============================================
print_header "FASE 1: ATUALIZAÇÃO DO SISTEMA"

print_info "Atualizando pacotes (pode levar alguns minutos)..."
sudo apt-get update > /dev/null 2>&1
sudo apt-get upgrade -y > /dev/null 2>&1

print_success "Sistema atualizado"

# ============================================
# FASE 2: Instalar Node.js
# ============================================
print_header "FASE 2: INSTALAÇÃO NODE.JS"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_info "Node.js já instalado: $NODE_VERSION"
else
    print_info "Instalando Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - > /dev/null 2>&1
    sudo apt-get install -y nodejs > /dev/null 2>&1
    print_success "Node.js instalado: $(node --version)"
fi

print_success "npm: $(npm --version)"

# ============================================
# FASE 3: Instalar PM2
# ============================================
print_header "FASE 3: INSTALAÇÃO PM2"

if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    print_info "PM2 já instalado: v$PM2_VERSION"
else
    print_info "Instalando PM2..."
    sudo npm install -g pm2 > /dev/null 2>&1
    print_success "PM2 instalado: $(pm2 --version)"
fi

# ============================================
# FASE 4: Instalar Nginx
# ============================================
print_header "FASE 4: INSTALAÇÃO NGINX"

if command -v nginx &> /dev/null; then
    print_info "Nginx já instalado"
else
    print_info "Instalando Nginx..."
    sudo apt-get install -y nginx > /dev/null 2>&1
    sudo systemctl enable nginx
    print_success "Nginx instalado"
fi

# ============================================
# FASE 5: Instalar Certbot
# ============================================
print_header "FASE 5: INSTALAÇÃO CERTBOT (Let's Encrypt)"

if command -v certbot &> /dev/null; then
    print_info "Certbot já instalado"
else
    print_info "Instalando Certbot..."
    sudo apt-get install -y certbot python3-certbot-nginx > /dev/null 2>&1
    print_success "Certbot instalado"
fi

# ============================================
# FASE 6: Instalar dependências backend
# ============================================
print_header "FASE 6: INSTALAÇÃO DEPENDÊNCIAS BACKEND"

cd $HOME/server
print_info "Instalando dependências do backend..."
npm install --omit=dev > /dev/null 2>&1
print_success "Dependências backend instaladas"

cd $HOME

# ============================================
# FASE 7: Criar arquivo .env
# ============================================
print_header "FASE 7: CONFIGURAÇÃO .ENV"

if [ -f "$HOME/.env" ]; then
    print_warning "Arquivo .env já existe. Verifique as credenciais:"
    head -5 $HOME/.env
else
    print_info "Criando arquivo .env template..."
    
    cat > $HOME/.env << 'EOF'
# ============================================
# SUPABASE CONFIGURATION
# ============================================
VITE_SUPABASE_URL=PREENCHA_AQUI
VITE_SUPABASE_ANON_KEY=PREENCHA_AQUI
SUPABASE_URL=PREENCHA_AQUI
SUPABASE_SERVICE_KEY=PREENCHA_AQUI

# ============================================
# STRIPE CONFIGURATION
# ============================================
STRIPE_SECRET_KEY=PREENCHA_AQUI
STRIPE_WEBHOOK_SECRET=PREENCHA_AQUI

# ============================================
# AWS SES (Emails)
# ============================================
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=PREENCHA_AQUI
AWS_SECRET_ACCESS_KEY=PREENCHA_AQUI
EMAIL_FROM=noreply@aparecida.com.br
VITE_ADMIN_EMAIL=admin@aparecida.com.br

# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=production
PORT=3001
EOF

    print_warning "Arquivo .env criado. PREENCHA COM VALORES REAIS:"
    print_info "  nano .env"
    print_warning "Aguardando 5 segundos... pressione CTRL+C se precisar editar agora"
    sleep 5
fi

# ============================================
# FASE 8: Configurar PM2
# ============================================
print_header "FASE 8: CONFIGURAÇÃO PM2"

cat > $HOME/ecosystem.config.js << 'EOF'
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

print_success "Arquivo ecosystem.config.js criado"

# Criar diretório de logs
sudo mkdir -p /var/log/pm2
sudo chown ubuntu:ubuntu /var/log/pm2

# Iniciar aplicação
print_info "Iniciando aplicação com PM2..."
pm2 start ecosystem.config.js > /dev/null 2>&1

sleep 2
pm2 status

# Configurar PM2 para boot
sudo pm2 startup -u ubuntu --hp /home/ubuntu > /dev/null 2>&1
pm2 save > /dev/null 2>&1

print_success "PM2 configurado para iniciar no boot"

# ============================================
# FASE 9: Validar backend
# ============================================
print_header "FASE 9: VALIDAÇÃO BACKEND"

sleep 2
print_info "Testando backend na porta 3001..."

if curl -s http://localhost:3001 > /dev/null; then
    print_success "Backend respondendo em http://localhost:3001"
else
    print_warning "Backend não respondeu ainda. Aguarde..."
    sleep 3
    if curl -s http://localhost:3001 > /dev/null; then
        print_success "Backend respondendo após espera"
    else
        print_error "Backend não está respondendo"
        print_info "Verifique logs: pm2 logs aparecida-backend"
    fi
fi

# ============================================
# FASE 10: Configurar Nginx
# ============================================
print_header "FASE 10: CONFIGURAÇÃO NGINX"

# Criar configuração Nginx
sudo tee /etc/nginx/sites-available/aparecida > /dev/null << EOFNGINX
# Redirecionar HTTP para HTTPS
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Certbot
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirecionar para HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # Certificados SSL (serão criados com Certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # Configurações SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Compressão
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    gzip_min_length 1000;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Frontend React
    location / {
        root /home/ubuntu/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
        expires 1h;
    }
    
    # Backend API Proxy
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files
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
EOFNGINX

print_success "Configuração Nginx criada"

# Habilitar site
sudo ln -sf /etc/nginx/sites-available/aparecida /etc/nginx/sites-enabled/ 2>/dev/null
sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null

# Validar sintaxe
if sudo nginx -t > /dev/null 2>&1; then
    print_success "Sintaxe Nginx válida"
else
    print_error "Erro na sintaxe Nginx"
    sudo nginx -t
    exit 1
fi

# ============================================
# FASE 11: Gerar Certificado SSL
# ============================================
print_header "FASE 11: GERAÇÃO CERTIFICADO SSL (Let's Encrypt)"

print_warning "Você será solicitado para confirmar email"
print_info "Domínio: $DOMAIN"

# Verificar se diretório de certificado já existe
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    print_info "Gerando certificado SSL para $DOMAIN..."
    sudo certbot certonly --nginx -d $DOMAIN -d www.$DOMAIN --agree-tos --non-interactive --email admin@$DOMAIN 2>&1 | grep -v "^Saving debug"
    
    if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
        print_success "Certificado SSL gerado com sucesso"
    else
        print_error "Falha ao gerar certificado SSL"
        print_info "Verifique manualmente: sudo certbot certonly --nginx -d $DOMAIN -d www.$DOMAIN"
    fi
else
    print_info "Certificado SSL já existe para $DOMAIN"
fi

# ============================================
# FASE 12: Iniciar Nginx
# ============================================
print_header "FASE 12: INICIANDO NGINX"

sudo systemctl restart nginx

if sudo systemctl is-active --quiet nginx; then
    print_success "Nginx iniciado com sucesso"
else
    print_error "Falha ao iniciar Nginx"
    sudo systemctl status nginx
    exit 1
fi

# Habilitar nginx no boot
sudo systemctl enable nginx

# ============================================
# RESUMO FINAL
# ============================================
print_header "✅ DEPLOYMENT CONCLUÍDO COM SUCESSO"

print_info "Próximas ações obrigatórias:"
print_info "1. Editar arquivo .env com credenciais reais:"
print_info "   nano /home/ubuntu/.env"
print_info ""
print_info "2. Reiniciar backend após alterar .env:"
print_info "   pm2 restart aparecida-backend"
print_info ""
print_info "3. Verificar logs:"
print_info "   pm2 logs aparecida-backend"
print_info ""
print_info "Seu site deve estar disponível em:"
print_info "   https://$DOMAIN"
print_info ""
print_info "Comandos úteis PM2:"
print_info "   pm2 status               # Ver status"
print_info "   pm2 logs                 # Ver logs em tempo real"
print_info "   pm2 restart all          # Reiniciar tudo"
print_info "   pm2 save                 # Salvar configuração"
print_info ""
print_info "Certificado SSL:"
print_info "   Válido até: $(sudo openssl x509 -in /etc/letsencrypt/live/$DOMAIN/cert.pem -noout -enddate 2>/dev/null || echo 'Verificar manualmente')"
print_info "   Renovação automática: configurada"

echo ""
