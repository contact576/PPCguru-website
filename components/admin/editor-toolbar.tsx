"use client";

/**
 * Formatting toolbar for the blog post editor.
 *
 * The editor stores Markdown (with raw HTML allowed — see `rehype-raw` in the
 * preview + on `/blog/[slug]`). Writers should never have to remember syntax:
 * every button below rewrites the textarea selection for them, and the same
 * actions are bound to the usual keyboard shortcuts.
 */

import { useEffect, useRef, useState } from "react";
import GithubSlugger from "github-slugger";
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link2, Table, Minus, HelpCircle, Code2, ListTree, X,
} from "lucide-react";

export type EditorAction =
  | { kind: "wrap"; before: string; after: string; placeholder: string }
  | { kind: "heading"; level: number }
  | { kind: "linePrefix"; prefix: string; ordered?: boolean; placeholder: string }
  | { kind: "block"; text: string }
  /** Replaces the current selection verbatim (used by the link dialog). */
  | { kind: "replace"; text: string };

/** Headings in the draft, with the same ids `rehype-slug` will emit on the live post. */
export type Heading = { level: number; text: string; id: string };

export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  for (const line of markdown.split("\n")) {
    const md = /^(#{1,6})\s+(.+?)\s*#*$/.exec(line);
    const html = /<h([1-6])[^>]*>(.*?)<\/h\1>/i.exec(line);
    const level = md ? md[1].length : html ? Number(html[1]) : 0;
    if (!level) continue;
    const text = (md ? md[2] : html![2])
      .replace(/<[^>]+>/g, "")
      .replace(/[*_`]/g, "")
      .trim();
    if (text) out.push({ level, text, id: slugger.slug(text) });
  }
  return out;
}

/** Applies an action to a textarea, preserving the browser's native undo stack. */
export function applyAction(
  ta: HTMLTextAreaElement,
  action: EditorAction,
  fallback: (next: string) => void,
) {
  const value = ta.value;
  const selStart = ta.selectionStart;
  const selEnd = ta.selectionEnd;

  let from = selStart;
  let to = selEnd;
  let insert = "";
  let cursorFrom = 0;
  let cursorTo = 0;

  if (action.kind === "wrap") {
    const selected = value.slice(selStart, selEnd);
    const body = selected || action.placeholder;
    const { before, after } = action;
    // Toggle off when the selection is already wrapped.
    const outerBefore = value.slice(Math.max(0, selStart - before.length), selStart);
    const outerAfter = value.slice(selEnd, selEnd + after.length);
    if (selected && outerBefore === before && outerAfter === after) {
      from = selStart - before.length;
      to = selEnd + after.length;
      insert = selected;
      cursorFrom = from;
      cursorTo = from + selected.length;
    } else if (selected.startsWith(before) && selected.endsWith(after) && selected.length > before.length + after.length) {
      insert = selected.slice(before.length, selected.length - after.length);
      cursorFrom = from;
      cursorTo = from + insert.length;
    } else {
      insert = before + body + after;
      cursorFrom = from + before.length;
      cursorTo = cursorFrom + body.length;
    }
  } else if (action.kind === "heading" || action.kind === "linePrefix") {
    // Expand the range to whole lines, then add/remove the prefix on each.
    const lineStart = value.lastIndexOf("\n", selStart - 1) + 1;
    let lineEnd = value.indexOf("\n", selEnd);
    if (lineEnd === -1) lineEnd = value.length;
    const lines = value.slice(lineStart, lineEnd).split("\n");

    if (action.kind === "heading") {
      const want = "#".repeat(action.level) + " ";
      const allSet = lines.every((l) => l.startsWith(want));
      insert = lines
        .map((l) => {
          const bare = l.replace(/^#{1,6}\s+/, "");
          return allSet ? bare : want + (bare || "Heading");
        })
        .join("\n");
    } else {
      const strip = /^(\s*)(?:[-*+]\s+|\d+\.\s+|>\s+)/;
      const has = lines.every((l) => l.trim() === "" || strip.test(l));
      insert = lines
        .map((l, i) => {
          const bare = l.replace(strip, "$1");
          if (has) return bare;
          const prefix = action.ordered ? `${i + 1}. ` : action.prefix;
          return prefix + (bare.trim() ? bare : action.placeholder);
        })
        .join("\n");
    }
    from = lineStart;
    to = lineEnd;
    cursorFrom = lineStart;
    cursorTo = lineStart + insert.length;
  } else if (action.kind === "replace") {
    insert = action.text;
    cursorFrom = cursorTo = from + insert.length;
  } else {
    const needsLeading = selStart > 0 && !value.slice(0, selStart).endsWith("\n\n");
    const needsTrailing = !value.slice(selEnd).startsWith("\n");
    insert = (needsLeading ? "\n\n" : "") + action.text + (needsTrailing ? "\n\n" : "");
    cursorFrom = cursorTo = from + insert.length;
  }

  ta.focus();
  ta.setSelectionRange(from, to);
  // execCommand keeps Ctrl+Z working; React's onChange still fires from it.
  const ok = document.execCommand("insertText", false, insert);
  if (!ok) fallback(value.slice(0, from) + insert + value.slice(to));
  requestAnimationFrame(() => ta.setSelectionRange(cursorFrom, cursorTo));
}

export const ACTIONS: Record<string, EditorAction> = {
  h1: { kind: "heading", level: 1 },
  h2: { kind: "heading", level: 2 },
  h3: { kind: "heading", level: 3 },
  bold: { kind: "wrap", before: "**", after: "**", placeholder: "bold text" },
  italic: { kind: "wrap", before: "_", after: "_", placeholder: "italic text" },
  strike: { kind: "wrap", before: "~~", after: "~~", placeholder: "struck text" },
  code: { kind: "wrap", before: "`", after: "`", placeholder: "code" },
  link: { kind: "wrap", before: "[", after: "](https://)", placeholder: "link text" },
  ul: { kind: "linePrefix", prefix: "- ", placeholder: "List item" },
  ol: { kind: "linePrefix", prefix: "1. ", ordered: true, placeholder: "List item" },
  quote: { kind: "linePrefix", prefix: "> ", placeholder: "Quote" },
  hr: { kind: "block", text: "---" },
  table: {
    kind: "block",
    text: "| Column | Column |\n| --- | --- |\n| Cell | Cell |\n| Cell | Cell |",
  },
  html: {
    kind: "block",
    text: '<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">\n  Custom HTML block — edit freely.\n</div>',
  },
};

/**
 * Ctrl/Cmd shortcuts, applied from the textarea's onKeyDown.
 * Returns "link" (rather than an action) so the caller can open the link dialog.
 */
export function shortcutFor(e: React.KeyboardEvent): EditorAction | "link" | null {
  if (!(e.ctrlKey || e.metaKey)) return null;
  const k = e.key.toLowerCase();
  if (k === "b") return ACTIONS.bold;
  if (k === "i") return ACTIONS.italic;
  if (k === "k") return "link";
  if (e.altKey && k === "1") return ACTIONS.h1;
  if (e.altKey && k === "2") return ACTIONS.h2;
  if (e.altKey && k === "3") return ACTIONS.h3;
  return null;
}

const GROUPS: { key: string; icon: typeof Bold; title: string }[][] = [
  [
    { key: "h1", icon: Heading1, title: "Heading 1  (Ctrl+Alt+1)" },
    { key: "h2", icon: Heading2, title: "Heading 2  (Ctrl+Alt+2)" },
    { key: "h3", icon: Heading3, title: "Heading 3  (Ctrl+Alt+3)" },
  ],
  [
    { key: "bold", icon: Bold, title: "Bold  (Ctrl+B)" },
    { key: "italic", icon: Italic, title: "Italic  (Ctrl+I)" },
    { key: "strike", icon: Strikethrough, title: "Strikethrough" },
    { key: "code", icon: Code, title: "Inline code" },
  ],
  [
    { key: "ul", icon: List, title: "Bullet list" },
    { key: "ol", icon: ListOrdered, title: "Numbered list" },
    { key: "quote", icon: Quote, title: "Quote" },
  ],
  [
    { key: "link", icon: Link2, title: "Insert link  (Ctrl+K)" },
    { key: "toc", icon: ListTree, title: "Insert table of contents (links to every heading)" },
    { key: "table", icon: Table, title: "Table" },
    { key: "hr", icon: Minus, title: "Divider" },
    { key: "html", icon: Code2, title: "Raw HTML block" },
  ],
];

/** Builds a nested bullet list linking to every heading in the draft. */
function tocMarkdown(headings: Heading[]): string {
  if (!headings.length) return "";
  const base = Math.min(...headings.map((h) => h.level));
  return headings
    .map((h) => `${"  ".repeat(Math.min(h.level - base, 3))}- [${h.text}](#${h.id})`)
    .join("\n");
}

type LinkMode = "url" | "section" | "email";

export function EditorToolbar({
  onAction,
  content,
  getSelection,
  linkSignal = 0,
}: {
  onAction: (a: EditorAction) => void;
  /** Current draft — used to list headings for in-page anchor links + the TOC. */
  content: string;
  /** Returns the text currently selected in the editor (pre-fills the link label). */
  getSelection: () => string;
  /** Increment to open the link dialog from outside (Ctrl+K). */
  linkSignal?: number;
}) {
  const [help, setHelp] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [mode, setMode] = useState<LinkMode>("url");
  const [text, setText] = useState("");
  const [href, setHref] = useState("");
  const [section, setSection] = useState("");
  const [newTab, setNewTab] = useState(false);
  const urlRef = useRef<HTMLInputElement>(null);

  const headings = extractHeadings(content);

  function openLink() {
    const sel = getSelection().trim();
    setText(sel);
    setHref("");
    setSection(headings[0]?.id ?? "");
    setMode("url");
    setNewTab(false);
    setLinkOpen(true);
  }

  // Ctrl+K from the textarea bumps linkSignal.
  useEffect(() => {
    if (linkSignal > 0) openLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkSignal]);

  useEffect(() => {
    if (linkOpen) requestAnimationFrame(() => urlRef.current?.focus());
  }, [linkOpen, mode]);

  function insertLink() {
    let target = "";
    if (mode === "section") target = section ? `#${section}` : "";
    else if (mode === "email") target = href.trim() ? `mailto:${href.trim()}` : "";
    else {
      const raw = href.trim();
      // Bare domains are the common paste — make them absolute so they don't
      // resolve as a relative path on ppcguru.ca.
      target = !raw || /^(https?:|mailto:|tel:|[/#])/i.test(raw) ? raw : `https://${raw}`;
    }
    if (!target) return;
    const label = text.trim() || target.replace(/^https?:\/\//, "");
    // Markdown has no target attribute — fall back to an anchor tag for new tabs.
    const md =
      newTab && mode === "url"
        ? `<a href="${target}" target="_blank" rel="noopener noreferrer">${label}</a>`
        : `[${label}](${target})`;
    onAction({ kind: "replace", text: md });
    setLinkOpen(false);
  }

  function handle(key: string) {
    if (key === "link") return openLink();
    if (key === "toc") {
      const md = tocMarkdown(headings);
      return onAction({ kind: "block", text: md || "_Add some headings first, then insert the contents list._" });
    }
    onAction(ACTIONS[key]);
  }

  const btn =
    "flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-ink-dim)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]";
  const dlgField =
    "w-full rounded-lg border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-ink)]";

  return (
    <div className="relative rounded-t-xl border border-b-0 border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex flex-wrap items-center gap-1 p-1.5">
        {GROUPS.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <span className="mx-1 h-5 w-px bg-[var(--color-border)]" />}
            {group.map(({ key, icon: Icon, title }) => (
              <button
                key={key}
                type="button"
                title={title}
                aria-label={title}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handle(key)}
                className={btn}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setHelp((v) => !v)}
          className={`ml-auto flex items-center gap-1.5 rounded-lg px-2 text-[12px] ${help ? "text-[var(--color-ink)]" : "text-[var(--color-ink-faint)]"} hover:text-[var(--color-ink)]`}
        >
          <HelpCircle size={14} /> Formatting help
        </button>
      </div>

      {linkOpen && (
        <div className="absolute left-2 right-2 top-[46px] z-20 rounded-xl border border-[var(--color-border)] bg-white p-3 shadow-lg sm:left-auto sm:right-3 sm:w-[380px]">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="mono text-[11px] font-semibold uppercase tracking-[.08em] text-[var(--color-ink-faint)]">Insert link</span>
            <button type="button" onClick={() => setLinkOpen(false)} className="text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]"><X size={15} /></button>
          </div>

          <div className="mb-2.5 flex rounded-lg border border-[var(--color-border)] p-0.5">
            {([
              ["url", "Web page"],
              ["section", "Section in this post"],
              ["email", "Email"],
            ] as [LinkMode, string][]).map(([m, lbl]) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-md px-2 py-1 text-[12px] ${mode === m ? "bg-[var(--color-ink)] font-semibold text-[var(--color-base)]" : "text-[var(--color-ink-dim)]"}`}
              >
                {lbl}
              </button>
            ))}
          </div>

          <label className="mono mb-1 block text-[11px] uppercase tracking-[.06em] text-[var(--color-ink-faint)]">Link text</label>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Text readers will click" className={`${dlgField} mb-2.5`} />

          {mode === "section" ? (
            headings.length ? (
              <>
                <label className="mono mb-1 block text-[11px] uppercase tracking-[.06em] text-[var(--color-ink-faint)]">Jump to heading</label>
                <select value={section} onChange={(e) => setSection(e.target.value)} className={dlgField}>
                  {headings.map((h) => (
                    <option key={h.id} value={h.id}>{"— ".repeat(Math.max(0, h.level - 1))}{h.text}</option>
                  ))}
                </select>
              </>
            ) : (
              <p className="rounded-lg bg-[var(--color-surface-2)] p-2.5 text-[12.5px] text-[var(--color-ink-dim)]">
                No headings in this post yet. Add an H2 or H3 first — every heading automatically becomes a jump target.
              </p>
            )
          ) : (
            <>
              <label className="mono mb-1 block text-[11px] uppercase tracking-[.06em] text-[var(--color-ink-faint)]">
                {mode === "email" ? "Email address" : "Address"}
              </label>
              <input
                ref={urlRef}
                value={href}
                onChange={(e) => setHref(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insertLink(); } }}
                placeholder={mode === "email" ? "contact@ppcguru.ca" : "ppcguru.ca/services  or  /contact  or  https://…"}
                className={dlgField}
              />
              {mode === "url" && (
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-[13px] text-[var(--color-ink-dim)]">
                  <input type="checkbox" checked={newTab} onChange={(e) => setNewTab(e.target.checked)} className="h-3.5 w-3.5 accent-[var(--color-ink)]" />
                  Open in a new tab
                </label>
              )}
            </>
          )}

          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={() => setLinkOpen(false)} className="rounded-lg px-3 py-1.5 text-[13px] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]">Cancel</button>
            <button
              type="button"
              onClick={insertLink}
              disabled={mode === "section" ? !section : !href.trim()}
              className="mono rounded-lg bg-[var(--color-ink)] px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[.06em] text-[var(--color-base)] disabled:opacity-40"
            >
              Insert
            </button>
          </div>
        </div>
      )}

      {help && (
        <div className="grid gap-x-8 gap-y-1.5 border-t border-[var(--color-border)] px-3 py-3 text-[12.5px] text-[var(--color-ink-dim)] sm:grid-cols-2">
          {[
            ["# Big heading", "H1"],
            ["## Section heading", "H2"],
            ["**bold**  ·  _italic_", "bold / italic"],
            ["[text](https://url)", "link"],
            ["[text](#section-name)", "jump to a heading on this page"],
            ["- item", "bullet list"],
            ["1. item", "numbered list"],
            ["> quoted line", "quote"],
            ["![alt](image-url)", "image (or use Insert image)"],
            ["`code`", "inline code"],
            ["---", "divider"],
          ].map(([syntax, what]) => (
            <div key={syntax} className="flex items-baseline gap-2">
              <code className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 font-mono text-[11.5px] text-[var(--color-ink)]">{syntax}</code>
              <span className="text-[var(--color-ink-faint)]">{what}</span>
            </div>
          ))}
          <p className="sm:col-span-2 mt-1 text-[var(--color-ink-faint)]">
            Raw HTML works too — <code className="font-mono">&lt;h1&gt;</code>, <code className="font-mono">&lt;b&gt;</code>,{" "}
            <code className="font-mono">&lt;div class=&quot;…&quot;&gt;</code> and Tailwind classes all render on the live post.
          </p>
        </div>
      )}
    </div>
  );
}
