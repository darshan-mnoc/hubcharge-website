import type { Metadata } from "next";
import { PageShell, Prose } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy | HubCharge",
  description:
    "How HubCharge (Micronoc Inc.) collects, uses, and protects your personal information.",
  alternates: { canonical: "https://hubcharge.com/privacy" },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "August 25, 2026";

export default function PrivacyPage() {
  return (
    <PageShell
      backTo={{ href: "/", label: "Home" }}
      eyebrow="Legal"
      title="Privacy Policy"
      intro={`Effective date: ${EFFECTIVE_DATE}`}
    >
      <Prose>
        <p>
          This Privacy Policy describes how Micronoc Inc. (doing business as
          &ldquo;HubCharge&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects,
          uses, and shares personal information when you visit hubcharge.com
          (the &ldquo;Site&rdquo;) or contact us through it. It is written to
          comply with the California Online Privacy Protection Act (CalOPPA).
        </p>

        <h2>Information we collect</h2>
        <p>We collect personal information you choose to give us through the Site:</p>
        <ul>
          <li>
            <strong>Contact form:</strong> your name, email address, subject,
            and message.
          </li>
          <li>
            <strong>Newsletter signup:</strong> your email address.
          </li>
          <li>
            <strong>Feedback widget:</strong> the preferences and comments you
            submit, and any contact details you include.
          </li>
          <li>
            <strong>Location search:</strong> if you use &ldquo;Use current
            location&rdquo;, your browser asks for permission to share your
            approximate location. It is used only to find nearby stations and
            is not stored by us.
          </li>
        </ul>
        <p>
          We also collect limited technical information automatically through
          our hosting and analytics providers (described below), such as pages
          visited, device and browser type, and general (city-level) location
          derived from your IP address.
        </p>

        <h2>How we use your information</h2>
        <ul>
          <li>To respond to your questions and support requests.</li>
          <li>To send you the updates you signed up for (you can unsubscribe at any time using the link in any email).</li>
          <li>To improve the Site, our stations, and our services.</li>
          <li>To comply with legal obligations.</li>
        </ul>
        <p>
          We do <strong>not</strong> sell your personal information, and we do
          not share it with third parties for their own marketing.
        </p>

        <h2>Who we share it with</h2>
        <p>Service providers that operate the Site on our behalf:</p>
        <ul>
          <li>
            <strong>Vercel</strong> — website hosting and performance analytics.
          </li>
          <li>
            <strong>Resend</strong> — delivers form submissions and emails to
            our team.
          </li>
          <li>
            <strong>Google Maps</strong> — powers the embedded station maps.
            Google may collect usage data when the map loads; see Google&rsquo;s
            privacy policy.
          </li>
        </ul>
        <p>
          We may also disclose information if required by law or to protect our
          rights, users, or the public.
        </p>

        <h2>Cookies and tracking</h2>
        <p>
          The Site uses privacy-friendly analytics (Vercel Analytics) that do
          not use advertising cookies and do not track you across other
          websites. Embedded third-party content (such as Google Maps) may set
          its own cookies.
        </p>

        <h2>Do Not Track</h2>
        <p>
          Some browsers send a &ldquo;Do Not Track&rdquo; (DNT) signal. Because
          we do not track visitors across third-party websites, the Site does
          not respond differently to DNT signals.
        </p>

        <h2>Your choices and rights</h2>
        <p>
          You may request to review, correct, or delete the personal
          information you have submitted through the Site by emailing{" "}
          <a href="mailto:info@micronocinc.com">info@micronocinc.com</a> or
          calling <a href="tel:+19493928755">(949) 392-8755</a>. We will
          respond within a reasonable time. California residents may have
          additional rights under California law.
        </p>

        <h2>Children</h2>
        <p>
          The Site is not directed to children under 13, and we do not
          knowingly collect personal information from them.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If we change this policy, we will post the updated version on this
          page with a new effective date.
        </p>

        <h2>Contact us</h2>
        <p>
          Micronoc Inc. (HubCharge)
          <br />
          9383 Charles Smith Avenue, Rancho Cucamonga, CA 91730
          <br />
          <a href="mailto:info@micronocinc.com">info@micronocinc.com</a> ·{" "}
          <a href="tel:+19493928755">(949) 392-8755</a>
        </p>
      </Prose>
    </PageShell>
  );
}
