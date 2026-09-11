"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_GUIDES, getGuide, guideHref } from "@/lib/guides";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import {
  Zap,
  Utensils,
  MapPin,
  Phone,
  Menu,
  X,
  Battery,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

const LOGIN_URL = "https://hubcharge.micronocinc.com/login.html";

/**
 * A nav item is EITHER a homepage section (`id`) or a real route (`href`).
 * Previously every item was a section id, so the pricing item on a sub-page
 * bounced you to /#pricing even though the page existed on its own route.
 * That page is now /plan-your-charge.
 */
type NavItem = {
  label: string;
  icon: typeof Zap;
  id?: string;
  href?: string;
  /** Renders a dropdown of guides rather than a single link */
  guides?: boolean;
};

const navLinks: NavItem[] = [
  { id: "how-it-works", label: "Experience", icon: Zap },
  { id: "lifestyle", label: "Lifestyle", icon: Utensils },
  { href: "/charging-101", label: "Guides", icon: BookOpen, guides: true },
  { href: "/plan-your-charge", label: "Plan Your Charge", icon: Battery },
  { href: "/locations", label: "Locations", icon: MapPin },
  { href: "/contact", label: "Contact", icon: Phone },
];

const navGuides = NAV_GUIDES.map((slug) => getGuide(slug)!).filter(Boolean);

