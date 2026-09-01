import Anthropic from "@anthropic-ai/sdk";

/**
 * Server-only Anthropic helpers. The API key lives in ANTHROPIC_API_KEY and is
 * NEVER exposed to the client. When the key is absent, callers fall back to
 * deterministic, non-AI output so the tools still work in any environment.
 */

export function hasAnthropicKey() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;
export function getAnthropic() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

// Model tiers — Opus for the premium audit, Haiku for high-volume widgets.
export const MODELS = {
  audit: "claude-opus-4-8",
  fast: "claude-haiku-4-5",
  /** Long-form editorial drafting for the /admin/blog writer. */
  writer: "claude-opus-5",
} as const;

/** Best-effort single-shot completion that returns plain text, or null on failure. */
export async function complete(opts: {
  model: string;
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<string | null> {
  const anthropic = getAnthropic();
  if (!anthropic) return null;
  try {
    const msg = await anthropic.messages.create({
      model: opts.model,
      max_tokens: opts.maxTokens ?? 1024,
      system: opts.system,
      messages: [{ role: "user", content: opts.user }],
    });
    const block = msg.content.find((b) => b.type === "text");
    return block && block.type === "text" ? block.text : null;
  } catch {
    return null;
  }
}

/**
 * Long-form completion for the blog drafter.
 *
 * Streamed rather than awaited in one shot: a full article runs to thousands of
 * output tokens, and a non-streaming request that large risks an HTTP timeout
 * long before the model is finished. Adaptive thinking is on because the draft
 * has to hold a structure — an argument, a heading tree, a table of contents
 * whose anchors match — not just produce fluent prose.
 */
export async function completeLong(opts: {
  model: string;
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<string | null> {
  const anthropic = getAnthropic();
  if (!anthropic) return null;
  try {
    const stream = anthropic.messages.stream({
      model: opts.model,
      max_tokens: opts.maxTokens ?? 32000,
      thinking: { type: "adaptive" },
      system: opts.system,
      messages: [{ role: "user", content: opts.user }],
    });
    const message = await stream.finalMessage();
    const text = message.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");
    return text.trim() || null;
  } catch {
    return null;
  }
}
