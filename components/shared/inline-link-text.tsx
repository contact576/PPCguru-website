import Link from "next/link";

export type InlineLink = {
  href: string;
  text: string;
};

/** Render one editorial link inside otherwise plain-text content. */
export function InlineLinkText({ text, link }: { text: string; link?: InlineLink }) {
  if (!link) return <>{text}</>;

  const start = text.indexOf(link.text);
  if (start === -1) return <>{text}</>;

  const end = start + link.text.length;
  return (
    <>
      {text.slice(0, start)}
      <Link
        href={link.href}
        className="font-semibold text-[var(--accent-strong)] underline decoration-[var(--accent-line)] underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
      >
        {link.text}
      </Link>
      {text.slice(end)}
    </>
  );
}
