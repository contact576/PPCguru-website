/**
 * Data for the "GTA marketing agency" paid-traffic landing page
 * (/gta-marketing-agency). It reuses the /100-leads qualification form and
 * server action (same question ids), so only the routing/labels live here.
 */

export const GTA_LANDING_PATH = "/gta-marketing-agency";
export const GTA_LANDING_THANK_YOU_PATH = "/gta-marketing-agency/thank-you";
/** `leads.source` value — also how `submitLandingLead` tells this page apart. */
export const GTA_LANDING_SOURCE = "landing:gta-agency";
/** `landing_page_leads.landing` value. */
export const GTA_LANDING_ID = "gta-agency";
export const GTA_LANDING_SERVICE_LABEL = "GTA marketing agency (Google Ads + Meta Ads)";

export const GTA_CITIES = [
  "Toronto",
  "North York",
  "Scarborough",
  "Etobicoke",
  "Mississauga",
  "Brampton",
  "Vaughan",
  "Markham",
  "Richmond Hill",
  "Oakville",
  "Burlington",
  "Milton",
  "Pickering",
  "Ajax",
  "Whitby",
  "Oshawa",
] as const;
