"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

export function Testimonials() {
  const { t } = useLanguage()

  const testimonials = [
    {
      id: 1,
      name: "Abel Yayneshet",
      role: "Project Manager",
      company: "Addis Construction",
      image: "/images/testimonial-1.jpg",
      quote:
        "Con-i has transformed how we find qualified professionals for our projects. The platform is easy to use and has helped us complete projects on time and within budget.",
    },
    {
      id: 2,
      name: "Sara Hailu",
      role: "Civil Engineer",
      company: "Independent Contractor",
      image: "/images/testimonial-2.jpg",
      quote:
        "As a professional in the construction industry, Con-i has opened up new opportunities for me. I've been able to secure multiple projects and grow my portfolio.",
    },
    {
      id: 3,
      name: "Dawit Mekonnen",
      role: "CEO",
      company: "Mekonnen Building Solutions",
      image: "/images/testimonial-3.jpg",
      quote:
        "The quality of professionals we've found through Con-i has exceeded our expectations. The bidding process is transparent and helps us find the right talent for each project.",
    },
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from companies and professionals who have used Con-i to connect and complete successful projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-blue-600 mb-4" />
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
