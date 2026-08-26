---
title: Robots.txt Setup for ChatGPT & AI Crawlers
description: >-
  our robots.txt file might be quietly blocking ChatGPT, Claude, and Gemini from
  citing your site. Here's the real distinction between bots, and the fix.
date: '2026-08-03'
publishAt: '2026-08-03T14:16:02.065+00:00'
category: 'AI SEO '
author: Siddharth Sharma
coverImage: >-
  https://pozpdqckjqnsdjtvdnft.supabase.co/storage/v1/object/public/blog-images/is-your-robots-txt-file-blocking-you-from-chatgpt-gemini-and-claude-without-you--msdbl6pt.png
---

<span style="font-weight: 400;">Your website can be optimized for Google, technically healthy, full of genuinely useful content, and still be quietly hard for AI platforms to access. The problem tends to hide in a small file most business owners never check after launch: robots.txt.</span>

<span style="font-weight: 400;">This file has told crawlers like Googlebot and Bingbot where they can and can't go for years. Today it may also decide whether the systems behind ChatGPT, Claude, and other AI platforms can retrieve, understand, or ever cite your content at all. A single outdated directive, often left over from a staging site or a plugin default nobody reviewed, can quietly block an AI crawler from reading your service pages, case studies, or blog posts. If you've never checked this on your own site, it's one of the first things worth reviewing as part of any real</span><a href="https://ppcguru.ca/services/seo"> <span style="font-weight: 400;">technical SEO</span></a><span style="font-weight: 400;"> work.</span>

<span style="font-weight: 400;">The instinct once you know this is to just allow everything. Not quite right either. Different crawlers do different jobs, and understanding that difference has become a real part of technical SEO, answer engine optimization, and generative engine optimization — not a fringe detail anymore.</span>
<h2><b>What a robots.txt file actually is</b></h2>
<span style="font-weight: 400;">A plain-text file sitting at the root of your domain: </span><span style="font-weight: 400;">yourdomain.com/robots.txt</span><span style="font-weight: 400;">. A basic one looks like this:</span>

<span style="font-weight: 400;">User-agent: *</span>

<span style="font-weight: 400;">Disallow: /admin/</span>

<span style="font-weight: 400;">Disallow: /checkout/</span>

<span style="font-weight: 400;">Allow: /</span>

<span style="font-weight: 400;">Sitemap: https://yourdomain.com/sitemap.xml</span>

<span style="font-weight: 400;">User-agent: *</span><span style="font-weight: 400;"> applies the rules to any crawler without its own specific block. </span><span style="font-weight: 400;">Disallow</span><span style="font-weight: 400;"> marks areas crawlers shouldn't touch. </span><span style="font-weight: 400;">Allow: /</span><span style="font-weight: 400;"> opens up everything else. </span><span style="font-weight: 400;">Sitemap</span><span style="font-weight: 400;"> points to your XML sitemap.</span>

<span style="font-weight: 400;">One thing worth getting right: robots.txt is a crawler directive, not a security system. It doesn't password-protect anything, and it won't stop a scraper that's decided not to follow the rules. Confidential files, customer data, internal dashboards — those need real authentication and server-level protection. Robots.txt was never built for that job, and treating it like it was is a mistake worth catching early.</span>
<h2><b>How this touches AI visibility, specifically</b></h2>
<span style="font-weight: 400;">AI platforms pull information through several channels: their own crawlers, search-engine indexes, licensed datasets, third-party search providers, on-demand retrieval when a user pastes a link, and whatever training data was already collected. Robots.txt isn't a master switch controlling every possible mention of your company across every model. It's narrower than that.</span>

<span style="font-weight: 400;">What it does control is whether specific crawlers run by the major AI companies can access your site at all. Block an important one, and the platform starts struggling to access your current information, retrieve a page when someone asks about it, quote or summarize what you offer, confirm your current service details, or cite you as a source in the first place.</span>

<span style="font-weight: 400;">None of this is a guarantee, to be clear. Allowing a crawler doesn't mean your site gets used — the content still has to be relevant, trustworthy, and genuinely useful once the AI gets there. Robots.txt is an eligibility layer. It can open the door. It doesn't decide who walks through.</span>
<h3><b>Not every AI crawler does the same job</b></h3>
<span style="font-weight: 400;">This is the part most existing advice gets wrong. Lumping "AI bots" into one bucket leads to bad decisions — a business might be completely fine with its articles showing up in AI search results while genuinely not wanting those same articles used to train a future model. Several platforms let you make that distinction explicitly, and it's worth knowing exactly how.</span>
<h4><b>OpenAI: GPTBot, OAI-SearchBot, and ChatGPT-User</b></h4>
<b>GPTBot</b><span style="font-weight: 400;"> is tied to content that may improve OpenAI's models over time.</span>

