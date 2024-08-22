import { createClient } from '@supabase/supabase-js'

const isBrowser = typeof window !== 'undefined';

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: true,
            storage: isBrowser ? localStorage : undefined
        }
    }
)


// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// const supabase = createClient(supabaseUrl, supabaseKey)