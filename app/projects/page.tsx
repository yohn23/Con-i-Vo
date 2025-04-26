import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProjectList } from "@/components/project-list"

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { category?: string; location?: string; search?: string }
}) {
  const supabase = getSupabaseServerClient()

  // Fetch categories for filter
  const { data: categories } = await supabase.from("categories").select("id, name_en, name_am")

  // Fetch projects with filters
  let query = supabase
    .from("projects")
    .select(`
      *,
      categories:category_id (id, name_en, name_am),
      company:company_id (id, full_name, company_profiles (company_name, logo_url))
    `)
    .order("created_at", { ascending: false })

  if (searchParams.category && searchParams.category !== "all") {
    query = query.eq("category_id", searchParams.category)
  }

  if (searchParams.location && searchParams.location !== "all") {
    query = query.ilike("location", `%${searchParams.location}%`)
  }

  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
  }

  const { data: projects } = await query

  // Get unique locations for filter
  const { data: locations } = await supabase.from("projects").select("location").order("location")

  const uniqueLocations = locations ? Array.from(new Set(locations.map((item) => item.location))) : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Browse Construction Projects</h1>
        <p className="text-gray-600">
          Find construction projects that match your skills and interests. Filter by category, location, or search for
          specific projects.
        </p>
      </div>

      <ProjectList projects={projects || []} categories={categories || []} locations={uniqueLocations} />
    </div>
  )
}