<span style="font-weight: 400;">User-agent: GPTBot</span>

<span style="font-weight: 400;">Disallow: /</span>

<span style="font-weight: 400;">Blocking GPTBot doesn't automatically mean opting out of ChatGPT search visibility. OpenAI runs a separate crawler for that.</span>

<b>OAI-SearchBot</b><span style="font-weight: 400;"> supports ChatGPT's actual search functionality — this is the one behind summaries, snippets, and citations.</span><a href="https://developers.openai.com/api/docs/bots"> <span style="font-weight: 400;">OpenAI's own documentation</span></a><span style="font-weight: 400;"> recommends publishers who want their pages included in ChatGPT search results allow this one specifically.</span>

<span style="font-weight: 400;">User-agent: OAI-SearchBot</span>

<span style="font-weight: 400;">Allow: /</span>

<span style="font-weight: 400;">This is the distinction that matters most for anyone chasing ChatGPT visibility: GPTBot is about model improvement. OAI-SearchBot is about being found. Set different rules for each.</span>

<b>ChatGPT-User</b><span style="font-weight: 400;"> fires when someone pastes your URL into ChatGPT and asks it to summarize the page. Block this, and that specific use case breaks.</span>

<span style="font-weight: 400;">A selective OpenAI setup:</span>

<span style="font-weight: 400;">User-agent: GPTBot</span>

<span style="font-weight: 400;">Disallow: /</span>

&nbsp;

<span style="font-weight: 400;">User-agent: OAI-SearchBot</span>

<span style="font-weight: 400;">Allow: /</span>

&nbsp;

<span style="font-weight: 400;">User-agent: ChatGPT-User</span>

<span style="font-weight: 400;">Allow: /</span>
<h4><b>Anthropic: ClaudeBot, Claude-SearchBot, and Claude-User</b></h4>
<span style="font-weight: 400;">Anthropic splits its crawlers the same way. </span><b>ClaudeBot</b><span style="font-weight: 400;"> collects public content that could contribute to model training.</span>

<span style="font-weight: 400;">User-agent: ClaudeBot</span>

<span style="font-weight: 400;">Disallow: /</span>

<b>Claude-SearchBot</b><span style="font-weight: 400;"> navigates the web specifically to improve search result quality.</span><a href="https://support.anthropic.com/en/articles/8896518"> <span style="font-weight: 400;">Anthropic's own support documentation</span></a><span style="font-weight: 400;"> states plainly that disabling it "may reduce your site's visibility and accuracy in user search results."</span>

<span style="font-weight: 400;">User-agent: Claude-SearchBot</span>

<span style="font-weight: 400;">Allow: /</span>

<b>Claude-User</b><span style="font-weight: 400;"> retrieves a page when someone using Claude directly asks a question that needs it. Block it, and that specific retrieval breaks too.</span>

<span style="font-weight: 400;">Same logic as OpenAI: block the training bot, allow the search and user-triggered ones, and you get a genuinely selective setup rather than an all-or-nothing choice.</span>
<h4><b>Google: where Search and Gemini controls actually overlap, and where they don't</b></h4>
<span style="font-weight: 400;">Google needs its own explanation, because this is where most confusion happens. To appear as a supporting link in AI Overviews or AI Mode, a page has to be indexed and eligible to appear in regular Google Search with a snippet in the first place.</span><a href="https://developers.google.com/search/docs/crawling-indexing"> <span style="font-weight: 400;">Google's Search Central documentation</span></a><span style="font-weight: 400;"> is clear that there's no separate technical requirement layered on top for AI Overviews specifically — ordinary SEO fundamentals apply, including letting Googlebot crawl the page at all.</span>

<span style="font-weight: 400;">Which means this rule damages your regular search presence and your AI Overview eligibility at the same time:</span>

<span style="font-weight: 400;">User-agent: Googlebot</span>

<span style="font-weight: 400;">Disallow: /</span>

<span style="font-weight: 400;">Blocking Googlebot doesn't just cost you AI features. It hits traditional Search, Discover, Images, News, and Video too.</span>

<b>Google-Extended is a completely different thing, and it's the one actually worth using.</b><span style="font-weight: 400;"> A separate control token governing whether content Google has already crawled can be used for certain Gemini training and grounding purposes. Google states directly that it does not affect inclusion or ranking in Google Search. Run both at once:</span>

<span style="font-weight: 400;">User-agent: Googlebot</span>

<span style="font-weight: 400;">Allow: /</span>

&nbsp;

<span style="font-weight: 400;">User-agent: Google-Extended</span>

<span style="font-weight: 400;">Disallow: /</span>

