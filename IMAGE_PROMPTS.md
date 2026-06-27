# HubCharge — Image Inventory & Generation Prompts (for Nano Banana)

Every photographic image currently used on the site, where it appears, how it's
displayed, the recommended output size, and a ready-to-use generation prompt.

> Keep the **exact same filenames** when you replace them (drop new files into
> `public/images/`) and the site will pick them up with no code changes.

---

## 🎨 Global style (paste this into EVERY prompt for a cohesive set)

> **Style:** ultra-photorealistic editorial commercial photography, premium
> automotive/tech brand campaign, cinematic dusk / golden-hour lighting, soft
> warm key light with cool navy ambient shadows, shallow depth of field,
> 35mm full-frame look, crisp and clean, high dynamic range, no text, no
> watermarks, no logos except where noted. Brand palette: **deep navy `#0A192F`**
> backgrounds with **warm orange `#FF7A00`** accent lighting/glow. Modern,
> upscale, trustworthy, "Apple-meets-EV" aesthetic. People look relaxed,
> affluent, genuine — not stocky or staged.

**Brand context:** _HubCharge_ is a premium **full-service** EV fast-charging
station. Uniformed attendants (dark polo, subtle orange accent) greet drivers,
plug in the car, and deliver coffee/food to the car window — the driver never
leaves their seat. Charging canopy is sleek, modern, well-lit, with `HUBCHARGE`
branded chargers (NACS + CCS connectors).

---

## 1. `home.png` — HERO background

- **Where:** Top hero, full-screen background (behind the headline).
- **Displayed:** Full-bleed, darkened ~40% with a navy gradient overlay; text sits centered on top.
- **Current size:** 1408×768 (16:9). **Generate:** **1920×1080 (16:9 landscape).**
- **Composition note:** keep the center/edges slightly darker / uncluttered so white headline text stays readable.

**Prompt:**

> A wide cinematic hero shot of a premium modern EV charging hub at dusk. A sleek
> architectural charging canopy with warm orange under-glow lighting, two or three
> elegant electric cars (e.g. a white SUV and a dark sedan) parked at branded fast
> chargers. A uniformed attendant in a dark polo stands beside one car. Glowing
> orange accent lights, polished concrete, soft reflections on the cars, deep navy
> twilight sky. Spacious, calm, upscale. Negative space and gentle darkening toward
> the center for text overlay. _[+ > **Style:** ultra-photorealistic editorial commercial photography, premium
> > automotive/tech brand campaign, cinematic dusk / golden-hour lighting, soft
> > warm key light with cool navy ambient shadows, shallow depth of field,
> > 35mm full-frame look, crisp and clean, high dynamic range, no text, no
> > watermarks, no logos except where noted. Brand palette: **deep navy `#0A192F`**
> > backgrounds with **warm orange `#FF7A00`** accent lighting/glow. Modern,
> > upscale, trustworthy, "Apple-meets-EV" aesthetic. People look relaxed,
> > affluent, genuine — not stocky or staged.]_

---

## 2. `waiting-v3.png` — "Traditional Charging" (the BAD experience)

- **Where:** Problem section → left comparison card ("Traditional Charging").
- **Displayed:** Landscape crop ~16:9, dark gradient at bottom.
- **Current size:** 3832×5741 (portrait). **Generate:** **1536×1024 (3:2 landscape).**
- **Mood:** dull, tedious, isolating — the contrast to HubCharge.

**Prompt:**

> A lone person standing bored beside their electric car at a generic, ordinary
> public EV charger in a bland parking lot, checking their phone while they wait.
> Overcast flat lighting, cold grey concrete, no staff, a little tired and tedious
> in mood. Realistic, slightly desaturated, documentary feel. No branding.
> _[+ > **Style:** ultra-photorealistic editorial commercial photography, premium
> > automotive/tech brand campaign, cinematic dusk / golden-hour lighting, soft
> > warm key light with cool navy ambient shadows, shallow depth of field,
> > 35mm full-frame look, crisp and clean, high dynamic range, no text, no
> > watermarks, no logos except where noted. Brand palette: **deep navy `#0A192F`**
> > backgrounds with **warm orange `#FF7A00`** accent lighting/glow. Modern,
> > upscale, trustworthy, "Apple-meets-EV" aesthetic. People look relaxed,
> > affluent, genuine — not stocky or staged., but muted — cooler and less glamorous to contrast the premium shots]_

---

## 3. `valet-greet-v2.png` — Attendant greeting (the GOOD experience)

