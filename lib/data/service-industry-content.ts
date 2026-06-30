/**
 * AUTO-GENERATED "[Service] for [Industry]" content (Wave 6 content workflow).
 * Do not hand-edit — regenerate from the workflow output. Consumed via lib/data/service-industry.ts.
 * Shape: serviceSlug -> industrySlug -> { goodPractices, bestPractices, industryStandards, whatToExpect }.
 */
export const serviceIndustryContent: Record<
  string,
  Record<string, { goodPractices: string[]; bestPractices: string[]; industryStandards: string[]; whatToExpect: string[] }>
> = {
  "google-ads": {
    "physiotherapy": {
      "goodPractices": [
        "A good setup splits campaigns by condition and neighbourhood — \"back pain physio Mississauga\", \"pelvic floor physio North York\" — instead of one broad \"physiotherapy near me\" campaign that burns budget on low-intent clicks.",
        "Call tracking is wired in from day one so every booked phone assessment is attributed back to the campaign and keyword, since most clinic bookings still happen by phone, not form.",
        "A common mistake we fix is optimizing to clicks or raw form fills rather than booked assessments — we redefine the conversion as a real appointment so Google's bidding chases patients, not vanity metrics.",
        "We replace generic broad-match-everything accounts with tight negative keyword lists that strip out \"physio courses\", \"physiotherapy jobs\", \"free\" and DIY searches that never become patients."
      ],
      "bestPractices": [
        "We bid hardest on condition-plus-neighbourhood terms and break out WSIB and motor-vehicle-accident rehab into their own campaigns and pages, because the intent, language and patient value differ from cash-pay searches.",
        "Landing pages lead with online booking, click-to-call and direct-billing/insurance details above the fold, removing the two biggest booking objections before the patient has to think.",
        "We feed offline conversion data — actual booked and attended assessments from the clinic's scheduler — back into Google so Smart Bidding optimizes to revenue, not just lead volume.",
        "Ad copy stays healthcare-compliant: we drive high intent with specific symptoms, locations and \"book today\" framing while avoiding any implied guarantee of a medical outcome."
      ],
      "industryStandards": [
        "Typical Google Ads CPC for physiotherapy in the GTA runs roughly $4–6, climbing higher on competitive condition terms in dense urban postal codes — these are representative ranges, not guarantees.",
        "Booking conversion rates on a well-built, booking-focused landing experience typically land around 6–10% of clicks.",
        "Average patient value commonly falls in the $400–900 range across an episode of care, varying with treatment plan length and whether the case is cash-pay, insurance or accident-funded.",
        "Physiotherapy is a short sales cycle — patients searching by symptom usually book within a day or two — so paid search can start lifting bookings within the first few weeks once tracking and structure are rebuilt."
      ],
      "whatToExpect": [
        "Onboarding starts with an audit of your tracking, account and booking flow in the first 30 days — we fix GA4 and call tracking, rebuild high-intent Search by condition and area, and launch a booking-focused landing experience.",
        "The goal is leads within the first few weeks from paid search, with the back half of the first 90 days spent tuning bids to booked assessments and scaling what's filling the calendar.",
        "Reporting ties spend to booked assessments and patient value by campaign — not clicks and impressions — so you can see cost per booked patient, not just cost per click.",
        "You own everything: the Google Ads account, conversion tracking, landing pages and call-tracking data stay in your name, so there's no lock-in if we ever part ways."
      ]
    },
    "healthcare-clinics": {
      "goodPractices": [
        "A good setup splits campaigns by service line (e.g. physiotherapy, dental implants, dermatology) so budget and bids match each treatment's value, rather than one catch-all campaign that hides where money is wasted.",
        "Conversions are tracked as booked appointments and qualified phone calls — not raw form fills or clicks — using call tracking and offline conversion import from the clinic's booking system or CRM.",
        "The common mistake we fix is leaving Google's default broad match and auto-applied recommendations on, which drains spend on out-of-area and irrelevant searches; we add a tight negative-keyword list and proper geo-targeting around the clinic's catchment.",
        "Ads point to a dedicated, fast landing page for the specific service with clear booking and call buttons, instead of dumping every visitor on a generic homepage where intent leaks away."
      ],
      "bestPractices": [
        "We structure bidding around patient lifetime value, not first-visit value, so recurring treatments (orthodontics, physio plans, chronic-care follow-ups) are bid up where the long-term return justifies it.",
        "We layer radius and neighbourhood geo-targeting across the GTA with location bid adjustments, plus ad scheduling weighted to when reception can actually answer, so spend concentrates on bookable hours.",
        "We keep ad copy and landing pages compliant with Google's healthcare and personalized-advertising policies and CASL — avoiding guaranteed-outcome language while still leading with high-intent calls to action.",
        "We feed qualified-lead and booked-appointment data back into Smart Bidding as offline conversions, so the algorithm optimizes toward real patients rather than vanity form submissions."
      ],
      "industryStandards": [
        "Typical Canadian healthcare search CPCs run roughly $3–$12, with competitive verticals like dental implants, cosmetic and med-spa procedures commonly $10–$25+ per click.",
        "Cost per qualified lead in this vertical typically lands around $40–$150 depending on procedure value and local competition; landing-page conversion rates typically run 6–12% on well-built pages.",
        "Average customer value varies widely by service — a single physio or GP visit may be ~$80–$150, while implants, ortho or elective procedures often run into the thousands — so we model each service line separately.",
        "Sales cycles are typically short for urgent care and bookings (days) but can run several weeks for high-consideration elective treatments; these are representative ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding starts with an audit of your current account, conversion tracking and booking flow; we aim to have clean tracking and restructured campaigns live within the first 2–3 weeks.",
        "We target meaningful signal in the first 30–60 days and a clearer picture of cost-per-booked-patient by month 2–3, as the data and bidding mature — these are goals we work toward, not promised numbers.",
        "You get plain-English reporting tied to booked appointments and cost-per-patient, plus a standing line to your strategist — no jargon-filled dashboards you have to decode alone.",
        "You keep full ownership of your Google Ads account, conversion data and landing pages; if we ever part ways, everything stays with your clinic."
      ]
    },
    "dental": {
      "goodPractices": [
        "A good dental setup splits campaigns by intent and margin — emergency/same-day, new-patient checkups, Invisalign and implants each get their own budget instead of one generic \"dentist\" campaign.",
        "Tight geo-targeting to the 10-15 minute drive-time around the practice, not the whole GTA, so the budget isn't burned on clicks from people who'll never travel to the chair.",
        "The common mistake we fix: ads pointing at a homepage with no booking path, no call tracking, and broad-match keywords pulling in \"dental assistant jobs\" and \"free dental clinic\" searches that drain spend.",
        "Conversion tracking that counts booked appointments and phone calls — not raw form fills or clicks — so spend is judged on new patients, which most inherited accounts never set up correctly."
      ],
      "bestPractices": [
        "We run high-value treatments (implants, Invisalign, full-arch) on their own campaigns with manual or target-CPA bidding, since one $5,000 case justifies a far higher cost-per-lead than a $150 cleaning.",
        "Call tracking with after-hours and missed-call alerts, because most dental enquiries happen by phone and an unanswered call is a lost patient that no bid strategy can recover.",
        "Negative-keyword lists tuned for dentistry (jobs, schools, OHIP/free clinics, DIY) plus competitor and brand campaigns so you're not paying premium CPCs to defend your own name or feed irrelevant traffic.",
        "Dedicated landing pages per service with the offer, financing, insurance-direct-billing and a one-tap booking widget above the fold, then ongoing A/B testing of the offer rather than just the ad copy."
      ],
      "industryStandards": [
        "Typical Canadian dental Google Ads CPC runs roughly CAD $6-12 for routine terms and CAD $12-25+ for high-competition treatments like implants and Invisalign in dense GTA markets.",
        "Cost-per-new-patient-lead typically lands in the CAD $40-120 range depending on treatment, season and competition — emergency and cosmetic terms sit at the higher end.",
        "Landing-page conversion rates of about 6-10% and a lead-to-booked-patient close rate near 30-40% are representative for well-run dental accounts.",
        "Average new-patient value varies widely — a single cleaning may be CAD $150-300 while implant or ortho cases run CAD $3,000-8,000+ — and the sales cycle ranges from same-day for emergencies to weeks for elective treatment."
      ],
      "whatToExpect": [
        "Onboarding starts with an audit of your current account, call handling and booking flow, plus conversion tracking set up properly before we touch budgets — usually live within the first one to two weeks.",
        "Aim for a meaningful read on cost-per-lead and call volume within 30-60 days, with the first weeks spent gathering data and trimming wasted spend rather than promising instant patients.",
        "Plain-English monthly reporting tied to booked appointments and cost-per-new-patient — not vanity clicks — so you can see what each treatment campaign actually produces.",
        "You own everything: the Google Ads account, conversion tracking, landing pages and call-tracking numbers stay in your name, so nothing is held hostage if we ever part ways."
      ]
    },
    "hvac": {
      "goodPractices": [
        "A good HVAC setup splits campaigns by intent and season — emergency 'no heat / AC repair' kept separate from furnace and heat-pump installs — instead of one blended campaign that lets cheap clicks starve the high-ticket install budget.",
        "Call tracking and 'after-hours' ad scheduling are wired in from day one, because most HVAC leads phone rather than fill a form and a missed 9pm no-heat call is a lost $5,000 job.",
        "We routinely fix accounts running on broad match with no negative keywords — the usual culprit draining spend on 'HVAC jobs', 'HVAC training' and DIY/parts searches that never book a service call.",
        "Conversions are tied to actual booked calls and quote requests, not raw clicks or 'contact page' views, so the data optimizes toward revenue rather than vanity traffic."
      ],
      "bestPractices": [
        "We layer in Google Local Services Ads (the Google Guaranteed badge) alongside Search so you appear in the map-style pack and pay per lead — a strong fit for licensed Ontario HVAC contractors.",
        "Bids and budgets shift with weather and season: we lean into cooling demand during GTA heat waves and heating/furnace terms through the cold-snap weeks, rather than running a flat budget year-round.",
        "Geo-targeting is tightened to your real service radius with bid adjustments by neighbourhood, so a Mississauga or Vaughan contractor isn't paying premium downtown-Toronto CPCs for jobs they won't drive to.",
        "Tracked phone leads are fed back into Google's bidding and, where possible, into your CRM, so the system learns which keywords produce booked installs versus tire-kickers — and reallocates spend accordingly."
      ],
      "industryStandards": [
        "Search CPCs for HVAC in the GTA typically run in the ~$6–$14 range, with emergency 'no heat / no AC' and install keywords sitting at the high end of that band.",
        "Cost per lead commonly lands around ~$60–$150 depending on season, competition and how well the account is structured — Local Services Ads can come in lower per lead.",
        "Landing-page conversion rates for well-built HVAC campaigns typically sit in the ~5–10% range, with click-to-call traffic often converting higher than form fills.",
        "Average job value spans roughly ~$200–$600 for a service/repair call up to ~$5,000–$12,000+ for a furnace, AC or heat-pump install, and the buying cycle is fast for emergencies but can run days to weeks on quoted installs."
      ],
      "whatToExpect": [
        "Onboarding is structured: we audit any existing account, confirm your service area, margins and best-fit jobs, and set up call tracking and conversion tracking before we touch budgets.",
        "Aim for early booked-call signal within the first few weeks, with the goal of a stabilized, optimized cost per lead over roughly the first 60–90 days as seasonal and bidding data accumulates.",
        "You get plain-English reporting that ties spend to tracked calls, quote requests and cost per lead — not a dashboard of clicks you have to decode.",
        "You own everything — the Google Ads account, Local Services profile, tracking and call data stay in your name, so there's no lock-in if you ever part ways with us."
      ]
    },
    "plumbing": {
      "goodPractices": [
        "A good setup splits emergency intent (\"burst pipe,\" \"24 hour plumber\") from planned work (water heater, repipe, drain replacement) into separate campaigns with their own bids, budgets and ad copy.",
        "Call-only and call-extension ads run during the hours you can actually answer, because most plumbing leads convert on the phone, not a web form.",
        "The most common mistake we fix is no call tracking — businesses spend thousands without knowing which keywords ring the phone, so they cut the wrong campaigns.",
        "We tighten loose location and keyword targeting that wastes budget on out-of-area searches and broad terms like \"plumbing\" that pull DIY and job-seeker clicks."
      ],
      "bestPractices": [
        "We run Google's Local Services Ads (the green-checkmark \"Google Guaranteed\" units) alongside Search so you capture the pay-per-lead slot at the top before the paid results.",
        "Dayparting and bid adjustments push budget toward evenings, weekends and overnight windows when emergency searches spike and competitors pause.",
        "We feed real booked-job and revenue data back into Google via offline conversion import, so Smart Bidding optimizes toward profitable calls instead of raw clicks.",
        "Negative keyword lists, missed-call text-back automation and a routed call flow make sure no after-hours leak or installation lead slips through unanswered."
      ],
      "industryStandards": [
        "Plumbing Search CPCs in the GTA typically run about $8–$18, with emergency terms at the higher end of that range.",
        "Cost per lead usually lands around $35–$90 depending on service area, competition and emergency vs. planned mix.",
        "Landing-page and call conversion rates commonly sit near 8–15% for high-intent plumbing search traffic.",
        "Average job values range widely — roughly $250–$600 for service calls and repairs, into several thousand for water-heater swaps and repipes — and the sales cycle is hours for emergencies, days to weeks for projects."
      ],
      "whatToExpect": [
        "Onboarding starts with call tracking, conversion setup and a clean account rebuild or audit so we measure booked jobs from day one, not vanity clicks.",
        "Expect early call volume within the first few weeks, with the goal of a steady, predictable flow of qualified jobs as bidding learns over the first 60–90 days.",
        "You get plain-English reporting tied to calls, booked jobs and cost per lead — not just impressions — plus a clear view of which campaigns earn their spend.",
        "You own your Google Ads account, data and phone numbers; engagements are month-to-month and ad spend stays separate from our management fee."
      ]
    },
    "electrical": {
      "goodPractices": [
        "A good setup splits residential and commercial intent into separate campaigns, because a homeowner with no power and a property manager pricing a fit-out search, convert and spend completely differently.",
        "It bids hardest on high-value, planned work — panel upgrades, EV chargers, rewires, generators — instead of pouring budget into cheap, low-margin call-outs.",
        "The most common mistake we fix is treating every phone call as a win with no call tracking, so untracked enquiries, spam and missed calls hide the real cost-per-booked-job.",
        "We also see broad-match campaigns bleeding budget on 'electrician salary' or DIY searches, which a proper negative-keyword list and tight match types shut off in the first week."
      ],
      "bestPractices": [
        "We run call tracking as the primary conversion and feed offline job values back into Google so Smart Bidding optimises toward booked revenue, not raw form fills.",
        "We schedule emergency and after-hours campaigns separately with their own bids and mobile click-to-call pages, since a 2am 'no power' search is worth bidding up for and a slow desktop page loses it.",
        "We build trust-led landing pages that put ESA licensing, insurance, warranties and reviews above the fold, because safety-conscious electrical buyers convert on credibility before price.",
        "We layer geo-targeted service-area campaigns by city (Brampton, Mississauga, Vaughan, Toronto) and pair Search with Local Services Ads and retargeting for higher-ticket EV-charger and rewire jobs."
      ],
      "industryStandards": [
        "Typical Google Search CPC for GTA electrical keywords runs roughly $6–14, with competitive commercial and emergency terms sitting at the higher end (representative range, not a guarantee).",
        "Cost-per-lead typically lands around $40–90 depending on city, service mix and seasonality, with emergency call-outs usually cheaper than planned project enquiries.",
        "Landing-page conversion rates of about 8–15% are typical for well-built, trust-led electrical pages with click-to-call.",
        "Average job value commonly ranges from a ~$150–300 service call to $5,000–15,000+ for panel upgrades, EV chargers and commercial work; sales cycles run same-day for emergencies and a few days to a few weeks for quoted projects."
      ],
      "whatToExpect": [
        "Onboarding starts with a free audit of your accounts, tracking and competitors, then we set up call and form tracking before spending a dollar and model your expected leads and cost-per-job up front.",
        "Search campaigns can produce calls within days of launch; the first 30–60 days are about gathering data and tuning, with the steadier, lower-cost compounding gains aimed at around the 90-day mark.",
        "You get plain-English reporting tied to booked jobs and revenue — not vanity impressions — plus a named contact and regular optimisation, all targets framed as goals we work toward, not promises.",
        "You own your Google Ads account, conversion data and landing pages from day one, and our engagements stay month-to-month so the results keep us accountable."
      ]
    },
    "construction-renovation": {
      "goodPractices": [
        "A good setup splits campaigns by job type — kitchen, basement, bathroom, additions — so each gets its own budget, ad copy and landing page instead of one generic \"renovation\" bucket.",
        "Most contractor accounts we inherit are bleeding spend on broad keywords like \"renovation\" or \"contractor\" with no negatives, pulling DIY searchers, job seekers and other trades into the mix.",
        "The common mistake is sending every click to a homepage; we fix it by routing high-intent searches to a project-specific page with a portfolio gallery and a qualifying quote form.",
        "Many accounts \"convert\" on raw form fills with no offline import, so Google optimizes toward cheap tire-kicker leads — we tie conversions to booked consultations and signed jobs instead."
      ],
      "bestPractices": [
        "We run separate campaigns for in-market service searches (\"basement contractor Mississauga\") and broader research terms, then bid only where the intent and the city actually fit your service area.",
        "Qualifying questions on the form — project type, timeline, budget range, owner vs renter — filter out tire-kickers before they ever hit your sales team's calendar.",
        "Because a renovation decision runs weeks, we layer long-window remarketing and offline conversion imports so Google learns from real signed jobs, not first clicks.",
        "We use call tracking and value-based bidding tuned to your average job value, so the algorithm chases $25k kitchens and additions rather than the cheapest possible lead."
      ],
      "industryStandards": [
        "Google Search clicks for construction and renovation in the GTA typically run roughly CAD $6–14, with competitive job types (kitchens, additions, basements) pushing to the high end.",
        "Cost-per-qualified-lead usually lands in the CAD $80–250 range depending on job type, city and how tightly the form qualifies.",
        "Landing-page conversion rates for high-intent renovation search typically fall around 4–8%, lower than quick-service trades because the purchase is considered.",
        "Average job value commonly ranges from CAD $15k to $60k+, with lead-to-signed close rates typically near 15–25% over a multi-week sales cycle — figures are representative ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding starts with a benchmark on your services, cities and average job value so you see the likely cost-per-lead and ROAS before committing a dollar of spend.",
        "You can expect qualified quote requests within the first few weeks as high-intent Search ramps, with the fuller picture forming over 60–90 days as remarketing works through the decision window.",
        "Reporting is built around booked consultations and signed jobs with revenue, not vanity clicks, and you get a plain-English read on what's working each month.",
        "You own the Google Ads account, the data and the conversion tracking; engagements stay month-to-month and ad spend is kept separate from our management fee."
      ]
    },
    "roofing": {
      "goodPractices": [
        "A solid roofing account separates emergency/repair searches (leaks, storm damage) from higher-value replacement and re-roof intent, so you bid and message differently instead of one blended campaign.",
        "Call tracking and form tracking are wired in from day one, because most roofing leads phone in and accounts that only count clicks have no idea which keywords actually book jobs.",
        "We commonly fix accounts running on broad match with no negative keywords, where budget bleeds on renters, DIY repair searches, and 'roofing supplies' queries that never convert.",
        "Geo-targeting is tightened to the service area you actually drive to across the GTA, instead of the default radius that wastes spend on jobs you won't quote or service."
      ],
      "bestPractices": [
        "We build seasonal bid and budget pacing around the Ontario roofing calendar, leaning into spring/fall demand and storm spikes rather than spending flat through the slow winter months.",
        "Conversions are valued by job type and offline outcome so the campaign optimizes toward booked, qualified replacement jobs rather than the cheapest possible phone call.",
        "Ad copy and landing pages lead with the trust signals roofing buyers screen for, WSIB coverage, liability insurance, warranty, and local GTA proof, to lift conversion rate and pre-qualify the lead.",
        "We layer in negative-keyword sculpting, call-only ads for emergency intent, and remarketing for the longer replacement consideration window where homeowners get multiple quotes."
      ],
      "industryStandards": [
        "Typical Google Search CPCs for competitive GTA roofing terms run roughly $8-$25+ per click, with emergency and 'roof replacement' keywords sitting at the high end.",
        "Cost per lead is commonly in the ~$60-$200 range depending on city, season, and how well the account is filtered, with repair leads cheaper than full-replacement leads.",
        "Landing-page conversion rates of around 6-12% are representative for a well-built roofing campaign, versus low single digits on an unoptimized generic homepage.",
        "Average job value spans widely, from a few hundred dollars for repairs to roughly $8,000-$25,000+ for a full residential replacement, and many homeowners gather 2-4 quotes before committing."
      ],
      "whatToExpect": [
        "Onboarding starts with an audit of your current account, tracking, and service area, and we aim to have clean conversion tracking and a rebuilt or corrected campaign structure live within the first couple of weeks.",
        "Roofing being seasonal and quote-driven, the goal is early lead flow within weeks and steadier, lower cost-per-lead as the account gathers conversion data over the first 2-3 months.",
        "You get plain-English reporting tied to leads and booked jobs, not vanity click metrics, plus a regular check-in on what's working and what we're adjusting.",
        "You keep full ownership of the Google Ads account, conversion data, and creative, so nothing is held hostage if you ever change agencies."
      ]
    },
    "immigration": {
      "goodPractices": [
        "A good setup separates campaigns by program intent — Express Entry, study permits, work permits, spousal/family sponsorship, PR appeals — instead of pooling them, because each has its own searcher, value, and conversion rate.",
        "We routinely find accounts running broad match on generic terms like 'immigrate to Canada' with no negatives, burning budget on visitors outside Canada and DIY researchers who will never retain a consultant.",
        "Conversion tracking is usually limited to a thank-you pageview, so we wire phone-call, WhatsApp, and form tracking back to qualified consults to optimise on real bookings, not raw clicks.",
        "Geo and language targeting is often left at defaults; we tighten to the GTA plus Canada/US-based searchers and exclude regions you can't legally or practically serve."
      ],
      "bestPractices": [
        "We build a negative-keyword library specific to immigration — 'free', 'IRCC', 'government', 'jobs in Canada', plus DIY and visa-fraud queries — and prune the search-terms report weekly so spend stays on people seeking a representative.",
        "Ad copy and landing pages lead with RCIC/CICC licensing, eligibility-assessment offers, and consultation cost up front, which lifts lead quality and keeps you onside with CICC advertising rules.",
        "We map searcher urgency by program — work-permit and PR-deadline queries get aggressive bids and call extensions, while early-stage study-permit research is nurtured through cheaper assets and remarketing.",
        "Lead forms and CRM tags capture program type and country of origin so reporting ties spend to the consults that actually retain, and we feed offline conversions back to Google to train bidding toward signed clients."
      ],
      "industryStandards": [
        "Search CPCs for immigration terms in Canada typically run higher than most local services — often in the $4–$15 range, with competitive Express Entry and PR terms reaching the top of that band.",
        "Cost per qualified lead (a booked or completed consultation) typically lands around $60–$200 depending on program, geography, and competition.",
        "Landing-page conversion rates for focused immigration campaigns typically sit near 4–9%, with study-permit and assessment offers usually converting better than broad PR queries.",
        "Average client value varies widely by service — a single representation file commonly ranges from roughly $1,500 to $8,000+ — and sales cycles often run from a few days to several weeks as prospects compare consultants."
      ],
      "whatToExpect": [
        "Onboarding starts with an audit of your current account, intake flow, and CICC-compliant messaging, plus conversion tracking set up across calls, forms, and WhatsApp before we touch budget.",
        "We aim to have restructured campaigns live within the first couple of weeks; meaningful lead-quality and cost-per-consult signals typically emerge over the first 60–90 days as data accumulates.",
        "You get plain-English reporting tied to booked consultations and retained files — not vanity clicks — with a clear view of which programs and keywords are driving real business.",
        "You own the Google Ads account, tracking, and data throughout; we manage it transparently, and if we part ways everything stays with you."
      ]
    },
    "law-firms": {
      "goodPractices": [
        "A good setup splits every practice area into its own campaign, so a high-value personal-injury budget never subsidizes cheap, low-intent family or DIY-research clicks.",
        "The tracked intake phone call is the primary conversion the account optimizes toward, not a generic form fill that intake never actually answers.",
        "Geo-targeting is locked to the jurisdictions the firm is licensed to serve in Ontario or the relevant province, with out-of-area and outside-Canada traffic excluded.",
        "The most common mistake we fix is a thin or missing negative-keyword list that bleeds budget on 'jobs', 'salary', 'free', 'how to' and self-represent searches that never become a case."
      ],
      "bestPractices": [
        "We separate brand, high-value (e.g. car accident, slip-and-fall, immigration) and lower-value practice areas into distinct campaigns with their own bids, budgets and negatives so the data stays clean.",
        "We wire call tracking on every campaign and feed qualified-intake signals back to Google so Smart Bidding optimizes toward real case enquiries, not raw clicks.",
        "We pair each ad group with a trust-led, practice-area landing page leading with credentials, results and one-tap click-to-call, since legal buyers decide on credibility and speed.",
        "We build a deep, continuously mined negative-keyword and search-term routine plus speed-to-lead and missed-call follow-up so slow intake stops losing won cases."
      ],
      "industryStandards": [
        "Typical Google CPC for competitive legal terms in the GTA runs roughly $15-80+ per click, with personal-injury and accident keywords at the top of that range.",
        "Representative case-enquiry conversion rates on a focused, trust-led landing page typically land around 5-9%.",
        "Typical cost per qualified lead in this vertical commonly falls in the $80-300+ range depending on practice area and competition.",
        "Average case values usually span roughly $1,500-25,000+, and sales cycles range from a same-day intake call to several weeks of consideration on higher-stakes matters."
      ],
      "whatToExpect": [
        "Onboarding starts with wiring call tracking and intake measurement, rebuilding Search by practice area, and tightening negatives and geo-targeting in the first 30 days.",
        "The goal is early signal and cleaner spend within weeks, with meaningful qualified-enquiry trends typically taking 60-90 days as bidding learns from real case data.",
        "You get plain-English reporting tied to tracked intake calls and qualified enquiries, not vanity click metrics, so you can see cost-per-case-enquiry clearly.",
        "You own the Google Ads account, conversion tracking and landing pages outright, so the work and the data stay with your firm if we ever part ways."
      ]
    },
    "home-improvement": {
      "goodPractices": [
        "A good setup runs product-specific campaigns — windows, kitchens, decks, siding, bathrooms — instead of one generic \"home improvement\" campaign that wastes budget on browsers with no clear intent.",
        "Conversion tracking is wired to booked in-home estimates and qualified phone calls, not raw form fills, so the account optimizes toward jobs that actually pay.",
        "The most common mistake we fix is uncapped broad-match keywords pulling DIY and \"how-to\" searches; we add tight negative-keyword lists and intent-matched terms so spend goes to homeowners ready to hire.",
        "Many accounts we inherit have no call tracking and one shared landing page for every service — we split traffic to product-specific pages with portfolio proof, service area and financing options."
      ],
      "bestPractices": [
        "We concentrate budget on your single most profitable product line to win it first, then expand — rather than spreading a modest budget thin across every service.",
        "We build seasonal budget plans around GTA demand spikes (spring/summer for decks, windows and exteriors; shoulder seasons for interior remodels) so you bid up when intent is high and protect margin when it isn't.",
        "Because renovation decisions take weeks, we run retargeting and longer attribution windows so the first click and the follow-up nurture both get credit and budget.",
        "We layer geo-targeting around serviceable postal codes and bid adjustments for higher-value neighbourhoods, paired with hard lead qualification (budget, timeline, project type) so your sales team only calls real buyers."
      ],
      "industryStandards": [
        "Typical Google Ads CPCs in this vertical run roughly $5-15 CAD, varying by product line and competition — exterior and high-ticket trades sit toward the top of that range.",
        "Cost per qualified lead typically lands around $80-250 CAD depending on project type, season and how tightly the offer is targeted.",
        "Landing-page conversion rates of about 6-10% are common when traffic is intent-matched and the page shows portfolio, reviews and financing.",
        "Average project values commonly range from $5,000 to $50,000+, with considered sales cycles often running several weeks from first click to signed contract — these are representative ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding starts with an audit of your current account, tracking and best product line, then a build focused on booked in-home estimates rather than vanity clicks.",
        "Expect the first few weeks to be learning and data-gathering, with meaningful lead flow typically building over the first one to three months as campaigns gather signal — a goal we work toward, not a promise.",
        "You get plain-English reporting tied to leads, booked estimates and revenue, so you can see cost per qualified lead instead of impressions and clicks.",
        "You own your Google Ads account, data and tracking; it's month-to-month with ad spend kept separate from our management fee."
      ]
    },
    "fitness-gyms": {
      "goodPractices": [
        "A good setup separates membership and class-pass campaigns from personal-training and corporate enquiries, because each has a different price point and buying intent.",
        "Search campaigns are tightly geo-fenced to a realistic drive-time radius (usually 5-10 km) instead of a whole city, since nobody drives across the GTA for a gym.",
        "The most common mistake we fix is counting 'free trial' or 'view pricing' clicks as conversions, which hides whether ads actually produce booked tours or paid memberships.",
        "Many gym accounts lean entirely on Performance Max with no brand exclusions, so budget gets eaten by competitor and brand traffic that would have converted anyway."
      ],
      "bestPractices": [
        "We bid hardest on high-intent local terms ('gym near me', 'spin studio [neighbourhood]', '24 hour gym') and treat broad fitness queries as low-priority testing only.",
        "Offline conversion import ties a Google click to the membership that was actually signed at the front desk, so bidding optimises for paying members rather than form fills.",
        "We schedule and budget around New Year, post-summer and September 'back to routine' demand spikes, and pull spend during dead weeks when CPCs rise without intent.",
        "Call tracking and 'book a tour' lead forms are wired in because many fitness enquiries happen by phone or walk-in, and we feed those signals back into Smart Bidding."
      ],
      "industryStandards": [
        "Typical Canadian fitness search CPCs run roughly CA$1.50-CA$4.00, climbing higher in dense GTA markets and during January demand spikes.",
        "Cost per lead (free trial or tour booking) typically lands around CA$15-CA$45, depending on location density and offer strength.",
        "Landing-page conversion rates for a focused gym offer usually sit in the 5-12% range, above the search average because intent is high and local.",
        "Average member value is commonly CA$50-CA$120/month, so even a few months of retention covers acquisition cost; sales cycles are short, often days from click to sign-up."
      ],
      "whatToExpect": [
        "Onboarding starts with auditing your current account and conversion tracking, then rebuilding campaigns around tours, trials and paid memberships within the first couple of weeks.",
        "Aim to see early lead-flow signal within the first 2-4 weeks, with the goal of stabilising cost per member over roughly 60-90 days as bidding data matures.",
        "Reporting is plain-English and tied to memberships and revenue, not vanity clicks, with a regular call to review what's working and what we're changing.",
        "You keep full ownership of the Google Ads account, conversion data and creative, so nothing is held hostage if you ever part ways with us."
      ]
    },
    "professional-services": {
      "goodPractices": [
        "A good setup separates high-intent service terms (e.g. \"commercial litigation lawyer Toronto\", \"fractional CFO GTA\") into tightly themed ad groups instead of one broad \"consulting\" campaign that burns budget on tyre-kickers.",
        "Conversions are tied to qualified actions a partner actually cares about — booked consultations, RFP submissions, gated whitepaper downloads — not raw form fills or every phone call.",
        "The common mistake we fix is firms letting Performance Max or broad match spend on irrelevant, low-intent searches with no negative-keyword discipline, so leads arrive but none are decision-makers.",
        "Most accounts we inherit ignore call tracking and offline conversion import, so the long B2B sales cycle is invisible to Google and bidding optimises for cheap clicks instead of real clients."
      ],
      "bestPractices": [
        "We import offline conversions from your CRM so Google bids toward leads that actually became clients, not just whoever filled a form — essential when a closed engagement can be weeks or months out.",
        "We layer value-based bidding and audience signals (company size, seniority, in-market B2B segments) so spend skews toward decision-makers rather than students, job-seekers or competitors.",
        "We run search alongside competitor-conquesting and branded-defence campaigns, plus retargeting for the long consideration window that B2B buyers take before they book.",
        "Ad copy and landing pages speak to credentials, specialisation and proof (years in practice, sectors served, designations) because professional buyers screen on trust before price."
      ],
      "industryStandards": [
        "Typical Canadian search CPCs for professional and B2B services run roughly $6–$25, with competitive legal, accounting and financial terms often pushing $30+ — these are representative ranges, not guarantees.",
        "Cost-per-qualified-lead commonly lands around $80–$300 depending on specialisation and geography, higher for niche or regulated practices.",
        "Landing-page conversion rates for this vertical typically sit near 3%–8%, with strong, intent-matched pages reaching the upper end.",
        "Average client/engagement value varies widely — often $2,000–$25,000+ — over a sales cycle that frequently spans several weeks to a few months, which is why we measure on closed revenue, not lead count."
      ],
      "whatToExpect": [
        "Onboarding starts with an audit of your current account, conversion tracking and CRM so we agree on what a qualified lead is worth before we spend a dollar.",
        "Aim for cleaner targeting and tracking within the first few weeks; because B2B sales cycles are long, the goal is meaningful closed-client signal over the first one to three months, not overnight results.",
        "You get plain-English reporting tied to leads, qualified leads and revenue — not vanity clicks — plus a standing line to the people running your account.",
        "You keep full ownership of the Google Ads account, conversion data and creative; nothing is held hostage if we ever part ways."
      ]
    }
  },
  "seo": {
    "physiotherapy": {
      "goodPractices": [
        "A good physio SEO setup ranks separate condition-plus-neighbourhood pages (back pain, knee rehab, pelvic floor, vestibular, WSIB and motor-vehicle-accident rehab) rather than one thin 'services' page trying to rank for everything.",
        "Most clinics we audit have a half-finished Google Business Profile, scattered or inconsistent NAP across directories, and no review-generation flow — the three things that decide map-pack ranking in the GTA.",
        "A common mistake is chasing high-volume 'physiotherapy near me' traffic while ignoring the condition and insurance queries that actually book assessments.",
        "We fix sites that bury online booking and direct-billing details below the fold, since those two objections are what cost clinics rankings and conversions on otherwise-ranking pages."
      ],
      "bestPractices": [
        "We build a condition-by-location page architecture mapped to how patients actually search, with internal linking from each treatment page to the matching practitioner and booking flow.",
        "We optimize the Google Business Profile and run a structured review-generation flow, because review count and rating measurably lift both map-pack rank and click-through for local physio searches.",
        "We add LocalBusiness and MedicalClinic schema, embed online booking and click-to-call on every page, and keep claims compliant — no implied guaranteed medical outcomes.",
        "We tie organic rankings to booked assessments using call tracking and GA4, so SEO is measured on patients booked, not on traffic or keyword positions alone."
      ],
      "industryStandards": [
        "Typical Canadian/GTA paid CPCs on physio terms run roughly $4–6, which signals the commercial competition organic SEO is up against for the same condition queries.",
        "Booking conversion rates for high-intent physio traffic typically land in the 6–10% range once tracking and booking flow are tightened.",
        "Average patient value for a physio clinic usually sits around $400–900 over a treatment plan, with WSIB and motor-vehicle-accident rehab often higher.",
        "First meaningful local ranking and map-pack gains typically appear around 60–90 days, with organic compounding over 3–6 months — these are typical ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding starts with a technical and local SEO audit, GA4 and call-tracking setup, and a prioritized condition-and-location page plan in the first few weeks.",
        "Expect local ranking and booking signals to begin moving around 60–90 days, with organic compounding over the following months as content and reviews build — framed as goals, not promises.",
        "You get plain-English monthly reporting tied to booked assessments and calls, not vanity keyword charts, so you can see what marketing actually fills the calendar.",
        "You own everything we build — the website pages, Google Business Profile, tracking and content stay yours if we ever part ways."
      ]
    },
    "healthcare-clinics": {
      "goodPractices": [
        "A good clinic SEO setup ranks for the symptom and treatment terms patients actually search ('walk-in clinic near me', 'family doctor accepting patients Toronto'), not just the clinic's brand name.",
        "Each location and each service line gets its own indexed, internally-linked page; most clinics we audit bury everything on one thin 'Services' page that ranks for nothing.",
        "The Google Business Profile is fully completed with correct hours, categories, services and booking link, and NAP matches the website exactly across every directory and HealthDirectory listing.",
        "The common mistake we fix is a slow, unstructured site with no MedicalClinic schema, no review strategy and no tracking on phone calls or 'book appointment' clicks, so the clinic can't see which keywords drive patients."
      ],
      "bestPractices": [
        "We build out condition- and procedure-level pages with FAQ and MedicalClinic/Physician schema so the clinic shows up in Google's rich results and AI overviews for specific patient questions.",
        "We run local SEO per location: city landing pages, Google Business Profile optimization and a steady, compliant patient-review flow (no incentivized or fake reviews) to lift map-pack rankings across the GTA.",
        "Content is written to E-E-A-T standards with named, credentialed practitioner bios and medical review, which Google weights heavily for health (YMYL) topics where weak content gets suppressed.",
        "We connect rankings to outcomes by tracking call, form and online-booking conversions in GA4 and your booking system, then double down on the keywords that fill the schedule, not just the ones with traffic."
      ],
      "industryStandards": [
        "Organic clicks for clinic keywords typically cost nothing per click, but the equivalent Google Ads CPC in this vertical runs roughly CAD $4-$8, which is the spend SEO offsets over time.",
        "A typical cost-per-patient-lead from organic search lands around CAD $20-$60 once content is ranking, well below paid channels, though it builds over months rather than days.",
        "Website-to-booking conversion for healthcare clinics is usually in the ~6-12% range, with new-patient close rates around 25-35% once they reach the front desk.",
        "Average new-patient or treatment value is commonly CAD $700-$1,000+ depending on service mix, and the patient-acquisition cycle is short (often same-week) once you rank for high-intent local terms; all figures are typical ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding starts with a technical and local-SEO audit of your site and Google Business Profile, plus keyword and competitor mapping for each clinic location and service.",
        "SEO is a compounding play: expect early technical and local wins within the first 1-3 months and meaningful organic ranking and booking growth typically building over 4-6 months and beyond.",
        "You get plain-English monthly reporting tied to bookings and calls (not vanity traffic), with a named contact and clear next steps every cycle.",
        "Everything we build is yours to keep: you own the website, content, Google Business Profile and analytics accounts, with no lock-in if you ever leave."
      ]
    },
    "dental": {
      "goodPractices": [
        "A fully built-out Google Business Profile for every location — correct categories, services, hours, photos and a steady flow of patient reviews — is the single biggest local-SEO lever, yet most dental sites leave it half-finished.",
        "Service pages should be dedicated to each money-maker (dental implants, Invisalign, cosmetic, emergency, family dentistry) and each GTA city served; the common mistake is one thin \"Services\" page that ranks for nothing specific.",
        "Call tracking and form events have to be wired into GA4 so organic-driven phone bookings are actually counted — practices routinely run SEO blind because the phone, where most dental ROI lands, isn't tracked.",
        "Healthcare content needs real clinical authority (named dentists, credentials, sourced claims); we fix sites that lean on generic, AI-spun copy that Google's medical-quality (E-E-A-T) standards quietly suppress."
      ],
      "bestPractices": [
        "We build a location-and-service page matrix targeting high-value intent (\"dental implants Mississauga,\" \"emergency dentist Etobicoke,\" \"Invisalign cost Toronto\") so each lucrative case has its own ranking asset.",
        "We engineer the Google Business Profile and map-pack presence — categories, services, geo-relevant posts and a structured review-generation flow — to win the local 3-pack where most \"dentist near me\" clicks go.",
        "We implement Dentist, MedicalClinic, FAQ and review schema plus NAP-consistent local citations so search engines and AI overviews read the practice as a credible local authority.",
        "We tighten Core Web Vitals and mobile booking paths — fast pages, click-to-call, online-booking prominence — because most dental searches are mobile and high-intent, and speed directly affects both ranking and conversion."
      ],
      "industryStandards": [
        "Typical ranges (Canadian/GTA, representative — not guarantees): organic search converts visitors to booked-consult enquiries at roughly 2–5% once tracking and booking paths are clean.",
        "Comparable paid dental clicks run about $6–$18 in competitive GTA markets, which is why durable organic rankings compound in value over time versus renting that traffic.",
        "Cost per new patient from local SEO is typically lower than paid once rankings mature, often landing in the ~$40–$120 per qualified enquiry range depending on competition and case type.",
        "Average case value anchors the math — family/hygiene visits run a few hundred dollars while implants, Invisalign and cosmetic cases commonly run $3,000–$8,000+, with a multi-week consideration cycle before booking."
      ],
      "whatToExpect": [
        "Onboarding starts with a technical and local audit — Google Business Profile, tracking, current rankings and competitor map-pack gaps — so we agree on the priority money-makers and target cities before any content ships.",
        "SEO is a compounding play: expect Google Business Profile and tracking wins in the first weeks, early movement on local terms within roughly 3–4 months, and stronger competitive rankings building over 6–12 months as the goal.",
        "You get plain-English monthly reporting tied to outcomes that matter — rankings, organic calls and booked consultations — not vanity traffic charts, with call tracking showing which keywords produced real patients.",
        "You own everything we build: the website content, Google Business Profile, tracking setup and citations stay yours, with no lock-in, because the aim is durable rankings the practice keeps."
      ]
    },
    "plumbing": {
      "goodPractices": [
        "A good plumbing SEO setup ranks you in the Google map pack for 'plumber near me' and 'emergency plumber [city]' across every neighbourhood you actually service, not just your head office postcode.",
        "It rests on a fully optimized Google Business Profile with correct service categories, real job photos, and a steady stream of recent reviews — the single biggest local-ranking lever most GTA plumbers neglect.",
        "The most common mistake we fix is one thin 'Services' page trying to rank for everything: we split emergency repair, drain cleaning, water-heater and repiping intent into dedicated pages, each mapped to how customers search.",
        "We also fix the silent leak of untracked organic calls — sites with no call tracking or schema markup, so owners can't see which pages and keywords actually book jobs."
      ],
      "bestPractices": [
        "We build out a service-area page structure — one indexable page per city or borough you cover (Toronto, Mississauga, Brampton, Vaughan, and beyond) — so you rank for local 'near me' demand without tripping Google's doorway-page filters.",
        "We add LocalBusiness, Service and FAQ schema, fast Core Web Vitals, and click-to-call tracking so every organic lead is attributed back to the page and query that earned it.",
        "We run a systematic review-generation cadence tied to job completion, then surface those reviews and real project photos on the relevant service and city pages to win both the map pack and the click.",
        "We optimize for AI search and Google's AI Overviews by answering the exact questions customers ask ('how much to fix a burst pipe in Toronto', 'is a leaking water heater an emergency') in plain, liftable copy."
      ],
      "industryStandards": [
        "These are TYPICAL Canadian ranges for plumbing, not guarantees — your market, competition and review profile move every number.",
        "Plumbing is a high-value, call-driven vertical: average job values commonly run $250–$900 for repairs and $2,500–$6,000+ for installs and repiping, with lead-to-booked-job close rates often around 40–50% on high-intent organic enquiries.",
        "Organic and map-pack leads typically cost far less per lead over time than paid — frequently a fraction of the $8–$18 CAD paid plumbing CPC — though SEO front-loads the work before that compounding kicks in.",
        "Local landing pages built for high-intent terms commonly convert visitor-to-lead in the ~5–12% range, and the sales cycle is bimodal: emergencies close in minutes, while planned projects can take days to weeks of consideration."
      ],
      "whatToExpect": [
        "Onboarding starts with a technical and local-search audit of your site, Google Business Profile and competitors, so you can see exactly where the rankings and tracking are leaking before we touch anything.",
        "SEO is a compounding asset, not a switch — expect early local and Google Business Profile movement within the first roughly 8–12 weeks, with meaningful organic lead growth typically building over 4–6+ months as a goal, not a promise.",
        "You get plain-English monthly reporting tied to booked jobs and calls — rankings, map-pack visibility and organic leads — never vanity traffic charts you can't act on.",
        "You own everything: your website, your Google Business Profile, your content and your data, on month-to-month terms, so the organic equity we build stays yours if you ever leave."
      ]
    },
    "electrical": {
      "goodPractices": [
        "A good electrician SEO setup ranks you in the Google map pack for \"electrician near me\" plus specific service-and-city terms like \"panel upgrade Brampton\" or \"EV charger installation Mississauga\", not just a single homepage targeting one keyword.",
        "It runs on a fully optimised, review-fed Google Business Profile with correct service-area cities, photos of real jobs, and your ESA licence and insurance shown prominently, since trust is what converts electrical buyers.",
        "A common mistake we fix is one thin \"services\" page trying to rank for everything: we split panel upgrades, rewires, EV chargers, generators and commercial work into dedicated pages so each can actually rank.",
        "Most electrician sites also leak emergency mobile traffic with slow pages and no click-to-call above the fold, and lack the local landing pages and schema needed to win nearby suburbs you genuinely serve."
      ],
      "bestPractices": [
        "We build a city-by-service page architecture across your GTA service area (e.g. \"electrician Vaughan\", \"EV charger installation Oakville\") with localised content, internal links and LocalBusiness plus FAQ schema so you surface in both the map pack and organic results.",
        "We engineer a Google Business Profile review engine, automating post-job review requests by SMS and email, replying with keyword-aware responses, and posting regularly, because reviews and proximity drive the local pack for electricians.",
        "We target the full intent range, from urgent \"no power\" and \"electrician open now\" searches down to planned, higher-ticket work like EV chargers, generators, panel upgrades and commercial fit-outs, with content matched to each job's buyer.",
        "We tie organic rankings to booked jobs using call tracking, form tracking and GA4, so we optimise for the keywords that produce real quoted and closed work, not just traffic or vanity positions."
      ],
      "industryStandards": [
        "These are typical Canadian ranges for the electrical vertical, not guarantees: average residential job value commonly lands around $500 to $1,500, while panel upgrades, rewires, EV chargers and commercial work routinely run $3,000 to $15,000-plus.",
        "Organic visitors who land on a well-built electrician page typically convert to a call or form fill at roughly 5% to 10%, and booked leads close to paid jobs around 35% to 50% for licensed local contractors.",
        "For context on paid search in this vertical, electrician Google Ads clicks in the GTA typically cost about $9 to $14 and cost-per-lead often falls near $40 to $90, which is the benchmark SEO is designed to undercut over time.",
        "Local SEO is a compounding channel, so meaningful map-pack and organic movement usually takes about 3 to 6 months, with the strongest, lowest-cost lead flow building from there as authority and reviews grow."
      ],
      "whatToExpect": [
        "Onboarding starts with a technical and local audit of your site, Google Business Profile and competitors, a keyword and service-area map, and a tracking setup so every call and form fill is attributed before we touch rankings.",
        "Expect early wins on profile optimisation and quick technical fixes in the first weeks, with map-pack and organic ranking gains typically compounding over a 3 to 6 month horizon as content, reviews and authority build, framed as goals, not promises.",
        "You get plain-English monthly reporting tied to keyword rankings, calls and booked jobs rather than vanity traffic, plus a clear view of cost-per-lead trending down as organic share grows.",
        "You own everything we build, your website, Google Business Profile, content and tracking, on month-to-month terms, so the local SEO asset and its lead flow stay yours."
      ]
    },
    "law-firms": {
      "goodPractices": [
        "A good legal SEO setup has a dedicated, indexable page for every practice area and every city you serve (Toronto family law, Mississauga personal injury, Brampton immigration), not one thin \"practice areas\" list that ranks for nothing.",
        "It treats the Google Business Profile and lawyer/firm citations (NAP) as first-class: correct categories, consistent name-address-phone across legal directories, and a steady review flow that wins the local map pack.",
        "The most common mistake we fix is firms publishing generic, AI-spun or boilerplate content with no author bio, credentials or sources — pages that read as untrustworthy to both Google's E-E-A-T signals and a prospective client comparing lawyers.",
        "Many firms also never tie organic traffic to signed cases, so they cannot tell which keywords and pages actually produce consultations; we add call tracking and form attribution so SEO is judged on cases, not rankings."
      ],
      "bestPractices": [
        "We build genuine topic-cluster authority around each practice area — pillar pages plus supporting answers to the real questions clients ask (\"how long does an ICBC claim take in Ontario\", \"do I need a lawyer for an uncontested divorce\") — so the firm ranks for the long-tail intent that converts.",
        "We earn E-E-A-T the way Google rewards for YMYL legal content: named lawyer authorship, bar credentials, case results framed compliantly, plus LegalService and FAQ schema so the firm qualifies for rich results and AI-overview citations.",
        "We pursue local and authority links lawyers can actually get — bar association profiles, legal directories (Avvo, Lawyer Referral, Clio's network), local press, community sponsorships and HARO commentary — instead of spammy paid links that risk a manual action.",
        "We optimise the intake path, not just the ranking: fast mobile pages, a one-tap call button, clear \"book a free consultation\" CTAs and practice-area-specific landing copy, because legal buyers decide on trust and speed once they land."
      ],
      "industryStandards": [
        "Legal is one of the most competitive and expensive verticals in Canadian search; the equivalent paid CPC for terms like \"personal injury lawyer\" or \"divorce lawyer Toronto\" typically runs $8-$30+ CAD, which is why earned organic ranking compounds into the best cost-per-case over time.",
        "Organic conversion rate (visitor to consultation enquiry) on a well-built legal page typically lands around 2-5%, and an effective blended cost-per-qualified-lead from SEO usually settles in the ~$60-$250 CAD range as rankings mature — well below paid for high-intent terms.",
        "Average case/matter value varies widely by practice area — often roughly $1,500-$5,000+ CAD for family, immigration or smaller files, and materially higher for personal injury or commercial work — with lead-to-signed-case close rates commonly around 15-25%.",
        "Sales cycles are longer and trust-driven: prospects compare several firms, and competitive organic rankings generally take 6-12 months to mature, while local map-pack gains often appear in 60-90 days. These are typical representative ranges, not guarantees — real results vary by practice area, city and competition."
      ],
      "whatToExpect": [
        "Onboarding starts with a technical and content audit of your site, Google Business Profile and competitors, plus tracking setup (Search Console, Analytics, call and form attribution) so progress is measured against consultations and signed cases from day one.",
        "Expect local map-pack and \"near me\" gains to be the early wins, often within 60-90 days, while competitive practice-area rankings compound over 6-12 months — we aim for steady momentum and are upfront that legal SEO rewards consistency, not overnight jumps.",
        "You receive plain-English monthly reporting tied to leads and cases — rankings, traffic and which pages produced enquiries — not a vanity dashboard, with a human strategist reviewing every recommendation before it ships.",
        "You own everything: your website, Google Business Profile, Search Console, Analytics and all content and links we build stay in your accounts, and we work month-to-month with no long-term contract, so the work has to keep earning its place."
      ]
    }
  },
  "web-design": {
    "physiotherapy": {
      "goodPractices": [
        "A good physio landing page leads with the clinic's location, a 'book online' button, and one clear offer (e.g. assessment or direct-billing intake) above the fold, instead of a generic home page that buries the booking link in a menu.",
        "It connects straight to the clinic's booking software (Jane App, Janeapp, or similar) so a prospect can self-schedule in two taps rather than being told to 'call during business hours'.",
        "It names the conditions and services people actually search for - lower-back pain, sports injury, MVA/motor-vehicle-accident rehab, pelvic health, post-surgical recovery - because vague 'we treat everything' copy converts worse than condition-specific pages.",
        "The most common mistake we fix is sending Google and Meta traffic to a slow, unfocused WordPress home page with no tracked booking event, so the clinic pays for clicks it can never measure or improve."
      ],
      "bestPractices": [
        "We build a dedicated landing page per service or condition (e.g. one for sports injury, one for MVA rehab) that matches the ad keyword, then point each ad group at its own page so message and search intent line up.",
        "We make Canadian trust signals explicit - direct billing to major insurers, registered physiotherapist credentials, and ICBC/SABS or WSIB claim handling where relevant - because covered patients book faster when they can see they won't pay out of pocket.",
        "We instrument every page with conversion tracking on real outcomes (booking-confirmed, form-submit, click-to-call) and wire it into GA4 and the ad platforms, so optimisation targets booked appointments rather than raw clicks.",
        "We A/B test the offer, headline, and form length, and add click-to-call plus a sticky mobile booking bar, since most physio searches in the GTA happen on a phone with intent to book that day or week."
      ],
      "industryStandards": [
        "Google Search CPC for physiotherapy in the GTA typically runs about CAD $4-8 per click, with branded and broad-condition terms at the lower end and competitive 'physio near me' terms at the higher end (typical range, not a guarantee).",
        "A focused physio landing page usually converts in the ~6-12% range (visitor to booking or lead), versus the 1-3% that an unfocused general clinic page often delivers.",
        "Cost per booked-appointment lead commonly lands around CAD $25-70 depending on city, condition, and competition - tighter pages and direct-billing offers tend to sit at the lower end.",
        "Average initial-visit value is roughly CAD $90-130, and because physio is repeat-visit care, a new patient's first treatment block is frequently worth several hundred dollars over a typical 4-8 week plan."
      ],
      "whatToExpect": [
        "Onboarding starts with a short kickoff to map your services, insurers you direct-bill, booking software, and the conditions you most want to fill, then we design and build the page(s) around those.",
        "Our goal is a first landing page live within roughly 2-3 weeks, with conversion tracking verified before any meaningful ad spend goes through it.",
        "You get plain-English reporting tied to booked appointments and cost-per-booking - not vanity click counts - reviewed on a regular cadence so you can see what's working.",
        "You own everything: the page, the copy, the tracking setup, and the ad accounts stay in your name, so nothing is held hostage if you ever part ways with us."
      ]
    },
    "electrical": {
      "goodPractices": [
        "A good electrical contractor site loads in under three seconds on a phone, leads every page with a click-to-call number and an emergency/24-7 line, and puts a quote form above the fold instead of buried on a separate Contact page.",
        "It states licensed-and-insured status, ESA/Electrical Safety Authority authorization and the WSIB-covered crew up front, plus the exact GTA cities and postal regions served so homeowners and property managers know they're in your area.",
        "The common mistake we fix is a generic builder template with one catch-all 'Electrical Services' page and a slow image gallery; we split residential, commercial and emergency intent into focused landing pages that match what the ad or search promised.",
        "Most contractor sites also bury pricing and trust signals, so we surface service-call/diagnostic fees, financing for panel upgrades and EV-charger installs, and recent reviews where the homeowner decides."
      ],
      "bestPractices": [
        "We build a dedicated landing page per money service - panel upgrades, EV charger installation, knob-and-tube/aluminum rewiring, generator hookups and emergency calls - so each ad group and Local Service Ad sends traffic to a page that matches the exact job.",
        "Every page is wired with call tracking, form-fill and 'get a quote' conversion events feeding Google Ads and GA4, so we optimize toward booked jobs rather than raw clicks.",
        "We design for the after-hours emergency reality: sticky tap-to-call on mobile, a short 'describe the problem + photo upload' form, and clear hours so a homeowner with a dead panel reaches you in two taps.",
        "We add proof that converts this vertical - permit/inspection-passed counts, before/after panel photos, neighbourhood-level reviews, and the licence and Google Guaranteed badge - and A/B test headlines and hero offers against real lead data."
      ],
      "industryStandards": [
        "Search CPCs for electrical work in the GTA typically run about CA$9-18 per click, with high-intent emergency and panel-upgrade terms often pushing toward the top of that range.",
        "Cost per lead for a well-built electrical landing page typically lands around CA$25-70, depending on city, competition and whether it's emergency versus planned project demand.",
        "Landing-page conversion rates for this vertical typically sit near 8-12% when the page matches search intent and the call/quote path is frictionless - versus low single digits on a generic homepage.",
        "Average job value varies widely - roughly CA$150-400 for a service call, CA$2,000-4,500 for a panel upgrade and CA$1,000-2,500 for an EV-charger install - and the sales cycle is short, from same-day emergencies to a one-to-two-week quote-to-book window on larger projects."
      ],
      "whatToExpect": [
        "Onboarding starts with a working session on your top three services, service area, pricing posture and trust assets, then a sitemap and page plan you sign off on before we build.",
        "Expect a first conversion-ready landing page or site live in roughly two to four weeks, with tracking and call recording verified before we send any paid traffic to it.",
        "You get plain-English reporting tied to outcomes - leads, calls, cost per lead and which pages and services drive booked work - not vanity traffic charts.",
        "You own everything: the domain, the site, the analytics and the ad accounts stay in your name, and our goal is a measurable lift in qualified quote requests, framed as a target we work toward together, not a guarantee."
      ]
    },
    "construction-renovation": {
      "goodPractices": [
        "A good renovation landing page leads with the specific job type (kitchens, basements, additions, decks) and the service area so a Mississauga or Vaughan homeowner instantly knows they're in the right place, instead of the generic 'Welcome to our company' header most contractor sites open with.",
        "It puts real before/after project photos and clear scope above the fold, because reno buyers judge your craftsmanship by your weakest photo, not your copy; the common mistake we fix is stock imagery and a thin 'About Us' with no proof of finished work.",
        "Every page gives one frictionless way to start a quote, a short 'book a site visit' form plus a tap-to-call number on mobile, rather than a single contact link buried in the footer that quietly kills the lead.",
        "It loads fast and is built mobile-first around one clear next step, since most reno searches happen on a phone, so we strip out the bloated builder templates and slow image-heavy homepages that are the usual culprit."
      ],
      "bestPractices": [
        "We build a dedicated landing page per high-value service and city (for example 'Basement Renovations in Vaughan') so the page message matches the ad and the searcher's intent, instead of pointing all traffic at a one-size homepage.",
        "We position trust signals that actually matter for trades near every call-to-action, WSIB and liability coverage, HCRA licence or RenoMark status where it applies, warranty terms, and Google review counts, to lower the homeowner's perceived risk on a big-ticket job.",
        "We design the form to qualify the lead (project type, timeline, rough budget, postal code) and wire it to instant notifications and call tracking, so your estimator can reach a hot prospect within minutes instead of days.",
        "We A/B test the hero and offer (free in-home estimate versus design consult, photo-led versus financing-led) and keep iterating on the pages tied to your highest-value services so conversion improves over time, not just at launch."
      ],
      "industryStandards": [
        "Typical Google Ads cost-per-click for renovation and home-improvement keywords in the GTA runs roughly CA$6 to CA$14, with high-intent terms like 'kitchen renovation' or 'home addition contractor' at the top of that range.",
        "A well-built renovation landing page typically converts around 5% to 10% of visitors into a quote request or call; weak generic pages often sit below 2%, which is where most of the wasted spend hides.",
        "Cost per qualified lead in this vertical commonly lands around CA$80 to CA$250 depending on project type, season and competition, and high-ticket trades like additions sit at the upper end.",
        "Average job value typically ranges from roughly CA$15,000 to CA$40,000-plus, with a lead-to-customer close rate around 15% to 25% and a sales cycle of several weeks from first enquiry to signed contract; all figures are typical ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding starts with a short discovery call to map your most profitable services and service areas, gather your best project photos and reviews, and agree on what counts as a qualified lead before we design anything.",
        "We aim to have a first conversion-focused landing page live within about two to four weeks, then treat it as a starting point we test and refine rather than a finished brochure.",
        "You get transparent reporting on what matters, form fills, calls and cost per lead, in a live dashboard, with a real person to walk you through the numbers, not a monthly PDF of vanity metrics.",
        "You own everything we build, the pages, the domain, the tracking and the data, so the work stays yours if you ever part ways with us; results depend on offer, market and competition and are goals we work toward, not promises."
      ]
    },
    "roofing": {
      "goodPractices": [
        "A good roofing landing page leads with the job a homeowner actually wants booked — roof repair, full replacement, storm or leak emergency — instead of a generic 'we do roofing' homepage that buries the offer below the fold.",
        "It puts a click-to-call button, service area and a short 'book a free inspection' form above the fold, so a homeowner on mobile can reach you in one tap during a leak.",
        "Most roofer sites we inherit are slow, built on bloated templates, and send every ad to the homepage — we fix that by sending each ad group to a matched page (repair vs. re-roof) that loads fast on a phone.",
        "Trust signals — licence and WSIB/insurance, manufacturer certifications (e.g. GAF/IKO), Google reviews and real local job photos — are missing or hidden on most sites; we surface them where the decision is made."
      ],
      "bestPractices": [
        "We build dedicated landing pages per intent and season — emergency leak, repair, full replacement and storm response — so the message matches the search and the ad-to-page promise stays tight.",
        "Pages are mobile-first and load in under ~2.5 seconds, because most roofing searches happen on a phone and every extra second of load time quietly drops your conversion rate.",
        "We wire call tracking, form tracking and a missed-call text-back into every page so a homeowner who calls and doesn't connect still gets pulled into follow-up within minutes.",
        "We A/B test the offer, hero, form length and proof placement, and use neighbourhood-specific job photos and reviews to make a Mississauga or Vaughan homeowner feel you work on their street."
      ],
      "industryStandards": [
        "Roofing search clicks in the GTA typically run about $8-$20, reflecting high intent and high job values — these are representative ranges, not guarantees.",
        "A well-built, matched roofing landing page typically converts in the ~8-15% range, versus the ~2-4% common on an unfocused homepage we replace.",
        "Cost per booked inspection / qualified lead typically lands around $60-$200 depending on repair vs. replacement intent, season and competition.",
        "Average roofing job value is wide — roughly $400-$2,000 for repairs and $8,000-$25,000+ for a full re-roof — and the buying decision is usually days to a few weeks, so fast follow-up matters."
      ],
      "whatToExpect": [
        "Onboarding starts with a short kickoff and access setup; you keep ownership of your domain, hosting, pages, accounts and data from day one — nothing is held hostage if you leave.",
        "We aim to have a first matched landing page live within roughly 2-3 weeks, then iterate from real conversion data rather than guesses.",
        "You get plain-English reporting that ties page visits to booked inspections and revenue — not vanity clicks — plus call recordings and lead tracking so you can hear the jobs coming in.",
        "These are goals we work toward, not promises: the target is a faster, higher-converting page and a lower, more predictable cost per booked job over the first few months."
      ]
    },
    "law-firms": {
      "goodPractices": [
        "A good law-firm landing page leads with one practice area and one action — a one-tap call plus a short consultation form — instead of pointing ad traffic at a busy multi-practice homepage where intake gets lost.",
        "It earns trust above the fold with the things legal buyers actually check: lawyer names and credentials, bar standing, real reviews, case-result framing that stays compliant, and a clear office location for the GTA market.",
        "The common mistake we fix is slow, template-heavy WordPress builds that bury the phone number, ask for ten form fields, and load in five-plus seconds on mobile — quietly wasting the most expensive clicks online.",
        "We also fix pages with no conversion tracking or call tracking wired in, so the firm can't tell which practice area or keyword produced a signed case versus a tire-kicker."
      ],
      "bestPractices": [
        "We build a dedicated landing page per practice area (personal injury, family, immigration, real estate, criminal) so the headline, proof and intake questions match the exact search intent the ad was bought for.",
        "We engineer for mobile speed and Core Web Vitals first — most legal clicks come from phones — pairing a sticky click-to-call bar with short, qualifying intake forms that screen for case type, location and timeline.",
        "We keep claims FTC- and Law-Society-compliant, using disclaimers and 'past results don't guarantee' language so the page converts without creating an advertising-conduct problem for the firm.",
        "We connect call tracking, form tracking and the firm's CRM or intake software, then run structured A/B tests on headlines, proof and form length so cost-per-qualified-consultation keeps dropping over time."
      ],
      "industryStandards": [
        "These are TYPICAL RANGES for the Canadian/GTA legal market, not guarantees — results vary by practice area, competition and intake quality.",
        "Legal clicks are among the most expensive online: roughly $8-$50+ CAD per click on Google Search, with personal-injury and DUI/criminal at the top end and family or estate law lower.",
        "Well-built legal landing pages typically convert in the ~4%-12% range, versus the ~1%-3% common on generic homepage traffic; cost-per-qualified-consultation often lands around $80-$400+ depending on practice area.",
        "Case values are high — frequently $1,500-$5,000+ in fees for many files and far more for litigation — and sales cycles run from a same-week call to several weeks of deliberation, which is why call tracking and fast intake matter more than raw volume."
      ],
      "whatToExpect": [
        "Onboarding starts with a working session on your practice areas, case values, intake process and compliance rules, plus an audit of any current pages — so the goal is a build informed by your real economics, not a generic template.",
        "Most single practice-area pages aim to go live within 2-4 weeks; the goal is a measurable lift in qualified consultations within the first 1-2 months as we test and refine, not an overnight promise.",
        "You get plain-English reporting tied to revenue — qualified consultations and signed cases by practice area and keyword — rather than clicks and bounce-rate vanity metrics.",
        "You own everything: the pages, the domain, the tracking setup and the data stay yours, and we build so your team can keep capturing and following up on every lead if we ever part ways."
      ]
    },
    "real-estate": {
      "goodPractices": [
        "A good real-estate landing page leads with one offer — usually a 'what's your home worth?' valuation — instead of dumping visitors on a generic homepage or IDX search.",
        "The form asks only what's needed to start a conversation (address, name, email or phone), because every extra field on a mobile real-estate form quietly drops conversions.",
        "Most agent sites we audit bury the call-to-action below a video header, load slowly on mobile, and link ads to the homepage — we fix all three by sending each campaign to a matched, single-purpose page.",
        "Trust signals — recent sold prices, neighbourhood expertise, RECO/brokerage details and real reviews — sit above the fold instead of being hidden on a separate 'About' page."
      ],
      "bestPractices": [
        "We build separate seller (home-valuation) and buyer (listing / area-alert) pages, because the offer, the wording and the follow-up are completely different for each intent.",
        "Pages are built mobile-first and tuned for Core Web Vitals, since the majority of GTA real-estate traffic arrives on a phone and slow loads burn ad budget.",
        "We wire instant lead routing so a new enquiry hits the agent's phone and CRM within minutes — speed-to-lead is the single biggest lever on whether a real-estate lead ever books a tour.",
        "Every page ships with GA4, conversion tracking and a thank-you/booking step, and we A/B test headlines, hero images and form length so the page keeps improving instead of going stale."
      ],
      "industryStandards": [
        "Typical real-estate valuation/landing-page conversion rate: roughly 8–14% of visitors who start the form, when the offer and follow-up are dialled in (range, not a guarantee).",
        "Typical cost per lead from paired Meta campaigns: about CAD $8–25, varying by market, audience and creative freshness.",
        "Typical average commission value behind each closed deal: roughly CAD $8,000–25,000+, which is why even a long sales cycle pays back.",
        "Typical speed-to-lead target: under 5 minutes from form submission to first agent contact — the practical benchmark for keeping leads warm."
      ],
      "whatToExpect": [
        "Onboarding starts with a short brief on your farm area, target buyer/seller and brokerage assets, then we map the offer and write the page before any build begins.",
        "Goal is a first valuation or listing page live within roughly 2–3 weeks, with tracking and instant lead routing wired in from day one.",
        "You get a live dashboard plus plain-English reporting on leads, cost per lead and conversion rate — not vanity metrics or a once-a-quarter PDF.",
        "You own the pages, copy, domain and tracking accounts; nothing is held hostage if you ever decide to part ways."
      ]
    },
    "home-improvement": {
      "goodPractices": [
        "A good home-improvement landing page leads with the specific job (kitchen reno, roof replacement, basement finishing) and the service area, not a generic 'Welcome to our website' homepage that forces a high-intent visitor to go hunting.",
        "It loads in under three seconds on a phone, because most GTA homeowners click your ad on mobile and bounce if a heavy slider or hero video stalls.",
        "Trust is shown above the fold with real proof points - years in business, WSIB/licensing, warranty, financing, and before/after photos of actual jobs - instead of stock images and vague 'quality you can trust' copy.",
        "The common mistake we fix is sending paid traffic to a slow, multi-purpose homepage with the phone number buried in a footer; we replace it with a focused page where calling or booking a quote takes one tap."
      ],
      "bestPractices": [
        "We build a dedicated landing page per service and per high-value city (e.g. 'Roofing in Mississauga'), so the ad, the headline and the page match the search and Quality Score climbs while cost-per-click drops.",
        "Every page carries a sticky click-to-call bar, a short quote form, and a 'get a free estimate' CTA repeated down the page, with call and form tracking wired to Google Ads and Meta so we optimize to booked jobs, not just clicks.",
        "We add credibility blocks that matter for big-ticket renos - financing options, project galleries, neighbourhood/postal-code coverage, Google review pull-through, and clear warranty terms - to reduce the hesitation on a $10k-$30k decision.",
        "We A/B test offers, headlines and form length, and put seasonal pages live ahead of demand (furnace and roofing in fall, AC and decks in spring) so the page is ranking and converting before the GTA rush hits."
      ],
      "industryStandards": [
        "Typical Google Search CPC for home-improvement trades in Canada runs roughly CA$8-CA$18, with emergency and high-value services (roofing, HVAC) often at the top of that range.",
        "Landing-page conversion rate for a focused trades page typically lands around 6-12 percent of clicks turning into a lead, versus 1-3 percent for an unfocused homepage.",
        "Cost per lead is commonly in the CA$40-CA$150 range depending on service and competition, with premium renovation niches running higher.",
        "Average job value spans widely - roughly CA$300-CA$2,000 for repairs and service calls up to CA$15,000-CA$40,000+ for full renovations or roof replacements - and the sales cycle runs from same-day for emergencies to several weeks for large quoted projects."
      ],
      "whatToExpect": [
        "Onboarding starts with a short kickoff to map your services, service area, margins and the jobs you actually want more of, then we draft page structure and copy for your sign-off before anything goes live.",
        "We aim to have a first landing page built and live within roughly one to two weeks, with conversion tracking in place from day one so early lead quality is visible, not guessed at.",
        "You get plain-English reporting tied to leads and booked quotes - not vanity clicks - plus a clear view of which pages and offers are pulling, reviewed on a regular cadence.",
        "The pages, copy, tracking and ad accounts are built in your accounts and remain yours; the goal is a measurable lift in qualified quote requests, framed as a target we work toward together, not a guaranteed number."
      ]
    }
  },
  "crm": {
    "healthcare-clinics": {
      "goodPractices": [
        "A good clinic setup contacts every new patient enquiry within minutes by SMS and call — most lost bookings happen because the front desk replies hours later, when the patient has already booked elsewhere.",
        "Pipelines mirror the real patient journey (new enquiry, intake form sent, booked, confirmed, attended, recall) instead of the generic lead/won stages most clinics inherit from a template.",
        "Online forms, the phone line and your booking calendar feed one system, so a patient is never double-handled and no enquiry sits unworked in an inbox.",
        "The common mistake we fix: clinics treat the CRM as a static contact list with no automated follow-up, so 'not ready yet' patients and past patients quietly go cold."
      ],
      "bestPractices": [
        "We wire call tracking into the CRM because most clinic bookings happen by phone, so missed and after-hours calls trigger an automatic text-back rather than becoming a lost patient.",
        "Automated appointment confirmations and reminders by SMS and email cut no-shows, with same-day cancellations routed to a waitlist sequence that backfills the slot.",
        "Recall and reactivation automations bring patients back for follow-ups, renewals and check-ups on a schedule, turning one visit into ongoing lifetime value.",
        "We keep automations PHIPA-aware — clinical details stay in your EMR, the CRM handles booking and reminders, and outbound messaging avoids implied medical claims or guaranteed outcomes."
      ],
      "industryStandards": [
        "Typical Canadian Google Ads cost-per-click for clinic search terms runs roughly $6–$11 CAD, with cost-per-enquiry commonly in the $40–$120 CAD range depending on city and service line.",
        "Landing-page or form conversion for high-intent clinic searches typically sits around 8–12%, and a well-run speed-to-lead setup usually books a meaningfully higher share of those enquiries.",
        "First-visit or episode-of-care value for most GTA clinics typically falls in the ~$150–$900 CAD range, with real return driven by repeat visits and lifetime patient value, not a single appointment.",
        "Without reminders, clinic no-show rates of ~10–20% are typical; automated confirmation and reminder flows generally pull that down materially. These are representative ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding starts by mapping your real intake and booking process, then we configure pipelines, calendars, routing and speed-to-lead — most builds go live within about 30 days.",
        "You should feel the impact fastest on response time, with new enquiries contacted in minutes instead of hours, and on fewer empty chairs as reminders go live.",
        "Reporting ties ad spend through to booked and attended appointments in one dashboard, so you see cost per booked patient and pipeline by stage rather than guessing.",
        "You own the CRM account, patient contact data, automations and dashboards permanently — we build it under your ownership, document it, and you keep everything if you ever leave, with no long-term contract."
      ]
    },
    "dental": {
      "goodPractices": [
        "A good setup contacts every new-patient enquiry by SMS and call within five minutes, because dental leads shop two or three nearby clinics and book whoever responds first.",
        "Every lead source — Google Ads, Meta, your booking widget, missed phone calls — flows into one pipeline so nothing dies in a front-desk inbox or on a sticky note.",
        "Most clinics we audit have no recall or reactivation system, so lapsed hygiene patients and unbooked Invisalign/implant consults quietly disappear; we automate the follow-up that wins them back.",
        "The common mistake is treating the CRM as a glorified contact list with no stages or automations — we map real statuses (enquiry, booked, showed, treatment-planned) so you can see exactly where patients stall."
      ],
      "bestPractices": [
        "We separate fast-decision visits (new-patient exam, emergency, cleaning) from high-value considered cases (implants, Invisalign, full-mouth) and run different nurture cadences for each, since a $200 cleaning and an $8,000 case don't convert on the same timeline.",
        "Two-way SMS with confirmations, reminders and waitlist fill-in cuts no-shows and quietly recovers chair time that paid ads already paid for.",
        "We build CASL-compliant consent and PHIPA-aware handling into every sequence, keeping patient communication on-side with Canadian rules rather than blasting unsolicited texts.",
        "Booked appointments and treatment-acceptance outcomes are fed back to Google and Meta as conversions, so the ad platforms optimise toward patients who actually show and start treatment, not just form fills."
      ],
      "industryStandards": [
        "Typical dental search CPC in the GTA runs roughly CA$6–11, with cost per new-patient lead commonly in the CA$40–120 range depending on procedure and competition (typical ranges, not guarantees).",
        "Landing-page-to-lead conversion for dental search traffic typically sits around 7–10%, with lead-to-booked-patient close rates often in the 30–40% range once follow-up is fast and consistent.",
        "Average new-patient value varies widely — a recurring hygiene patient may be a few hundred dollars a visit, while implant or Invisalign cases run into the thousands — so we model lifetime value, not just the first appointment.",
        "The buying cycle is short for exams and emergencies (often same week) but can stretch weeks to months for elective and cosmetic cases, which is why structured nurture matters more in dental than in most local verticals."
      ],
      "whatToExpect": [
        "Onboarding starts with mapping your patient journey and pipeline stages, then we configure routing, booking calendars and speed-to-lead automations — typically live within the first few weeks.",
        "The goal is to have every new lead contacted within minutes and a working recall/reactivation sequence running, so wins usually show first as fewer missed enquiries and recovered chair time.",
        "You get one dashboard tying ad spend to leads, booked appointments and revenue, so you can see cost per new patient instead of guessing what marketing returned.",
        "Everything is built in your own CRM and accounts — you own the patient data, the automations and the reporting, with no lock-in if you ever leave."
      ]
    },
    "hvac": {
      "goodPractices": [
        "A good HVAC CRM routes every new lead to an automated text and call back within five minutes, because a homeowner with no heat in January will book the first contractor who answers, not the cheapest quote.",
        "Install and replacement enquiries get a separate pipeline from repair, tune-up and maintenance-plan requests, so a $9,000 furnace job is never worked the same way as a $200 service call.",
        "The most common mistake we fix is quotes that die in an inbox: estimates get sent, the homeowner goes quiet, and nobody follows up, so we wire automated quote-follow-up and review-request sequences to recover that booked work.",
        "Every lead source, missed call and booked job lives in one system tied back to ad spend, instead of being scattered across voicemail, texts, a wall calendar and the office manager's memory."
      ],
      "bestPractices": [
        "We build seasonal automations that pre-empt demand spikes, reactivating last year's tune-up and maintenance-plan customers ahead of the GTA heating and cooling seasons instead of waiting for the phone to ring.",
        "Missed-call-text-back fires the instant a call goes unanswered during a no-heat or no-AC surge, so a busy dispatch line stops leaking emergency jobs to competitors.",
        "We score and route leads by job type and value, fast-tracking install and replacement enquiries to a senior closer while service and maintenance requests flow to booking automatically.",
        "Closed-loop reporting feeds booked-job and revenue outcomes from the CRM back into Google and Meta, so spend shifts toward the campaigns producing real installs, not just form fills."
      ],
      "industryStandards": [
        "Typical GTA HVAC Google Search CPC runs roughly CAD $9–$16 on high-intent emergency and replacement terms, with Meta lead-gen usually cheaper per click but lower intent.",
        "Cost per lead typically lands around CAD $40–$120 depending on whether you're chasing repair calls or higher-ticket install quotes and the season.",
        "Landing-page and lead conversion rates of about 6–10% are representative for well-tracked HVAC search traffic.",
        "Average job value spans a wide range, roughly CAD $200–$500 for a repair or tune-up versus CAD $6,000–$12,000+ for a furnace or AC replacement, with install close rates often near 30–45% when follow-up is fast (typical ranges, not guarantees)."
      ],
      "whatToExpect": [
        "Onboarding maps your real sales process first, defining install vs service pipelines, dispatch hand-offs and seasonal lead lifecycle before anything is built.",
        "Expect speed-to-lead automation and core pipelines live within the first few weeks, with nurture and reactivation sequences following as we connect ads, forms and calls into one system.",
        "You get a single spend-to-revenue dashboard showing leads, booked jobs and cost per booked job, reported plainly rather than buried in vanity metrics.",
        "You own the CRM, the data and the automations outright, whether we build in GoHighLevel or integrate the system you already run, so nothing is held hostage if you ever leave."
      ]
    },
    "plumbing": {
      "goodPractices": [
        "A good plumbing CRM treats the phone as the pipeline: every call is tracked, recorded and tagged emergency vs. project, and a missed-call text-back fires within seconds so the lead never dials the next plumber.",
        "New leads from Google, Local Services Ads, the website and the answering service all land in one pipeline with stages that match how plumbing actually closes (new call, dispatched, on-site quote, booked, won).",
        "The most common mistake we fix is enquiries scattered across a personal cellphone, a shared inbox and sticky notes on the truck dash, with no record of who called after hours or which jobs were never followed up.",
        "The other recurring leak is no automated after-hours coverage and no review request, so 2am burst-pipe calls go unanswered and happy customers never get asked for the Google review that wins the next job."
      ],
      "bestPractices": [
        "We build in GoHighLevel (or wire your existing CRM) with separate emergency and project workflows: emergencies trigger instant call routing and missed-call text-back, while project leads (repipes, water heaters, bathroom renos) drop into a longer quote-and-nurture sequence.",
        "Speed-to-lead automation aims to put a real first touch in front of every new lead inside five minutes by SMS, email and call, because a 2am emergency call is won or lost on who answers first.",
        "Automated quote follow-up and multi-day nurture chase pending estimates on bigger jobs so project work does not stall, and a post-job sequence requests a Google review the moment a ticket is marked complete.",
        "Closed-loop reporting ties Google and LSA spend through to booked jobs and collected revenue in one dashboard, broken out by service line, so you can see which campaigns and which job types actually pay back."
      ],
      "industryStandards": [
        "Typical Canadian plumbing search CPC runs roughly $8-$18, and at a 7-10% lead conversion rate that puts cost-per-lead in the $90-$250 range depending on city and competition (typical ranges, not guarantees).",
        "Average job value spans widely, from ~$200-$400 service calls to $3,000-$6,000+ projects like repipes and water-heater or bathroom work, so a single recovered emergency call can pay for a month of automation.",
        "Lead-to-booked-job rates for high-intent plumbing calls typically land around 40-50% once follow-up is fast, with emergencies closing far faster than multi-touch project quotes.",
        "A practical speed-to-lead target is under 5 minutes to first contact; sales cycles run from same-day for emergencies to a few days or weeks for planned projects."
      ],
      "whatToExpect": [
        "Onboarding starts by mapping your real sales process, pipeline stages and lead lifecycle, then building pipelines, calendars, routing and speed-to-lead automation, typically inside the first 30 days.",
        "The aim is to have ads, web forms, Local Services Ads and tracked calls flowing into one system with missed-call text-back and nurture live within the first month, and a single spend-to-revenue dashboard you can read at a glance.",
        "Reporting is transparent and goal-oriented: speed-to-first-contact, leads worked vs. missed, lead-to-booked-job rate and cost per booked job by service line, reviewed with you, not buried in a monthly PDF.",
        "You own everything: the CRM account, your data, the call history and the automations stay yours, and we work month to month rather than locking you into a long contract."
      ]
    },
    "immigration": {
      "goodPractices": [
        "A good setup routes every web, Meta and Google lead into one pipeline within seconds and triggers an instant first touch, because most immigration enquiries go cold while the consultant is in a consultation or asleep across time zones.",
        "Pipelines are segmented by program (study, work, PR, family, citizenship) so a quick study-permit enquiry isn't nurtured the same way as a high-value PNP or Express Entry file.",
        "The most common mistake we fix is leads living in an inbox, a spreadsheet and a notebook at once, with no record of who followed up, when, or in which language — so booked consultations get missed and no-shows are never re-engaged.",
        "Another fix: follow-up that stops after one email; we build multi-day, multi-channel sequences (email, SMS, WhatsApp) because immigration decisions take weeks or months, not one click."
      ],
      "bestPractices": [
        "We build the CRM (GoHighLevel by default, or integrate your existing one) around your real intake process, with an eligibility-quiz lead magnet that captures and qualifies in one step before a human ever calls.",
        "Speed-to-lead automation aims to make first contact in under 30 minutes — auto-text, auto-email and a booking link — plus missed-call-text-back so after-hours enquiries still convert.",
        "Long, compliant nurture sequences keep prospects warm through their decision window, with messaging that never implies a guaranteed visa or PR outcome and surfaces RCIC credentials and real timelines.",
        "We track each lead to booked consultation and signed retainer by program, and feed those outcomes back to the ad platforms so budget shifts toward the programs that actually produce paying clients — not just cheap clicks."
      ],
      "industryStandards": [
        "Typical cost per lead runs about $10–40 on Meta and Google for immigration enquiries, though it varies by program and how broad the targeting is.",
        "A representative consultation-booking rate is roughly 8–15% of leads, and signed-client rates rise sharply when speed-to-lead is under 30 minutes versus hours.",
        "Average client value typically lands around $1,500–$8,000+ depending on program complexity, with PR and PNP files at the top of that range.",
        "Immigration sales cycles are long — often weeks to several months from first enquiry to retainer — which is exactly why disciplined CRM nurture, not just lead volume, drives the result. These are typical Canadian/GTA ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding maps your programs, intake steps and follow-up rules first, then we build the pipeline, calendars, lead routing and automations around them — usually live and capturing leads inside the first few weeks.",
        "Early wins (faster first contact, fewer dropped leads, more booked consultations) tend to show in the first 30–60 days; signed-client gains build over the following months as nurture sequences mature.",
        "You get clear reporting that ties leads to booked consultations and signed clients by program, so you can see cost per consultation and cost per client — not just form fills.",
        "You own everything — the CRM account, your contact data, the automations and the integrations stay yours if we ever part ways. These are the goals we work toward, framed honestly, not promised outcomes."
      ]
    },
    "real-estate": {
      "goodPractices": [
        "A good real estate CRM routes every valuation and listing lead to the right agent within minutes and fires an automated first text and email, because GTA buyers and sellers often enquire with three or four agents at once and the first to respond usually wins the appointment.",
        "Buyer and seller leads run on separate pipelines with their own stages and nurture, since a 'what's my home worth?' seller is months from listing while an area-alert buyer needs new listings now.",
        "What we usually fix: leads piling up in a shared inbox, voicemail and sticky notes with no owner, no follow-up after the first call, and 'not ready yet' leads silently dying instead of being nurtured toward next spring's listing.",
        "We also fix the broken loop where agents can't tell which ad spend produced a closed deal, so commission gets credited to 'referrals' and the marketing that actually worked gets cut."
      ],
      "bestPractices": [
        "We build the pipeline in GoHighLevel (or wire your existing CRM) with sub-five-minute speed-to-lead routing, round-robin or geography-based assignment, and AI-drafted, on-brand first-touch SMS and email so no valuation lead goes cold.",
        "We run long-horizon nurture built for a months-long decision: automated monthly market-update and just-listed/just-sold sequences, birthday and home-anniversary touches, and a 'home value changed' re-engagement so a lead captured today still books a listing appointment next quarter.",
        "We add missed-call text-back, calendar booking for showings and listing consults, and reactivation campaigns against your past-client and dead-lead database, the cheapest source of repeat and referral commission an agent owns.",
        "We close the loop with one dashboard tying Meta and Google spend to leads, appointments, listings taken and closed commission, plus speed-to-lead and lead-to-appointment reporting per agent so accountability is visible."
      ],
      "industryStandards": [
        "These are typical Canadian/GTA ranges, not guarantees, and your numbers depend on market, price band and follow-up discipline.",
        "Typical Meta cost-per-lead for valuation and listing offers: roughly $8-25 CAD; high-intent Google buyer/seller search leads usually run higher.",
        "Valuation landing-page conversion typically lands around 8-14%, and speed-to-lead under 5 minutes is the benchmark that separates a tour from a dead lead.",
        "Average commission value commonly sits around $8,000-$25,000+ per closed side; the sales cycle runs weeks to many months, so most closings come from nurture long after the first click."
      ],
      "whatToExpect": [
        "Onboarding starts by mapping your real sales process, buyer and seller pipelines and lead sources, then building routing, speed-to-lead automation and booking in roughly the first 2-3 weeks.",
        "Speed-to-lead and missed-call text-back typically go live first so faster follow-up shows up almost immediately, while nurture and database reactivation compound over the following months as sequences mature.",
        "You get one spend-to-commission dashboard plus clear reporting on speed-to-lead, appointments booked and pipeline value, reviewed with you rather than buried in a monthly PDF.",
        "You own the CRM, automations, contact data and reporting; the goal is a predictable, less referral-dependent pipeline that keeps working whether or not you stay with us."
      ]
    },
    "fitness-gyms": {
      "goodPractices": [
        "Every trial, class pass and \"first month\" lead is captured in one CRM with a clear stage from enquiry to booked intro to active member, so nothing lives in a coach's phone or an Instagram DM.",
        "A good setup contacts a new lead by text within minutes and books the trial automatically; the common mistake we fix is gyms emailing back hours later, by which point the prospect has signed with the studio down the street.",
        "Membership-cancellation, failed-payment and no-show events trigger a save flow instead of being noticed weeks later, because in fitness the leak is churn as much as it is lead follow-up.",
        "We replace front-desk staff manually re-typing leads between Mindbody, your booking tool and a spreadsheet with one source of truth that every coach and owner can actually see."
      ],
      "bestPractices": [
        "We build speed-to-lead in GoHighLevel so a free-trial or challenge sign-up gets an instant SMS plus a self-book calendar link, then escalate to a call task if they don't book.",
        "We automate the trial-to-paid journey: pre-visit reminders, a day-three \"how was it\" check-in, and a timed membership offer before the trial lapses, so conversion doesn't depend on whoever is on the floor.",
        "We wire a win-back and at-risk flow off attendance and billing data — lapsed members and failed payments get a personal-feeling automated nudge, which protects monthly recurring revenue.",
        "We close the loop from ad spend to active members: lead source flows through the CRM to booked intros and signed memberships, so you see cost per member, not just cost per lead, and we feed that back into the campaigns."
      ],
      "industryStandards": [
        "These are typical Canadian/GTA ranges, not guarantees. Meta trial-offer leads commonly run about $8-$25 per lead; Google \"gym near me\" clicks typically sit around $2-$5 with a higher cost per lead.",
        "Lead-to-booked-trial rates of roughly 25-45% are typical once speed-to-lead and auto-booking are in place; without fast follow-up many gyms convert well under half of that.",
        "Trial-to-paid-membership conversion for local studios typically lands around 30-50% depending on offer and follow-up quality.",
        "Average member value in the GTA is often framed around $700+ over the membership lifetime, with a sales cycle of days to a couple of weeks from first enquiry to signed member."
      ],
      "whatToExpect": [
        "Onboarding maps your real journey — lead sources, trial offer, booking tool and billing — then we build the pipeline, automations and templates in GoHighLevel or alongside the CRM you already run.",
        "Expect speed-to-lead and trial automations live within the first few weeks, with the aim of faster first contact and a measurable lift in trials that actually show and convert.",
        "You get one spend-to-revenue dashboard tying lead source to booked trials and signed members, plus plain-English reporting rather than vanity metrics.",
        "You own the CRM, the automations and the member data — if we ever part ways, the system and your list stay with you, and we'll document how it runs."
      ]
    },
    "med-spa": {
      "goodPractices": [
        "A good setup catches every consultation request from Meta, Google, the booking page and DMs into one CRM, then texts back within minutes while intent is still high.",
        "Most GTA med spas we audit are letting leads sit in a shared inbox or Instagram DMs for hours, so the higher-budget enquiry has already booked a competitor by the time anyone replies.",
        "The common failure is no deposit or confirmation flow, so the calendar fills with no-shows and the front desk spends its day chasing reschedules by phone.",
        "We fix the disconnect where ad platforms never learn which leads actually showed and paid, because booked revenue is never written back from the CRM into Google and Meta."
      ],
      "bestPractices": [
        "We build speed-to-lead automation that fires an SMS and email within roughly 60 seconds of any consult request, with reminders escalating until the client books or opts out.",
        "We set up deposit-backed booking plus 72-hour, 24-hour and same-day reminder sequences to cut no-shows on high-ticket treatments like injectables, laser and body contouring.",
        "We segment by treatment interest and lifetime value so package, membership and re-treatment (Botox top-up, follow-up session) nudges go out on the right clinical interval, not as generic blasts.",
        "We pipe showed-and-paid outcomes back into Google and Meta as offline conversions so bidding optimizes toward clients who actually book treatments, plus automated review requests after each visit to protect local ranking."
      ],
      "industryStandards": [
        "Typical Canadian med spa cost-per-consultation-lead runs roughly $25–$70 on Meta and $60–$150 on high-intent Google search, depending on treatment and city competitiveness.",
        "Lead-to-booked-consult conversion typically lands around 25–40% once speed-to-lead and reminders are working, in line with the ~30% close rate we model for this vertical.",
        "Average treatment ticket is commonly in the $300–$1,500 range, with package and membership clients lifting annual value well past that — we model a representative $1,200 ticket.",
        "No-show rates of 20–30% are common without deposits and reminder flows, and the sales cycle from first enquiry to booked treatment usually runs a few days to a couple of weeks; all figures are typical ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding starts with mapping your treatments, current tools and booking system, then connecting every lead source into one CRM with tracking you can trust.",
        "Expect speed-to-lead and reminder automations live within the first few weeks, with the goal of fewer no-shows and faster replies showing in the early weeks, not months.",
        "You get a live dashboard tying ad spend to consults, booked treatments and revenue, plus a plain-English review so you always know cost per booked client.",
        "You own the CRM, the data, the automations and the audience lists; if we ever part ways, everything stays in your account, and figures we share are targets we work toward, never promises."
      ]
    },
    "professional-services": {
      "goodPractices": [
        "A good setup routes every web form, call and LinkedIn lead into one CRM within seconds and fires an automated first touch, instead of leaving enquiries scattered across inboxes, voicemail and a partner's phone.",
        "Pipeline stages mirror how the firm actually sells (enquiry, consult booked, proposal sent, retainer signed) so owners can see where deals stall, rather than the generic 'open/won/lost' most firms run.",
        "The most common mistake we fix is no nurture for long sales cycles, so 'not yet' prospects who are 60-90 days out simply go cold and are never re-engaged.",
        "We also fix the broken loop where ad spend can't be tied to signed clients, because lead source and revenue were never captured against the contact record."
      ],
      "bestPractices": [
        "We wire sub-5-minute speed-to-lead with SMS, email and a routed call, because most B2B buyers shortlist two or three firms and the first credible reply usually wins the consult.",
        "We build long-cycle nurture sequences (case studies, FAQs, booking nudges) timed to the firm's real sales cycle so quiet prospects stay warm without manual follow-up from the partners.",
        "We score and route leads by ICP fit (title, company size, service line) so senior staff spend time on qualified accounts, not tyre-kickers, and unqualified enquiries get an automated path.",
        "We close the loop by pushing CRM outcomes (signed/lost and deal value) back into Google and Meta, so the platforms optimise toward clients that actually sign, and we keep PIPEDA-compliant consent and unsubscribe handling built in."
      ],
      "industryStandards": [
        "Typical Google Search CPCs for Canadian professional and B2B services run roughly $5-$12 CAD, with LinkedIn clicks higher (often $8-$15+) given precise decision-maker targeting.",
        "Cost per lead is usually in the ~$60-$200 CAD range depending on service line and channel, with qualified (ICP-fit) cost per lead landing higher once junk is filtered out.",
        "Landing-page or form conversion rates of ~5-9% are typical for high-intent search, while colder social traffic usually converts lower.",
        "Average client or engagement value commonly sits around $2,000-$5,000+ CAD with close rates near 15-30%, and sales cycles that often run several weeks to a few months. These are typical ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding starts with mapping your real sales process, pipeline stages and lead lifecycle, then building pipelines, calendars, routing and speed-to-lead automations in the first few weeks.",
        "We aim to have ads, forms and calls flowing into one system with nurture live and a single spend-to-revenue dashboard inside the first 30 days.",
        "Reporting is one transparent dashboard tying ad spend to leads, booked consults and signed clients, so you stop guessing which channel drives revenue.",
        "You own the CRM, the data and every automation we build (in your own GoHighLevel or your existing CRM), so nothing is held hostage if we ever part ways."
      ]
    }
  },
  "meta-ads": {
    "hvac": {
      "goodPractices": [
        "A good HVAC Meta setup runs seasonal offer campaigns — furnace tune-ups before winter, AC installs and maintenance plans before summer — instead of one static \"we do HVAC\" ad that ignores the calendar.",
        "It uses lead forms and click-to-call built for homeowners on a phone, with the offer, service area and price anchor visible before anyone has to fill anything in.",
        "The most common mistake we fix is treating Meta like Search: chasing \"furnace emergency\" buyers who are already Googling, when Meta's real job for HVAC is demand-gen, seasonal offers and retargeting people who clicked but didn't book.",
        "The other recurring problem we fix is wide-open targeting and no Pixel or Conversions API — so Meta optimizes for cheap clicks across the GTA instead of actual booked service calls, and every lead disappears the moment it lands."
      ],
      "bestPractices": [
        "We wire the Meta Pixel plus Conversions API and feed booked-job and revenue data back, so the algorithm optimizes toward homeowners who become installs, not toward the cheapest form fill.",
        "We build offer-led creative around specific seasonal jobs — \"$XX furnace tune-up,\" rebate-eligible heat pumps, pre-summer AC checks — and run short user-style video against polished ads to find what GTA homeowners actually respond to.",
        "We layer retargeting and lookalikes off your customer list, quote requests and high-ticket install buyers, so spend concentrates on neighbourhoods and audiences that resemble your best past jobs.",
        "Every new Meta lead drops into speed-to-lead automation that texts and calls within minutes — because for HVAC, the job is usually won by whoever follows up first, not whoever bid highest."
      ],
      "industryStandards": [
        "Meta CPCs for Canadian HVAC typically run about $1.50–$3.00, with CPMs swinging higher in peak heating and cooling season when every contractor is bidding.",
        "Cost per lead on Meta for HVAC commonly lands in the ~$25–$80 range — usually cheaper than Google, but the leads are earlier-intent and need fast, structured follow-up to convert.",
        "Landing-page and lead-form conversion rates of roughly 4–8% are typical for well-matched seasonal offers; weak offers or generic pages sit well below that.",
        "Average HVAC job value spans a wide range — service calls in the low hundreds up to $5,000+ for a furnace, AC or heat-pump install — and the sales cycle runs same-day for emergencies to several weeks for planned replacements, so we report on cost per booked job, not cost per click. These are typical industry ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding starts with your service area, seasonal priorities, average job values and the offers you can stand behind, then we set up tracking — Pixel, Conversions API, call and form tracking — before we scale spend.",
        "Expect early leads within the first week or two of launch, with the first 60–90 days focused on cutting wasted spend and learning which offers and audiences actually produce booked installs.",
        "You get plain-English reporting tied to cost per booked job and revenue — not vanity likes or reach — plus a clear read on which seasonal campaigns are carrying their weight.",
        "You keep full ownership of your ad account, Pixel, audiences and lead data, engagements stay month-to-month, and ad spend is always separate from our management fee — these are the goals we work toward, framed honestly, not guaranteed numbers."
      ]
    },
    "construction-renovation": {
      "goodPractices": [
        "A good setup runs by project type and job value — kitchen and bath remodels, basements, additions, exterior renovations each get their own ad sets, creative and budget instead of one generic 'renovation' campaign.",
        "Most contractor accounts we inherit boost a few job-site photos with no offer, no instant form and no lead tracking, so spend buys likes and reach instead of estimate requests we can measure.",
        "Good campaigns gate the lead behind a real qualifier (postal code, project scope, timeline and rough budget) so the calendar fills with serious homeowners, not tyre-kickers chasing a free quote.",
        "We fix the usual leaks: no Meta pixel or Conversions API, no follow-up on lead-form submissions, and creative that shows the crew instead of the finished, jaw-dropping before-and-after that actually sells a renovation."
      ],
      "bestPractices": [
        "We lead with high-contrast before-and-after reels and walkthrough video of completed GTA projects — the single strongest creative format for renovation, because homeowners buy the transformation, not the trade.",
        "We run instant lead forms with qualifying questions plus the Conversions API and offline conversion uploads, so Meta optimizes toward booked in-home consultations and signed jobs, not cheap form fills.",
        "We build retargeting and lookalike audiences off site visitors, video viewers and your past-customer list, then layer postal-code and homeowner targeting to concentrate spend on neighbourhoods where you actually want to work.",
        "We sync leads straight into your CRM with speed-to-lead follow-up and seasonal pacing — pushing budget ahead of spring and fall renovation demand and easing off in the slow winter weeks."
      ],
      "industryStandards": [
        "Typical Meta CPC for construction & renovation in Canada runs roughly $1.00–$3.00, with cost per lead usually in the $25–$90 range depending on project type, season and how tightly the form qualifies.",
        "Lead-form conversion rates typically land around 5–9%, though a meaningful share of raw leads are early-stage browsers, so qualification and fast follow-up matter more than headline lead volume.",
        "Average job value for this vertical is wide — roughly $8,000–$50,000+, with full kitchen, basement and addition projects often $25,000 or more — so even a handful of closed jobs can return strong ROAS.",
        "The sales cycle is longer than for emergency trades: expect several days to several weeks from first enquiry to signed contract, with close rates on qualified consultations commonly around 15–25%. These are typical Canadian ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding in the first week covers pixel and Conversions API setup, CRM connection, lead-qualification questions and gathering your best before-and-after project footage to build creative.",
        "Expect leads flowing within the first couple of weeks, with the first month spent learning which project types, audiences and creatives produce booked consultations before we scale the winners.",
        "You get plain-English reporting tied to estimate requests, booked consultations and closed jobs — not vanity reach and likes — plus a clear read on cost per qualified lead.",
        "You own everything: the ad account, pixel, audiences, creative and lead data stay in your name, and we aim to make Meta a predictable, year-round source of renovation enquiries you control."
      ]
    },
    "roofing": {
      "goodPractices": [
        "A good roofing setup runs a lead-form or click-to-Messenger campaign tightly geo-fenced to the GTA postal codes you actually service, not a province-wide blast that burns budget on jobs you can't reach.",
        "Creative leads with real before-and-after photos and short job-site video, because in roofing those out-pull stock imagery and polished brand graphics every time.",
        "The biggest mistake we fix is the unqualified-lead flood: open lead forms with no budget, address or 'own vs. rent' question hand sales a pile of tire-kickers, so we add qualifying questions and instant follow-up to lift contact rates.",
        "Most accounts we inherit are also missing the Meta Pixel and CAPI on the booking and thank-you steps, so Meta optimises toward cheap form-fills instead of booked inspections."
      ],
      "bestPractices": [
        "We build separate campaigns for storm and emergency repair versus full re-roof and replacement, since the urgency, copy and offer (fast inspection vs. financing) are completely different buyers.",
        "We run Advantage+ audiences seeded with homeowner and home-improvement signals, then layer retargeting on website visitors and lead-form openers who didn't book, plus lookalikes built from your closed-job customer list.",
        "We tie spend to seasonality and weather, scaling ahead of GTA spring, fall and post-windstorm demand and pulling back in deep winter so you're not paying peak CPMs for leads that stall.",
        "We rotate fresh creative on a set cadence to beat Meta ad fatigue, and feed booked-call and signed-job values back via offline conversions so optimisation chases revenue, not just form submissions."
      ],
      "industryStandards": [
        "TYPICAL RANGES (Canadian dollars, not guarantees): Meta CPCs for roofing usually land around C$2–C$3, with CPMs in Canada running noticeably below US/global averages.",
        "Cost-per-lead on Meta typically falls in the C$35–C$90 range, lower than search but with a higher share of early-stage leads that need qualifying.",
        "Landing-page lead conversion commonly sits around 5–10% (native lead forms higher, on-site forms lower), and roofers typically close roughly 20–30% of genuinely qualified leads.",
        "Average job value spans a wide band — often C$500–C$3,000 for repairs and C$8,000–C$20,000+ for full replacements — and the sales cycle ranges from same-week emergencies to multi-week considered replacements."
      ],
      "whatToExpect": [
        "Onboarding starts with a kickoff to map your service area, crew capacity, best-margin jobs and seasonality, plus Pixel/CAPI and lead-routing setup so every inquiry hits your phone or CRM within minutes.",
        "We aim to have campaigns live within roughly one to two weeks, with the goal of a steady, qualified lead flow taking shape over the first 60–90 days as creative and audiences are tested.",
        "Expect plain-English reporting tied to leads, booked inspections and cost-per-job — not vanity metrics — with a real person you can reach, not a ticket queue.",
        "You own everything: the ad account, Pixel, audiences, creative and lead data stay in your name, so nothing is held hostage if you ever leave."
      ]
    },
    "immigration": {
      "goodPractices": [
        "A good setup segments campaigns by program — Express Entry, PNP, study permits, spousal sponsorship, work permits — so each audience sees an offer that matches their situation instead of one generic 'immigrate to Canada' ad.",
        "Creatives lead with the RCIC credential and licence number and avoid outcome promises, which keeps ads compliant with both CICC advertising rules and Meta's policies on personal-attribute targeting.",
        "The most common mistake we fix is running broad 'maximize leads' campaigns that flood the inbox with unqualified or out-of-country enquiries no one is ready to retain — we tighten geo, language and offer so the consultant's time goes to real consultations.",
        "Many accounts also have no conversion tracking past the form submit, so we wire the Conversions API and lead stages to optimise toward booked, eligible consultations rather than raw form fills."
      ],
      "bestPractices": [
        "We build a lead-quality feedback loop from the CRM back into Meta — feeding signed and consultation-booked leads as conversion events so the algorithm learns which applicants actually retain, not just who fills a form.",
        "We run eligibility-style lead forms or quiz funnels (program, country of residence, status, timeline) that pre-qualify applicants up front, cutting the 'just curious' volume before it reaches your calendar.",
        "We layer retargeting and lookalike audiences off your highest-value signed clients, and sequence creative from awareness (CRS/eligibility content) to a clear consultation CTA so trust is built before the ask.",
        "We localise by language and community — separate creative and audiences for the GTA's South Asian, Filipino, Latin American and other newcomer segments — because one English ad rarely speaks to all of them."
      ],
      "industryStandards": [
        "Meta CPCs for immigration in the Canadian market typically run about CAD $1.50–$4.00, with cost-per-lead usually landing around CAD $20–$60 depending on program, targeting tightness and offer.",
        "Landing-page lead conversion rates of roughly 6–10% are typical for this vertical on Meta when the page is trust-built and the form is qualified.",
        "Average client value commonly sits around CAD $3,000–$6,000+ per retained file, and lead-to-signed-client close rates of about 20–30% are representative once leads are properly qualified.",
        "Sales cycles are rarely same-day — expect a multi-week to multi-month nurture from first enquiry to signed retainer, so follow-up and CRM nurture matter as much as the ad. These are typical industry ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding starts with an audit of your current account, intake process and CRM, plus alignment on which programs and client types you actually want more of before any spend goes live.",
        "Expect a deliberate first 30–60 days of learning and qualification tuning — early data, daily monitoring and creative iteration — with the goal of a steadier flow of booked, eligible consultations as the account matures.",
        "You get plain-English reporting tied to leads, consultations and cost-per-qualified-lead — not vanity reach metrics — with a clear read on what's working and what we're changing next.",
        "You own everything: the ad account, pixel, audiences, creative and lead data stay in your name, so the system is an asset you keep whether or not you continue with us."
      ]
    },
    "real-estate": {
      "goodPractices": [
        "A solid setup runs separate seller and buyer funnels, because a home-valuation offer and a listing or area-alert campaign need completely different creative, audiences and follow-up.",
        "Every lead form fires a real conversion event back to Meta and CRM, so the algorithm optimizes toward agents who actually book appointments, not just cheap form-fills.",
        "The common mistake we fix is one broad campaign blasting the whole GTA with a stale 'call me to buy or sell' ad — it inflates cost per lead and floods agents with tire-kickers.",
        "Most accounts we inherit run instant Lead Forms with no qualifying questions and no speed-to-lead routing, so valuation leads sit for hours and go cold before anyone calls."
      ],
      "bestPractices": [
        "We lead sellers with a 'what's my home worth?' valuation funnel and route every lead to an agent within minutes, since speed-to-lead is the difference between a listing appointment and a dead contact.",
        "We refresh creative weekly and rotate hooks, neighbourhoods and price points, because real-estate ad fatigue on Meta is fast and quietly drives cost per lead up.",
        "We build retargeting and lookalike audiences off valuation completers and past clients, then layer GTA neighbourhood and life-event signals to keep prospecting tight.",
        "We wire long-term nurture and market-update automation in the CRM, so leads captured today still convert months later when they're actually ready to transact."
      ],
      "industryStandards": [
        "Typical Meta cost per click for GTA real estate runs roughly CA$1–3, with cost per lead usually landing in the CA$8–25 range depending on offer and audience.",
        "Valuation and listing landing pages typically convert in the 8–14% range when the offer and follow-up are dialled in.",
        "Lead-to-client close rates are typically around 8–15%, because real estate is a months-long decision, not an impulse buy.",
        "Average commission value is commonly CA$8,000–25,000+ per closed deal, and the sales cycle often spans several weeks to many months from first click — so these are typical ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding starts with a tracking and account audit, then we launch the seller valuation funnel and instant lead routing in the first few weeks.",
        "Expect early leads within the first 30 days, with cost per lead and creative stabilizing over 60–90 days as the algorithm and audiences mature — these are goals, not promises.",
        "You get a live dashboard plus plain-English reporting tied to leads, cost per lead and booked appointments, not vanity reach and impressions.",
        "You own your ad account, pixel, CRM and lead data outright, and the engagement stays month-to-month with no long lock-in contracts."
      ]
    },
    "home-improvement": {
      "goodPractices": [
        "A good setup separates demand-capture (people already shopping windows, kitchens or roofing) from demand-gen (homeowners we make aware), instead of one blended campaign that Meta can't optimize.",
        "Most accounts we inherit boost posts or run traffic objectives that buy cheap clicks; we rebuild on a lead or conversions objective tied to real booked-consultation events.",
        "We see broad GTA-wide targeting wasting budget on renters and out-of-area clicks; tight geo-targeting around serviceable postal codes and homeowner signals fixes the leakage.",
        "Creative is usually a single stock image left running for months — the right setup rotates real project photos and before/after proof so frequency fatigue doesn't quietly inflate cost-per-lead."
      ],
      "bestPractices": [
        "We lead with portfolio and before/after creative — real GTA jobs, financing call-outs and review snippets — because high-ticket renovation decisions are won on proof, not discounts.",
        "Instant Forms with budget and timeline qualifier questions filter tyre-kickers up front, and qualified leads sync to your CRM so the sales team only chases buyers.",
        "We run multi-week retargeting layers (video viewers, form openers, site visitors) because a $15,000+ project is rarely decided on the first touch, and we pace budget seasonally for the spring/summer reno peak.",
        "Conversions API plus the Meta pixel sends server-side lead and booked-job events back to Meta, so the algorithm optimizes toward closed work — not just cheap form fills — and reporting survives iOS signal loss."
      ],
      "industryStandards": [
        "Typical Meta CPC for home-improvement in Canada runs roughly $1.50–$3.00, with CPMs generally in the $12–$25 range depending on city, season and audience.",
        "Cost-per-lead is typically about $25–$90 for Instant Form leads and higher — often $90–$250+ — for higher-intent landing-page or booked-consultation leads.",
        "Landing-page or form conversion rates typically land around 4–8%, and only a share of those are sales-qualified after budget and timeline filtering.",
        "Average project value commonly ranges from $5,000 to $50,000+ with lead-to-customer close rates around 15–25%, and decision cycles that usually run several weeks — these are representative ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding starts with a tracking and account audit: we set up the pixel, Conversions API and CRM sync, then rebuild campaigns around your most profitable product line first.",
        "Meta needs a learning window, so expect the first few weeks to gather signal and a clearer, more stable cost-per-qualified-lead to emerge by roughly the 60-to-90-day mark as the algorithm optimizes toward real jobs.",
        "You get a live dashboard plus plain-English reporting on spend, leads, cost-per-lead and — where your CRM allows — cost-per-booked-job, not vanity reach metrics.",
        "Everything is built in your own ad account, pixel and CRM, so the assets, audiences and data stay yours if we ever part ways."
      ]
    },
    "fitness-gyms": {
      "goodPractices": [
        "A good setup leads with one clear, low-friction offer — a free 7-day pass, a $0 trial class, or a discounted intro month — instead of vaguely promoting the gym or pushing a 12-month contract straight from the ad.",
        "It uses a proper conversion event (a booked trial or completed lead form) fed back to Meta, with a Conversions API server-side connection so iOS opt-outs and ad-blockers don't starve the algorithm of signal — the most common thing we fix is gyms optimising for clicks or reach, or running boosted posts with no pixel at all.",
        "Creative is real footage from your own floor, classes and members, refreshed regularly, rather than one stock-photo ad left running until it fatigues and CPLs quietly double.",
        "Geo-targeting is tightened to a realistic catchment (a 5–10 km radius people will actually drive or walk to), not a whole city or province — wide radii are a frequent cause of cheap leads that never show up to the trial."
      ],
      "bestPractices": [
        "We build the funnel around the trial, not the membership: lead or Instant Form ad to a fast-loading booking page, then automated speed-to-lead follow-up (SMS plus email within minutes) because in fitness the gym that replies first usually wins the join.",
        "We run continuous creative testing — instructor and member video, before/after and transformation angles, class-energy clips, founder-led offers — and rotate winners in before fatigue, since fitness creative burns out faster than most verticals.",
        "We layer retargeting and lookalikes off real intent signals (trial-bookers, page viewers, your existing member and email list), so cold prospecting stays cheap and warm audiences carry the conversions.",
        "We pace budget to the fitness calendar — leaning into the January and September joining spikes, easing through the summer dip — and pair Meta with Google for 'gym near me' high-intent search, shifting spend monthly toward whichever delivers the cheapest qualified joins."
      ],
      "industryStandards": [
        "Typical Meta CPCs for GTA gyms and studios run roughly CAD $0.80–$2.50, with CPMs commonly around CAD $9–$18 — fitness creative tends to engage well, which keeps these on the lower side versus many verticals.",
        "Cost per trial or intro-offer lead typically lands around CAD $8–$25 for boutique and big-box gyms; specialty or premium studios can run higher, and a fitness-tuned form-to-booking funnel usually converts in the ~8–15% range.",
        "Lead-to-join close rates are typically around 25–40% once speed-to-lead follow-up and a strong intro offer are in place — the trial show-up rate matters as much as the lead volume.",
        "The sales cycle is short — most first joins land within ~2–4 weeks of a trial — but member value compounds over time, with annual value often in the CAD $600–$1,000+ range depending on price point and retention. These are representative ranges, not guarantees."
      ],
      "whatToExpect": [
        "Onboarding starts with a quick audit of your current ads, offer and tracking; we wire up the pixel and Conversions API, build your trial funnel and follow-up, and aim to have campaigns live within the first week or two.",
        "You can typically expect trial bookings within the first one to two weeks and first paying members inside two to four weeks, with the real compounding through the first 60–90 days as conversion data sharpens targeting — framed as goals, not promises.",
        "Reporting is revenue-focused and plain-English: trials booked, members joined and cost per join — not just clicks and impressions — with daily and weekly optimisation by our team on top of the AI.",
        "You own your ad account, pixel, audiences and data from day one; engagements are month-to-month with no long-term lock-in, and ad spend stays separate from our management fee."
      ]
    },
    "med-spa": {
      "goodPractices": [
        "A good setup runs a clear funnel — broad cold prospecting on Advantage+ feeding warm retargeting and a list-based audience of past clients — instead of one boosted post and hope.",
        "Treatment-specific creative (Botox, filler, laser, body contouring) with real before/after-style results, a named offer and a price anchor beats generic spa stock photos every time.",
        "The most common mistake we fix is sending clicks to a homepage; med spa leads convert on a single treatment landing page with a booking widget, financing note and trust signals.",
        "Many GTA med spas run with no Conversions API or pixel-deduplication, so Meta optimizes blind — we fix tracking first so the algorithm learns from booked consults, not link clicks."
      ],
      "bestPractices": [
        "We optimize ad sets toward the booked-consultation or qualified-lead event via the Conversions API, not page views, so spend chases revenue rather than cheap clicks.",
        "We run a structured creative-testing cadence — hook, offer and format variations weekly — because Meta creative fatigues fast in a visual, beauty-driven feed.",
        "We build value-based lookalikes from your highest-LTV clients (repeat injectables, package buyers) so prospecting targets people who actually rebook, not one-time deal-seekers.",
        "We comply with Meta's health and Special Ad Category rules up front — careful before/after framing and claims — so accounts stay live instead of getting creative rejected or restricted."
      ],
      "industryStandards": [
        "Typical Meta CPCs for Canadian med spa campaigns tend to run roughly CAD $1.50–$4.00, varying by treatment, city and season — these are representative ranges, not guarantees.",
        "Cost per lead for a consultation request is commonly in the CAD $25–$90 range, with premium treatments (laser, body contouring) usually sitting at the higher end.",
        "Landing-page conversion rates of around 5–9% are typical for a focused treatment page, versus low single digits when traffic lands on a generic homepage.",
        "Average client value spans widely — a single Botox visit may be CAD $300–$600 while injectable or package clients reach CAD $1,500+ over a year — with a short sales cycle from enquiry to first booking, often days to a few weeks."
      ],
      "whatToExpect": [
        "Onboarding starts with a tracking and account audit — pixel, Conversions API, audiences and creative — so we build on a clean foundation before scaling spend, typically within the first week or two.",
        "Expect an early-signal learning phase in the first few weeks as the algorithm gathers conversion data, with the goal of a stable, predictable cost per booked consult by roughly months two to three.",
        "Reporting is plain-English and tied to bookings and revenue, not vanity metrics, with a regular call to review what's working and where budget should move next.",
        "You own everything — ad account, pixel, audiences and creative live in your Business Manager — so the asset stays yours if we ever part ways; results are goals we work toward, never promises."
      ]
    },
    "professional-services": {
      "goodPractices": [
        "A good professional-services Meta setup runs on the Leads or Conversions objective behind a real offer — a guide, calculator, benchmark report or free assessment — because B2B buyers on Facebook and Instagram aren't searching to buy today the way a Google searcher is.",
        "It tracks the full path with the Conversions API and offline event uploads, so spend is measured against booked consultations and signed clients in your CRM, not against raw form fills or instant-form leads that never reply.",
        "A common mistake we fix is firms boosting posts and counting reach and likes — we rebuild around a qualified-enquiry objective with a clear next step and lead-qualifying questions on the form.",
        "The other recurring problem is no retargeting and no follow-up: we add warm audiences (site visitors, video viewers, lead-magnet downloaders) and a nurture sequence, since one cold impression rarely closes a considered engagement."
      ],
      "bestPractices": [
        "We use Meta for demand generation and retargeting that complements high-intent Google search — gated lead magnets capture earlier-stage prospects, then sequenced retargeting moves a downloader toward booking a call.",
        "We build layered Custom and Lookalike Audiences from your client list, qualified-lead list and site visitors so budget reaches GTA and Canadian decision-makers who resemble your best accounts, not the cheapest available clicks.",
        "Creative leads with proof and authority — short founder or expert videos, client outcomes and credentials — because professional buyers vet who they trust before they enquire, and we test hooks and offers continuously.",
        "We feed offline conversions and deal values back to Meta so the algorithm optimises toward leads that become clients, and we add qualifying questions on the landing page to filter out tyre-kickers before they reach your intake team."
      ],
      "industryStandards": [
        "Typical Meta CPC for this vertical runs about CA$1.50–4.00 and CPM roughly CA$12–30, varying by audience, season and competition — these are representative ranges, not guarantees.",
        "Cost per qualified lead on Meta usually lands around CA$30–90, lower than LinkedIn but typically needing more qualification than high-intent search leads.",
        "Landing-page conversion rates for a focused lead magnet or assessment commonly sit near 5–9%, with lead-to-client rates around 5–12% once nurture is in place.",
        "Average client value for professional and B2B services typically ranges from CA$2,000 to CA$25,000+, over a sales cycle measured in weeks to months rather than a single visit."
      ],
      "whatToExpect": [
        "Onboarding covers conversion and offline-conversion tracking, audience build and a lead magnet or offer in the first couple of weeks, so we're optimising to real pipeline from the start.",
        "Meta is a demand-gen channel here, so the goal is early signal in the first 4–6 weeks and a clearer cost-per-qualified-lead and booked-call picture once retargeting and nurture mature over 60–90 days.",
        "Reporting ties spend to qualified enquiries, booked consultations and signed clients — not vanity metrics — with plain-English context on what we're testing and changing next.",
        "You own the ad account, pixel, audiences and creative, on month-to-month terms — we aim to build a durable asset for your firm, not to lock you in."
      ]
    }
  },
  "creative": {
    "med-spa": {
      "goodPractices": [
        "Good med spa creative is built for Meta and TikTok feeds first — vertical 9:16 video, thumb-stopping in the first second, with captions baked in because most of the GTA scrolls on mute.",
        "It leads with real treatment rooms, real staff and ethical before/afters rather than stock smiles, because aesthetics buyers in Toronto are vetting trust and hygiene before price.",
        "The common mistake we fix is one boring carousel of stock photos run for months until it fatigues, then blamed on the platform instead of the creative.",
        "Many med spas also write ad copy that names injectables or makes 'flawless results' claims that trip Meta's health policy and Health Canada rules — we fix the messaging so it actually gets approved and stays live."
      ],
      "bestPractices": [
        "We run a structured monthly creative batch — multiple hooks, formats and angles per offer (memberships, consults, seasonal treatments) — so there is always a fresh variant ready before the current winner fatigues.",
        "We script UGC and founder/practitioner-led video that reads as authentic and stays compliant, framing outcomes as typical experiences and skirting Meta's restricted health-claim and 'before/after' personal-attribute triggers.",
        "We build a tested hook library and rotate angles — confidence, convenience, self-care, price-anchored offers — then double down on whichever resonates with your specific GTA audience rather than guessing.",
        "Every concept is wired to the funnel and tagged, so we judge creative on cost-per-booked-consult and show rate, not likes — and feed the winners back into both paid and organic."
      ],
      "industryStandards": [
        "These are typical Canadian ranges for med spa social creative, not guarantees — your offer, brand and market move them.",
        "On Meta, med spa CPCs typically run roughly CA$2.50–4.50 and consult-page conversion around 4–7%; quality video creative usually earns a meaningfully lower cost-per-result than static.",
        "Cost per booked consult typically lands around CA$40–90 depending on offer and treatment, with creative refreshed roughly every 3–5 weeks before fatigue erodes performance.",
        "Average med spa client value commonly sits near CA$1,000–1,500 on a first visit and far higher over a membership or multi-treatment year, so strong creative compounds well past the first booking."
      ],
      "whatToExpect": [
        "Onboarding starts with a brand and offer session plus a shoot or asset plan, so the first creative batch reflects your real space, staff and treatments — not templates.",
        "Expect first ad-ready creative within roughly the first two to three weeks and a clearer read on which hooks and formats win after the first few weeks of spend.",
        "You get plain-English reporting tied to booked consults and cost-per-result, with creative ranked by what actually drives appointments — goals we steer toward, not promised numbers.",
        "You own everything we produce — raw files, edits and the tested hook library stay yours — and we flag Health Canada and Meta compliance risks before anything goes live."
      ]
    }
  }
};
