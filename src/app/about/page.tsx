import { AboutBenefits } from "@/components/about/AboutBenefits";
import { AboutDirections } from "@/components/about/AboutDirections";
import { AboutDurrDental } from "@/components/about/AboutDurrDental";
import { AboutEngineers } from "@/components/about/AboutEngineers";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutIntro } from "@/components/about/AboutIntro";
import { HomeCTA } from "@/components/home/HomeCTA";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutIntro />
      <AboutDirections />
      <AboutBenefits />
      <AboutDurrDental />
      <AboutEngineers />
      <HomeCTA />
    </>
  );
}
