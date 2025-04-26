"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const bidSchema = z.object({
  bid_amount: z.string().min(1, "Bid amount is required"),
  proposal: z.string().min(20, "Proposal must be at least 20 characters"),
  experience: z.string().optional(),
})

type BidFormValues = z.infer<typeof bidSchema>

interface BidFormProps {
  projectId: string
  onBidSubmitted?: (bid: any) => void
}

export function BidForm({ projectId, onBidSubmitted }: BidFormProps) {
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      bid_amount: "",
      proposal: "",
      experience: "",
    },
  })

  const onSubmit = async (data: BidFormValues) => {
    if (!user) {
      router.push(`/login?redirect=/projects/${projectId}`)
      return
    }

    if (user.role !== "client") {
      toast({
        title: "Error",
        description: "Only clients can submit bids",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const supabase = getSupabaseBrowserClient()

    try {
      // Check if user already has a bid for this project
      const { data: existingBid } = await supabase
        .from("bids")
        .select("id")
        .eq("project_id", projectId)
        .eq("client_id", user.id)
        .single()

      if (existingBid) {
        toast({
          title: "Error",
          description: "You have already submitted a bid for this project",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Submit the bid
      const { data: newBid, error } = await supabase
        .from("bids")
        .insert({
          project_id: projectId,
          client_id: user.id,
          bid_amount: Number.parseFloat(data.bid_amount),
          proposal: data.proposal,
          experience: data.experience || null,
          status: "pending",
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Success",
        description: "Your bid has been submitted successfully",
      })

      if (onBidSubmitted && newBid) {
        onBidSubmitted(newBid)
      }

      form.reset()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit bid",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("project.bid")}</CardTitle>
        <CardDescription>Submit your proposal and bid amount for this project</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bid_amount">{t("bid.amount")} (ETB)</Label>
            <div className="relative">
              <Input
                id="bid_amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...form.register("bid_amount")}
                required
              />
            </div>
            {form.formState.errors.bid_amount && (
              <p className="text-sm text-red-500">{form.formState.errors.bid_amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal">{t("bid.proposal")}</Label>
            <Textarea
              id="proposal"
              placeholder="Describe your approach to this project..."
              rows={4}
              {...form.register("proposal")}
              required
            />
            {form.formState.errors.proposal && (
              <p className="text-sm text-red-500">{form.formState.errors.proposal.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">{t("bid.experience")} (Optional)</Label>
            <Textarea
              id="experience"
              placeholder="Describe your relevant experience..."
              rows={3}
              {...form.register("experience")}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              t("bid.submit")
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
