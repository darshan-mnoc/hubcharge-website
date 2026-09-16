
import { BatteryNav } from "@/components/battery-nav";
import { HeroLifestyle } from "@/components/hero-lifestyle";
import { ProblemSection } from "@/components/problem-section";
import { LifestyleDestinations } from "@/components/lifestyle-destinations";
import { PricingExperience } from "@/components/pricing-experience";
import { FindYourHub } from "@/components/find-your-hub";
import { ChargerAccess } from "@/components/charger-access";
import { JourneyKit } from "@/components/journey-kit";
import { ContactSection } from "@/components/contact-section";
import { LifestyleFooter } from "@/components/lifestyle-footer";
import { ChatPopup } from "@/components/chat-popup";

// The journey is now one inlined animated SVG per step, served from the
// illustration kit in public/illustrations. It ships no client JavaScript, so
// it does not need the dynamic import the GSAP version did.

export default function HomePage() {
  return (
    <main id="main" className="min-h-screen pb-16 lg:pb-0 bg-white">
      {/* Navigation */}
      <BatteryNav />

      {/* 1. HOOK: We handle everything, you enjoy your time */}
      <HeroLifestyle />

      {/* 2. PROBLEM + SOLUTION: Why we're different */}
      <ProblemSection />

      {/* 3. THE JOURNEY: Step-by-step visual story */}
      <JourneyKit />

      {/* 4. LIFESTYLE: What you can enjoy */}
      <LifestyleDestinations />

      {/* 5. PRICING: "Design your stop" — number-free pricing experience */}
      <PricingExperience />

      {/* 7. LOCATIONS: Find your Hub */}
      <FindYourHub />

      {/* 7b. ACCESS: How to start a charge — browser, no app */}
      <ChargerAccess />

      {/* 9. CONTACT: Get in touch */}
      <ContactSection />

      {/* Footer */}
      <LifestyleFooter />

      {/* Chat Popup */}
      <ChatPopup />
    </main>
  );
}
