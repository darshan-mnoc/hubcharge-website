# HubCharge — image prompt sheet

26 prompts, one per image slot on the site. Plain prose: paste into any
generator and add your own flags if it wants them.

Written against the real photographs of the Alhambra unit, so the machine in
every prompt is the machine you actually own.

---

## Before you start — two rules

### 1. Every charger carries the HubCharge logo — the generator does not draw it

**The goal is that every unit in every image is unmistakably a HubCharge
product.** A driver who has seen the wordmark on the site should recognise the
machine when they pull up to it. That is what earns the trust.

The generator cannot be the one to put it there. Ask an image model for
lettering and you get what is on the site today: **HUB⊂NARGE** on the
homepage, *"FTZT CKARGING & MITE SAIAVETIVE"* where the tagline should be on
six guide pages, and cable labels reading **CGOL** and **BMPL** instead of
CCS1 and NACS. A misspelt company name destroys more trust than an unbranded
charger ever would.

So it is a two-step job:

**Step 1 — generate.** Every prompt asks for the unit with a **clean blank
panel** in the place the logo belongs, correctly lit and in correct
perspective. That panel is a placeholder, not a design decision.

**Step 2 — composite.** The real wordmark goes onto that panel afterwards from
`public/images/hubcharge-logo.webp`, which has a clean alpha channel, warped
to match the panel's perspective and dimmed to match its lighting. Every unit
ends up branded, and correctly spelt every time.

**Ask me and I will do the compositing pass** — I have the logo with alpha and
can perspective-match it to each panel.

Where a unit sits far enough back that no lettering would be legible anyway,
the prompt says *"too distant for any text to read"* — a smudge in the right
place reads as a logo at that size, and inventing letters there only risks
gibberish.

**Check every delivered image at 100% zoom on the unit before you accept it.**
A thumbnail will not show you a mangled company name. That is exactly how the
current ones got through.

### 2. Generate at the slot's own aspect

The guide mastheads today are 1200×967 (1.24:1) dropped into a 3:2 box, so a
third of every one is thrown away and nobody chose which third. Each prompt
below states its target size. Match it.

---

## The House Style block

**Prepend this to every prompt.**

> Photographic, not illustrated or 3D-rendered. Southern California, natural
> daylight. The charger is a freestanding DC fast-charging unit about 2 metres
> tall in a champagne-beige powder-coated steel cabinet with softly rounded
> top edges. Its front carries, from top to bottom: a clean blank rectangular
> panel where the brand logo will be added afterwards, two short horizontal
> green status bars glowing side
> by side, a portrait-orientation touchscreen, and a small black contactless
> card reader below that. Two thick black charging cables hang from moulded
> holsters on the lower front — one on the left, one on the right. Yellow
> steel bollards stand either side of the unit. Colour palette: warm orange
> accents, deep navy, warm neutrals. Realistic depth of field, believable
> shadows, no lens flare.

## The Negative block

**Append this to every prompt.**

> No text, no lettering, no logos, no signage, no numbers anywhere in the
> image. No watermarks. No star ratings, award badges, certification marks or
> price displays. No distorted hands or faces, no extra fingers, no extra
> limbs. No cable that does not physically connect to something. No floating
> UI elements or app screenshots overlaid on the scene.

## Five accuracy rules

These come from the claims discipline the rest of the site already follows.
Breaking them makes the picture contradict the copy next to it.

1. **Every charger is a HubCharge charger.** If a unit appears, it gets the
   logo in step 2. An unbranded charger on a HubCharge page is a competitor's
   machine as far as the reader knows.
2. **Both cables must be visible on every unit.** Every page promises the
   station carries both. A unit with one cable makes the page a liar.
3. **No price on the charger screen.** The rate lives in exactly one place on
   this site and an image is not it.
4. **No Nissan Leaf plugged in.** 2011–2025 Leafs use CHAdeMO and cannot
   charge here. Five pages say so.
5. **No invented trust marks.** No review stars, no certification badges, no
   "rated #1" anything. There is no fabricated social proof on this site.

---

# Guide mastheads · 18 images

**Target: 1800 × 1200 (3:2 landscape).** Dropped into a `16/10` box on mobile
and `3/2` on desktop, so keep the subject centred and leave air top and bottom.

---

### 1. `guide-can-my-ev-charge-here.webp`
**Page:** Can my EV charge at HubCharge? · **Answers:** "almost certainly yes"

> A three-quarter rear view of a modern electric crossover parked at the
> charger with its charge-port flap open on the rear wing, the port itself
> catching the light. Both cables clearly visible on the unit behind. Late
> afternoon, low warm sun. Reassuring and ordinary, not dramatic.

**Alt:** An electric car parked at a HubCharge charger with its charging port open.

---

### 2. `guide-new-ev-owner.webp`
**Page:** Just got an EV? Start here · **Answers:** the first month