export function BatteryNav() {
  const router = useRouter();
  const pathname = usePathname();
  // Only the homepage has a dark hero behind the nav to sit transparently on.
  const overDarkHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [guidesOpen, setGuidesOpen] = useState(false);

  useFocusTrap(mobileMenuRef, mobileOpen);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const handleNavItem = (item: NavItem) => {
    setMobileOpen(false);
    if (item.href) {
      router.push(item.href);
      return;
    }
    if (item.id) handleNavClick(item.id);
  };

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    } else {
      // Section lives on the homepage — navigate there from sub-pages
      router.push(`/#${id}`);
    }
  };

  return (
    <>
      {/* hc-drop, not a framer spring. See globals.css: this component and
          the footer were the only framer-motion in the shared shell, and that
          put 167 KB on the critical path of all 60 routes — emitted three
          times — for entrance slides and hover scales. */}
      <header
        className={`hc-drop fixed top-0 left-0 right-0 z-50 hc-tint ${
          scrolled || !overDarkHero
            ? "bg-ink-900/95 backdrop-blur-md border-b border-white/[0.07]"
            : "bg-transparent"
        }`}
      >
        <nav className="section-container h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="hc-press hc-grow relative z-10"
          >
            <Image
              src="/images/hubcharge-logo-on-dark.webp"
              alt="HubCharge"
              width={1200}
              height={189}
              className="h-6 sm:h-7 lg:h-8 w-auto mt-2 sm:mt-0"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-x-8">
            {navLinks.map((link) => {
              const key = link.id ?? link.href!;
              const isCurrent = link.href ? pathname.startsWith(link.href) : false;

              if (link.guides) {
                return (
                  <div
                    key={key}
                    className="relative"
                    onMouseEnter={() => setGuidesOpen(true)}
                    onMouseLeave={() => setGuidesOpen(false)}
                  >
                    <button
                      onClick={() => setGuidesOpen((v) => !v)}
                      aria-expanded={guidesOpen}
                      aria-haspopup="true"
                      aria-controls="guides-menu"
                      className="relative flex items-center gap-1 py-1 text-caption font-medium text-on-dark/70 hover:text-white transition-colors"
                    >
                      {link.label}
                      <ChevronDown
                        aria-hidden
                        className={`h-3.5 w-3.5 transition-transform ${guidesOpen ? "rotate-180" : ""}`}
                      />
                      <span
                        aria-hidden
                        className={`absolute -bottom-1 left-0 h-[1.5px] bg-brand transition-all duration-200 ${
                          guidesOpen || isCurrent ? "w-full" : "w-0"
                        }`}
                      />
                    </button>

                    {/* Always in the DOM, opened by the attribute. An element
                        React has removed cannot animate on the way out, and
                        the exit is the only part of this a library was ever
                        needed for. `visibility: hidden` in the closed state
                        keeps it out of the tab order and off the a11y tree. */}
                    <div
                      id="guides-menu"
                      data-open={guidesOpen}
                      className="hc-reveal absolute left-1/2 z-50 top-full pt-4 w-[300px]"
                      style={{ marginLeft: "-150px" }}
                    >
                          <div className="rounded-lg border border-white/12 bg-ink-900 shadow-card-hover p-2">
                            {/* Charging 101 itself led the list of nothing —
                                it was a small link under the fold of the
                                dropdown, so the hub was the hardest thing in
                                the menu to find. It goes first. */}
                            <Link
                              href="/charging-101"
                              onClick={() => setGuidesOpen(false)}
                              className="block rounded px-3 py-2.5 mb-1 border-b border-white/10 hover:bg-white/[0.06] transition-colors"
                            >
                              <span className="block text-body-sm font-semibold text-brand">
                                Charging 101
                              </span>
                              <span className="block text-footnote text-on-dark/55 mt-0.5">
                                All guides
                              </span>
                            </Link>
                            {navGuides.map((g) => (
                              <Link
                                key={g.slug}
                                href={guideHref(g.slug)}
                                onClick={() => setGuidesOpen(false)}
                                className="block rounded px-3 py-2.5 hover:bg-white/[0.06] transition-colors"
                              >
                                <span className="block text-caption font-semibold text-white">
                                  {g.navTitle ?? g.title}
                                </span>
                                <span className="block text-footnote text-on-dark/55 mt-0.5">
                                  {g.read} read
                                </span>
                              </Link>
                            ))}

                          </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={key}
                  onClick={() => handleNavItem(link)}
                  onMouseEnter={() => setActiveLink(key)}
                  onMouseLeave={() => setActiveLink(null)}
                  className="relative py-1 text-caption font-medium text-on-dark/70 hover:text-white transition-colors"
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-1 left-0 h-[1.5px] bg-brand transition-all duration-200 ${
                      activeLink === key || isCurrent ? "w-full" : "w-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* CTA Button - Desktop Only */}
          <div className="hidden lg:block">
            <a
              href={LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hc-press hc-grow hc-tint inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-ink-900 hover:bg-brand-hover hover:shadow-[0_0_30px_rgba(255,122,0,0.5)]"
            >
              <Zap className="h-4 w-4" strokeWidth={2.5} />
              <span>Login</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>

          {/* Mobile: Login + hamburger grouped right, so the pill doesn't
              float in the dead centre of the bar at tablet widths. */}
          <div className="flex items-center gap-1.5 lg:hidden">
          <a
            href={LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hc-press lg:hidden flex items-center gap-1 px-3 py-2.5 text-caption font-semibold bg-brand text-ink-900 rounded-full"
          >
            <Zap className="h-3 w-3" strokeWidth={2.5} />
            <span>Login</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="hc-press-sm hc-press hc-tint lg:hidden p-3 rounded-lg text-on-dark/80 hover:text-white hover:bg-white/[0.06]"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          </div>
        </nav>
      </header>

      {/* Mobile Full-Screen Menu.
          Mounted always, opened by the attribute — the drawer's fade-OUT is
          the one thing here CSS cannot do to an unmounted element, and it was
          the entire justification for AnimatePresence. `visibility: hidden`
          in the closed state keeps every link inside it out of the tab order,
          which conditional rendering also gave us and a bare opacity:0 would
          not. `inert` is belt and braces for the dialog role. */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        data-open={mobileOpen}
        inert={!mobileOpen}
        className="hc-sheet fixed inset-0 z-40 bg-ink-900 lg:hidden"
      >

            <div className="relative pt-28 px-6 pb-10 h-full overflow-y-auto">
              <nav aria-label="Mobile" className="space-y-3 mb-10">
                {navLinks.map((link, i) => (
                  <button
                    key={link.id ?? link.href}
                    data-stagger
                    style={{ "--d": `${i * 0.06}s` } as React.CSSProperties}
                    onClick={() => handleNavItem(link)}
                    className="w-full flex items-center gap-4 p-5 rounded-lg glass border border-white/[0.06] hover:border-brand/30 text-left group"
                  >
                    <div className="w-14 h-14 rounded-lg bg-brand/10 group-hover:bg-brand/20 flex items-center justify-center transition-colors">
                      <link.icon
                        className="h-6 w-6 text-brand"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-on-dark/90 text-h4">
                      {link.label}
                    </span>
                  </button>
                ))}
              </nav>

              <div className="mb-10">
                <p className="text-overline text-white/55 mb-3">Popular guides</p>
                <div className="space-y-1">
                  {navGuides.map((g) => (
                    <Link
                      key={g.slug}
                      href={guideHref(g.slug)}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-baseline justify-between gap-4 py-2.5 border-t border-white/[0.07] text-on-dark/80 hover:text-white transition-colors"
                    >
                      <span className="text-body-sm">{g.navTitle ?? g.title}</span>
                      <span className="text-caption text-white/55 shrink-0">
                        {g.read}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <button
                data-stagger
                style={{ "--d": "0.36s" } as React.CSSProperties}
                onClick={() => router.push("/locations")}
                className="hc-press hc-tint inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-ink-900 hover:bg-brand-hover w-full text-body-sm"
              >
                <Zap className="h-4 w-4" strokeWidth={2.5} />
                Start Charging Now
              </button>
            </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav
        className="hc-lift-in fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-ink-900/95 backdrop-blur-md border-t border-white/[0.06] safe-area-bottom"
        aria-label="Quick links"
      >
        <div className="grid grid-cols-5">
          {[
            { id: "how-it-works", icon: Zap, label: "Charge" },
            { href: "/charging-101", icon: BookOpen, label: "Guides" },
            /* "Plan" here, not the full name. This is a five-column grid of
               10px labels; sixteen characters do not go in it. */
            { href: "/plan-your-charge", icon: Battery, label: "Plan" },
            { href: "/locations", icon: MapPin, label: "Locations" },
            { href: "/contact", icon: Phone, label: "Contact" },
          ].map((item) => (
            <button
              key={item.id ?? item.href}
              onClick={() => handleNavItem(item)}
              className="hc-press hc-press-sm hc-tint flex flex-col items-center py-3 text-muted-dark hover:text-brand"
            >
              <item.icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-footnote mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
