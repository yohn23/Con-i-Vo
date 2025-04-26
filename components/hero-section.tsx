"use client"

import { useLanguage } from "@/context/language-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-90 z-10"></div>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/construction-hero.jpg')",
          backgroundPosition: "center",
          filter: "brightness(0.4)",
        }}
      ></div>

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Building Ethiopia's Future Together</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Con-i connects construction companies with skilled professionals for successful project delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?role=client">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                {t("signup.client")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signup?role=company">
              <Button size="lg" variant="outline" className="bg-transparent hover:bg-white/10 text-white border-white">
                {t("signup.company")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
