import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'
// [...]

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL||"",
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY||""
)

// [...]