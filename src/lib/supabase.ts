import { createClient } from '@supabase/supabase-js';

// Valores hardcoded temporariamente para debug
const supabaseUrl = 'https://rhkwickoweflamflgzeo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoa3dpY2tvd2VmbGFtZmxnemVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjIyODMsImV4cCI6MjA3MDMzODI4M30.Pz7Vsh0HQL17g-CRWJD7CHrX_KzN4YYFl57XxxNjJUQ';

console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Supabase Key (primeiros 20 chars):', supabaseAnonKey.substring(0, 20));

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