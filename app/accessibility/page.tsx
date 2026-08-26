import type { Metadata } from "next";
import { PageShell, Prose } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Accessibility | HubCharge",
  description:
    "HubCharge's commitment to digital and physical accessibility, and how to reach us with accessibility feedback.",
  alternates: { canonical: "https://hubcharge.com/accessibility" },
  robots: { index: true, follow: true },
};

export default function AccessibilityPage() {
  return (
    <PageShell
      title="Accessibility"
      intro="We want every driver to be able to use our website and our stations."
    >
      <Prose>
        <h2>Our commitment</h2>
        <p>
          HubCharge (Micronoc Inc.) is committed to making hubcharge.com
          accessible to the widest possible audience, regardless of technology
          or ability. We aim to conform to the Web Content Accessibility
          Guidelines (WCAG) 2.1 Level AA and are actively working to improve
          the accessibility of the Site on an ongoing basis.
        </p>

        <h2>What we do on this website</h2>
        <ul>
          <li>Support keyboard navigation with visible focus indicators.</li>
          <li>Respect your system&rsquo;s reduced-motion preference — animations and smooth scrolling are disabled when it is set.</li>
          <li>Provide text alternatives for meaningful images.</li>
          <li>Maintain minimum touch-target sizes on mobile.</li>
        </ul>

        <h2>At our stations</h2>
        <p>
          Our full-service model means you can stay in your car — an attendant
          can handle plugging in, payment, and unplugging for you at
          participating locations, which many drivers with mobility
          disabilities find more accessible than self-service charging. If you
          need assistance at a station, call us at{" "}
          <a href="tel:+19493914676">(949) 391-4676</a> during station hours.
        </p>

        <h2>Feedback and help</h2>
        <p>
          If you experience any difficulty accessing part of this website or
          our services, or have suggestions, please contact us — we take this
          feedback seriously and will make reasonable efforts to address
          issues promptly:
        </p>
        <ul>
          <li>
            Email:{" "}
            <a href="mailto:info@micronocinc.com">info@micronocinc.com</a>
          </li>
          <li>
            Phone: <a href="tel:+19493914676">(949) 391-4676</a> (Mon–Fri, 9
            AM – 6 PM PST)
          </li>
        </ul>
      </Prose>
    </PageShell>
  );
}
