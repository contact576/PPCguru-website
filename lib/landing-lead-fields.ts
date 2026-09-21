/** Shared choices and lightweight checks for the landing qualification form. */
export const GTA_EXTRA_BUSINESS_TYPES = [
  { id: "retail-ecommerce", label: "Retail / e-commerce" },
  { id: "other", label: "Other business" },
] as const;

export const GTA_EXTRA_BUDGETS = [
  { id: "recommend", label: "Help me set a budget" },
] as const;

type GtaExtraBusinessType = (typeof GTA_EXTRA_BUSINESS_TYPES)[number]["id"];
type GtaExtraBudget = (typeof GTA_EXTRA_BUDGETS)[number]["id"];
export const GTA_EXTRA_BUSINESS_TYPE_IDS = GTA_EXTRA_BUSINESS_TYPES.map(({ id }) => id) as [GtaExtraBusinessType, ...GtaExtraBusinessType[]];
export const GTA_EXTRA_BUDGET_IDS = GTA_EXTRA_BUDGETS.map(({ id }) => id) as [GtaExtraBudget, ...GtaExtraBudget[]];

export const LANDING_CHANNELS = [
  { id: "google", label: "Google Ads" },
  { id: "meta", label: "Meta Ads" },
  { id: "both", label: "Google + Meta" },
  { id: "recommend", label: "Help me choose" },
] as const;

type LandingChannel = (typeof LANDING_CHANNELS)[number]["id"];
export const LANDING_CHANNEL_IDS = LANDING_CHANNELS.map(({ id }) => id) as [LandingChannel, ...LandingChannel[]];

export function landingChannelLabel(id: string | undefined): string {
  return LANDING_CHANNELS.find((channel) => channel.id === id)?.label ?? "";
}

/** Empty is valid; otherwise accept an HTTP(S) site or an Instagram handle. */
export function normaliseWebOrSocial(raw: string | undefined): string | null {
  const value = (raw ?? "").trim();
  if (!value) return "";
  if (value.startsWith("@")) {
    return /^@[a-zA-Z0-9._]{1,30}$/.test(value) ? `https://instagram.com/${value.slice(1)}` : null;
  }
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`);
    if (!/^https?:$/.test(url.protocol) || !url.hostname.includes(".") || url.username || url.password || /\s/.test(value)) return null;
    return url.href;
  } catch {
    return null;
  }
}

/** Accept common international formatting and an optional phone extension. */
export function isValidLeadPhone(raw: string): boolean {
  const value = raw.trim().replace(/\s*(?:ext\.?|x|#)\s*\d{1,6}$/i, "");
  const digits = value.replace(/\D/g, "");
  return /^\+?[\d\s().-]+$/.test(value) && digits.length >= 7 && digits.length <= 15;
}
