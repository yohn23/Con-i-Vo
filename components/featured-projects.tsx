"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/context/language-context"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, DollarSign, Building, ArrowRight } from "lucide-react"

export function FeaturedProjects() {
  const { language, t } = useLanguage()
  const [projects, setProjects] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<{ [key: string]: any }>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      const supabase = getSupabaseBrowserClient()

      try {
        // Fetch projects
        const { data: projectsData } = await supabase
          .from("projects")
          .select(`
            *,
            categories(*),
            company:company_id(
              id,
              full_name,
              company_profiles(company_name, logo_url)
            )
          `)
          .eq("status", "open")
          .order("created_at", { ascending: false })
          .limit(3)

        setProjects(projectsData || [])

        // Fetch subcategories for projects that have them
        const subcategoryIds =
          projectsData?.filter((project) => project.subcategory_id).map((project) => project.subcategory_id) || []

        if (subcategoryIds.length > 0) {
          const { data: subcategoriesData } = await supabase.from("subcategories").select("*").in("id", subcategoryIds)

          // Create a map of subcategory_id to subcategory data
          const subcategoriesMap = (subcategoriesData || []).reduce((acc, subcategory) => {
            acc[subcategory.id] = subcategory
            return acc
          }, {})

          setSubcategories(subcategoriesMap)
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (projects.length === 0) {
    return null
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore some of our latest construction projects open for bidding
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => {
            const projectSubcategory = project.subcategory_id ? subcategories[project.subcategory_id] : null

            return (
              <Card key={project.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl line-clamp-2">{project.title}</CardTitle>
                    <Badge>{language === "en" ? project.categories.name_en : project.categories.name_am}</Badge>
                  </div>
                  {projectSubcategory && (
                    <Badge variant="outline" className="mt-2 w-fit">
                      {language === "en" ? projectSubcategory.name_en : projectSubcategory.name_am}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-2 h-4 w-4" />
                      {project.location}
                    </div>
                    {project.budget && (
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="mr-2 h-4 w-4" />
                        {project.budget.toLocaleString()} ETB
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Building className="mr-2 h-4 w-4" />
                      {project.company.company_profiles[0]?.company_name || project.company.full_name}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/projects/${project.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/projects">
            <Button size="lg">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
