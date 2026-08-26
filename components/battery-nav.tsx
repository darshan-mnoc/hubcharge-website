"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Utensils,
  MapPin,
  Phone,
  Menu,
  X,
  Battery,
} from "lucide-react";
import Image from "next/image";

const LOGIN_URL = "https://hubcharge.micronocinc.com/login.html";

const navLinks = [
  { id: "how-it-works", label: "Experience", icon: Zap },
  { id: "lifestyle", label: "Lifestyle", icon: Utensils },
  { id: "pricing", label: "Pricing", icon: Battery },
  // { id: "membership", label: "Membership", icon: Crown },
  { id: "locations", label: "Locations", icon: MapPin },
  { id: "contact", label: "Contact", icon: Phone },
];

export function BatteryNav() {
  const router = useRouter();
  const pathname = usePathname();
  // Only the homepage has a dark hero behind the nav to sit transparently on.
  const overDarkHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [activeLink, setActiveLink] = useState<string | null>(null);

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
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !overDarkHero
            ? "bg-ink-900/95 backdrop-blur-md border-b border-white/[0.07]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="relative z-10"
          >
            <Image
              src="/images/hubcharge-logo.webp"
              alt="HubCharge"
              width={140}
              height={36}
              className="h-6 sm:h-7 lg:h-8 w-auto mt-2 sm:mt-0"
              priority
            />
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                onMouseEnter={() => setActiveLink(link.id)}
                onMouseLeave={() => setActiveLink(null)}
                className="relative py-1 text-caption font-medium text-on-dark/70 hover:text-white transition-colors"
              >
                {link.label}
                <span
                  aria-hidden
                  className={`absolute -bottom-1 left-0 h-[1.5px] bg-brand transition-all duration-200 ${
                    activeLink === link.id ? "w-full" : "w-0"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* CTA Button - Desktop Only */}
          <div className="hidden lg:block">
            <motion.a
              href={LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(255, 122, 0, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 btn btn-primary"
            >
              <Zap className="h-4 w-4" strokeWidth={2.5} />
              <span>Login</span>
            </motion.a>
          </div>

          {/* Mobile CTA Button - Small, between logo and hamburger */}
          <motion.a
            href={LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
            className="lg:hidden flex items-center gap-1 px-3 py-2.5 text-xs font-semibold bg-brand text-[#f4f3f2] rounded-full"
          >
            <Zap className="h-3 w-3" strokeWidth={2.5} />
            <span>Login</span>
          </motion.a>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="lg:hidden p-3 rounded-xl text-[#f4f3f2]/80 hover:text-[#f4f3f2] hover:bg-[#f4f3f2]/[0.06]"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </nav>
      </motion.header>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobileMenuRef}
            id="mobile-menu"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-hero lg:hidden"
          >

            <div className="relative pt-28 px-6 pb-10 h-full overflow-y-auto">
              <nav aria-label="Mobile" className="space-y-3 mb-10">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleNavClick(link.id)}
                    className="w-full flex items-center gap-4 p-5 rounded-lg glass border border-[#f4f3f2]/[0.06] hover:border-brand/30 text-left group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-brand/10 group-hover:bg-brand/20 flex items-center justify-center transition-colors">
                      <link.icon
                        className="h-6 w-6 text-brand"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-[#f4f3f2]/90 font-semibold text-lg">
                      {link.label}
                    </span>
                  </motion.button>
                ))}
              </nav>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => handleNavClick("locations")}
                className="flex items-center justify-center gap-2 w-full btn btn-primary text-sm py-3"
              >
                <Zap className="h-4 w-4" strokeWidth={2.5} />
                Start Charging Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Tab Bar */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-hero/95 backdrop-blur-md border-t border-[#f4f3f2]/[0.06] safe-area-bottom"
        aria-label="Quick links"
      >
        <div className="grid grid-cols-5">
          {[
            { id: "how-it-works", icon: Zap, label: "Charge" },
            { id: "lifestyle", icon: Utensils, label: "Lifestyle" },
            { id: "pricing", icon: Battery, label: "Pricing" },
            { id: "locations", icon: MapPin, label: "Locations" },
            { id: "contact", icon: Phone, label: "Contact" },
          ].map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNavClick(item.id)}
              className="flex flex-col items-center py-3 text-muted-dark hover:text-brand transition-colors"
            >
              <item.icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.nav>
    </>
  );
}
