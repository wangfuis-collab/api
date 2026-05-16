import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { FAQSection, FeatureSection, Footer, PricingSection, Testimonials } from "@/components/marketing/sections";

export default function HomePage() {
  return <><Navbar /><main><Hero /><FeatureSection /><PricingSection /><Testimonials /><FAQSection /></main><Footer /></>;
}
