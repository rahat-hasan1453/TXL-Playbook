import { GuideMap, yt } from "./types"

export const BUSINESS_GUIDES: GuideMap = {
  "biz-1": {
    basics: {
      en: "The Business Model Canvas is a one-page map of a business. It has nine boxes that answer: who are the customers, what do we offer them, how do we reach them, and how do we earn money and pay our bills. Reading a client's canvas tells you quickly how they make money.",
      bn: "Business Model Canvas হলো একটি ব্যবসার এক পাতার ম্যাপ। এখানে ৯টি ঘর আছে, যা উত্তর দেয়: কাস্টমার কারা, আমরা তাদের কী দিই, তাদের কাছে কীভাবে পৌঁছাই, আর আয়-ব্যয় কীভাবে চলে। ক্লায়েন্টের ক্যানভাস পড়লেই বোঝা যায় তারা কীভাবে টাকা আয় করে।",
    },
    ideas: {
      en: [
        "Nine boxes: customer segments, value propositions, channels, customer relationships, revenue streams, key resources, key activities, key partners, cost structure.",
        "The right side is about customers and value; the left side is about how the business delivers it.",
        "Draw it on one page in pencil. It is a thinking tool, not a report.",
        "Each box should connect to the others. A new customer segment usually needs a new channel and a new offer.",
      ],
      bn: [
        "নয়টি ঘর: Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partners, Cost Structure।",
        "ডানদিক কাস্টমার ও ভ্যালু নিয়ে; বামদিক ব্যবসা কীভাবে সেটা পৌঁছে দেয় তা নিয়ে।",
        "এক পাতায় পেন্সিলে আঁকুন। এটি চিন্তার টুল, কোনো রিপোর্ট নয়।",
        "প্রতিটি ঘর একে অপরের সাথে যুক্ত। নতুন customer segment মানে সাধারণত নতুন channel আর নতুন offer।",
      ],
    },
    tryIt: {
      en: "Pick a company you use daily (for example Uber or Netflix) and fill in all nine boxes from memory, then check your guesses against their website.",
      bn: "আপনি রোজ ব্যবহার করেন এমন একটি কোম্পানি (যেমন Uber বা Netflix) বেছে নিন। মুখস্থ থেকে নয়টি ঘর পূরণ করুন, তারপর তাদের ওয়েবসাইটের সাথে মিলিয়ে দেখুন।",
    },
    refs: [
      { title: "Strategyzer: The Business Model Canvas", url: "https://www.strategyzer.com/library/the-business-model-canvas", kind: "Article" },
      { title: "Business Model Canvas (Wikipedia)", url: "https://en.wikipedia.org/wiki/Business_Model_Canvas", kind: "Wiki" },
      { title: "Lean Canvas, a startup-friendly variant (Ash Maurya)", url: "https://leanstack.com/lean-canvas", kind: "Tool" },
      { title: "Book: Business Model Generation (Osterwalder & Pigneur)", url: "https://www.strategyzer.com/library/business-model-generation", kind: "Book" },
      yt("Business Model Canvas explained"),
    ],
  },

  "biz-2": {
    basics: {
      en: "A value proposition is the promise: why a specific customer should pick your product over the alternatives. Value proposition design starts from the customer's jobs, pains and gains, and then shapes the product to remove the pains and create the gains.",
      bn: "Value proposition হলো একটি প্রতিশ্রুতি: কেন একজন নির্দিষ্ট কাস্টমার বিকল্পের বদলে আপনার প্রোডাক্ট বেছে নেবে। এই ডিজাইন শুরু হয় কাস্টমারের job, pain ও gain দিয়ে, তারপর প্রোডাক্টকে সেই pain কমাতে ও gain বাড়াতে সাজানো হয়।",
    },
    ideas: {
      en: [
        "Customer profile: jobs (what they are trying to get done), pains (what annoys or blocks them), gains (what delights them).",
        "Value map: products and services, pain relievers, gain creators.",
        "Fit means your pain relievers and gain creators match pains and gains that really matter to the customer.",
        "Validate with real customers. Your own opinion is only a hypothesis.",
      ],
      bn: [
        "Customer profile: jobs (তারা কী করতে চায়), pains (কী তাদের বিরক্ত বা আটকে দেয়), gains (কী তাদের খুশি করে)।",
        "Value map: products and services, pain relievers, gain creators।",
        "Fit মানে আপনার pain reliever ও gain creator কাস্টমারের সত্যিকারের গুরুত্বপূর্ণ pain ও gain-এর সাথে মেলে।",
        "আসল কাস্টমারের সাথে যাচাই করুন। আপনার নিজের মত শুধু একটি অনুমান (hypothesis)।",
      ],
    },
    tryIt: {
      en: "Write down three pains and three gains for one customer type of a client, then rank them by how much they matter.",
      bn: "একটি ক্লায়েন্টের একটি কাস্টমার ধরনের জন্য তিনটি pain ও তিনটি gain লিখুন, তারপর গুরুত্ব অনুযায়ী সাজান।",
    },
    refs: [
      { title: "Strategyzer: Value Proposition Canvas", url: "https://www.strategyzer.com/library/the-value-proposition-canvas", kind: "Article" },
      { title: "Book: Value Proposition Design", url: "https://www.strategyzer.com/library/value-proposition-design-2", kind: "Book" },
      { title: "Christensen Institute: Jobs to Be Done (customer jobs, pains and gains)", url: "https://www.christenseninstitute.org/theory/jobs-to-be-done/", kind: "Article" },
      { title: "Value proposition (Wikipedia)", url: "https://en.wikipedia.org/wiki/Value_proposition", kind: "Wiki" },
      yt("Value Proposition Canvas tutorial"),
    ],
  },

  "biz-3": {
    basics: {
      en: "A pricing model is the rule for how a customer pays. Common ones are fixed price (one agreed amount for a defined scope), retainer (monthly fee for ongoing capacity), subscription (recurring fee for access) and outcome-based (pay when a result is achieved). Each one shifts risk between us and the client.",
      bn: "Pricing model হলো কাস্টমার কীভাবে টাকা দেবে তার নিয়ম। প্রচলিত ধরন: fixed price (নির্দিষ্ট স্কোপের জন্য একটি সম্মত অঙ্ক), retainer (চলমান কাজের জন্য মাসিক ফি), subscription (ব্যবহারের জন্য নিয়মিত ফি) এবং outcome-based (ফল পেলে টাকা)। প্রতিটি মডেলে আমাদের ও ক্লায়েন্টের মধ্যে ঝুঁকির ভাগ বদলে যায়।",
    },
    ideas: {
      en: [
        "Fixed price: client has cost certainty, we carry the scope risk.",
        "Time and materials or retainer: client carries more risk, we get flexibility.",
        "Subscription: predictable revenue, but customers can leave any month.",
        "Outcome-based: aligns incentives, but needs a clear and measurable result.",
      ],
      bn: [
        "Fixed price: ক্লায়েন্টের খরচ নিশ্চিত, স্কোপের ঝুঁকি আমাদের।",
        "Time and materials বা retainer: ক্লায়েন্ট বেশি ঝুঁকি নেয়, আমরা নমনীয়তা পাই।",
        "Subscription: আয় অনুমানযোগ্য, কিন্তু কাস্টমার যেকোনো মাসে চলে যেতে পারে।",
        "Outcome-based: স্বার্থ এক হয়, কিন্তু স্পষ্ট ও মাপা যায় এমন ফল দরকার।",
      ],
    },
    tryIt: {
      en: "Take one recent TXL project and describe how it would look under fixed price versus a retainer. Who carries which risk?",
      bn: "TXL-এর একটি সাম্প্রতিক প্রজেক্ট নিয়ে লিখুন fixed price আর retainer হলে সেটা কেমন হতো। কোন ঝুঁকি কার ঘাড়ে পড়ত?",
    },
    refs: [
      { title: "Stripe: SaaS pricing models, a guide", url: "https://stripe.com/resources/more/saas-pricing-models-101", kind: "Article" },
      { title: "Pricing strategies (Wikipedia)", url: "https://en.wikipedia.org/wiki/Pricing_strategies", kind: "Wiki" },
      { title: "Harvard Business Review: A Quick Guide to Value-Based Pricing", url: "https://hbr.org/2016/08/a-quick-guide-to-value-based-pricing", kind: "Article" },
      { title: "Time and materials contract (Wikipedia)", url: "https://en.wikipedia.org/wiki/Time_and_materials", kind: "Wiki" },
      yt("pricing models for services fixed price retainer outcome based"),
    ],
  },

  "biz-4": {
    basics: {
      en: "Unit economics asks: does one customer make us money? You compare what a customer is worth over time (lifetime value, LTV) with what it costs to win them (customer acquisition cost, CAC). If LTV is clearly higher than CAC, the business can grow healthily.",
      bn: "Unit economics জানতে চায়: একজন কাস্টমার কি আমাদের লাভ দেয়? একজন কাস্টমার সময়ের সাথে কত মূল্যবান (lifetime value, LTV) তার সাথে তাকে পেতে কত খরচ (customer acquisition cost, CAC) তুলনা করা হয়। LTV যদি CAC-এর চেয়ে স্পষ্টভাবে বেশি হয়, ব্যবসা সুস্থভাবে বাড়তে পারে।",
    },
    ideas: {
      en: [
        "LTV = average revenue per customer × gross margin × how long they stay.",
        "CAC = total sales and marketing spend ÷ new customers won.",
        "A common rule of thumb is LTV:CAC of 3:1 or better, and CAC paid back within a year.",
        "Look at margin, not just revenue. Revenue without margin can hide a losing business.",
      ],
      bn: [
        "LTV = গড় রাজস্ব প্রতি কাস্টমার × gross margin × কাস্টমার কতদিন থাকে।",
        "CAC = মোট sales ও marketing খরচ ÷ নতুন কাস্টমার সংখ্যা।",
        "সাধারণ নিয়ম: LTV:CAC হবে ৩:১ বা তার বেশি, আর CAC এক বছরের মধ্যে উঠে আসবে।",
        "শুধু রাজস্ব নয়, margin দেখুন। margin ছাড়া রাজস্ব ক্ষতির ব্যবসাও লুকিয়ে রাখতে পারে।",
      ],
    },
    tryIt: {
      en: "Invent a simple subscription app: 10 USD per month, 70% margin, customers stay 12 months, 40 USD to acquire. Calculate LTV, CAC and the ratio.",
      bn: "একটি সহজ subscription অ্যাপ ধরুন: মাসে ১০ USD, ৭০% margin, কাস্টমার ১২ মাস থাকে, অর্জন খরচ ৪০ USD। LTV, CAC ও অনুপাত হিসাব করুন।",
    },
    refs: [
      { title: "a16z: 16 Startup Metrics", url: "https://a16z.com/16-startup-metrics/", kind: "Article" },
      { title: "Customer lifetime value (Wikipedia)", url: "https://en.wikipedia.org/wiki/Customer_lifetime_value", kind: "Wiki" },
      { title: "Stripe: What is LTV and how to calculate it", url: "https://stripe.com/resources/more/customer-lifetime-value", kind: "Article" },
      { title: "David Skok: SaaS Metrics 2.0", url: "https://www.forentrepreneurs.com/saas-metrics-2/", kind: "Article" },
      yt("unit economics LTV CAC explained for beginners"),
    ],
  },

  "biz-5": {
    basics: {
      en: "Porter's Five Forces is a checklist for judging how attractive an industry is. It looks at five pressures on profit: competition between existing rivals, threat of new entrants, threat of substitutes, power of buyers and power of suppliers. Strong forces mean thin profits.",
      bn: "Porter's Five Forces হলো একটি ইন্ডাস্ট্রি কতটা আকর্ষণীয় তা মাপার চেকলিস্ট। এটি মুনাফার ওপর পাঁচটি চাপ দেখে: বর্তমান প্রতিযোগীদের লড়াই, নতুন প্রবেশকারীর হুমকি, বিকল্প পণ্যের হুমকি, ক্রেতার দরকষাকষির ক্ষমতা ও সরবরাহকারীর ক্ষমতা। চাপ যত শক্ত, মুনাফা তত কম।",
    },
    ideas: {
      en: [
        "Rivalry: many similar competitors usually means price wars.",
        "New entrants: low barriers (little money or skill needed) invite newcomers.",
        "Substitutes: a different product that solves the same problem, such as video calls replacing travel.",
        "Buyer and supplier power: whoever has fewer alternatives has less bargaining power.",
      ],
      bn: [
        "Rivalry: একই রকম অনেক প্রতিযোগী মানে সাধারণত দামের যুদ্ধ।",
        "New entrants: প্রবেশের বাধা কম (কম টাকা বা দক্ষতা লাগে) হলে নতুনরা আসে।",
        "Substitutes: ভিন্ন পণ্য যা একই সমস্যা মেটায়, যেমন ভিডিও কল ভ্রমণের বিকল্প।",
        "Buyer ও supplier power: যার বিকল্প কম, তার দরকষাকষির ক্ষমতাও কম।",
      ],
    },
    tryIt: {
      en: "Score each of the five forces from 1 (weak) to 5 (strong) for the food delivery industry in Bangladesh, and write one sentence why.",
      bn: "বাংলাদেশের ফুড ডেলিভারি ইন্ডাস্ট্রির জন্য পাঁচটি force-কে ১ (দুর্বল) থেকে ৫ (শক্ত) স্কোর দিন এবং প্রতিটির কারণ এক বাক্যে লিখুন।",
    },
    refs: [
      { title: "Harvard Business Review: The Five Competitive Forces That Shape Strategy", url: "https://hbr.org/2008/01/the-five-competitive-forces-that-shape-strategy", kind: "Article" },
      { title: "Porter's five forces analysis (Wikipedia)", url: "https://en.wikipedia.org/wiki/Porter%27s_five_forces_analysis", kind: "Wiki" },
      { title: "Harvard Business School ISC: The Five Forces", url: "https://www.isc.hbs.edu/strategy/business-strategy/Pages/the-five-forces.aspx", kind: "Article" },
      { title: "Competitor analysis (Wikipedia)", url: "https://en.wikipedia.org/wiki/Competitor_analysis", kind: "Wiki" },
      yt("Porter's Five Forces explained with examples"),
    ],
  },

  "biz-6": {
    basics: {
      en: "7 Powers is Hamilton Helmer's framework for lasting competitive advantage. A power is something that lets a company earn better returns than rivals, and keep doing so. The seven are scale economies, network effects, counter-positioning, switching costs, branding, cornered resource and process power.",
      bn: "7 Powers হলো Hamilton Helmer-এর কাঠামো, যা দীর্ঘস্থায়ী প্রতিযোগিতামূলক সুবিধা ব্যাখ্যা করে। Power মানে এমন কিছু যা কোম্পানিকে প্রতিযোগীর চেয়ে ভালো মুনাফা এনে দেয় এবং তা ধরে রাখে। সাতটি হলো scale economies, network effects, counter-positioning, switching costs, branding, cornered resource ও process power।",
    },
    ideas: {
      en: [
        "A power must give both a benefit (better margins or lower cost) and a barrier (rivals cannot copy it easily).",
        "Network effects: the product gets more valuable as more people use it (WhatsApp).",
        "Switching costs: leaving is painful for the customer (changing a bank).",
        "Being better today is not a power. Ask what stops others from catching up.",
      ],
      bn: [
        "Power-এর দুটি অংশ থাকতে হয়: benefit (ভালো margin বা কম খরচ) এবং barrier (প্রতিযোগী সহজে নকল করতে পারে না)।",
        "Network effects: যত বেশি মানুষ ব্যবহার করে, প্রোডাক্ট তত মূল্যবান (WhatsApp)।",
        "Switching costs: ছেড়ে যাওয়া কাস্টমারের জন্য কষ্টকর (ব্যাংক বদলানো)।",
        "আজ ভালো হওয়া মানেই power নয়। জিজ্ঞেস করুন, অন্যদের ধরে ফেলা কী আটকায়?",
      ],
    },
    tryIt: {
      en: "Choose one company you admire and name which of the seven powers it has, if any, with one piece of evidence.",
      bn: "আপনার পছন্দের একটি কোম্পানি বেছে নিন এবং সাতটির মধ্যে কোন power আছে (থাকলে) একটি প্রমাণসহ লিখুন।",
    },
    refs: [
      { title: "7 Powers official site", url: "https://7powers.com/", kind: "Article" },
      { title: "Economies of scale (Wikipedia), the first of the seven powers", url: "https://en.wikipedia.org/wiki/Economies_of_scale", kind: "Wiki" },
      { title: "Competitive advantage (Wikipedia)", url: "https://en.wikipedia.org/wiki/Competitive_advantage", kind: "Wiki" },
      { title: "Network effect (Wikipedia)", url: "https://en.wikipedia.org/wiki/Network_effect", kind: "Wiki" },
      yt("Hamilton Helmer 7 Powers summary"),
    ],
  },

  "biz-7": {
    basics: {
      en: "SWOT is a quick way to take stock. Strengths and weaknesses are inside the organisation. Opportunities and threats come from outside. Put them in a 2×2 grid and use it to decide what to do next, not just to list facts.",
      bn: "SWOT হলো দ্রুত অবস্থা যাচাইয়ের উপায়। Strengths ও weaknesses সংগঠনের ভেতরের বিষয়। Opportunities ও threats বাইরে থেকে আসে। এগুলো ২×২ ছকে সাজান এবং পরবর্তী করণীয় ঠিক করতে ব্যবহার করুন, শুধু তথ্য তালিকা করতে নয়।",
    },
    ideas: {
      en: [
        "Internal: strengths (what we do well) and weaknesses (where we lag).",
        "External: opportunities (trends we can use) and threats (trends that hurt us).",
        "Be specific. 'Good team' is weak; 'six engineers with Blocks experience' is useful.",
        "Turn it into actions: use strengths on opportunities, fix weaknesses that meet threats.",
      ],
      bn: [
        "ভেতরের: strengths (যা ভালো পারি) ও weaknesses (যেখানে পিছিয়ে)।",
        "বাইরের: opportunities (যে ট্রেন্ড কাজে লাগানো যায়) ও threats (যে ট্রেন্ড ক্ষতি করে)।",
        "নির্দিষ্ট হোন। 'ভালো টিম' দুর্বল কথা; 'Blocks অভিজ্ঞ ছয়জন ইঞ্জিনিয়ার' কাজের কথা।",
        "অ্যাকশনে রূপ দিন: strength দিয়ে opportunity ধরুন, threat-এর মুখে থাকা weakness ঠিক করুন।",
      ],
    },
    tryIt: {
      en: "Do a 10-minute SWOT of your own career right now with at least two points in each box.",
      bn: "এখনই ১০ মিনিটে নিজের ক্যারিয়ারের একটি SWOT করুন, প্রতিটি ঘরে অন্তত দুটি পয়েন্ট দিয়ে।",
    },
    refs: [
      { title: "Strategic planning (Wikipedia)", url: "https://en.wikipedia.org/wiki/Strategic_planning", kind: "Wiki" },
      { title: "SWOT analysis (Wikipedia)", url: "https://en.wikipedia.org/wiki/SWOT_analysis", kind: "Wiki" },
      { title: "MindTools: SWOT Analysis", url: "https://www.mindtools.com/amtbj63/swot-analysis", kind: "Article" },
      { title: "Harvard Business Review: What Is Strategy?", url: "https://hbr.org/1996/11/what-is-strategy", kind: "Article" },
      yt("SWOT analysis explained simply"),
    ],
  },

  "biz-8": {
    basics: {
      en: "OKRs (Objectives and Key Results) help a team agree on what matters and measure progress. An Objective is a short, inspiring goal. Key Results are 2 to 5 numbers that show whether the objective was reached. OKRs are reviewed every quarter.",
      bn: "OKR (Objectives and Key Results) টিমকে ঠিক করতে সাহায্য করে কোনটি গুরুত্বপূর্ণ এবং অগ্রগতি মাপে। Objective হলো ছোট, অনুপ্রেরণাদায়ক লক্ষ্য। Key Result হলো ২ থেকে ৫টি সংখ্যা, যা বলে লক্ষ্য পূরণ হলো কি না। প্রতি কোয়ার্টারে OKR পর্যালোচনা হয়।",
    },
    ideas: {
      en: [
        "Objective: qualitative and memorable. 'Make onboarding painless'.",
        "Key Result: measurable outcome, not a task. 'Cut time to first project from 20 to 8 minutes'.",
        "Aim to stretch. Reaching about 70% of an ambitious OKR is healthy.",
        "Keep OKRs few (3 to 5 objectives) and visible to everyone.",
      ],
      bn: [
        "Objective: গুণগত ও মনে রাখার মতো। 'অনবোর্ডিং ঝামেলামুক্ত করা'।",
        "Key Result: মাপা যায় এমন ফল, কাজের তালিকা নয়। 'প্রথম প্রজেক্ট শুরুর সময় ২০ থেকে ৮ মিনিটে নামানো'।",
        "সাহসী লক্ষ্য রাখুন। উচ্চাভিলাষী OKR-এর প্রায় ৭০% অর্জন স্বাভাবিক।",
        "OKR কম রাখুন (৩ থেকে ৫টি objective) এবং সবাইকে দেখান।",
      ],
    },
    tryIt: {
      en: "Write one personal OKR for this quarter: one objective and three measurable key results.",
      bn: "এই কোয়ার্টারের জন্য নিজের একটি OKR লিখুন: একটি objective ও তিনটি মাপযোগ্য key result।",
    },
    refs: [
      { title: "What Matters: OKRs by John Doerr", url: "https://www.whatmatters.com/", kind: "Article" },
      { title: "Google re:Work: Set goals with OKRs", url: "https://rework.withgoogle.com/intl/en/guides/set-goals-with-okrs", kind: "Article" },
      { title: "OKR (Wikipedia)", url: "https://en.wikipedia.org/wiki/OKR", kind: "Wiki" },
      { title: "Atlassian: OKRs guide", url: "https://www.atlassian.com/agile/agile-at-scale/okr", kind: "Article" },
      yt("OKRs explained with examples"),
    ],
  },

  "biz-9": {
    basics: {
      en: "Land and expand means winning a small first deal with a client (land) and then growing the relationship over time (expand). A good first project builds trust, and trust earns the next project. It is cheaper to grow an existing account than to find a new one.",
      bn: "Land and expand মানে ক্লায়েন্টের সাথে প্রথমে ছোট একটি ডিল জেতা (land), তারপর সময়ের সাথে সম্পর্ক বাড়ানো (expand)। ভালো প্রথম প্রজেক্ট বিশ্বাস গড়ে, আর বিশ্বাস পরের প্রজেক্ট এনে দেয়। নতুন ক্লায়েন্ট খোঁজার চেয়ে বিদ্যমান ক্লায়েন্ট বাড়ানো সস্তা।",
    },
    ideas: {
      en: [
        "Land with a small, low-risk project that proves value quickly.",
        "Deliver well and visibly. Results are the best sales pitch.",
        "Look for natural next steps: more teams, more features, ongoing support.",
        "Keep in touch with several people at the client, not just one sponsor.",
      ],
      bn: [
        "ছোট, কম ঝুঁকির প্রজেক্ট দিয়ে শুরু করুন যা দ্রুত মূল্য প্রমাণ করে।",
        "ভালোভাবে ও দৃশ্যমানভাবে ডেলিভার করুন। ফলই সেরা সেলস পিচ।",
        "স্বাভাবিক পরবর্তী ধাপ খুঁজুন: আরও টিম, আরও ফিচার, চলমান সাপোর্ট।",
        "ক্লায়েন্টের একাধিক মানুষের সাথে যোগাযোগ রাখুন, শুধু একজন স্পন্সর নয়।",
      ],
    },
    tryIt: {
      en: "Think of a current client and list three possible 'expand' ideas, each with the person at the client who would care.",
      bn: "একটি বর্তমান ক্লায়েন্ট ভাবুন এবং তিনটি সম্ভাব্য 'expand' আইডিয়া লিখুন, প্রতিটির জন্য ক্লায়েন্টের কোন ব্যক্তি আগ্রহী হবেন তাও লিখুন।",
    },
    refs: [
      { title: "Customer retention (Wikipedia)", url: "https://en.wikipedia.org/wiki/Customer_retention", kind: "Wiki" },
      { title: "Customer lifetime value (Wikipedia), why expanding accounts pays", url: "https://en.wikipedia.org/wiki/Customer_lifetime_value", kind: "Wiki" },
      { title: "Harvard Business Review: The Value of Keeping the Right Customers", url: "https://hbr.org/2014/10/the-value-of-keeping-the-right-customers", kind: "Article" },
      { title: "Account-based marketing (Wikipedia)", url: "https://en.wikipedia.org/wiki/Account-based_marketing", kind: "Wiki" },
      yt("land and expand strategy B2B"),
    ],
  },

  "biz-10": {
    basics: {
      en: "Stakeholder mapping means listing everyone who can affect your project or is affected by it, and deciding how to work with each one. A common tool is a grid of power (how much they can influence) against interest (how much they care).",
      bn: "Stakeholder mapping মানে আপনার প্রজেক্টকে যারা প্রভাবিত করতে পারেন বা প্রজেক্টের দ্বারা প্রভাবিত হন, তাদের তালিকা করা এবং প্রত্যেকের সাথে কীভাবে কাজ করবেন তা ঠিক করা। সাধারণ টুল হলো power (কতটা প্রভাব রাখেন) বনাম interest (কতটা আগ্রহী) ছক।",
    },
    ideas: {
      en: [
        "High power, high interest: manage closely (the sponsor, the decision maker).",
        "High power, low interest: keep satisfied with short updates.",
        "Low power, high interest: keep informed (end users, support staff).",
        "Stakeholders change during a project. Update the map regularly.",
      ],
      bn: [
        "বেশি power, বেশি interest: ঘনিষ্ঠভাবে সামলান (স্পন্সর, সিদ্ধান্তদাতা)।",
        "বেশি power, কম interest: সংক্ষিপ্ত আপডেট দিয়ে সন্তুষ্ট রাখুন।",
        "কম power, বেশি interest: জানিয়ে রাখুন (এন্ড ইউজার, সাপোর্ট স্টাফ)।",
        "প্রজেক্ট চলাকালে stakeholder বদলায়। ম্যাপ নিয়মিত হালনাগাদ করুন।",
      ],
    },
    tryIt: {
      en: "List eight stakeholders of your current project and place each on the power and interest grid.",
      bn: "আপনার বর্তমান প্রজেক্টের আটজন stakeholder লিখুন এবং প্রত্যেককে power-interest ছকে বসান।",
    },
    refs: [
      { title: "Stakeholder analysis (Wikipedia)", url: "https://en.wikipedia.org/wiki/Stakeholder_analysis", kind: "Wiki" },
      { title: "MindTools: Stakeholder Analysis", url: "https://www.mindtools.com/aol3jkd/stakeholder-analysis", kind: "Article" },
      { title: "ProjectManager: Stakeholder analysis 101", url: "https://www.projectmanager.com/blog/stakeholder-analysis", kind: "Article" },
      { title: "NN/g: Stakeholder Interviews 101", url: "https://www.nngroup.com/articles/stakeholder-interviews/", kind: "Article" },
      yt("stakeholder mapping power interest grid"),
    ],
  },

  "biz-11": {
    basics: {
      en: "A proposal explains what we will do and why we are the right team. A Statement of Work (SOW) is the contract-grade part: exact scope, deliverables, timeline, price, assumptions and what is not included. A clear SOW prevents arguments later.",
      bn: "Proposal বলে আমরা কী করব এবং কেন আমরাই সঠিক টিম। Statement of Work (SOW) হলো চুক্তি-মানের অংশ: নির্দিষ্ট scope, deliverable, সময়সূচি, মূল্য, assumption এবং কী অন্তর্ভুক্ত নয়। স্পষ্ট SOW পরে তর্ক এড়ায়।",
    },
    ideas: {
      en: [
        "Start with the client's problem in their words, then our approach.",
        "Write what is out of scope as clearly as what is in scope.",
        "List assumptions (for example 'client provides content by week 2') and risks.",
        "Give acceptance criteria so everyone knows when a deliverable is done.",
      ],
      bn: [
        "ক্লায়েন্টের সমস্যা তাদের ভাষায় দিয়ে শুরু করুন, তারপর আমাদের পদ্ধতি।",
        "কী scope-এর বাইরে তা scope-এর ভেতরের বিষয়ের মতোই স্পষ্ট লিখুন।",
        "Assumption (যেমন 'ক্লায়েন্ট ২য় সপ্তাহের মধ্যে কনটেন্ট দেবে') ও ঝুঁকি তালিকা করুন।",
        "Acceptance criteria দিন, যাতে সবাই জানে কখন কাজ সম্পন্ন।",
      ],
    },
    tryIt: {
      en: "Write a one-page mini SOW for a simple five-page website: scope, out of scope, three assumptions, timeline.",
      bn: "একটি সহজ পাঁচ পাতার ওয়েবসাইটের জন্য এক পাতার মিনি SOW লিখুন: scope, out of scope, তিনটি assumption, সময়সূচি।",
    },
    refs: [
      { title: "Statement of work (Wikipedia)", url: "https://en.wikipedia.org/wiki/Statement_of_work", kind: "Wiki" },
      { title: "ProjectManager: Statement of work template", url: "https://www.projectmanager.com/blog/statement-of-work", kind: "Article" },
      { title: "Scope in project management (Wikipedia)", url: "https://en.wikipedia.org/wiki/Scope_(project_management)", kind: "Wiki" },
      { title: "Asana: How to write a project proposal", url: "https://asana.com/resources/project-proposal", kind: "Article" },
      yt("how to write a statement of work SOW"),
    ],
  },
}
