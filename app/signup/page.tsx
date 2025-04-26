"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/password-input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

const clientSchema = z
  .object({
    full_name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirm_password: z.string().min(6),
    phone: z.string().optional(),
    address: z.string().optional(),
    bio: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })

const companySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirm_password: z.string().min(6),
    company_name: z.string().min(2),
    business_license: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    description: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })

type ClientFormValues = z.infer<typeof clientSchema>
type CompanyFormValues = z.infer<typeof companySchema>

export default function SignupPage() {
  const { signUp } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const initialRole = searchParams.get("role") === "company" ? "company" : "client"
  const [role, setRole] = useState<"client" | "company">(initialRole)

  const clientForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone: "",
      address: "",
      bio: "",
    },
  })

  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      company_name: "",
      business_license: "",
      phone: "",
      address: "",
      description: "",
      website: "",
    },
  })

  const onClientSubmit = async (data: ClientFormValues) => {
    setIsLoading(true)
    try {
      const { error } = await signUp(data, "client")
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Your account has been created. Please check your email for verification.",
        })
        router.push("/login")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onCompanySubmit = async (data: CompanyFormValues) => {
    setIsLoading(true)
    try {
      const { error } = await signUp(data, "company")
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Your account has been created. Please check your email for verification.",
        })
        router.push("/login")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create a Con-i Account</CardTitle>
            <CardDescription>Join our platform to connect with construction professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={role} onValueChange={(value) => setRole(value as "client" | "company")}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="client">{t("signup.client")}</TabsTrigger>
                <TabsTrigger value="company">{t("signup.company")}</TabsTrigger>
              </TabsList>

              <TabsContent value="client">
                <form onSubmit={clientForm.handleSubmit(onClientSubmit)}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="client-full-name">{t("signup.fullName")}</Label>
                        <Input id="client-full-name" {...clientForm.register("full_name")} />
                        {clientForm.formState.errors.full_name && (
                          <p className="text-sm text-red-500">{clientForm.formState.errors.full_name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-email">{t("signup.email")}</Label>
                        <Input id="client-email" type="email" {...clientForm.register("email")} />
                        {clientForm.formState.errors.email && (
                          <p className="text-sm text-red-500">{clientForm.formState.errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="client-password">{t("signup.password")}</Label>
                        <PasswordInput id="client-password" {...clientForm.register("password")} />
                        {clientForm.formState.errors.password && (
                          <p className="text-sm text-red-500">{clientForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-confirm-password">{t("signup.confirmPassword")}</Label>
                        <PasswordInput id="client-confirm-password" {...clientForm.register("confirm_password")} />
                        {clientForm.formState.errors.confirm_password && (
                          <p className="text-sm text-red-500">{clientForm.formState.errors.confirm_password.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="client-phone">{t("signup.phone")}</Label>
                        <Input id="client-phone" {...clientForm.register("phone")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-address">{t("signup.address")}</Label>
                        <Input id="client-address" {...clientForm.register("address")} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-bio">{t("signup.bio")}</Label>
                      <Textarea id="client-bio" {...clientForm.register("bio")} />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Loading..." : t("signup.submit")}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="company">
                <form onSubmit={companyForm.handleSubmit(onCompanySubmit)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">{t("signup.companyName")}</Label>
                      <Input id="company-name" {...companyForm.register("company_name")} />
                      {companyForm.formState.errors.company_name && (
                        <p className="text-sm text-red-500">{companyForm.formState.errors.company_name.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-email">{t("signup.email")}</Label>
                        <Input id="company-email" type="email" {...companyForm.register("email")} />
                        {companyForm.formState.errors.email && (
                          <p className="text-sm text-red-500">{companyForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business-license">{t("signup.businessLicense")}</Label>
                        <Input id="business-license" {...companyForm.register("business_license")} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-password">{t("signup.password")}</Label>
                        <PasswordInput id="company-password" {...companyForm.register("password")} />
                        {companyForm.formState.errors.password && (
                          <p className="text-sm text-red-500">{companyForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-confirm-password">{t("signup.confirmPassword")}</Label>
                        <PasswordInput id="company-confirm-password" {...companyForm.register("confirm_password")} />
                        {companyForm.formState.errors.confirm_password && (
                          <p className="text-sm text-red-500">
                            {companyForm.formState.errors.confirm_password.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-phone">{t("signup.phone")}</Label>
                        <Input id="company-phone" {...companyForm.register("phone")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-address">{t("signup.address")}</Label>
                        <Input id="company-address" {...companyForm.register("address")} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-website">{t("signup.website")}</Label>
                      <Input id="company-website" type="url" {...companyForm.register("website")} />
                      {companyForm.formState.errors.website && (
                        <p className="text-sm text-red-500">{companyForm.formState.errors.website.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-description">{t("signup.description")}</Label>
                      <Textarea id="company-description" {...companyForm.register("description")} />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Loading..." : t("signup.submit")}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center text-gray-500 w-full">
              {t("signup.haveAccount")}{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                {t("signup.login")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
