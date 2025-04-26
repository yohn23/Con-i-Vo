"use client"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category_id: z.string().min(1, "Please select a category"),
  subcategory_id: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  budget: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

export default function CreateProjectPage() {
  const { user, loading } = useAuth()
  const { t, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [filteredSubcategories, setFilteredSubcategories] = useState<any[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      category_id: "",
      subcategory_id: "",
      location: "",
      budget: "",
      start_date: "",
      end_date: "",
    },
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user && user.role !== "company") {
      router.push("/projects")
      toast({
        title: "Access Denied",
        description: "Only companies can create projects",
        variant: "destructive",
      })
      return
    }

    // Fetch categories and subcategories
    const fetchCategoriesAndSubcategories = async () => {
      setIsLoadingCategories(true)
      const supabase = getSupabaseBrowserClient()

      // Fetch categories
      const { data: categoriesData } = await supabase.from("categories").select("*")
      setCategories(categoriesData || [])

      // Fetch subcategories
      const { data: subcategoriesData } = await supabase.from("subcategories").select("*")
      setSubcategories(subcategoriesData || [])

      setIsLoadingCategories(false)
    }

    fetchCategoriesAndSubcategories()
  }, [user, loading, router, toast])

  // Filter subcategories when category changes
  const handleCategoryChange = (categoryId: string) => {
    form.setValue("category_id", categoryId)
    form.setValue("subcategory_id", "") // Reset subcategory when category changes

    const filtered = subcategories.filter((sub) => sub.category_id === categoryId)
    setFilteredSubcategories(filtered)
  }

  const onSubmit = async (data: ProjectFormValues) => {
    if (!user) return

    setIsSubmitting(true)
    const supabase = getSupabaseBrowserClient()

    try {
      const { error } = await supabase.from("projects").insert({
        title: data.title,
        description: data.description,
        company_id: user.id,
        category_id: data.category_id,
        subcategory_id: data.subcategory_id ? Number.parseInt(data.subcategory_id) : null,
        location: data.location,
        budget: data.budget ? Number.parseFloat(data.budget) : null,
        status: "open",
        start_date: data.start_date || null,
        end_date: data.end_date || null,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Your project has been created successfully",
      })

      router.push("/projects")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || isLoadingCategories) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Post a New Construction Project</CardTitle>
            <CardDescription>
              Fill in the details below to create a new project and receive bids from qualified professionals
            </CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="e.g. Modern Apartment Complex Construction"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  rows={6}
                  placeholder="Provide a detailed description of the project, including requirements, specifications, and any other relevant information."
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Project Category</Label>
                  <Select
                    onValueChange={(value) => handleCategoryChange(value)}
                    defaultValue={form.getValues("category_id")}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {language === "en" ? category.name_en : category.name_am}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category_id && (
                    <p className="text-sm text-red-500">{form.formState.errors.category_id.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Project Subcategory</Label>
                  <Select
                    onValueChange={(value) => form.setValue("subcategory_id", value)}
                    defaultValue={form.getValues("subcategory_id")}
                    disabled={filteredSubcategories.length === 0}
                  >
                    <SelectTrigger id="subcategory">
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSubcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                          {language === "en" ? subcategory.name_en : subcategory.name_am}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...form.register("location")} placeholder="e.g. Addis Ababa, Bole Sub-city" />
                {form.formState.errors.location && (
                  <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (ETB)</Label>
                  <Input id="budget" type="number" {...form.register("budget")} placeholder="e.g. 500000" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date (Optional)</Label>
                  <Input id="start_date" type="date" {...form.register("start_date")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date (Optional)</Label>
                  <Input id="end_date" type="date" {...form.register("end_date")} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  "Post Project"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
