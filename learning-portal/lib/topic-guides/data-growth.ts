import { GuideMap, yt } from "./types"

export const DATA_GUIDES: GuideMap = {
  "data-1": {
    basics: {
      en: "Event tracking records what users do in your product: 'signed_up', 'added_to_cart', 'paid'. Each event has a name and properties (which plan, how much). Setting it up means deciding which events matter, naming them consistently, and checking they fire correctly.",
      bn: "Event tracking রেকর্ড করে ইউজার প্রোডাক্টে কী করে: 'signed_up', 'added_to_cart', 'paid'। প্রতিটি event-এর একটি নাম ও property (কোন প্ল্যান, কত টাকা) থাকে। সেটআপ মানে কোন event গুরুত্বপূর্ণ তা ঠিক করা, ধারাবাহিক নাম দেওয়া এবং ঠিকমতো ট্রিগার হচ্ছে কি না যাচাই করা।",
    },
    ideas: {
      en: [
        "Start from questions you want to answer, then decide the events needed.",
        "Write a tracking plan: event name, when it fires, properties, owner.",
        "Use one naming style (for example object_action: order_completed).",
        "Test events in a debug view before release. Never track personal data you don't need.",
      ],
      bn: [
        "যে প্রশ্নের উত্তর চান তা থেকে শুরু করুন, তারপর দরকারি event ঠিক করুন।",
        "Tracking plan লিখুন: event নাম, কখন ট্রিগার, property, মালিক।",
        "একটি নামকরণ স্টাইল রাখুন (যেমন object_action: order_completed)।",
        "রিলিজের আগে ডিবাগ ভিউতে event টেস্ট করুন। অপ্রয়োজনীয় ব্যক্তিগত তথ্য ট্র্যাক করবেন না।",
      ],
    },
    tryIt: {
      en: "Write a tracking plan with eight events for a simple online store, including properties for each.",
      bn: "একটি সহজ অনলাইন স্টোরের জন্য আটটি event-এর tracking plan লিখুন, প্রতিটির property সহ।",
    },
    refs: [
      { title: "Google Analytics 4: Events", url: "https://support.google.com/analytics/answer/9322688", kind: "Docs" },
      { title: "Segment: Data collection best practices", url: "https://segment.com/academy/collecting-data/naming-conventions-for-clean-data/", kind: "Article" },
      { title: "Mixpanel: Docs on tracking events", url: "https://docs.mixpanel.com/docs/tracking-methods/choosing-the-right-method", kind: "Docs" },
      { title: "Amplitude: Data taxonomy playbook", url: "https://amplitude.com/blog/data-taxonomy-playbook", kind: "Article" },
      yt("event tracking plan analytics setup"),
    ],
  },

  "data-2": {
    basics: {
      en: "A funnel shows the steps users take toward a goal and how many drop at each step (visit → sign up → first purchase). A cohort is a group of users who started in the same period; comparing cohorts shows whether your product keeps people over time.",
      bn: "Funnel দেখায় লক্ষ্যের দিকে ইউজার কোন ধাপ পার হয় এবং প্রতিটি ধাপে কতজন ঝরে যায় (ভিজিট → সাইন-আপ → প্রথম ক্রয়)। Cohort হলো একই সময়ে শুরু করা ইউজারদের দল; cohort তুলনা করলে বোঝা যায় প্রোডাক্ট সময়ের সাথে মানুষকে ধরে রাখছে কি না।",
    },
    ideas: {
      en: [
        "Find the biggest drop-off in the funnel; that is where to focus first.",
        "Split funnels by device, source or country to find hidden problems.",
        "Retention curves that flatten mean you have a core of loyal users.",
        "Compare like with like: new cohorts versus older cohorts.",
      ],
      bn: [
        "Funnel-এর সবচেয়ে বড় ঝরে পড়ার জায়গা খুঁজুন; সেখানেই আগে মনোযোগ দিন।",
        "লুকানো সমস্যা খুঁজতে ডিভাইস, সোর্স বা দেশ অনুযায়ী ভাগ করুন।",
        "যে retention curve সমতল হয়ে যায়, তার মানে আপনার একদল অনুগত ইউজার আছে।",
        "সমানে সমান তুলনা করুন: নতুন cohort বনাম পুরনো cohort।",
      ],
    },
    tryIt: {
      en: "Given these numbers: 1000 visits, 200 sign-ups, 50 first purchases. Compute each step's conversion rate and name the weakest step.",
      bn: "এই সংখ্যাগুলো ধরুন: ১০০০ ভিজিট, ২০০ সাইন-আপ, ৫০ প্রথম ক্রয়। প্রতিটি ধাপের কনভার্শন রেট হিসাব করুন এবং সবচেয়ে দুর্বল ধাপের নাম বলুন।",
    },
    refs: [
      { title: "Amplitude: What is funnel analysis?", url: "https://amplitude.com/blog/funnel-analysis", kind: "Article" },
      { title: "Amplitude: Cohort analysis guide", url: "https://amplitude.com/blog/cohort-analysis", kind: "Article" },
      { title: "Cohort analysis (Wikipedia)", url: "https://en.wikipedia.org/wiki/Cohort_analysis", kind: "Wiki" },
      { title: "Google Analytics: Funnel exploration", url: "https://support.google.com/analytics/answer/9327974", kind: "Docs" },
      yt("funnel analysis and cohort retention explained"),
    ],
  },

  "data-3": {
    basics: {
      en: "A KPI (key performance indicator) is a number that tells you if you are on track for an important goal. A dashboard puts a few KPIs on one screen so people can see the situation at a glance and know what to do next.",
      bn: "KPI (key performance indicator) হলো একটি সংখ্যা যা বলে আপনি গুরুত্বপূর্ণ লক্ষ্যের পথে আছেন কি না। Dashboard কয়েকটি KPI এক স্ক্রিনে রাখে, যাতে মানুষ এক নজরে পরিস্থিতি বুঝে পরবর্তী করণীয় জানতে পারে।",
    },
    ideas: {
      en: [
        "Fewer is better: 5 to 7 numbers that map to decisions.",
        "Every metric needs context: a target, a trend or a comparison.",
        "Choose chart types for the question: lines for trends, bars for comparisons.",
        "Say who the dashboard is for and what action it should trigger.",
      ],
      bn: [
        "কম ভালো: সিদ্ধান্তের সাথে যুক্ত ৫-৭টি সংখ্যা।",
        "প্রতিটি মেট্রিকের প্রসঙ্গ দরকার: লক্ষ্য, ট্রেন্ড বা তুলনা।",
        "প্রশ্ন অনুযায়ী চার্ট বাছুন: ট্রেন্ডে লাইন, তুলনায় বার।",
        "ড্যাশবোর্ড কার জন্য ও কী অ্যাকশন ঘটাবে তা বলুন।",
      ],
    },
    tryIt: {
      en: "Sketch a one-screen dashboard for a support team: choose five KPIs and the chart type for each.",
      bn: "একটি সাপোর্ট টিমের জন্য এক স্ক্রিনের ড্যাশবোর্ড স্কেচ করুন: পাঁচটি KPI ও প্রতিটির চার্ট ধরন বাছুন।",
    },
    refs: [
      { title: "Looker Studio help", url: "https://support.google.com/looker-studio", kind: "Docs" },
      { title: "Storytelling with Data blog", url: "https://www.storytellingwithdata.com/blog", kind: "Article" },
      { title: "Perceptual Edge: Dashboard design", url: "https://www.perceptualedge.com/articles/Whitepapers/Dashboard_Design.pdf", kind: "Article" },
      { title: "Key performance indicator (Wikipedia)", url: "https://en.wikipedia.org/wiki/Performance_indicator", kind: "Wiki" },
      yt("how to design a KPI dashboard"),
    ],
  },

  "data-4": {
    basics: {
      en: "SQL is the language for asking questions of a database. You SELECT columns FROM a table, filter with WHERE, group with GROUP BY, and join tables together. With these few commands you can answer many business questions without waiting for an engineer.",
      bn: "SQL হলো ডাটাবেসকে প্রশ্ন করার ভাষা। আপনি টেবিল থেকে কলাম SELECT করেন, WHERE দিয়ে ফিল্টার করেন, GROUP BY দিয়ে গ্রুপ করেন এবং টেবিলগুলো join করেন। এই কয়েকটি কমান্ড দিয়ে ইঞ্জিনিয়ারের জন্য অপেক্ষা না করেই অনেক ব্যবসায়িক প্রশ্নের উত্তর মেলে।",
    },
    ideas: {
      en: [
        "Order of writing: SELECT, FROM, JOIN, WHERE, GROUP BY, ORDER BY, LIMIT.",
        "Use COUNT, SUM and AVG to summarise.",
        "JOIN combines tables by a shared key (for example user_id).",
        "Start with LIMIT 10 to look at the data before running big queries.",
      ],
      bn: [
        "লেখার ক্রম: SELECT, FROM, JOIN, WHERE, GROUP BY, ORDER BY, LIMIT।",
        "সারাংশের জন্য COUNT, SUM ও AVG ব্যবহার করুন।",
        "JOIN একটি সাধারণ কী (যেমন user_id) দিয়ে টেবিল জোড়ে।",
        "বড় কুয়েরির আগে LIMIT 10 দিয়ে ডেটা দেখে নিন।",
      ],
    },
    tryIt: {
      en: "On an online SQL playground, write a query that counts orders per customer and shows the top three customers.",
      bn: "অনলাইন SQL প্লেগ্রাউন্ডে এমন একটি কুয়েরি লিখুন যা কাস্টমার প্রতি অর্ডার গোনে ও শীর্ষ তিন কাস্টমার দেখায়।",
    },
    refs: [
      { title: "SQLBolt: Interactive SQL lessons", url: "https://sqlbolt.com/", kind: "Course" },
      { title: "Mode: SQL Tutorial", url: "https://mode.com/sql-tutorial/", kind: "Course" },
      { title: "W3Schools: SQL tutorial", url: "https://www.w3schools.com/sql/", kind: "Course" },
      { title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", kind: "Docs" },
      yt("SQL tutorial for beginners"),
    ],
  },

  "data-5": {
    basics: {
      en: "Analytics tools collect data about people, so laws like GDPR require us to be transparent and, in most cases, to get consent before setting non-essential cookies or tracking. Good practice is to collect only what you need and respect a visitor's 'no'.",
      bn: "Analytics টুল মানুষের ডেটা সংগ্রহ করে, তাই GDPR-এর মতো আইন আমাদের স্বচ্ছ হতে এবং বেশিরভাগ ক্ষেত্রে অপ্রয়োজনীয় কুকি বা ট্র্যাকিংয়ের আগে সম্মতি নিতে বাধ্য করে। ভালো চর্চা: শুধু যা দরকার তাই সংগ্রহ করুন এবং ভিজিটরের 'না'কে সম্মান করুন।",
    },
    ideas: {
      en: [
        "A cookie banner must give a real choice; 'Reject' should be as easy as 'Accept'.",
        "Do not fire analytics or marketing tags before consent where it is required.",
        "Minimise data: avoid collecting names, emails or IP addresses unless needed.",
        "Consider privacy-friendly analytics and anonymisation to reduce risk.",
      ],
      bn: [
        "কুকি ব্যানারে প্রকৃত পছন্দ থাকতে হবে; 'Reject' 'Accept'-এর মতোই সহজ হওয়া উচিত।",
        "যেখানে সম্মতি দরকার, সম্মতির আগে analytics বা marketing ট্যাগ চালাবেন না।",
        "ডেটা কম রাখুন: দরকার ছাড়া নাম, ইমেইল বা IP সংগ্রহ করবেন না।",
        "ঝুঁকি কমাতে privacy-friendly analytics ও anonymisation বিবেচনা করুন।",
      ],
    },
    tryIt: {
      en: "Open three websites in a private window. Which ones show a consent banner, and can you reject everything in one click?",
      bn: "তিনটি ওয়েবসাইট প্রাইভেট উইন্ডোতে খুলুন। কোনগুলো সম্মতি ব্যানার দেখায়, এবং এক ক্লিকে সব প্রত্যাখ্যান করা যায় কি?",
    },
    refs: [
      { title: "ICO (UK): Guidance on cookies", url: "https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/", kind: "Docs" },
      { title: "GDPR.eu: Cookies and GDPR", url: "https://gdpr.eu/cookies/", kind: "Article" },
      { title: "EDPB: Guidelines on consent", url: "https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en", kind: "Docs" },
      { title: "Google Consent Mode overview", url: "https://developers.google.com/tag-platform/security/guides/consent", kind: "Docs" },
      yt("GDPR cookie consent analytics explained"),
    ],
  },
}

export const GROWTH_GUIDES: GuideMap = {
  "growth-1": {
    basics: {
      en: "SEO (Search Engine Optimisation) helps people find your site on Google through relevant, trustworthy content. It has three parts: technical (crawlable, fast, mobile-friendly), on-page (titles, headings, content that matches what people search for) and off-page (links from other good sites).",
      bn: "SEO (Search Engine Optimisation) প্রাসঙ্গিক, বিশ্বাসযোগ্য কনটেন্টের মাধ্যমে মানুষকে Google-এ আপনার সাইট খুঁজে পেতে সাহায্য করে। এর তিনটি অংশ: technical (crawl করা যায়, দ্রুত, মোবাইল-বান্ধব), on-page (শিরোনাম, হেডিং, মানুষের সার্চের সাথে মেলে এমন কনটেন্ট) এবং off-page (অন্য ভালো সাইট থেকে লিংক)।",
    },
    ideas: {
      en: [
        "Start with search intent: what does the person really want when they type this?",
        "One page, one main topic; write a clear title tag and meta description.",
        "Make sure pages can be crawled and indexed (robots.txt, sitemap, no accidental noindex).",
        "Content quality and usefulness beat tricks. Avoid keyword stuffing.",
      ],
      bn: [
        "সার্চ ইনটেন্ট দিয়ে শুরু করুন: এটি টাইপ করলে মানুষটি আসলে কী চায়?",
        "একটি পেজ, একটি প্রধান বিষয়; স্পষ্ট title tag ও meta description লিখুন।",
        "পেজ যেন crawl ও index করা যায় (robots.txt, sitemap, ভুলে noindex নয়)।",
        "ট্রিকের চেয়ে কনটেন্টের মান ও উপযোগিতা বড়। keyword stuffing এড়ান।",
      ],
    },
    tryIt: {
      en: "Search for your company's main service in Google. Who ranks on top and what do their titles say? Write one improvement for your page.",
      bn: "Google-এ আপনার কোম্পানির প্রধান সেবা সার্চ করুন। শীর্ষে কারা এবং তাদের শিরোনামে কী লেখা? আপনার পেজের জন্য একটি উন্নতি লিখুন।",
    },
    refs: [
      { title: "Google Search Central: SEO Starter Guide", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide", kind: "Docs" },
      { title: "Moz: Beginner's Guide to SEO", url: "https://moz.com/beginners-guide-to-seo", kind: "Book" },
      { title: "Ahrefs: SEO for beginners", url: "https://ahrefs.com/seo", kind: "Article" },
      { title: "Search engine optimization (Wikipedia)", url: "https://en.wikipedia.org/wiki/Search_engine_optimization", kind: "Wiki" },
      yt("SEO for beginners"),
    ],
  },

  "growth-2": {
    basics: {
      en: "Generative Engine Optimisation (GEO) is making your content easy for AI assistants (ChatGPT, Claude, Perplexity, Google AI Overviews) to find, understand and cite in their answers. People increasingly ask AI instead of searching, so being quoted matters.",
      bn: "Generative Engine Optimisation (GEO) হলো AI সহকারীরা (ChatGPT, Claude, Perplexity, Google AI Overviews) যেন আপনার কনটেন্ট খুঁজে, বুঝে এবং উত্তরে উদ্ধৃত করতে পারে তা সহজ করা। মানুষ সার্চের বদলে ক্রমেই AI-কে জিজ্ঞেস করছে, তাই উদ্ধৃত হওয়া গুরুত্বপূর্ণ।",
    },
    ideas: {
      en: [
        "Answer questions directly and clearly near the top of the page.",
        "Use structure: headings, lists, tables, FAQ and schema markup.",
        "Show expertise and sources; AI prefers trustworthy, specific content.",
        "Allow AI crawlers in robots.txt if you want to be cited, and measure mentions.",
      ],
      bn: [
        "পেজের শুরুর দিকে প্রশ্নের সরাসরি ও স্পষ্ট উত্তর দিন।",
        "কাঠামো ব্যবহার করুন: হেডিং, তালিকা, টেবিল, FAQ ও schema markup।",
        "দক্ষতা ও সোর্স দেখান; AI বিশ্বস্ত ও নির্দিষ্ট কনটেন্ট পছন্দ করে।",
        "উদ্ধৃত হতে চাইলে robots.txt-এ AI ক্রলার অনুমতি দিন এবং উল্লেখ পরিমাপ করুন।",
      ],
    },
    tryIt: {
      en: "Ask two AI assistants a question about your service area. Are you mentioned? Who is, and what do their pages do well?",
      bn: "দুটি AI সহকারীকে আপনার সেবার ক্ষেত্র নিয়ে প্রশ্ন করুন। আপনার উল্লেখ আছে কি? কার আছে, এবং তাদের পেজ কী ভালো করে?",
    },
    refs: [
      { title: "Generative engine optimization (Wikipedia)", url: "https://en.wikipedia.org/wiki/Generative_engine_optimization", kind: "Wiki" },
      { title: "GEO paper: Generative Engine Optimization", url: "https://arxiv.org/abs/2311.09735", kind: "Article" },
      { title: "Google: AI features and your website", url: "https://developers.google.com/search/docs/appearance/ai-features", kind: "Docs" },
      { title: "Schema.org structured data", url: "https://schema.org/docs/gs.html", kind: "Docs" },
      yt("generative engine optimization GEO explained"),
    ],
  },

  "growth-3": {
    basics: {
      en: "Conversion rate optimisation (CRO) is improving the share of visitors who do what you want (buy, sign up, book). You find where people leave, guess why, test a change, and keep what wins. Conversion rate = conversions ÷ visitors.",
      bn: "Conversion rate optimisation (CRO) হলো যত ভিজিটর আপনার কাঙ্ক্ষিত কাজ করে (কেনা, সাইন-আপ, বুক) তার অংশ বাড়ানো। কোথায় মানুষ চলে যায় তা খুঁজে, কারণ অনুমান করে, পরিবর্তন টেস্ট করে এবং যা জেতে তা রাখা। Conversion rate = কনভার্শন ÷ ভিজিটর।",
    },
    ideas: {
      en: [
        "Use data (funnels, heatmaps, session recordings) and talk to users to find friction.",
        "Common wins: clearer headline and button, fewer form fields, trust signals, faster pages.",
        "Test one change at a time and run it long enough to trust the result.",
        "Optimise for the whole journey, not just the last click.",
      ],
      bn: [
        "ঘর্ষণ খুঁজতে ডেটা (funnel, heatmap, session recording) ও ইউজারের সাথে কথা ব্যবহার করুন।",
        "সাধারণ জয়: স্পষ্ট হেডলাইন ও বাটন, কম ফর্ম ফিল্ড, আস্থার সংকেত, দ্রুত পেজ।",
        "একবারে একটি পরিবর্তন টেস্ট করুন এবং ফল বিশ্বাস করার মতো সময় চালান।",
        "শুধু শেষ ক্লিক নয়, পুরো যাত্রার জন্য অপ্টিমাইজ করুন।",
      ],
    },
    tryIt: {
      en: "Pick a landing page and list five possible reasons visitors leave without acting. Which would you test first and why?",
      bn: "একটি ল্যান্ডিং পেজ নিন এবং ভিজিটর কিছু না করে চলে যাওয়ার পাঁচটি সম্ভাব্য কারণ লিখুন। কোনটি আগে টেস্ট করবেন এবং কেন?",
    },
    refs: [
      { title: "CXL: Conversion rate optimization guide", url: "https://cxl.com/conversion-rate-optimization/", kind: "Article" },
      { title: "NN/g: Conversion rate", url: "https://www.nngroup.com/articles/conversion-rates/", kind: "Article" },
      { title: "Hotjar: What is CRO", url: "https://www.hotjar.com/conversion-rate-optimization/", kind: "Article" },
      { title: "Baymard Institute: Checkout usability", url: "https://baymard.com/research/checkout-usability", kind: "Article" },
      yt("conversion rate optimization basics"),
    ],
  },

  "growth-4": {
    basics: {
      en: "Ecommerce UX is making it easy to find, trust and buy a product. A good product page has clear photos, price, delivery info and reviews. A good cart and checkout is short, transparent about costs, and offers payment methods people actually use.",
      bn: "Ecommerce UX হলো পণ্য খুঁজে পাওয়া, বিশ্বাস করা ও কেনা সহজ করা। ভালো পণ্য পেজে স্পষ্ট ছবি, দাম, ডেলিভারি তথ্য ও রিভিউ থাকে। ভালো কার্ট ও চেকআউট ছোট, খরচে স্বচ্ছ, এবং মানুষ আসলে যা ব্যবহার করে সেই পেমেন্ট পদ্ধতি দেয়।",
    },
    ideas: {
      en: [
        "Show total cost (shipping, tax) early. Surprise costs are a top reason for abandoned carts.",
        "Offer guest checkout and fewer fields; let people fix errors inline.",
        "Support local payment methods (for Bangladesh: bKash, Nagad, cards, cash on delivery).",
        "Make search, filters and mobile layout excellent; most shoppers are on phones.",
      ],
      bn: [
        "মোট খরচ (ডেলিভারি, ট্যাক্স) আগে দেখান। অপ্রত্যাশিত খরচ কার্ট পরিত্যাগের শীর্ষ কারণ।",
        "গেস্ট চেকআউট ও কম ফিল্ড দিন; ভুল ইনলাইন ঠিক করতে দিন।",
        "স্থানীয় পেমেন্ট পদ্ধতি সমর্থন করুন (বাংলাদেশে: bKash, Nagad, কার্ড, ক্যাশ অন ডেলিভারি)।",
        "সার্চ, ফিল্টার ও মোবাইল লেআউট চমৎকার করুন; বেশিরভাগ ক্রেতা ফোনে।",
      ],
    },
    tryIt: {
      en: "Buy something small from an online shop and count the number of steps and fields. What would you remove?",
      bn: "অনলাইন শপ থেকে ছোট কিছু কিনুন এবং ধাপ ও ফিল্ড গুনুন। কী বাদ দিতেন?",
    },
    refs: [
      { title: "Baymard Institute: Checkout usability research", url: "https://baymard.com/research/checkout-usability", kind: "Article" },
      { title: "NN/g: E-commerce UX", url: "https://www.nngroup.com/topic/e-commerce/", kind: "Article" },
      { title: "Shopify: Ecommerce UX best practices", url: "https://www.shopify.com/blog/ecommerce-ux", kind: "Article" },
      { title: "Baymard: Product page UX", url: "https://baymard.com/research/product-page", kind: "Article" },
      yt("ecommerce checkout UX best practices"),
    ],
  },

  "growth-5": {
    basics: {
      en: "Positioning decides where you sit in the customer's mind compared with alternatives: who you are for, what you are, and why you are better for them. Messaging is how you say it in words. Clear positioning makes marketing, sales and product decisions easier.",
      bn: "Positioning ঠিক করে বিকল্পের তুলনায় কাস্টমারের মনে আপনি কোথায়: আপনি কার জন্য, আপনি কী এবং তাদের জন্য কেন ভালো। Messaging হলো তা ভাষায় বলার উপায়। স্পষ্ট positioning মার্কেটিং, সেলস ও প্রোডাক্ট সিদ্ধান্ত সহজ করে।",
    },
    ideas: {
      en: [
        "Positioning statement: For [target], [brand] is the [category] that [key benefit], unlike [alternative].",
        "Know your category and your competitive alternatives (including 'do nothing').",
        "Speak in the customer's words and lead with the benefit, not the feature.",
        "Use one clear message. If you say everything, nobody remembers anything.",
      ],
      bn: [
        "Positioning বাক্য: [টার্গেট]-এর জন্য, [ব্র্যান্ড] হলো সেই [ক্যাটেগরি] যা [মূল সুবিধা] দেয়, [বিকল্প]-এর মতো নয়।",
        "আপনার ক্যাটেগরি ও প্রতিযোগিতামূলক বিকল্প জানুন ('কিছু না করা'ও)।",
        "কাস্টমারের ভাষায় বলুন এবং ফিচারের নয়, সুবিধার কথা দিয়ে শুরু করুন।",
        "একটি স্পষ্ট বার্তা দিন। সব বললে কেউ কিছুই মনে রাখে না।",
      ],
    },
    tryIt: {
      en: "Fill in the positioning sentence for TXL (or your own product) and read it aloud to a colleague. Did they understand it?",
      bn: "TXL (বা আপনার নিজের প্রোডাক্ট)-এর জন্য positioning বাক্যটি পূরণ করুন এবং সহকর্মীকে পড়ে শোনান। তিনি কি বুঝেছেন?",
    },
    refs: [
      { title: "April Dunford: Obviously Awesome", url: "https://www.aprildunford.com/books", kind: "Book" },
      { title: "Harvard Business Review: What Is Strategy? (positioning)", url: "https://hbr.org/1996/11/what-is-strategy", kind: "Article" },
      { title: "Positioning (marketing) (Wikipedia)", url: "https://en.wikipedia.org/wiki/Product_positioning", kind: "Wiki" },
      { title: "Unbounce: Value proposition and messaging", url: "https://unbounce.com/conversion-rate-optimization/value-proposition/", kind: "Article" },
      yt("April Dunford positioning explained"),
    ],
  },

  "growth-6": {
    basics: {
      en: "A case study tells the story of how a client solved a problem with your help, with real results. It is one of the strongest forms of proof for future clients. A good one follows: situation, challenge, what we did, results (with numbers) and a client quote.",
      bn: "Case study গল্প বলে কীভাবে একজন ক্লায়েন্ট আপনার সাহায্যে সমস্যা সমাধান করেছে, আসল ফলাফলসহ। ভবিষ্যৎ ক্লায়েন্টের জন্য এটি সবচেয়ে শক্তিশালী প্রমাণগুলোর একটি। ভালো case study-র ক্রম: পরিস্থিতি, চ্যালেঞ্জ, আমরা কী করেছি, ফলাফল (সংখ্যাসহ) ও ক্লায়েন্টের উক্তি।",
    },
    ideas: {
      en: [
        "Lead with the client's result, not with your process.",
        "Use specific numbers (conversion up 32%) and a real name and quote with permission.",
        "Keep it scannable: headings, a summary box, a few images.",
        "Get approval from the client and respect any confidentiality.",
      ],
      bn: [
        "আপনার প্রক্রিয়া নয়, ক্লায়েন্টের ফল দিয়ে শুরু করুন।",
        "নির্দিষ্ট সংখ্যা (কনভার্শন ৩২% বেড়েছে) এবং অনুমতিসহ আসল নাম ও উক্তি ব্যবহার করুন।",
        "পড়তে সহজ রাখুন: হেডিং, সারাংশ বক্স, কয়েকটি ছবি।",
        "ক্লায়েন্টের অনুমোদন নিন এবং গোপনীয়তা মেনে চলুন।",
      ],
    },
    tryIt: {
      en: "Outline a case study for one of your recent projects using the five-part structure, with at least one number in the results.",
      bn: "আপনার একটি সাম্প্রতিক প্রজেক্টের জন্য পাঁচ অংশের কাঠামোতে case study রূপরেখা করুন, ফলাফলে অন্তত একটি সংখ্যাসহ।",
    },
    refs: [
      { title: "HubSpot: Case study examples", url: "https://blog.hubspot.com/marketing/case-study-examples", kind: "Article" },
      { title: "Testimonial (Wikipedia), client quotes as proof", url: "https://en.wikipedia.org/wiki/Testimonial", kind: "Wiki" },
      { title: "Case study (Wikipedia)", url: "https://en.wikipedia.org/wiki/Case_study", kind: "Wiki" },
      { title: "Content Marketing Institute: Case studies", url: "https://contentmarketinginstitute.com/articles/b2b-case-study-guide/", kind: "Article" },
      yt("how to write a customer case study"),
    ],
  },
}
