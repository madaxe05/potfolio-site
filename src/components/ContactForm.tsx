"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon, CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { site } from "@/data/site";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Formspree-backed contact form.
 *
 * Every state is built, not just the happy path: idle, sending, sent, and a
 * real error message with the draft still in the fields so nothing is lost.
 * If no endpoint is configured the form says so rather than pretending to send.
 */
export function ContactForm() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const endpoint = site.formspreeId
    ? `https://formspree.io/f/${site.formspreeId}`
    : null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!endpoint) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.errors?.[0]?.message ?? `The form service returned ${res.status}.`
        );
      }
      form.reset();
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong sending that."
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-line bg-surface p-7 sm:p-9"
    >
      <p className="label">Send a message</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" autoComplete="name" />
        <Field label="Email" name="email" type="email" autoComplete="email" />
      </div>

      <div className="mt-5">
        <Field label="What do you need?" name="message" textarea />
      </div>

      {/* Honeypot. Bots fill it, people never see it. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending" || !endpoint}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-ink transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
        >
          {status === "sending" ? "Sending" : "Send it"}
          <ArrowRightIcon
            size={16}
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>

        {!endpoint && (
          <p className="max-w-[38ch] text-[0.85rem] leading-relaxed text-faint">
            Waiting on an endpoint. Add a Formspree form id to{" "}
            <code className="font-mono text-muted">site.formspreeId</code> and
            this goes live.
          </p>
        )}

        <AnimatePresence mode="wait">
          {status === "sent" && (
            <motion.p
              key="sent"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 text-sm text-accent"
            >
              <CheckCircleIcon size={17} weight="fill" aria-hidden />
              Got it. I will reply to that address.
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              key="error"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-2 text-sm text-fg"
            >
              <WarningCircleIcon
                size={17}
                weight="fill"
                aria-hidden
                className="mt-0.5 shrink-0 text-accent"
              />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <p aria-live="polite" className="sr-only">
        {status === "sending" ? "Sending your message" : ""}
        {status === "sent" ? "Message sent" : ""}
        {status === "error" ? `Message failed. ${error}` : ""}
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
}) {
  // Label above the input, never a placeholder standing in for one.
  const shared =
    "mt-2 w-full rounded-xl border border-line bg-ink px-4 py-3 text-[0.95rem] text-fg outline-none transition-colors duration-200 placeholder:text-faint focus:border-accent";
  return (
    <div>
      <label htmlFor={name} className="block text-sm text-muted">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          required
          rows={5}
          className={`${shared} resize-y`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required
          autoComplete={autoComplete}
          className={shared}
        />
      )}
    </div>
  );
}
