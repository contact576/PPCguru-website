import { redirect } from "next/navigation";
import {
  CURRENT_CLIENT_TERMS_VERSION,
  clientTermsPath,
} from "@/lib/legal/client-service-terms";

/**
 * /client-service-terms — no document of its own; it forwards to the CURRENT
 * version so a typed or guessed URL lands somewhere real.
 *
 * Deliberately a temporary redirect: "current" moves when a revision is
 * published, and the versioned URLs stay permanent. Agreements must always link
 * to the versioned address, never to this one.
 */
export const dynamic = "force-static";

export default function ClientServiceTermsIndex() {
  redirect(clientTermsPath(CURRENT_CLIENT_TERMS_VERSION));
}
