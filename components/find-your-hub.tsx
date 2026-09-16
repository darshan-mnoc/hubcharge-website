"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
  ChevronDown,
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
  statesWithCoverage,
} from "@/lib/stations";

export function FindYourHub() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  /* Is the map slot close enough to be worth building. See the slot below. */
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapNear, setMapNear] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [searchResults, setSearchResults] = useState<typeof stations | null>(
    null,
  );
  const [isSearching, setIsSearching] = useState(false);

  /* One observer, once. It never goes back to false: a map that unmounted on
     scroll-out would re-initialise a WebGL context and re-request every tile
     the next time the reader came back to it. */
  useEffect(() => {
    const el = mapRef.current;
    if (!el || mapNear) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMapNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mapNear]);
  const [selectedId, setSelectedId] = useState(stations[0].id);
  /* "All" until a reader narrows it. Options come from statesWithCoverage(),
     which already sorts states you can charge in above states we have only
     announced — so the filter can never rank Texas above California. */
  const [stateFilter, setStateFilter] = useState("all");

  const visibleStations =
    stateFilter === "all" ? stations : stations.filter((s) => s.state === stateFilter);

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
      /* NO overflow-hidden. It clipped a decorative background blob that has
         since been deleted — the two blank lines below are where it was — and
         an ancestor with overflow:hidden becomes the sticky containing block
         for everything inside it. So `sticky top-24` on the station list had
         silently done nothing since the blob went, and the same class on the
         map did nothing when it was added. Nothing here overflows
         horizontally; section-container already bounds the width. */
      className="relative section-padding bg-paper"
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
            <span className="text-body-sm font-semibold uppercase tracking-wider">
              Locations
            </span>
          </div>
          <h2 className="text-h2 text-ink-900 mb-4 max-w-headline">
            Find your nearest{" "}
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
            <div className="flex items-center gap-2">
              <div className="field-wrap relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Search className="field-icon h-5 w-5 text-ink-500 transition-colors" />
                </div>
                <input
                type="text"
                id="zip-search"
                inputMode="numeric"
                autoComplete="postal-code"
                aria-label="ZIP code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter your ZIP code"
                  className="field pl-11 pr-4 py-4"
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSearching}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="shrink-0 px-4 sm:px-6 py-4 text-body-sm bg-brand hover:bg-brand-hover text-ink-900 font-semibold rounded-lg transition-colors disabled:opacity-50"
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
              className="flex items-center gap-1.5 text-body-sm text-ink-500 hover:text-brand-ink transition-colors"
            >
              <Navigation className="h-3.5 w-3.5" />
              Use current location
            </button>
          </div>
          {searchNote && (
            <div className="flex items-center justify-center mt-2">
              <p className="text-caption text-ink-500">{searchNote}</p>
            </div>
          )}
        </motion.div>

        {/* Search Results / Station List */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Station List */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <h3 className="text-h3 text-ink-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ink-700" />
                {searchResults
                  ? `${searchResults.length} Station${searchResults.length === 1 ? "" : "s"} Found`
                  : "Available Stations"}
              </h3>

              {/* A native select, styled as the site's own field.
                  Native because this is a filter over a handful of options: it
                  gets keyboard and screen-reader behaviour for free and opens
                  as the platform picker on a phone, which beats any custom
                  listbox at that size. The treatment matches
                  components/charging-curve-chart.tsx — .field with the chevron
                  laid over it — so it reads as part of the same product. */}
              <div className="relative mb-5">
                <label htmlFor="state-filter" className="sr-only">
                  Filter stations by state
                </label>
                <select
                  id="state-filter"
                  value={stateFilter}
                  onChange={(e) => {
                    const next = e.target.value;
                    setStateFilter(next);
                    /* Move the selection into the state being shown, so the
                       map and the list never disagree about what is selected. */
                    const first = next === "all" ? stations[0] : stations.find((s) => s.state === next);
                    if (first) setSelectedId(first.id);
                  }}
                  className="field appearance-none w-full pl-3 pr-9 py-2 text-body-sm"
                >
                  <option value="all">All states</option>
                  {statesWithCoverage().map((g) => (
                    <option key={g.code} value={g.code} disabled={g.live.length === 0}>
                      {g.name}
                      {g.live.length ? ` (${g.live.length})` : " — coming soon"}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400"
                />
              </div>

              <div className="space-y-4">
                {(searchResults || visibleStations).map((station) => (
                  <motion.div
                    key={station.id}
                    onClick={() => setSelectedId(station.id)}
                    whileHover={{ scale: 1.02 }}
                    className={`card-light relative overflow-hidden p-5 pl-6 cursor-pointer group transition-colors ${
                      station.id === selectedId ? "bg-paper-100" : ""
                    }`}
                  >
                    {/* selection marker — a rule, not a box */}
                    <span
                      aria-hidden
                      className={`absolute inset-y-0 left-0 w-1 transition-colors ${
                        station.id === selectedId ? "bg-brand" : "bg-transparent"
                      }`}
                    />

                    {/* The card listed a station without ever showing it.
                        Guarded, because a site that has not been built yet has
                        nothing to photograph and this threw on the homepage
                        the moment Round Rock got a record. */}
                    {station.photos[0] && (
                      <div className="relative -mx-5 -mt-5 mb-4 ml-[-1.5rem] aspect-[16/9] overflow-hidden">
                        <Image
                          src={station.photos[0].src}
                          alt={station.photos[0].alt}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 1024px) 100vw, 420px"
                        />
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-ink-900">
                            {station.name}
                          </h4>
                          {(() => {
                            /* "Closed · opens 6 AM" is a true sentence about a
                               site that exists and a false one about a site
                               that does not. A station with no ribbon cut gets
                               told apart from one that is merely shut. */
                            if (station.status === "coming-soon") {
                              return (
                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-caption font-medium bg-brass/15 text-brass-ink">
                                  <span className="w-1.5 h-1.5 rounded-full bg-brass-ink" />
                                  Opening soon
                                </span>
                              );
                            }
                            const st = stationStatus(station);
                            return (
                              <span
                                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-caption font-medium ${
                                  st.open
                                    ? "bg-ok-surface text-ok-ink"
                                    : "bg-ink-100 text-ink-500"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${st.open ? "bg-ok-ink" : "bg-ink-400"}`}
                                />
                                {st.short}
                              </span>
                            );
                          })()}
                        </div>
                        <p className="text-ink-500 text-body-sm">
                          {station.address}
                        </p>
                        <p className="text-ink-500 text-body-sm">
                          {station.city}, {station.state} {station.zip}
                        </p>
                        {distances?.[station.id] != null && (
                          <p className="text-brand-ink text-caption font-semibold mt-1">
                            ~{Math.round(distances[station.id])} mi away
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-ink-300 group-hover:text-brand-ink transition-colors" />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-brand/10 text-brand-ink text-caption">
                        <Zap className="h-3 w-3" />
                        {station.power}
                      </span>
                      {/* <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-paper-100 text-ink-500 text-caption">
                        <Clock className="h-3 w-3" />
                        {station.hours}
                      </span> */}
                      {station.hasAttendant && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-ok-surface text-ok-ink text-caption font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Attendant
                        </span>
                      )}
                    </div>

                    {station.note && (
                      <div className="flex items-center gap-1.5 mb-3 text-caption font-medium text-brand-ink">
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
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-brand hover:bg-brand-hover text-ink-900 text-body-sm font-semibold transition-colors"
                      >
                        <Navigation className="h-4 w-4" />
                        Directions
                        <span className="sr-only"> (opens in a new tab)</span>
                      </motion.a>
                      <a
                        href={`tel:+1${station.phone.replace(/\D/g, "")}`}
                        aria-label={`Call ${station.name}`}
                        className="flex items-center justify-center w-10 h-10 rounded-lg glass-light border border-paper-300 hover:border-brand/50 transition-colors"
                      >
                        <Phone className="h-4 w-4 text-ink-500" />
                      </a>
                    </div>
                    <a
                      href={`/locations/${station.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 mt-3 text-body-sm font-semibold text-brand-ink hover:text-brand-hover"
                    >
                      Station details
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </motion.div>
                ))}
              </div>

              {/* Attendant note */}
              <div className="flex items-start gap-2.5 mt-4 p-3.5 rounded-lg bg-paper-100 border border-paper-300">
                <AlertCircle className="h-4 w-4 text-ink-500 mt-0.5 flex-shrink-0" />
                <p className="text-caption text-ink-600 leading-relaxed">
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
            /* A DEFINITE HEIGHT, AND IT STICKS.
               This was `min-h-[500px]` on a grid item, and grid items stretch
               by default — so the row's height came from the station list
               beside it and the map grew to about 1,250px. A map that tall is
               mostly empty ground: you cannot see the pin and the top of the
               list at the same time, and scrolling moves both.

               `self-start` stops the stretch, a fixed height makes it a normal
               16:10-ish map, and sticky keeps it in view while the list
               scrolls past it — which is the whole point of putting a list
               and a map side by side. */
            className="lg:col-span-3 self-start lg:sticky lg:top-24 h-[360px] sm:h-[420px] lg:h-[520px] rounded-lg overflow-hidden border border-paper-300 bg-ink-900"
          >
            {/* THE REAL MAP, JUST NOT YET.
                MapLibre is 1,013.8 KB of JavaScript and 68 KB of CSS, and it
                used to be fetched during homepage hydration — `dynamic` with
                ssr:false keeps it off the server, but it still loads the
                moment this section mounts, which is while the hero is still
                settling, for a section below the fold.

                The answer to that was a drawn stand-in from the same
                coordinates and road geometry, upgraded on click. It was
                accurate and it was still a picture of a map: no streets
                around the sites, nothing to pan, and no answer to "what is
                near this charger", which is the question someone looking at a
                station finder actually has. So it is gone.

                Instead the real map is built as the reader arrives at it. An
                observer with 400px of lead time means the tiles are usually
                there before the section is, nobody who never scrolls this far
                pays for it, and what you get when you do is OpenStreetMap
                rather than a drawing of it. */}
            <div ref={mapRef} className="h-full">
              {mapNear ? (
                <StationMap
                  stations={searchResults || visibleStations}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  userLocation={userLocation}
                  className="h-full"
                />
              ) : (
                <p className="grid h-full place-items-center text-caption text-white/55">
                  Map loads as you reach it
                </p>
              )}
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
          {/* Was "What's nearby, delivered to your car". Nothing in the list
              below is delivered — they are independent businesses near the
              station, and delivery is not a service we run yet anywhere. */}
          <h3 className="text-h3 text-ink-900 mb-1">
            What&apos;s nearby
          </h3>
          <p className="text-body-sm text-ink-500 mb-6">
            Near {selected.name} · {selected.city}, {selected.state}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Coffee */}
            <motion.div whileHover={{ y: -4 }} className="card-light p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center">
                  <Coffee className="h-5 w-5 text-ink-700" />
                </div>
                <h4 className="font-semibold text-ink-900">Coffee & Tea</h4>
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
                    className="flex items-center justify-between glass-light rounded-lg px-4 py-3 border border-paper-300 hover:border-brand/40 transition-colors"
                  >
                    <span className="text-ink-700">{place.name}</span>
                    <span className="text-ink-400 text-body-sm">{place.walk} walk</span>
                    <span className="sr-only"> (opens in a new tab)</span>
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
                <h4 className="font-semibold text-ink-900">Food & Dining</h4>
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
                    className="flex items-center justify-between glass-light rounded-lg px-4 py-3 border border-paper-300 hover:border-brand/40 transition-colors"
                  >
                    <span className="text-ink-700">{place.name}</span>
                    <span className="text-ink-400 text-body-sm">{place.walk} walk</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Retail */}
            <motion.div whileHover={{ y: -4 }} className="card-light p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-ink-700" />
                </div>
                <h4 className="font-semibold text-ink-900">Shopping & More</h4>
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
                    className="flex items-center justify-between glass-light rounded-lg px-4 py-3 border border-paper-300 hover:border-brand/40 transition-colors"
                  >
                    <span className="text-ink-700">{place.name}</span>
                    <span className="text-ink-400 text-body-sm">{place.walk} walk</span>
                    <span className="sr-only"> (opens in a new tab)</span>
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
              More locations coming soon
            </h3>
            <p className="text-ink-500 mb-6 max-w-[52ch]">
              {/* This sat directly above a list containing Round Rock, which
                  is in Texas. The city is a real planned location, so the
                  sentence was the thing that was wrong. */}
              We&apos;re opening more locations. Enter your email to be notified
              when we open near you.
            </p>
            <p className="text-caption text-ink-400 mb-3">
              Which area are you waiting on?
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {upcomingLocations.map(({ city, state }) => {
                /* Named with its state now. The comment further up this file
                   already flagged that this list contains Round Rock, which
                   is in Texas, while the heading above it implied one region —
                   the data can finally say so itself. */
                const location = `${city}, ${state}`;
                const active = wantedLocations.includes(location);
                return (
                  <button
                    key={location}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleWanted(location)}
                    className={`rounded-full border px-4 py-2 text-body-sm transition-colors ${
                      active
                        ? "border-brand bg-brand text-ink-900"
                        : "border-paper-300 text-ink-600 hover:border-brand/50"
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
                    ? "border-brand bg-brand text-ink-900"
                    : "border-paper-300 text-ink-600 hover:border-brand/50"
                }`}
              >
                {SOMEWHERE_ELSE}
              </button>
            </div>
            {notifyDone ? (
              <p className="text-ok-ink font-medium">
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
                  autoComplete="email"
                  aria-label="Email address for new-location updates"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="field flex-1 px-4 py-3"
                />
                <motion.button
                  type="submit"
                  disabled={notifySending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-brand hover:bg-brand-hover disabled:opacity-60 text-ink-900 font-semibold rounded-lg transition-colors"
                >
                  {notifySending ? "Sending…" : "Notify Me"}
                </motion.button>
              </form>
            )}
            {notifyError && (
              <p role="alert" className="text-body-sm text-error-ink mt-2">
                {notifyError}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
