import { GuideMap, yt } from "./types"

export const PRODUCT_GUIDES: GuideMap = {
  "prod-1": {
    basics: {
      en: "Product discovery is the work you do before building: finding out which problems are real, who has them, and whether your idea would help. The goal is to avoid spending months building something nobody wants.",
      bn: "Product discovery হলো বানানোর আগের কাজ: কোন সমস্যা সত্যিকারের, কার আছে, আর আপনার আইডিয়া কি সাহায্য করবে তা খুঁজে বের করা। লক্ষ্য হলো কেউ চায় না এমন জিনিস বানাতে মাসের পর মাস নষ্ট না করা।",
    },
    ideas: {
      en: [
        "Talk to real users early and often, ideally every week.",
        "Test the riskiest assumption first: value, usability, feasibility and viability.",
        "Fall in love with the problem, not your solution.",
        "Discovery and delivery run side by side; it is not a phase that ends.",
      ],
      bn: [
        "আসল ইউজারদের সাথে আগে ও ঘন ঘন কথা বলুন, সম্ভব হলে প্রতি সপ্তাহে।",
        "সবচেয়ে ঝুঁকিপূর্ণ assumption আগে পরীক্ষা করুন: value, usability, feasibility, viability।",
        "সমস্যার প্রেমে পড়ুন, সমাধানের নয়।",
        "Discovery ও delivery পাশাপাশি চলে; এটি এমন ধাপ নয় যা শেষ হয়ে যায়।",
      ],
    },
    tryIt: {
      en: "Write down one thing your team plans to build and list the three assumptions that must be true for it to succeed.",
      bn: "আপনার টিম যা বানাতে চায় তার একটি লিখুন এবং সফল হতে যে তিনটি assumption সত্য হতে হবে তা তালিকা করুন।",
    },
    refs: [
      { title: "Product Talk: What is continuous discovery", url: "https://www.producttalk.org/2021/05/continuous-discovery/", kind: "Article" },
      { title: "SVPG: Product Discovery", url: "https://www.svpg.com/product-discovery/", kind: "Article" },
      { title: "Product Talk: Product discovery basics", url: "https://www.producttalk.org/product-discovery/", kind: "Article" },
      { title: "Book: Inspired by Marty Cagan", url: "https://www.svpg.com/books/inspired-how-to-create-tech-products-customers-love-2nd-edition/", kind: "Book" },
      yt("product discovery explained for beginners"),
    ],
  },

  "prod-2": {
    basics: {
      en: "Jobs To Be Done (JTBD) says people don't buy products, they 'hire' them to make progress in a situation. Instead of 'women aged 25 to 34', you ask 'what job is the person trying to get done, and what is getting in the way?'.",
      bn: "Jobs To Be Done (JTBD) বলে, মানুষ প্রোডাক্ট কেনে না, কোনো পরিস্থিতিতে অগ্রগতি করতে প্রোডাক্টকে 'ভাড়া' করে। '২৫-৩৪ বছরের নারী' না বলে জিজ্ঞেস করুন, 'ব্যক্তিটি কোন কাজ সম্পন্ন করতে চাইছে আর কী বাধা দিচ্ছে?'",
    },
    ideas: {
      en: [
        "Job statement: When [situation], I want to [motivation], so I can [outcome].",
        "Competition is anything that gets the job done, even a notebook or a spreadsheet.",
        "Jobs have functional, emotional and social parts.",
        "Interview people about the moment they switched to a new solution.",
      ],
      bn: [
        "Job statement: যখন [পরিস্থিতি], আমি চাই [চাহিদা], যাতে [ফলাফল]।",
        "প্রতিযোগী হলো যা-ই কাজটি করে দেয়, এমনকি নোটবুক বা স্প্রেডশিটও।",
        "Job-এর functional, emotional ও social অংশ থাকে।",
        "নতুন সমাধানে সরে যাওয়ার মুহূর্ত নিয়ে মানুষের সাক্ষাৎকার নিন।",
      ],
    },
    tryIt: {
      en: "Write a job statement for why you opened a food delivery app last time, using the 'When... I want to... so I can...' format.",
      bn: "শেষবার কেন ফুড ডেলিভারি অ্যাপ খুলেছিলেন তার একটি job statement লিখুন, 'যখন... আমি চাই... যাতে...' ফরম্যাটে।",
    },
    refs: [
      { title: "Christensen Institute: Jobs to Be Done", url: "https://www.christenseninstitute.org/theory/jobs-to-be-done/", kind: "Article" },
      { title: "Harvard Business Review: Know Your Customers' Jobs to Be Done", url: "https://hbr.org/2016/09/know-your-customers-jobs-to-be-done", kind: "Article" },
      { title: "Strategyn: Jobs-to-be-Done Theory", url: "https://strategyn.com/jobs-to-be-done/", kind: "Article" },
      { title: "Clayton Christensen (Wikipedia), originator of the theory", url: "https://en.wikipedia.org/wiki/Clayton_Christensen", kind: "Wiki" },
      yt("Jobs To Be Done framework explained"),
    ],
  },

  "prod-3": {
    basics: {
      en: "Lean Startup is a way of building under uncertainty: make a small version (MVP), put it in front of real users, measure what happens, and learn before investing more. An MVP is the smallest thing that can test your riskiest assumption, not a poor-quality product.",
      bn: "Lean Startup হলো অনিশ্চয়তার মধ্যে বানানোর একটি পদ্ধতি: ছোট সংস্করণ (MVP) বানান, আসল ইউজারদের সামনে দিন, ফল মাপুন এবং আরও বিনিয়োগের আগে শিখুন। MVP মানে আপনার সবচেয়ে ঝুঁকিপূর্ণ assumption পরীক্ষা করার সবচেয়ে ছোট জিনিস, নিম্নমানের প্রোডাক্ট নয়।",
    },
    ideas: {
      en: [
        "Build, Measure, Learn loop: make the loop as fast as possible.",
        "An MVP can be a landing page, a manual service or a clickable prototype.",
        "Define what result would prove you wrong before you start.",
        "Pivot (change direction) or persevere based on evidence, not feelings.",
      ],
      bn: [
        "Build, Measure, Learn চক্র: চক্রটি যতটা সম্ভব দ্রুত করুন।",
        "MVP হতে পারে ল্যান্ডিং পেজ, ম্যানুয়াল সেবা বা ক্লিকযোগ্য প্রোটোটাইপ।",
        "শুরুর আগে ঠিক করুন কোন ফল আপনাকে ভুল প্রমাণ করবে।",
        "প্রমাণের ভিত্তিতে pivot (দিক বদল) বা persevere (চালিয়ে যাওয়া) ঠিক করুন, অনুভূতিতে নয়।",
      ],
    },
    tryIt: {
      en: "Think of an app idea and design an MVP that takes under one day to build. What single number will tell you if it worked?",
      bn: "একটি অ্যাপ আইডিয়া ভাবুন এবং এক দিনের কম সময়ে বানানো যায় এমন MVP ডিজাইন করুন। কোন একটি সংখ্যা বলে দেবে এটি কাজ করেছে কি না?",
    },
    refs: [
      { title: "The Lean Startup: Methodology", url: "https://theleanstartup.com/principles", kind: "Article" },
      { title: "Minimum viable product (Wikipedia)", url: "https://en.wikipedia.org/wiki/Minimum_viable_product", kind: "Wiki" },
      { title: "Lean startup (Wikipedia)", url: "https://en.wikipedia.org/wiki/Lean_startup", kind: "Wiki" },
      { title: "Atlassian: Minimum viable product", url: "https://www.atlassian.com/agile/product-management/minimum-viable-product", kind: "Article" },
      yt("Lean Startup MVP build measure learn"),
    ],
  },

  "prod-4": {
    basics: {
      en: "An opportunity solution tree is a diagram that links one desired outcome to the customer opportunities (needs, pains) that could achieve it, then to solution ideas, then to small tests. It stops teams from jumping straight to a solution.",
      bn: "Opportunity solution tree হলো একটি ডায়াগ্রাম যা একটি কাঙ্ক্ষিত outcome-কে সেই লক্ষ্যে পৌঁছানোর কাস্টমার opportunity (চাহিদা, সমস্যা), তারপর সমাধানের আইডিয়া এবং তারপর ছোট পরীক্ষার সাথে যুক্ত করে। এটি টিমকে সরাসরি সমাধানে লাফ দেওয়া থেকে আটকায়।",
    },
    ideas: {
      en: [
        "Top: one outcome the business wants (for example more repeat purchases).",
        "Next level: opportunities found through customer interviews.",
        "Then compare several solutions per opportunity, not just one.",
        "Bottom: cheap experiments to test assumptions before building.",
      ],
      bn: [
        "ওপরে: ব্যবসা যে একটি outcome চায় (যেমন বেশি রিপিট ক্রয়)।",
        "পরের স্তর: কাস্টমার ইন্টারভিউ থেকে পাওয়া opportunity।",
        "তারপর প্রতিটি opportunity-র জন্য একাধিক সমাধান তুলনা করুন, শুধু একটি নয়।",
        "নিচে: বানানোর আগে assumption যাচাইয়ের সস্তা এক্সপেরিমেন্ট।",
      ],
    },
    tryIt: {
      en: "Draw a small tree on paper: one outcome, three opportunities, two solutions for one opportunity.",
      bn: "কাগজে ছোট একটি tree আঁকুন: একটি outcome, তিনটি opportunity, একটি opportunity-র জন্য দুটি সমাধান।",
    },
    refs: [
      { title: "Product Talk: Opportunity Solution Trees", url: "https://www.producttalk.org/opportunity-solution-tree/", kind: "Article" },
      { title: "Product Talk: Continuous discovery habits", url: "https://www.producttalk.org/continuous-discovery-habits/", kind: "Book" },
      { title: "Product Talk: Why you need an OST", url: "https://www.producttalk.org/2016/08/opportunity-solution-tree/", kind: "Article" },
      { title: "Teresa Torres: Customer interviews", url: "https://www.producttalk.org/2022/01/customer-interviews/", kind: "Article" },
      yt("Teresa Torres opportunity solution tree"),
    ],
  },

  "prod-5": {
    basics: {
      en: "You can never build everything, so you need a fair way to choose. RICE scores each idea by Reach, Impact, Confidence and Effort. MoSCoW sorts items into Must, Should, Could and Won't. The Kano model separates basics people expect from features that delight.",
      bn: "সবকিছু বানানো সম্ভব নয়, তাই বাছাইয়ের একটি ন্যায্য উপায় দরকার। RICE প্রতিটি আইডিয়াকে Reach, Impact, Confidence ও Effort দিয়ে স্কোর করে। MoSCoW কাজগুলোকে Must, Should, Could ও Won't-এ ভাগ করে। Kano মডেল আলাদা করে মানুষ যা আশা করে (basics) আর যা মুগ্ধ করে (delighters)।",
    },
    ideas: {
      en: [
        "RICE score = (Reach × Impact × Confidence) ÷ Effort.",
        "MoSCoW is quick for scope negotiations: fix the Musts, flex the rest.",
        "Kano: missing basics cause anger; adding delighters causes joy.",
        "A framework supports the discussion. It does not replace judgement.",
      ],
      bn: [
        "RICE স্কোর = (Reach × Impact × Confidence) ÷ Effort।",
        "MoSCoW scope আলোচনায় দ্রুত কাজে লাগে: Must ঠিক রাখুন, বাকিগুলো নমনীয়।",
        "Kano: basics না থাকলে রাগ, delighter যোগ করলে আনন্দ।",
        "ফ্রেমওয়ার্ক আলোচনায় সাহায্য করে, বিচার-বুদ্ধির বিকল্প নয়।",
      ],
    },
    tryIt: {
      en: "List five feature ideas for a to-do app and score them with RICE in a spreadsheet. Does the top result feel right?",
      bn: "একটি to-do অ্যাপের জন্য পাঁচটি ফিচার আইডিয়া লিখে স্প্রেডশিটে RICE দিয়ে স্কোর করুন। সেরা ফলাফলটি কি ঠিক মনে হচ্ছে?",
    },
    refs: [
      { title: "Intercom: RICE prioritization", url: "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/", kind: "Article" },
      { title: "MoSCoW method (Wikipedia)", url: "https://en.wikipedia.org/wiki/MoSCoW_method", kind: "Wiki" },
      { title: "Kano model (Wikipedia)", url: "https://en.wikipedia.org/wiki/Kano_model", kind: "Wiki" },
      { title: "Atlassian: Prioritization frameworks", url: "https://www.atlassian.com/agile/product-management/prioritization-framework", kind: "Article" },
      yt("RICE MoSCoW Kano prioritization frameworks"),
    ],
  },

  "prod-6": {
    basics: {
      en: "Product metrics tell you whether people actually use and value the product. Activation measures if new users reach their first success. Retention measures if they come back. A North Star metric is the one number that best captures the value users get.",
      bn: "Product metrics বলে মানুষ সত্যিই প্রোডাক্ট ব্যবহার করছে ও মূল্য পাচ্ছে কি না। Activation মাপে নতুন ইউজার প্রথম সাফল্যে পৌঁছাল কি না। Retention মাপে তারা ফিরে আসছে কি না। North Star metric হলো সেই একটি সংখ্যা যা ইউজারের পাওয়া মূল্যকে সবচেয়ে ভালো ধরে।",
    },
    ideas: {
      en: [
        "AARRR (pirate metrics): Acquisition, Activation, Retention, Referral, Revenue.",
        "Good North Star examples: 'nights booked' for Airbnb, 'time spent listening' for Spotify.",
        "Retention matters most. A leaky bucket cannot be fixed by pouring more water.",
        "Separate vanity metrics (total sign-ups) from actionable ones (week-4 retention).",
      ],
      bn: [
        "AARRR (pirate metrics): Acquisition, Activation, Retention, Referral, Revenue।",
        "ভালো North Star উদাহরণ: Airbnb-এর 'বুক করা রাত', Spotify-র 'শোনার সময়'।",
        "Retention সবচেয়ে গুরুত্বপূর্ণ। ফুটো বালতিতে বেশি পানি ঢেলে লাভ নেই।",
        "Vanity metric (মোট সাইন-আপ) আর actionable metric (৪র্থ সপ্তাহের retention) আলাদা রাখুন।",
      ],
    },
    tryIt: {
      en: "Pick an app you use. Guess its North Star metric and one activation event for a new user.",
      bn: "আপনার ব্যবহৃত একটি অ্যাপ বেছে নিন। তার North Star metric এবং নতুন ইউজারের একটি activation event অনুমান করুন।",
    },
    refs: [
      { title: "Amplitude: North Star Playbook", url: "https://amplitude.com/books/north-star", kind: "Book" },
      { title: "Lenny's Newsletter: What is good retention?", url: "https://www.lennysnewsletter.com/p/what-is-good-retention-issue-29", kind: "Article" },
      { title: "Amplitude: User retention guide", url: "https://amplitude.com/blog/user-retention", kind: "Article" },
      { title: "Mixpanel: Product metrics guide", url: "https://mixpanel.com/blog/product-metrics/", kind: "Article" },
      yt("North Star metric activation retention explained"),
    ],
  },

  "prod-7": {
    basics: {
      en: "A Product Requirements Document (PRD) explains what we are building, for whom, and why, clearly enough that designers, engineers and AI agents can act on it without guessing. Good PRDs are short, specific and testable.",
      bn: "Product Requirements Document (PRD) ব্যাখ্যা করে আমরা কী বানাচ্ছি, কার জন্য এবং কেন, এতটা স্পষ্টভাবে যে ডিজাইনার, ইঞ্জিনিয়ার ও AI এজেন্ট অনুমান ছাড়াই কাজ করতে পারে। ভালো PRD ছোট, নির্দিষ্ট ও পরীক্ষাযোগ্য।",
    },
    ideas: {
      en: [
        "Cover: problem, goals and non-goals, users, requirements, success metrics, open questions.",
        "Write requirements as testable statements ('Given... When... Then...').",
        "Non-goals prevent scope creep as much as goals set direction.",
        "Keep it a living document; record decisions and why they were made.",
      ],
      bn: [
        "অন্তর্ভুক্ত করুন: সমস্যা, লক্ষ্য ও non-goals, ইউজার, requirements, সাফল্যের মাপকাঠি, খোলা প্রশ্ন।",
        "Requirements লিখুন পরীক্ষাযোগ্য বাক্যে ('Given... When... Then...')।",
        "লক্ষ্য যেমন দিক ঠিক করে, non-goals তেমন scope creep আটকায়।",
        "ডকুমেন্টটি জীবন্ত রাখুন; সিদ্ধান্ত ও কারণ লিখে রাখুন।",
      ],
    },
    tryIt: {
      en: "Write a half-page PRD for a 'forgot password' feature including two non-goals and three acceptance criteria.",
      bn: "'পাসওয়ার্ড ভুলে গেছি' ফিচারের জন্য অর্ধ পাতার PRD লিখুন, দুটি non-goal ও তিনটি acceptance criteria সহ।",
    },
    refs: [
      { title: "Atlassian: How to write a PRD", url: "https://www.atlassian.com/agile/product-management/requirements", kind: "Article" },
      { title: "Product requirements document (Wikipedia)", url: "https://en.wikipedia.org/wiki/Product_requirements_document", kind: "Wiki" },
      { title: "Lenny's Newsletter: How to write a great PRD", url: "https://www.lennysnewsletter.com/p/prds-1-pagers-examples", kind: "Article" },
      { title: "Aha!: What is a PRD", url: "https://www.aha.io/roadmapping/guide/requirements-management/what-is-a-good-product-requirements-document-template", kind: "Article" },
      yt("how to write a PRD product requirements document"),
    ],
  },

  "prod-8": {
    basics: {
      en: "A roadmap communicates where the product is heading and why. A Now-Next-Later roadmap groups work by how certain and close it is, instead of promising exact dates. It keeps stakeholders aligned without turning guesses into commitments.",
      bn: "Roadmap জানায় প্রোডাক্ট কোন দিকে যাচ্ছে এবং কেন। Now-Next-Later roadmap নির্দিষ্ট তারিখের প্রতিশ্রুতির বদলে কাজকে কতটা নিশ্চিত ও কাছের তার ভিত্তিতে ভাগ করে। এতে অনুমান প্রতিশ্রুতিতে পরিণত না হয়ে stakeholder-রা একমত থাকে।",
    },
    ideas: {
      en: [
        "Now: being worked on, high confidence. Next: planned, medium. Later: ideas, low.",
        "Organise by outcomes and problems, not by a feature list.",
        "Different audiences (leadership, team, clients) need different views.",
        "Review often. A roadmap that never changes is probably ignoring learning.",
      ],
      bn: [
        "Now: চলছে, উচ্চ নিশ্চয়তা। Next: পরিকল্পিত, মাঝারি। Later: আইডিয়া, কম নিশ্চয়তা।",
        "ফিচার তালিকার বদলে outcome ও সমস্যা অনুযায়ী সাজান।",
        "ভিন্ন শ্রোতার (নেতৃত্ব, টিম, ক্লায়েন্ট) জন্য ভিন্ন ভিউ দরকার।",
        "ঘন ঘন পর্যালোচনা করুন। যে roadmap কখনো বদলায় না, সে সম্ভবত শেখাকে উপেক্ষা করছে।",
      ],
    },
    tryIt: {
      en: "Take your team's backlog and sort ten items into Now, Next and Later columns, writing the outcome each one serves.",
      bn: "আপনার টিমের backlog থেকে দশটি আইটেম Now, Next ও Later কলামে ভাগ করুন এবং প্রতিটি কোন outcome-এর জন্য তা লিখুন।",
    },
    refs: [
      { title: "ProdPad: Now-Next-Later roadmap", url: "https://www.prodpad.com/blog/invented-now-next-later-roadmap/", kind: "Article" },
      { title: "Atlassian: Product roadmaps", url: "https://www.atlassian.com/agile/product-management/product-roadmaps", kind: "Article" },
      { title: "Roman Pichler: Goal-oriented roadmap", url: "https://www.romanpichler.com/blog/the-go-product-roadmap/", kind: "Article" },
      { title: "Product Plan: Roadmap guide", url: "https://www.productplan.com/learn/what-is-a-product-roadmap/", kind: "Article" },
      yt("now next later product roadmap"),
    ],
  },

  "prod-9": {
    basics: {
      en: "An experiment is a planned test of an idea with real users. In an A/B test, half see version A and half see version B and you compare results. A fake-door test shows a button for a feature that does not exist yet and counts clicks, to measure interest cheaply.",
      bn: "Experiment হলো আসল ইউজারদের সাথে একটি আইডিয়ার পরিকল্পিত পরীক্ষা। A/B টেস্টে অর্ধেক ইউজার ভার্সন A, বাকিরা ভার্সন B দেখে এবং ফল তুলনা করা হয়। Fake-door টেস্টে এখনো না-থাকা ফিচারের বাটন দেখিয়ে ক্লিক গোনা হয়, সস্তায় আগ্রহ মাপতে।",
    },
    ideas: {
      en: [
        "Write a hypothesis first: 'If we do X, then Y will change by Z because...'.",
        "Choose one primary metric before the test starts.",
        "Run it long enough and with enough users; do not stop when the numbers look good.",
        "A failed experiment that taught you something is a success.",
      ],
      bn: [
        "আগে hypothesis লিখুন: 'আমরা X করলে Y, Z পরিমাণ বদলাবে, কারণ...'।",
        "টেস্ট শুরুর আগেই একটি প্রধান metric ঠিক করুন।",
        "যথেষ্ট সময় ও যথেষ্ট ইউজার নিয়ে চালান; সংখ্যা ভালো দেখালেই থামাবেন না।",
        "যে ব্যর্থ এক্সপেরিমেন্ট কিছু শিখিয়েছে, সেটিও সাফল্য।",
      ],
    },
    tryIt: {
      en: "Write one proper hypothesis for changing a sign-up button's text, including the metric and how long you would run it.",
      bn: "একটি সাইন-আপ বাটনের লেখা বদলানোর জন্য সঠিক hypothesis লিখুন, metric এবং কতদিন চালাবেন তা সহ।",
    },
    refs: [
      { title: "Optimizely: What is A/B testing", url: "https://www.optimizely.com/optimization-glossary/ab-testing/", kind: "Article" },
      { title: "A/B testing (Wikipedia)", url: "https://en.wikipedia.org/wiki/A/B_testing", kind: "Wiki" },
      { title: "Evan Miller: A/B test sample size calculator", url: "https://www.evanmiller.org/ab-testing/sample-size.html", kind: "Tool" },
      { title: "Harvard Business Review: A Refresher on A/B Testing", url: "https://hbr.org/2017/06/a-refresher-on-ab-testing", kind: "Article" },
      yt("A/B testing and fake door test explained"),
    ],
  },

  "prod-10": {
    basics: {
      en: "Product-led growth (PLG) means the product itself drives sign-ups, adoption and upgrades. Users can try it on their own, reach value fast, and later pay. Examples are Slack, Figma and Dropbox. Sales then supports the users who already love it.",
      bn: "Product-led growth (PLG) মানে প্রোডাক্ট নিজেই সাইন-আপ, ব্যবহার ও আপগ্রেড চালায়। ইউজার নিজে ট্রাই করে, দ্রুত মূল্য পায় এবং পরে টাকা দেয়। উদাহরণ Slack, Figma, Dropbox। সেলস তখন যারা প্রোডাক্ট ভালোবেসে ফেলেছে তাদের সাহায্য করে।",
    },
    ideas: {
      en: [
        "Free trial or freemium lets people experience value before paying.",
        "Shorten time-to-value: the quicker a new user succeeds, the more likely they stay.",
        "Built-in sharing and collaboration bring in new users (virality).",
        "Track product-qualified leads: users whose behaviour shows they are ready to buy.",
      ],
      bn: [
        "Free trial বা freemium পেমেন্টের আগেই মূল্য অনুভব করতে দেয়।",
        "Time-to-value কমান: নতুন ইউজার যত দ্রুত সফল হয়, তত বেশি থেকে যায়।",
        "ভেতরের শেয়ারিং ও কোলাবরেশন নতুন ইউজার আনে (virality)।",
        "Product-qualified lead দেখুন: যাদের আচরণ বলছে তারা কিনতে প্রস্তুত।",
      ],
    },
    tryIt: {
      en: "Sign up for a PLG product like Notion or Figma and write down each step until you got your first 'aha' moment.",
      bn: "Notion বা Figma-র মতো একটি PLG প্রোডাক্টে সাইন-আপ করুন এবং প্রথম 'aha' মুহূর্ত পর্যন্ত প্রতিটি ধাপ লিখুন।",
    },
    refs: [
      { title: "Freemium (Wikipedia)", url: "https://en.wikipedia.org/wiki/Freemium", kind: "Wiki" },
      { title: "Viral marketing (Wikipedia)", url: "https://en.wikipedia.org/wiki/Viral_marketing", kind: "Wiki" },
      { title: "Reforge: Product-led growth", url: "https://www.reforge.com/blog/product-led-growth", kind: "Article" },
      { title: "Stripe: SaaS pricing models (free trials and freemium)", url: "https://stripe.com/resources/more/saas-pricing-models-101", kind: "Article" },
      yt("product-led growth explained"),
    ],
  },
}
