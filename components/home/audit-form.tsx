"use client";

import { useState } from "react";
import { captureLead } from "@/app/actions/lead";
import { TurnstileField } from "@/components/shared/turnstile-field";

const track = (event: string, data?: Record<string, unknown>) => {
  try {
    type DL = { dataLayer?: Array<Record<string, unknown>> };
    const w = window as unknown as DL;
    (w.dataLayer = w.dataLayer || []).push({ event, ...(data || {}) });
  } catch { /* no-op until GA4/GTM wired */ }
};

const NEED = ["Google Ads", "Meta Ads", "SEO", "Landing Pages", "Tracking", "CRM / follow-up", "Full audit"];
const SPEND = ["Not running ads yet", "Under $1,000", "$1,000–$5,000", "$5,000–$15,000", "$15,000+"];
const ISSUE = ["Leads too expensive", "Leads low quality", "Tracking unclear", "Agency not transparent", "Need more booked calls", "Need landing-page help"];
const CONTACT = ["WhatsApp", "Email", "Phone"];

const input: React.CSSProperties = { width: "100%", background: "#fbfaf2", border: "1.5px solid #e3e0d0", color: "#14170e", fontSize: 14, padding: "13px 14px", borderRadius: 12, fontFamily: "inherit" };

function Opt({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ textAlign: "left", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: "14px 16px", borderRadius: 12, fontFamily: "inherit", background: active ? "#ceff3a" : "#fff", color: active ? "#14170e" : "#3a3c30", border: `1.5px solid ${active ? "#14170e" : "#e3e0d0"}`, transition: "transform .12s" }}>{label}</button>
  );
}

const back: React.CSSProperties = { marginTop: 18, background: "transparent", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: "#83856f" };

