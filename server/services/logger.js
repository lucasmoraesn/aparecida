import winston from 'winston';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─────────────────────────────────────────────────────────────────────────────
// Custom Format para logs estruturados JSON
// ─────────────────────────────────────────────────────────────────────────────
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// ─────────────────────────────────────────────────────────────────────────────
// Função para mascarar dados sensíveis
// ─────────────────────────────────────────────────────────────────────────────
const maskSensitiveData = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const masked = { ...obj };
  const sensitiveKeys = ['authorization', 'cookie', 'stripe-signature', 'password', 'secret', 'token'];
  
  Object.keys(masked).forEach(key => {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      masked[key] = '***REDACTED***';
    }
  });
  
  return masked;
};

// ─────────────────────────────────────────────────────────────────────────────
// Winston Logger Instance
// ─────────────────────────────────────────────────────────────────────────────
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { 
    service: 'aparecida-backend',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console transport (JSON format for structured logging)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...rest }) => {
          return `[${timestamp}] ${level}: ${message} ${Object.keys(rest).length > 0 ? JSON.stringify(rest) : ''}`;
        })
      )
    }),
    
    // Error log file (only errors)
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({
        filename: '/home/ubuntu/aparecida/logs/error.log',
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      }),
      // Combined log file (all levels)
      new winston.transports.File({
        filename: '/home/ubuntu/aparecida/logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 10
      })
    ] : [])
  ]
});

// ─────────────────────────────────────────────────────────────────────────────
// Middleware para logging de requisições (com requestId)
// ─────────────────────────────────────────────────────────────────────────────
import { v4 as uuidv4 } from 'uuid';

export const requestLoggerMiddleware = (req, res, next) => {
  // Gerar requestId único
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.requestId = requestId;
  
  // Registrar tempo de início
  const startTime = Date.now();
  
  // Dados para logging
  const logData = {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent']?.substring(0, 100),
    headers: maskSensitiveData(req.headers),
    query: req.query
  };
  
  // Não logar body de webhook ou Stripe
  if (req.path !== '/api/webhook' && !req.path.includes('stripe')) {
    if (req.body && Object.keys(req.body).length > 0) {
      logData.body = maskSensitiveData(req.body);
    }
  }
  
  // Log de request incoming
  logger.info(`→ ${req.method} ${req.path}`, logData);
  
  // Interceptar response para logging
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    const responseLogData = {
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress
    };
    
    // Logar com nível apropriado baseado no status
    if (res.statusCode >= 400) {
      logger.warn(`← ${req.method} ${req.path} [${res.statusCode}]`, responseLogData);
    } else if (res.statusCode >= 300) {
      logger.info(`← ${req.method} ${req.path} [${res.statusCode}]`, responseLogData);
    } else {
      logger.debug(`← ${req.method} ${req.path} [${res.statusCode}]`, responseLogData);
    }
    
    // Chamar send original
    return originalSend.call(this, data);
  };
  
  next();
};

// ─────────────────────────────────────────────────────────────────────────────
// Função helper para adicionar requestId a qualquer log
// ─────────────────────────────────────────────────────────────────────────────
export const createContextLogger = (requestId) => {
  return {
    info: (message, data = {}) => logger.info(message, { ...data, requestId }),
    error: (message, error, data = {}) => logger.error(message, { ...data, requestId, error: error?.message || error }),
    warn: (message, data = {}) => logger.warn(message, { ...data, requestId }),
    debug: (message, data = {}) => logger.debug(message, { ...data, requestId })
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Export logger padrão
// ─────────────────────────────────────────────────────────────────────────────
export default logger;