- **Where:** (a) Problem section → right comparison card ("HubCharge"); (b) "How It Works" step **01 — Arrive & Relax**.
- **Displayed:** Landscape crop, dark gradient at bottom.
- **Current size:** 921×1152 (4:5). **Generate:** **1536×1024 (3:2 landscape).**

**Prompt:**

> A friendly uniformed HubCharge attendant (dark polo with a subtle orange accent)
> warmly greeting a relaxed driver who stays seated in their premium electric car,
> window down, at a sleek modern charging station with a branded fast charger.
> Golden-hour light, warm orange glow from the charging canopy, welcoming and
> upscale. Eye-level, shallow depth of field. _[+ > **Style:** ultra-photorealistic editorial commercial photography, premium
> > automotive/tech brand campaign, cinematic dusk / golden-hour lighting, soft
> > warm key light with cool navy ambient shadows, shallow depth of field,
> > 35mm full-frame look, crisp and clean, high dynamic range, no text, no
> > watermarks, no logos except where noted. Brand palette: **deep navy `#0A192F`**
> > backgrounds with **warm orange `#FF7A00`** accent lighting/glow. Modern,
> > upscale, trustworthy, "Apple-meets-EV" aesthetic. People look relaxed,
> > affluent, genuine — not stocky or staged.]_

---

## 4. `charging-service-v2.png` — Attendant plugging in the car

- **Where:** (a) Problem step **02 — We Handle Charging**; (b) Problem dark band background; (c) Contact section background; (d) Fleet section background (component currently commented out).
- **Displayed:** Both as a card photo AND as a full-bleed darkened background → keep it readable under a heavy navy overlay.
- **Current size:** 921×1152. **Generate:** **1920×1080 (16:9 landscape)** (it doubles as a background).

**Prompt:**

> A uniformed HubCharge attendant plugging a charging cable into a modern electric
> SUV at a premium charging station, the driver relaxed inside the car. A branded
> `HUBCHARGE` fast charger with a softly glowing screen. Cinematic dusk lighting,
> warm orange accent glow against deep navy shadows, polished surfaces, professional
> and trustworthy. Leave one side darker / less busy for text overlay. _[+ > **Style:** ultra-photorealistic editorial commercial photography, premium
> > automotive/tech brand campaign, cinematic dusk / golden-hour lighting, soft
> > warm key light with cool navy ambient shadows, shallow depth of field,
> > 35mm full-frame look, crisp and clean, high dynamic range, no text, no
> > watermarks, no logos except where noted. Brand palette: **deep navy `#0A192F`**
> > backgrounds with **warm orange `#FF7A00`** accent lighting/glow. Modern,
> > upscale, trustworthy, "Apple-meets-EV" aesthetic. People look relaxed,
> > affluent, genuine — not stocky or staged.]_

---

## 5. `coffee-delivery-v3.png` — Coffee/food delivered to the window

- **Where:** (a) Lifestyle section → "Services delivered to your car" card image; (b) Problem step **03 — Get Things Done**.
- **Displayed:** Rounded card image AND landscape card crop.
- **Current size:** 921×1152. **Generate:** **1280×1280 (square)** _(used in a square-ish card)_ — or 3:2 if you prefer.

**Prompt:**

> A HubCharge attendant handing a tray with a takeaway coffee cup and a small food
> bag to a smiling driver through the open window of a premium electric car, while
> the car charges at a sleek station in the background. Warm golden-hour light,
> cozy and convenient mood, orange brand accents, shallow depth of field, premium
> lifestyle feel. _[+ > **Style:** ultra-photorealistic editorial commercial photography, premium
> > automotive/tech brand campaign, cinematic dusk / golden-hour lighting, soft
> > warm key light with cool navy ambient shadows, shallow depth of field,
> > 35mm full-frame look, crisp and clean, high dynamic range, no text, no
> > watermarks, no logos except where noted. Brand palette: **deep navy `#0A192F`**
> > backgrounds with **warm orange `#FF7A00`** accent lighting/glow. Modern,
> > upscale, trustworthy, "Apple-meets-EV" aesthetic. People look relaxed,
> > affluent, genuine — not stocky or staged.]_

---

## 6–9. Lifestyle service tiles (4 matching images)

