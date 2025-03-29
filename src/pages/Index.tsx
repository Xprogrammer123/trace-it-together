
import { Navbar } from "@/components/navigation/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { FooterSection } from "@/components/sections/FooterSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { TechnologiesSection } from "@/components/sections/TechnologiesSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TechnologiesSection />
        <WhyChooseUsSection />
        <AchievementsSection />
        <StatsSection />
        <CaseStudiesSection />
        <PartnersSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
