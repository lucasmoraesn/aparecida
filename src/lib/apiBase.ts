/**
 * URL base da API.
 * Em desenvolvimento: string vazia → requisições `/api/*` passam pelo proxy do Vite (`vite.config.ts` → :3001).
 * Em produção: `VITE_API_URL` ou domínio público do backend.
 */
export function getApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    return '';
  }
  const raw = import.meta.env.VITE_API_URL || 'https://aparecidadonortesp.com.br';
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}
