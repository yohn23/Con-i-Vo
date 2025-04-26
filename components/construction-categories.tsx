"use client"

import { useLanguage } from "@/context/language-context"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Building, RouteIcon as Road, Droplet } from "lucide-react"

export function ConstructionCategories() {
  const { language } = useLanguage()

  const categories = [
    {
      id: "1",
      name_en: "Building Construction",
      name_am: "የህንፃ ግንባታ",
      icon: <Building className="h-12 w-12 text-blue-600 mb-4" />,
      description_en: "Residential, commercial, and industrial building projects",
      description_am: "የመኖሪያ፣ የንግድ እና የኢንዱስትሪ ህንፃ ፕሮጀክቶች",
      image: "/images/building-construction.jpg",
    },
    {
      id: "2",
      name_en: "Road Construction",
      name_am: "የመንገድ ግንባታ",
      icon: <Road className="h-12 w-12 text-blue-600 mb-4" />,
      description_en: "Highways, bridges, and infrastructure development",
      description_am: "አውራ ጎዳናዎች፣ ድልድዮች እና የመሰረተ ልማት ግንባታ",
      image: "/images/road-construction.jpg",
    },
    {
      id: "3",
      name_en: "Water Construction",
      name_am: "የውሃ ግንባታ",
      icon: <Droplet className="h-12 w-12 text-blue-600 mb-4" />,
      description_en: "Dams, irrigation systems, and water supply networks",
      description_am: "ግድቦች፣ የመስኖ ስርዓቶች እና የውሃ አቅርቦት አውታረ መረቦች",
      image: "/images/water-construction.jpg",
    },
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Construction Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Explore projects across different construction sectors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link href={`/projects?category=${category.id}`} key={category.id}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
                <div className="h-48 overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(${category.image})` }}
                  ></div>
                </div>
                <CardContent className="p-6 text-center">
                  {category.icon}
                  <h3 className="text-xl font-bold mb-2">{language === "en" ? category.name_en : category.name_am}</h3>
                  <p className="text-gray-600">
                    {language === "en" ? category.description_en : category.description_am}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
