"use client";

/**
 * /ui-kit — internal preview of the installed animation libraries.
 * Verifies the Magic UI + react-bits components build and render with our
 * tokens. Not linked in nav; remove before production or keep as a living
 * style reference. Dark canvas because most of these effects are tuned for it.
 */

import { Marquee } from "@/components/magicui/marquee";
import { BorderBeam } from "@/components/magicui/border-beam";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { AuroraText } from "@/components/magicui/aurora-text";

import ShinyText from "@/components/reactbits/ShinyText";
import GradientText from "@/components/reactbits/GradientText";
import BlurText from "@/components/reactbits/BlurText";
import RotatingText from "@/components/reactbits/RotatingText";
import SplitText from "@/components/reactbits/SplitText";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{children}</p>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8">
      <Label>{title}</Label>
      <div className="flex min-h-24 flex-col items-start justify-center gap-3">{children}</div>
    </div>
  );
}

export default function UiKitPage() {
  return (
    <main className="min-h-screen bg-[#08070b] px-6 py-28 text-white md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange-400">UI Kit · internal</p>
        <h1 className="mt-3 text-4xl font-bold md:text-6xl">
          Installed libraries —{" "}
          <AuroraText>live preview</AuroraText>
        </h1>
        <p className="mt-4 max-w-2xl text-white/60">
          Magic UI + react-bits components, vendored from source and wired to our tokens.
          Engines (GSAP, Motion, Lenis, R3F) already in the project.
        </p>

        {/* Marquee */}
        <section className="mt-14">
          <Label>Magic UI · Marquee</Label>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] py-6">
            <Marquee pauseOnHover className="[--duration:25s]">
              {["Google Ads", "Meta Ads", "SEO", "Looker Studio", "GA4", "HubSpot"].map((t) => (
                <span key={t} className="mx-6 text-lg font-semibold text-white/70">{t}</span>
              ))}
            </Marquee>
          </div>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title="Magic UI · Border Beam">
            <div className="relative h-28 w-full rounded-xl border border-white/10 bg-black/40">
              <div className="flex h-full items-center justify-center text-white/70">Animated border</div>
              <BorderBeam size={70} duration={6} colorFrom="#ff6a2b" colorTo="#ffb43d" />
            </div>
          </Card>

          <Card title="Magic UI · Animated Shiny Text">
            <AnimatedShinyText className="text-lg">✨ Now booking Q3 growth sprints</AnimatedShinyText>
          </Card>

          <Card title="Magic UI · Animated Gradient Text">
            <AnimatedGradientText className="text-3xl font-bold">Performance, measured.</AnimatedGradientText>
          </Card>

          <Card title="Magic UI · Number Ticker">
            <div className="text-5xl font-bold">
              <NumberTicker value={4200} className="text-white" />
              <span className="text-orange-400">+ leads</span>
            </div>
          </Card>

          <Card title="Magic UI · Shimmer Button">
            <ShimmerButton background="#ff6a2b">
              <span className="text-sm font-semibold text-[#120600]">Get your free audit</span>
            </ShimmerButton>
          </Card>

          <Card title="react-bits · Shiny Text">
            <ShinyText text="Turn ad spend into booked revenue" className="text-xl" />
          </Card>

          <Card title="react-bits · Gradient Text">
            <GradientText className="text-2xl font-bold">AI-augmented PPC</GradientText>
          </Card>

          <Card title="react-bits · Rotating Text">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <span>More</span>
              <RotatingText
                texts={["leads", "calls", "booked jobs", "revenue"]}
                mainClassName="rounded-lg bg-orange-500/90 px-2 text-[#120600]"
                rotationInterval={2200}
              />
            </div>
          </Card>

          <Card title="react-bits · Split Text">
            <SplitText text="Every click accounted for." className="text-2xl font-bold" />
          </Card>

          <Card title="react-bits · Blur Text">
            <BlurText text="Transparent reporting, every week." className="text-2xl font-bold" />
          </Card>
        </div>

        <section className="mt-6">
          <Card title="react-bits · Animated Content (scroll-reveal wrapper)">
            <AnimatedContent>
              <p className="text-lg text-white/80">This block animates in on scroll.</p>
            </AnimatedContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
