import { createClient } from '@supabase/supabase-js';

// Valores padrão para desenvolvimento local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Apenas log de aviso em desenvolvimento
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas. Usando valores padrão para desenvolvimento.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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