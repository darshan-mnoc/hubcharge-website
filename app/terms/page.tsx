import type { Metadata } from "next";
import { PageShell, Prose } from "@/components/page-shell";
import { COMPANY, companyAddressLine } from "@/lib/company";

export const metadata: Metadata = {
  title: "Terms of Use | HubCharge",
  description:
    "Terms of use for the HubCharge website, operated by Micronoc Inc.",
  alternates: { canonical: "https://hubcharge.com/terms" },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "August 25, 2026";

export default function TermsPage() {
  return (
    <PageShell
      backTo={{ href: "/", label: "Home" }}
      eyebrow="Legal"
      title="Terms of Use"
      intro={`Effective date: ${EFFECTIVE_DATE}`}
    >
      <Prose>
        <p>
          These Terms of Use (&ldquo;Terms&rdquo;) govern your use of
          hubcharge.com (the &ldquo;Site&rdquo;), operated by Micronoc Inc.
          (doing business as &ldquo;HubCharge&rdquo;). By using the Site, you
          agree to these Terms.
        </p>

        <h2>The Site is informational</h2>
        <p>
          The Site describes HubCharge charging stations and services. Charging
          services themselves are provided at our stations and may be subject
          to additional terms, pricing, and policies presented to you at the
          station or in the in-browser charging flow before you start a
          session. Your exact price is always shown before you begin charging.
        </p>

        <h2>Accuracy of information</h2>
        <p>
          We work to keep station details, hours, service availability, and
          performance figures accurate and current, but details can change.
          Charging speed and added range depend on your vehicle, battery state
          of charge, and conditions such as temperature. Attendant and
          lifestyle services are available at select locations and hours.
        </p>

        <h2>Acceptable use</h2>
        <ul>
          <li>Do not misuse the Site, interfere with its operation, or attempt to access it by any method other than the interface we provide.</li>
          <li>Do not submit unlawful, deceptive, or harmful content through our forms.</li>
        </ul>

        <h2>Intellectual property</h2>
        <p>
          The Site and its content — including the HubCharge name, logo, text,
          graphics, and images — are owned by Micronoc Inc. or its licensors
          and are protected by applicable law. You may not reproduce or use
          them without our prior written permission, except for personal,
          non-commercial viewing.
        </p>

        <h2>Third-party links and content</h2>
        <p>
          The Site may include links to or embedded content from third parties
          (for example, Google Maps). We are not responsible for third-party
          content or practices.
        </p>

        <h2>Disclaimer and limitation of liability</h2>
        <p>
          The Site is provided &ldquo;as is&rdquo; without warranties of any
          kind, express or implied. To the fullest extent permitted by law,
          Micronoc Inc. will not be liable for indirect, incidental, or
          consequential damages arising from your use of the Site. Nothing in
          these Terms limits rights you may have under applicable law that
          cannot be waived.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these Terms from time to time. The current version
          will always be posted on this page with its effective date.
        </p>

        <h2>Governing law</h2>
        <p>
          These Terms are governed by the laws of the State of California,
          without regard to conflict-of-law principles.
        </p>

        <h2>Contact</h2>
        <p>
          {COMPANY.legalName} ({COMPANY.name}), {companyAddressLine} ·{" "}
          <a href="mailto:info@micronocinc.com">info@micronocinc.com</a> ·{" "}
          <a href="tel:+19493928755">(949) 392-8755</a>
        </p>
      </Prose>
    </PageShell>
  );
}
