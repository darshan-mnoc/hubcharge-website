import type { ReactNode } from "react";
import { WeatherImpact } from "@/components/weather-impact";

/**
 * Body copy for the prose guides, kept beside the registry so a guide is a
 * data entry plus a block of sections rather than a new bespoke page.
 *
 * Facts discipline throughout: figures capped to what up-to-180kW hardware
 * delivers, "up to" phrasing, and no claim we cannot stand behind.
 */
export type GuideSection = { heading: string; body: ReactNode };

export const GUIDE_BODIES: Record<string, GuideSection[]> = {
  etiquette: [
    {
      heading: "Move when you're done",
      body: (
        <>
          <p>
            The single rule that matters. A DC fast charger is a shared
            resource, and a finished car occupying one is the most common
            frustration in public charging. At HubCharge our attendant unplugs
            you at participating locations, so there is nothing to race back
            for — but at other networks, set a timer.
          </p>
        </>
      ),
    },
    {
      heading: "Don't charge to 100% at a fast charger",
      body: (
        <p>
          Past roughly 80% your car slows charging dramatically to protect the
          battery. Those last twenty percentage points can take as long as the
          first sixty, while someone waits. Charge what you need to reach your
          destination or your next stop, and go.
        </p>
      ),
    },
    {
      heading: "Never unplug someone else's car",
      body: (
        <p>
          Most EVs lock the connector while charging, and unplugging a stranger&rsquo;s
          car is the fastest way to start an argument in a car park. If a car
          looks finished and abandoned, the network&rsquo;s support number is on the
          charger.
        </p>
      ),
    },
    {
      heading: "Leave the space as you found it",
      body: (
        <p>
          Re-holster the cable rather than leaving it on the ground — a cable
          across the tarmac is a trip hazard and the connector is expensive.
          Park inside the lines so the next car can reach the plug.
        </p>
      ),
    },
    {
      heading: "Queue politely, and be honest about time",
      body: (
        <p>
          If someone is waiting, tell them roughly how long you need. Ten
          minutes is a very different wait from forty, and most people are
          happy to plan around a straight answer.
        </p>
      ),
    },
  ],

  weather: [
    {
      heading: "Cold is the bigger problem",
      body: (
        <p>
          A cold battery physically cannot accept charge as quickly. Below
          roughly 10°C you may see half the charging speed you get on a mild
          day, through no fault of the charger. This surprises people far more
          than it should, because nothing on the screen explains it.
        </p>
      ),
    },
    {
      heading: "See it on your own car",
      body: (
        <>
          <p>
            Drag the temperature and watch both penalties move. They are
            separate effects that compound: the stop takes longer{" "}
            <em>and</em> the miles you gained don&rsquo;t go as far.
          </p>
          <WeatherImpact />
        </>
      ),
    },
    {
      heading: "Preconditioning is the fix, and you control it",
      body: (
        <p>
          Most EVs will warm the battery on the way to a charger — but usually
          only if you navigate to that charger in the car&rsquo;s own
          navigation. Setting HubCharge as your destination before you set off
          is the single most effective thing you can do for charging speed in
          winter. Some cars also expose a manual &ldquo;precondition
          battery&rdquo; button.
        </p>
      ),
    },
    {
      heading: "Cold hits range too, separately",
      body: (
        <p>
          Heating the cabin draws real power, and a cold battery is less
          efficient. Expect meaningfully less range from the same charge in
          winter. Pre-heating the car while it is still plugged in uses grid
          power rather than battery.
        </p>
      ),
    },
    {
      heading: "Heat is gentler, but not free",
      body: (
        <p>
          In very hot weather the car may slow charging to keep the pack cool,
          particularly after sustained fast driving. Parking in shade helps,
          which is one reason our chargers sit under canopy.
        </p>
      ),
    },
  ],

  "battery-health": [
    {
      heading: "The short answer",
      body: (
        <p>
          Occasional DC fast charging is not something to worry about. Modern
          EVs actively manage temperature and current to protect the pack, and
          large fleet studies have generally found the effect of regular fast
          charging to be small compared with age and total mileage.
        </p>
      ),
    },
    {
      heading: "What actually matters more",
      body: (
        <ul>
          <li>
            <strong>Sitting at very high or very low charge.</strong> Leaving a
            car at 100% for days, or running it near empty routinely, is harder
            on a battery than fast charging is.
          </li>
          <li>
            <strong>Heat.</strong> Sustained high temperature is the most
            consistent factor in battery ageing.
          </li>
          <li>
            <strong>Time.</strong> Batteries age whether you drive or not.
          </li>
        </ul>
      ),
    },
    {
      heading: "A reasonable everyday habit",
      body: (
        <p>
          Keep it roughly between 20% and 80% for daily use, charge to full
          only when you need the range, and use fast charging when it saves you
          time rather than as your only method. That is genuinely all there is
          to it.
        </p>
      ),
    },
    {
      heading: "Why the ten-minute stop suits this well",
      body: (
        <p>
          Topping up in the 20–60% window is both the fastest part of the
          charging curve and the gentlest on the pack. A short HubCharge stop
          lands squarely in it.
        </p>
      ),
    },
  ],

  "home-vs-public": [
    {
      heading: "If you can charge at home, do",
      body: (
        <p>
          Home charging is cheaper per mile, and the car is full every morning
          without you thinking about it. For most owners with a driveway or
          garage, a Level 2 home charger removes charging from daily life
          almost entirely.
        </p>
      ),
    },
    {
      heading: "What a home install actually involves",
      body: (
        <p>
          A Level 2 charger needs a 240V circuit, which usually means an
          electrician and possibly panel work. Costs vary widely by property.
          Get more than one quote, and check for utility rebates before you
          book — California utilities frequently offer them.
        </p>
      ),
    },
    {
      heading: "If you can't charge at home",
      body: (
        <p>
          Renting, street parking, or a building without EV provision is a very
          common situation and entirely workable. The pattern that works is a
          fast top-up folded into something you already do weekly rather than a
          long slow charge you have to plan a day around. That is exactly what
          a ten-minute full-service stop is for.
        </p>
      ),
    },
    {
      heading: "The honest comparison",
      body: (
        <p>
          Public fast charging costs more per mile than home charging — that is
          true of every network, ours included. What you are buying is time and
          convenience. Whether that trade is worth it depends on how much of
          your charging it represents.
        </p>
      ),
    },
  ],

  "road-trip": [
    {
      heading: "Plan around charging, not despite it",
      body: (
        <p>
          The trips that go badly are the ones where charging is an
          interruption. The ones that go well fold it into stops you were going
          to make anyway — food, coffee, stretching your legs. Plan your breaks
          first, then find chargers at them.
        </p>
      ),
    },
    {
      heading: "Arrive low, leave early",
      body: (
        <p>
          Charging is fastest between roughly 20% and 60%. Two shorter stops
          beat one long one almost every time, because you spend the whole time
          in the fast part of the curve rather than crawling from 80% to 100%.
        </p>
      ),
    },
    {
      heading: "Leave a real buffer",
      body: (
        <p>
          Plan to arrive at each charger with around 15–20% remaining.
          Headwinds, elevation, cold and highway speed all cost range, and the
          estimate on your dash assumes none of them. A buffer also means a
          busy or broken charger is an inconvenience rather than a crisis.
        </p>
      ),
    },
    {
      heading: "Always have a second option",
      body: (
        <p>
          Know the next charger past your planned stop. This is the single
          habit that separates relaxed EV road trips from stressful ones.
        </p>
      ),
    },
    {
      heading: "Precondition before you arrive",
      body: (
        <p>
          Navigate to the charger in the car&rsquo;s own navigation so it warms
          the battery en route. On a cold day this can be the difference
          between a ten-minute stop and a twenty-minute one.
        </p>
      ),
    },
  ],

  "socal-charging": [
    {
      heading: "The two corridors that matter",
      body: (
        <p>
          Most driving around Los Angeles funnels onto the I-10 heading east
          toward Palm Springs and Arizona, or the I-210 skirting the foothills.
          HubCharge sits on both: Alhambra just off the I-10 near downtown, and
          Fontana further east where the Inland Empire begins.
        </p>
      ),
    },
    {
      heading: "Heading east out of LA",
      body: (
        <p>
          Alhambra is a natural first stop — close enough to town that you leave
          with a full buffer rather than burning range in traffic first.
          Fontana then sits at roughly the point where a top-up makes sense
          before the long open stretch toward Palm Springs, where stations
          thin out and summer heat starts affecting both range and charging
          speed.
        </p>
      ),
    },
    {
      heading: "Traffic is a range factor here",
      body: (
        <p>
          Counter-intuitively, stop-start traffic is gentler on an EV than open
          highway — regenerative braking recovers energy and low speeds are
          efficient. Sustained 75mph on the open I-10 will cost you far more
          range than the same distance crawling through the basin.
        </p>
      ),
    },
    {
      heading: "Summer heat, going east",
      body: (
        <p>
          Once past the Inland Empire in summer, ambient temperatures climb
          sharply. Cars may slow charging to protect the pack, and cabin
          cooling draws real power. Top up before the hottest stretch rather
          than during it.
        </p>
      ),
    },
  ],

  "new-ev-owner": [
    {
      heading: "Week one: find out what plug you have",
      body: (
        <p>
          Everything else follows from this. Look at your charge port, or check
          your make in our compatibility guide. If it is NACS or CCS — which
          covers nearly every EV sold in the US — you can charge at HubCharge
          with no adapter, because both cables are on every charger.
        </p>
      ),
    },
    {
      heading: "Week one: sort out where you charge most nights",
      body: (
        <p>
          If you have a driveway, look into a Level 2 home charger and check
          for utility rebates. If you do not, that is fine and very common —
          plan around a regular fast top-up folded into something you already
          do.
        </p>
      ),
    },
    {
      heading: "Week two: learn the curve",
      body: (
        <p>
          Charging speed is not constant. It is fastest between roughly 20% and
          60% and slows sharply after 80%. Once this clicks you will stop
          waiting around for the last few percent, and public charging gets
          markedly less annoying.
        </p>
      ),
    },
    {
      heading: "Week two: try one fast-charging stop deliberately",
      body: (
        <p>
          Do it before you need it, not on a road trip with a low battery and a
          deadline. Ten minutes at a charger while you are relaxed teaches you
          more than any guide.
        </p>
      ),
    },
    {
      heading: "Month one: stop thinking about it",
      body: (
        <p>
          Keep it roughly between 20% and 80% day to day, charge to full when
          you need the range, precondition before fast charging in cold
          weather. That is the whole discipline. Everything else is detail.
        </p>
      ),
    },
  ],
};
