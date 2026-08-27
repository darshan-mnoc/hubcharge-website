"use server";

import { z } from "zod";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/contact-topics";
import { Resend } from "resend";
import { headers } from "next/headers";

/**
 * Server actions for every form on the site. Each one validates with zod,
 * applies a honeypot + light per-IP rate limit, and delivers the submission
 * to the HubCharge team via Resend. Returns { ok, error? } so the UI can show
 * a real failure state instead of a fake success message.
 */

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "info@micronocinc.com";
// Until the hubcharge.com domain is verified in Resend, the sandbox sender works
// for delivery to the account owner's inbox.
const FROM_EMAIL =
  process.env.RESEND_FROM ?? "HubCharge Website <onboarding@resend.dev>";

export type ActionResult = { ok: boolean; error?: string };

const NOT_CONFIGURED: ActionResult = {
  ok: false,
  error:
    "We couldn't send your message right now. Please email info@micronocinc.com or call (949) 391-4676.",
};

// ---- light in-memory rate limit (per server instance) ----
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

async function rateLimited(): Promise<boolean> {
  try {
    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      "unknown";
    const now = Date.now();
    const rec = hits.get(ip);
    if (!rec || now - rec.ts > WINDOW_MS) {
      hits.set(ip, { count: 1, ts: now });
      return false;
    }
    rec.count += 1;
    return rec.count > MAX_PER_WINDOW;
  } catch {
    return false;
  }
}

async function deliver(subject: string, text: string): Promise<ActionResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[actions] RESEND_API_KEY is not set — submission dropped");
    return NOT_CONFIGURED;
  }
  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject,
      text,
    });
    if (error) {
      console.error("[actions] Resend error:", error);
      return NOT_CONFIGURED;
    }
    return { ok: true };
  } catch (err) {
    console.error("[actions] send failed:", err);
    return NOT_CONFIGURED;
  }
}

const honeypot = z.string().max(0, "Invalid submission").optional().or(z.literal(""));

// ---------- Contact form ----------

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(200),
  email: z.string().trim().email("Please enter a valid email"),
  topic: z
    .enum(Object.keys(CONTACT_TOPICS) as [ContactTopic, ...ContactTopic[]])
    .optional()
    .default("other"),
  subject: z.string().trim().max(300).optional().default(""),
  message: z.string().trim().min(1, "Please enter a message").max(5000),
  company: honeypot, // honeypot — humans never fill this
});

export async function submitContact(
  input: z.infer<typeof contactSchema>
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  if (await rateLimited()) {
    return { ok: false, error: "Too many submissions — please try again in a minute." };
  }
  const { name, email, topic, subject, message } = parsed.data;
  const t = CONTACT_TOPICS[topic];
  return deliver(
    `[${t.label}] ${subject || "New message"} — ${name}`,
    `New contact form submission from hubcharge.com\n\n` +
      `Topic: ${t.label} (target response: ${t.sla})\n` +
      `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "(none)"}\n\n${message}`
  );
}

// ---------- Newsletter ----------
const emailSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  company: honeypot,
});

export async function subscribeNewsletter(
  input: z.infer<typeof emailSchema>
): Promise<ActionResult> {
  const parsed = emailSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }
  if (await rateLimited()) {
    return { ok: false, error: "Too many submissions — please try again in a minute." };
  }
  return deliver(
    "[Website] Newsletter signup",
    `New newsletter signup from hubcharge.com\n\nEmail: ${parsed.data.email}`
  );
}

// ---------- Notify me (new locations) ----------
const notifySchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  location: z.string().trim().max(200).optional().default(""),
  company: honeypot,
});

export async function notifyMe(
  input: z.infer<typeof notifySchema>
): Promise<ActionResult> {
  const parsed = notifySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }
  if (await rateLimited()) {
    return { ok: false, error: "Too many submissions — please try again in a minute." };
  }
  return deliver(
    "[Website] New-location notification request",
    `Someone asked to be notified about upcoming locations.\n\nEmail: ${parsed.data.email}\nInterested in: ${parsed.data.location || "(any)"}`
  );
}

// ---------- Feedback widget ----------
const feedbackSchema = z.object({
  options: z.array(z.string().max(100)).max(20),
  message: z.string().trim().max(2000).optional().default(""),
  company: honeypot,
});

export async function submitFeedback(
  input: z.infer<typeof feedbackSchema>
): Promise<ActionResult> {
  const parsed = feedbackSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid submission" };
  }
  if (await rateLimited()) {
    return { ok: false, error: "Too many submissions — please try again in a minute." };
  }
  const { options, message } = parsed.data;
  if (options.length === 0 && !message) {
    return { ok: false, error: "Pick an option or write a note first." };
  }
  return deliver(
    "[Website] Nearby-services feedback",
    `Feedback from the site widget ("What do you want near HubCharge?")\n\nSelected: ${options.join(", ") || "(none)"}\nMessage: ${message || "(none)"}`
  );
}
