import { createClient } from '@supabase/supabase-js';

let client = null;

export function getSupabaseAdmin() {
  if (client) return client;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Defina SUPABASE_URL e SUPABASE_SECRET_KEY (ou SUPABASE_SERVICE_KEY) no .env do servidor.'
    );
  }

  client = createClient(supabaseUrl, supabaseServiceKey);
  return client;
}

/** @deprecated Use getSupabaseAdmin() — mantido para compatibilidade interna */
export const supabaseAdmin = new Proxy(
  {},
  {
    get(_target, prop) {
      return getSupabaseAdmin()[prop];
    },
  }
);

export default supabaseAdmin;
