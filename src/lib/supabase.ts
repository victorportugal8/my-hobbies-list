import { createClient } from '@supabase/supabase-js';

// Expondo as variáveis de ambiente dentro de import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam as variáveis de ambiente do Supabase no arquivo .env.local');
}

// Cria e exporta o cliente para usarmos em qualquer lugar do projeto
export const supabase = createClient(supabaseUrl, supabaseAnonKey);