<span style="font-weight: 400;">Googlebot handles your Search ranking and AI Overview eligibility. Google-Extended governs Gemini App and Vertex AI training, at zero cost to your Search visibility. Blocking that second one is arguably the cleanest, lowest-risk move available anywhere in this entire area.</span>
<h3><b>A practical configuration for a Toronto service business</b></h3>
<span style="font-weight: 400;">Something close to this, adjusted for your own site's actual structure:</span>

<span style="font-weight: 400;">User-agent: Googlebot</span>

<span style="font-weight: 400;">Allow: /</span>

<span style="font-weight: 400;">Disallow: /wp-admin/</span>

<span style="font-weight: 400;">Disallow: /checkout/</span>

<span style="font-weight: 400;">Disallow: /account/</span>

&nbsp;

<span style="font-weight: 400;">User-agent: OAI-SearchBot</span>

<span style="font-weight: 400;">Allow: /</span>

<span style="font-weight: 400;">Disallow: /wp-admin/</span>

<span style="font-weight: 400;">Disallow: /checkout/</span>

<span style="font-weight: 400;">Disallow: /account/</span>

&nbsp;

<span style="font-weight: 400;">User-agent: ChatGPT-User</span>

<span style="font-weight: 400;">Allow: /</span>

<span style="font-weight: 400;">Disallow: /wp-admin/</span>

<span style="font-weight: 400;">Disallow: /checkout/</span>

<span style="font-weight: 400;">Disallow: /account/</span>

&nbsp;

<span style="font-weight: 400;">User-agent: GPTBot</span>

<span style="font-weight: 400;">Disallow: /</span>

&nbsp;

<span style="font-weight: 400;">User-agent: Claude-SearchBot</span>

<span style="font-weight: 400;">Allow: /</span>

<span style="font-weight: 400;">Disallow: /wp-admin/</span>

<span style="font-weight: 400;">Disallow: /checkout/</span>

<span style="font-weight: 400;">Disallow: /account/</span>

&nbsp;

<span style="font-weight: 400;">User-agent: Claude-User</span>

<span style="font-weight: 400;">Allow: /</span>

<span style="font-weight: 400;">Disallow: /wp-admin/</span>

<span style="font-weight: 400;">Disallow: /checkout/</span>

<span style="font-weight: 400;">Disallow: /account/</span>

&nbsp;

<span style="font-weight: 400;">User-agent: ClaudeBot</span>

<span style="font-weight: 400;">Disallow: /</span>

&nbsp;

<span style="font-weight: 400;">User-agent: Google-Extended</span>

<span style="font-weight: 400;">Disallow: /</span>

&nbsp;

<span style="font-weight: 400;">User-agent: *</span>

<span style="font-weight: 400;">Allow: /</span>

<span style="font-weight: 400;">Disallow: /wp-admin/</span>

<span style="font-weight: 400;">Disallow: /checkout/</span>

<span style="font-weight: 400;">Disallow: /account/</span>

&nbsp;

<span style="font-weight: 400;">Sitemap: https://yourdomain.com/sitemap.xml</span>

<span style="font-weight: 400;">Treat this as a starting example, not a universal answer. Before copying it onto your own site: which areas are genuinely public, is your organization actually comfortable allowing any training crawlers at all, what does your specific CMS require, do staging or filter-parameter URLs need their own restrictions, and could existing rules elsewhere in your file quietly conflict with these new ones. A small syntax error here produces unexpected crawling behavior fast, so test the file before and after deploying, not once and forget it.</span>
<h3><b>How to actually check what you currently have</b></h3>
<span style="font-weight: 400;">Type your domain followed by </span><span style="font-weight: 400;">/robots.txt</span><span style="font-weight: 400;"> into a browser. No tool needed, it's just text. Read every </span><span style="font-weight: 400;">User-agent</span><span style="font-weight: 400;"> block and look for a wildcard </span><span style="font-weight: 400;">Disallow: /</span><span style="font-weight: 400;"> with no exceptions, and for whether AI bot names show up at all. If the only rules you find are for Googlebot, every AI crawler on the internet is currently following your default wildcard rule, whether that was ever a deliberate choice or not. If you'd rather have this checked properly rather than reading raw text yourself, a</span><a href="https://ppcguru.ca/tools/instant-audit"> <span style="font-weight: 400;">free AI visibility audit</span></a><span style="font-weight: 400;"> covers this alongside the other technical gaps that tend to hide in plain sight.</span>
<h3><b>Five ways businesses accidentally block AI crawlers</b></h3>
<b>A wildcard blocking everything.</b> <span style="font-weight: 400;">User-agent: * / Disallow: /</span><span style="font-weight: 400;"> with no carve-outs shuts out every compliant crawler, AI and traditional search alike. Shows up most often after a staging site gets pushed to production and nobody remembers to remove the restriction.</span>

