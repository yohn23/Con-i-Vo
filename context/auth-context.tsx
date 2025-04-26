"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Session } from "@supabase/supabase-js"

type UserProfile = {
  id: string
  email: string
  full_name: string
  role: "client" | "company"
  profile?: any
}

type AuthContextType = {
  user: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (userData: any, role: "client" | "company") => Promise<{ error: any; user: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setUser(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata.full_name || "",
              role: session.user.user_metadata.role,
            }
          : null,
      )
      setLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata.full_name || "",
              role: session.user.user_metadata.role,
            }
          : null,
      )
      setLoading(false)
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { error }
  }

  const signUp = async (userData: any, role: "client" | "company") => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name,
          role,
        },
      },
    })

    if (!error && data.user) {
      // Create profile based on role
      if (role === "client") {
        await supabase.from("client_profiles").insert({
          user_id: data.user.id,
          address: userData.address || null,
          bio: userData.bio || null,
        })
      } else {
        await supabase.from("company_profiles").insert({
          user_id: data.user.id,
          company_name: userData.company_name,
          business_license: userData.business_license || null,
          address: userData.address || null,
          description: userData.description || null,
          website: userData.website || null,
        })
      }
    }

    return { error, user: data.user }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
