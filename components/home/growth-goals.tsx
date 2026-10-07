"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MousePointer2, Target, UsersRound } from "lucide-react";
import "./growth-goals.css";

const goals = [
  {
    id: "enquiries",
    label: "More enquiries",
    hint: "Reach people who need what you do.",
    icon: UsersRound,
    heading: "Get in front of your next customer.",
    description: "Connect the right audience with a clear reason to choose you, then make it easy to get in touch.",
    platforms: [
      { src: "/platforms/google-ads.svg", name: "Google Ads" },
      { src: "/platforms/meta.svg", name: "Meta Ads" },
      { src: "/platforms/google-maps.svg", name: "Local search" },
    ],
    priorities: [
      { title: "Capture demand", detail: "Reach people searching for your services with Google Ads.", href: "/services/google-ads" },
      { title: "Create interest", detail: "Give the right audiences a reason to act on Facebook and Instagram.", href: "/services/meta-ads" },
      { title: "Build local visibility", detail: "Help nearby customers find your business through local SEO.", href: "/services/seo" },
    ],
  },
  {
    id: "quality",
    label: "Better-fit leads",
    hint: "Spend more time on the right conversations.",
    icon: Target,
    heading: "Make the right people want to talk.",
    description: "Help prospects understand your offer before they enquire, and give your team the context to follow up.",
    platforms: [
      { src: "/platforms/google-ads.svg", name: "Google Ads" },
      { src: "/platforms/meta.svg", name: "Meta Ads" },
      { src: "/platforms/google-analytics.svg", name: "Google Analytics" },
    ],
    priorities: [
      { title: "Refine who you reach", detail: "Review search intent, targeting and the promise in your ads.", href: "/services/google-ads" },
      { title: "Make the fit clear", detail: "Explain who you help, what you offer and what happens next.", href: "/services/web-design" },
      { title: "Connect the follow-up", detail: "Bring enquiry details and next steps into your CRM workflow.", href: "/services/crm" },
    ],
  },
  {
    id: "website",
    label: "More from my website",
    hint: "Give your existing traffic a clearer next step.",
    icon: MousePointer2,
    heading: "Turn interest into a clear next step.",
    description: "Look at the journey after the click: the message, the proof, the page experience and the path to an enquiry.",
    platforms: [
      { src: "/platforms/wordpress.svg", name: "WordPress" },
      { src: "/platforms/google-tag-manager.svg", name: "Google Tag Manager" },
      { src: "/platforms/google-analytics.svg", name: "Google Analytics" },
    ],
    priorities: [
      { title: "Match the message", detail: "Make your page answer the promise that brought someone there.", href: "/services/web-design" },
      { title: "Remove the friction", detail: "Make mobile pages, forms and calls to action easier to use.", href: "/services/web-design" },
      { title: "Track what matters", detail: "Connect enquiry tracking and follow-up so you can see the next opportunity.", href: "/services/crm" },
    ],
  },
] as const;

export function GrowthGoals() {
  const [selected, setSelected] = useState(0);
  const goal = goals[selected];

  return (
    <section className="home-growth-goals home-section" id="growth-plan" aria-labelledby="home-growth-goals-title">
      <div className="home-wrap">
        <div className="home-goal-layout">
          <div className="home-goal-left">
            <div className="home-goal-intro">
              <p className="home-kicker">Start with your ambition</p>
              <h2 id="home-growth-goals-title">Where would you<br />like to <em>grow?</em></h2>
              <p>You know where you want to go. Choose your priority to see where we would start.</p>
            </div>
            <div className="home-goal-options" role="group" aria-label="Choose your growth priority">
            {goals.map((item, index) => {
              const Icon = item.icon;
              const active = selected === index;
              return (
                <button
                  className="home-goal-choice"
                  type="button"
                  key={item.id}
                  aria-pressed={active}
                  aria-controls="home-goal-plan"
                  onClick={() => setSelected(index)}
                >
                  <span className="home-goal-choice-icon"><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></span>
                  <span className="home-goal-choice-copy"><strong>{item.label}</strong><small>{item.hint}</small></span>
                  <span className="home-goal-choice-arrow" aria-hidden="true">{active ? <Check size={18} /> : <ArrowRight size={18} />}</span>
                </button>
              );
            })}
            </div>
          </div>

          <span className="home-goal-announcement" aria-live="polite" aria-atomic="true">{goal.heading}</span>
          <div className="home-goal-plan" id="home-goal-plan" role="region" aria-labelledby="home-goal-plan-title">
            <div className="home-goal-plan-top"><span>Your starting point</span><span>0{selected + 1} / 03</span></div>
            <div className="home-goal-plan-content" key={goal.id}>
              <div className="home-goal-platforms" aria-label="Relevant platforms">
                {goal.platforms.map((platform) => <span key={platform.name} title={platform.name}><Image src={platform.src} width={28} height={28} alt={platform.name} /></span>)}
              </div>
              <h3 id="home-goal-plan-title">{goal.heading}</h3>
              <p className="home-goal-description">{goal.description}</p>
              <ol className="home-goal-roadmap">
                {goal.priorities.map((priority, index) => (
                  <li key={priority.title}>
                    <span className="home-goal-step" aria-hidden="true">0{index + 1}</span>
                    <Link href={priority.href}><span><strong>{priority.title}</strong><small>{priority.detail}</small></span><ArrowRight size={17} aria-hidden="true" /></Link>
                  </li>
                ))}
              </ol>
            </div>
            <div className="home-goal-plan-action"><a className="home-button home-button-dark" href="#audit">Find my growth opportunities <ArrowRight size={17} aria-hidden="true" /></a><span>Start with a free website &amp; ads audit.</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
