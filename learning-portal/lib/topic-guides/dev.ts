import { GuideMap, yt } from "./types"

export const DEV_GUIDES: GuideMap = {
  "dev-1": {
    basics: {
      en: "Git records every change to your code so you can go back, compare and work in parallel. You make a branch (your own copy of the work), commit changes, then open a pull request (PR) so teammates can review before it is merged into the main code.",
      bn: "Git আপনার কোডের প্রতিটি পরিবর্তন রেকর্ড করে, ফলে পিছনে ফেরা, তুলনা করা ও সমান্তরালে কাজ করা যায়। আপনি branch (কাজের নিজস্ব কপি) বানান, পরিবর্তন commit করেন, তারপর pull request (PR) খোলেন যাতে মূল কোডে মার্জের আগে সহকর্মীরা রিভিউ করতে পারেন।",
    },
    ideas: {
      en: [
        "Commit small and often with a message that says why, not just what.",
        "Never work directly on main; use a feature branch.",
        "A good PR is small, has a clear description and links to the task.",
        "Review kindly and specifically. Ask questions before demanding changes.",
      ],
      bn: [
        "ছোট ও ঘন ঘন commit করুন, মেসেজে শুধু কী নয়, কেন তাও লিখুন।",
        "সরাসরি main-এ কাজ করবেন না; feature branch ব্যবহার করুন।",
        "ভালো PR ছোট, স্পষ্ট বর্ণনাসহ এবং টাস্কের সাথে লিংক করা।",
        "সদয় ও নির্দিষ্টভাবে রিভিউ করুন। পরিবর্তন দাবি করার আগে প্রশ্ন করুন।",
      ],
    },
    tryIt: {
      en: "Create a test repository, make a branch, change one file, commit, push and open a pull request to yourself.",
      bn: "একটি টেস্ট রিপোজিটরি বানিয়ে branch তৈরি করুন, একটি ফাইল বদলান, commit, push করুন এবং নিজের কাছে একটি pull request খুলুন।",
    },
    refs: [
      { title: "Pro Git book (free)", url: "https://git-scm.com/book/en/v2", kind: "Book" },
      { title: "GitHub Docs: About pull requests", url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests", kind: "Docs" },
      { title: "Learn Git Branching (interactive)", url: "https://learngitbranching.js.org/", kind: "Tool" },
      { title: "Atlassian: Git tutorials", url: "https://www.atlassian.com/git/tutorials", kind: "Course" },
      yt("Git and GitHub for beginners pull requests"),
    ],
  },

  "dev-2": {
    basics: {
      en: "Next.js is a React framework for building websites and apps. The App Router organises pages by folders, and uses Server Components by default: they run on the server, send less JavaScript to the browser, and can fetch data directly.",
      bn: "Next.js হলো ওয়েবসাইট ও অ্যাপ বানানোর React ফ্রেমওয়ার্ক। App Router ফোল্ডার দিয়ে পেজ সাজায় এবং ডিফল্টে Server Component ব্যবহার করে: এগুলো সার্ভারে চলে, ব্রাউজারে কম JavaScript পাঠায় এবং সরাসরি ডেটা আনতে পারে।",
    },
    ideas: {
      en: [
        "A folder with page.tsx becomes a route; layout.tsx wraps pages.",
        "Server Components by default; add 'use client' only where you need state or events.",
        "Fetch data on the server where possible; it is faster and keeps secrets safe.",
        "Know the options: static, dynamic, and streaming rendering.",
      ],
      bn: [
        "page.tsx সহ ফোল্ডার একটি route হয়; layout.tsx পেজগুলো মুড়ে রাখে।",
        "ডিফল্ট Server Component; state বা ইভেন্ট দরকার হলেই 'use client' যোগ করুন।",
        "সম্ভব হলে সার্ভারে ডেটা আনুন; এতে দ্রুত হয় ও সিক্রেট নিরাপদ থাকে।",
        "রেন্ডারিংয়ের বিকল্প জানুন: static, dynamic ও streaming।",
      ],
    },
    tryIt: {
      en: "Run npx create-next-app, add an /about route and a shared layout with a navigation bar.",
      bn: "npx create-next-app চালান, একটি /about route এবং নেভিগেশন বারসহ শেয়ার্ড layout যোগ করুন।",
    },
    refs: [
      { title: "Next.js Learn course", url: "https://nextjs.org/learn", kind: "Course" },
      { title: "Next.js docs: App Router", url: "https://nextjs.org/docs/app", kind: "Docs" },
      { title: "React docs: Server Components", url: "https://react.dev/reference/rsc/server-components", kind: "Docs" },
      { title: "Vercel: Next.js guides", url: "https://vercel.com/guides?topic=nextjs", kind: "Article" },
      yt("Next.js App Router tutorial for beginners"),
    ],
  },

  "dev-3": {
    basics: {
      en: "TypeScript is JavaScript with types. You describe the shape of your data (for example a user has a name that is text and an age that is a number) and the editor warns you about mistakes before the code runs.",
      bn: "TypeScript হলো type সহ JavaScript। আপনি ডেটার আকার বর্ণনা করেন (যেমন user-এর name টেক্সট ও age সংখ্যা) এবং কোড চলার আগেই এডিটর ভুল সম্পর্কে সতর্ক করে।",
    },
    ideas: {
      en: [
        "Use interfaces or types to describe objects.",
        "Avoid 'any'; it switches the safety off.",
        "Let inference work: you don't have to annotate everything.",
        "Types are removed at runtime, so still validate data from outside (APIs, forms).",
      ],
      bn: [
        "অবজেক্ট বর্ণনায় interface বা type ব্যবহার করুন।",
        "'any' এড়ান; এটি নিরাপত্তা বন্ধ করে দেয়।",
        "inference কাজ করতে দিন: সবকিছুতে annotation দিতে হয় না।",
        "রানটাইমে type থাকে না, তাই বাইরের ডেটা (API, ফর্ম) তবু যাচাই করুন।",
      ],
    },
    tryIt: {
      en: "Convert a small JavaScript function to TypeScript. Then pass the wrong type on purpose and read the error.",
      bn: "একটি ছোট JavaScript ফাংশন TypeScript-এ রূপান্তর করুন। তারপর ইচ্ছা করে ভুল type পাঠিয়ে error পড়ুন।",
    },
    refs: [
      { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", kind: "Docs" },
      { title: "TypeScript for JS Programmers", url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html", kind: "Docs" },
      { title: "Total TypeScript (free tutorials)", url: "https://www.totaltypescript.com/tutorials", kind: "Course" },
      { title: "TypeScript Playground", url: "https://www.typescriptlang.org/play", kind: "Tool" },
      yt("TypeScript for beginners"),
    ],
  },

  "dev-4": {
    basics: {
      en: "Tailwind CSS styles elements with small utility classes written right in the markup, like 'p-4 text-lg font-bold'. Instead of naming and managing separate CSS files, you compose the look from a fixed set of values that can mirror your design tokens.",
      bn: "Tailwind CSS মার্কআপের ভেতরেই ছোট utility class দিয়ে স্টাইল করে, যেমন 'p-4 text-lg font-bold'। আলাদা CSS ফাইল নাম দিয়ে সামলানোর বদলে নির্দিষ্ট মানের সেট থেকে চেহারা সাজানো হয়, যা আপনার design token-এর সাথে মেলানো যায়।",
    },
    ideas: {
      en: [
        "Spacing, colours and sizes come from a scale, which keeps designs consistent.",
        "Use prefixes for states and screens: hover:, focus:, md:, dark:.",
        "Extract repeated patterns into components, not into custom CSS.",
        "Configure the theme (colours, fonts) to match the design system.",
      ],
      bn: [
        "স্পেসিং, রঙ ও আকার একটি স্কেল থেকে আসে, ফলে ডিজাইন সামঞ্জস্যপূর্ণ থাকে।",
        "অবস্থা ও স্ক্রিনের জন্য prefix: hover:, focus:, md:, dark:।",
        "বারবার আসা প্যাটার্ন কাস্টম CSS-এ নয়, কম্পোনেন্টে আলাদা করুন।",
        "ডিজাইন সিস্টেমের সাথে মেলাতে থিম (রঙ, ফন্ট) কনফিগার করুন।",
      ],
    },
    tryIt: {
      en: "Build a card with an image, title, text and a button using only Tailwind classes. Make it stack on mobile and sit side by side on desktop.",
      bn: "শুধু Tailwind class দিয়ে ছবি, শিরোনাম, লেখা ও বাটনসহ একটি কার্ড বানান। মোবাইলে উপরে-নিচে আর ডেস্কটপে পাশাপাশি করুন।",
    },
    refs: [
      { title: "Tailwind CSS documentation", url: "https://tailwindcss.com/docs", kind: "Docs" },
      { title: "Tailwind Play (online editor)", url: "https://play.tailwindcss.com/", kind: "Tool" },
      { title: "Tailwind CSS: Utility-first fundamentals", url: "https://tailwindcss.com/docs/styling-with-utility-classes", kind: "Docs" },
      { title: "MDN: Learn CSS", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics", kind: "Course" },
      yt("Tailwind CSS crash course"),
    ],
  },

  "dev-5": {
    basics: {
      en: "shadcn/ui is a collection of ready-made, accessible components (buttons, dialogs, forms) that you copy into your own project instead of installing as a package. Because the code is yours, you can change anything, and it works with Tailwind.",
      bn: "shadcn/ui হলো তৈরি, accessible কম্পোনেন্টের (বাটন, ডায়ালগ, ফর্ম) সংগ্রহ, যা প্যাকেজ হিসেবে ইনস্টল না করে আপনি নিজের প্রজেক্টে কপি করেন। কোড আপনার নিজের তাই সবকিছু বদলানো যায়, এবং এটি Tailwind-এর সাথে কাজ করে।",
    },
    ideas: {
      en: [
        "Add a component with the CLI: npx shadcn@latest add button.",
        "Components are built on Radix UI, which handles keyboard and screen-reader behaviour.",
        "Customise through Tailwind classes and theme variables.",
        "Other libraries exist (MUI, Chakra); pick based on flexibility versus speed.",
      ],
      bn: [
        "CLI দিয়ে কম্পোনেন্ট যোগ করুন: npx shadcn@latest add button।",
        "কম্পোনেন্টগুলো Radix UI-র ওপর তৈরি, যা কিবোর্ড ও স্ক্রিন রিডার আচরণ সামলায়।",
        "Tailwind class ও থিম ভেরিয়েবল দিয়ে কাস্টমাইজ করুন।",
        "অন্য লাইব্রেরিও আছে (MUI, Chakra); নমনীয়তা বনাম গতি বিবেচনায় বাছুন।",
      ],
    },
    tryIt: {
      en: "Add a Dialog and a Form component from shadcn/ui to a test app, then change the theme colour.",
      bn: "একটি টেস্ট অ্যাপে shadcn/ui থেকে Dialog ও Form কম্পোনেন্ট যোগ করুন, তারপর থিমের রঙ বদলান।",
    },
    refs: [
      { title: "shadcn/ui documentation", url: "https://ui.shadcn.com/docs", kind: "Docs" },
      { title: "shadcn/ui: Components", url: "https://ui.shadcn.com/docs/components", kind: "Docs" },
      { title: "Radix UI Primitives", url: "https://www.radix-ui.com/primitives", kind: "Docs" },
      { title: "shadcn/ui: Theming", url: "https://ui.shadcn.com/docs/theming", kind: "Docs" },
      yt("shadcn ui tutorial"),
    ],
  },

  "dev-6": {
    basics: {
      en: "SELISE Blocks is the platform we use to deliver apps and sites. It provides ready-made building blocks such as login (IAM), data, files, email, workflows and a CMS, so teams don't rebuild the same backend again and again. You work with it through the Blocks CLI and the client SDK.",
      bn: "SELISE Blocks হলো আমাদের অ্যাপ ও সাইট ডেলিভারির প্ল্যাটফর্ম। এটি তৈরি বিল্ডিং ব্লক দেয়, যেমন লগইন (IAM), ডেটা, ফাইল, ইমেইল, workflow ও CMS, ফলে টিমকে বারবার একই ব্যাকএন্ড বানাতে হয় না। আপনি Blocks CLI ও client SDK দিয়ে কাজ করেন।",
    },
    ideas: {
      en: [
        "Use the blocks CLI for setup, schemas and configuration; use the SDK inside the app.",
        "Authentication is hosted login (OIDC), not a form you build yourself.",
        "Data lives in schemas with access rules, reached through the Data Gateway.",
        "Read the project's AGENTS.md and skills before changing anything.",
      ],
      bn: [
        "সেটআপ, schema ও কনফিগারেশনে blocks CLI; অ্যাপের ভেতরে SDK ব্যবহার করুন।",
        "অথেনটিকেশন হোস্টেড লগইন (OIDC), নিজে বানানো ফর্ম নয়।",
        "ডেটা schema-তে access rule সহ থাকে এবং Data Gateway দিয়ে পৌঁছানো যায়।",
        "কিছু বদলানোর আগে প্রজেক্টের AGENTS.md ও skill পড়ুন।",
      ],
    },
    tryIt: {
      en: "Run 'blocks doctor' in this project and read the output. Then list the skills in .agents/skills and open one that interests you.",
      bn: "এই প্রজেক্টে 'blocks doctor' চালিয়ে আউটপুট পড়ুন। তারপর .agents/skills-এ থাকা skill তালিকা দেখুন এবং আপনার আগ্রহের একটি খুলুন।",
    },
    refs: [
      { title: "SELISE Blocks (product site)", url: "https://seliseblocks.com/", kind: "Docs" },
      { title: "SELISE Blocks documentation", url: "https://docs.seliseblocks.com/", kind: "Docs" },
      { title: "OpenID Connect explained", url: "https://openid.net/developers/how-connect-works/", kind: "Docs" },
      { title: "Headless CMS explained (Contentful)", url: "https://www.contentful.com/headless-cms/", kind: "Article" },
      yt("SELISE Blocks platform"),
    ],
  },

  "dev-7": {
    basics: {
      en: "A headless CMS stores content separately from how it is shown, and delivers it through an API. Content modelling means deciding the content types (for example Article, Author, Product) and the fields and links between them so content is reusable on web, app or anywhere else.",
      bn: "Headless CMS কনটেন্ট কীভাবে দেখানো হবে তা থেকে আলাদা করে সংরক্ষণ করে এবং API দিয়ে পৌঁছে দেয়। Content modelling মানে কনটেন্ট টাইপ (যেমন Article, Author, Product), তাদের ফিল্ড এবং সংযোগ ঠিক করা, যাতে কনটেন্ট ওয়েব, অ্যাপ বা যেকোনো জায়গায় পুনর্ব্যবহার করা যায়।",
    },
    ideas: {
      en: [
        "Model content by meaning (title, summary, author), not by layout (big text, red box).",
        "Use references between types instead of copying content.",
        "Think about editors: clear field names, helpful descriptions, sensible limits.",
        "Plan for translations and versions from the start.",
      ],
      bn: [
        "কনটেন্টকে অর্থ অনুযায়ী মডেল করুন (title, summary, author), লেআউট অনুযায়ী নয় (বড় লেখা, লাল বক্স)।",
        "কপি না করে টাইপগুলোর মধ্যে reference ব্যবহার করুন।",
        "এডিটরদের কথা ভাবুন: স্পষ্ট ফিল্ডের নাম, সহায়ক বর্ণনা, যুক্তিসঙ্গত সীমা।",
        "শুরু থেকেই অনুবাদ ও ভার্সনের পরিকল্পনা করুন।",
      ],
    },
    tryIt: {
      en: "Design the content model for a blog: list the content types, their fields and how they connect.",
      bn: "একটি ব্লগের কনটেন্ট মডেল ডিজাইন করুন: কনটেন্ট টাইপ, তাদের ফিল্ড ও সংযোগ তালিকা করুন।",
    },
    refs: [
      { title: "Contentful: What is a headless CMS", url: "https://www.contentful.com/headless-cms/", kind: "Article" },
      { title: "Contentful: Content modelling basics", url: "https://www.contentful.com/help/content-modelling-basics/", kind: "Docs" },
      { title: "Sanity Docs: Schema types (content modelling)", url: "https://www.sanity.io/docs/studio/schema-types", kind: "Docs" },
      { title: "Headless content management system (Wikipedia)", url: "https://en.wikipedia.org/wiki/Headless_content_management_system", kind: "Wiki" },
      yt("headless CMS content modeling"),
    ],
  },

  "dev-8": {
    basics: {
      en: "An API lets one program ask another for data or actions over the internet. REST APIs use URLs and verbs such as GET (read), POST (create), PUT/PATCH (update) and DELETE. A webhook is the reverse: instead of you asking, the other system calls you when something happens.",
      bn: "API এক প্রোগ্রামকে ইন্টারনেটে অন্য প্রোগ্রামের কাছে ডেটা বা কাজ চাইতে দেয়। REST API ইউআরএল ও ক্রিয়া ব্যবহার করে, যেমন GET (পড়া), POST (তৈরি), PUT/PATCH (আপডেট) ও DELETE। Webhook উল্টো: আপনি চাওয়ার বদলে কিছু ঘটলে অন্য সিস্টেম আপনাকে কল করে।",
    },
    ideas: {
      en: [
        "Status codes tell the result: 200 OK, 201 Created, 400 bad request, 401/403 not allowed, 404 not found, 500 server error.",
        "Send and receive JSON, and always handle errors and timeouts.",
        "Secure webhooks by verifying the signature of each request.",
        "Webhooks can arrive twice or out of order; make your handler safe to repeat (idempotent).",
      ],
      bn: [
        "Status code ফল জানায়: 200 OK, 201 Created, 400 bad request, 401/403 অনুমতি নেই, 404 পাওয়া যায়নি, 500 সার্ভার error।",
        "JSON পাঠান ও গ্রহণ করুন, এবং সবসময় error ও timeout সামলান।",
        "প্রতিটি রিকোয়েস্টের signature যাচাই করে webhook নিরাপদ করুন।",
        "Webhook দুইবার বা ক্রমহীনভাবে আসতে পারে; হ্যান্ডলারকে বারবার চালালেও নিরাপদ (idempotent) রাখুন।",
      ],
    },
    tryIt: {
      en: "Call a free public API (for example https://api.github.com/users/octocat) from your browser or with curl and read the JSON.",
      bn: "ব্রাউজার বা curl দিয়ে একটি ফ্রি পাবলিক API (যেমন https://api.github.com/users/octocat) কল করে JSON পড়ুন।",
    },
    refs: [
      { title: "MDN: HTTP overview", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", kind: "Docs" },
      { title: "MDN: HTTP response status codes", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status", kind: "Docs" },
      { title: "Stripe: Webhooks guide", url: "https://docs.stripe.com/webhooks", kind: "Docs" },
      { title: "REST API Tutorial", url: "https://restfulapi.net/", kind: "Article" },
      yt("REST API and webhooks explained for beginners"),
    ],
  },

  "dev-9": {
    basics: {
      en: "Authentication checks who you are. Single sign-on (SSO) lets you log in once and use many apps. OAuth 2.0 is the standard for letting an app act for you with limited permission. OpenID Connect (OIDC) adds identity on top of OAuth, so the app learns who logged in.",
      bn: "Authentication যাচাই করে আপনি কে। Single sign-on (SSO) একবার লগইন করে অনেক অ্যাপ ব্যবহার করতে দেয়। OAuth 2.0 হলো সীমিত অনুমতিতে অ্যাপকে আপনার পক্ষে কাজ করতে দেওয়ার স্ট্যান্ডার্ড। OpenID Connect (OIDC) OAuth-এর ওপর পরিচয় যোগ করে, ফলে অ্যাপ জানে কে লগইন করেছে।",
    },
    ideas: {
      en: [
        "Use the Authorization Code flow with PKCE for web and mobile apps.",
        "Do not store passwords yourself; use a trusted identity provider.",
        "Keep tokens safe (secure, HttpOnly cookies) and short-lived.",
        "Authentication is who you are; authorization is what you may do. Check both.",
      ],
      bn: [
        "ওয়েব ও মোবাইল অ্যাপে PKCE সহ Authorization Code flow ব্যবহার করুন।",
        "নিজে পাসওয়ার্ড সংরক্ষণ করবেন না; বিশ্বস্ত identity provider ব্যবহার করুন।",
        "টোকেন নিরাপদ (secure, HttpOnly কুকি) ও স্বল্পায়ু রাখুন।",
        "Authentication হলো আপনি কে; authorization হলো আপনি কী করতে পারেন। দুটোই যাচাই করুন।",
      ],
    },
    tryIt: {
      en: "Log in to any app with Google, and watch the address bar. Note each redirect and what it is for.",
      bn: "যেকোনো অ্যাপে Google দিয়ে লগইন করুন এবং অ্যাড্রেস বার লক্ষ্য করুন। প্রতিটি redirect ও তার উদ্দেশ্য লিখুন।",
    },
    refs: [
      { title: "OAuth 2.0 Simplified", url: "https://www.oauth.com/", kind: "Book" },
      { title: "OpenID Connect: How it works", url: "https://openid.net/developers/how-connect-works/", kind: "Docs" },
      { title: "Auth0: Authorization Code Flow with PKCE", url: "https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-pkce", kind: "Docs" },
      { title: "MDN: Authentication", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication", kind: "Docs" },
      yt("OAuth 2.0 and OpenID Connect explained"),
    ],
  },

  "dev-10": {
    basics: {
      en: "Playwright is a tool that opens a real browser and clicks through your app like a user, so you can check complete journeys (sign up, buy, log out) automatically. End-to-end (E2E) tests catch problems that small tests miss, because they test everything working together.",
      bn: "Playwright এমন টুল যা আসল ব্রাউজার খুলে ইউজারের মতো আপনার অ্যাপে ক্লিক করে, ফলে সম্পূর্ণ যাত্রা (সাইন-আপ, কেনা, লগআউট) স্বয়ংক্রিয়ভাবে যাচাই করা যায়। End-to-end (E2E) টেস্ট ছোট টেস্টের মিস করা সমস্যা ধরে, কারণ সবকিছু একসাথে কাজ করছে কি না তা পরীক্ষা করে।",
    },
    ideas: {
      en: [
        "Find elements by role and label (getByRole, getByLabel), like a user would, not by fragile CSS.",
        "Playwright waits automatically for elements; avoid fixed sleeps.",
        "Keep tests independent and focused on the most important user journeys.",
        "Use the trace viewer and codegen to debug and to get started quickly.",
      ],
      bn: [
        "ভঙ্গুর CSS নয়, ইউজারের মতো role ও label দিয়ে এলিমেন্ট খুঁজুন (getByRole, getByLabel)।",
        "Playwright এলিমেন্টের জন্য নিজেই অপেক্ষা করে; স্থির sleep এড়ান।",
        "টেস্ট স্বাধীন রাখুন এবং সবচেয়ে গুরুত্বপূর্ণ ইউজার যাত্রায় মনোযোগ দিন।",
        "ডিবাগ ও দ্রুত শুরু করতে trace viewer ও codegen ব্যবহার করুন।",
      ],
    },
    tryIt: {
      en: "Run npx playwright codegen on a site you like, click through a flow and save the generated test.",
      bn: "আপনার পছন্দের সাইটে npx playwright codegen চালান, একটি flow ক্লিক করে এগিয়ে যান এবং তৈরি হওয়া টেস্ট সংরক্ষণ করুন।",
    },
    refs: [
      { title: "Playwright documentation", url: "https://playwright.dev/docs/intro", kind: "Docs" },
      { title: "Playwright: Best practices", url: "https://playwright.dev/docs/best-practices", kind: "Docs" },
      { title: "Playwright: Test generator (codegen)", url: "https://playwright.dev/docs/codegen", kind: "Docs" },
      { title: "Martin Fowler: The Practical Test Pyramid", url: "https://martinfowler.com/articles/practical-test-pyramid.html", kind: "Article" },
      yt("Playwright end to end testing tutorial"),
    ],
  },

  "dev-11": {
    basics: {
      en: "CI/CD automates the road from code to users. Continuous Integration builds and tests every change automatically. Continuous Delivery/Deployment ships it. A preview deployment gives every pull request its own temporary URL so people can try the change before it is merged.",
      bn: "CI/CD কোড থেকে ইউজার পর্যন্ত পথ স্বয়ংক্রিয় করে। Continuous Integration প্রতিটি পরিবর্তন স্বয়ংক্রিয়ভাবে বিল্ড ও টেস্ট করে। Continuous Delivery/Deployment সেটি প্রকাশ করে। Preview deployment প্রতিটি pull request-কে নিজস্ব অস্থায়ী URL দেয়, যাতে মার্জের আগে মানুষ পরিবর্তনটি দেখতে পারে।",
    },
    ideas: {
      en: [
        "Pipeline steps: install, lint, type-check, test, build, deploy.",
        "Fail fast: a red build must block the merge.",
        "Keep secrets in the platform's secret store, never in the repo.",
        "Make rollbacks easy so a bad release is a small problem.",
      ],
      bn: [
        "Pipeline ধাপ: install, lint, type-check, test, build, deploy।",
        "দ্রুত ব্যর্থ হোন: লাল বিল্ড মার্জ আটকাবে।",
        "সিক্রেট প্ল্যাটফর্মের সিক্রেট স্টোরে রাখুন, রিপোজিটরিতে কখনো নয়।",
        "রোলব্যাক সহজ রাখুন, যাতে খারাপ রিলিজ ছোট সমস্যা হয়।",
      ],
    },
    tryIt: {
      en: "Add a GitHub Actions workflow that runs your tests on every pull request. Break a test on purpose to see it fail.",
      bn: "প্রতিটি pull request-এ আপনার টেস্ট চালায় এমন একটি GitHub Actions workflow যোগ করুন। ইচ্ছা করে একটি টেস্ট ভেঙে দেখুন ব্যর্থ হয়।",
    },
    refs: [
      { title: "GitHub Actions documentation", url: "https://docs.github.com/en/actions", kind: "Docs" },
      { title: "Vercel: Preview deployments", url: "https://vercel.com/docs/deployments/preview-deployments", kind: "Docs" },
      { title: "Atlassian: CI/CD explained", url: "https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment", kind: "Article" },
      { title: "Martin Fowler: Continuous Integration", url: "https://martinfowler.com/articles/continuousIntegration.html", kind: "Article" },
      yt("CI/CD pipeline explained for beginners"),
    ],
  },

  "dev-12": {
    basics: {
      en: "Web performance is how fast a page feels. Google measures it with Core Web Vitals: Largest Contentful Paint (LCP, how fast the main content appears), Interaction to Next Paint (INP, how fast the page responds) and Cumulative Layout Shift (CLS, how much things jump around). Faster pages convert better.",
      bn: "Web performance হলো একটি পেজ কত দ্রুত অনুভূত হয়। Google এটি Core Web Vitals দিয়ে মাপে: Largest Contentful Paint (LCP, মূল কনটেন্ট কত দ্রুত দেখা যায়), Interaction to Next Paint (INP, পেজ কত দ্রুত সাড়া দেয়) ও Cumulative Layout Shift (CLS, জিনিস কতটা লাফায়)। দ্রুত পেজে কনভার্শন ভালো হয়।",
    },
    ideas: {
      en: [
        "Targets: LCP under 2.5 s, INP under 200 ms, CLS under 0.1.",
        "Biggest wins: compress and size images, ship less JavaScript, cache well.",
        "Reserve space for images and ads so the layout doesn't shift.",
        "Measure on real devices and slow networks, not only on your fast laptop.",
      ],
      bn: [
        "লক্ষ্য: LCP ২.৫ সেকেন্ডের কম, INP ২০০ ms-এর কম, CLS ০.১-এর কম।",
        "বড় লাভ: ছবি কমপ্রেস ও সঠিক মাপের করা, কম JavaScript পাঠানো, ভালো ক্যাশিং।",
        "লেআউট না লাফাতে ছবি ও বিজ্ঞাপনের জায়গা আগে থেকে রাখুন।",
        "শুধু আপনার দ্রুত ল্যাপটপে নয়, আসল ডিভাইস ও ধীর নেটওয়ার্কে মাপুন।",
      ],
    },
    tryIt: {
      en: "Run your company homepage through PageSpeed Insights and write down the top three suggestions.",
      bn: "আপনার কোম্পানির হোমপেজ PageSpeed Insights-এ চালান এবং শীর্ষ তিনটি পরামর্শ লিখুন।",
    },
    refs: [
      { title: "web.dev: Core Web Vitals", url: "https://web.dev/articles/vitals", kind: "Docs" },
      { title: "PageSpeed Insights", url: "https://pagespeed.web.dev/", kind: "Tool" },
      { title: "web.dev Learn Performance", url: "https://web.dev/learn/performance", kind: "Course" },
      { title: "MDN: Web performance", url: "https://developer.mozilla.org/en-US/docs/Web/Performance", kind: "Docs" },
      yt("Core Web Vitals explained LCP INP CLS"),
    ],
  },

  "dev-13": {
    basics: {
      en: "Hosting is the computer that serves your site. A domain (example.com) is its human-friendly name. DNS is the internet's phone book that turns the name into the server's address. SSL/TLS encrypts the connection and shows the padlock (HTTPS), so visitors can trust and browsers don't warn them.",
      bn: "Hosting হলো যে কম্পিউটার আপনার সাইট পরিবেশন করে। Domain (example.com) তার মানুষের-বোধ্য নাম। DNS ইন্টারনেটের ফোনবুক যা নামকে সার্ভারের ঠিকানায় রূপান্তর করে। SSL/TLS সংযোগ এনক্রিপ্ট করে ও তালা (HTTPS) দেখায়, ফলে ভিজিটর ভরসা পায় ও ব্রাউজার সতর্ক করে না।",
    },
    ideas: {
      en: [
        "Common DNS records: A/AAAA (to an IP), CNAME (to another name), MX (email), TXT (verification, SPF).",
        "DNS changes take time to spread (propagation); lower the TTL before a big change.",
        "Certificates expire. Prefer automatic renewal (for example Let's Encrypt or platform-managed).",
        "Redirect HTTP to HTTPS and pick one canonical address (www or non-www).",
      ],
      bn: [
        "সাধারণ DNS রেকর্ড: A/AAAA (IP-তে), CNAME (অন্য নামে), MX (ইমেইল), TXT (যাচাই, SPF)।",
        "DNS পরিবর্তন ছড়াতে সময় লাগে (propagation); বড় পরিবর্তনের আগে TTL কমান।",
        "সার্টিফিকেটের মেয়াদ শেষ হয়। স্বয়ংক্রিয় নবায়ন পছন্দ করুন (যেমন Let's Encrypt বা প্ল্যাটফর্ম-পরিচালিত)।",
        "HTTP থেকে HTTPS-এ redirect করুন এবং একটি canonical ঠিকানা বেছে নিন (www বা non-www)।",
      ],
    },
    tryIt: {
      en: "Look up the DNS records of your favourite site using a tool like dnschecker.org or the 'dig' command and explain each record.",
      bn: "dnschecker.org বা 'dig' কমান্ডের মতো টুল দিয়ে আপনার প্রিয় সাইটের DNS রেকর্ড দেখুন এবং প্রতিটির ব্যাখ্যা দিন।",
    },
    refs: [
      { title: "Cloudflare Learning: What is DNS", url: "https://www.cloudflare.com/learning/dns/what-is-dns/", kind: "Article" },
      { title: "Cloudflare Learning: What is SSL/TLS", url: "https://www.cloudflare.com/learning/ssl/what-is-ssl/", kind: "Article" },
      { title: "Let's Encrypt: How it works", url: "https://letsencrypt.org/how-it-works/", kind: "Docs" },
      { title: "MDN: What is a domain name", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name", kind: "Docs" },
      yt("how DNS domain and SSL work"),
    ],
  },
}
