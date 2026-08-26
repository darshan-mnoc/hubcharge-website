import type { ReactNode } from "react";
import { BatteryNav } from "@/components/battery-nav";
import { LifestyleFooter } from "@/components/lifestyle-footer";

/**
 * Shared shell for sub-pages (legal, FAQ, locations, pricing…).
 * Dark hero-style header band + light content area, wrapped in the
 * global nav and footer so sub-pages feel like part of the site.
 */
export function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-surface">
      <BatteryNav />
      <header className="bg-hero pt-32 pb-14 lg:pt-40 lg:pb-20">
        <div className="section-container">
          <h1 className="text-h1 !text-white max-w-3xl">{title}</h1>
          {intro && (
            <p className="text-body-lg text-on-dark/80 mt-4 max-w-2xl">
              {intro}
            </p>
          )}
        </div>
      </header>
      <div className="section-container py-14 lg:py-20">{children}</div>
      <LifestyleFooter />
    </main>
  );
}

/** Prose wrapper for long-form legal/help text on light background. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl space-y-6 text-gray-700 leading-relaxed [&_h2]:text-h3 [&_h2]:text-midnight-navy [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:text-midnight-navy [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-brand [&_a]:underline">
      {children}
    </div>
  );
}
