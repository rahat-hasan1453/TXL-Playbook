import { GuideMap, yt } from "./types"

export const SERVICE_GUIDES: GuideMap = {
  "serv-1": {
    basics: {
      en: "Design Thinking is a human-centred way to solve problems. The Double Diamond splits it into two rounds of 'open up, then narrow down': first understand the right problem (Discover, Define), then create the right solution (Develop, Deliver).",
      bn: "Design Thinking হলো মানুষকে কেন্দ্রে রেখে সমস্যা সমাধানের পদ্ধতি। Double Diamond এটিকে দুই দফা 'খোলা, তারপর সংকুচিত করা'-য় ভাগ করে: প্রথমে সঠিক সমস্যা বোঝা (Discover, Define), তারপর সঠিক সমাধান বানানো (Develop, Deliver)।",
    },
    ideas: {
      en: [
        "Diverge (explore many options) before you converge (choose).",
        "First diamond is about the problem; second is about the solution.",
        "Stay close to users in every stage, not only at the start.",
        "It is a loop, not a straight line. Going back is normal.",
      ],
      bn: [
        "বাছাইয়ের (converge) আগে অনেক বিকল্প খুঁজুন (diverge)।",
        "প্রথম ডায়মন্ড সমস্যা নিয়ে, দ্বিতীয়টি সমাধান নিয়ে।",
        "প্রতিটি ধাপে ইউজারের কাছাকাছি থাকুন, শুধু শুরুতে নয়।",
        "এটি সরল রেখা নয়, চক্র। পেছনে ফেরা স্বাভাবিক।",
      ],
    },
    tryIt: {
      en: "Take a small everyday annoyance (a slow queue, a confusing form) and write what you would do in each of the four stages.",
      bn: "প্রতিদিনের একটি ছোট বিরক্তিকর বিষয় (ধীর লাইন, জটিল ফর্ম) নিন এবং চারটি ধাপে আপনি কী করতেন তা লিখুন।",
    },
    refs: [
      { title: "Design Council: The Double Diamond", url: "https://www.designcouncil.org.uk/our-resources/the-double-diamond/", kind: "Article" },
      { title: "IDEO U: What is design thinking", url: "https://www.ideou.com/blogs/inspiration/what-is-design-thinking", kind: "Article" },
      { title: "NN/g: Design Thinking 101", url: "https://www.nngroup.com/articles/design-thinking/", kind: "Article" },
      { title: "Stanford d.school: Resources", url: "https://dschool.stanford.edu/resources", kind: "Course" },
      yt("Design Thinking and Double Diamond explained"),
    ],
  },

  "serv-2": {
    basics: {
      en: "A customer journey map is a visual story of what a person does, thinks and feels as they use a service from start to finish. It shows touchpoints (where they meet you), emotions, and pain points, so the team can fix the worst moments first.",
      bn: "Customer journey map হলো একজন মানুষ সেবা ব্যবহারের শুরু থেকে শেষ পর্যন্ত কী করে, ভাবে ও অনুভব করে তার ভিজ্যুয়াল গল্প। এতে touchpoint (কোথায় আপনার সাথে দেখা হয়), আবেগ ও pain point দেখা যায়, ফলে টিম সবচেয়ে খারাপ মুহূর্তগুলো আগে ঠিক করতে পারে।",
    },
    ideas: {
      en: [
        "Choose one persona and one scenario; do not map 'everyone'.",
        "Rows usually are: stages, actions, thoughts, emotions, touchpoints, opportunities.",
        "Base it on research (interviews, data), not on guesses.",
        "Look for emotional lows; they point to the biggest opportunities.",
      ],
      bn: [
        "একটি persona ও একটি scenario বেছে নিন; 'সবার' জন্য আঁকবেন না।",
        "সারি সাধারণত: stages, actions, thoughts, emotions, touchpoints, opportunities।",
        "গবেষণা (ইন্টারভিউ, ডেটা) থেকে বানান, অনুমান থেকে নয়।",
        "আবেগের নিম্নবিন্দু খুঁজুন; সেখানেই সবচেয়ে বড় সুযোগ।",
      ],
    },
    tryIt: {
      en: "Map your own journey of ordering a ride-hailing car, from 'I need to go somewhere' to 'I arrived', and mark the most frustrating moment.",
      bn: "রাইড-হেইলিং গাড়ি ডাকার আপনার নিজের journey আঁকুন, 'কোথাও যেতে হবে' থেকে 'পৌঁছে গেছি' পর্যন্ত, এবং সবচেয়ে বিরক্তিকর মুহূর্ত চিহ্নিত করুন।",
    },
    refs: [
      { title: "NN/g: Journey Mapping 101", url: "https://www.nngroup.com/articles/journey-mapping-101/", kind: "Article" },
      { title: "NN/g: When and How to Create Customer Journey Maps", url: "https://www.nngroup.com/articles/customer-journey-mapping/", kind: "Article" },
      { title: "Customer journey (Wikipedia)", url: "https://en.wikipedia.org/wiki/Customer_journey", kind: "Wiki" },
      { title: "NN/g: Empathy Mapping, the first step in design thinking", url: "https://www.nngroup.com/articles/empathy-mapping/", kind: "Article" },
      yt("customer journey mapping tutorial UX"),
    ],
  },

  "serv-3": {
    basics: {
      en: "A service blueprint extends the journey map. Above a 'line of visibility' it shows what the customer sees and does. Below it, it shows the backstage people, systems and processes that make the service work. It reveals where internal problems cause customer problems.",
      bn: "Service blueprint হলো journey map-এর সম্প্রসারণ। 'line of visibility'-র ওপরে কাস্টমার যা দেখে ও করে। নিচে পর্দার আড়ালের মানুষ, সিস্টেম ও প্রক্রিয়া যা সেবাটি চালায়। এতে বোঝা যায় ভেতরের কোন সমস্যা কাস্টমারের সমস্যা তৈরি করছে।",
    },
    ideas: {
      en: [
        "Layers: customer actions, frontstage actions, backstage actions, support processes.",
        "Lines separate who does what: interaction, visibility, internal interaction.",
        "Mark failure points and waiting times.",
        "Great for AI and agent workflows: show what the agent does behind the scenes.",
      ],
      bn: [
        "স্তর: customer actions, frontstage actions, backstage actions, support processes।",
        "লাইনগুলো ভাগ করে কে কী করে: interaction, visibility, internal interaction।",
        "ব্যর্থতার বিন্দু ও অপেক্ষার সময় চিহ্নিত করুন।",
        "AI ও এজেন্ট workflow-র জন্য চমৎকার: এজেন্ট পর্দার আড়ালে কী করে তা দেখান।",
      ],
    },
    tryIt: {
      en: "Blueprint 'ordering a pizza online' with at least one backstage step (kitchen) and one support system (payment).",
      bn: "'অনলাইনে পিৎজা অর্ডার' blueprint করুন, অন্তত একটি backstage ধাপ (রান্নাঘর) ও একটি support system (পেমেন্ট) সহ।",
    },
    refs: [
      { title: "NN/g: Service Blueprints", url: "https://www.nngroup.com/articles/service-blueprints-definition/", kind: "Article" },
      { title: "Service design (Wikipedia)", url: "https://en.wikipedia.org/wiki/Service_design", kind: "Wiki" },
      { title: "Service blueprint (Wikipedia)", url: "https://en.wikipedia.org/wiki/Service_blueprint", kind: "Wiki" },
      { title: "Service Design Tools: Service blueprint", url: "https://servicedesigntools.org/tools/service-blueprint", kind: "Tool" },
      yt("service blueprint tutorial"),
    ],
  },

  "serv-4": {
    basics: {
      en: "User research is how we learn about people instead of guessing. Interviews show why people do things, surveys show how many feel something, and observation shows what they really do, which often differs from what they say.",
      bn: "User research হলো অনুমানের বদলে মানুষ সম্পর্কে শেখার উপায়। Interview দেখায় মানুষ কেন কিছু করে, survey দেখায় কতজন কী অনুভব করে, আর observation দেখায় তারা আসলে কী করে, যা প্রায়ই তাদের কথার চেয়ে আলাদা।",
    },
    ideas: {
      en: [
        "Ask open questions ('Tell me about the last time you...') and avoid leading ones.",
        "Past behaviour is more reliable than opinions about the future.",
        "Five to eight interviews often reveal the main patterns.",
        "Qualitative research gives the why; quantitative gives the how many.",
      ],
      bn: [
        "খোলা প্রশ্ন করুন ('শেষবার যখন আপনি... করেছিলেন, বলুন') এবং ইঙ্গিতপূর্ণ প্রশ্ন এড়ান।",
        "অতীত আচরণ ভবিষ্যৎ নিয়ে মতামতের চেয়ে বেশি নির্ভরযোগ্য।",
        "পাঁচ থেকে আটটি interview-তেই প্রধান প্যাটার্ন বেরিয়ে আসে।",
        "Qualitative গবেষণা 'কেন' দেয়; quantitative দেয় 'কতজন'।",
      ],
    },
    tryIt: {
      en: "Interview a friend for 15 minutes about how they pay bills, using only open questions. Write down three surprises.",
      bn: "একজন বন্ধুকে ১৫ মিনিট ধরে বিল পরিশোধ নিয়ে শুধু খোলা প্রশ্ন করে ইন্টারভিউ করুন। তিনটি অবাক করা বিষয় লিখুন।",
    },
    refs: [
      { title: "NN/g: User Interviews 101", url: "https://www.nngroup.com/articles/user-interviews/", kind: "Article" },
      { title: "NN/g: When to Use Which UX Research Method", url: "https://www.nngroup.com/articles/which-ux-research-methods/", kind: "Article" },
      { title: "Book: The Mom Test", url: "https://www.momtestbook.com/", kind: "Book" },
      { title: "Interaction Design Foundation: User research", url: "https://www.interaction-design.org/literature/topics/user-research", kind: "Course" },
      yt("user research methods interviews surveys observation"),
    ],
  },

  "serv-5": {
    basics: {
      en: "Usability testing means watching real people try to complete tasks with your product while thinking aloud. You are testing the design, not the person. It quickly shows where people get stuck, confused or give up.",
      bn: "Usability testing মানে আসল মানুষ আপনার প্রোডাক্টে কাজ সম্পন্ন করতে চেষ্টা করার সময় তাদের লক্ষ্য করা, তারা মুখে ভাবনা বলতে বলতে। আপনি ডিজাইন পরীক্ষা করছেন, মানুষকে নয়। এতে দ্রুত দেখা যায় কোথায় মানুষ আটকে যায়, বিভ্রান্ত হয় বা ছেড়ে দেয়।",
    },
    ideas: {
      en: [
        "Test with about five users per round; most major problems show up.",
        "Give realistic tasks, not instructions ('Find a shirt under 30 dollars').",
        "Stay quiet and observe. Do not help or explain.",
        "Fix the biggest problems, then test again.",
      ],
      bn: [
        "প্রতি রাউন্ডে প্রায় পাঁচজন ইউজার নিয়ে টেস্ট করুন; বেশিরভাগ বড় সমস্যা ধরা পড়ে।",
        "বাস্তব টাস্ক দিন, নির্দেশনা নয় ('৩০ ডলারের নিচে একটি শার্ট খুঁজুন')।",
        "চুপ থেকে লক্ষ্য করুন। সাহায্য বা ব্যাখ্যা করবেন না।",
        "সবচেয়ে বড় সমস্যা ঠিক করে আবার টেস্ট করুন।",
      ],
    },
    tryIt: {
      en: "Ask a friend to find a specific piece of information on your company website while thinking aloud. Note every hesitation.",
      bn: "একজন বন্ধুকে মুখে ভাবনা বলতে বলতে আপনার কোম্পানির ওয়েবসাইটে নির্দিষ্ট তথ্য খুঁজতে বলুন। প্রতিটি দ্বিধা লিখে রাখুন।",
    },
    refs: [
      { title: "NN/g: Usability Testing 101", url: "https://www.nngroup.com/articles/usability-testing-101/", kind: "Article" },
      { title: "NN/g: Why You Only Need to Test with 5 Users", url: "https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/", kind: "Article" },
      { title: "Usability.gov: Usability testing", url: "https://www.usability.gov/how-to-and-tools/methods/usability-testing.html", kind: "Docs" },
      { title: "Book: Don't Make Me Think (Steve Krug)", url: "https://sensible.com/dont-make-me-think/", kind: "Book" },
      yt("how to run a usability test"),
    ],
  },

  "serv-6": {
    basics: {
      en: "A heuristic evaluation is an expert review of an interface against a list of well-known usability rules. It is fast and cheap, and finds many problems without recruiting users. The best-known list is Nielsen's 10 usability heuristics.",
      bn: "Heuristic evaluation হলো পরিচিত usability নিয়মের তালিকার বিপরীতে ইন্টারফেসের বিশেষজ্ঞ পর্যালোচনা। এটি দ্রুত ও সস্তা, ইউজার না ডেকেই অনেক সমস্যা ধরে। সবচেয়ে পরিচিত তালিকা হলো Nielsen-এর ১০টি usability heuristic।",
    },
    ideas: {
      en: [
        "Examples: visibility of system status, error prevention, consistency, recognition rather than recall.",
        "Have two or three reviewers work independently, then combine findings.",
        "Rate each issue by severity so the team knows what to fix first.",
        "It complements user testing; it does not replace it.",
      ],
      bn: [
        "উদাহরণ: system status দৃশ্যমান, error prevention, consistency, মনে রাখার বদলে চিনে নেওয়া।",
        "দুই-তিনজন রিভিউয়ার আলাদাভাবে কাজ করে পরে ফলাফল একত্র করুন।",
        "প্রতিটি সমস্যায় severity রেটিং দিন, যাতে টিম জানে কোনটি আগে ঠিক করবে।",
        "এটি user testing-এর পরিপূরক, বিকল্প নয়।",
      ],
    },
    tryIt: {
      en: "Pick one checkout or sign-up page and find three violations of Nielsen's heuristics. Name the rule for each.",
      bn: "একটি checkout বা sign-up পেজ নিয়ে Nielsen-এর heuristic লঙ্ঘনের তিনটি উদাহরণ খুঁজুন। প্রতিটির নিয়মটির নাম লিখুন।",
    },
    refs: [
      { title: "NN/g: 10 Usability Heuristics for User Interface Design", url: "https://www.nngroup.com/articles/ten-usability-heuristics/", kind: "Article" },
      { title: "NN/g: How to Conduct a Heuristic Evaluation", url: "https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/", kind: "Article" },
      { title: "Heuristic evaluation (Wikipedia)", url: "https://en.wikipedia.org/wiki/Heuristic_evaluation", kind: "Wiki" },
      { title: "Interaction Design Foundation: Heuristic evaluation", url: "https://www.interaction-design.org/literature/topics/heuristic-evaluation", kind: "Course" },
      yt("Nielsen 10 usability heuristics explained"),
    ],
  },

  "serv-7": {
    basics: {
      en: "Information architecture (IA) is how content is organised, grouped and labelled so people can find things without thinking. It covers menus, page hierarchy, naming and search. Good IA feels invisible; bad IA makes people feel lost.",
      bn: "Information architecture (IA) হলো কনটেন্ট কীভাবে সাজানো, দলবদ্ধ ও নামকরণ করা হয় যাতে মানুষ না ভেবেই জিনিস খুঁজে পায়। এতে মেনু, পেজ হায়ারার্কি, নামকরণ ও সার্চ পড়ে। ভালো IA চোখে পড়ে না; খারাপ IA মানুষকে হারিয়ে ফেলে।",
    },
    ideas: {
      en: [
        "Card sorting: ask users to group topics and name the groups.",
        "Tree testing: check whether people can find items in a proposed menu.",
        "Use the words your users use, not internal jargon.",
        "Keep navigation shallow and labels specific.",
      ],
      bn: [
        "Card sorting: ইউজারদের টপিক দলবদ্ধ করতে ও দলের নাম দিতে বলুন।",
        "Tree testing: প্রস্তাবিত মেনুতে মানুষ আইটেম খুঁজে পায় কি না যাচাই করুন।",
        "ইউজারের ব্যবহৃত শব্দ ব্যবহার করুন, ভেতরের জারগন নয়।",
        "নেভিগেশন অগভীর ও লেবেল নির্দিষ্ট রাখুন।",
      ],
    },
    tryIt: {
      en: "Write 20 topics from your company website on sticky notes (or text lines) and ask someone to group them. Compare with the real menu.",
      bn: "আপনার কোম্পানির ওয়েবসাইটের ২০টি টপিক স্টিকি নোটে (বা লাইনে) লিখে কাউকে দলবদ্ধ করতে বলুন। আসল মেনুর সাথে তুলনা করুন।",
    },
    refs: [
      { title: "NN/g: Information Architecture Study Guide", url: "https://www.nngroup.com/articles/ia-study-guide/", kind: "Article" },
      { title: "NN/g: Card Sorting", url: "https://www.nngroup.com/articles/card-sorting-definition/", kind: "Article" },
      { title: "Information architecture (Wikipedia)", url: "https://en.wikipedia.org/wiki/Information_architecture", kind: "Wiki" },
      { title: "Usability.gov: Information architecture basics", url: "https://www.usability.gov/what-and-why/information-architecture.html", kind: "Docs" },
      yt("information architecture for beginners card sorting"),
    ],
  },

  "serv-8": {
    basics: {
      en: "Behavioural design uses what we know about how people really decide, which is quickly, with habits and defaults, to make good choices easier. Used ethically it helps users reach their own goals. Used badly it becomes manipulation (dark patterns).",
      bn: "Behavioural design মানুষ আসলে কীভাবে সিদ্ধান্ত নেয় (দ্রুত, অভ্যাস ও default দিয়ে) সেই জ্ঞান কাজে লাগিয়ে ভালো পছন্দ সহজ করে। নৈতিকভাবে ব্যবহার করলে ইউজারকে নিজের লক্ষ্যে পৌঁছাতে সাহায্য করে। খারাপভাবে ব্যবহার করলে এটি manipulation (dark pattern) হয়ে যায়।",
    },
    ideas: {
      en: [
        "Defaults are powerful. Pre-selected options are chosen far more often.",
        "Reduce friction for good actions; add friction for risky ones.",
        "Nudge, don't trick: the user should be glad they were nudged.",
        "Avoid dark patterns like hidden costs, fake urgency or hard-to-find cancel buttons.",
      ],
      bn: [
        "Default খুবই শক্তিশালী। আগে থেকে বাছাই করা অপশন অনেক বেশি নির্বাচিত হয়।",
        "ভালো কাজের ঘর্ষণ (friction) কমান; ঝুঁকিপূর্ণ কাজে বাড়ান।",
        "Nudge করুন, ধোঁকা দেবেন না: ইউজার যেন পরে খুশি হয়।",
        "লুকানো খরচ, ভুয়া তাড়া বা খুঁজে না-পাওয়া cancel বাটনের মতো dark pattern এড়ান।",
      ],
    },
    tryIt: {
      en: "Find one example of a helpful nudge and one dark pattern in apps you use. Explain the difference in one sentence.",
      bn: "আপনার ব্যবহৃত অ্যাপে একটি সহায়ক nudge ও একটি dark pattern খুঁজুন। পার্থক্য এক বাক্যে ব্যাখ্যা করুন।",
    },
    refs: [
      { title: "Deceptive Patterns (dark patterns)", url: "https://www.deceptive.design/", kind: "Article" },
      { title: "Nudge theory (Wikipedia)", url: "https://en.wikipedia.org/wiki/Nudge_theory", kind: "Wiki" },
      { title: "NN/g: Psychology and UX study guide", url: "https://www.nngroup.com/articles/psychology-study-guide/", kind: "Article" },
      { title: "Laws of UX", url: "https://lawsofux.com/", kind: "Article" },
      yt("behavioural design nudges and dark patterns"),
    ],
  },

  "serv-9": {
    basics: {
      en: "Content design treats words as part of the interface. Button labels, error messages, empty states and instructions decide whether people succeed. Good UX writing is clear, short, and uses the user's language.",
      bn: "Content design শব্দকে ইন্টারফেসের অংশ হিসেবে দেখে। বাটনের লেবেল, error message, empty state ও নির্দেশনা ঠিক করে দেয় মানুষ সফল হবে কি না। ভালো UX writing স্পষ্ট, ছোট এবং ইউজারের ভাষায়।",
    },
    ideas: {
      en: [
        "Lead with the action: 'Save changes' is better than 'Submit'.",
        "Error messages should say what happened and how to fix it, without blame.",
        "Empty states are a chance to guide, not just say 'Nothing here'.",
        "Be consistent: one word for one thing across the whole product.",
      ],
      bn: [
        "অ্যাকশন দিয়ে শুরু করুন: 'Submit'-এর চেয়ে 'Save changes' ভালো।",
        "Error message বলবে কী হয়েছে ও কীভাবে ঠিক হবে, দোষারোপ ছাড়া।",
        "Empty state শুধু 'কিছু নেই' বলার জায়গা নয়, পথ দেখানোর সুযোগ।",
        "সামঞ্জস্য রাখুন: পুরো প্রোডাক্টে একটি জিনিসের জন্য একটি শব্দ।",
      ],
    },
    tryIt: {
      en: "Rewrite the error message 'Invalid input error 422' so a first-time user knows what went wrong and what to do.",
      bn: "'Invalid input error 422' error message-টি এমনভাবে নতুন করে লিখুন যাতে প্রথমবারের ইউজার বোঝে কী ভুল হয়েছে ও কী করবে।",
    },
    refs: [
      { title: "GOV.UK Content design: planning, writing and managing content", url: "https://www.gov.uk/guidance/content-design/what-is-content-design", kind: "Docs" },
      { title: "NN/g: Writing for the Web", url: "https://www.nngroup.com/articles/how-users-read-on-the-web/", kind: "Article" },
      { title: "Mailchimp Content Style Guide", url: "https://styleguide.mailchimp.com/", kind: "Docs" },
      { title: "Google Material Design: Writing", url: "https://m3.material.io/foundations/content-design/overview", kind: "Docs" },
      yt("UX writing basics microcopy"),
    ],
  },

  "serv-10": {
    basics: {
      en: "A design system is a shared library of reusable components (buttons, forms), rules and guidelines. Design tokens are the named values behind them: colours, spacing, font sizes. Together they keep products consistent and let teams build faster.",
      bn: "Design system হলো পুনর্ব্যবহারযোগ্য কম্পোনেন্ট (বাটন, ফর্ম), নিয়ম ও গাইডলাইনের একটি শেয়ার্ড লাইব্রেরি। Design token হলো এর পেছনের নামযুক্ত মান: রঙ, স্পেসিং, ফন্ট সাইজ। দুইয়ে মিলে প্রোডাক্টকে সামঞ্জস্যপূর্ণ রাখে এবং টিমকে দ্রুত বানাতে দেয়।",
    },
    ideas: {
      en: [
        "Tokens like 'color-primary' let you change a brand once and update everywhere.",
        "Components should be documented with when to use and when not to.",
        "Design and code should share the same names.",
        "A system needs an owner and a way to contribute, or it goes stale.",
      ],
      bn: [
        "'color-primary'-র মতো token একবার বদলালেই সব জায়গায় ব্র্যান্ড হালনাগাদ হয়।",
        "কম্পোনেন্টের ডকুমেন্টে কখন ব্যবহার করবেন ও কখন করবেন না, তা থাকা উচিত।",
        "ডিজাইন ও কোডে একই নাম ব্যবহার করুন।",
        "সিস্টেমের একজন মালিক ও অবদান রাখার উপায় লাগে, নইলে এটি পুরনো হয়ে যায়।",
      ],
    },
    tryIt: {
      en: "Open any website, list its 5 main colours and 3 font sizes, and name them as tokens the way a designer would.",
      bn: "যেকোনো ওয়েবসাইট খুলে তার ৫টি প্রধান রঙ ও ৩টি ফন্ট সাইজ লিখুন এবং একজন ডিজাইনারের মতো token হিসেবে নাম দিন।",
    },
    refs: [
      { title: "Design Systems (designsystems.com)", url: "https://www.designsystems.com/", kind: "Article" },
      { title: "NN/g: Design Systems 101", url: "https://www.nngroup.com/articles/design-systems-101/", kind: "Article" },
      { title: "Atomic Design by Brad Frost", url: "https://atomicdesign.bradfrost.com/", kind: "Book" },
      { title: "W3C Design Tokens Community Group", url: "https://www.designtokens.org/", kind: "Docs" },
      yt("design systems and design tokens explained"),
    ],
  },

  "serv-11": {
    basics: {
      en: "Accessibility means people with disabilities (vision, hearing, movement, cognitive) can use what we build. WCAG 2.1 AA is the international standard we treat as our minimum. It is built on four principles: Perceivable, Operable, Understandable, Robust.",
      bn: "Accessibility মানে প্রতিবন্ধী মানুষ (দৃষ্টি, শ্রবণ, চলাফেরা, মানসিক) আমাদের বানানো জিনিস ব্যবহার করতে পারবে। WCAG 2.1 AA হলো আন্তর্জাতিক মান যাকে আমরা ন্যূনতম ধরি। এর চারটি নীতি: Perceivable, Operable, Understandable, Robust।",
    },
    ideas: {
      en: [
        "Text colour needs enough contrast against its background (4.5:1 for normal text).",
        "Everything must work with a keyboard alone, with visible focus.",
        "Images need meaningful alt text; forms need proper labels.",
        "Test with a screen reader and an automated checker, but real users find more.",
      ],
      bn: [
        "লেখার রঙ ও পটভূমির মধ্যে যথেষ্ট কনট্রাস্ট দরকার (সাধারণ লেখায় ৪.৫:১)।",
        "সবকিছু শুধু কিবোর্ড দিয়ে কাজ করতে হবে, ফোকাস দৃশ্যমান সহ।",
        "ছবিতে অর্থপূর্ণ alt text, ফর্মে সঠিক label দিন।",
        "স্ক্রিন রিডার ও অটোমেটেড চেকারে টেস্ট করুন, তবে আসল ইউজার আরও বেশি সমস্যা ধরেন।",
      ],
    },
    tryIt: {
      en: "Put your mouse away and try to complete a sign-up form using only Tab, Shift+Tab and Enter. Where did you get lost?",
      bn: "মাউস সরিয়ে রেখে শুধু Tab, Shift+Tab ও Enter দিয়ে একটি সাইন-আপ ফর্ম পূরণ করার চেষ্টা করুন। কোথায় আটকে গেলেন?",
    },
    refs: [
      { title: "W3C: WCAG 2.1 quick reference", url: "https://www.w3.org/WAI/WCAG21/quickref/", kind: "Docs" },
      { title: "W3C WAI: Introduction to Web Accessibility", url: "https://www.w3.org/WAI/fundamentals/accessibility-intro/", kind: "Docs" },
      { title: "WebAIM: Contrast checker", url: "https://webaim.org/resources/contrastchecker/", kind: "Tool" },
      { title: "MDN: Accessibility", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility", kind: "Docs" },
      yt("web accessibility WCAG basics for beginners"),
    ],
  },
}
