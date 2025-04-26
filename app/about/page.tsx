"use client"

import type React from "react"

import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Building, Mail, Phone, MapPin, Globe, Users, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function AboutPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: "", email: "", message: "" })
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("nav.aboutUs")}</h1>
          <p className="text-xl text-gray-600">
            Connecting construction companies with skilled professionals across Ethiopia
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              Our mission is to revolutionize the construction industry in Ethiopia by creating a transparent, efficient
              marketplace that connects quality construction companies with skilled professionals.
            </p>
            <p className="text-gray-600 mb-6">
              We aim to reduce unemployment, improve construction quality standards, and contribute to the development
              of infrastructure across the country.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">Our Vision</h2>
            <p className="text-gray-600">
              To become the leading construction marketplace in Ethiopia and expand across East Africa, creating
              opportunities for millions of professionals and companies while improving the quality of construction
              projects throughout the region.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Key Facts</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                <span>Founded in 2023 to address the gap between construction companies and skilled professionals</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                <span>Serving all major cities in Ethiopia with plans to expand nationwide</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                <span>
                  Supporting all types of construction projects from residential to commercial and infrastructure
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                <span>Bilingual platform supporting both English and Amharic to serve all Ethiopians</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                <span>Committed to improving construction standards and creating employment opportunities</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            {isSubmitted ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center p-6">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for contacting us. We'll get back to you as soon as possible.
                    </p>
                    <Button className="mt-4" onClick={() => setIsSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block font-medium">
                    Your Name
                  </label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block font-medium">
                    Email Address
                  </label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="block font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Our Office</h2>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <MapPin className="h-12 w-12 text-gray-400" />
                {/* Replace with actual map or image */}
                <span className="ml-2 text-gray-500">Map Loading...</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start">
                  <Building className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Construction Marketplace</h3>
                    <p className="text-gray-600">Bole Road, Addis Ababa, Ethiopia</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <p>+251 11 234 5678</p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <p>info@constructionmarketplace.et</p>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-blue-600 mr-3" />
                  <p>www.constructionmarketplace.et</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Join Our Community</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Whether you're a construction company looking for skilled professionals or a professional seeking
            opportunities, our platform is designed for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Users className="mr-2 h-5 w-5" />
              Sign Up as Client
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              <Building className="mr-2 h-5 w-5" />
              Register Company
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
