"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { MessageCircle, X, Send, MapPin, Coffee, Utensils, ShoppingBag, Sparkles } from "lucide-react";

const quickOptions = [
  { icon: Coffee, label: "Coffee shops", value: "coffee" },
  { icon: Utensils, label: "Restaurants", value: "food" },
  { icon: ShoppingBag, label: "Shopping", value: "shopping" },
  { icon: Sparkles, label: "Services", value: "services" },
];

export function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && popupRef.current) {
      gsap.fromTo(
        popupRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  const toggleOption = (value: string) => {
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedOptions.length > 0) {
      console.log("Feedback submitted:", { message, selectedOptions });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setMessage("");
        setSelectedOptions([]);
      }, 2500);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isOpen
            ? "bg-gray-100 border border-gray-200"
            : "bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-200 hover:shadow-xl hover:scale-105"
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Popup */}
      {isOpen && (
        <div
          ref={popupRef}
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] card shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500" />
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Help Us Grow</h3>
                  <p className="text-white/80 text-sm">What do you want near HubCharge?</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {submitted ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h4>
              <p className="text-gray-500">Your feedback helps us bring the best to your area.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              <p className="text-gray-500 text-sm mb-4">
                Select what you'd like to see near HubCharge stations:
              </p>

              {/* Quick Options */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {quickOptions.map((option) => {
                  const isSelected = selectedOptions.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleOption(option.value)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <option.icon className={`h-5 w-5 ${isSelected ? "text-orange-500" : "text-gray-400"}`} />
                      <span className={`text-sm font-medium ${isSelected ? "text-orange-600" : "text-gray-600"}`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Message */}
              <div className="mb-4">
                <label className="text-sm text-gray-400 mb-2 block">
                  Or tell us something specific:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I'd love to see..."
                  className="input resize-none h-24"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!message.trim() && selectedOptions.length === 0}
                className="w-full btn btn-primary rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
                Send Feedback
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                We read every suggestion
              </p>
            </form>
          )}
        </div>
      )}
    </>
  );
}
