#!/bin/bash

echo "=== Passo 1: Instalando Node.js 20 LTS ==="
apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v

echo ""
echo "=== Passo 2: Criando pasta do backend ==="
mkdir -p /var/www/backend
cd /var/www/backend

echo ""
echo "=== Passo 3: Criando pasta do frontend ==="
mkdir -p /var/www/frontend

echo ""
echo "=== Passo 4: Instalando PM2 ==="
npm install -g pm2

echo ""
echo "=== Passo 5: Instalando Nginx ==="
apt install -y nginx

echo ""
echo "=== Concluído! Agora siga os próximos passos: ==="
echo "1. Envie o código do backend para /var/www/backend"
echo "2. Envie o código do frontend para /var/www/frontend"
echo "3. Configure o backend e rode: pm2 start npm --name backend -- run start"
echo "4. Faça build do frontend: cd /var/www/frontend && npm install && npm run build"
echo "5. Configure o Nginx conforme instruções"
