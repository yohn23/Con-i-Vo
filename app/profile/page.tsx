"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Building, User, MapPin, Phone, Mail, FileEdit, CheckCircle, Globe } from "lucide-react"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [profileData, setProfileData] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [bids, setBids] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      fetchProfileData()
    }
  }, [user, loading, router])

  const fetchProfileData = async () => {
    if (!user) return

    setIsLoading(true)
    const supabase = getSupabaseBrowserClient()

    try {
      // Fetch profile data based on user role
      if (user.role === "client") {
        const { data: profile } = await supabase.from("client_profiles").select("*").eq("user_id", user.id).single()

        // Fetch bids for client
        const { data: bidsData } = await supabase
          .from("bids")
          .select(`
            *,
            projects:project_id (
              id,
              title,
              budget,
              location,
              status,
              company:company_id (
                id,
                company_profiles (company_name)
              )
            )
          `)
          .eq("client_id", user.id)
          .order("created_at", { ascending: false })

        setProfileData(profile || {})
        setBids(bidsData || [])
        setFormData({
          address: profile?.address || "",
          bio: profile?.bio || "",
          phone: user.phone || "",
        })
      } else {
        // Company
        const { data: profile } = await supabase.from("company_profiles").select("*").eq("user_id", user.id).single()

        // Fetch projects for company
        const { data: projectsData } = await supabase
          .from("projects")
          .select(`
            *,
            categories:category_id (id, name_en, name_am),
            bids (id, status, bid_amount)
          `)
          .eq("company_id", user.id)
          .order("created_at", { ascending: false })

        setProfileData(profile || {})
        setProjects(projectsData || [])
        setFormData({
          company_name: profile?.company_name || "",
          business_license: profile?.business_license || "",
          address: profile?.address || "",
          description: profile?.description || "",
          website: profile?.website || "",
          phone: user.phone || "",
        })
      }
    } catch (error) {
      console.error("Error fetching profile data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    setSaveSuccess(false)
    const supabase = getSupabaseBrowserClient()

    try {
      if (user.role === "client") {
        await supabase
          .from("client_profiles")
          .update({
            address: formData.address,
            bio: formData.bio,
          })
          .eq("user_id", user.id)
      } else {
        await supabase
          .from("company_profiles")
          .update({
            company_name: formData.company_name,
            business_license: formData.business_license,
            address: formData.address,
            description: formData.description,
            website: formData.website,
          })
          .eq("user_id", user.id)
      }

      // Update phone in users table
      await supabase
        .from("users")
        .update({
          phone: formData.phone,
        })
        .eq("id", user.id)

      await fetchProfileData()
      setIsEditing(false)
      setSaveSuccess(true)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder-user.jpg" alt={user?.full_name} />
                    <AvatarFallback>
                      {user?.role === "client" ? (
                        <User className="h-12 w-12 text-gray-400" />
                      ) : (
                        <Building className="h-12 w-12 text-gray-400" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">
                    {user?.role === "client" ? user?.full_name : profileData?.company_name || user?.full_name}
                  </h2>
                  <Badge className="mt-2">{user?.role === "client" ? "Client" : "Company"}</Badge>

                  <div className="w-full mt-6 space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{user?.email}</span>
                    </div>
                    {formData.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{formData.phone}</span>
                      </div>
                    )}
                    {formData.address && (
                      <div className="flex items-start text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 mt-1" />
                        <span>{formData.address}</span>
                      </div>
                    )}
                    {user?.role === "company" && formData.website && (
                      <div className="flex items-center text-gray-600">
                        <Globe className="h-4 w-4 mr-2" />
                        <a
                          href={formData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {formData.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" className="mt-6 w-full" onClick={() => setIsEditing(true)}>
                    <FileEdit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3">
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    {user?.role === "company" && (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="company_name" className="font-medium">
                            Company Name
                          </label>
                          <Input
                            id="company_name"
                            name="company_name"
                            value={formData.company_name || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="business_license" className="font-medium">
                            Business License
                          </label>
                          <Input
                            id="business_license"
                            name="business_license"
                            value={formData.business_license || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <label htmlFor="phone" className="font-medium">
                        Phone Number
                      </label>
                      <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="address" className="font-medium">
                        Address
                      </label>
                      <Input id="address" name="address" value={formData.address || ""} onChange={handleChange} />
                    </div>

                    {user?.role === "client" ? (
                      <div className="space-y-2">
                        <label htmlFor="bio" className="font-medium">
                          Bio
                        </label>
                        <Textarea id="bio" name="bio" rows={4} value={formData.bio || ""} onChange={handleChange} />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="description" className="font-medium">
                            Company Description
                          </label>
                          <Textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="website" className="font-medium">
                            Website
                          </label>
                          <Input
                            id="website"
                            name="website"
                            type="url"
                            value={formData.website || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </>
                    )}
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  {user?.role === "client" ? (
                    <TabsTrigger value="bids">My Bids</TabsTrigger>
                  ) : (
                    <TabsTrigger value="projects">My Projects</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      {saveSuccess && (
                        <div className="flex items-center text-green-600 mt-2">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Profile updated successfully
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      {user?.role === "client" ? (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">About Me</h3>
                          <p className="text-gray-600">{profileData?.bio || "No bio provided yet."}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Company Description</h3>
                          <p className="text-gray-600">{profileData?.description || "No description provided yet."}</p>

                          {profileData?.business_license && (
                            <div>
                              <h3 className="text-lg font-semibold mt-6 mb-2">Business License</h3>
                              <p className="text-gray-600">{profileData.business_license}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {user?.role === "client" ? (
                  <TabsContent value="bids">
                    <Card>
                      <CardHeader>
                        <CardTitle>My Bids</CardTitle>
                        <CardDescription>Track the status of your bids on construction projects</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {bids.length > 0 ? (
                          <div className="space-y-4">
                            {bids.map((bid) => (
                              <Card key={bid.id} className="overflow-hidden">
                                <div
                                  className={`h-2 ${
                                    bid.status === "accepted"
                                      ? "bg-green-500"
                                      : bid.status === "rejected"
                                        ? "bg-red-500"
                                        : "bg-blue-500"
                                  }`}
                                />
                                <CardContent className="pt-6">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-semibold text-lg">{bid.projects.title}</h3>
                                      <p className="text-gray-600 mt-1">
                                        Posted by: {bid.projects.company.company_profiles[0]?.company_name}
                                      </p>
                                    </div>
                                    <Badge
                                      className={
                                        bid.status === "accepted"
                                          ? "bg-green-100 text-green-800"
                                          : bid.status === "rejected"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-blue-100 text-blue-800"
                                      }
                                    >
                                      {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                                    </Badge>
                                  </div>

                                  <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-500">Your Bid</p>
                                      <p className="font-semibold">${bid.bid_amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Project Budget</p>
                                      <p className="font-semibold">
                                        {bid.projects.budget
                                          ? `$${bid.projects.budget.toLocaleString()}`
                                          : "Not specified"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="mt-4">
                                    <p className="text-sm text-gray-500">Your Proposal</p>
                                    <p className="mt-1">{bid.proposal}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-500">You haven't submitted any bids yet.</p>
                            <Button className="mt-4" onClick={() => router.push("/projects")}>
                              Browse Projects
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ) : (
                  <TabsContent value="projects">
                    <Card>
                      <CardHeader>
                        <CardTitle>My Projects</CardTitle>
                        <CardDescription>Manage your construction projects and review bids</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {projects.length > 0 ? (
                          <div className="space-y-4">
                            {projects.map((project) => (
                              <Card key={project.id} className="overflow-hidden">
                                <div
                                  className={`h-2 ${
                                    project.status === "completed"
                                      ? "bg-green-500"
                                      : project.status === "in_progress"
                                        ? "bg-blue-500"
                                        : project.status === "cancelled"
                                          ? "bg-red-500"
                                          : "bg-amber-500"
                                  }`}
                                />
                                <CardContent className="pt-6">
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-lg">{project.title}</h3>
                                    <Badge
                                      className={
                                        project.status === "completed"
                                          ? "bg-green-100 text-green-800"
                                          : project.status === "in_progress"
                                            ? "bg-blue-100 text-blue-800"
                                            : project.status === "cancelled"
                                              ? "bg-red-100 text-red-800"
                                              : "bg-amber-100 text-amber-800"
                                      }
                                    >
                                      {project.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </Badge>
                                  </div>

                                  <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-500">Budget</p>
                                      <p className="font-semibold">
                                        {project.budget ? `$${project.budget.toLocaleString()}` : "Not specified"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Location</p>
                                      <p className="font-semibold">{project.location}</p>
                                    </div>
                                  </div>

                                  <div className="mt-4">
                                    <p className="text-sm text-gray-500">Bids Received</p>
                                    <p className="font-semibold">{project.bids.length}</p>
                                  </div>

                                  <div className="mt-4 flex justify-end">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => router.push(`/projects/${project.id}`)}
                                    >
                                      View Details
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-500">You haven't posted any projects yet.</p>
                            <Button className="mt-4">Create New Project</Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