> A woman in her thirties standing beside her new electric car at the charger,
> phone in hand, looking at the car's open charge port with the mild
> concentration of someone doing something for the first time. Relaxed, not
> anxious. Morning light. The unit is behind her with both cables holstered.

**Alt:** A new EV owner at a HubCharge charger, phone in hand, looking at her car's charging port.

---

### 3. `guide-connectors.webp`
**Page:** NACS vs CCS, explained · **Answers:** which cable do I grab

> Close crop on the lower front of the charger where the two cables hang in
> their holsters, shot straight on. Both connector handles clearly separate
> and distinguishable — the left one visibly chunkier than the right. Shallow
> depth of field, background softly out of focus. Panel above is blank.

**Alt:** The two charging cables hanging in their holsters on a HubCharge unit.

---

### 4. `guide-charging-levels.webp`
**Page:** Charging levels, explained · **Answers:** three speeds

> The charger seen from a low angle against open evening sky, its two green
> status bars glowing, both cables hanging. Sense of scale and solidity — this
> is the fast one. No people. Blue hour, unit lit from its own screen glow.

**Alt:** A HubCharge DC fast charger at dusk, status lights green.

---

### 5. `guide-charging-speed.webp`
**Page:** How long does charging take? · **Answers:** quickest when empty, slows near full

> A cable connected to a car's charge port in tight close-up, the connector
> seated and locked, a soft ring of light around the port. Everything else
> falls away into shallow focus. Conveys energy moving. No screen visible.

**Alt:** A charging cable seated and locked into an electric car's port.

---

### 6. `guide-charging-cost.webp`
**Page:** What does charging cost? · **Answers:** priced by time, seen before you start

> A driver sitting in the driver's seat with the door open, one foot on the
> ground, holding a phone and looking at it calmly while the car charges
> behind them. Warm interior light. The phone screen is dark and unreadable —
> no interface visible. Charger with both cables in the background.

**Alt:** A driver checking their phone beside their charging car.

---

### 7. `guide-vehicles.webp`
**Page:** Charging guides by make · **Answers:** which plug your make uses

> Three different electric cars — a saloon, a crossover and a pickup, all
> different colours and clearly different makes but no badges legible — parked
> in a row of charging bays. Wide, even, catalogue-like. Midday light.

**Alt:** Three different electric vehicles parked in a row of HubCharge charging bays.

---

### 8. `guide-etiquette.webp`
**Page:** Charging etiquette · **Answers:** move when done, don't fill to the top

> Two charging bays side by side: one occupied by a car mid-charge, the other
> empty and clean with its cable neatly rehung in the holster. The empty bay
> is the subject. Tidy, well-kept, considerate. Overcast soft light.

**Alt:** Two HubCharge bays, one in use and one free with its cable neatly rehung.

---

### 9. `guide-weather.webp`
**Page:** Charging in hot and cold weather · **Answers:** cold slows charging by half

> Cold clear winter morning. An electric car at the charger with light frost
> on its windscreen and roof, breath visible in the air, long low sun casting
> hard shadows. Both cables on the unit. Crisp, blue-shadowed, genuinely cold.

**Alt:** An electric car charging on a frosty winter morning.

---

### 10. `guide-battery-health.webp`
**Page:** Fast charging and battery health · **Answers:** far less harm than feared

> A clean modern electric car parked at the charger in a shaded structure,
> cool even light, no glare, no heat haze. Calm and unhurried — the visual
> opposite of stress. One cable connected, the other holstered.

**Alt:** An electric car charging in the cool shade of a parking structure.

---

### 11. `guide-home-vs-public.webp`
**Page:** Home charging vs public charging · **Answers:** do both

> Split-feel composition: a suburban driveway at dusk with a small wall-mounted
> home charging box on the garage wall and a car parked in front of it, warm
> light from the house windows. Domestic, quiet, end of the day.

**No HubCharge unit in this one, deliberately** — this half of the comparison
is home charging. The public half is carried by the other 25 images.

**Alt:** An electric car parked on a suburban driveway beside a home wall charger.

---

### 12. `guide-apartment-charging.webp`
**Page:** Charging an EV without a driveway · **Answers:** you don't need one

> A residential street at night lined with parked cars outside low-rise
> apartment buildings, warm windows above, streetlights overhead. One electric
> car among the parked cars. No charger anywhere.

**No HubCharge unit in this one, deliberately** — the guide's point is that
you have nowhere to plug in at home. Showing a charger here would contradict
the page.

**Alt:** Cars parked on a residential apartment street at night.

---

### 13. `guide-charging-troubleshooting.webp`
**Page:** When charging goes wrong · **Answers:** unplug, wait, try again

