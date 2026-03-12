"use client";

import { useState, useEffect } from "react";
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
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="relative z-10 group"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            <Image
              src="/images/hubcharge-logo.png"
              alt="HubCharge"
              width={140}
              height={36}
              className="h-8 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
              priority
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center bg-gray-50 rounded-full px-1 py-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  onMouseEnter={() => setActiveLink(link.id)}
                  onMouseLeave={() => setActiveLink(null)}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeLink === link.id
                      ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <a
            href="#locations"
            onClick={(e) => { e.preventDefault(); handleNavClick("locations"); }}
            className="hidden lg:flex items-center gap-2 btn btn-primary rounded-full"
          >
            <Zap className="h-4 w-4" strokeWidth={2.5} />
            <span>Start Charging</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile Full-Screen Menu */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-all duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="pt-24 px-6 pb-10 h-full overflow-y-auto">
          {/* Navigation Links */}
          <div className="space-y-2 mb-10">
            {navLinks.map((link, i) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center transition-colors">
                  <link.icon className="h-5 w-5 text-orange-600" strokeWidth={1.5} />
                </div>
                <span className="text-gray-700 font-semibold text-lg group-hover:text-orange-600 transition-colors">
                  {link.label}
                </span>
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => handleNavClick("locations")}
            className="flex items-center justify-center gap-3 w-full btn btn-primary btn-lg rounded-full"
          >
            <Zap className="h-5 w-5" strokeWidth={2.5} />
            Start Charging Now
          </button>

          {/* Contact info */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-gray-400 text-sm mb-4">Questions? Reach out:</p>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Phone className="h-5 w-5 text-orange-600" />
              </div>
              <span className="font-medium">(626) 555-CHARGE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 safe-area-bottom">
        <div className="grid grid-cols-5">
          {[
            { id: "how-it-works", icon: Zap, label: "Charge" },
            { id: "lifestyle", icon: Utensils, label: "Lifestyle" },
            { id: "pricing", icon: Battery, label: "Pricing" },
            { id: "locations", icon: MapPin, label: "Locations" },
            { id: "contact", icon: Phone, label: "Contact" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="flex flex-col items-center py-3 text-gray-400 hover:text-orange-500 active:text-orange-600 transition-colors"
            >
              <item.icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
