"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Search,
  Navigation,
  Clock,
  Zap,
  Phone,
  ExternalLink,
  Truck,
  Package,
  Car,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Coffee,
  Utensils,
  ShoppingBag,
} from "lucide-react";

// Mock station data - in production this would come from an API
const stations = [
  {
    id: 1,
    name: "HubCharge Alhambra",
    address: "108 S Monterey St, Unit 102",
    city: "Alhambra",
    state: "CA",
    zip: "91801",
    distance: null,
    chargers: 2,
    power: "180kW",
    hours: "6 AM - 10 PM",
    phone: "(949) 391-4676",
    hasAttendant: true,
    services: ["delivery", "pickup"],
    status: "open",
    coords: { lat: 34.095, lng: -118.127 },
  },
];

const upcomingLocations = ["Los Angeles", "Pasadena", "Irvine", "San Diego"];

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

const services = [
  {
    icon: Truck,
    title: "Delivery",
    desc: "Food, coffee, and essentials delivered to your car window",
    color: "text-[#f94d00]",
    bgColor: "bg-[#f94d00]/20",
  },
  {
    icon: Package,
    title: "Pickup",
    desc: "Order ahead from nearby stores — we'll have it ready",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
  },
  {
    icon: Car,
    title: "Drop-off",
    desc: "Car services like detailing while you charge",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
  },
];

