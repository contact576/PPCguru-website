import { cookies } from "next/headers";
import { cleanEventId } from "@/lib/conversion-context";
import { GTA_LANDING_THANK_YOU_PATH } from "@/lib/data/landing-gta";

const RECEIPT_COOKIE = "ppcg_gta_receipt";

/** Set only after a submission is durably accepted; contains no contact details. */
export async function setLandingConversionReceipt(eventId: unknown): Promise<void> {
  const id = cleanEventId(eventId);
  if (!id) return;
  const store = await cookies();
  store.set(RECEIPT_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: GTA_LANDING_THANK_YOU_PATH,
    maxAge: 5 * 60,
  });
}

/** A receipt alone is insufficient: the browser must match its pending event id. */
export async function readLandingConversionReceipt(): Promise<string | undefined> {
  const store = await cookies();
  return cleanEventId(store.get(RECEIPT_COOKIE)?.value);
}
