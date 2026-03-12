"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
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
    { name: "Twinkle Tea", walk: "1 min", type: "coffee" },
    { name: "Starbucks", walk: "3 min", type: "coffee" },
    { name: "Tea Station", walk: "2 min", type: "coffee" },
  ],
  food: [
    { name: "Fosselman's Ice Cream", walk: "2 min", type: "food" },
    { name: "Grill 'Em All", walk: "3 min", type: "food" },
    { name: "Din Tai Fung", walk: "5 min", type: "food" },
    { name: "Phoenix Food Boutique", walk: "2 min", type: "food" },
  ],
  retail: [
    { name: "Target", walk: "5 min", type: "shop" },
    { name: "Alhambra Place", walk: "3 min", type: "shop" },
    { name: "Edwards Alhambra Renaissance", walk: "4 min", type: "shop" },
  ],
};

export function FindYourHub() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hub-content",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      // Map pin pulse
      gsap.to(".map-pin-pulse", {
        scale: 1.5,
        opacity: 0,
        duration: 1.5,
        ease: "power1.out",
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="locations"
      className="relative section-padding bg-white overflow-hidden"
    >
      <div className="section-container">
        {/* Header */}
        <div className="hub-content text-center mb-12">
          <div className="inline-flex items-center gap-2 badge badge-primary mb-8">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Now Open in Alhambra</span>
          </div>
          <h2 className="heading-section mb-4">
            Visit Our First Location
          </h2>
          <p className="text-body-lg max-w-xl mx-auto">
            Experience full-service EV charging with valet, food delivery, and more.
          </p>
        </div>

        {/* Main Location Card */}
        <div className="hub-content grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left - Location Info */}
          <div className="card p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">HubCharge Alhambra</h3>
                <p className="text-gray-400">Our flagship location</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">108 S Monterey St, Unit 102</p>
                  <p className="text-gray-400">Alhambra, CA 91801</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-500" />
                <p className="text-gray-700">Open Daily: 6 AM - 10 PM</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-500" />
                <p className="text-gray-700">(626) 555-CHARGE</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <p className="text-2xl font-bold text-orange-500">4</p>
                <p className="text-gray-400 text-sm">Chargers</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <p className="text-2xl font-bold text-emerald-500">180</p>
                <p className="text-gray-400 text-sm">kW Power</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-gray-400 text-sm">Valet</p>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=108+S+Monterey+St+Alhambra+CA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full btn btn-primary rounded-full"
            >
              <Navigation className="h-5 w-5" />
              Get Directions
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Right - Map */}
          <div className="relative rounded-3xl overflow-hidden border border-gray-200 bg-gray-100 min-h-[400px] shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.5!2d-118.127!3d34.095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDA1JzQyLjAiTiAxMTjCsDA3JzM3LjIiVw!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
            {/* Pin overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                <div className="map-pin-pulse absolute inset-0 bg-orange-500 rounded-full" />
                <div className="relative w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-300">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Places */}
        <div className="hub-content">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            What's Nearby — Delivered to Your Car
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Coffee */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Coffee className="h-5 w-5 text-amber-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Coffee & Tea</h4>
              </div>
              <div className="space-y-3">
                {nearbyPlaces.coffee.map((place, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100"
                  >
                    <span className="text-gray-600">{place.name}</span>
                    <span className="text-amber-600 text-sm font-medium">
                      {place.walk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Food */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Utensils className="h-5 w-5 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Food & Dining</h4>
              </div>
              <div className="space-y-3">
                {nearbyPlaces.food.map((place, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100"
                  >
                    <span className="text-gray-600">{place.name}</span>
                    <span className="text-orange-600 text-sm font-medium">
                      {place.walk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Retail */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Shopping & More</h4>
              </div>
              <div className="space-y-3">
                {nearbyPlaces.retail.map((place, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100"
                  >
                    <span className="text-gray-600">{place.name}</span>
                    <span className="text-blue-600 text-sm font-medium">
                      {place.walk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="hub-content mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-6 py-3 border border-gray-100">
            <span className="text-gray-400">More locations coming:</span>
            <span className="text-gray-700 font-medium">
              Los Angeles, Pasadena, Irvine
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
