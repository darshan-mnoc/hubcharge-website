"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Utensils,
  MapPin,
  Crown,
  Phone,
  Menu,
  X,
  Battery,
} from "lucide-react";
import Image from "next/image";

const navLinks = [
  { id: "how-it-works", label: "Experience", icon: Zap },
  { id: "lifestyle", label: "Lifestyle", icon: Utensils },
  { id: "pricing", label: "Pricing", icon: Battery },
  { id: "membership", label: "Membership", icon: Crown },
  { id: "locations", label: "Locations", icon: MapPin },
  { id: "contact", label: "Contact", icon: Phone },
];

export function BatteryNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="relative z-10"
          >
            <Image
              src="/images/hubcharge-logo.png"
              alt="HubCharge"
              width={140}
              height={36}
              className="h-6 sm:h-7 lg:h-8 w-auto mt-2 sm:mt-0"
              priority
            />
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="relative flex items-center glass rounded-full px-1 py-1 border border-white/10">
              {navLinks.map((link) => (
                <motion.button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  onMouseEnter={() => setActiveLink(link.id)}
                  onMouseLeave={() => setActiveLink(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    activeLink === link.id
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {activeLink === link.id && (
                    <motion.div
                      layoutId="navHighlight"
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.4,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* CTA Button - Desktop Only */}
          <div className="hidden lg:block">
            <motion.a
              href="#locations"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(244, 130, 69, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("locations");
              }}
              className="flex items-center gap-2 btn btn-primary"
            >
              <Zap className="h-4 w-4" strokeWidth={2.5} />
              <span>Start Charging</span>
            </motion.a>
          </div>

          {/* Mobile CTA Button - Small, between logo and hamburger */}
          <motion.a
            href="#locations"
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("locations");
            }}
            className="lg:hidden flex items-center gap-1 px-3 py-2.5 text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full"
          >
            <Zap className="h-3 w-3" strokeWidth={2.5} />
            <span>Start Charging</span>
          </motion.a>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.06]"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] lg:hidden"
          >
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange-500 rounded-full blur-[150px]"
            />

            <div className="relative pt-28 px-6 pb-10 h-full overflow-y-auto">
              <div className="space-y-3 mb-10">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleNavClick(link.id)}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl glass border border-white/[0.06] hover:border-orange-500/30 text-left group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-orange-500/10 group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
                      <link.icon
                        className="h-6 w-6 text-orange-400"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-white/90 font-semibold text-lg">
                      {link.label}
                    </span>
                  </motion.button>
                ))}
              </div>

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
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/[0.06] safe-area-bottom"
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
              className="flex flex-col items-center py-3 text-white/40 hover:text-orange-400 transition-colors"
            >
              <item.icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  );
}
