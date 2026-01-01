# Script para aplicar correcao de RLS no Supabase
# Execute este script para corrigir os erros de seguranca

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CORRIGIR RLS NO SUPABASE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o arquivo de migracao existe
$migrationFile = "supabase\migrations\20251230000000_enable_rls_security.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "ERRO: Arquivo de migracao nao encontrado!" -ForegroundColor Red
    Write-Host "Esperado: $migrationFile" -ForegroundColor Yellow
    exit 1
}

Write-Host "OK - Arquivo de migracao encontrado" -ForegroundColor Green
Write-Host ""

# Opcoes de aplicacao
Write-Host "COMO DESEJA APLICAR A CORRECAO?" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Via Supabase Dashboard (RECOMENDADO)" -ForegroundColor Cyan
Write-Host "   - Copiar SQL e colar no SQL Editor do Supabase"
Write-Host "   - Mais seguro para validar antes de executar"
Write-Host ""
Write-Host "2. Via Supabase CLI" -ForegroundColor Cyan
Write-Host "   - Aplica automaticamente via linha de comando"
Write-Host "   - Requer Supabase CLI instalado e configurado"
Write-Host ""
Write-Host "3. Copiar SQL para clipboard" -ForegroundColor Cyan
Write-Host "   - Apenas copia o SQL para voce colar manualmente"
Write-Host ""

$choice = Read-Host "Escolha uma opcao (1, 2 ou 3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  OPÇÃO 1: DASHBOARD" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "PASSOS:" -ForegroundColor Yellow
        Write-Host "1. Acesse: https://supabase.com/dashboard/project/rhkwickoweflamfigzeo/sql/new" -ForegroundColor White
        Write-Host "2. Cole o SQL do arquivo: $migrationFile" -ForegroundColor White
        Write-Host "3. Clique em 'Run' para executar" -ForegroundColor White
        Write-Host ""
        Write-Host "Pressione qualquer tecla para abrir o SQL Editor..." -ForegroundColor Green
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        
        # Abrir o SQL Editor no navegador
        Start-Process "https://supabase.com/dashboard/project/rhkwickoweflamfigzeo/sql/new"
        
        Write-Host ""
        Write-Host "OK - SQL Editor aberto no navegador" -ForegroundColor Green
        Write-Host ""
        Write-Host "CONTEUDO DO SQL (copie e cole no editor):" -ForegroundColor Yellow
        Write-Host "----------------------------------------" -ForegroundColor Gray
        Get-Content $migrationFile
        Write-Host "----------------------------------------" -ForegroundColor Gray
    }
    
    "2" {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  OPÇÃO 2: SUPABASE CLI" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        
        # Verificar se Supabase CLI está instalado
        $supabaseCmd = Get-Command supabase -ErrorAction SilentlyContinue
        
        if (-not $supabaseCmd) {
            Write-Host "ERRO: Supabase CLI não está instalado!" -ForegroundColor Red
            Write-Host ""
            Write-Host "Para instalar:" -ForegroundColor Yellow
            Write-Host "  npm install -g supabase" -ForegroundColor White
            Write-Host "ou" -ForegroundColor Yellow
            Write-Host "  scoop install supabase" -ForegroundColor White
            exit 1
        }
        
        Write-Host "OK - Supabase CLI encontrado" -ForegroundColor Green
        Write-Host ""
        Write-Host "Aplicando migracao..." -ForegroundColor Yellow
        
        # Aplicar migracao
        supabase db push
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "OK - Migracao aplicada com sucesso!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "ERRO: Falha ao aplicar migracao" -ForegroundColor Red
            Write-Host "Tente a Opcao 1 (Dashboard) para mais controle" -ForegroundColor Yellow
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  OPÇÃO 3: COPIAR PARA CLIPBOARD" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        
        # Copiar para clipboard
        Get-Content $migrationFile | Set-Clipboard
        
        Write-Host "OK - SQL copiado para a area de transferencia!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Cole no SQL Editor do Supabase e execute:" -ForegroundColor Yellow
        Write-Host "https://supabase.com/dashboard/project/rhkwickoweflamfigzeo/sql" -ForegroundColor White
    }
    
    default {
        Write-Host ""
        Write-Host "Opcao invalida. Execute o script novamente." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  APOS APLICAR A MIGRACAO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Volte ao Security Advisor:" -ForegroundColor Yellow
Write-Host "   https://supabase.com/dashboard/project/rhkwickoweflamfigzeo/advisors/security" -ForegroundColor White
Write-Host ""
Write-Host "2. Clique em 'Rerun linter' para atualizar" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Verifique se os erros foram corrigidos" -ForegroundColor Yellow
Write-Host ""
Write-Host "OK - Script concluido!" -ForegroundColor Green
