import { createClient } from '@supabase/supabase-js'

// A Supabase client for public data fetching in Server Components.
// This client does not use cookies() so it won't opt the page into dynamic rendering,
// allowing Next.js to statically generate or cache the pages for better performance.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
