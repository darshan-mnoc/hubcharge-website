# HubCharge — Off-Site Local SEO Playbook

The website is now structured for search (real URLs per location, per-page
metadata, structured data). But for "EV charging near me" searches, **the
Google Maps pack and EV driver apps decide who gets found — not blue links.**
This checklist is the other 60–70% of the work. Everything here is free
except where noted; most items take under an hour.

**Golden rule — NAP consistency:** Name, Address, Phone must be
*character-identical* everywhere (site, Google, PlugShare, Apple…).
Canonical values to copy-paste (also in `lib/stations.ts`):

| | Alhambra | Fontana | Round Rock |
|---|---|---|---|
| Name | HubCharge Alhambra | HubCharge at Fontana Nissan | HubCharge Round Rock |
| Address | 188 S Monterey St, Unit 108, Alhambra, CA 91801 | 16444 S Highland Ave, Fontana, CA 92336 | 2081 Double Creek Dr, Round Rock, TX 78664 |
| Phone | (949) 392-8755 | (949) 392-8755 | (949) 392-8755 |
| Hours | Daily 6:00 AM – 10:00 PM | Daily 6:00 AM – 10:00 PM | *not open yet* |
| URL | https://hubcharge.com/locations/alhambra | https://hubcharge.com/locations/fontana | https://hubcharge.com/locations/round-rock |

**Company office:** Micronoc Inc. (HubCharge), 188 S Monterey St, Unit 108,
Alhambra, CA 91801 · info@micronocinc.com · (949) 392-8755 — the same building
as the Alhambra site. Canonical copy lives in `lib/company.ts`.

⚠️ **Round Rock is not open.** List it only where a "coming soon" state
exists; an aggregator that shows it as live sends someone to a building site.

> This table was stale for a while: it recorded Alhambra as *108 S Monterey
> St, Unit 102* — wrong street number and wrong unit — and warned that Fontana
> had no street address long after it had one. It is the copy-paste source for
> the Google Business Profile, so a wrong value here propagates outward into
> every listing. Check it against `lib/stations.ts` and `lib/company.ts`
> whenever either changes.

---

## 1. Google Business Profile (highest priority — do this week)

Create/claim ONE profile PER STATION at https://business.google.com:

1. Primary category: **"Electric vehicle charging station"** (it exists — use it).
2. Fill: hours, phone, website (**link each profile to its own
   `/locations/<slug>` page**, not the homepage).
3. Check the pin placement on the map is exactly on the charger bays —
   fix with "Suggest an edit" if off (takes 24–48h).
4. Upload 8–10 real, geo-tagged photos: the bays, chargers with HUBCHARGE
   branding, the attendant at a car window, surroundings/entrance, night shots.
5. Attributes: payment types accepted, restroom/amenities if applicable.
6. Pre-seed the Q&A section yourself (you can post and answer): "Do I need
   an app?", "Can a Tesla charge here?", "Is there an attendant?"
7. Post monthly Google Posts (new services, hours changes, promos) — profile
   freshness is a ranking signal.

**Reviews are a top-3 map-pack ranking factor, and recency matters more
than volume.** Set up a steady trickle: print a QR code at each station
linking to the profile's review URL, and have attendants (politely, no
incentives — incentivized reviews violate both Google policy and the FTC
rule) invite happy customers to leave one.

*Note: real-time "available/in-use" status inside Google Maps requires the
Google EV data feed (GELFS) via an aggregator like EcoMovement, or OCPI
export from your charger-management backend. Worth asking your charger
vendor if they already support it — but it's optional at 2 stations. The
free GBP listing is the big win.*

## 2. PlugShare (the app EV drivers actually use)

1. Search both stations on https://plugshare.com — they may already exist
   from driver check-ins.
2. Claim/correct them, or add via "Add Station → Add Public Location".
3. Request the free **Operator Dashboard** (https://company.plugshare.com/cpo.html)
   to own the listings: photos, pricing description ("flat rate per session,
   shown before you plug in"), attendant note, connector types (NACS + CCS),
   kW, hours.
4. Respond to check-in comments — responsiveness shows in the app.

## 3. OpenChargeMap (feeds A Better Route Planner)

Add/verify both stations at https://openchargemap.org. ABRP — the trip
planner many EV drivers rely on — pulls its database from here; approved
listings flow into ABRP within a couple of days. Takes 15 minutes, almost
nobody does it. (ABRP also has a CPO program for live data:
https://abetterrouteplanner.com/business/cpos)

## 4. Apple Maps (Apple Business Connect)

https://businessconnect.apple.com → claim/create each location with charger
type, plugs, and power specs. Apple's EV routing uses this. Review takes a
few days.

## 5. ChargeHub + Chargeway

- ChargeHub: submit via the app's "Contribute" or the CPO form at
  https://solutions.chargehub.com/charging-point-operators
- Chargeway: submit missing stations through the app.

## 6. AFDC / NREL (also an SB 454 obligation)

California's Open Access Act expects charging providers to report fee
schedules and payment methods to the National Renewable Energy Laboratory's
Alternative Fuels Data Center. Submit/verify at
https://afdc.energy.gov/stations — this also feeds many third-party maps.

## 7. Simple local citations (30 min total)

Yelp, Bing Places, and Nextdoor business pages with the exact NAP above.
Don't buy citation packages — these four plus the EV-specific ones above
cover a 2-location operator.

---

## Ongoing (monthly, ~1 hour)

- 1 Google Post per profile
- Answer new GBP Q&A and reviews (respond to every review, good or bad)
- Check PlugShare check-ins and reply
- After any price/hours change: update site + GBP + PlugShare same day
  (the website price/hours must always match reality — SB 454)

## When a new station opens (Round Rock, West Covina…)

1. Add it to `lib/stations.ts` (the site auto-generates its page + sitemap entry)
2. Run this checklist for the new location
