import { AboutApproach } from "@/components/about/AboutApproach";
import { AboutDirections } from "@/components/about/AboutDirections";
import { AboutDurrDental } from "@/components/about/AboutDurrDental";
import { AboutEngineers } from "@/components/about/AboutEngineers";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutIntro } from "@/components/about/AboutIntro";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { HomeCTA } from "@/components/home/HomeCTA";

export function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutApproach />
      <AboutIntro />
      <AboutDirections />
      <BenefitsSection />
      <AboutDurrDental />
      <AboutEngineers />
      <HomeCTA />
    </>
  );
}