> A person's hands lifting a charging connector out of its holster on the
> unit, mid-motion, shot from slightly behind their shoulder. Practical and
> matter-of-fact. Hands must be anatomically correct and clearly in contact
> with the connector handle. Daylight, no drama.

**Alt:** Hands lifting a charging connector from its holster on a HubCharge unit.

---

### 14. `guide-rideshare-drivers.webp`
**Page:** Charging for rideshare and delivery drivers · **Answers:** charge during breaks you already take

> An electric saloon charging in a bay while its driver stands a few steps
> away with a coffee, checking a phone, jacket on, clearly between jobs.
> Early morning, long shadows, city edge. Both cables visible on the unit.

**Alt:** A rideshare driver taking a break with a coffee while their car charges.

---

### 15. `guide-road-trip.webp`
**Page:** Planning an EV road trip · **Answers:** plan around stops you want anyway

> A wide open highway heading east through dry Southern California scrubland
> toward distant hazy mountains, an electric car in the middle distance
> travelling away from camera. Big sky, midday, sense of distance. At the
> roadside in the near foreground, a charging station canopy with two units
> beneath it, side on — close enough to read as a real station, too distant
> for any text to be legible.

**Alt:** An electric car on an open highway heading east through dry hills.

---

### 16. `guide-socal-charging.webp`
**Page:** Charging across Southern California · **Answers:** two corridors, we sit on both

> Elevated view of a multi-lane freeway curving through low hills with palm
> trees along the shoulder, traffic flowing, mountains and a hazy warm sky
> beyond. Unmistakably Southern California. Late afternoon golden light. Just
> off the freeway on the near side, a small charging forecourt with two units
> under a canopy, clearly part of the scene, too distant for any text to read.

**Alt:** A Southern California freeway curving east through low hills.

---

### 17. `guide-ev-incentives-california.webp`
**Page:** EV incentives in California · **Answers:** what's actually still open

> A person at a kitchen table in daylight with a laptop open and a coffee,
> working through something administrative, an electric car visible through
> the window behind them on the driveway. Domestic, organised, unhurried.
> Laptop screen not legible.

**No HubCharge unit in this one** — the subject is paperwork at home, and
parking a charger in the kitchen window would be an obvious plant.

**Alt:** Someone at a kitchen table with a laptop, their electric car visible outside.

---

### 18. `guide-glossary.webp`
**Page:** EV charging glossary · **Currently has no image at all**

> The charger's portrait touchscreen and the contactless reader below it in
> tight close-up, shot at a slight angle, the screen glowing softly but its
> content completely illegible and abstract. Clean, technical, calm. Detail
> of a machine.

**Alt:** Close view of the screen and card reader on a HubCharge charger.

---

# Homepage · 3 images

### 19. `home.webp` — the hero
**Target: 2400 × 1000 (2.4:1).** Full-bleed behind the h1 and spec bar.

**This is the most important image on the site and the only generated one
doing real work.** A commissioned photograph of your actual canopy would beat
anything here.

Type sits over the **left third** and the spec bar over the **bottom edge**,
both in white on a navy scrim. Keep the left third and the bottom strip
visually quiet — no faces, no high-contrast detail there.

> A HubCharge forecourt at dusk under a broad modern canopy with warm light
> washing its underside. Three or four electric cars charging beneath it,
> seen at a slight angle from the front-right. Wet-looking dark tarmac
> reflecting the canopy light. Deep blue evening sky above. Calm, premium,
> unhurried — the feeling of a place you would happily wait five minutes.
> Cars are generic and badgeless. Left third of the frame is open sky and
> shadow with no detail. Too distant for any text to read.

**Alt:** A HubCharge station at dusk, cars charging beneath a lit canopy.

**Check after replacing:** the h1 and spec bar contrast over the new plate.
The scrim was tuned to the old image and is not guaranteed to hold.

---

### 20. `story-attendant.webp` — replaces `valet-greet-v2.webp`
**Target: 1200 × 1500 (4:5 portrait).** Homepage story section.

> A uniformed attendant in a dark waistcoat and white shirt leaning slightly
> toward an open driver's window, mid-conversation with the driver, relaxed
> and friendly. The car is connected to the charger behind them — the cable
> visibly running from the unit to the car's port, not holstered. Late
> afternoon. Both figures clearly and correctly rendered. Unit panel blank.

**Alt:** A HubCharge attendant at the driver's window while the car charges behind them.

**Why replaced:** the current image says **HUB⊂NARGE** on the unit, and the
car is not actually plugged in despite the alt text saying it is charging.

---

### 21. `story-plugging-in.webp` — replaces `charging-service-v2.webp`
**Target: 1200 × 1500 (4:5 portrait).**

> An attendant crouched at the rear wing of an electric car, both hands
> guiding the charging connector into the car's port, concentrating on the
> job. Shot from the side at car height. The connector is clearly seated in
> the port. Hands anatomically correct. Warm daylight, shallow depth of field.

