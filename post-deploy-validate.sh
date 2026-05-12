#!/bin/bash

# Script de Validação e Restart Pós-Deploy - EC2
# Execute após fazer upload dos arquivos
# Uso: bash post-deploy-validate.sh

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
print_header "VALIDAÇÕES PRÉ-RESTART"

# Verificar que está em /home/ubuntu
if [ "$PWD" != "/home/ubuntu" ]; then
    print_error "Deve executar em /home/ubuntu"
    exit 1
fi

print_success "Executando em diretório correto: $PWD"

# Validar estrutura
if [ ! -d "dist" ] || [ ! -d "server" ]; then
    print_error "Pasta dist/ ou server/ não encontrada"
    exit 1
fi

print_success "Estrutura de pastas validada"

# ============================================
# VALIDAR NGINX
# ============================================
print_header "FASE 1: VALIDAR NGINX"

if sudo nginx -t > /dev/null 2>&1; then
    print_success "Nginx syntax OK"
else
    print_error "Nginx syntax error"
    sudo nginx -t
    exit 1
fi

# ============================================
# VALIDAR BACKEND ATUAL
# ============================================
print_header "FASE 2: VALIDAR BACKEND ATUAL"

# Ver status PM2
if pm2 status | grep -q "aparecida-backend"; then
    print_info "Aparecida Backend está rodando"
    print_info "Obtendo PID..."
    OLD_PID=$(pgrep -f "node.*server/index.js" | head -1)
    if [ ! -z "$OLD_PID" ]; then
        print_info "PID atual: $OLD_PID"
    fi
else
    print_warning "Aparecida Backend não está rodando"
fi

# Testar health antes
print_info "Testando health antes do restart..."
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    print_success "Backend respondendo em http://localhost:3001/health"
else
    print_warning "Backend não respondendo (pode ser normal se reiniciou)"
fi

# ============================================
# VALIDAR ARQUIVOS UPLOADED
# ============================================
print_header "FASE 3: VALIDAR ARQUIVOS UPLOADED"

print_info "Validando dist/..."
if [ ! -f "dist/index.html" ]; then
    print_error "dist/index.html não encontrado"
    exit 1
fi

print_success "dist/ validado"
DIST_SIZE=$(du -sh dist/ | cut -f1)
print_info "Tamanho de dist/: $DIST_SIZE"

print_info "Validando server/..."
if [ ! -f "server/index.js" ]; then
    print_error "server/index.js não encontrado"
    exit 1
fi

print_success "server/ validado"

# Validar sintaxe JavaScript
print_info "Validando sintaxe de server/index.js..."
if node -c server/index.js > /dev/null 2>&1; then
    print_success "Sintaxe JavaScript OK"
else
    print_error "Erro de sintaxe em server/index.js"
    exit 1
fi

# ============================================
# VERIFICAR DEPENDÊNCIAS
# ============================================
print_header "FASE 4: VERIFICAR DEPENDÊNCIAS"

if [ -f "server/package.json" ]; then
    print_info "server/package.json encontrado"
    
    # Verificar se node_modules está desatualizado
    if [ ! -d "server/node_modules" ]; then
        print_warning "server/node_modules não existe"
        if confirm "Executar npm install? (s/n) "; then
            cd server
            npm install --omit=dev
            cd ..
            print_success "npm install concluído"
        else
            print_error "node_modules ausente. Impossível reiniciar."
            exit 1
        fi
    else
        print_success "server/node_modules existe"
        NM_SIZE=$(du -sh server/node_modules | cut -f1)
        print_info "Tamanho: $NM_SIZE"
    fi
fi

# ============================================
# BACKUP DE ESTADO
# ============================================
print_header "FASE 5: BACKUP DE ESTADO"

print_info "Salvando estado PM2..."
pm2 save

print_success "Estado PM2 salvo"

# ============================================
# RESTART SEGURO
# ============================================
print_header "FASE 6: RESTART SEGURO"

if ! confirm "Reiniciar PM2 + Nginx? (s/n) "; then
    print_warning "Restart cancelado pelo usuário"
    exit 0
fi

print_info "Aguardando 2 segundos antes de reiniciar..."
sleep 2

print_info "Reiniciando aparecida-backend..."
pm2 restart aparecida-backend --wait-ready

sleep 3

print_info "Recarregando Nginx..."
sudo systemctl reload nginx

sleep 2

print_success "Restart concluído"

# ============================================
# VALIDAÇÕES PÓS-RESTART
# ============================================
print_header "FASE 7: VALIDAÇÕES PÓS-RESTART"

# Ver novo PID
NEW_PID=$(pgrep -f "node.*server/index.js" | head -1)
if [ ! -z "$NEW_PID" ] && [ "$NEW_PID" != "$OLD_PID" ]; then
    print_success "Backend reiniciado com novo PID: $NEW_PID"
fi

# Aguardar backend iniciar
print_info "Aguardando backend inicializar..."
sleep 3

# Testar health
print_info "Testando http://localhost:3001/health..."
if curl -s http://localhost:3001/health | grep -q "ok"; then
    print_success "Backend respondendo OK"
else
    print_warning "Backend pode estar inicializando ainda"
    sleep 2
    if curl -s http://localhost:3001/health | grep -q "ok"; then
        print_success "Backend respondendo OK (segunda tentativa)"
    else
        print_error "Backend não respondendo após restart"
        print_info "Verificar logs: pm2 logs aparecida-backend"
    fi
fi

# Ver status PM2
print_info "Status PM2:"
pm2 status

# ============================================
# VER LOGS
# ============================================
print_header "FASE 8: VERIFICAR LOGS"

print_info "Últimas linhas dos logs (10 linhas):"
pm2 logs aparecida-backend --lines 10 --nostream

print_info "Se teve erro, ver logs completos com:"
print_info "  pm2 logs aparecida-backend"

# ============================================
# RESUMO
# ============================================
print_header "✅ PÓS-DEPLOY COMPLETADO"

print_success "Validações e restart concluídos com sucesso!"

print_info "Próximas ações:"
print_info "  1. Monitorar por 5 minutos: pm2 monit"
print_info "  2. Verificar logs: pm2 logs aparecida-backend"
print_info "  3. Testar em browser: https://seu-dominio.com.br"
print_info "  4. Se houver erro: bash post-deploy-rollback.sh"

echo ""