- **Where:** Lifestyle section (`lifestyle-coffee-v2` also used as the section's faint background).
- **Displayed:** Card thumbnails / faint full-bleed background.
- **Current size:** 921×1152 each. **Generate:** **1536×1024 (3:2 landscape)** for a consistent set.
- **Keep all four visually consistent** (same lighting, same world) so the grid looks like one campaign.

### 6. `lifestyle-coffee-v2.png` — Coffee & drinks

> Beautifully styled specialty coffee, boba and iced drinks on a tray being
> delivered to a car window at a premium EV charging station at golden hour.
> Warm, inviting, fresh. Orange brand accents in the background. _[+ > **Style:** ultra-photorealistic editorial commercial photography, premium
> > automotive/tech brand campaign, cinematic dusk / golden-hour lighting, soft
> > warm key light with cool navy ambient shadows, shallow depth of field,
> > 35mm full-frame look, crisp and clean, high dynamic range, no text, no
> > watermarks, no logos except where noted. Brand palette: **deep navy `#0A192F`**
> > backgrounds with **warm orange `#FF7A00`** accent lighting/glow. Modern,
> > upscale, trustworthy, "Apple-meets-EV" aesthetic. People look relaxed,
> > affluent, genuine — not stocky or staged.]_

### 7. `lifestyle-food-v2.png` — Food & meals

> An appetizing fresh meal / gourmet takeaway being handed to a driver at their
> car window while the EV charges. Warm appetizing lighting, premium casual-dining
> feel, modern charging station softly blurred behind. _[+ > **Style:** ultra-photorealistic editorial commercial photography, premium
> > automotive/tech brand campaign, cinematic dusk / golden-hour lighting, soft
> > warm key light with cool navy ambient shadows, shallow depth of field,
> > 35mm full-frame look, crisp and clean, high dynamic range, no text, no
> > watermarks, no logos except where noted. Brand palette: **deep navy `#0A192F`**
> > backgrounds with **warm orange `#FF7A00`** accent lighting/glow. Modern,
> > upscale, trustworthy, "Apple-meets-EV" aesthetic. People look relaxed,
> > affluent, genuine — not stocky or staged.]_

### 8. `lifestyle-groceries-v2.png` — Groceries & errands

> A neat paper grocery bag with fresh produce and essentials being delivered to a
> car window at a premium EV charging station. Clean, convenient, upscale errand-run
> feel, warm light, orange accents in the soft background. _[+ > **Style:** ultra-photorealistic editorial commercial photography, premium
> > automotive/tech brand campaign, cinematic dusk / golden-hour lighting, soft
> > warm key light with cool navy ambient shadows, shallow depth of field,
> > 35mm full-frame look, crisp and clean, high dynamic range, no text, no
> > watermarks, no logos except where noted. Brand palette: **deep navy `#0A192F`**
> > backgrounds with **warm orange `#FF7A00`** accent lighting/glow. Modern,
> > upscale, trustworthy, "Apple-meets-EV" aesthetic. People look relaxed,
> > affluent, genuine — not stocky or staged.]_

### 9. `lifestyle-services-v2.png` — Car care / services

> A professional gently detailing / wiping down a sleek electric car at a premium
> charging station while it charges, subtle orange brand accents, clean and crisp,
> "white-glove service" feel, golden-hour light. _[+ > **Style:** ultra-photorealistic editorial commercial photography, premium
> > automotive/tech brand campaign, cinematic dusk / golden-hour lighting, soft
> > warm key light with cool navy ambient shadows, shallow depth of field,
> > 35mm full-frame look, crisp and clean, high dynamic range, no text, no
> > watermarks, no logos except where noted. Brand palette: **deep navy `#0A192F`**
> > backgrounds with **warm orange `#FF7A00`** accent lighting/glow. Modern,
> > upscale, trustworthy, "Apple-meets-EV" aesthetic. People look relaxed,
> > affluent, genuine — not stocky or staged.]_

---

## Not regenerating (logos / icons — leave as-is unless you want them redone)

- `hubcharge-logo.png` — brand logo (nav + footer).
- `CCS.png`, `NACS.png` — connector icons (not currently shown on the page; the trust band was removed).

---

## Tips for a cohesive result

1. Generate **all of them in one session** with the same Global style block so lighting/mood match.
2. Most slots get **cropped to landscape and darkened** — keep the subject roughly centered with breathing room, and avoid important detail in the far corners.
3. Backgrounds (`home`, `charging-service-v2`, `lifestyle-coffee-v2`) sit under a **dark navy overlay** — a slightly brighter, higher-contrast image reads better there.
4. Export as **PNG or high-quality JPG**, same filename, into `public/images/`. (If you switch a `.png` to `.jpg`, tell me and I'll update the 1–2 code references.)
