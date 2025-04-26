"use client"

import { useLanguage } from "@/context/language-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Building, FileText, CheckCircle } from "lucide-react"

export function HowItWorksSection() {
  const { t } = useLanguage()

  return (
    <div className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How Con-i Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform makes it easy to connect construction companies with skilled professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center">
                    <Building className="mr-2 h-5 w-5 text-blue-600" />
                    Companies Post Projects
                  </h3>
                  <p className="text-gray-600">
                    Construction companies post their projects with detailed requirements, budget, and timeline.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-600" />
                    Professionals Submit Bids
                  </h3>
                  <p className="text-gray-600">
                    Qualified professionals review projects and submit competitive bids with their proposals.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                    Companies Review Bids
                  </h3>
                  <p className="text-gray-600">
                    Companies review bids, compare proposals, and select the best professionals for their projects.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-blue-600" />
                    Successful Project Delivery
                  </h3>
                  <p className="text-gray-600">
                    Professionals complete the projects according to requirements, leading to successful delivery.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/how-it-works">
                <Button variant="outline">
                  Learn More About How It Works
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="/images/construction-team.jpg"
                alt="Construction team working together"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-lg">Trusted Platform</p>
                  <p className="text-gray-600">500+ Successful Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
