/**
 * Team roster — drives the "Meet the team" section on /about.
 *
 * HONESTY: only real people go here. Names and roles are client-confirmed.
 * To add staff, append entries with their REAL name, role and background — and
 * optionally a headshot (drop the image in /public/team and set `photo`) and a
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
    role: "Co-founder & CMO",
    bio: "Dhaval owns marketing strategy and brand at PPC Guru, shaping how the agency goes to market and building the AI-augmented systems and playbooks that let a senior team produce audits, creative and reporting faster than a traditional shop — without cutting corners.",
    focus: ["Marketing strategy", "Brand & positioning", "AI & automation"],
    // photo: "/team/dhaval-patel.jpg",
    // linkedin: "https://www.linkedin.com/in/...",
  },
  {
    name: "Abhishek Tewari",
    role: "Head of Sales",
    bio: "Abhishek leads sales and new business, guiding prospective clients from first conversation to a clear, honest plan — matching the right services to real business goals and making sure expectations are set straight from day one.",
    focus: ["Sales", "Client onboarding", "Growth"],
    // photo: "/team/abhishek-tewari.jpg",
    // linkedin: "https://www.linkedin.com/in/...",
  },
  {
    name: "Shrikaanth Shyamsunder",
    role: "Marketing & Web Development",
    bio: "Shrikaanth bridges marketing and engineering — building and maintaining the websites, landing pages and tracking infrastructure that turn campaigns into measurable results, and shipping the tools and automations the team runs on.",
    focus: ["Web development", "Marketing", "Tracking & analytics"],
    // photo: "/team/shrikaanth-shyamsunder.jpg",
    // linkedin: "https://www.linkedin.com/in/...",
  },
  {
    name: "Siddarath Sharma",
    role: "SEO Specialist",
    bio: "Siddarath owns organic search — technical SEO, local search and content strategy — helping clients earn durable visibility that compounds alongside their paid campaigns.",
    focus: ["Technical SEO", "Local search", "Content strategy"],
    // photo: "/team/siddarath-sharma.jpg",
    // linkedin: "https://www.linkedin.com/in/...",
  },
  {
    name: "Vanshika Raghuvanshi",
    role: "Social Media Manager",
    bio: "Vanshika runs organic and paid social — planning content, managing communities and keeping each client's brand voice consistent across platforms.",
    focus: ["Social media", "Content planning", "Community"],
    // photo: "/team/vanshika-raghuvanshi.jpg",
    // linkedin: "https://www.linkedin.com/in/...",
  },
  {
    name: "Aadil Tauro",
    role: "Video Editor",
    bio: "Aadil produces and edits the short-form and ad creative that powers paid social and YouTube campaigns — turning briefs into scroll-stopping video built to convert.",
    focus: ["Video editing", "Ad creative", "Short-form"],
    // photo: "/team/aadil-tauro.jpg",
    // linkedin: "https://www.linkedin.com/in/...",
  },
  {
    name: "Rayu Naik",
    role: "Video Editor",
    bio: "Rayu edits performance video and motion creative across formats, helping the team ship a high volume of on-brand, platform-ready assets without sacrificing quality.",
    focus: ["Video editing", "Motion graphics", "Performance creative"],
    // photo: "/team/rayu-naik.jpg",
    // linkedin: "https://www.linkedin.com/in/...",
  },
];
