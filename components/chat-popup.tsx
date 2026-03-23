"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  MapPin,
  Coffee,
  Utensils,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

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

  const toggleOption = (value: string) => {
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
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
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen
            ? "0 0 0 rgba(244, 130, 69, 0)"
            : [
                "0 0 20px rgba(244, 130, 69, 0.3)",
                "0 0 40px rgba(244, 130, 69, 0.5)",
                "0 0 20px rgba(244, 130, 69, 0.3)",
              ],
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity },
          scale: { duration: 0.2 },
        }}
        className={`fixed bottom-20 right-6 lg:bottom-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 ${
          isOpen
            ? "bg-[#1a1a1a] border border-white/20"
            : "bg-gradient-to-br from-orange-500 to-amber-500"
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6 text-white/70" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Backdrop - Click to close */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none"
          />
        )}
      </AnimatePresence>

      {/* Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed z-50 card shadow-2xl overflow-hidden
              inset-x-4 top-20 bottom-auto
              sm:inset-auto sm:bottom-36 sm:right-6 sm:top-auto
              lg:bottom-24
              w-auto sm:w-[360px] max-w-[calc(100vw-2rem)]
              max-h-[calc(100vh-10rem)] sm:max-h-[calc(100vh-12rem)]
              flex flex-col"
          >
            {/* Header */}
            <div className="relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative p-4 sm:p-6"
              >
                {/* Close button - mobile */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors sm:hidden"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0"
                  >
                    <MapPin className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-white">
                      Help Us Grow
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm">
                      What do you want near HubCharge?
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-6 sm:p-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4 border border-green-500/30"
                    >
                      <motion.svg
                        className="w-7 h-7 sm:w-8 sm:h-8 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    </motion.div>
                    <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                      Thank You!
                    </h4>
                    <p className="text-white/50 text-sm">
                      Your feedback helps us bring the best to your area.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="p-4 sm:p-6"
                  >
                    <p className="text-white/50 text-xs sm:text-sm mb-3 sm:mb-4">
                      Select what you'd like to see near HubCharge stations:
                    </p>

                    {/* Quick Options */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                      {quickOptions.map((option, i) => {
                        const isSelected = selectedOptions.includes(option.value);
                        return (
                          <motion.button
                            key={option.value}
                            type="button"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleOption(option.value)}
                            className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border-2 transition-all duration-200 ${
                              isSelected
                                ? "border-orange-500 bg-orange-500/20"
                                : "border-white/10 bg-white/5 hover:border-white/20"
                            }`}
                          >
                            <option.icon
                              className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${isSelected ? "text-orange-400" : "text-white/40"}`}
                            />
                            <span
                              className={`text-xs sm:text-sm font-medium ${isSelected ? "text-orange-400" : "text-white/60"}`}
                            >
                              {option.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Custom Message */}
                    <div className="mb-4">
                      <label className="text-xs sm:text-sm text-white/40 mb-2 block">
                        Or tell us something specific:
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="I'd love to see..."
                        className="input resize-none h-16 sm:h-20 text-sm"
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={!message.trim() && selectedOptions.length === 0}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn btn-primary rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3"
                    >
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                      Send Feedback
                    </motion.button>

                    <p className="text-center text-[10px] sm:text-xs text-white/30 mt-3 sm:mt-4">
                      We read every suggestion
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
