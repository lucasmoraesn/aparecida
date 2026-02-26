# Winston Structured Logging - Aparecida Backend

## 📊 Overview

Implementação de logging estruturado com **Winston.js** + **UUID** para rastreamento completo de requisições em produção.

**Status**: ✅ **Ativo em Produção (EC2)**

---

## 🎯 Objetivos Alcançados

1. **UUID Request Tracking** - Cada requisição recebe um ID único (`requestId`) que pode ser rastreado em todos os logs
2. **Structured JSON Format** - Logs em JSON para fácil parsing e análise em ferramentas de observabilidade
3. **Sensitive Data Masking** - Headers sensíveis (Authorization, Cookie, Stripe-Signature) mascarados automaticamente
4. **Webhook Protection** - Payloads de webhook e Stripe não são logados (segurança)
5. **Duration Tracking** - Tempo de resposta em milissegundos por requisição
6. **Status-based Levels** - Diferentes níveis de log por status HTTP (warn 4xx, info 2xx, debug 3xx)
7. **Production File Output** - Logs persistidos em arquivo para auditoria

---

## 📦 Pacotes Instalados

```bash
npm install winston uuid --save
```

- **winston** `^8.1.0` - Structured logging library
- **uuid** `^4.0.0` - UUID v4 generation

---

## 🗂️ Arquivos Criados/Modificados

### 1. `server/services/logger.js` (NEW - 154 linhas)

**Funcionalidade Core:**

```javascript
// UUID request ID middleware
export const requestLoggerMiddleware = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.requestId = requestId;
  // Log estruturado com requestId...
}

// Logger instance com Winston
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { 
    service: 'aparecida-backend',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    new winston.transports.Console(), // Todos os envs
    new winston.transports.File(),    // Apenas production
  ]
})
```

**Features:**

| Feature | Implementação |
|---------|----------------|
| **Format** | JSON com timestamp ISO 8601 |
| **Request ID** | UUID v4 por requisição |
| **Masking** | `maskSensitiveData()` para Authorization, Cookie, Stripe-Signature |
| **Webhook Skip** | `if (req.path !== '/api/webhook')` - não loga body |
| **Duration** | `Date.now() - startTime` em ms |
| **Status Levels** | 4xx=warn, 2xx=info, 3xx=debug |
| **File Output** | `/home/ubuntu/aparecida/logs/` (production only) |

---

### 2. `server/index.js` (UPDATED)

**Mudanças:**

```diff
+ import logger, { requestLoggerMiddleware } from "./services/logger.js";

  // Substituição de console.log → logger.info()
- console.log('🔍 ENV carregado de:', envPath);
+ logger.info('🔍 ENV carregado de:', { path: envPath });

  // Registro do middleware
+ app.use(requestLoggerMiddleware);
```

**Onde foi adicionado middleware:**
- Linha 489: Após rate limiter, antes de rotas

**Logs substituídos:**
- ENV loading (3 locations)
- Supabase init
- Stripe init
- Helmet init
- CORS config
- Rate limiting init
- Server startup

---

## 📊 Exemplo de Log Estruturado

### Production Output (Console + Winston)

```json
[2026-02-26 20:17:37] info: → GET /api/plans {
  "service": "aparecida-backend",
  "environment": "development",
  "requestId": "0df392ea-1f21-429b-a551-a0fb1c528a3b",
  "method": "GET",
  "path": "/api/plans",
  "ip": "52.14.244.186",
  "userAgent": "curl/8.5.0",
  "headers": {
    "connection": "upgrade",
    "host": "aparecidadonortesp.com.br",
    "x-real-ip": "52.14.244.186",
    "x-forwarded-for": "52.14.244.186",
    "x-forwarded-proto": "https",
    "user-agent": "curl/8.5.0",
    "accept": "*/*"
  },
  "query": {}
}
```

### Response Log

```json
[2026-02-26 20:17:37] info: ← GET /api/plans 200 2ms {
  "requestId": "0df392ea-1f21-429b-a551-a0fb1c528a3b",
  "statusCode": 200,
  "duration": 2
}
```

---

## 🔒 Mascaramento de Dados Sensíveis

Headers automaticamente reduzidos:

