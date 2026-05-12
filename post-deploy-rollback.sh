#!/bin/bash

# Script de Rollback Seguro - EC2
# Use se algo der errado após o deploy
# Uso: bash post-deploy-rollback.sh

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

confirm() {
    local prompt="$1"
    local response
    read -p "$(echo -e ${YELLOW}$prompt${NC})" response
    [[ "$response" == "s" || "$response" == "S" || "$response" == "yes" ]]
}

# ============================================
# VALIDAÇÕES
# ============================================
print_header "⚠️  ROLLBACK SEGURO - APARECIDA"

print_warning "Este script vai restaurar o backup anterior"
print_warning "Todos os dados modificados após o deploy serão perdidos"

if ! confirm "Tem certeza? Digite 's' para continuar: "; then
    print_info "Rollback cancelado"
    exit 0
fi

if [ "$PWD" != "/home/ubuntu" ]; then
    print_error "Deve executar em /home/ubuntu"
    exit 1
fi

print_success "Executando rollback..."

# ============================================
# PARAR SERVIÇOS
# ============================================
print_header "FASE 1: PARAR SERVIÇOS"

print_info "Parando PM2..."
pm2 stop aparecida-backend

print_info "Aguardando 2 segundos..."
sleep 2

print_success "PM2 parado"

# ============================================
# LISTAR BACKUPS
# ============================================
print_header "FASE 2: LISTAR BACKUPS"

print_info "Backups de dist/:"
ls -lh dist-backup-*.tar.gz 2>/dev/null || print_warning "Nenhum backup de dist/ encontrado"

print_info "Backups de server/:"
ls -lh server-backup-*.tar.gz 2>/dev/null || print_warning "Nenhum backup de server/ encontrado"

# ============================================
# ESCOLHER QUAL RESTAURAR
# ============================================
print_header "FASE 3: ESCOLHER BACKUPS"

LATEST_DIST=$(ls -t dist-backup-*.tar.gz 2>/dev/null | head -1 || echo "")
LATEST_SERVER=$(ls -t server-backup-*.tar.gz 2>/dev/null | head -1 || echo "")

if [ -z "$LATEST_DIST" ] && [ -z "$LATEST_SERVER" ]; then
    print_error "Nenhum backup encontrado!"
    exit 1
fi

if [ ! -z "$LATEST_DIST" ]; then
    print_info "Backup mais recente de dist/: $LATEST_DIST"
    if confirm "Restaurar este backup? (s/n) "; then
        RESTORE_DIST=1
    fi
fi

if [ ! -z "$LATEST_SERVER" ]; then
    print_info "Backup mais recente de server/: $LATEST_SERVER"
    if confirm "Restaurar este backup? (s/n) "; then
        RESTORE_SERVER=1
    fi
fi

# ============================================
# RESTAURAR BACKUPS
# ============================================
print_header "FASE 4: RESTAURAR BACKUPS"

if [ "$RESTORE_DIST" == "1" ]; then
    print_warning "Restaurando dist/ de $LATEST_DIST..."
    rm -rf dist/
    tar -xzf "$LATEST_DIST"
    print_success "dist/ restaurado"
fi

if [ "$RESTORE_SERVER" == "1" ]; then
    print_warning "Restaurando server/ de $LATEST_SERVER..."
    rm -rf server/
    tar -xzf "$LATEST_SERVER"
    print_success "server/ restaurado"
    
    # Reinstalar dependências
    print_info "Reinstalando dependências..."
    cd server
    npm install --omit=dev
    cd ..
    print_success "Dependências reinstaladas"
fi

# ============================================
# VALIDAR RESTAURAÇÃO
# ============================================
print_header "FASE 5: VALIDAR RESTAURAÇÃO"

if [ -f "dist/index.html" ]; then
    print_success "dist/index.html encontrado"
else
    print_error "dist/index.html não encontrado após restauração!"
fi

if [ -f "server/index.js" ]; then
    print_success "server/index.js encontrado"
else
    print_error "server/index.js não encontrado após restauração!"
fi

# ============================================
# VALIDAR NGINX
# ============================================
print_header "FASE 6: VALIDAR NGINX"

if sudo nginx -t > /dev/null 2>&1; then
    print_success "Nginx syntax OK"
else
    print_error "Nginx syntax error"
    sudo nginx -t
    exit 1
fi

# ============================================
# RESTART
# ============================================
print_header "FASE 7: REINICIAR SERVIÇOS"

print_info "Iniciando PM2..."
pm2 start aparecida-backend

sleep 3

print_info "Recarregando Nginx..."
sudo systemctl reload nginx

sleep 2

print_success "Serviços reiniciados"

# ============================================
# VALIDAÇÕES FINAIS
# ============================================
print_header "FASE 8: VALIDAÇÕES FINAIS"

print_info "Testando backend..."
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    print_success "Backend respondendo"
else
    print_error "Backend não respondendo"
fi

print_info "Status PM2:"
pm2 status

# ============================================
# RESUMO
# ============================================
print_header "✅ ROLLBACK CONCLUÍDO"

print_success "Rollback completado com sucesso!"
print_info "Sistema foi restaurado para o estado anterior"

print_info "Próximas ações:"
print_info "  1. Verificar logs: pm2 logs aparecida-backend"
print_info "  2. Testar em browser: https://seu-dominio.com.br"
print_info "  3. Se funcionou, investigar o que deu errado"
print_info "  4. Se ainda tiver erro, contactar suporte"

echo ""
