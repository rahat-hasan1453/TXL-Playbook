import { GuideMap, yt } from "./types"

export const SECURITY_GUIDES: GuideMap = {
  "sec-1": {
    basics: {
      en: "Data protection laws say how organisations may collect and use personal data. GDPR (EU) and the Swiss nFADP are the main ones for our clients; Bangladesh and other countries have their own rules. Common principles: lawful reason, purpose limitation, data minimisation, security, and rights for people (access, correction, deletion).",
      bn: "Data protection আইন বলে প্রতিষ্ঠান কীভাবে ব্যক্তিগত তথ্য সংগ্রহ ও ব্যবহার করতে পারে। আমাদের ক্লায়েন্টদের জন্য প্রধান আইন GDPR (EU) ও সুইস nFADP; বাংলাদেশ ও অন্য দেশের নিজস্ব নিয়ম আছে। সাধারণ নীতি: বৈধ কারণ, উদ্দেশ্য সীমাবদ্ধতা, ডেটা ন্যূনতম রাখা, নিরাপত্তা, এবং মানুষের অধিকার (দেখা, সংশোধন, মুছে ফেলা)।",
    },
    ideas: {
      en: [
        "Personal data is anything that identifies a person, including email, IP address and device IDs.",
        "Collect only what you need and keep it only as long as you need it.",
        "Tell people clearly what you do with their data (privacy notice).",
        "Report serious breaches quickly; GDPR requires notice within 72 hours.",
      ],
      bn: [
        "ব্যক্তিগত তথ্য মানে যা কোনো ব্যক্তিকে শনাক্ত করে, ইমেইল, IP ও ডিভাইস ID সহ।",
        "যতটুকু দরকার ততটুকু সংগ্রহ করুন এবং যতদিন দরকার ততদিনই রাখুন।",
        "তাদের ডেটা নিয়ে আপনি কী করেন তা স্পষ্ট জানান (privacy notice)।",
        "গুরুতর ফাঁস দ্রুত জানান; GDPR ৭২ ঘণ্টার মধ্যে নোটিশ চায়।",
      ],
    },
    tryIt: {
      en: "List every piece of personal data our learning portal stores about a user. Is each one necessary?",
      bn: "আমাদের লার্নিং পোর্টাল একজন ইউজারের সম্পর্কে যত ব্যক্তিগত তথ্য রাখে তার তালিকা করুন। প্রতিটি কি সত্যিই দরকারি?",
    },
    refs: [
      { title: "GDPR.eu: Complete guide to GDPR compliance", url: "https://gdpr.eu/", kind: "Article" },
      { title: "European Commission: Data protection", url: "https://commission.europa.eu/law/law-topic/data-protection_en", kind: "Docs" },
      { title: "Swiss FDPIC: Data protection (nFADP)", url: "https://www.edoeb.admin.ch/en/data-protection", kind: "Docs" },
      { title: "General Data Protection Regulation (Wikipedia)", url: "https://en.wikipedia.org/wiki/General_Data_Protection_Regulation", kind: "Wiki" },
      yt("GDPR explained for beginners"),
    ],
  },

  "sec-2": {
    basics: {
      en: "A Data Processing Agreement (DPA) is a contract between a company that owns personal data (the controller) and a company that handles it for them (the processor, often us). It sets what we may do with the data, how we protect it, who our sub-processors are, and what happens if something goes wrong.",
      bn: "Data Processing Agreement (DPA) হলো ব্যক্তিগত তথ্যের মালিক প্রতিষ্ঠান (controller) এবং যে প্রতিষ্ঠান তাদের হয়ে তা সামলায় (processor, প্রায়ই আমরা) তাদের মধ্যে চুক্তি। এতে নির্ধারিত থাকে আমরা ডেটা দিয়ে কী করতে পারি, কীভাবে রক্ষা করব, আমাদের sub-processor কারা, এবং কিছু ভুল হলে কী হবে।",
    },
    ideas: {
      en: [
        "Controller decides why and how data is used; processor acts on its instructions.",
        "Key clauses: subject matter, duration, security measures, sub-processors, breach notice, deletion or return of data.",
        "Using a cloud or AI vendor often makes them our sub-processor, so check their DPA too.",
        "Ask legal to review before signing; do not improvise.",
      ],
      bn: [
        "Controller ঠিক করে ডেটা কেন ও কীভাবে ব্যবহৃত হবে; processor তার নির্দেশে কাজ করে।",
        "মূল ধারা: বিষয়বস্তু, মেয়াদ, নিরাপত্তা ব্যবস্থা, sub-processor, ফাঁসের নোটিশ, ডেটা মুছে ফেলা বা ফেরত।",
        "ক্লাউড বা AI ভেন্ডর ব্যবহার করলে তারা প্রায়ই আমাদের sub-processor হয়, তাই তাদের DPA-ও দেখুন।",
        "সই করার আগে লিগ্যালের পর্যালোচনা নিন; আন্দাজে করবেন না।",
      ],
    },
    tryIt: {
      en: "Find the DPA page of one vendor we use (for example Vercel or Slack) and list their sub-processors and breach notice time.",
      bn: "আমরা ব্যবহার করি এমন একটি ভেন্ডরের (যেমন Vercel বা Slack) DPA পেজ খুঁজে তাদের sub-processor ও ফাঁসের নোটিশ সময় তালিকা করুন।",
    },
    refs: [
      { title: "GDPR Article 28 (processor)", url: "https://gdpr-info.eu/art-28-gdpr/", kind: "Docs" },
      { title: "EDPB: Controllers and processors guidelines", url: "https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-072020-concepts-controller-and-processor-gdpr_en", kind: "Docs" },
      { title: "ICO: Contracts and liabilities between controllers and processors", url: "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/contracts-and-liabilities-between-controllers-and-processors-multi/", kind: "Docs" },
      { title: "GDPR.eu: Data Processing Agreement template", url: "https://gdpr.eu/data-processing-agreement/", kind: "Article" },
      yt("data processing agreement DPA explained"),
    ],
  },

  "sec-3": {
    basics: {
      en: "The OWASP Top 10 is a list of the most common and serious web application security risks, such as broken access control, injection and security misconfiguration. Knowing it helps you avoid the mistakes behind most real-world breaches.",
      bn: "OWASP Top 10 হলো ওয়েব অ্যাপ্লিকেশনের সবচেয়ে সাধারণ ও গুরুতর নিরাপত্তা ঝুঁকির তালিকা, যেমন broken access control, injection ও security misconfiguration। এটি জানলে বাস্তব ফাঁসের পেছনের বেশিরভাগ ভুল এড়ানো যায়।",
    },
    ideas: {
      en: [
        "Broken access control: always check on the server that the user may see or change this record.",
        "Injection: never build SQL or commands by joining strings; use parameters.",
        "Never trust input from users, URLs, headers or other systems; validate it.",
        "Keep dependencies updated and turn off debug features in production.",
      ],
      bn: [
        "Broken access control: সার্ভারে সবসময় যাচাই করুন ইউজার এই রেকর্ড দেখতে বা বদলাতে পারেন কি না।",
        "Injection: স্ট্রিং জোড়া দিয়ে SQL বা কমান্ড বানাবেন না; প্যারামিটার ব্যবহার করুন।",
        "ইউজার, URL, হেডার বা অন্য সিস্টেমের ইনপুট বিশ্বাস করবেন না; যাচাই করুন।",
        "ডিপেন্ডেন্সি হালনাগাদ রাখুন এবং প্রোডাকশনে ডিবাগ ফিচার বন্ধ করুন।",
      ],
    },
    tryIt: {
      en: "Play with OWASP Juice Shop (a deliberately insecure app) or read the Top 10 list and find one risk in a project you know.",
      bn: "OWASP Juice Shop (ইচ্ছা করে অনিরাপদ অ্যাপ) নিয়ে খেলুন বা Top 10 তালিকা পড়ে আপনার চেনা কোনো প্রজেক্টে একটি ঝুঁকি খুঁজুন।",
    },
    refs: [
      { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", kind: "Docs" },
      { title: "OWASP Cheat Sheet Series", url: "https://cheatsheetseries.owasp.org/", kind: "Docs" },
      { title: "OWASP Juice Shop", url: "https://owasp.org/www-project-juice-shop/", kind: "Tool" },
      { title: "PortSwigger Web Security Academy (free)", url: "https://portswigger.net/web-security", kind: "Course" },
      yt("OWASP Top 10 explained"),
    ],
  },

  "sec-4": {
    basics: {
      en: "Secrets are passwords, API keys, tokens and certificates. If they leak, attackers can act as us. They must never be written in code, chat messages or committed to Git. Keep them in a secret manager or environment variables and give each one the least access needed.",
      bn: "Secret হলো পাসওয়ার্ড, API কী, টোকেন ও সার্টিফিকেট। ফাঁস হলে আক্রমণকারী আমাদের হয়ে কাজ করতে পারে। এগুলো কখনো কোডে, চ্যাট মেসেজে লেখা বা Git-এ commit করা যাবে না। সিক্রেট ম্যানেজার বা environment variable-এ রাখুন এবং প্রতিটিকে ন্যূনতম প্রয়োজনীয় অ্যাক্সেস দিন।",
    },
    ideas: {
      en: [
        "Add .env files to .gitignore and keep an .env.example without real values.",
        "If a secret is committed, rotate it immediately; deleting the commit is not enough.",
        "Use different secrets for development, staging and production.",
        "Rotate regularly and log who accessed what.",
      ],
      bn: [
        ".env ফাইল .gitignore-এ রাখুন এবং আসল মান ছাড়া .env.example রাখুন।",
        "কোনো secret commit হয়ে গেলে সঙ্গে সঙ্গে বদলান (rotate); commit মুছে দেওয়া যথেষ্ট নয়।",
        "ডেভেলপমেন্ট, স্টেজিং ও প্রোডাকশনে আলাদা secret ব্যবহার করুন।",
        "নিয়মিত rotate করুন এবং কে কী অ্যাক্সেস করেছে লগ রাখুন।",
      ],
    },
    tryIt: {
      en: "Check that your project's .gitignore excludes .env files, then run a secret scanner such as gitleaks on the repository.",
      bn: "আপনার প্রজেক্টের .gitignore-এ .env ফাইল বাদ আছে কি না দেখুন, তারপর রিপোজিটরিতে gitleaks-এর মতো secret scanner চালান।",
    },
    refs: [
      { title: "OWASP Secrets Management Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html", kind: "Docs" },
      { title: "GitHub Docs: Secret scanning", url: "https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning", kind: "Docs" },
      { title: "Gitleaks", url: "https://github.com/gitleaks/gitleaks", kind: "Tool" },
      { title: "The Twelve-Factor App: Config", url: "https://12factor.net/config", kind: "Article" },
      yt("secrets management API keys best practices"),
    ],
  },

  "sec-5": {
    basics: {
      en: "ITIL is a framework of good practice for running IT services. An SLA (Service Level Agreement) is the promise to the customer: for example 99.9% uptime and a first response within 1 hour for a critical incident. Incident management is the process of restoring service quickly when something breaks.",
      bn: "ITIL হলো IT সেবা পরিচালনার ভালো চর্চার কাঠামো। SLA (Service Level Agreement) হলো কাস্টমারের প্রতি প্রতিশ্রুতি: যেমন ৯৯.৯% আপটাইম এবং গুরুতর ঘটনায় ১ ঘণ্টার মধ্যে প্রথম সাড়া। Incident management হলো কিছু ভেঙে গেলে দ্রুত সেবা ফিরিয়ে আনার প্রক্রিয়া।",
    },
    ideas: {
      en: [
        "Classify incidents by priority (P1 critical to P4 low) with matching response and fix targets.",
        "SLA numbers: uptime, response time, resolution time. 99.9% uptime allows about 43 minutes down per month.",
        "Communicate early and often during an incident, even if you don't have the answer yet.",
        "After a major incident, write a blameless post-mortem and fix the root cause.",
      ],
      bn: [
        "ঘটনা অগ্রাধিকার অনুযায়ী ভাগ করুন (P1 গুরুতর থেকে P4 কম) এবং মানানসই সাড়া ও সমাধানের লক্ষ্য রাখুন।",
        "SLA সংখ্যা: আপটাইম, সাড়ার সময়, সমাধানের সময়। ৯৯.৯% আপটাইমে মাসে প্রায় ৪৩ মিনিট বন্ধ থাকা চলে।",
        "ঘটনার সময় আগে ও ঘন ঘন জানান, উত্তর না থাকলেও।",
        "বড় ঘটনার পর দোষারোপহীন post-mortem লিখুন এবং মূল কারণ ঠিক করুন।",
      ],
    },
    tryIt: {
      en: "Calculate how many minutes per month 99.5%, 99.9% and 99.99% uptime allow. Which would you promise a client and why?",
      bn: "৯৯.৫%, ৯৯.৯% ও ৯৯.৯৯% আপটাইমে মাসে কত মিনিট বন্ধ থাকা চলে হিসাব করুন। ক্লায়েন্টকে কোনটির প্রতিশ্রুতি দেবেন ও কেন?",
    },
    refs: [
      { title: "Atlassian: Incident management", url: "https://www.atlassian.com/incident-management", kind: "Article" },
      { title: "Google SRE Book: Service Level Objectives", url: "https://sre.google/sre-book/service-level-objectives/", kind: "Book" },
      { title: "ITIL (Wikipedia)", url: "https://en.wikipedia.org/wiki/ITIL", kind: "Wiki" },
      { title: "Atlassian: What is an SLA", url: "https://www.atlassian.com/itsm/service-request-management/slas", kind: "Article" },
      yt("ITIL SLA incident management basics"),
    ],
  },

  "sec-6": {
    basics: {
      en: "Fonts, icons, photos, code libraries and AI-generated media all come with licences that say what you may do with them. Using them wrongly, for example a free-for-personal-use font in a client's commercial site, can lead to legal claims against us and the client.",
      bn: "ফন্ট, আইকন, ছবি, কোড লাইব্রেরি ও AI-তৈরি মিডিয়া সবকিছুর সাথে লাইসেন্স থাকে যা বলে আপনি তা দিয়ে কী করতে পারবেন। ভুলভাবে ব্যবহার করলে, যেমন শুধু ব্যক্তিগত ব্যবহারের ফ্রি ফন্ট ক্লায়েন্টের বাণিজ্যিক সাইটে, আমাদের ও ক্লায়েন্টের বিরুদ্ধে আইনি দাবি হতে পারে।",
    },
    ideas: {
      en: [
        "Check the licence before use: commercial use, modification, attribution, redistribution.",
        "Open-source licences differ: MIT and Apache are permissive; GPL requires sharing derived code.",
        "Keep a list of third-party assets and their licences for every project.",
        "For AI media, read the tool's terms about commercial use and ownership.",
      ],
      bn: [
        "ব্যবহারের আগে লাইসেন্স দেখুন: বাণিজ্যিক ব্যবহার, পরিবর্তন, কৃতিত্ব দেওয়া, পুনর্বিতরণ।",
        "ওপেন-সোর্স লাইসেন্স আলাদা: MIT ও Apache উদার; GPL-এ derived কোড শেয়ার করতে হয়।",
        "প্রতিটি প্রজেক্টের জন্য থার্ড-পার্টি অ্যাসেট ও তাদের লাইসেন্সের তালিকা রাখুন।",
        "AI মিডিয়ার জন্য বাণিজ্যিক ব্যবহার ও মালিকানা নিয়ে টুলের শর্ত পড়ুন।",
      ],
    },
    tryIt: {
      en: "Pick a font you like from Google Fonts or elsewhere and find its licence. May you use it on a paid client website?",
      bn: "Google Fonts বা অন্য কোথাও থেকে পছন্দের একটি ফন্ট বেছে নিয়ে তার লাইসেন্স খুঁজুন। টাকা-পাওয়া ক্লায়েন্ট সাইটে এটি ব্যবহার করা যাবে কি?",
    },
    refs: [
      { title: "Choose a License (open source)", url: "https://choosealicense.com/", kind: "Docs" },
      { title: "Creative Commons: About the licenses", url: "https://creativecommons.org/share-your-work/cclicenses/", kind: "Docs" },
      { title: "Google Fonts FAQ: Licensing", url: "https://developers.google.com/fonts/faq#can_i_use_any_font_for_a_commercial_product", kind: "Docs" },
      { title: "SPDX License List", url: "https://spdx.org/licenses/", kind: "Docs" },
      yt("software and font licensing explained commercial use"),
    ],
  },
}

export const CONSULTING_GUIDES: GuideMap = {
  "cons-1": {
    basics: {
      en: "Workshop facilitation is running a group session so that people leave with decisions, not just talk. The facilitator prepares a clear goal and agenda, keeps time, makes sure everyone contributes, and turns discussion into agreed next steps.",
      bn: "Workshop facilitation হলো গ্রুপ সেশন এমনভাবে চালানো যাতে মানুষ শুধু আলোচনা নয়, সিদ্ধান্ত নিয়ে ফেরে। Facilitator স্পষ্ট লক্ষ্য ও এজেন্ডা তৈরি করেন, সময় রাখেন, সবাই যেন অংশ নেয় তা নিশ্চিত করেন এবং আলোচনাকে সম্মত পরবর্তী ধাপে রূপ দেন।",
    },
    ideas: {
      en: [
        "Start with a one-sentence goal and the output you will have at the end.",
        "Use silent writing and voting so quieter people are heard, not only the loudest.",
        "Timebox every activity and park off-topic items in a visible list.",
        "End with owners and dates for every action.",
      ],
      bn: [
        "এক বাক্যের লক্ষ্য ও শেষে কী আউটপুট থাকবে তা দিয়ে শুরু করুন।",
        "নীরব লেখা ও ভোট ব্যবহার করুন যাতে শান্ত মানুষও শোনা হয়, শুধু সবচেয়ে জোরালো নয়।",
        "প্রতিটি কার্যক্রমের সময় বেঁধে দিন এবং অপ্রাসঙ্গিক বিষয় দৃশ্যমান তালিকায় রাখুন।",
        "প্রতিটি অ্যাকশনের মালিক ও তারিখ দিয়ে শেষ করুন।",
      ],
    },
    tryIt: {
      en: "Plan a 60-minute workshop agenda to decide the top three priorities for your team next quarter, with timings for each activity.",
      bn: "আপনার টিমের পরের কোয়ার্টারের শীর্ষ তিন অগ্রাধিকার ঠিক করতে ৬০ মিনিটের ওয়ার্কশপ এজেন্ডা তৈরি করুন, প্রতিটি কার্যক্রমের সময়সহ।",
    },
    refs: [
      { title: "Gamestorming", url: "https://gamestorming.com/", kind: "Book" },
      { title: "Google Ventures: The Design Sprint", url: "https://www.gv.com/sprint/", kind: "Article" },
      { title: "Atlassian Team Playbook", url: "https://www.atlassian.com/team-playbook", kind: "Docs" },
      { title: "Liberating Structures", url: "https://www.liberatingstructures.com/", kind: "Docs" },
      yt("workshop facilitation tips for beginners"),
    ],
  },

  "cons-2": {
    basics: {
      en: "Executives have little time and many decisions. Executive communication means putting the answer first: state your recommendation or conclusion in the opening line, then give the few reasons that support it, and only then the detail. This is the 'Pyramid Principle'.",
      bn: "নির্বাহীদের সময় কম, সিদ্ধান্ত অনেক। Executive communication মানে উত্তর আগে দেওয়া: শুরুর লাইনেই আপনার সুপারিশ বা সিদ্ধান্ত বলুন, তারপর সমর্থনকারী কয়েকটি কারণ, আর তার পরে বিস্তারিত। এটাই 'Pyramid Principle'।",
    },
    ideas: {
      en: [
        "Lead with the answer, then 2 to 3 supporting points, then evidence.",
        "State what you need from them: a decision, an approval, or just awareness.",
        "Use short sentences and plain words; cut background they already know.",
        "One page or five slides often beats twenty.",
      ],
      bn: [
        "উত্তর দিয়ে শুরু করুন, তারপর ২-৩টি সমর্থনকারী পয়েন্ট, তারপর প্রমাণ।",
        "তাদের কাছে কী চান বলুন: সিদ্ধান্ত, অনুমোদন, নাকি শুধু জানানো।",
        "ছোট বাক্য ও সহজ শব্দ ব্যবহার করুন; তাদের জানা পটভূমি বাদ দিন।",
        "এক পাতা বা পাঁচ স্লাইড প্রায়ই বিশটির চেয়ে ভালো।",
      ],
    },
    tryIt: {
      en: "Rewrite your last status update as a 3-sentence email that begins with the recommendation or the key message.",
      bn: "আপনার শেষ স্ট্যাটাস আপডেট ৩ বাক্যের ইমেইল হিসেবে নতুন করে লিখুন, যা সুপারিশ বা মূল বার্তা দিয়ে শুরু হয়।",
    },
    refs: [
      { title: "Executive summary (Wikipedia)", url: "https://en.wikipedia.org/wiki/Executive_summary", kind: "Wiki" },
      { title: "Minto: The Pyramid Principle (overview)", url: "https://www.barbaraminto.com/", kind: "Book" },
      { title: "Barbara Minto (Wikipedia), creator of the Pyramid Principle", url: "https://en.wikipedia.org/wiki/Barbara_Minto", kind: "Wiki" },
      { title: "Amazon-style 6-page memos (Working Backwards)", url: "https://www.workingbackwards.com/concepts/working-backwards-pr-faq-process/", kind: "Article" },
      yt("executive communication pyramid principle"),
    ],
  },

  "cons-3": {
    basics: {
      en: "Storytelling with data means turning numbers into a clear message. Instead of showing every chart, you pick the one insight that matters, show it with a simple chart, and tell people what it means and what to do. The title of a chart should say the takeaway.",
      bn: "Storytelling with data মানে সংখ্যাকে স্পষ্ট বার্তায় রূপ দেওয়া। সব চার্ট দেখানোর বদলে আপনি একটি গুরুত্বপূর্ণ insight বেছে নেন, সরল চার্টে দেখান এবং এর অর্থ ও করণীয় বলেন। চার্টের শিরোনাম takeaway বলবে।",
    },
    ideas: {
      en: [
        "Know your audience and the one thing you want them to do.",
        "Pick the right chart (line for time, bar for comparison). Avoid pie charts with many slices and 3D effects.",
        "Remove clutter and use colour to highlight only what matters.",
        "Structure: context, tension (the problem), resolution (your recommendation).",
      ],
      bn: [
        "শ্রোতাকে এবং তারা যে একটি কাজ করবে তা জানুন।",
        "সঠিক চার্ট বাছুন (সময়ে লাইন, তুলনায় বার)। অনেক টুকরার পাই চার্ট ও 3D ইফেক্ট এড়ান।",
        "অগোছালো উপাদান সরান এবং শুধু গুরুত্বপূর্ণ অংশ রঙ দিয়ে হাইলাইট করুন।",
        "কাঠামো: প্রসঙ্গ, টানাপোড়েন (সমস্যা), সমাধান (আপনার সুপারিশ)।",
      ],
    },
    tryIt: {
      en: "Take a chart from a report and rewrite its title to state the takeaway, then remove everything that does not support it.",
      bn: "একটি রিপোর্ট থেকে চার্ট নিয়ে তার শিরোনাম takeaway-তে বদলান, তারপর যা তাকে সমর্থন করে না তা সরিয়ে দিন।",
    },
    refs: [
      { title: "Storytelling with Data", url: "https://www.storytellingwithdata.com/", kind: "Book" },
      { title: "Storytelling with Data: Blog", url: "https://www.storytellingwithdata.com/blog", kind: "Article" },
      { title: "From Data to Viz: Choose a chart type", url: "https://www.data-to-viz.com/", kind: "Tool" },
      { title: "Harvard Business Review: How to Tell a Story with Data", url: "https://hbr.org/2013/04/how-to-tell-a-story-with-data", kind: "Article" },
      yt("storytelling with data tutorial"),
    ],
  },

  "cons-4": {
    basics: {
      en: "An objection is a client's worry or disagreement, such as 'it's too expensive'. It usually signals an unmet concern, not a final no. Handling it well means listening fully, understanding the real concern behind it, and responding honestly, including admitting when we are not the right fit.",
      bn: "Objection হলো ক্লায়েন্টের দুশ্চিন্তা বা দ্বিমত, যেমন 'এটা অনেক দামি'। এটি সাধারণত অপূর্ণ উদ্বেগের ইঙ্গিত, চূড়ান্ত 'না' নয়। ভালোভাবে সামলাতে হলে পুরোটা শুনুন, পেছনের আসল উদ্বেগ বুঝুন এবং সৎভাবে সাড়া দিন, আমরা যথার্থ নই হলে তা স্বীকারসহ।",
    },
    ideas: {
      en: [
        "Listen without interrupting, then repeat back what you heard to confirm.",
        "Ask 'What is behind that concern?' before answering.",
        "Respond with facts, examples or options; never argue or get defensive.",
        "Be honest. A lost deal is better than a promise you cannot keep.",
      ],
      bn: [
        "বাধা না দিয়ে শুনুন, তারপর যা শুনেছেন তা নিশ্চিত করতে আবার বলুন।",
        "উত্তরের আগে জিজ্ঞেস করুন 'এই উদ্বেগের পেছনে কী আছে?'",
        "তথ্য, উদাহরণ বা বিকল্প দিয়ে সাড়া দিন; তর্ক বা আত্মরক্ষা করবেন না।",
        "সৎ থাকুন। রাখতে পারবেন না এমন প্রতিশ্রুতির চেয়ে হারানো ডিল ভালো।",
      ],
    },
    tryIt: {
      en: "Role-play with a colleague: they say 'Your price is higher than the other agency'. Practise listening, asking a question, then responding.",
      bn: "সহকর্মীর সাথে রোল-প্লে করুন: তিনি বলবেন 'আপনাদের দাম অন্য এজেন্সির চেয়ে বেশি'। শোনা, প্রশ্ন করা, তারপর সাড়া দেওয়ার অনুশীলন করুন।",
    },
    refs: [
      { title: "Negotiation (Wikipedia)", url: "https://en.wikipedia.org/wiki/Negotiation", kind: "Wiki" },
      { title: "Active listening (Wikipedia)", url: "https://en.wikipedia.org/wiki/Active_listening", kind: "Wiki" },
      { title: "Active listening (Wikipedia)", url: "https://en.wikipedia.org/wiki/Active_listening", kind: "Wiki" },
      { title: "Book: Never Split the Difference", url: "https://www.blackswanltd.com/never-split-the-difference", kind: "Book" },
      yt("how to handle client objections"),
    ],
  },

  "cons-5": {
    basics: {
      en: "When AI agents help build, old estimating rules (hours per screen) no longer fit. Estimating agentic delivery means thinking about what the agents can do quickly (drafts, boilerplate, tests) and what still needs human time (specs, review, decisions, integration and quality checks).",
      bn: "AI এজেন্ট বানাতে সাহায্য করলে পুরনো এস্টিমেশন নিয়ম (স্ক্রিন প্রতি ঘণ্টা) আর মানায় না। Agentic delivery এস্টিমেট মানে ভাবা কোন কাজ এজেন্ট দ্রুত করতে পারে (ড্রাফট, boilerplate, টেস্ট) আর কোনটিতে এখনো মানুষের সময় লাগে (spec, রিভিউ, সিদ্ধান্ত, ইন্টিগ্রেশন ও মান যাচাই)।",
    },
    ideas: {
      en: [
        "Writing code gets cheaper; clear specs, review and testing become the main effort.",
        "Estimate in ranges and state assumptions (for example 'client approves within 2 days').",
        "Add time for human-in-the-loop checks, rework and unknown integrations.",
        "Track actuals against estimates so your next estimate is better.",
      ],
      bn: [
        "কোড লেখা সস্তা হয়; স্পষ্ট spec, রিভিউ ও টেস্টিং মূল প্রচেষ্টা হয়ে ওঠে।",
        "পরিসরে এস্টিমেট করুন এবং assumption লিখুন (যেমন 'ক্লায়েন্ট ২ দিনে অনুমোদন দেবে')।",
        "মানুষের যাচাই, পুনঃকাজ ও অজানা ইন্টিগ্রেশনের জন্য সময় যোগ করুন।",
        "এস্টিমেটের সাথে প্রকৃত সময় মিলিয়ে দেখুন, পরের এস্টিমেট ভালো হবে।",
      ],
    },
    tryIt: {
      en: "Estimate a small feature in two ways: traditional hours, and agentic (spec, generate, review, fix). Compare and explain the difference.",
      bn: "একটি ছোট ফিচার দুই উপায়ে এস্টিমেট করুন: প্রচলিত ঘণ্টা, এবং agentic (spec, generate, review, fix)। তুলনা করে পার্থক্য ব্যাখ্যা করুন।",
    },
    refs: [
      { title: "Anthropic: Claude Code best practices", url: "https://www.anthropic.com/engineering/claude-code-best-practices", kind: "Article" },
      { title: "Martin Fowler: Software estimation (bliki)", url: "https://martinfowler.com/bliki/PurposeOfEstimation.html", kind: "Article" },
      { title: "Atlassian: Agile estimation", url: "https://www.atlassian.com/agile/project-management/estimation", kind: "Article" },
      { title: "DORA: Impact of generative AI in software development", url: "https://dora.dev/research/ai/", kind: "Article" },
      yt("estimating software projects with AI coding agents"),
    ],
  },

  "cons-6": {
    basics: {
      en: "Critique is feedback on work so that the work gets better. Giving it well means being specific, kind and focused on goals, not on the person. Receiving it well means listening, asking questions, and separating your self-worth from your work.",
      bn: "Critique হলো কাজ আরও ভালো করার জন্য কাজের ওপর ফিডব্যাক। ভালোভাবে দিতে হলে নির্দিষ্ট, সদয় এবং ব্যক্তির নয়, লক্ষ্যের ওপর মনোযোগী হোন। ভালোভাবে নিতে হলে শুনুন, প্রশ্ন করুন এবং নিজের মূল্য আর নিজের কাজ আলাদা রাখুন।",
    },
    ideas: {
      en: [
        "Give feedback about the work against its goal: 'This button label may confuse new users because...'.",
        "Say what works as well as what to change, and suggest options when you can.",
        "When receiving: listen first, ask clarifying questions, say thanks, decide later.",
        "Agree the type of feedback wanted: early direction or final polish.",
      ],
      bn: [
        "লক্ষ্যের বিপরীতে কাজ নিয়ে ফিডব্যাক দিন: 'এই বাটন লেবেল নতুন ইউজারদের বিভ্রান্ত করতে পারে কারণ...'।",
        "কী ভালো এবং কী বদলাতে হবে বলুন, সম্ভব হলে বিকল্প দিন।",
        "নেওয়ার সময়: আগে শুনুন, প্রশ্ন করুন, ধন্যবাদ বলুন, পরে সিদ্ধান্ত নিন।",
        "কোন ধরনের ফিডব্যাক চান ঠিক করে নিন: শুরুর দিকনির্দেশ নাকি চূড়ান্ত পালিশ।",
      ],
    },
    tryIt: {
      en: "Give a colleague feedback on one piece of their work using this format: what works, one question, one suggestion. Ask them how it landed.",
      bn: "এই ফরম্যাটে একজন সহকর্মীর কাজে ফিডব্যাক দিন: কী ভালো, একটি প্রশ্ন, একটি পরামর্শ। তাঁকে জিজ্ঞেস করুন কেমন লেগেছে।",
    },
    refs: [
      { title: "Harvard Business Review: The Feedback Fallacy", url: "https://hbr.org/2019/03/the-feedback-fallacy", kind: "Article" },
      { title: "NN/g: Design Critiques", url: "https://www.nngroup.com/articles/design-critiques/", kind: "Article" },
      { title: "Book: Thanks for the Feedback", url: "https://www.amazon.com/Thanks-Feedback-Science-Receiving-Well/dp/0143127209", kind: "Book" },
      { title: "Google re:Work: Give and receive feedback", url: "https://rework.withgoogle.com/intl/en/guides/managers-give-actionable-feedback", kind: "Article" },
      yt("how to give and receive feedback"),
    ],
  },
}
