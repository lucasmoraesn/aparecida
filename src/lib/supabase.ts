import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase do frontend — apenas chave publishable (anon).
 * Compras e downloads passam pela API backend; este client não acessa ebook_purchases.
 */
const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  (import.meta.env.DEV ? 'https://rhkwickoweflamflgzeo.supabase.co' : '')
).trim();

const supabasePublishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

if (!supabaseUrl) {
  throw new Error(
    'Defina VITE_SUPABASE_URL no build (ex.: .env.production) ou use .env.local em desenvolvimento.'
  );
}

if (!supabasePublishableKey) {
  throw new Error(
    'Defina VITE_SUPABASE_PUBLISHABLE_KEY (ou VITE_SUPABASE_ANON_KEY) no frontend.'
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

export type Establishment = {
  id: number;
  name: string;
  category: string;
  rating: number;
  address: string;
  phone: string;
  whatsapp: string;
  image: string;
  description: string;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
};

export type EstablishmentType = 'hotels' | 'restaurants' | 'shops' | 'attractions';
