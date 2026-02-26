import express from 'express';
import logger from '../services/logger.js';

const router = express.Router();

/**
 * Health Check Endpoint
 * 
 * GET /health
 * 
 * Retorna status básico do servidor sem depender de banco ou Stripe
 * Usado por: orchestrators (K8s), load balancers, monitoring
 */
router.get('/health', (req, res) => {
  const startTime = process.uptime() * 1000; // Convert to ms
  const now = new Date();
  
  // Calcular uptime em formato legível
  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;
  
  const healthData = {
    ok: true,
    status: 'healthy',
    timestamp: now.toISOString(),
    uptime: {
      seconds: uptimeSeconds,
      formatted: uptimeFormatted
    },
    service: 'aparecida-backend',
    version: process.env.API_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        max: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB'
      }
    }
  };
  
  // Log do health check (apenas se verboso)
  if (process.env.LOG_LEVEL === 'debug') {
    logger.debug('GET /health', {
      requestId: req.requestId,
      ip: req.ip,
      uptime: uptimeSeconds
    });
  }
  
  res.status(200).json(healthData);
});

/**
 * Ready Check (Optional)
 * 
 * GET /ready
 * 
 * Versão mais rigorosa que verifica dependências
 * Útil para orchestration (K8s readiness probe)
 */
router.get('/ready', (req, res) => {
  try {
    // Verificações básicas (sem chamar banco/Stripe)
    const checks = {
      memory: process.memoryUsage().heapUsed < (process.memoryUsage().heapTotal * 0.9),
      uptime: process.uptime() > 2, // Pelo menos 2 segundos
    };
    
    const isReady = Object.values(checks).every(v => v === true);
    
    res.status(isReady ? 200 : 503).json({
      ready: isReady,
      timestamp: new Date().toISOString(),
      checks
    });
  } catch (err) {
    logger.error('Ready check failed', {
      requestId: req.requestId,
      error: err.message
    });
    
    res.status(503).json({
      ready: false,
      timestamp: new Date().toISOString(),
      error: err.message
    });
  }
});

export default router;
