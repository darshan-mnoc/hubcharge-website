"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Coffee,
  Utensils,
  ShoppingBag,
  Navigation,
  Clock,
  Zap,
  Phone,
  ExternalLink,
} from "lucide-react";

const nearbyPlaces = {
  coffee: [
    { name: "Twinkle Tea", walk: "1 min" },
    { name: "Starbucks", walk: "3 min" },
    { name: "Tea Station", walk: "2 min" },
  ],
  food: [
    { name: "Fosselman's Ice Cream", walk: "2 min" },
    { name: "Grill 'Em All", walk: "3 min" },
    { name: "Din Tai Fung", walk: "5 min" },
    { name: "Phoenix Food Boutique", walk: "2 min" },
  ],
  retail: [
    { name: "Target", walk: "5 min" },
    { name: "Alhambra Place", walk: "3 min" },
    { name: "Edwards Alhambra Renaissance", walk: "4 min" },
  ],
};

export function FindYourHub() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="locations"
      className="relative section-padding bg-[#0a0a0a] overflow-hidden"
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[150px]" />

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 badge badge-primary mb-8">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Now Open in Alhambra
            </span>
          </div>
          <h2 className="heading-section text-white mb-4">
            Visit Our First Location
          </h2>
          <p className="text-body-lg max-w-xl mx-auto">
            Experience full-service EV charging with valet, food delivery, and
            more.
          </p>
        </motion.div>

        {/* Main Location Card */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left - Location Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  HubCharge Alhambra
                </h3>
                <p className="text-white/40">Our flagship location</p>
              </div>
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(244, 130, 69, 0.3)",
                    "0 0 40px rgba(244, 130, 69, 0.5)",
                    "0 0 20px rgba(244, 130, 69, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center"
              >
                <Zap className="h-6 w-6 text-white" />
              </motion.div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">
                    108 S Monterey St, Unit 102
                  </p>
                  <p className="text-white/40">Alhambra, CA 91801</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-400" />
                <p className="text-white">Open Daily: 6 AM - 10 PM</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-400" />
                <p className="text-white">(949) 391-4676</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { value: "2", label: "Chargers", color: "text-orange-400" },
                { value: "180", label: "kW Power", color: "text-green-400" },
                { value: "24/7", label: "Valet", color: "text-white" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="glass rounded-xl p-4 text-center border border-white/10"
                >
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-white/40 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="https://maps.google.com/?q=108+S+Monterey+St+Alhambra+CA"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 30px rgba(244, 130, 69, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 w-full btn btn-primary"
            >
              <Navigation className="h-5 w-5" />
              Get Directions
              <ExternalLink className="h-4 w-4" />
            </motion.a>
          </motion.div>

          {/* Right - Map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#111] min-h-[400px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.5!2d-118.127!3d34.095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDA1JzQyLjAiTiAxMTjCsDA3JzM3LjIiVw!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{
                border: 0,
                minHeight: "400px",
                filter: "invert(90%) hue-rotate(180deg)",
              }}
              allowFullScreen
              loading="lazy"
              className="absolute inset-0"
            />
            {/* Pin overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-orange-500 rounded-full"
                />
                <div className="relative w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg glow-orange">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Nearby Places */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            What's Nearby — Delivered to Your Car
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Coffee */}
            <motion.div whileHover={{ y: -4 }} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Coffee className="h-5 w-5 text-amber-400" />
                </div>
                <h4 className="font-semibold text-white">Coffee & Tea</h4>
              </div>
              <div className="space-y-3">
                {nearbyPlaces.coffee.map((place, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between glass rounded-lg px-4 py-3 border border-white/5 cursor-pointer"
                  >
                    <span className="text-white/70">{place.name}</span>
                    <span className="text-amber-400 text-sm font-medium">
                      {place.walk}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Food */}
            <motion.div whileHover={{ y: -4 }} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Utensils className="h-5 w-5 text-orange-400" />
                </div>
                <h4 className="font-semibold text-white">Food & Dining</h4>
              </div>
              <div className="space-y-3">
                {nearbyPlaces.food.map((place, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between glass rounded-lg px-4 py-3 border border-white/5 cursor-pointer"
                  >
                    <span className="text-white/70">{place.name}</span>
                    <span className="text-orange-400 text-sm font-medium">
                      {place.walk}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Retail */}
            <motion.div whileHover={{ y: -4 }} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white">Shopping & More</h4>
              </div>
              <div className="space-y-3">
                {nearbyPlaces.retail.map((place, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between glass rounded-lg px-4 py-3 border border-white/5 cursor-pointer"
                  >
                    <span className="text-white/70">{place.name}</span>
                    <span className="text-blue-400 text-sm font-medium">
                      {place.walk}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 border border-white/10">
            <span className="text-white/40">More locations coming:</span>
            <span className="text-white font-medium">
              Los Angeles, Pasadena, Irvine
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
