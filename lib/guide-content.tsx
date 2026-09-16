import type { ReactNode } from "react";
import { ChargerEtiquette } from "@/components/charger-etiquette";
import { HomeVsPublic as HomeVsPublicCompare } from "@/components/home-vs-public";
import { CorridorMap } from "@/components/corridor-map";
import { FirstMonth } from "@/components/first-month";
import { Term } from "@/components/term";
import { WeatherImpact } from "@/components/weather-impact";
import { RoutinePlanner } from "@/components/routine-planner";
import { ShiftPlanner } from "@/components/shift-planner";
import { Troubleshooter } from "@/components/troubleshooter";
import { IncentiveFinder } from "@/components/incentive-finder";
import { INCENTIVES_CHECKED } from "@/lib/incentives";
import { SocWindow } from "@/components/soc-window";
import { TripPlanner } from "@/components/trip-planner";

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
          <ChargerEtiquette />
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
          Occasional <Term id="dcfc">DC fast charging</Term> is not something to worry about. Modern
          EVs actively manage temperature and current to protect the pack, and
          large fleet studies have generally found the effect of regular fast
          charging to be small compared with age and total mileage.
        </p>
      ),
    },
    {
      heading: "The band that matters",
      body: (
        <>
          <p>
            Most of the advice reduces to one geometric fact, which is far
            easier to see than to argue about:
          </p>
          <SocWindow />
        </>
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
          <Term id="charging-curve">charging curve</Term> and the gentlest on the pack. A short HubCharge stop
          lands squarely in it.
        </p>
      ),
    },
  ],

  "home-vs-public": [
    {
      heading: "If you can charge at home, do",
      body: (
        <>
          <HomeVsPublicCompare />
          <p>
          Home charging is cheaper per mile, and the car is full every morning
          without you thinking about it. For most owners with a driveway or
          garage, a Level 2 home charger removes charging from daily life
          almost entirely.
        </p>
        </>
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
      heading: "What your own trip looks like",
      body: (
        <>
          <p>
            Put the distance in and see how it breaks up. The stops are usually
            fewer and shorter than people expect:
          </p>
          <TripPlanner />
        </>
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

  "charging-corridors": [
    {
      heading: "The corridors that matter",
      body: (
        <>
          <CorridorMap />
          <p>
            Most driving around Los Angeles funnels onto the I-10 heading east
            toward Palm Springs and Arizona, or the I-210 skirting the
            foothills. HubCharge sits on both: Alhambra just off the I-10 near
            downtown, and Fontana further east where the Inland Empire begins.
          </p>
          <p>
            Texas works the same way around a different road. I-35 is the spine
            from San Antonio through Austin to Dallas, and our Round Rock site
            sits on it just north of the city — the point where an Austin
            commute turns into a drive.
          </p>
        </>
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
      heading: "Round Rock, and the drive north",
      body: (
        <p>
          Our Round Rock site is on Double Creek Drive, a minute off I-35 and
          about twenty miles north of downtown Austin. Heading north from
          there, I-35 runs through Georgetown and then opens up toward Waco and
          Dallas — so it is the natural place to leave Austin full rather than
          topping up an hour later. It is not open yet; the address is
          confirmed and the date is not, and we will publish hours here before
          it takes its first car.
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
        <>
          <FirstMonth />
          <p>
          Everything else follows from this. Look at your charge port, or check
          your make in our compatibility guide. If it is <Term id="nacs">NACS</Term> or <Term id="ccs">CCS</Term> — which
          covers nearly every EV sold in the US — you can charge at HubCharge
          with no adapter, because both cables are on every charger.
        </p>
        </>
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
          you need the range, <Term id="preconditioning">precondition</Term> before fast charging in cold
          weather. That is the whole discipline. Everything else is detail.
        </p>
      ),
    },
  ],

  "apartment-charging": [
    {
      heading: "The question nobody answers honestly",
      body: (
        <>
          <p>
            Most EV advice assumes a garage. &ldquo;Just charge overnight&rdquo;
            is useless if you park on the street, in a shared lot, or in a
            building whose board has been discussing chargers since 2021.
            Roughly a third of American households rent, and in Los Angeles it
            is closer to half.
          </p>
          <p>
            You can absolutely run an EV without a driveway. But it is a
            different routine, not the same one with an asterisk, and it is
            worth knowing what it costs you before you buy the car rather than
            after.
          </p>
        </>
      ),
    },
    {
      heading: "What it actually takes each week",
      body: (
        <>
          <p>
            The real currency is stops per week, not miles of range. Put your
            car and your mileage in:
          </p>
          <RoutinePlanner />
        </>
      ),
    },
    {
      heading: "Ask about work before you ask about home",
      body: (
        <p>
          Workplace Level 2 is the quiet solution to this problem. Eight hours
          parked at 7&ndash;11 <Term id="kw">kW</Term> covers almost any commute, and it costs you no
          time at all because you were going to be there anyway. Many California
          employers have chargers they under-publicise; some have them installed
          and unused. It is worth one email to facilities before you rearrange
          your week around public charging.
        </p>
      ),
    },
    {
      heading: "If you're going to rely on public charging, pick your spot",
      body: (
        <>
          <p>
            The difference between a good public-charging routine and a bad one
            is almost entirely about where the charger is, not how fast it is.
            A 350 kW unit in a car park you have no reason to visit will lose
            every time to a slower one where you already buy groceries.
          </p>
          <p>
            Look for somewhere you would spend twenty minutes anyway, that is on
            a route you already drive, and where you are not going to feel
            stranded if a stall is occupied. That last one is why the number of
            stalls matters more than the peak power on the sign.
          </p>
        </>
      ),
    },
    {
      heading: "What to ask your building",
      body: (
        <>
          <p>
            If you rent, California law gives you more standing than most people
            realise. Civil Code sections 1947.6 and 4745 limit a landlord&rsquo;s
            or HOA&rsquo;s ability to refuse a tenant-funded charging station
            outright, subject to conditions about insurance, permits and who
            pays.
          </p>
          <p>
            That is not the same as a right to a free charger, and it is worth
            reading the actual text or asking someone who has, rather than
            quoting it at a landlord from memory. But &ldquo;no&rdquo; is not
            always the end of the conversation.
          </p>
        </>
      ),
    },
  ],

  "charging-troubleshooting": [
    {
      heading: "Most charging problems are one of five things",
      body: (
        <>
          <p>
            Public charging fails often enough that every EV owner has a story.
            What the stories rarely include is that the majority of failed
            sessions come down to a handful of causes, most of which you can
            clear from the driver&rsquo;s seat in under a minute.
          </p>
          <p>
            Pick what is happening and work down the list. They are ordered by
            how often each one is actually the answer, not by how dramatic it
            sounds.
          </p>
          <Troubleshooter />
        </>
      ),
    },
    {
      heading: "Before you decide the charger is broken",
      body: (
        <>
          <p>
            Two things are worth checking in every case, because they explain a
            surprising share of what gets reported as a fault.
          </p>
          <p>
            <strong>Where you are on the curve.</strong> Arriving at 70% and
            seeing low power is the charging system working correctly. Every
            battery tapers above roughly 60%, on every network.
          </p>
          <p>
            <strong>Your car&rsquo;s own ceiling.</strong> Plenty of EVs peak
            well below what a fast charger can deliver. If your car maxes out at
            55 <Term id="kw">kW</Term>, it will do 55 kW on a 350 kW unit too.
          </p>
        </>
      ),
    },
    {
      heading: "What we'd rather you didn't have to do",
      body: (
        <p>
          At participating locations there is an attendant on site, and the
          honest answer to most of this is that you should not have to
          troubleshoot anything &mdash; wave, and someone deals with it. This
          page exists for the times you are somewhere else, or outside our
          hours, or would simply rather know.
        </p>
      ),
    },
  ],

  "rideshare-drivers": [
    {
      heading: "Charging time is unpaid time",
      body: (
        <>
          <p>
            For most drivers, charging is a mild inconvenience. If you drive for
            a living it is directly lost income, and that changes every decision
            about it &mdash; where you stop, how long for, and how full you let
            the car get.
          </p>
          <p>
            The good news is that the economics work out well: a driving day is
            exactly the use case that fast charging was built for, and the
            per-mile cost of electricity is low enough that the maths usually
            favours the EV comfortably even after the stops.
          </p>
        </>
      ),
    },
    {
      heading: "How much of a shift it takes",
      body: (
        <>
          <p>
            Put your car and a typical day in and see what comes out:
          </p>
          <ShiftPlanner />
        </>
      ),
    },
    {
      heading: "Short and often beats long and rare",
      body: (
        <>
          <p>
            The instinct is to charge to full so you can forget about it. For a
            working driver that is usually the wrong call, because the last
            twenty percent is the slowest part of the curve &mdash; you are
            paying your most expensive minutes for your least valuable miles.
          </p>
          <p>
            Two or three ten-minute stops keep you in the fast part of the curve
            every time, and they slot into the gaps a shift already has: between
            rides, waiting on an order, at the end of a long drop.
          </p>
        </>
      ),
    },
    {
      heading: "Charge where you were going to wait anyway",
      body: (
        <p>
          The stops that cost nothing are the ones layered onto time you had
          already lost. Airport queues, the twenty minutes at the end of a shift,
          the gap while a restaurant finishes an order. Our Alhambra site sits
          in walking distance of Main Street, which is a reasonable place to be
          told your pickup is eight minutes away.
        </p>
      ),
    },
    {
      heading: "Keep the receipts",
      body: (
        <p>
          Charging for work is generally deductible, and per-session receipts
          are considerably easier to reconcile at tax time than per-<Term id="kwh">kWh</Term> billing
          spread across four networks and three apps. Whatever you use, get the
          records into one place as you go rather than in April.
        </p>
      ),
    },
  ],

  "ev-incentives": [
    {
      heading: "Why this page has no dollar amounts on it",
      body: (
        <>
          <p>
            Incentive programmes change constantly. Amounts move, income caps
            move, eligible-vehicle lists move, and programmes open and close
            with little notice. Any figure printed here would be wrong within a
            year &mdash; and a stale number on a charging company&rsquo;s
            website is worse than no number, because somebody plans a purchase
            around it.
          </p>
          <p>
            So this page routes rather than quotes. It tells you which
            programmes are worth your time given your situation, and sends you
            to the body that administers each one. That is where the number of
            record lives.
          </p>
        </>
      ),
    },
    {
      heading: "Find the ones that apply to you",
      body: (
        <>
          <p>
            Start with where you live. Four of the programmes below have closed
            since 2025 &mdash; including both federal credits and
            California&rsquo;s carpool-lane decal &mdash; and they stay listed,
            marked with the date they ended, because being told a thing is over
            is more useful than finding nothing and assuming the page is
            broken.
          </p>
          <p>
            Texas is a third case again. Its state rebate is funded in rounds
            rather than running continuously, so it is neither open nor gone:
            it is closed until the next round, and the useful thing is to be on
            the list that announces one.
          </p>
          <IncentiveFinder />
        </>
      ),
    },
    {
      heading: "The one people forget",
      body: (
        <p>
          Purchase incentives get the attention because they are large and
          one-off. But if you can charge where you park, an EV-specific
          time-of-use rate from your utility is often worth more over the life
          of the car than any single rebate &mdash; it applies every night for
          years rather than once. It is also the least advertised, because no
          dealer earns anything by telling you about it.
        </p>
      ),
    },
    {
      heading: "What we can and can't tell you",
      body: (
        <>
          <p>
            We run charging stations. We are not tax advisers, and nothing here
            is tax advice &mdash; eligibility for the federal credits in
            particular depends on your own return in ways no website can assess.
          </p>
          <p>
            The eligibility logic on this page was last reviewed in{" "}
            {INCENTIVES_CHECKED}. If you are reading this much later than that,
            treat the links as the source and this page as a map to them.
          </p>
        </>
      ),
    },
  ],
};
