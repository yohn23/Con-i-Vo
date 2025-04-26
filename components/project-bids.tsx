"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, User, CheckCircle, XCircle } from "lucide-react"

interface ProjectBidsProps {
  projectId: string
}

export function ProjectBids({ projectId }: ProjectBidsProps) {
  const [bids, setBids] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchBids()
  }, [projectId])

  const fetchBids = async () => {
    setIsLoading(true)
    const supabase = getSupabaseBrowserClient()

    try {
      const { data, error } = await supabase
        .from("bids")
        .select(`
          *,
          client:client_id (
            id,
            full_name,
            email,
            client_profiles (*)
          )
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setBids(data || [])
    } catch (error) {
      console.error("Error fetching bids:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateBidStatus = async (bidId: string, status: "accepted" | "rejected") => {
    setIsUpdating(bidId)
    const supabase = getSupabaseBrowserClient()

    try {
      const { error } = await supabase.from("bids").update({ status }).eq("id", bidId)

      if (error) throw error

      // If accepting a bid, update the project status to in_progress
      if (status === "accepted") {
        await supabase.from("projects").update({ status: "in_progress" }).eq("id", projectId)
      }

      toast({
        title: "Success",
        description: `Bid ${status === "accepted" ? "accepted" : "rejected"} successfully`,
      })

      // Refresh bids
      fetchBids()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${status} bid`,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const filteredBids = bids.filter((bid) => {
    if (activeTab === "all") return true
    return bid.status === activeTab
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (bids.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No bids have been submitted for this project yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Bids ({bids.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({bids.filter((bid) => bid.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({bids.filter((bid) => bid.status === "accepted").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({bids.filter((bid) => bid.status === "rejected").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-6">
            {filteredBids.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">No {activeTab} bids found.</p>
                </CardContent>
              </Card>
            ) : (
              filteredBids.map((bid) => (
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
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage
                            src={bid.client.client_profiles[0]?.profile_image_url || "/placeholder-user.jpg"}
                            alt={bid.client.full_name}
                          />
                          <AvatarFallback>
                            <User className="h-6 w-6 text-gray-400" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{bid.client.full_name}</CardTitle>
                          <CardDescription>{bid.client.email}</CardDescription>
                        </div>
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
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Bid Amount</p>
                        <p className="font-semibold text-lg">{bid.bid_amount.toLocaleString()} ETB</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Submitted On</p>
                        <p>{new Date(bid.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Proposal</p>
                      <p className="text-gray-700">{bid.proposal}</p>
                    </div>

                    {bid.experience && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Experience</p>
                        <p className="text-gray-700">{bid.experience}</p>
                      </div>
                    )}

                    {bid.status === "pending" && (
                      <>
                        <Separator className="my-4" />
                        <div className="flex justify-end space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateBidStatus(bid.id, "rejected")}
                            disabled={!!isUpdating}
                          >
                            {isUpdating === bid.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            Reject
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => updateBidStatus(bid.id, "accepted")}
                            disabled={!!isUpdating}
                          >
                            {isUpdating === bid.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            Accept
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