**Alt:** An attendant connecting the charging cable to a car.

**Why replaced:** the tagline on the unit currently reads *"FTZT CKARGING &
MITE SAIAVETIVE"* — and this image is the masthead for six guides as well.

---

# Lifestyle destination cards · 4 images

**Target: 1000 × 1250 (4:5 portrait).** Rendered in a tall card at
`min-h-[280px]`, cropped to fill. Keep the subject in the vertical centre.

The point of these four is *what you do with the ten minutes*, so the
destination should lead and the charging should be secondary.

### 22. `lifestyle-coffee.webp`
> A warm independent coffee shop interior seen from just inside the door,
> afternoon light through the front window, a barista at the machine and one
> or two people at tables. Through the window, an electric car is parked at a
> charger across the way, small and out of focus. Inviting and specific.

**Alt:** A coffee shop a short walk from a HubCharge station.

### 23. `lifestyle-food.webp`
> A casual counter-service restaurant at lunchtime, a tray of fresh food being
> set down on a table by the window, natural light, people eating in the
> background. Warm and appetising. Through the window behind, an electric car
> is charging at a station unit across the forecourt — clearly in shot, softly
> out of focus. No legible menu boards or signage.

**Alt:** A restaurant a short walk from a HubCharge station.

### 24. `lifestyle-groceries.webp`
> An attendant in a dark uniform with orange trim lifting two paper grocery
> bags into the open boot of an electric estate car, the charging cable
> connected and running to the unit beside it. Late afternoon, supermarket
> forecourt. Hands correct, bags substantial. No store signage legible.

**Alt:** Groceries being loaded into a car while it charges at HubCharge.

### 25. `lifestyle-services.webp`
> An attendant in a dark uniform with orange trim wiping down the windscreen
> of a light-coloured electric car with a microfibre cloth, the car connected
> and charging. Clean, careful, unhurried. Shaded forecourt, even light.

**Alt:** An attendant cleaning a car's windscreen while it charges.

---

# Social share card · 1 image

### 26. `og.jpg`
**Target: 1200 × 630 (1.91:1).** JPEG, not WebP — some platforms still refuse
WebP. Appears when the site is shared on WhatsApp, iMessage, LinkedIn, Slack.

Renders as small as **360px wide** in a chat preview. Keep it simple enough to
read at thumbnail size.

> A single HubCharge charging unit and one electric car connected to it,
> centred, shot at a slight three-quarter angle against a clean uncluttered
> background at dusk. Both cables visible. Strong clear silhouette that stays
> legible when shrunk. Warm orange accent light against deep navy blue.
> Generous empty space around the subject. Panel blank.

**Alt:** A HubCharge DC fast charging station with a car connected.

---

# Do not regenerate these

Ten assets are **real photographs of your own hardware**. They are more
convincing than any render and two pages depend on them directly.

| File | What it is |
|---|---|
| `alhambra-station.webp` | Your Alhambra unit, wide |
| `alhambra-charger.webp` | Alhambra unit straight on, CCS1 and NACS labelled |
| `alhambra-unit.webp` | Alhambra unit, three-quarter |
| `alhambra-connectors.webp` | Close on the connectors and card reader |
| `alhambra-bay.webp` | The bay with a car alongside |
| `alhambra-wide.webp` | The bay from across the structure |
| `alhambra-holsters.webp` | Crop of the above — **the connectors guide is built on this** |
| `fontana-station.webp` | Red Model Y at Fontana Nissan |
| `fontana-charging.webp` | Model Y connected at Fontana |
| `fontana-forecourt.webp` | The Fontana forecourt |
| `charging-service.webp` | **The real product screenshot** in the phone frame |

Also excluded: `hubcharge-logo.webp` and `hubcharge-logo-on-dark.webp`.

---

# Two photographs that would beat every prompt here

Neither needs a photographer — a phone at the Alhambra station will do.

1. **Each connector, lifted out of its holster and shot head-on at its
   business end.** Two photos. The connectors guide currently shows my
   drawings of the plug faces because every photo we have is of them holstered
   nose-into-the-wall. Real faces would replace those immediately.

2. **The Fontana units as they stand today.** Both current Fontana photos show
   "Charging Service Coming Soon" signage, and `lib/stations.ts` says
   `chargers: 1` while the photos show two.

---

# Checklist before accepting any image

- [ ] Zoomed to 100% on the unit — no lettering anywhere, mangled or otherwise
- [ ] Both cables visible
- [ ] No price, no badges, no stars, no certification marks
- [ ] Hands and faces correct at full size
- [ ] Every cable physically connects to something
- [ ] Generated at the stated aspect, not cropped down from another shape
- [ ] Under 150 KB as WebP at quality 82–88
- [ ] Alt text rewritten to describe what the image actually shows
