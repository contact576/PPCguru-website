/**
 * Team roster — drives the "Meet the team" section on /about.
 *
 * HONESTY: only real people go here. The two founders below are client-confirmed.
 * To add staff, append entries with their REAL name, role and background — and
 * optionally a headshot (drop the image in /public and set `photo`) and a
 * `linkedin` URL. Do not invent team members. The section scales to any count.
 */
export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  /** Short specialties shown as chips (optional). */
  focus?: string[];
  /** Headshot path under /public (e.g. "/team/jaydeep.jpg"); falls back to a monogram. */
  photo?: string;
  /** LinkedIn profile URL (optional). */
  linkedin?: string;
};

export const team: TeamMember[] = [
  {
    name: "Jaydeep Patel",
    role: "Founder & CEO",
    bio: "Jaydeep brings Google-trained thinking and deep Google Ads experience — having reviewed or managed 1,000+ ad accounts across a $20M+ quarterly ad portfolio. He founded PPC Guru to bring that enterprise-grade rigour to local service businesses. He also runs Millennial Events Corp, producing large-scale North American comedy and music tours across 30+ cities — real-world proof of large-scale audience-building.",
    focus: ["Google Ads strategy", "Paid media", "Growth"],
    // photo: "/team/jaydeep-patel.jpg",
    // linkedin: "https://www.linkedin.com/in/...",
  },
  {
    name: "Dhaval Patel",
    role: "Co-founder & Head of Delivery",
    bio: "Dhaval leads delivery and operations, building the AI-augmented systems and playbooks that let PPC Guru produce audits, creative and reporting faster than a traditional agency — without cutting corners.",
    focus: ["AI & automation", "Delivery & ops", "Reporting"],
    // photo: "/team/dhaval-patel.jpg",
    // linkedin: "https://www.linkedin.com/in/...",
  },
];
