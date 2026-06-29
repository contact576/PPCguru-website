"use client";

import { useEffect, useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { captureLead, type LeadState } from "@/app/actions/lead";
import { track } from "@/lib/analytics";

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

  const field = "w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-orange)]";
  return (
    <form action={action} className={compact ? "space-y-2.5" : "space-y-3"}>
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="source" value={source} />
      <input required name="name" placeholder="Name" className={field} />
      <input required type="email" name="email" placeholder="Email" className={field} />
      <div className={compact ? "" : "grid grid-cols-2 gap-3"}>
        <input required name="phone" placeholder="Phone / WhatsApp" className={field} />
        {!compact && <input name="website" placeholder="Website (optional)" className={field} />}
      </div>
      {state.message && !state.ok ? <p className="text-xs text-[var(--color-coral)]">{state.message}</p> : null}
      <button type="submit" disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-orange)] py-3 font-semibold text-white transition-colors hover:bg-[var(--color-orange-deep)] disabled:opacity-60">
        {pending ? "Sending…" : submitLabel} <ArrowRight size={16} />
      </button>
      <p className="text-center text-[11px] text-[var(--color-ink-faint)]">By submitting, you agree to be contacted by PPC Guru. Unsubscribe anytime.</p>
    </form>
  );
}
