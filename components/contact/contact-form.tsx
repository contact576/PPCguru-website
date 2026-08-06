"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { submitContact, type ContactState } from "@/app/contact/actions";
import { TurnstileField } from "@/components/shared/turnstile-field";
import { SessionField } from "@/components/shared/session-field";
import { SERVICE_OPTIONS, BUDGET_OPTIONS } from "@/lib/data/form-options";

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
      <SessionField />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Name *" error={state.errors?.name} />
        <Field name="email" label="Email *" type="email" error={state.errors?.email} />
        <Field name="phone" label="Phone *" type="tel" error={state.errors?.phone} />
        <Field name="company" label="Business name *" error={state.errors?.company} />
        {/* `website` is the honeypot's name — the real field is `site_url`. */}
        <Field name="site_url" label="Website" type="url" error={state.errors?.site_url} />
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--color-ink-dim)]">Monthly budget *</span>
          <select name="budget" defaultValue="" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-violet)]">
            <option value="" disabled>Select…</option>
            {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          {state.errors?.budget && <span className="mt-1 block text-xs text-[var(--color-danger)]">{state.errors.budget}</span>}
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 block text-sm font-medium text-[var(--color-ink-dim)]">What are you interested in? * <span className="text-[var(--color-ink-faint)]">(pick all that apply)</span></legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {SERVICE_OPTIONS.map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-3.5 py-3 text-sm transition-colors has-[:checked]:border-[var(--color-ink)] has-[:checked]:bg-[color-mix(in_srgb,var(--color-lime)_28%,transparent)]">
              <input type="checkbox" name="services" value={s} className="h-4 w-4 shrink-0 accent-[var(--color-ink)]" />
              {s}
            </label>
          ))}
        </div>
        {state.errors?.services && <span className="mt-1 block text-xs text-[var(--color-danger)]">{state.errors.services}</span>}
      </fieldset>

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