export function AuditForm() {
  const [step, setStep] = useState(1);
  const [need, setNeed] = useState("");
  const [spend, setSpend] = useState("");
  const [issue, setIssue] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [contact, setContact] = useState("WhatsApp");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Anti-spam. This form posts hand-built FormData rather than the DOM form, so
  // the Turnstile token arrives via callback instead of a hidden input.
  const [token, setToken] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [renderedAt] = useState(() => String(Date.now()));

  const pick = (field: string, value: string, set: (v: string) => void) => {
    set(value); setError("");
    track("audit_form_step", { field, value });
    if (step < 4) setTimeout(() => setStep((s) => Math.min(4, s + 1)), 170);
  };

  const submit = async () => {
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (!name.trim() || !emailOk) { setError("Please enter your name and a valid business email."); return; }
    setSubmitting(true); setError("");
    // Persist via the shared lead action (Resend when configured, logs otherwise),
    // packing the qualifying answers into `detail`.
    const fd = new FormData();
    fd.set("name", name.trim());
    fd.set("email", email.trim());
    fd.set("phone", phone.trim());
    fd.set("website", website.trim());
    fd.set("source", "home:audit");
    fd.set("detail", `Need: ${need || "—"} · Monthly spend: ${spend || "—"} · Main issue: ${issue || "—"} · Preferred contact: ${contact}`);
    fd.set("turnstileToken", token);
    fd.set("renderedAt", renderedAt);
    const res = await captureLead({ ok: false, message: "" }, fd);
    setSubmitting(false);
    if (res.ok) {
      track("audit_form_submit", { need, spend, issue });
      setDone(true);
    } else {
      // Spent token → force a fresh challenge before they retry.
      setAttempt((n) => n + 1);
      setError(res.message || "We couldn't submit that right now. Please try again.");
    }
  };

  return (
    <div data-reveal style={{ background: "#fff", border: "1px solid #e3e0d0", borderRadius: 24, padding: 30, boxShadow: "0 22px 54px rgba(20,23,14,.08)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span className="mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#83856f" }}>Step {Math.min(step, 4)} of 4</span>
        <span className="mono" style={{ fontSize: 11, color: "#6f7d22", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" }}>Free · ~30 sec</span>
      </div>
      <div style={{ height: 6, background: "#ececdf", borderRadius: 999, overflow: "hidden", marginBottom: 26 }}>
        <div style={{ height: "100%", background: "#ceff3a", borderRadius: 999, width: `${(step / 4) * 100}%`, transition: "width .35s cubic-bezier(.22,1,.36,1)" }} />
      </div>

      {done ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div style={{ width: 62, height: 62, borderRadius: "50%", background: "#ceff3a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 18px" }}>✓</div>
          <h3 className="head" style={{ fontSize: 24, marginBottom: 10 }}>Request received</h3>
          <p style={{ fontSize: 15, color: "#54564a", lineHeight: 1.6, maxWidth: 360, margin: "0 auto" }}>Thanks {name || "—"} — we&rsquo;ll review your accounts and reply within one business day with clear next steps.</p>
        </div>
      ) : step === 1 ? (
        <div>
          <h3 className="head" style={{ fontSize: 21, marginBottom: 16 }}>What do you need help with?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {NEED.map((o) => <Opt key={o} label={o} active={need === o} onClick={() => pick("Need", o, setNeed)} />)}
          </div>
        </div>
      ) : step === 2 ? (
        <div>
          <h3 className="head" style={{ fontSize: 21, marginBottom: 16 }}>Monthly ad spend?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {SPEND.map((o) => <Opt key={o} label={o} active={spend === o} onClick={() => pick("Spend", o, setSpend)} />)}
          </div>
          <button type="button" onClick={() => setStep(1)} className="mono" style={back}>← Back</button>
        </div>
      ) : step === 3 ? (
        <div>
          <h3 className="head" style={{ fontSize: 21, marginBottom: 16 }}>What&rsquo;s the main issue?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {ISSUE.map((o) => <Opt key={o} label={o} active={issue === o} onClick={() => pick("Issue", o, setIssue)} />)}
          </div>
          <button type="button" onClick={() => setStep(2)} className="mono" style={back}>← Back</button>
        </div>
      ) : (
        <div>
          <h3 className="head" style={{ fontSize: 21, marginBottom: 16 }}>Where do we send your audit?</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <input value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Full name" aria-label="Full name" style={input} />
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="Business email" aria-label="Business email" style={input} />
            <div className="grid grid-cols-1 gap-[11px] sm:grid-cols-2">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone / WhatsApp" aria-label="Phone or WhatsApp" style={input} />
              <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website URL" aria-label="Website URL" style={input} />
            </div>
            <div style={{ marginTop: 4 }}>
              <div className="mono" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#83856f", marginBottom: 8 }}>Preferred contact</div>
              <div style={{ display: "flex", gap: 8 }}>
                {CONTACT.map((c) => (
                  <button key={c} type="button" onClick={() => setContact(c)} style={{ flex: 1, cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 11, borderRadius: 11, fontFamily: "inherit", background: contact === c ? "#14170e" : "#fff", color: contact === c ? "#f1efe3" : "#3a3c30", border: `1.5px solid ${contact === c ? "#14170e" : "#e3e0d0"}` }}>{c}</button>
                ))}
              </div>
            </div>
          </div>
          {/* "I'm not a robot" check — renders only once the Turnstile site key is set. */}
          <TurnstileField resetKey={attempt} onToken={setToken} action="home-audit" className="mt-4" />
          {error && <div style={{ marginTop: 14, fontSize: 13, color: "#c0531f", fontWeight: 600 }}>{error}</div>}
          <button type="button" onClick={submit} disabled={submitting} className="mono" style={{ marginTop: 18, width: "100%", background: "#ceff3a", color: "#14170e", fontWeight: 700, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", padding: 16, borderRadius: 13, cursor: submitting ? "wait" : "pointer", border: "none", boxShadow: "0 10px 28px rgba(206,255,58,.35)", opacity: submitting ? 0.7 : 1 }}>{submitting ? "Sending…" : "Send my free PPC audit request"}</button>
          <p style={{ fontSize: 11, color: "#83856f", marginTop: 12, lineHeight: 1.5 }}>By submitting, you agree to be contacted by PPC Guru about your audit request. No spam — unsubscribe anytime.</p>
          <button type="button" onClick={() => setStep(3)} className="mono" style={{ ...back, marginTop: 10 }}>← Back</button>
        </div>
      )}
    </div>
  );
}
