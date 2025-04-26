"use client"

import { useLanguage } from "@/context/language-context"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

type Project = {
  id: string
  title: string
  description: string
  location: string
  budget: number | null
  created_at: string
  categories: {
    id: string
    name_en: string
    name_am: string
  }
  company: {
    id: string
    full_name: string
    company_profiles: {
      company_name: string
      logo_url: string | null
    }[]
  }
}

type Category = {
  id: string
  name_en: string
  name_am: string
}

type ProjectListProps = {
  projects: Project[]
  categories: Category[]
  locations: string[]
}

export function ProjectList({ projects, categories, locations }: ProjectListProps) {
  const { t, language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "")
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "")

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (categoryFilter) params.set("category", categoryFilter)
    if (locationFilter) params.set("location", locationFilter)
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold mb-4">{t("home.filter.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("home.filter.category")}</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t("home.filter.selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {language === "en" ? category.name_en : category.name_am}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("home.filter.location")}</label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t("home.filter.selectLocation")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleFilter} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              {t("home.search")}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => <ProjectCard key={project.id} project={project} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No projects found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
