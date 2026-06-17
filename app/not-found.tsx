import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-warm-wash" />
      <div className="relative">
        <p className="font-display text-8xl font-bold text-gradient md:text-9xl">404</p>
        <h1 className="mt-4 text-2xl font-bold md:text-3xl">This page didn&apos;t convert</h1>
        <p className="mx-auto mt-3 max-w-md text-[var(--color-ink-dim)]">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/">Back to home</Button>
          <Button href="/tools" variant="outline">Try our free tools</Button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--color-ink-faint)]">
          <Link href="/services" className="hover:text-[var(--color-ink)]">Services</Link>
          <Link href="/industries" className="hover:text-[var(--color-ink)]">Industries</Link>
          <Link href="/results" className="hover:text-[var(--color-ink)]">Results</Link>
          <Link href="/contact" className="hover:text-[var(--color-ink)]">Contact</Link>
        </div>
      </div>
    </section>
  );
}
