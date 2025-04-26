import { HeroSection } from "@/components/hero-section"
import { FeaturedProjects } from "@/components/featured-projects"
import { ConstructionCategories } from "@/components/construction-categories"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { Testimonials } from "@/components/testimonials"

export default async function Home() {
  return (
    <div>
      <HeroSection />
      <ConstructionCategories />
      <FeaturedProjects />
      <HowItWorksSection />
      <Testimonials />
    </div>
  )
}