| Original | Masked |
|----------|--------|
| `authorization: Bearer sk_live_...` | `authorization: ***REDACTED***` |
| `cookie: session=...` | `cookie: ***REDACTED***` |
| `stripe-signature: t=...,v1=...` | `stripe-signature: ***REDACTED***` |
| `password: ...` | `password: ***REDACTED***` |
| `token: ...` | `token: ***REDACTED***` |

---

## 🔐 Webhook Protection

Payloads de webhook **nunca são logados** para evitar exposição de dados de pagamento:

```javascript
// Skip webhook body logging
if (req.path !== '/api/webhook' && !req.path.includes('stripe')) {
  // Log body apenas para rotas seguras
}
```

---

## 📁 File Output (Production Only)

**Ativado apenas com:** `NODE_ENV=production`

**Locais:**
- `/home/ubuntu/aparecida/logs/error.log` - Apenas erros (5 files, 5MB each)
- `/home/ubuntu/aparecida/logs/combined.log` - Todos os níveis (10 files, 5MB each)

**Verificar status:**
```bash
ssh ubuntu@52.14.244.186 "tail /home/ubuntu/aparecida/logs/combined.log"
```

---

## 🧪 Testing

### 1. Verificar Logs em Tempo Real

```bash
# SSH para EC2
ssh -i aparecida-server.pem ubuntu@52.14.244.186

# Tail PM2 logs (real-time)
pm2 logs aparecida-backend
```

### 2. Teste de Request com requestId

```bash
# GET request
curl -v https://aparecidadonortesp.com.br/api/plans \
  -H "Origin: https://www.aparecidadonortesp.com.br"

# Procurar nos logs por: requestId "0df392ea-1f21..."
```

### 3. Verificar Mascaramento

Fazer request com autorização:
```bash
curl https://aparecidadonortesp.com.br/api/plans \
  -H "Authorization: Bearer secret_key"

# Logs devem mostrar: "authorization": "***REDACTED***"
```

### 4. Webhook Não é Logado

```bash
# Simular webhook (não deve logar body)
curl -X POST https://aparecidadonortesp.com.br/api/webhook \
  -H "Stripe-Signature: ..." \
  -d "{...}"

# Logs: path=/api/webhook → skip body
```

---

## 🚀 Deployment Status

| Component | Status | Location |
|-----------|--------|----------|
| logger.js | ✅ Deployed | `/home/ubuntu/aparecida/server/services/logger.js` |
| index.js updated | ✅ Deployed | `/home/ubuntu/aparecida/server/index.js` |
| Packages installed | ✅ Deployed | `npm install winston uuid` |
| PM2 running | ✅ Active | PID 100910+ |
| Console logging | ✅ Working | Via PM2 logs |
| File logging | ⏳ Ready | Ativado se NODE_ENV=production |

---

## 📈 Next Steps (Phase 3 Hardening)

1. **Health Check Endpoint** - GET /health para uptime monitoring
2. **Error Handling** - Stack traces estruturados com Winston
3. **Metrics Export** - Prometheus/CloudWatch integration
4. **Monitoring Dashboards** - Alert on error rate > 5%

---

## 📝 Environment Variables

Para ativar file logging:

```bash
# .env on EC2
NODE_ENV=production
LOG_LEVEL=info  # debug|info|warn|error
```

---

## 🔍 Troubleshooting

### Logs não aparecem
```bash
# 1. Verificar se middleware foi registrado
grep requestLoggerMiddleware /home/ubuntu/aparecida/server/index.js

# 2. Verificar PM2 status
ssh ubuntu@52.14.244.186 pm2 status

# 3. Verificar imports
head -20 /home/ubuntu/aparecida/server/index.js | grep logger
```

### Arquivo de log não criado
```bash
# Verificar NODE_ENV
ssh ubuntu@52.14.244.186 "echo $NODE_ENV"

# Se não está production, ativar file output manualmente
mkdir -p /home/ubuntu/aparecida/logs
chmod 777 /home/ubuntu/aparecida/logs
```

---

**Última atualização**: 2026-02-26  
**Commit**: `096ae13` feat(logging): Winston estruturado com UUID requestId
