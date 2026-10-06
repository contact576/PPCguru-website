import { cookies } from "next/headers";
import { cleanEventId } from "@/lib/conversion-context";
import { GTA_LANDING_SOURCE, GTA_LANDING_THANK_YOU_PATH } from "@/lib/data/landing-gta";
import { GOOGLE_META_LANDING_SOURCE, GOOGLE_META_LANDING_THANK_YOU_PATH } from "@/lib/data/landing-google-meta";

const RECEIPTS = {
  [GTA_LANDING_SOURCE]: { cookie: "ppcg_gta_receipt", path: GTA_LANDING_THANK_YOU_PATH },
  [GOOGLE_META_LANDING_SOURCE]: { cookie: "ppcg_google_meta_receipt", path: GOOGLE_META_LANDING_THANK_YOU_PATH },
} as const;
type ConfirmedLandingSource = keyof typeof RECEIPTS;

/** Set only after a submission is durably accepted; contains no contact details. */
export async function setLandingConversionReceipt(eventId: unknown, source: ConfirmedLandingSource = GTA_LANDING_SOURCE): Promise<void> {
  const id = cleanEventId(eventId);
  if (!id) return;
  const store = await cookies();
  const receipt = RECEIPTS[source];
  store.set(receipt.cookie, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: receipt.path,
    maxAge: 5 * 60,
  });
}

/** A receipt alone is insufficient: the browser must match its pending event id. */
export async function readLandingConversionReceipt(source: ConfirmedLandingSource = GTA_LANDING_SOURCE): Promise<string | undefined> {
  const store = await cookies();
  return cleanEventId(store.get(RECEIPTS[source].cookie)?.value);
}
