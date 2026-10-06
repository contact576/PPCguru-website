export type CampaignScreenshot = {
  src: string;
  width: number;
  height: number;
  client: string;
  result: string;
  cost: string;
  spend: string;
  period: string;
};

/** Add only original Google Ads screenshots with figures verified against the image. */
export const googleAdsResults: CampaignScreenshot[] = [];

/**
 * Original Meta dashboard captures supplied by PPC Guru, introduced in ced7e09.
 * Figures and periods were checked visually against each image on 2026-10-06.
 * A missing year or reporting period must not be inferred from the file date.
 */
export const metaAdsResults: CampaignScreenshot[] = [
  {
    src: "/landing/results/true-life-wellness.jpeg",
    width: 736,
    height: 1600,
    client: "True Life Wellness",
    result: "93 form leads",
    cost: "CA$12.43 / lead",
    spend: "CA$1,156.04",
    period: "1 Jul–9 Sep · year not shown",
  },
  {
    src: "/landing/results/mc-constructions.jpeg",
    width: 736,
    height: 1600,
    client: "MC Constructions",
    result: "36 messaging conversations started",
    cost: "CA$15.64 / conversation",
    spend: "CA$562.87",
    period: "19 Aug–9 Sep · year not shown",
  },
  {
    src: "/landing/results/mdi-reno.jpeg",
    width: 736,
    height: 1600,
    client: "MDI Reno",
    result: "51 Meta leads",
    cost: "CA$12.42 / lead",
    spend: "CA$633.24",
    period: "Last 30 days · capture date not shown",
  },
  {
    src: "/landing/results/projects-pioneer.jpeg",
    width: 736,
    height: 1600,
    client: "Projects Pioneer",
    result: "432 messaging conversations started",
    cost: "CA$23.98 / conversation",
    spend: "CA$10,360.52",
    period: "Reporting period not shown in screenshot",
  },
  {
    src: "/landing/results/apna-tiffin-service.jpeg",
    width: 736,
    height: 1600,
    client: "Apna Tiffin Service",
    result: "160 messaging conversations started",
    cost: "CA$3.98 / conversation",
    spend: "CA$637.37",
    period: "Reporting period not shown in screenshot",
  },
];