<b>An outdated, auto-generated AI blocklist.</b><span style="font-weight: 400;"> Some security plugins and hosting tools quietly add long lists of AI user-agents to robots.txt by default, without the site owner ever seeing it happen. Read the actual file yourself. Don't assume a plugin's defaults match what you'd actually choose.</span>

<b>Blocking search crawlers along with training crawlers.</b><span style="font-weight: 400;"> A business decides it doesn't want GPTBot or ClaudeBot training on its content, blocks them, and in the process also blocks OAI-SearchBot or Claude-SearchBot without realizing those are separate bots doing a separate, more valuable job. This is the most common version of "right intent, wrong execution" in this whole area.</span>

<b>Letting bot names go stale.</b><span style="font-weight: 400;"> New AI crawlers appear several times a year as companies launch products or change their approach. A configuration accurate in January can have real gaps by summer.</span>

<b>Deploying without testing.</b><span style="font-weight: 400;"> One typo in a </span><span style="font-weight: 400;">User-agent</span><span style="font-weight: 400;"> line, or a rule in the wrong order, can produce crawling behavior nobody intended. Check the file right after any change, not weeks later once traffic or citations have already quietly dropped. This is exactly the kind of technical detail that gets missed without a proper</span><a href="https://ppcguru.ca/services/seo"> <span style="font-weight: 400;">SEO audit</span></a><span style="font-weight: 400;"> covering the full site, not just the content on it.</span>
<h3><b>The honest limits of robots.txt</b></h3>
<span style="font-weight: 400;">Worth knowing before treating this as a complete fix. It's a voluntary system. Major AI companies say they respect it, but it isn't enforcement, and some crawlers have documented histories of accessing sites through undeclared methods regardless of what the file says. Real enforcement, if you need it, means server-level blocking or a web application firewall — a bigger step most small businesses don't need on day one. And bot names shift. What's accurate today may be incomplete in six months, which is exactly why this belongs in a recurring technical review, not a task you finish once.</span>
<h3><b>Where this fits into the bigger picture</b></h3>
<span style="font-weight: 400;">Getting crawler access right is a prerequisite, not a strategy on its own. A perfectly open robots.txt sitting in front of thin, generic, unattributed content still won't earn a citation. It matters alongside the rest of the AI visibility work worth doing in parallel: making sure your</span><a href="https://ppcguru.ca/blog/schema-markup-for-ai-search-toronto-businesses-guide"> <span style="font-weight: 400;">structured data</span></a><span style="font-weight: 400;"> actually describes your business, keeping content genuinely current instead of stale, and building the kind of verifiable authorship that gives an AI system a real reason to trust what it finds once it's let in.</span>
<h3><b>Frequently asked questions</b></h3>
<b>Will blocking Google-Extended hurt my Google ranking?</b><span style="font-weight: 400;"> No. It controls Gemini and Vertex AI training specifically. Google states it's entirely separate from Googlebot, which handles your actual Search ranking and AI Overview eligibility.</span>

<b>Do I need to revisit my robots.txt file regularly?</b><span style="font-weight: 400;"> Yes. New AI crawlers appear periodically and existing ones occasionally change their user-agent names. A quarterly check is a reasonable baseline.</span>

<b>Is blocking a training crawler enough to keep my content fully out of AI training data?</b><span style="font-weight: 400;"> Not completely. Reputable AI companies say they honor these directives, but it's voluntary compliance, not technical enforcement — some crawlers and third-party datasets sourcing from the wider web may not.</span>

<b>Can I allow AI search bots while blocking AI training bots?</b><span style="font-weight: 400;"> Yes, and for most businesses this is the more sensible default. It keeps you eligible for citation in real-time AI answers while opting out of having your content used to train future models.</span>

<b>How do I know if an AI crawler has actually visited my site?</b><span style="font-weight: 400;"> Server access logs show crawler visits by user-agent, but they won't tell you whether a visit turned into an actual citation somewhere. That needs separate, dedicated tracking.</span>

<span style="font-weight: 400;">If your site's technical setup might be quietly capping its AI visibility,</span><a href="https://ppcguru.ca/contact"> <span style="font-weight: 400;">get in touch</span></a><span style="font-weight: 400;"> and we'll show you exactly where the gaps are.</span>

<b>Author:</b><span style="font-weight: 400;"> Siddharth Sharma is an SEO Specialist at PPC Guru, a [Toronto based digital marketing agency](https://ppcguru.ca/), with 6+ years of experience in search and digital marketing.</span>
