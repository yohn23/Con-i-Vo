import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/database.types"

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export const getSupabaseBrowserClient = () => {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return supabaseClient
}
