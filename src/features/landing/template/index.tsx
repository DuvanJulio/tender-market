'use client'

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store"
import { getStats, selectGetStats } from "@/store/landing/landing-slice"
import { NavbarHeader, HeroSection, StatsSection, FeaturesSection, WorksSection, TestimonialsSection, CTASection, FooterSection } from "../components"


export const LandingTemplate = () => {

  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectGetStats);

  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <NavbarHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <WorksSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <FooterSection />
    </div>
  )
}

export default LandingTemplate;