export function FindYourHub() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [zipCode, setZipCode] = useState("");
  const [searchResults, setSearchResults] = useState<typeof stations | null>(
    null,
  );
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim()) return;

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      // For demo, always return Alhambra station
      setSearchResults(stations);
      setIsSearching(false);
    }, 800);
  };

  return (
    <section
      ref={sectionRef}
      id="locations"
      className="relative section-padding bg-[#262322] overflow-hidden"
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#f94d00]/10 rounded-full blur-[200px]" />
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
              Locations
            </span>
          </div>
          <h2 className="heading-section text-[#f4f3f2] mb-4">
            Find your nearest
            <br />
            <span className="text-gradient text-glow">HubCharge station</span>
          </h2>
          <p className="text-body-lg max-w-xl mx-auto">
            Enter your ZIP code to find ultra-fast EV charging near you. 180kW
            chargers with attendant service and lifestyle amenities.
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12"
        >
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none">
                <Search className="h-5 w-5 text-[#59524f]" />
              </div>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter ZIP code to find stations near you"
                className="w-full pl-12 pr-36 py-4 bg-[#f4f3f2]/5 border border-[#3a3533] rounded-2xl text-[#f4f3f2] placeholder:text-[#59524f] focus:outline-none focus:border-[#f94d00]/50 focus:ring-2 focus:ring-[#f94d00]/20 transition-all"
              />
              <motion.button
                type="submit"
                disabled={isSearching}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="absolute right-2 px-6 py-2.5 bg-[#f94d00] hover:bg-orange-600 text-[#f4f3f2] font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Searching
                  </span>
                ) : (
                  "Find Stations"
                )}
              </motion.button>
            </div>
          </form>

          {/* Quick location link */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => {
                setZipCode("91801");
                setSearchResults(stations);
              }}
              className="flex items-center gap-1.5 text-sm text-[#877f78] hover:text-[#f94d00] transition-colors"
            >
              <Navigation className="h-3.5 w-3.5" />
              Use current location
            </button>
          </div>
        </motion.div>

        {/* Services Bar */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          {services.map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="flex items-center gap-4 p-4 rounded-2xl glass border border-[#3a3533]"
            >
              <div className={`w-12 h-12 rounded-xl ${service.bgColor} flex items-center justify-center`}>
                <service.icon className={`h-6 w-6 ${service.color}`} />
              </div>
              <div>
                <h4 className="font-semibold text-[#f4f3f2]">{service.title}</h4>
                <p className="text-[#877f78] text-sm">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div> */}

        {/* Search Results / Station List */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Station List */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <h3 className="text-lg font-bold text-[#f4f3f2] mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#f94d00]" />
                {searchResults
                  ? `${searchResults.length} Station Found`
                  : "Available Stations"}
              </h3>

              <div className="space-y-4">
                {(searchResults || stations).map((station) => (
                  <motion.div
                    key={station.id}
                    whileHover={{ scale: 1.02 }}
                    className="card p-5 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-[#f4f3f2]">
                            {station.name}
                          </h4>
                          {station.status === "open" && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                              Open
                            </span>
                          )}
                        </div>
                        <p className="text-[#877f78] text-sm">
                          {station.address}
                        </p>
                        <p className="text-[#59524f] text-sm">
                          {station.city}, {station.state} {station.zip}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[#f4f3f2]/30 group-hover:text-[#f94d00] transition-colors" />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#f94d00]/10 text-[#f94d00] text-xs">
                        <Zap className="h-3 w-3" />
                        {station.power}
                      </span>
                      {/* <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#f4f3f2]/5 text-[#877f78] text-xs">
                        <Clock className="h-3 w-3" />
                        {station.hours}
                      </span> */}
                      {station.hasAttendant && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs">
                          <CheckCircle2 className="h-3 w-3" />
                          Attendant
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <motion.a
                        href={`https://maps.google.com/?q=${station.address}+${station.city}+${station.state}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#f94d00] hover:bg-orange-600 text-[#f4f3f2] text-sm font-semibold transition-colors"
                      >
                        <Navigation className="h-4 w-4" />
                        Directions
                      </motion.a>
                      <a
                        href={`tel:${station.phone}`}
                        className="flex items-center justify-center w-10 h-10 rounded-lg glass border border-[#3a3533] hover:border-[#f94d00]/50 transition-colors"
                      >
                        <Phone className="h-4 w-4 text-[#877f78]" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Attendant note */}
              <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-400/80">
                  Attendant availability varies by location and time. Check
                  station details for current availability.
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 relative rounded-3xl overflow-hidden border border-[#3a3533] bg-[#1a1918] min-h-[500px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.5!2d-118.127!3d34.095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDA1JzQyLjAiTiAxMTjCsDA3JzM3LjIiVw!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{
                border: 0,
                minHeight: "500px",
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
                  className="absolute inset-0 bg-[#f94d00] rounded-full"
                />
                <div className="relative w-12 h-12 bg-[#f94d00] rounded-full flex items-center justify-center shadow-lg glow-orange">
                  <MapPin className="h-6 w-6 text-[#f4f3f2]" />
                </div>
              </div>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl glass border border-[#3a3533]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#f94d00]" />
                    <span className="text-[#877f78] text-sm">
                      HubCharge Station
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-[#877f78] text-sm">Coming Soon</span>
                  </div>
                </div>
                <a
                  href="https://maps.google.com/?q=108+S+Monterey+St+Alhambra+CA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#f94d00] text-sm hover:underline"
                >
                  Open in Maps
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Nearby Places - Delivered to Your Car */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <h3 className="text-xl font-bold text-[#f4f3f2] mb-6 text-center">
            What's Nearby — Delivered to Your Car
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Coffee */}
            <motion.div whileHover={{ y: -4 }} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Coffee className="h-5 w-5 text-amber-400" />
                </div>
                <h4 className="font-semibold text-[#f4f3f2]">Coffee & Tea</h4>
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
                    className="flex items-center justify-between glass rounded-lg px-4 py-3 border border-[#3a3533]/50 cursor-pointer"
                  >
                    <span className="text-[#f4f3f2]/80">{place.name}</span>
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
                <div className="w-10 h-10 rounded-lg bg-[#f94d00]/20 flex items-center justify-center">
                  <Utensils className="h-5 w-5 text-[#f94d00]" />
                </div>
                <h4 className="font-semibold text-[#f4f3f2]">Food & Dining</h4>
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
                    className="flex items-center justify-between glass rounded-lg px-4 py-3 border border-[#3a3533]/50 cursor-pointer"
                  >
                    <span className="text-[#f4f3f2]/80">{place.name}</span>
                    <span className="text-[#f94d00] text-sm font-medium">
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
                <h4 className="font-semibold text-[#f4f3f2]">Shopping & More</h4>
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
                    className="flex items-center justify-between glass rounded-lg px-4 py-3 border border-[#3a3533]/50 cursor-pointer"
                  >
                    <span className="text-[#f4f3f2]/80">{place.name}</span>
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="card p-8 text-center">
            <h3 className="text-xl font-bold text-[#f4f3f2] mb-4">
              More Locations Coming Soon
            </h3>
            <p className="text-[#877f78] mb-6 max-w-lg mx-auto">
              We're expanding across California. Enter your email to be notified
              when we open near you.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {upcomingLocations.map((location, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full glass border border-[#3a3533] text-[#f4f3f2]/80"
                >
                  {location}
                </span>
              ))}
            </div>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-[#f4f3f2]/5 border border-[#3a3533] rounded-xl text-[#f4f3f2] placeholder:text-[#59524f] focus:outline-none focus:border-[#f94d00]/50"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-[#f94d00] hover:bg-orange-600 text-[#f4f3f2] font-semibold rounded-xl transition-colors"
              >
                Notify Me
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
