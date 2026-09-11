/**
 * Which EV programmes exist, who runs them, and where to check.
 *
 * WHAT THIS FILE IS FOR
 * It routes; it does not quote. There are no dollar amounts anywhere in here
 * on purpose — an amount is the fastest thing on a page like this to go out
 * of date, and being confidently wrong about money is worse than sending
 * someone to the body that administers it.
 *
 * WHY IT LEFT THE COMPONENT
 * The list used to live inside components/incentive-finder.tsx, and each
 * entry carried a `relevant(answers)` PREDICATE. Five of the eight tested
 * `a.california !== "no"`, so California was spelled into the logic rather
 * than being data, and the only question about place the finder could ask was
 * the yes/no "Do you live in California?". A driver in Texas who answered no
 * was left with two ended federal credits and nothing else — on a page whose
 * whole job is to tell them what they can claim.
 *
 * `states` and `needs` are declarative, so adding a state is adding rows.
 */

export type Answer = "yes" | "no" | "unsure";

export type Programme = {
  id: string;
  name: string;
  /** Who administers it. This is what the reader has to go and deal with. */
  body: string;
  url: string;
  what: string;
  /**
   * Where it applies. `null` means everywhere — the federal credits and the
   * utility entry, which is about whoever your provider happens to be.
   */
  states: string[] | null;
  /**
   * Question ids that must not be answered "no". An unanswered or unsure
   * question keeps the programme visible: the page's job is to show you what
   * MIGHT apply, and hiding something because you have not said yet is the
   * opposite of that.
   */
  needs?: string[];
  note?: string;
  /**
   * Ended programmes stay on the page rather than being deleted.
   *
   * Someone searching "federal EV tax credit" needs to be told it ended and
   * when — finding nothing reads as a broken page and sends them to a blog
   * post that hasn't been updated either. `ended` carries the date so the
   * claim is checkable.
   *
   * "closed" is the third state, and Texas is why it exists. TERP's
   * light-duty rebate is funded in cycles: TCEQ's own page reads "Currently
   * Closed" today and it has reopened before. Calling that `ended` would be
   * wrong, and calling it `live` would send someone to an application form
   * that is not accepting applications. It exists, you cannot apply this
   * minute, and here is where to be told when you can.
   */
  status: "live" | "closed" | "ended";
  ended?: string;
};

/** When a human last checked every link and status on this list. */
export const INCENTIVES_CHECKED = "4 September 2026";

