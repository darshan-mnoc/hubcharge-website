"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  MapPin,
  Search,
  Navigation,
  Clock,
  Zap,
  Phone,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Coffee,
  Utensils,
  ShoppingBag,
} from "lucide-react";
import { notifyMe } from "@/lib/actions";
import { haversineMiles, zipToCoords } from "@/lib/geo";
import { StationMap } from "@/components/station-map";
import { stationStatus } from "@/lib/hours";
const SOMEWHERE_ELSE = "Somewhere else";

import {
  stations,
  upcomingLocations,
  nearbyByStation,
} from "@/lib/stations";

export function FindYourHub() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [zipCode, setZipCode] = useState("");
  const [searchResults, setSearchResults] = useState<typeof stations | null>(
    null,
  );
  const [isSearching, setIsSearching] = useState(false);
  const [selectedId, setSelectedId] = useState(stations[0].id);

  const selected =
    stations.find((s) => s.id === selectedId) ?? stations[0];
  const nearby = nearbyByStation[selectedId] ?? nearbyByStation[stations[0].id];

  const [distances, setDistances] = useState<Record<number, number> | null>(
    null,
  );
  const [searchNote, setSearchNote] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [wantedLocations, setWantedLocations] = useState<string[]>([]);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySending, setNotifySending] = useState(false);
  const [notifyDone, setNotifyDone] = useState(false);
  const [notifyError, setNotifyError] = useState<string | null>(null);

  const toggleWanted = (loc: string) =>
    setWantedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    );

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (notifySending) return;
    setNotifySending(true);
    setNotifyError(null);
    const result = await notifyMe({
      email: notifyEmail,
      location: wantedLocations.length
        ? wantedLocations.join(", ")
        : "(no preference given)",
      company: "",
    });
    setNotifySending(false);
    if (result.ok) {
      setNotifyDone(true);
      setNotifyEmail("");
    } else {
      setNotifyError(result.error ?? "Something went wrong — please try again.");
    }
  };

  const applyOrigin = (lat: number, lng: number) => {
    setUserLocation({ lat, lng });
    const dist: Record<number, number> = {};
    for (const st of stations) {
      dist[st.id] = haversineMiles(lat, lng, st.coords.lat, st.coords.lng);
    }
    setDistances(dist);
    const sorted = [...stations].sort((a, b) => dist[a.id] - dist[b.id]);
    setSearchResults(sorted);
    setSelectedId(sorted[0].id);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const zip = zipCode.trim();
    if (!zip) return;

    setIsSearching(true);
    setSearchNote(null);
    const coords = await zipToCoords(zip);
    setIsSearching(false);
    if (coords) {
      applyOrigin(coords.lat, coords.lng);
    } else {
      // Unknown ZIP or lookup unavailable — show every station instead
      setDistances(null);
      setSearchResults(stations);
      setSearchNote(
        "We couldn't look up that ZIP code — showing all stations.",
      );
    }
  };

  const handleUseLocation = () => {
    if (!("geolocation" in navigator)) {
      setSearchNote("Location isn't available in this browser — showing all stations.");
      setSearchResults(stations);
      return;
    }
    setIsSearching(true);
    setSearchNote(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsSearching(false);
        setZipCode("");
        applyOrigin(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setIsSearching(false);
        setDistances(null);
        setSearchResults(stations);
        setSearchNote(
          "We couldn't access your location — showing all stations.",
        );
      },
      { timeout: 8000, maximumAge: 60000 },
    );
  };

  return (
    <section
      ref={sectionRef}
      id="locations"
      data-reveal
      className="relative section-padding bg-surface overflow-hidden"
    >


      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-8">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Locations
            </span>
          </div>
          <h2 className="text-h2 text-ink-900 mb-4 max-w-headline">
            Find your nearest
            <br />
            HubCharge station
          </h2>
          <p className="text-body-lg text-ink-500 max-w-[46ch]">
            Enter your ZIP code to find ultra-fast EV charging near you. DC fast
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
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="zip-search"
                inputMode="numeric"
                autoComplete="postal-code"
                aria-label="ZIP code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter ZIP code to find stations near you"
                className="w-full pl-12 pr-36 py-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
              />
              <motion.button
                type="submit"
                disabled={isSearching}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="absolute right-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
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
              onClick={handleUseLocation}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-ink transition-colors"
            >
              <Navigation className="h-3.5 w-3.5" />
              Use current location
            </button>
          </div>
          {searchNote && (
            <div className="flex items-center justify-center mt-2">
              <p className="text-xs text-gray-500">{searchNote}</p>
            </div>
          )}
        </motion.div>

        {/* Search Results / Station List */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Station List */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ink-700" />
                {searchResults
                  ? `${searchResults.length} Station${searchResults.length === 1 ? "" : "s"} Found`
                  : "Available Stations"}
              </h3>

              <div className="space-y-4">
                {(searchResults || stations).map((station) => (
                  <motion.div
                    key={station.id}
                    onClick={() => setSelectedId(station.id)}
                    whileHover={{ scale: 1.02 }}
                    className={`card-light p-5 cursor-pointer group transition-shadow ${
                      station.id === selectedId
                        ? "ring-2 ring-brand border-brand/40"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">
                            {station.name}
                          </h4>
                          {(() => {
                            const st = stationStatus(station);
                            return (
                              <span
                                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                                  st.open
                                    ? "bg-green-50 text-green-700"
                                    : "bg-ink-100 text-ink-500"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${st.open ? "bg-green-600" : "bg-ink-400"}`}
                                />
                                {st.short}
                              </span>
                            );
                          })()}
                        </div>
                        <p className="text-gray-500 text-sm">
                          {station.address}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {station.city}, {station.state} {station.zip}
                        </p>
                        {distances?.[station.id] != null && (
                          <p className="text-brand-ink text-xs font-semibold mt-1">
                            ~{Math.round(distances[station.id])} mi away
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-brand-ink transition-colors" />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-brand/10 text-brand-ink text-xs">
                        <Zap className="h-3 w-3" />
                        {station.power}
                      </span>
                      {/* <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 text-gray-500 text-xs">
                        <Clock className="h-3 w-3" />
                        {station.hours}
                      </span> */}
                      {station.hasAttendant && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Attendant
                        </span>
                      )}
                    </div>

                    {station.note && (
                      <div className="flex items-center gap-1.5 mb-3 text-xs font-medium text-brand-ink">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                        {station.note}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <motion.a
                        href={`https://maps.google.com/?q=${station.address}+${station.city}+${station.state}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-brand hover:bg-brand-hover text-white text-sm font-semibold transition-colors"
                      >
                        <Navigation className="h-4 w-4" />
                        Directions
                      </motion.a>
                      <a
                        href={`tel:+1${station.phone.replace(/\D/g, "")}`}
                        aria-label={`Call ${station.name}`}
                        className="flex items-center justify-center w-10 h-10 rounded-lg glass-light border border-gray-200 hover:border-brand/50 transition-colors"
                      >
                        <Phone className="h-4 w-4 text-gray-500" />
                      </a>
                    </div>
                    <a
                      href={`/locations/${station.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-brand-ink hover:text-brand-hover"
                    >
                      Station details
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </motion.div>
                ))}
              </div>

              {/* Attendant note */}
              <div className="flex items-start gap-2.5 mt-4 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Attendant availability varies by location and time. Check
                  station details for current availability.
                </p>
              </div>
            </div>
          </div>

          {/* Map — real markers, not a decorative pin glued to the centre */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 rounded-lg overflow-hidden border border-gray-200 bg-ink-900 min-h-[500px]"
          >
            <StationMap
              stations={stations}
              selectedId={selectedId}
              onSelect={setSelectedId}
              userLocation={userLocation}
              className="h-full min-h-[500px]"
            />
          </motion.div>
        </div>

        {/* Nearby Places - Delivered to Your Car */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <h3 className="text-h3 text-ink-900 mb-1">
            What&apos;s Nearby — Delivered to Your Car
          </h3>
          <p className="text-body-sm text-ink-500 mb-6">
            Near {selected.name} · {selected.city}, {selected.state}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Coffee */}
            <motion.div whileHover={{ y: -4 }} className="card-light p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Coffee className="h-5 w-5 text-amber-400" />
                </div>
                <h4 className="font-semibold text-gray-900">Coffee & Tea</h4>
              </div>
              <div className="space-y-3">
                {nearby.coffee.map((place, i) => (
                  <motion.a
                    key={i}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${place.name} ${selected.city} ${selected.state}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between glass-light rounded-lg px-4 py-3 border border-gray-200 hover:border-brand/40 transition-colors"
                  >
                    <span className="text-ink-700">{place.name}</span>
                    <span className="text-ink-400 text-sm">{place.walk} walk</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Food */}
            <motion.div whileHover={{ y: -4 }} className="card-light p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center">
                  <Utensils className="h-5 w-5 text-ink-700" />
                </div>
                <h4 className="font-semibold text-gray-900">Food & Dining</h4>
              </div>
              <div className="space-y-3">
                {nearby.food.map((place, i) => (
                  <motion.a
                    key={i}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${place.name} ${selected.city} ${selected.state}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between glass-light rounded-lg px-4 py-3 border border-gray-200 hover:border-brand/40 transition-colors"
                  >
                    <span className="text-ink-700">{place.name}</span>
                    <span className="text-ink-400 text-sm">{place.walk} walk</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Retail */}
            <motion.div whileHover={{ y: -4 }} className="card-light p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-blue-400" />
                </div>
                <h4 className="font-semibold text-gray-900">Shopping & More</h4>
              </div>
              <div className="space-y-3">
                {nearby.retail.map((place, i) => (
                  <motion.a
                    key={i}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${place.name} ${selected.city} ${selected.state}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between glass-light rounded-lg px-4 py-3 border border-gray-200 hover:border-brand/40 transition-colors"
                  >
                    <span className="text-ink-700">{place.name}</span>
                    <span className="text-ink-400 text-sm">{place.walk} walk</span>
                  </motion.a>
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
          <div className="card-light p-8">
            <h3 className="text-h3 text-ink-900 mb-3">
              More Locations Coming Soon
            </h3>
            <p className="text-ink-500 mb-6 max-w-[52ch]">
              We&apos;re expanding across California. Enter your email to be notified
              when we open near you.
            </p>
            <p className="text-caption text-ink-400 mb-3">
              Which area are you waiting on?
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {upcomingLocations.map((location) => {
                const active = wantedLocations.includes(location);
                return (
                  <button
                    key={location}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleWanted(location)}
                    className={`rounded-full border px-4 py-2 text-body-sm transition-colors ${
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-gray-200 text-ink-600 hover:border-brand/50"
                    }`}
                  >
                    {location}
                  </button>
                );
              })}
              <button
                type="button"
                aria-pressed={wantedLocations.includes(SOMEWHERE_ELSE)}
                onClick={() => toggleWanted(SOMEWHERE_ELSE)}
                className={`rounded-full border px-4 py-2 text-body-sm transition-colors ${
                  wantedLocations.includes(SOMEWHERE_ELSE)
                    ? "border-brand bg-brand text-white"
                    : "border-gray-200 text-ink-600 hover:border-brand/50"
                }`}
              >
                {SOMEWHERE_ELSE}
              </button>
            </div>
            {notifyDone ? (
              <p className="text-green-700 font-medium">
                You&apos;re on the list
                {wantedLocations.length > 0
                  ? ` — we'll tell you first about ${wantedLocations.join(" and ")}.`
                  : " — we'll let you know when new hubs open."}
              </p>
            ) : (
              <form
                onSubmit={handleNotify}
                className="flex flex-col sm:flex-row gap-3 max-w-md"
              >
                <input
                  type="email"
                  required
                  aria-label="Email address for new-location updates"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-brand/50"
                />
                <motion.button
                  type="submit"
                  disabled={notifySending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-brand hover:bg-brand-hover disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
                >
                  {notifySending ? "Sending…" : "Notify Me"}
                </motion.button>
              </form>
            )}
            {notifyError && (
              <p role="alert" className="text-sm text-red-500 mt-2">
                {notifyError}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
