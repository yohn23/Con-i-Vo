"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "am"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Simple translations
const translations = {
  en: {
    "nav.home": "Home",
    "nav.howItWorks": "How It Works",
    "nav.aboutUs": "About Us",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.projects": "Projects",
    "nav.profile": "Profile",
    "nav.logout": "Logout",
    "home.title": "Find Construction Projects",
    "home.subtitle": "Connect with the best construction professionals",
    "home.filter.category": "Category",
    "home.filter.location": "Location",
    "home.search": "Search",
    "project.bid": "Submit Bid",
    "project.budget": "Budget",
    "project.location": "Location",
    "project.category": "Category",
    "project.postedBy": "Posted by",
    "bid.amount": "Bid Amount",
    "bid.proposal": "Proposal",
    "bid.experience": "Experience",
    "bid.submit": "Submit Bid",
    "login.email": "Email",
    "login.password": "Password",
    "login.submit": "Login",
    "login.noAccount": "Don't have an account?",
    "login.signup": "Sign up",
    "signup.client": "Sign up as Client",
    "signup.company": "Sign up as Company",
    "signup.fullName": "Full Name",
    "signup.email": "Email",
    "signup.password": "Password",
    "signup.confirmPassword": "Confirm Password",
    "signup.companyName": "Company Name",
    "signup.businessLicense": "Business License",
    "signup.address": "Address",
    "signup.phone": "Phone",
    "signup.bio": "Bio",
    "signup.description": "Description",
    "signup.website": "Website",
    "signup.submit": "Sign Up",
    "signup.haveAccount": "Already have an account?",
    "signup.login": "Login",
  },
  am: {
    "nav.home": "መነሻ",
    "nav.howItWorks": "እንዴት ይሰራል",
    "nav.aboutUs": "ስለ እኛ",
    "nav.login": "ግባ",
    "nav.signup": "ተመዝገብ",
    "nav.projects": "ፕሮጀክቶች",
    "nav.profile": "መገለጫ",
    "nav.logout": "ውጣ",
    "home.title": "የግንባታ ፕሮጀክቶችን ይፈልጉ",
    "home.subtitle": "ከምርጥ የግንባታ ባለሙያዎች ጋር ይገናኙ",
    "home.filter.category": "ምድብ",
    "home.filter.location": "ቦታ",
    "home.search": "ፈልግ",
    "project.bid": "ጨረታ አስገባ",
    "project.budget": "በጀት",
    "project.location": "ቦታ",
    "project.category": "ምድብ",
    "project.postedBy": "አስገቢ",
    "bid.amount": "የጨረታ መጠን",
    "bid.proposal": "ሀሳብ",
    "bid.experience": "ልምድ",
    "bid.submit": "ጨረታ አስገባ",
    "login.email": "ኢሜይል",
    "login.password": "የይለፍ ቃል",
    "login.submit": "ግባ",
    "login.noAccount": "መለያ የለህም?",
    "login.signup": "ተመዝገብ",
    "signup.client": "እንደ ደንበኛ ተመዝገብ",
    "signup.company": "እንደ ኩባንያ ተመዝገብ",
    "signup.fullName": "ሙሉ ስም",
    "signup.email": "ኢሜይል",
    "signup.password": "የይለፍ ቃል",
    "signup.confirmPassword": "የይለፍ ቃል አረጋግጥ",
    "signup.companyName": "የኩባንያ ስም",
    "signup.businessLicense": "የንግድ ፈቃድ",
    "signup.address": "አድራሻ",
    "signup.phone": "ስልክ",
    "signup.bio": "ግለ ታሪክ",
    "signup.description": "መግለጫ",
    "signup.website": "ድህረ ገጽ",
    "signup.submit": "ተመዝገብ",
    "signup.haveAccount": "መለያ አለህ?",
    "signup.login": "ግባ",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "am")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>{children}</LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
