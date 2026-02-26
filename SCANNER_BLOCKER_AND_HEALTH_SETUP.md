# Scanner Blocker + Health Check - Fase 4

## 📋 Overview

Implementação de proteção contra scanners de vulnerabilidade + health check endpoints para monitoramento e orchestração.

**Status**: ✅ **Em Produção (EC2)**

---

## 🎯 Objetivos

1. **Bloquear requests de scanner** (/.env, /.git, *.php, /admin, etc) com 404
2. **Logar tentativas de scanner** com IP, path, user-agent para auditoria
3. **Não afetar rotas reais** (/ , /api, /health, etc)
4. **Health check simples** sem dependências de banco ou Stripe
5. **Readiness probe** para orchestração (Kubernetes, etc)

---

## 🛡️ Scanner Blocker Middleware

**Arquivo**: `server/middleware/scannerBlocker.js` (114 linhas)

### Patterns Bloqueados

| Tipo | Exemplos |
|------|----------|
| **Arquivos de Config** | .env, .env.*, config.php, settings.php, database.php |
| **VCS** | .git, .gitignore, .gitlab-ci |
| **Diretórios** | /vendor, /admin, /phpmyadmin, /wp-admin, /administrator |
| **Extensões Web** | .php, .asp, .aspx, .jsp, .jar |
| **Debug** | /debug, /info.php, /phpinfo, /test |
| **Outros** | /backup, /keys, /secrets, /console, /shell |

### Comportamento

```javascript
// Entrada
GET /.env
GET /info.php
GET /vendor

// Saída
404 {"error":"Not Found","path":"/.env","timestamp":"..."}
404 {"error":"Not Found","path":"/info.php","timestamp":"..."}
404 {"error":"Not Found","path":"/vendor","timestamp":"..."}
```

### Logs Winston

```json
{
  "level": "warn",
  "message": "🛡️ Scanner bloqueado",
  "action": "scanner_blocked",
  "ip": "52.14.244.186",
  "path": "/.env",
  "method": "GET",
  "userAgent": "curl/8.5.0",
  "headers": {
    "x-forwarded-for": "52.14.244.186",
    "authorization": "***REDACTED***"
  }
}
```

---

## 📊 Health Check Endpoints

**Arquivo**: `server/routes/health.js` (82 linhas)

### GET /health

**Status**: Simples, sem dependências

```json
{
  "ok": true,
  "status": "healthy",
  "timestamp": "2026-02-26T20:26:13.311Z",
  "uptime": {
    "seconds": 351,
    "formatted": "0h 5m 51s"
  },
  "service": "aparecida-backend",
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "memory": {
      "used": 18,
      "max": 19,
      "unit": "MB"
    }
  }
}
```

**Uso**:
- Load balancer health checks
- Monitoring dashboards
- Uptime robots

### GET /ready

**Status**: Readiness probe (mais rigoroso)

```json
{
  "ready": true,
  "timestamp": "2026-02-26T20:26:29.274Z",
  "checks": {
    "memory": true,
    "uptime": true
  }
}
```

**Retorna**:
- `200 OK` quando ready (memory OK, uptime > 2s)
- `503 Service Unavailable` quando não ready

**Uso**:
- Kubernetes readiness probes
- Blue/green deployments
- Graceful rolling updates

---

## 🔧 Configuração Nginx

**Arquivo**: `nginx-avec-health.conf` (54 linhas)

### Location Blocks (Prioridade)

```nginx
# 1. Highest priority (^~) - stop processing if match
location ^~ /.env               # → Backend (404)
location ^~ /.git               # → Backend (404)
location ^~ /vendor/            # → Backend (404)
location = /vendor              # → Backend (404)
location ^~ /admin/             # → Backend (404)
location = /admin               # → Backend (404)
location ^~ /phpmyadmin         # → Backend (404)
location ~ \.(env|php|...)$     # → Backend (404)

# 2. Health endpoints (regex)
location ~ ^/(health|ready)$    # → Backend (200)

# 3. API routes
location /api/                  # → Backend

# 4. Frontend (catch-all)
location /                      # → try_files (frontend app)
```

### Ordem de Matching

```
Request: /.env
├─ ✅ Match: location ^~ /.env
├─ Proxy to 127.0.0.1:3001
├─ Backend blockerMiddleware returns 404
└─ Client: 404 JSON

Request: /index.html
├─ ✓ Check: ^~ /.env (no)
├─ ✓ Check: ^~ /.git (no)
├─ ✓ Check: ~ \.(env|php...) (no)
├─ ✓ Check: ~ ^/(health|ready)$ (no)
├─ ✓ Check: /api/ (no)
├─ ✅ Match: / (catch-all)
├─ Serve: /var/www/html/index.html
└─ Client: 200 (frontend)
```

---

## 📝 Integration Points

### server/index.js

```javascript
// Line 10
import { scannerBlockerMiddleware } from "./middleware/scannerBlocker.js";
import healthRouter from './routes/health.js';

// Line 70-75 (after trust proxy)
app.use(scannerBlockerMiddleware);
logger.info('✅ Scanner blocker ativado (/.env, /.git, /vendor, *.php, etc)');

// Line 513-515 (before /api routes)
app.use(healthRouter);
logger.info('✅ Health check endpoints: GET /health, GET /ready');
```

