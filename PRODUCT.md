# Product constraints

Durable context that is **not derivable from the code**. For design tokens see
`DESIGN.md`; for how the estimates are computed read `lib/charging-math.ts`.

## What this is

HubCharge (Micronoc Inc.) — full-service DC fast charging. A driver pulls up,
stays in the car, and pays from their phone's browser. No app, no account.

## Sites

| | Status |
|---|---|
| Alhambra, CA — `188 S Monterey St, Unit 108` | open. **Inside a parking structure**, which is why `lib/station-access.ts` exists |
| Fontana, CA — `16444 S Highland Ave` | open. Dealership forecourt, visible from the road |
| Round Rock, TX — `2081 Double Creek Dr` | announced, not built. Nothing on its page may use the present tense |

All three: up to 180 kW, NACS + CCS. `lib/stations.ts` is the single source of
truth and its name/address/phone must stay character-identical with the Google
Business Profile and aggregator listings.

Alhambra has **two physically different cabinets** — a cream HubCharge unit and
a dark Winline unit whose screen asks you to pick connector A or B. They are
described individually because "2 × 180 kW" does not help someone standing on
the deck looking for one.

## Claims discipline

Substantiation rules apply to every speed and range figure on this site.

- **Tested figures, never marketing peaks.** Cybertruck advertises 500 kW;
  measured 10–80% average is ~118 kW and the record carries the tested number
  with a note explaining the gap.
- **EPA efficiency, not WLTP** (WLTP flatters by 10–20%).
- **Every estimate runs through `simulateSession`** against a real charging
  curve, and every figure sits beside its assumptions — starting state of
  charge, temperature, preconditioned battery, unshared stall.
- **Nothing operational is invented.** `lib/station-access.ts` has every field
  optional and renders nothing when a field is unknown. A guessed parking level
  is worse than no parking level, because a driver acts on it.
- **No fabricated social proof.** There are no testimonials.
- **™ not ®** — registration is unverified.
- Legal pages are drafts pending counsel review.

## Pricing: no amounts on the site

**Decided, and reaffirmed on 2026-09-11 when the alternative was offered
explicitly.** Do not re-litigate.

The rate is real and known: `$12.50` for the first 10 minutes, `+$3` per
additional 5 minutes up to **four** times, with a `$30.00` card authorisation
at start. It appears in exactly one place — `public/images/charging-service.webp`,
a screenshot of the actual product UI — because showing the real screen is more
honest than describing it.

What the site publishes instead is the **structure**: a session is a base
period plus a bounded number of equal extensions, derived from
`Station.session` (`sessionSteps` / `sessionBreakdown` / `maxSessionMinutes` in
`lib/stations.ts`). That is printed on the charger, so it is checkable.

`Station.tariff` is the typed, deliberately unset slot that would reverse this.
Every surface that could print money already branches on it, so enabling
amounts is a data change and nothing else. Currency is formatted via
`toLocaleString`, never a literal `$`, so grepping for amounts stays meaningful.

## Services: today vs. limited vs. coming soon

`lib/services.ts` is the single source of truth. `today` means a driver can
count on it; `limited` exists but not at every site or hour and must never
appear without its caveat; `soon` is not bookable and must never be written in
the present tense.

Charging and browser payment are `today`. **Attendant service is `limited`.**
Coffee, food, errands and car care are all **`soon` — none of it has
launched anywhere.** The site-wide `<meta name="description">` asserted
delivery in the present tense on every route until this was fixed.

## Open questions for the owner

Still unknown, and absent from the site until answered:

1. **Alhambra** — garage entrance, parking level, stall numbers or zone,
   gate/ticket instructions, overhead clearance, what parking costs and whether
   charging validates it, attendant hours.
2. **Fontana** — the same, to whatever extent a forecourt needs it.
3. **Charger IDs** as shown on each unit's screen. The app shows `MBS_1`; which
   physical cabinet that is, and the second unit's ID, are unknown.
4. Whether the cream and Winline units differ in output. Both are seeded at
   180 kW and the average-power figure depends on it.
