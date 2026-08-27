"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send, Loader2 } from "lucide-react";
import { submitContact } from "@/lib/actions";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/contact-topics";

/**
 * The contact form.
 *
 * Topic first, because it changes what we ask and what we promise back. A
 * charging fault wants your station and stall; a press enquiry does not. And
 * the response target is shown against the topic rather than as a single
 * blanket "within 24 hours", because those are not the same commitment and
 * saying they are is how a support promise stops meaning anything.
 *
 * Placeholders are real prompts. The previous set was "John Doe",
 * "john@example.com" and "Tell us more…" — the canonical filler text, which
 * reads as a form nobody finished building.
 */
export function ContactForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const field = dark ? "field-dark px-4 py-3" : "field px-4 py-3";
  const label = dark ? "text-on-dark/70" : "text-ink-600";

  const [topic, setTopic] = useState<ContactTopic>("charging");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsStation = topic === "charging" || topic === "billing";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const station = String(fd.get("station") ?? "").trim();
    const body = String(fd.get("message") ?? "");
    const res = await submitContact({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      topic,
      subject: String(fd.get("subject") ?? ""),
      message: station ? `Station / stall: ${station}\n\n${body}` : body,
      company: String(fd.get("company") ?? ""),
    });
    setSending(false);
    if (res.ok) setSent(true);
    else setError(res.error ?? "Something went wrong. Please try again.");
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg border p-8 text-center ${
          dark ? "border-white/10 bg-white/[0.04]" : "border-paper-300 bg-paper-100"
        }`}
      >
        <span
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
            dark ? "bg-ok-on-dark/20" : "bg-ok-surface"
          }`}
        >
          <Check aria-hidden className={`h-6 w-6 ${dark ? "text-ok-on-dark" : "text-ok-ink"}`} />
        </span>
        <p className={`text-h4 ${dark ? "text-white" : "text-ink-900"}`}>Message sent</p>
        <p className={`text-body-sm mt-2 ${dark ? "text-on-dark/70" : "text-ink-500"}`}>
          {CONTACT_TOPICS[topic].sla}. We&rsquo;ll reply to the address you gave us.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <fieldset>
        <legend className={`text-caption mb-2 ${label}`}>What&rsquo;s this about?</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CONTACT_TOPICS) as ContactTopic[]).map((id) => {
            const on = topic === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setTopic(id)}
                className={`rounded-full border px-3.5 py-1.5 text-caption transition-colors ${
                  on
                    ? "border-brand bg-brand text-ink-900"
                    : dark
                      ? "border-white/20 text-on-dark/75 hover:border-white/45"
                      : "border-paper-300 text-ink-600 hover:border-ink-300"
                }`}
              >
                {CONTACT_TOPICS[id].label}
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className={`text-caption mt-2.5 ${dark ? "text-brass" : "text-brass-ink"}`}>
          Target response: {CONTACT_TOPICS[topic].sla}
        </p>
      </fieldset>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className={`block text-caption mb-1.5 ${label}`}>Your name</label>
          <input id="cf-name" name="name" required autoComplete="name" className={field} placeholder="Who we're replying to" />
        </div>
        <div>
          <label htmlFor="cf-email" className={`block text-caption mb-1.5 ${label}`}>Email</label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" className={field} placeholder="Where we should reply" />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {needsStation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <label htmlFor="cf-station" className={`block text-caption mb-1.5 ${label}`}>
              Which station and stall? <span className="opacity-60">Optional, but it saves a round trip</span>
            </label>
            <input id="cf-station" name="station" className={field} placeholder="e.g. Alhambra, charger 03" />
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label htmlFor="cf-subject" className={`block text-caption mb-1.5 ${label}`}>Subject</label>
        <input id="cf-subject" name="subject" className={field} placeholder="One line on what happened" />
      </div>

      <div>
        <label htmlFor="cf-message" className={`block text-caption mb-1.5 ${label}`}>Message</label>
        <textarea
          id="cf-message" name="message" required rows={5}
          className={`${field} resize-none`}
          placeholder={
            needsStation
              ? "What happened, and roughly when. Dates and times help us find the session."
              : "As much or as little detail as you like."
          }
        />
      </div>

      {/* honeypot — humans never see or fill this */}
      <input
        type="text" name="company" tabIndex={-1} autoComplete="off"
        aria-hidden className="hidden"
      />

      {error && (
        <p role="alert" className={`text-body-sm ${dark ? "text-error-on-dark" : "text-error-ink"}`}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-ink-900 transition-colors hover:bg-brand-hover disabled:opacity-60"
      >
        {sending ? (
          <>
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
            Sending
          </>
        ) : (
          <>
            <Send aria-hidden className="h-4 w-4" />
            Send message
          </>
        )}
      </button>
    </form>
  );
}