export const PROGRAMMES: Programme[] = [
  {
    id: "federal",
    name: "Federal clean vehicle credit (§30D)",
    body: "IRS",
    url: "https://www.irs.gov/credits-deductions/credits-for-new-clean-vehicles-purchased-in-2023-or-after",
    status: "ended",
    ended: "30 September 2025",
    what: "The federal credit against tax for a qualifying new EV. Terminated by the One Big Beautiful Bill Act in July 2025 for any vehicle acquired after 30 September 2025.",
    states: null,
    note: "The cut-off turns on when the vehicle was acquired, not when it was delivered — a binding written contract with a payment made on or before that date can still qualify. That is a question for your tax preparer, not for us.",
  },
  {
    id: "federal-used",
    name: "Used clean vehicle credit (§25E)",
    body: "IRS",
    url: "https://www.irs.gov/credits-deductions/used-clean-vehicle-credit",
    status: "ended",
    ended: "30 September 2025",
    what: "The smaller credit for a qualifying used EV bought from a dealer. Ended on the same date and under the same law as the new-vehicle credit.",
    states: null,
    /* The "would you consider a used EV" question was asked by the finder and
       read by nothing — dead input on a form that is already asking five
       questions. This is the entry it was always meant to gate. */
    needs: ["used"],
  },
  {
    id: "cvrp",
    name: "Clean Vehicle Rebate Project (CVRP)",
    body: "California Air Resources Board",
    url: "https://ww2.arb.ca.gov/our-work/programs/clean-vehicle-rebate-project",
    status: "ended",
    ended: "late 2023",
    what: "California’s long-running purchase rebate, which put close to 600,000 clean vehicles on the road. Closed to new applications and not returning — the state has shifted its money toward income-qualified programmes instead.",
    states: ["CA"],
  },
  {
    id: "hov",
    name: "HOV lane access (Clean Air Vehicle decal)",
    body: "California DMV",
    url: "https://ww2.arb.ca.gov/end-californias-clean-air-vehicle-decal-program",
    status: "ended",
    ended: "1 October 2025",
    what: "Solo access to carpool lanes for zero-emission vehicles. The federal authority that let states run it lapsed on 30 September 2025; every decal expired the next day and the DMV had already stopped issuing them.",
    states: ["CA"],
    note: "California legislated an extension through 2027, but it needs federal approval under 23 U.S.C. §166 that has not been granted. If that changes, this comes back.",
  },
  {
    id: "ccfa",
    name: "Clean Cars 4 All",
    body: "California / regional air districts",
    url: "https://ww2.arb.ca.gov/our-work/programs/clean-cars-4-all",
    status: "live",
    what: "Pays substantially more than the old rebate did to scrap an older, higher-polluting car for a cleaner one. Run regionally, so the terms depend on your air district.",
    states: ["CA"],
    needs: ["income"],
  },
  {
    id: "dcap",
    name: "Driving Clean Assistance Program (DCAP)",
    body: "California Air Resources Board",
    url: "https://ww2.arb.ca.gov/our-work/programs/driving-clean-assistance-program",
    status: "live",
    what: "The statewide programme that took over after CVRP closed. Aimed at first-time and lower-income buyers, and unlike Clean Cars 4 All it does not require scrapping an old car. Covers used EVs as well as new.",
    states: ["CA"],
    needs: ["income", "buying"],
  },
  {
    id: "myfirstev",
    name: "MyFirstEV",
    body: "California",
    url: "https://ww2.arb.ca.gov/our-work/programs/driving-clean-assistance-program",
    status: "live",
    what: "An instant rebate applied at purchase rather than claimed later, launched in August 2026 and currently offered through a small number of manufacturers.",
    states: ["CA"],
    needs: ["buying"],
    note: "New enough that participating brands are still changing. Confirm with the dealer before you count on it.",
  },
  {
    id: "terp-ldplip",
    name: "Light-Duty Purchase or Lease Incentive Program (TERP)",
    body: "Texas Commission on Environmental Quality",
    url: "https://www.tceq.texas.gov/airquality/terp/ldplip",
    /* CLOSED, NOT ENDED, AND THE DIFFERENCE MATTERS.
       TCEQ's own page reads "Currently Closed". The programme is funded in
       cycles and has reopened before, most recently for vehicles purchased on
       or after 1 September 2025. Marking it `ended` would tell a Texan buying
       a car this month not to bother; marking it `live` would send them to an
       application that is not open. */
    status: "closed",
    what: "Texas's state rebate for a new electric, hydrogen or plug-in hybrid vehicle, run under the Texas Emissions Reduction Plan. Funded in rounds and awarded first-come, first-served, so it opens and closes with its budget.",
    states: ["TX"],
    needs: ["buying"],
    note: "TCEQ runs an email list that announces when a round opens. Rounds have closed within weeks of opening, so being on it is the difference between claiming and missing.",
  },
  {
    id: "tx-utility-charger",
    name: "Utility charger rebates",
    body: "Your electricity provider",
    url: "https://afdc.energy.gov/laws/all?state=TX",
    status: "live",
    what: "Several Texas utilities pay toward a home charger and its install, and some offer an EV time-of-use rate. Which ones depend entirely on who serves your address — Texas retail electricity is deregulated, so it is worth asking rather than assuming.",
    states: ["TX"],
    needs: ["home"],
  },
  {
    id: "utility",
    name: "Utility rates and charger rebates",
    body: "Your electricity provider",
    url: "https://www.energy.ca.gov/programs-and-topics/topics/transportation",
    status: "live",
    what: "Most California utilities run an EV-specific time-of-use rate, and some pay toward a home charger install. If you can charge where you park, this is usually the largest recurring saving on the list.",
    states: ["CA"],
    needs: ["home"],
  },
];

export const QUESTIONS = [
  { id: "buying", q: "Are you buying or leasing a car soon?" },
  { id: "used", q: "Would you consider a used EV?" },
  { id: "home", q: "Can you charge where you park overnight?" },
  { id: "income", q: "Would you describe your household as income-qualified?" },
] as const;

/**
 * Which programmes to show, for a state and a set of answers.
 *
 * Live first, then closed, then ended. An ended programme listed above a
 * claimable one buries the thing the reader can actually act on, and a closed
 * one sits between because it is neither.
 */
export function matchingProgrammes(
  state: string | null,
  answers: Record<string, Answer>
): Programme[] {
  const matching = PROGRAMMES.filter((p) => {
    if (state && p.states && !p.states.includes(state)) return false;
    return (p.needs ?? []).every((q) => answers[q] !== "no");
  });
  const rank = { live: 0, closed: 1, ended: 2 } as const;
  return [...matching].sort((a, b) => rank[a.status] - rank[b.status]);
}
