import { createClient } from '@supabase/supabase-js'

// Use regular environment variables, not NEXT_PUBLIC_*
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 