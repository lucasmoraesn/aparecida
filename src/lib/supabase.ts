import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_5drwG2WzPvYNO4fhVD-cUg_8HSJW9sh';

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