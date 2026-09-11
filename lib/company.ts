/**
 * The company's own name, address, phone and email — in one place.
 *
 * WHY THIS FILE EXISTS
 * These four facts were retyped as literals in four files: the footer, the
 * privacy policy, the terms, and the Organization JSON-LD in the root layout.
 * That is why the address was still Rancho Cucamonga in all four of them long
 * after the company had moved — there was no single thing to change, so
 * changing it meant knowing all four places existed.
 *
 * NAP DISCIPLINE (the same rule lib/stations.ts carries for the stations):
 * name, address and phone must be character-identical with the Google
 * Business Profile and every aggregator listing. One string, one spelling,
 * everywhere — including the punctuation. "St," here and "St." there is
 * enough to split a listing.
 *
 * SEPARATE FROM THE STATION ON PURPOSE. The head office currently shares a
 * building with the Alhambra site, and deriving one from the other would make
 * that coincidence permanent: move the office and the charger's address would
 * follow it, or the reverse. They are two facts that happen to agree today.
 */
export const COMPANY = {
  /** Trading name. */
  name: "HubCharge",
  /** The entity that actually signs things. */
  legalName: "Micronoc Inc.",
  address: {
    street: "188 S Monterey St, Unit 108",
    city: "Alhambra",
    state: "CA",
    zip: "91801",
    country: "US",
  },
  /** As written for a human. */
  phone: "(949) 392-8755",
  /** As written for a machine — no punctuation, matching lib/stations.ts. */
  phoneE164: "+19493928755",
  email: "info@micronocinc.com",
} as const;

/** "188 S Monterey St, Unit 108, Alhambra, CA 91801" — one line. */
export const companyAddressLine = [
  COMPANY.address.street,
  COMPANY.address.city,
  `${COMPANY.address.state} ${COMPANY.address.zip}`,
].join(", ");