---

## 🧪 Testing

### 1. Scanner Blocker Tests

```bash
# Test blocked paths
curl -i https://aparecidadonortesp.com.br/.env
# HTTP/1.1 404 OK
# {"error":"Not Found","path":"/.env",...}

curl -i https://aparecidadonortesp.com.br/info.php
# HTTP/1.1 404 OK
# {"error":"Not Found",...}

curl -i https://aparecidadonortesp.com.br/vendor
# HTTP/1.1 404 OK
```

### 2. Health Check Tests

```bash
# Health endpoint
curl https://aparecidadonortesp.com.br/health | jq .
# {
#   "ok": true,
#   "uptime": { "seconds": 351, "formatted": "0h 5m 51s" }
# }

# Ready probe
curl https://aparecidadonortesp.com.br/ready | jq .
# { "ready": true, "checks": { "memory": true, "uptime": true } }
```

### 3. Normal Requests (Should NOT be blocked)

```bash
curl https://aparecидаdonortesp.com.br/
# 200 OK (frontend HTML)

curl https://aparecidadonortesp.com.br/api/plans
# 200 OK (plans list)
```

### 4. Verify Winston Logs

```bash
ssh ubuntu@52.14.244.186 "grep 'Scanner bloqueado' /home/ubuntu/.pm2/logs/*"
# [2026-02-26 20:33:45] warn: 🛡️ Scanner bloqueado 
#   {"action":"scanner_blocked","path":"/.env","ip":"..."}
```

---

## ✅ Deployment Checklist

| Item | Status | Command |
|------|--------|---------|
| scannerBlocker.js created | ✅ | `ls /home/ubuntu/aparecida/server/middleware/scannerBlocker.js` |
| health.js created | ✅ | `ls /home/ubuntu/aparecida/server/routes/health.js` |
| index.js updated | ✅ | `grep scannerBlockerMiddleware /home/ubuntu/aparecida/server/index.js` |
| Nginx config updated | ✅ | `sudo nginx -t` |
| PM2 restarted | ✅ | `pm2 status` |
| /.env blocked | ✅ | `curl -s https://aparecidadonortesp.com.br/.env \| grep error` |
| /health working | ✅ | `curl -s https://aparecidadonortesp.com.br/health \| jq .ok` |
| /ready working | ✅ | `curl -s https://aparecidadonortesp.com.br/ready \| jq .ready` |

---

## 📊 Security Impact

### Before
- Scanners can probe: /.env, /.git, /vendor, *.php → 200/403/error
- No way to detect scanner attacks
- No health monitoring

### After
- Scanners probe: /.env, /.git → 404 (fake)
- Every attempt logged with action=scanner_blocked
- Health endpoints for monitoring/orchestration
- No information leakage in error responses

### Attack Scenarios Blocked

```
Scenario 1: Configuration file discovery
❌ GET /.env → 404 (not exposed)
❌ GET /config.php → 404 (not exposed)

Scenario 2: Source code discovery
❌ GET /vendor → 404 (directory hidden)
❌ GET /.git → 404 (VCS hidden)

Scenario 3: Server info discovery
❌ GET /info.php → 404 (PHP info hidden)
❌ GET /phpinfo → 404 (PHP info hidden)

Scenario 4: Known vulnerability patterns
❌ Admin panel guess: /admin → 404
❌ CMS paths: /wp-admin → 403 (frontend)
❌ Database tool: /phpmyadmin → 404
```

---

## 🔍 Winston Integration

All scanner blocks logged with:

```javascript
logger.warn('🛡️ Scanner bloqueado', {
  requestId: req.requestId,        // UUID for tracing
  action: 'scanner_blocked',        // Action type
  ip: req.ip,                       // Attacker IP
  path: req.path,                   // Blocked path
  method: req.method,               // HTTP method
  userAgent: userAgent.substring(0, 150),
  headers: maskSensitiveData(...)   // Masked headers
});
```

**Query logs by scanner attacks:**
```bash
grep 'action.*scanner_blocked' /home/ubuntu/aparecida/logs/*.log
```

---

## 📈 Storage & Performance

**File Sizes**:
- scannerBlocker.js: ~2.6 KB
- health.js: ~2.5 KB
- nginx-avec-health.conf: ~3.8 KB

**Performance Impact**:
- Regex matching: < 1ms per request
- Nginx priority (^~): Early termination, no processing overhead
- Health check: ~2ms (no DB calls)

---

## 🎯 Next Steps (Phase 5)

1. **Error Handling** - Structured error responses
2. **Metrics Export** - Prometheus format
3. **Rate Limit Per Path** - Tighter limits on /api/webhook
4. **Graceful Shutdown** - Drain in-flight requests before exit

---

**Última atualização**: 2026-02-26  
**Commit**: `180dcba` feat(hardening): Scanner blocker + Health check endpoints  
**Hostname**: aparecidadonortesp.com.br (EC2 52.14.244.186)
