/**
 * Enquiry topics for the contact form.
 *
 * Deliberately NOT in lib/actions.ts: that file is "use server", and a server
 * module may only export async functions — exporting a plain object from it
 * fails the build. This is shared data, so it lives on its own and both the
 * client form and the server action import it.
 *
 * The subject line is prefixed with the topic so the inbox can be triaged
 * without reading the body first — a charging fault and a press request have
 * very different urgency, and one undifferentiated stream treats them alike.
 *
 * `sla` is what the form promises back. Keep it honest, and keep it in sync
 * with what the team can actually do; a support promise that isn't met is
 * worse than no promise.
 */
export const CONTACT_TOPICS = {
  charging: { label: "A problem while charging", sla: "Same day during opening hours" },
  billing: { label: "Billing or a session", sla: "Within one business day" },
  host: { label: "Hosting a HubCharge site", sla: "Within two business days" },
  accessibility: { label: "Accessibility", sla: "Within one business day" },
  press: { label: "Press or partnerships", sla: "Within two business days" },
  other: { label: "Something else", sla: "Within one business day" },
} as const;

export type ContactTopic = keyof typeof CONTACT_TOPICS;
