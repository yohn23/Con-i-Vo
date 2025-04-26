"use client"

import { useLanguage } from "@/context/language-context"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, DollarSign } from "lucide-react"

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

export function ProjectCard({ project }: { project: Project }) {
  const { t, language } = useLanguage()

  const companyName = project.company.company_profiles[0]?.company_name || project.company.full_name
  const categoryName = language === "en" ? project.categories.name_en : project.categories.name_am

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <Badge>{categoryName}</Badge>
        </div>
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
            <Calendar className="mr-2 h-4 w-4" />
            {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between items-center">
        <div className="text-sm">
          <span className="text-gray-500">{t("project.postedBy")}:</span> {companyName}
        </div>
        <Link href={`/projects/${project.id}`}>
          <Button variant="default" size="sm">
            {t("project.viewDetails")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
