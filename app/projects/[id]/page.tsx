"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { BidForm } from "@/components/bid-form"
import { ProjectBids } from "@/components/project-bids"
import { Loader2, MapPin, Calendar, DollarSign, Building, Clock, ArrowLeft, Tag } from "lucide-react"

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { user, loading } = useAuth()
  const { language, t } = useLanguage()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [subcategory, setSubcategory] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userBid, setUserBid] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true)
      const supabase = getSupabaseBrowserClient()

      try {
        // Fetch project details
        const { data: projectData, error } = await supabase
          .from("projects")
          .select(`
            *,
            categories(*),
            company:company_id(
              id,
              full_name,
              company_profiles(*)
            )
          `)
          .eq("id", id)
          .single()

        if (error) throw error

        setProject(projectData)

        // If project has a subcategory_id, fetch the subcategory separately
        if (projectData.subcategory_id) {
          const { data: subcategoryData } = await supabase
            .from("subcategories")
            .select("*")
            .eq("id", projectData.subcategory_id)
            .single()

          setSubcategory(subcategoryData)
        }

        // If user is logged in, check if they have already bid on this project
        if (user) {
          const { data: bidData } = await supabase
            .from("bids")
            .select("*")
            .eq("project_id", id)
            .eq("client_id", user.id)
            .single()

          setUserBid(bidData || null)
        }
      } catch (error) {
        console.error("Error fetching project:", error)
        router.push("/projects")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProject()
    }
  }, [id, user, router])

  if (isLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-lg">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <p className="mb-6">The project you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    )
  }

  const isOwner = user && user.id === project.company_id
  const canBid = user && user.role === "client" && !isOwner && project.status === "open"
  const hasBid = !!userBid

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.push("/projects")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {project.location}
              </div>
            </div>
            <Badge className="self-start md:self-auto" variant="outline">
              {project.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="details">Project Details</TabsTrigger>
              {isOwner && <TabsTrigger value="bids">Bids</TabsTrigger>}
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{project.description}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{t("project.budget")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-2xl font-semibold">
                      <DollarSign className="h-5 w-5 mr-1" />
                      {project.budget ? project.budget.toLocaleString() + " ETB" : "Not specified"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-base">
                        {language === "en" ? project.categories.name_en : project.categories.name_am}
                      </Badge>

                      {subcategory && (
                        <div className="flex items-center mt-2">
                          <Tag className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-gray-600">
                            {language === "en" ? subcategory.name_en : subcategory.name_am}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Posted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {(project.start_date || project.end_date) && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.start_date && (
                        <div>
                          <div className="text-sm text-gray-500">Start Date</div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{new Date(project.start_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}

                      {project.end_date && (
                        <div>
                          <div className="text-sm text-gray-500">End Date</div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{new Date(project.end_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {isOwner && (
              <TabsContent value="bids" className="mt-6">
                <ProjectBids projectId={project.id} />
              </TabsContent>
            )}
          </Tabs>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Posted By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start mb-4">
                <Building className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">
                    {project.company.company_profiles[0]?.company_name || project.company.full_name}
                  </h3>
                  {project.company.company_profiles[0]?.address && (
                    <p className="text-gray-600 text-sm mt-1">{project.company.company_profiles[0].address}</p>
                  )}
                </div>
              </div>

              {project.company.company_profiles[0]?.description && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h4 className="font-medium mb-2">About the Company</h4>
                    <p className="text-gray-600 text-sm">
                      {project.company.company_profiles[0].description.length > 200
                        ? `${project.company.company_profiles[0].description.substring(0, 200)}...`
                        : project.company.company_profiles[0].description}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {canBid && (
            <>
              {hasBid ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Bid</CardTitle>
                    <CardDescription>You have already submitted a bid for this project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Bid Amount</p>
                        <p className="font-semibold">{userBid.bid_amount.toLocaleString()} ETB</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <Badge
                          className={
                            userBid.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : userBid.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {userBid.status.charAt(0).toUpperCase() + userBid.status.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Submitted On</p>
                        <p>{new Date(userBid.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <BidForm projectId={project.id} onBidSubmitted={setUserBid} />
              )}
            </>
          )}

          {!user && (
            <Card>
              <CardHeader>
                <CardTitle>Interested in this project?</CardTitle>
                <CardDescription>Sign in to submit a bid</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push(`/login?redirect=/projects/${id}`)} className="w-full">
                  Login to Submit Bid
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
