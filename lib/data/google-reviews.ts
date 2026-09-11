/**
 * REAL Google reviews for the PPC Guru Google Business Profile (place id
 * ChIJlfQi4wjL1IkRTPpkOAwOs80, 55 Queen St E, Toronto). Pulled verbatim from
 * Google Maps on 2026-09-12 (newest 40 of 49; 48 five-star, 1 four-star). Names
 * and text are exactly as published on Google — do not edit the quotes. Refresh
 * by re-running the Google Maps reviews pull and replacing this array.
 */

export const googleBusinessProfile = {
  name: "PPC Guru",
  rating: 5.0,
  reviewCount: 49,
  placeId: "ChIJlfQi4wjL1IkRTPpkOAwOs80",
  /** Public listing (same pin as siteConfig.maps.mapUrl). */
  url: "https://www.google.com/maps/search/?api=1&query=PPC%20Guru&query_place_id=ChIJlfQi4wjL1IkRTPpkOAwOs80",
  /** Direct "write a review" link for the listing. */
  writeReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJlfQi4wjL1IkRTPpkOAwOs80",
  fetchedAt: "2026-09-12",
} as const;

export type GoogleReview = { name: string; stars: number; text: string; date: string };

export const googleReviews: GoogleReview[] = [
  { name: "Dinesh Deepoo", stars: 5, text: "Useful SEO guidance and great service from PPC Guru. Highly Recommended.", date: "2026-09-10" },
  { name: "Ankesh", stars: 5, text: "We had paid search running for our Toronto law practice, but no clear connection between the ads and the service pages. PPC Guru worked on Google Ads and SEO together. The marketing feels more deliberate now, and prospective clients appear to understand our practice areas before they call. I don't need every report translated line by line, but I do need to know why a campaign is changing and what the website is expected to do. Their explanations have been sensible and focused on those decisions.", date: "2026-09-04" },
  { name: "Leston", stars: 5, text: "Toronto SEO feels clearer with PPC Guru.", date: "2026-09-03" },
  { name: "aya", stars: 5, text: "PPC Guru handles all our SEO and Google Ads. They're super transparent, easy to work with, and most importantly, they get results. 10/10 recommendation!", date: "2026-08-31" },
  { name: "Aditi Singh", stars: 5, text: "Meta Ads and social media from PPC Guru give our Calgary med spa a consistent voice without sounding generic.", date: "2026-08-30" },
  { name: "aayush patel", stars: 5, text: "As a general contractor, I do not have much time to dig through marketing reports. PPC Guru keeps our Google Ads and website development work clear, tells me what needs attention, and does not hide behind jargon. We are hearing from more homeowners who understand the kind of renovation work we do, which saves our team time before the estimate stage.", date: "2026-08-27" },
  { name: "Joseph Clary", stars: 5, text: "We brought PPC Guru in for SEO and website design after service pages become outdated. The site is clearer, and the enquiries have better context.", date: "2026-08-26" },
  { name: "AARTI YADAV", stars: 5, text: "As an immigration consultant in Canada, We wanted a website that looked professional and made our services easy to understand. PPC Guru handled the complete website redevelopment, improved the structure, and built it with local SEO and AEO in mind. The new site is much easier to navigate and represents our practice far better. I'm genuinely very happy with how everything turned out.", date: "2026-08-25" },
  { name: "Natalie Lewis", stars: 5, text: "PPC Guru handles both our Facebook and Instagram ad campaigns, as well as our overall social media strategy. Their team is knowledgeable, our ads are creative, and we saw an improvement in customer acquisition costs after they refined our audience targeting. They understand how to effectively scale paid ads while being mindful of budget.", date: "2026-08-24" },
  { name: "Niyati Gandhi", stars: 5, text: "As a local business owner, I don't care much about vanity metrics—I just need the phone to ring. PPC Guru overhauled our local SEO and Google Ads, and within a few weeks, we started getting steady, qualified leads. Their team is super responsive and easy to talk to. Best decision we made for our business this year.", date: "2026-08-24" },
  { name: "Anis Gandhi", stars: 5, text: "We've been working with PPC Guru on our SEO for about six months now, and the difference is night and day. Our organic site traffic is way up, and we're actually showing up on the map pack when local customers search for our services. They don't just send confusing spreadsheets either—their team explains the technical fixes clearly and actually delivers. Well worth the investment.", date: "2026-08-24" },
  { name: "Millennial Events", stars: 5, text: "We have worked with PPC Guru as a marketing partner for Millennial Events, and our experience has been really good. We produce large-scale business, comedy, and entertainment events across North America, so strong marketing is very important for us. PPC Guru supported us on major stand-up comedy tours, including shows with big Indian comedy names like Samay Raina, and helped us with ticket sales, audience reach, and sold-out shows. Their understanding of Meta ads, social media management, city-wise targeting, audience demographics, and community-based marketing is impressive. What I like most is that they understand live events, not just ads. They know how to reach the right audience in the right city with the right message. For event companies, artists, or promoters bringing shows to North America, PPC Guru is a strong marketing partner. Highly recommended", date: "2026-07-31" },
  { name: "Logan Walker", stars: 5, text: "Palak has been patient with us on the social media side even when we changed content direction twice. Not many agencies would tolerate that without extra charges. Shrikaanth handles our ads and the combination has worked well for our clinic.", date: "2026-07-27" },
  { name: "Amy Ramirez", stars: 5, text: "Shrikaanth rebuilt our Meta ads account from scratch because the previous setup had overlapping audiences and broken tracking. Took him about a week. Things are running cleaner now and we can actually trust the numbers in the reports.", date: "2026-07-24" },
  { name: "Hunter Harris", stars: 5, text: "Cost per enquiry has dropped significantly since we switched to them. We're in the home renovation space in Brampton. Shrikaanth restructured our Google Ads campaigns in the first two weeks and the quality of leads improved noticeably after that.", date: "2026-07-22" },
  { name: "Neel Donda", stars: 5, text: "Really happy with the service. The team has been easy to work with, quick to respond, and always open to feedback. Looking forward to continuing the partnership.", date: "2026-07-14" },
  { name: "Divyesh Moradiya", stars: 5, text: "We initially reached out to PPC Guru for help improving our online presence. From the first meeting, they took the time to understand our business and our goals before recommending a strategy. Throughout the project, communication has been consistent, and we've appreciated the transparency around what was being done and why. It's been a professional experience from start to finish.", date: "2026-07-14" },
  { name: "shreyansh harkhani", stars: 5, text: "Professional team and a smooth experience throughout.", date: "2026-07-01" },
  { name: "Dhairya Gajera", stars: 5, text: "Happy with the results and service provided.", date: "2026-07-01" },
  { name: "Yug Ravani", stars: 5, text: "Highly recommend for digital marketing services.", date: "2026-07-01" },
  { name: "Vraj Bagsariya", stars: 5, text: "Professional, knowledgeable, and easy to work with. The team takes the time to understand your business and provide practical marketing solutions.", date: "2026-06-19" },
  { name: "Gediya Jayshreeben", stars: 5, text: "Great people to work with. Professional and responsive.", date: "2026-06-14" },
  { name: "Mohit Chouhan", stars: 5, text: "Great team to work with! They helped us run both local and national ad campaigns effectively. Our leads are better, our site traffic has increased, and their customer service is always quick and polite.", date: "2026-06-10" },
  { name: "Connor Smith", stars: 4, text: "Solid agency overall. One thing I'd mention is that weekend response times can be slow, which matters for us because we run weekend campaigns. Weekdays they're very on top of things. Shrikaanth knows the ads side well and Palak has been helpful on the social content side. 4 stars because nothing is perfect, but we're sticking with them.", date: "2026-06-08" },
  { name: "Ethan Campbell", stars: 5, text: "Nice team, honest people. Rare enough in this industry that's its worth mentioning.", date: "2026-06-05" },
  { name: "Ford Morgan", stars: 5, text: "PPC Guru has been a reliable partner for our business. Their team works closely with us like part of our own marketing staff, keeping communication clear and consistent. They explain every strategy in a simple way and use real data to support their decisions. Since working together, we've experienced steady progress and better overall performance.", date: "2026-05-25" },
  { name: "Nancy Gonzalez", stars: 5, text: "Abhishek reached out when we were shopping around for a new agency. What stood out was that he didn't try to close us on the first call. He asked what wasn't working with our current setup, went away, and came back three days later with an actual audit of our account showing specific issues. That was refreshing compared to the other agencies we spoke to who just sent us pricing sheets. We signed up after the second call and it's been about four months now. No regrets so far.", date: "2026-05-20" },
  { name: "Ryan Williams", stars: 5, text: "Good team. Dhaval is straightforward to deal with and doesn't oversell.", date: "2026-05-12" },
  { name: "Evan Johnson", stars: 5, text: "Shrikaanth manages our Meta ads account. He's responsive on WhatsApp and actually explains what he's doing rather than just sending reports. We've been with PPC Guru for about 5 months now and the account is in much better shape than when we started.", date: "2026-04-30" },
  { name: "Brian Martinez", stars: 5, text: "Happy with the Google Ads work. Leads are steady and the team is easy to reach.", date: "2026-04-25" },
  { name: "Mason Moore", stars: 5, text: "Our google ads campaign feel more structured and predictable after starting work with PPC Guru.", date: "2026-04-16" },
  { name: "Kian Butcher", stars: 5, text: "PPC Guru helped improve our Google Ads performance. Simple comunication and better results.", date: "2026-04-14" },
  { name: "YΛSSIΓ", stars: 5, text: "The team at PPC Guru feels more like an extension of our internal marketing department than an outside agency. They communicate regularly, explain strategy clearly, and back every decision with data. We've seen steady growth since working with them, and their proactive approach makes a real difference.", date: "2026-02-27" },
  { name: "Hassan", stars: 5, text: "We've worked with PPC Guru on several paid campaigns, and their consistency has been impressive. They don't just launch ads and walk away — they actively monitor, optimize, and fine-tune everything. Their reporting is clear, their strategy is data-driven, and the results speak for themselves. It's rare to find an agency that blends creativity with strong analytics so well.", date: "2026-02-27" },
  { name: "Mazhar Ansari", stars: 5, text: "PPC Guru managed our paid ads efficiently and kept us updated throughout the campaign. Budget usage was clear and the results matched what was discussed.", date: "2026-01-30" },
  { name: "VISHVAM PANCHAL", stars: 5, text: "As a business, we needed someone who could manage ads without overcomplicating things. PPC Guru understood our goals, set things up properly, and delivered steady results. Happy with the experience.", date: "2026-01-30" },
  { name: "Bhavani Darpan", stars: 5, text: "We hired PPC Guru to clean up our Google Ads account after months of wasted spend. Results improved within weeks, and the leads finally made sense.", date: "2026-01-09" },
  { name: "Dheeraj Chouhan", stars: 5, text: "PPC Guru has been a reliable growth partner for us. Even after campaigns are live, they keep testing, refining, and improving instead of letting things run on autopilot. It genuinely feels like they care about performance and long-term results, not just managing ads.", date: "2026-01-08" },
  { name: "Pratham Choudhary", stars: 5, text: "Shrikant has been a pleasure to work with. He helped redesign our landing pages, fixed our SEO basics, and aligned all tracking with Google Analytics. The reports are detailed but still easy to understand. We're seeing steady, measurable growth month after month.", date: "2025-12-22" },
];

/** Reviews with enough substance to quote on a landing page (longest, 5★ first). */
export const featuredGoogleReviews: GoogleReview[] = [...googleReviews]
  .filter((r) => r.stars === 5 && r.text.length >= 90)
  .sort((a, b) => b.text.length - a.text.length)
  .slice(0, 12);
