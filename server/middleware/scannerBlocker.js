import logger from '../services/logger.js';

/**
 * Scanner Blocker Middleware
 * 
 * Bloqueia requests para paths comuns de scanner de vulnerabilidades:
 * - .env, .git, vendor, config, debug, keys, etc
 * - Retorna 404 (simula não existência)
 * - Loga IP + path + user-agent para auditoria
 */

// Patterns que definem tentativas de scanner
const BLOCKED_PATTERNS = [
  // Arquivos de configuração
  /^\/.env(\.|$)/i,
  /^\/\.env\.local/i,
  /^\/\.env\.backup/i,
  /^\/\.env\./i,
  /^\/config\.php/i,
  /^\/settings\.php/i,
  /^\/database\.php/i,
  
  // Controle de versão
  /^\/.git\/?/i,
  /^\/.git\//i,
  /^\/.gitignore/i,
  /^\/.gitlab-ci/i,
  /^\/.github\//i,
  
  // Diretórios comuns
  /^\/vendor\//i,
  /^\/node_modules\//i,
  /^\/admin\/$/i,
  /^\/admin\//i,
  /^\/wp-admin\//i,
  /^\/wp-login/i,
  /^\/administrator\//i,
  /^\/phpmyadmin\//i,
  
  // Arquivos PHP/ASP
  /\.php(\?|$)/i,
  /\.asp(\?|$)/i,
  /\.aspx(\?|$)/i,
  /\.jsp(\?|$)/i,
  /\.jar(\?|$)/i,
  
  // Debug/Info
  /^\/debug\/?$/i,
  /^\/info\.php/i,
  /^\/phpinfo/i,
  /^\/test/i,
  /^\/backup\//i,
  /^\/keys\//i,
  /^\/secrets\//i,
  /^\/private\//i,
  
  // Padrões comuns de teste
  /^\/api\/test/i,
  /^\/teste\/$/i,
  /^\/test\.html/i,
  /^\/shell/i,
  /\.sql$/i,
  /\.bak$/i,
  /\.zip$/i,
  /\.tar/i,
  
  // Outras tentativas comuns
  /^\/console\//i,
  /^\/web\.config/i,
  /^\/robots\.txt$/i,
  /^\/sitemap\.xml$/i,
  /^\/xmlrpc\.php/i,
];

/**
 * Middleware que bloqueia requisições de scanner
 */
export const scannerBlockerMiddleware = (req, res, next) => {
  const path = req.path;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  // Verificar se qualquer padrão combina
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(path)) {
      // Log auditoria
      logger.warn('🛡️ Scanner bloqueado', {
        requestId: req.requestId,
        action: 'scanner_blocked',
        ip,
        path,
        method: req.method,
        userAgent: userAgent.substring(0, 150),
        headers: {
          'x-forwarded-for': req.headers['x-forwarded-for'],
          'referer': req.headers['referer'],
        }
      });
      
      // Retornar 404 (simula não existência)
      return res.status(404).json({
        error: 'Not Found',
        path: path,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Continuar se nenhum padrão combinou
  next();
};

export default scannerBlockerMiddleware;
