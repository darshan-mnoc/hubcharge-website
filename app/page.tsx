import { BatteryNav } from "@/components/battery-nav";
import { HeroLifestyle } from "@/components/hero-lifestyle";
import { ProblemSection } from "@/components/problem-section";
import { JourneyBattery } from "@/components/journey-battery";
import { LifestyleDestinations } from "@/components/lifestyle-destinations";
import { PricingSection } from "@/components/pricing-section";
import { TimeClubMembership } from "@/components/time-club-membership";
import { FindYourHub } from "@/components/find-your-hub";
import { AppDownload } from "@/components/app-download";
import { ContactSection } from "@/components/contact-section";
import { LifestyleFooter } from "@/components/lifestyle-footer";
import { ChatPopup } from "@/components/chat-popup";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <BatteryNav />

      {/* 1. HOOK: We handle everything, you enjoy your time */}
      <HeroLifestyle />

      {/* 2. PROBLEM + SOLUTION: Why we're different */}
      <ProblemSection />

      {/* 3. THE JOURNEY: Step-by-step visual story */}
      <JourneyBattery />

      {/* 4. LIFESTYLE: What you can enjoy */}
      <LifestyleDestinations />

      {/* 5. PRICING: Simple pricing model */}
      <PricingSection />

      {/* 6. MEMBERSHIP: Get more value */}
      <TimeClubMembership />

      {/* 7. LOCATIONS: Find your Hub */}
      <FindYourHub />

      {/* 8. APP: Stay connected */}
      {/* <AppDownload /> */}

      {/* 9. CONTACT: Get in touch */}
      <ContactSection />

      {/* Footer */}
      <LifestyleFooter />

      {/* Chat Popup */}
      <ChatPopup />
    </main>
  );
}
