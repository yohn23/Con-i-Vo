"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, Building, Clock, Award } from "lucide-react"

export default function HowItWorksPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("nav.howItWorks")}</h1>
          <p className="text-xl text-gray-600">
            Our platform connects construction companies with skilled professionals in a simple and efficient way.
          </p>
        </div>

        <div className="grid gap-12">
          {/* For Clients */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Users className="mr-2 h-6 w-6 text-blue-600" />
              For Clients
            </h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      1
                    </span>
                    Create an Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Sign up as a client to access our platform. Fill in your details and create your professional
                    profile to showcase your skills and experience.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      2
                    </span>
                    Browse Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Explore available construction projects. Use filters to find projects that match your expertise,
                    location preferences, and budget expectations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      3
                    </span>
                    Submit Bids
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    When you find a project that interests you, submit a competitive bid. Include your proposal,
                    relevant experience, and your bid amount.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      4
                    </span>
                    Get Hired & Complete Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    If your bid is accepted, you'll be notified and can begin work on the project. Complete the project
                    according to the agreed terms and timeline.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* For Companies */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Building className="mr-2 h-6 w-6 text-indigo-600" />
              For Companies
            </h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      1
                    </span>
                    Register Your Company
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Create a company account with your business details. Provide information about your company,
                    services, and previous work to build credibility.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      2
                    </span>
                    Post Construction Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Create detailed project listings with clear requirements, budget, timeline, and location. The more
                    specific you are, the better matches you'll find.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      3
                    </span>
                    Review Bids
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Receive and review bids from qualified professionals. Compare proposals, experience, and pricing to
                    find the best match for your project needs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      4
                    </span>
                    Hire & Manage Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Select and hire the best professional for your project. Communicate through our platform, track
                    progress, and complete the project successfully.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Verified Professionals</h3>
              <p className="text-gray-600">
                All professionals and companies on our platform are verified for quality and reliability.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="h-12 w-12 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Time Saving</h3>
              <p className="text-gray-600">Our streamlined process saves time for both clients and companies.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Award className="h-12 w-12 text-indigo-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Quality Work</h3>
              <p className="text-gray-600">Our rating system ensures high-quality work and professional conduct.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
