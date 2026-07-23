"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { submitContact, type ContactState } from "@/app/contact/actions";
import { TurnstileField } from "@/components/shared/turnstile-field";
import { services } from "@/lib/data/services";

const initial: ContactState = { ok: false, message: "" };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  // Tokens are single-use — issue a fresh challenge after a rejected submit.
  const [attempt, setAttempt] = useState(0);
  useEffect(() => { if (state.message && !state.ok) setAttempt((n) => n + 1); }, [state]);

  if (state.ok) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
        <CheckCircle2 size={48} className="text-[var(--color-success)]" />
        <h3 className="text-2xl font-semibold">Request received</h3>
        <p className="max-w-md text-[var(--color-ink-dim)]">{state.message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 md:p-9">
      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Name *" error={state.errors?.name} />
        <Field name="email" label="Email *" type="email" error={state.errors?.email} />
        <Field name="phone" label="Phone" type="tel" error={state.errors?.phone} />
        <Field name="company" label="Business name" error={state.errors?.company} />
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--color-ink-dim)]">Monthly ad budget</span>
          <select name="budget" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-violet)]">
            <option value="">Select…</option>
            <option>Under $1,000</option>
            <option>$1,000–$3,000</option>
            <option>$3,000–$10,000</option>
            <option>$10,000–$25,000</option>
            <option>$25,000+</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--color-ink-dim)]">Interested in</span>
          <select name="service" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-violet)]">
            <option value="">Select…</option>
            {services.map((s) => <option key={s.slug}>{s.name}</option>)}
            <option>Not sure yet</option>
          </select>
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-medium text-[var(--color-ink-dim)]">What are your goals? *</span>
        <textarea name="message" rows={5} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-violet)]" placeholder="Tell us about your business, what you're running now, and what you'd like to achieve." />
        {state.errors?.message && <span className="mt-1 block text-xs text-[var(--color-danger)]">{state.errors.message}</span>}
      </label>

      {/* "I'm not a robot" check — renders only once the Turnstile site key is set. */}
      <TurnstileField resetKey={attempt} action="contact-form" className="mt-5" />

      {state.message && !state.ok && <p className="mt-5 rounded-lg bg-[color-mix(in_srgb,var(--color-danger)_12%,transparent)] px-4 py-3 text-sm text-[var(--color-danger)]">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-lime)] py-3.5 font-semibold text-[var(--color-ink)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(206,255,58,.4)] disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {pending ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : <>Get my free audit <ArrowRight size={18} /></>}
      </button>
      <p className="mt-4 text-xs text-[var(--color-ink-faint)]">By submitting, you agree to our Privacy Policy. We&apos;ll only use your details to respond to your enquiry.</p>
    </form>
  );
}

function Field({ name, label, type = "text", error }: { name: string; label: string; type?: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-ink-dim)]">{label}</span>
      <input name={name} type={type} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-violet)]" />
      {error && <span className="mt-1 block text-xs text-[var(--color-danger)]">{error}</span>}
    </label>
  );
}
