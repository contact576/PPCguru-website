"use client";

import { useEffect, useState, useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { captureLead, type LeadState } from "@/app/actions/lead";
import { TurnstileField } from "@/components/shared/turnstile-field";
import { SessionField } from "@/components/shared/session-field";
import { track } from "@/lib/analytics";
import { SERVICE_OPTIONS, BUDGET_OPTIONS } from "@/lib/data/form-options";

const initial: LeadState = { ok: false, message: "" };

/**
 * Shared lead-capture form. Used by the pop-up funnel and the tool result-gate.
 * `source` records origin; `submitLabel` overrides the button; `onDone` fires on
 * a successful submit (e.g. to unlock a gated report).
 */
export function LeadForm({
  source,
  compact = false,
  submitLabel = "Unlock my report",
  onDone,
}: {
  source: string;
  compact?: boolean;
  submitLabel?: string;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState(captureLead, initial);
  useEffect(() => { if (state.ok) { track("popup_submit", { source }); onDone(); } }, [state.ok, source, onDone]);

  // Turnstile tokens are single-use: after a rejected submit the old token is
  // spent, so bump the reset key to issue a fresh challenge before the retry.
  const [attempt, setAttempt] = useState(0);
  useEffect(() => { if (state.message && !state.ok) setAttempt((n) => n + 1); }, [state]);

  const field = "w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-lime)_55%,transparent)]";
  const legend = "mb-1.5 block text-[11px] font-bold uppercase tracking-[.06em] text-[var(--color-ink-faint)]";
  return (
    <form action={action} className={compact ? "space-y-2.5" : "space-y-3"}>
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="source" value={source} />
      <SessionField />
      <input required name="name" aria-label="Your name" placeholder="Name" className={field} />
      <input required name="company" aria-label="Business name" placeholder="Business name" className={field} />
      <input required type="email" name="email" aria-label="Your email" placeholder="Email" className={field} />
      <div className={compact ? "space-y-2.5" : "grid grid-cols-2 gap-3"}>
        <input required name="phone" aria-label="Phone or WhatsApp" placeholder="Phone / WhatsApp" className={field} />
        {/* Optional: businesses that need a site built don't have one yet. */}
        <input name="website" aria-label="Website (optional)" placeholder="Website (optional)" className={field} />
      </div>

      <fieldset>
        <legend className={legend}>What do you need? (pick all that apply)</legend>
        {/* Compact lives inside a narrow overlay card (tool gates), so the group
            scrolls instead of pushing the submit button off-screen. */}
        <div className={`grid grid-cols-2 gap-1.5 ${compact ? "max-h-[136px] overflow-y-auto pr-0.5" : ""}`}>
          {SERVICE_OPTIONS.map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] px-2.5 py-2 text-[12.5px] leading-tight transition-colors has-[:checked]:border-[var(--color-ink)] has-[:checked]:bg-[color-mix(in_srgb,var(--color-lime)_28%,transparent)]">
              <input type="checkbox" name="services" value={s} className="h-3.5 w-3.5 shrink-0 accent-[var(--color-ink)]" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className={legend}>Monthly budget</span>
        <select required name="budget" defaultValue="" aria-label="Monthly budget" className={field}>
          <option value="" disabled>Select a range…</option>
          {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </label>

      {/* "I'm not a robot" check — renders only once the Turnstile site key is set. */}
      <TurnstileField resetKey={attempt} action={`lead-${source}`.slice(0, 32)} className="[&>div]:flex [&>div]:justify-center" />
      {/* A checkbox group can't be `required` in HTML, so "pick a service" is
          enforced server-side — surface the field errors, not just the generic
          "fix the highlighted fields" line, or the visitor can't tell what's wrong. */}
      {state.message && !state.ok ? (
        <p role="alert" className="text-xs text-[var(--color-coral)]">
          {Object.values(state.errors ?? {}).join(" ") || state.message}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-lime)] py-3 font-bold text-[var(--color-ink)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-lime)_82%,#14170e)] disabled:opacity-60">
        {pending ? "Sending…" : submitLabel} <ArrowRight size={16} />
      </button>
      <p className="text-center text-[11px] text-[var(--color-ink-faint)]">No obligation · we reply within one business day. By submitting you agree to be contacted by PPC Guru.</p>
    </form>
  );
}
