#!/bin/bash

# ==========================================
# SCRIPT DE DEPLOYMENT COMPLETO
# Aparecida do Norte SP - Frontend + Backend
# ==========================================

set -e  # Para se houver erro

echo "🚀 INICIANDO DEPLOYMENT..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==========================================
# 1. ATUALIZAR O SISTEMA
# ==========================================
echo -e "${BLUE}[1/8]${NC} Atualizando sistema..."
apt update && apt upgrade -y
apt install -y curl git wget

# ==========================================
# 2. INSTALAR NODE.JS (se não tiver)
# ==========================================
echo -e "${BLUE}[2/8]${NC} Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "  📦 Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    apt install -y nodejs
fi
echo "  ✅ Node $(node --version) já instalado"

# ==========================================
# 3. INSTALAR PM2 (gerenciador de processos)
# ==========================================
echo -e "${BLUE}[3/8]${NC} Configurando PM2..."
npm install -g pm2
pm2 startup || true
pm2 save || true

# ==========================================
# 4. CRIAR PASTAS
# ==========================================
echo -e "${BLUE}[4/8]${NC} Criando pastas..."
mkdir -p /var/www/backend
mkdir -p /var/www/frontend
echo "  ✅ Pastas criadas"

# ==========================================
# 5. DEPLOY BACKEND
# ==========================================
echo -e "${BLUE}[5/8]${NC} Deploy do Backend..."
cd /var/www/backend

# Se o diretório não estiver vazio e for um repo git válido, fazer pull
if [ -d .git ]; then
    echo "  📥 Atualizando repo existente..."
    git pull origin main || git pull origin master
else
    echo "  ⚠️  Precisamos do seu repositório Git"
    echo "  Próximo passo: Fazer git clone do backend"
    echo "  Exemplo: git clone SEU_REPO_GIT /var/www/backend"
fi

npm install
echo "  ✅ Backend dependências instaladas"

# Copiar .env se não existir
if [ ! -f .env ]; then
    echo "  ⚠️  Arquivo .env não encontrado!"
    echo "  IMPORTANTE: Crie o arquivo .env em /var/www/backend/.env"
    echo "  Com as variáveis:"
    cat << 'EOF'
    
    ========== TEMPLATE .env ==========
    PORT=3001
    NODE_ENV=production
    
    SUPABASE_URL=seu_url_aqui
    SUPABASE_SERVICE_KEY=sua_chave_aqui
    
    STRIPE_SECRET_KEY=sk_live_seu_aqui
    STRIPE_WEBHOOK_SECRET=whsec_seu_aqui
    
    DB_PASSWORD=sua_senha_db
    ====================================
    
EOF
    exit 1
fi

# Parar e remover o processo anterior se existir
pm2 delete "aparecida-backend" || true

# Iniciar backend com PM2
pm2 start index.js --name "aparecida-backend" --env NODE_ENV=production
pm2 save

echo "  ✅ Backend iniciado com PM2"

# ==========================================
# 6. DEPLOY FRONTEND
# ==========================================
echo -e "${BLUE}[6/8]${NC} Deploy do Frontend..."
cd /var/www/frontend

# Se o diretório não estiver vazio e for um repo git válido, fazer pull
if [ -d .git ]; then
    echo "  📥 Atualizando repo existente..."
    git pull origin main || git pull origin master
else
    echo "  ⚠️  Precisamos do seu repositório Git"
    echo "  Próximo passo: Fazer git clone do frontend"
    echo "  Exemplo: git clone SEU_REPO_GIT /var/www/frontend"
fi

npm install
npm run build
echo "  ✅ Frontend build concluído (dist/ pronto)"

# ==========================================
# 7. INSTALAR E CONFIGURAR NGINX
# ==========================================
echo -e "${BLUE}[7/8]${NC} Configurando Nginx..."
apt install -y nginx

# Criar arquivo de configuração
cat > /etc/nginx/sites-available/aparecidadonortesp.com.br << 'EOF'
server {
    listen 80;
    server_name aparecidadonortesp.com.br www.aparecidadonortesp.com.br;

    # Frontend (Vite build)
    root /var/www/frontend/dist;
    index index.html;

    # SPA: sempre devolver index.html
    location / {
        try_files $uri /index.html;
    }

    # API (Node backend em 3001)
    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Webhook do Stripe
    location /api/webhook {
        proxy_pass http://127.0.0.1:3001/api/webhook;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        client_max_body_size 10M;
    }
}
EOF

# Ativar site
ln -sf /etc/nginx/sites-available/aparecidadonortesp.com.br /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração
nginx -t

# Reiniciar Nginx
systemctl restart nginx
systemctl enable nginx

echo "  ✅ Nginx configurado"

# ==========================================
# 8. HTTPS COM LET'S ENCRYPT
# ==========================================
echo -e "${BLUE}[8/8]${NC} Configurando HTTPS..."
apt install -y certbot python3-certbot-nginx

echo ""
echo "⏳ Aguardando 10s antes de gerar certificado SSL..."
sleep 10

# Gerar certificado (modo non-interactive)
certbot --nginx -d aparecidadonortesp.com.br -d www.aparecidadonortesp.com.br \
    --non-interactive --agree-tos --email seu-email@aparecidadonortesp.com.br \
    --redirect || echo "⚠️  Certificado SSL não pôde ser gerado - DNS ainda não está propagado"

# Configurar renovação automática
systemctl enable certbot.timer
systemctl start certbot.timer

echo "  ✅ HTTPS configurado"

# ==========================================
# RESUMO FINAL
# ==========================================
echo ""
echo -e "${GREEN}✅ DEPLOYMENT CONCLUÍDO!${NC}"
echo ""
echo "📍 Próximos passos:"
echo ""
echo "1️⃣  Apontar o DNS (no painel da Hostinger):"
echo "    A record: aparecidadonortesp.com.br → 72.60.251.96"
echo "    A record: www.aparecidadonortesp.com.br → 72.60.251.96"
echo ""
echo "2️⃣  Criar arquivo .env em /var/www/backend/.env com:"
cat << 'EOF'
    - SUPABASE_URL
    - SUPABASE_SERVICE_KEY
    - STRIPE_SECRET_KEY
    - STRIPE_WEBHOOK_SECRET
EOF
echo ""
echo "3️⃣  Reiniciar backend após criar .env:"
echo "    pm2 restart aparecida-backend"
echo ""
echo "📊 Comandos úteis:"
echo "   pm2 list                          # Ver status dos processos"
echo "   pm2 logs aparecida-backend        # Ver logs do backend"
echo "   systemctl status nginx            # Ver status do Nginx"
echo "   tail -f /var/log/nginx/error.log  # Ver erros do Nginx"
echo ""
echo "🌐 Seu site estará em:"
echo "   http://aparecidadonortesp.com.br (redirecionará para HTTPS)"
echo "   https://aparecidadonortesp.com.br"
echo ""
