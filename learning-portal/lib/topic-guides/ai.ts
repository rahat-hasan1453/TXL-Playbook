import { GuideMap, yt } from "./types"

export const AI_GUIDES: GuideMap = {
  "ai-1": {
    basics: {
      en: "A Large Language Model (LLM) is a program trained on huge amounts of text to predict the next piece of text. It reads your input as tokens (word pieces), has a limited context window (how much it can read at once), and can sound confident while being wrong (hallucination).",
      bn: "Large Language Model (LLM) হলো বিপুল পরিমাণ টেক্সটে প্রশিক্ষিত একটি প্রোগ্রাম যা পরবর্তী টেক্সট অনুমান করে। এটি আপনার ইনপুটকে token (শব্দের টুকরো) হিসেবে পড়ে, একসাথে পড়ার সীমা (context window) আছে, এবং ভুল হয়েও আত্মবিশ্বাসী শোনাতে পারে (hallucination)।",
    },
    ideas: {
      en: [
        "Tokens: roughly 3 to 4 characters of English each. Cost and limits are counted in tokens.",
        "Context window: the model forgets anything outside it.",
        "Temperature: low gives focused, repeatable answers; high gives creative, varied ones.",
        "Models don't 'know' facts; they predict plausible text. Verify important claims.",
      ],
      bn: [
        "Token: ইংরেজিতে প্রায় ৩-৪ অক্ষর। খরচ ও সীমা token দিয়ে গোনা হয়।",
        "Context window: এর বাইরের কিছু মডেল ভুলে যায়।",
        "Temperature: কম হলে মনোযোগী ও পুনরাবৃত্তিযোগ্য উত্তর; বেশি হলে সৃজনশীল ও বৈচিত্র্যময়।",
        "মডেল তথ্য 'জানে' না; এটি সম্ভাব্য টেক্সট অনুমান করে। গুরুত্বপূর্ণ দাবি যাচাই করুন।",
      ],
    },
    tryIt: {
      en: "Ask an LLM the same factual question three times with the temperature changed (if you can), and compare. Then ask for its source and check it.",
      bn: "একই তথ্যভিত্তিক প্রশ্ন তিনবার করুন, temperature বদলে (সম্ভব হলে), এবং তুলনা করুন। তারপর সোর্স চেয়ে তা যাচাই করুন।",
    },
    refs: [
      { title: "Anthropic: Intro to Claude", url: "https://docs.anthropic.com/en/docs/intro-to-claude", kind: "Docs" },
      { title: "Andrej Karpathy: Intro to Large Language Models (video)", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", kind: "Video" },
      { title: "3Blue1Brown: Neural networks series", url: "https://www.3blue1brown.com/topics/neural-networks", kind: "Course" },
      { title: "Large language model (Wikipedia)", url: "https://en.wikipedia.org/wiki/Large_language_model", kind: "Wiki" },
      yt("how large language models work explained simply"),
    ],
  },

  "ai-2": {
    basics: {
      en: "A prompt is the instruction you give a model. Prompt engineering is writing clear instructions. Context engineering goes further: deciding what information, examples and tools the model should see at each step, because the model can only work with what is in front of it.",
      bn: "Prompt হলো মডেলকে দেওয়া নির্দেশ। Prompt engineering মানে স্পষ্ট নির্দেশ লেখা। Context engineering আরও এগিয়ে: প্রতিটি ধাপে মডেলকে কোন তথ্য, উদাহরণ ও টুল দেখাবেন তা ঠিক করা, কারণ মডেল শুধু সামনে যা আছে তা নিয়েই কাজ করতে পারে।",
    },
    ideas: {
      en: [
        "Be specific about the task, audience, format and constraints.",
        "Show 1 to 3 examples of the output you want (few-shot).",
        "Give the model the facts it needs; don't expect it to remember them.",
        "Iterate: read the output, find what is wrong, adjust the prompt.",
      ],
      bn: [
        "টাস্ক, শ্রোতা, ফরম্যাট ও সীমাবদ্ধতা সম্পর্কে নির্দিষ্ট হোন।",
        "কাঙ্ক্ষিত আউটপুটের ১-৩টি উদাহরণ দেখান (few-shot)।",
        "মডেলকে প্রয়োজনীয় তথ্য দিন; মনে রাখবে আশা করবেন না।",
        "বারবার উন্নত করুন: আউটপুট পড়ুন, ভুল খুঁজুন, প্রম্পট বদলান।",
      ],
    },
    tryIt: {
      en: "Take a vague prompt like 'write about our product' and rewrite it with audience, length, tone and one example. Compare the two outputs.",
      bn: "'আমাদের প্রোডাক্ট নিয়ে লিখো'-র মতো অস্পষ্ট প্রম্পট নিয়ে শ্রোতা, দৈর্ঘ্য, টোন ও একটি উদাহরণ যোগ করে নতুন করে লিখুন। দুটি আউটপুট তুলনা করুন।",
    },
    refs: [
      { title: "Anthropic: Prompt engineering overview", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", kind: "Docs" },
      { title: "Anthropic: Effective context engineering for AI agents", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents", kind: "Article" },
      { title: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/", kind: "Course" },
      { title: "OpenAI: Prompt engineering guide", url: "https://platform.openai.com/docs/guides/prompt-engineering", kind: "Docs" },
      yt("prompt engineering and context engineering tutorial"),
    ],
  },

  "ai-3": {
    basics: {
      en: "Spec-driven development means you write a clear, structured specification first (what to build, rules, examples, acceptance checks) and let an AI agent implement it. The spec becomes the source of truth, so humans review intent rather than every line of code.",
      bn: "Spec-driven development মানে আগে স্পষ্ট, কাঠামোবদ্ধ specification লেখা (কী বানাতে হবে, নিয়ম, উদাহরণ, গ্রহণযোগ্যতার শর্ত) এবং AI এজেন্ট দিয়ে সেটি বাস্তবায়ন করানো। Spec-ই সত্যের উৎস হয়, তাই মানুষ প্রতিটি কোডলাইনের বদলে উদ্দেশ্য পর্যালোচনা করে।",
    },
    ideas: {
      en: [
        "A good spec has purpose, scope, inputs and outputs, edge cases and acceptance tests.",
        "Keep specs in the repo as markdown so agents and people read the same file.",
        "If the output is wrong, fix the spec, then regenerate.",
        "Small specs are easier for agents to follow than one giant document.",
      ],
      bn: [
        "ভালো spec-এ থাকে উদ্দেশ্য, scope, ইনপুট-আউটপুট, edge case ও acceptance test।",
        "Spec মার্কডাউনে রিপোজিটরিতে রাখুন, যাতে এজেন্ট ও মানুষ একই ফাইল পড়ে।",
        "আউটপুট ভুল হলে spec ঠিক করুন, তারপর আবার তৈরি করুন।",
        "একটি বিশাল ডকুমেন্টের চেয়ে ছোট spec এজেন্টের জন্য অনুসরণ করা সহজ।",
      ],
    },
    tryIt: {
      en: "Write a one-page spec for a small tool (for example a word counter) and give it to an AI assistant. Did it build what you meant?",
      bn: "একটি ছোট টুলের (যেমন word counter) জন্য এক পাতার spec লিখে একটি AI অ্যাসিস্ট্যান্টকে দিন। সে কি আপনার উদ্দেশ্য অনুযায়ী বানিয়েছে?",
    },
    refs: [
      { title: "GitHub Spec Kit", url: "https://github.com/github/spec-kit", kind: "Tool" },
      { title: "GitHub Blog: Spec-driven development with AI", url: "https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/", kind: "Article" },
      { title: "Anthropic: Claude Code best practices", url: "https://www.anthropic.com/engineering/claude-code-best-practices", kind: "Article" },
      { title: "Martin Fowler: Exploring Gen AI", url: "https://martinfowler.com/articles/exploring-gen-ai.html", kind: "Article" },
      yt("spec-driven development with AI agents"),
    ],
  },

  "ai-4": {
    basics: {
      en: "An AI agent is an LLM that can plan steps and use tools (search, code, APIs, files) in a loop until a goal is reached. Instead of one reply, it thinks, acts, observes the result, and decides what to do next.",
      bn: "AI agent হলো এমন LLM যা ধাপ পরিকল্পনা করতে এবং টুল (সার্চ, কোড, API, ফাইল) ব্যবহার করতে পারে, লক্ষ্যে না পৌঁছানো পর্যন্ত চক্রে। একটি উত্তর দেওয়ার বদলে এটি ভাবে, কাজ করে, ফল দেখে এবং পরবর্তী পদক্ষেপ ঠিক করে।",
    },
    ideas: {
      en: [
        "Loop: observe → think → act (call a tool) → observe again.",
        "Tools are functions with clear names, inputs and descriptions.",
        "Start with the simplest design that works; add autonomy only when needed.",
        "Always limit what an agent can do and log its actions.",
      ],
      bn: [
        "চক্র: observe → think → act (টুল কল) → আবার observe।",
        "টুল হলো স্পষ্ট নাম, ইনপুট ও বর্ণনাসহ ফাংশন।",
        "কাজ করে এমন সবচেয়ে সরল ডিজাইন দিয়ে শুরু করুন; প্রয়োজন হলেই স্বায়ত্তশাসন বাড়ান।",
        "এজেন্ট কী করতে পারে তা সীমিত করুন এবং তার কাজের লগ রাখুন।",
      ],
    },
    tryIt: {
      en: "List the tools a 'meeting scheduler' agent would need (for example read calendar, send invite) and what could go wrong with each.",
      bn: "একটি 'meeting scheduler' এজেন্টের কোন টুল লাগবে (যেমন ক্যালেন্ডার পড়া, আমন্ত্রণ পাঠানো) এবং প্রতিটিতে কী ভুল হতে পারে তা তালিকা করুন।",
    },
    refs: [
      { title: "Anthropic: Building effective agents", url: "https://www.anthropic.com/engineering/building-effective-agents", kind: "Article" },
      { title: "Anthropic: Tool use with Claude", url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview", kind: "Docs" },
      { title: "Lilian Weng: LLM Powered Autonomous Agents", url: "https://lilianweng.github.io/posts/2023-06-23-agent/", kind: "Article" },
      { title: "Hugging Face: AI Agents Course", url: "https://huggingface.co/learn/agents-course", kind: "Course" },
      yt("what are AI agents explained"),
    ],
  },

  "ai-5": {
    basics: {
      en: "Agent orchestration is coordinating several agents or steps so they complete a bigger job. One agent may plan, others research, write or review. In TXL this includes multi-agent pipelines like MADP. The challenge is passing the right information between them.",
      bn: "Agent orchestration হলো একাধিক এজেন্ট বা ধাপের সমন্বয় যাতে তারা বড় কাজ সম্পন্ন করে। একজন পরিকল্পনা করে, অন্যরা গবেষণা, লেখা বা পর্যালোচনা করে। TXL-এ এর মধ্যে MADP-এর মতো multi-agent pipeline আছে। চ্যালেঞ্জ হলো তাদের মধ্যে সঠিক তথ্য পাঠানো।",
    },
    ideas: {
      en: [
        "Common patterns: prompt chaining, routing, parallel work, orchestrator-workers, evaluator-optimiser.",
        "Give each agent one clear role and a limited set of tools.",
        "Define the hand-off format between agents (for example a structured summary).",
        "More agents cost more and fail in more ways. Add them only when one agent is not enough.",
      ],
      bn: [
        "প্রচলিত প্যাটার্ন: prompt chaining, routing, parallel work, orchestrator-workers, evaluator-optimiser।",
        "প্রতিটি এজেন্টকে একটি স্পষ্ট ভূমিকা ও সীমিত টুল দিন।",
        "এজেন্টদের মধ্যে হ্যান্ড-অফ ফরম্যাট ঠিক করুন (যেমন কাঠামোবদ্ধ সারাংশ)।",
        "বেশি এজেন্টে খরচ ও ব্যর্থতার পথ বাড়ে। একটি এজেন্ট যথেষ্ট না হলেই যোগ করুন।",
      ],
    },
    tryIt: {
      en: "Sketch a three-agent pipeline for writing a blog post (researcher, writer, reviewer). What exactly does each pass to the next?",
      bn: "ব্লগ পোস্ট লেখার জন্য তিন এজেন্টের একটি pipeline এঁকে ফেলুন (researcher, writer, reviewer)। প্রত্যেকে পরেরজনকে ঠিক কী দেয়?",
    },
    refs: [
      { title: "Anthropic: Building effective agents (workflows)", url: "https://www.anthropic.com/engineering/building-effective-agents", kind: "Article" },
      { title: "Anthropic: How we built our multi-agent research system", url: "https://www.anthropic.com/engineering/multi-agent-research-system", kind: "Article" },
      { title: "LangGraph documentation", url: "https://langchain-ai.github.io/langgraph/", kind: "Docs" },
      { title: "OpenAI Agents SDK", url: "https://openai.github.io/openai-agents-python/", kind: "Docs" },
      yt("multi agent orchestration patterns"),
    ],
  },

  "ai-6": {
    basics: {
      en: "Model Context Protocol (MCP) is an open standard that lets AI apps connect to tools and data (files, databases, SaaS apps) in one common way. Think of it as a USB-C port for AI: build a connector once, and many AI apps can use it.",
      bn: "Model Context Protocol (MCP) হলো একটি ওপেন স্ট্যান্ডার্ড যা AI অ্যাপকে টুল ও ডেটার (ফাইল, ডাটাবেস, SaaS অ্যাপ) সাথে একই পদ্ধতিতে যুক্ত করে। একে AI-র জন্য USB-C পোর্ট ভাবতে পারেন: একবার কানেক্টর বানালে অনেক AI অ্যাপ ব্যবহার করতে পারে।",
    },
    ideas: {
      en: [
        "An MCP server exposes tools, resources and prompts; an MCP client (the AI app) uses them.",
        "It reduces custom integration work for each AI app.",
        "Only connect servers you trust, and review what permissions they have.",
        "Be careful: text returned from a tool can contain malicious instructions (prompt injection).",
      ],
      bn: [
        "MCP server টুল, রিসোর্স ও প্রম্পট দেয়; MCP client (AI অ্যাপ) সেগুলো ব্যবহার করে।",
        "প্রতিটি AI অ্যাপের জন্য আলাদা ইন্টিগ্রেশনের কাজ কমায়।",
        "শুধু বিশ্বস্ত সার্ভার যুক্ত করুন এবং তাদের পারমিশন দেখে নিন।",
        "সাবধান: টুলের ফেরত দেওয়া টেক্সটে ক্ষতিকর নির্দেশ থাকতে পারে (prompt injection)।",
      ],
    },
    tryIt: {
      en: "Browse the list of existing MCP servers and pick one that would help your daily work. Write what you would ask it to do.",
      bn: "বিদ্যমান MCP server-এর তালিকা দেখুন এবং আপনার দৈনন্দিন কাজে সাহায্য করবে এমন একটি বেছে নিন। তাকে কী করতে বলবেন তা লিখুন।",
    },
    refs: [
      { title: "Model Context Protocol: Introduction", url: "https://modelcontextprotocol.io/introduction", kind: "Docs" },
      { title: "Anthropic: Introducing MCP", url: "https://www.anthropic.com/news/model-context-protocol", kind: "Article" },
      { title: "MCP servers repository", url: "https://github.com/modelcontextprotocol/servers", kind: "Tool" },
      { title: "MCP specification", url: "https://modelcontextprotocol.io/specification", kind: "Docs" },
      yt("Model Context Protocol MCP explained"),
    ],
  },

  "ai-7": {
    basics: {
      en: "Retrieval-Augmented Generation (RAG) lets a model answer using your own documents. First the system searches your knowledge base for relevant passages, then it adds them to the prompt, so the answer is grounded in real sources instead of memory.",
      bn: "Retrieval-Augmented Generation (RAG) মডেলকে আপনার নিজস্ব ডকুমেন্ট থেকে উত্তর দিতে দেয়। প্রথমে সিস্টেম আপনার জ্ঞানভাণ্ডারে প্রাসঙ্গিক অংশ খোঁজে, তারপর প্রম্পটে যোগ করে, ফলে উত্তর স্মৃতির বদলে আসল উৎসের ওপর দাঁড়ায়।",
    },
    ideas: {
      en: [
        "Pipeline: split documents into chunks, index them, retrieve the best chunks, generate an answer.",
        "Good chunking and good search matter more than a bigger model.",
        "Ask the model to cite which passage it used, and to say 'I don't know' when nothing matches.",
        "Evaluate with real questions; bad retrieval is the most common failure.",
      ],
      bn: [
        "Pipeline: ডকুমেন্ট chunk-এ ভাগ করা, index করা, সেরা chunk খোঁজা, উত্তর তৈরি।",
        "বড় মডেলের চেয়ে ভালো chunking ও ভালো সার্চ বেশি গুরুত্বপূর্ণ।",
        "মডেলকে বলুন কোন অংশ ব্যবহার করেছে তা উল্লেখ করতে, এবং মিল না পেলে 'জানি না' বলতে।",
        "আসল প্রশ্ন দিয়ে মূল্যায়ন করুন; খারাপ retrieval-ই সবচেয়ে সাধারণ ব্যর্থতা।",
      ],
    },
    tryIt: {
      en: "Take a PDF of company policies and write ten questions an employee might ask. Which answers could a search find? Which are missing?",
      bn: "কোম্পানির নীতিমালার একটি PDF নিয়ে একজন কর্মী যে দশটি প্রশ্ন করতে পারেন তা লিখুন। কোন উত্তরগুলো সার্চে মিলবে? কোনগুলো নেই?",
    },
    refs: [
      { title: "Anthropic: Introducing Contextual Retrieval", url: "https://www.anthropic.com/news/contextual-retrieval", kind: "Article" },
      { title: "Pinecone: What is RAG", url: "https://www.pinecone.io/learn/retrieval-augmented-generation/", kind: "Article" },
      { title: "AWS: What is RAG", url: "https://aws.amazon.com/what-is/retrieval-augmented-generation/", kind: "Article" },
      { title: "Original RAG paper (Lewis et al.)", url: "https://arxiv.org/abs/2005.11401", kind: "Article" },
      yt("RAG retrieval augmented generation explained"),
    ],
  },

  "ai-8": {
    basics: {
      en: "An embedding turns text (or images) into a list of numbers that captures its meaning. Texts with similar meaning get similar numbers. A vector database searches these numbers, so a search for 'cheap hotel' can find 'budget accommodation' with no shared words.",
      bn: "Embedding টেক্সট (বা ছবি)-কে সংখ্যার তালিকায় রূপ দেয় যা তার অর্থ ধরে। একই অর্থের টেক্সটের সংখ্যাও কাছাকাছি হয়। Vector database এই সংখ্যাগুলো সার্চ করে, ফলে 'cheap hotel' সার্চ করলে একই শব্দ ছাড়াই 'budget accommodation' পাওয়া যায়।",
    },
    ideas: {
      en: [
        "Similarity is measured by distance between vectors (often cosine similarity).",
        "Semantic search finds meaning; keyword search finds exact words. Combining both (hybrid) is strong.",
        "Use the same embedding model for indexing and for queries.",
        "Embeddings power RAG, recommendations and duplicate detection.",
      ],
      bn: [
        "সাদৃশ্য মাপা হয় ভেক্টরের মধ্যে দূরত্ব দিয়ে (প্রায়ই cosine similarity)।",
        "Semantic search অর্থ খোঁজে; keyword search হুবহু শব্দ। দুটি মিলিয়ে (hybrid) শক্তিশালী।",
        "ইনডেক্স ও কুয়েরি দুটিতেই একই embedding মডেল ব্যবহার করুন।",
        "Embedding RAG, সুপারিশ ও ডুপ্লিকেট শনাক্তকরণে ব্যবহার হয়।",
      ],
    },
    tryIt: {
      en: "Think of five search phrases where keyword search would fail but semantic search would work (for example 'laptop won't turn on').",
      bn: "পাঁচটি সার্চ বাক্য ভাবুন যেখানে keyword search ব্যর্থ হবে কিন্তু semantic search কাজ করবে (যেমন 'ল্যাপটপ চালু হচ্ছে না')।",
    },
    refs: [
      { title: "Anthropic: Embeddings guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/embeddings", kind: "Docs" },
      { title: "OpenAI: Embeddings guide", url: "https://platform.openai.com/docs/guides/embeddings", kind: "Docs" },
      { title: "Pinecone: What are vector embeddings", url: "https://www.pinecone.io/learn/vector-embeddings/", kind: "Article" },
      { title: "Word embedding (Wikipedia)", url: "https://en.wikipedia.org/wiki/Word_embedding", kind: "Wiki" },
      yt("embeddings and vector search explained"),
    ],
  },

  "ai-9": {
    basics: {
      en: "Evaluations ('evals') are tests for AI behaviour. Because AI output varies, you can't judge it by trying a few prompts. You build a set of example inputs with expected qualities, run the system on all of them, and score the results. This lets you know if a change really improved things.",
      bn: "Evaluation ('eval') হলো AI আচরণের পরীক্ষা। AI-র আউটপুট বদলায় বলে কয়েকটি প্রম্পট চালিয়ে বিচার করা যায় না। আপনি প্রত্যাশিত গুণসহ উদাহরণ ইনপুটের একটি সেট বানান, সব ক্ষেত্রে সিস্টেম চালান এবং ফল স্কোর করেন। এতে জানা যায় পরিবর্তন সত্যিই উন্নতি করল কি না।",
    },
    ideas: {
      en: [
        "Start with 20 to 50 real examples, including hard and edge cases.",
        "Score with code checks, human review, or an LLM acting as judge (and check the judge too).",
        "Run evals every time you change a prompt, model or retrieval setup.",
        "Track failures by type so you know what to fix.",
      ],
      bn: [
        "২০-৫০টি আসল উদাহরণ দিয়ে শুরু করুন, কঠিন ও edge case সহ।",
        "কোড চেক, মানুষের রিভিউ বা LLM-as-judge দিয়ে স্কোর করুন (বিচারককেও যাচাই করুন)।",
        "প্রম্পট, মডেল বা retrieval বদলালে প্রতিবার eval চালান।",
        "ব্যর্থতা ধরন অনুযায়ী লিখে রাখুন, যাতে বোঝা যায় কী ঠিক করতে হবে।",
      ],
    },
    tryIt: {
      en: "Write 10 test questions for a chatbot with the ideal answer's key points. Run them and mark pass or fail.",
      bn: "একটি চ্যাটবটের জন্য আদর্শ উত্তরের মূল পয়েন্টসহ ১০টি টেস্ট প্রশ্ন লিখুন। চালিয়ে pass বা fail চিহ্নিত করুন।",
    },
    refs: [
      { title: "Anthropic: Define success criteria and build evaluations", url: "https://docs.anthropic.com/en/docs/test-and-evaluate/develop-tests", kind: "Docs" },
      { title: "Hamel Husain: Your AI product needs evals", url: "https://hamel.dev/blog/posts/evals/", kind: "Article" },
      { title: "OpenAI: Evals guide", url: "https://platform.openai.com/docs/guides/evals", kind: "Docs" },
      { title: "Eugene Yan: Evaluating LLM-evaluators", url: "https://eugeneyan.com/writing/llm-evaluators/", kind: "Article" },
      yt("LLM evals explained how to evaluate AI applications"),
    ],
  },

  "ai-10": {
    basics: {
      en: "Human-in-the-loop (HITL) means a person reviews, approves or corrects what the AI does at the points where mistakes would matter. It balances speed with safety, and it is how trust is built before more autonomy is given.",
      bn: "Human-in-the-loop (HITL) মানে যেখানে ভুলের গুরুত্ব আছে সেখানে একজন মানুষ AI-র কাজ পর্যালোচনা, অনুমোদন বা সংশোধন করেন। এটি গতি ও নিরাপত্তার ভারসাম্য রাখে এবং আরও স্বায়ত্তশাসন দেওয়ার আগে আস্থা গড়ার উপায়।",
    },
    ideas: {
      en: [
        "Require approval for actions that are costly, irreversible or public (sending email, payments, deleting).",
        "Show the person what the AI intends to do and why, so review is quick.",
        "Make it easy to correct and feed that back to improve the system.",
        "Beware of rubber-stamping: if people approve everything without looking, the loop is broken.",
      ],
      bn: [
        "ব্যয়বহুল, অপরিবর্তনীয় বা প্রকাশ্য কাজে (ইমেইল পাঠানো, পেমেন্ট, মুছে ফেলা) অনুমোদন বাধ্যতামূলক করুন।",
        "AI কী করতে চায় ও কেন তা মানুষকে দেখান, যাতে রিভিউ দ্রুত হয়।",
        "সংশোধন সহজ করুন এবং সেটি সিস্টেম উন্নয়নে কাজে লাগান।",
        "না দেখেই সব অনুমোদন (rubber-stamping) থেকে সাবধান: তাহলে লুপ ভেঙে যায়।",
      ],
    },
    tryIt: {
      en: "For an AI that drafts customer emails, decide which steps need human approval and which can be automatic. Explain why.",
      bn: "গ্রাহককে ইমেইলের খসড়া লেখা একটি AI-র জন্য কোন ধাপে মানুষের অনুমোদন লাগবে আর কোনটি স্বয়ংক্রিয় হতে পারে তা ঠিক করুন। কারণ ব্যাখ্যা করুন।",
    },
    refs: [
      { title: "Anthropic: Building effective agents (human oversight)", url: "https://www.anthropic.com/engineering/building-effective-agents", kind: "Article" },
      { title: "Google PAIR: People + AI Guidebook", url: "https://pair.withgoogle.com/guidebook/", kind: "Book" },
      { title: "Human-in-the-loop (Wikipedia)", url: "https://en.wikipedia.org/wiki/Human-in-the-loop", kind: "Wiki" },
      { title: "Microsoft: Guidelines for human-AI interaction", url: "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/", kind: "Docs" },
      yt("human in the loop AI design"),
    ],
  },

  "ai-11": {
    basics: {
      en: "A copilot assists a person who stays in control: it suggests, drafts or explains, and the person decides. An agent takes actions on its own to reach a goal. The choice is about trust, risk and how much work you want to hand over.",
      bn: "Copilot এমন ব্যক্তিকে সহায়তা করে যিনি নিয়ন্ত্রণে থাকেন: সে পরামর্শ, খসড়া বা ব্যাখ্যা দেয়, সিদ্ধান্ত মানুষের। Agent লক্ষ্যে পৌঁছাতে নিজে কাজ করে। পছন্দটি নির্ভর করে আস্থা, ঝুঁকি ও কতটা কাজ হস্তান্তর করতে চান তার ওপর।",
    },
    ideas: {
      en: [
        "Copilot fits creative, judgement-heavy or high-risk work.",
        "Agent fits repetitive, well-defined, low-risk work with clear success checks.",
        "It is a spectrum; many products start as copilots and grow into agents.",
        "Design the user's view of what happened, in both patterns.",
      ],
      bn: [
        "Copilot সৃজনশীল, বিচার-নির্ভর বা উচ্চ ঝুঁকির কাজে মানানসই।",
        "Agent পুনরাবৃত্তিমূলক, সুনির্দিষ্ট, কম ঝুঁকির এবং স্পষ্ট সাফল্য-যাচাইযুক্ত কাজে মানানসই।",
        "এটি একটি স্পেকট্রাম; অনেক প্রোডাক্ট copilot হিসেবে শুরু করে agent-এ বাড়ে।",
        "দুই প্যাটার্নেই ইউজার যেন দেখতে পায় কী ঘটেছে, তা ডিজাইন করুন।",
      ],
    },
    tryIt: {
      en: "Pick three tasks from your week (for example writing a report, renaming files, booking a meeting) and label each: copilot, agent, or neither.",
      bn: "আপনার সপ্তাহ থেকে তিনটি কাজ বেছে নিন (যেমন রিপোর্ট লেখা, ফাইলের নাম বদলানো, মিটিং বুক করা) এবং প্রতিটিকে লেবেল দিন: copilot, agent বা কোনোটিই নয়।",
    },
    refs: [
      { title: "Anthropic: Building effective agents", url: "https://www.anthropic.com/engineering/building-effective-agents", kind: "Article" },
      { title: "Google PAIR: People + AI Guidebook (Mental models)", url: "https://pair.withgoogle.com/chapter/mental-models/", kind: "Book" },
      { title: "NN/g: AI, the first new UI paradigm in 60 years", url: "https://www.nngroup.com/articles/ai-paradigm/", kind: "Article" },
      { title: "Microsoft: What is Copilot", url: "https://www.microsoft.com/en-us/microsoft-copilot/for-individuals", kind: "Docs" },
      yt("AI copilot vs AI agent difference"),
    ],
  },

  "ai-12": {
    basics: {
      en: "There are three main ways to make a model fit your need. Prompting is fastest and cheapest: give clear instructions. RAG adds your documents when the model lacks knowledge. Fine-tuning retrains the model on examples to change its style or skill. Try them in that order.",
      bn: "মডেলকে আপনার প্রয়োজনে মানানোর তিনটি প্রধান উপায়। Prompting সবচেয়ে দ্রুত ও সস্তা: স্পষ্ট নির্দেশ দিন। RAG মডেলের জ্ঞানে ঘাটতি থাকলে আপনার ডকুমেন্ট যোগ করে। Fine-tuning উদাহরণ দিয়ে মডেল আবার প্রশিক্ষণ দিয়ে তার স্টাইল বা দক্ষতা বদলায়। এই ক্রমে চেষ্টা করুন।",
    },
    ideas: {
      en: [
        "Prompting first: it solves most problems at no extra cost.",
        "RAG when the answer depends on facts that change or are private.",
        "Fine-tune when you need a consistent style, format or a narrow skill at scale.",
        "Fine-tuning rarely teaches new facts reliably; RAG is better for that.",
      ],
      bn: [
        "আগে prompting: বেশিরভাগ সমস্যা অতিরিক্ত খরচ ছাড়াই মেটে।",
        "উত্তর বদলায় বা ব্যক্তিগত তথ্যের ওপর নির্ভর করলে RAG।",
        "ধারাবাহিক স্টাইল, ফরম্যাট বা বড় পরিসরে নির্দিষ্ট দক্ষতা দরকার হলে fine-tune।",
        "Fine-tuning নতুন তথ্য নির্ভরযোগ্যভাবে শেখায় না; তার জন্য RAG ভালো।",
      ],
    },
    tryIt: {
      en: "For each of these, pick prompting, RAG or fine-tuning: (a) answer from our HR policy, (b) always reply in our brand voice, (c) summarise a meeting.",
      bn: "প্রতিটির জন্য prompting, RAG বা fine-tuning বাছুন: (ক) আমাদের HR নীতি থেকে উত্তর, (খ) সবসময় আমাদের ব্র্যান্ড ভয়েসে উত্তর, (গ) মিটিং সারাংশ।",
    },
    refs: [
      { title: "Anthropic: Prompt engineering overview", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", kind: "Docs" },
      { title: "OpenAI: Optimizing LLM accuracy", url: "https://platform.openai.com/docs/guides/optimizing-llm-accuracy", kind: "Docs" },
      { title: "Hugging Face: LLM course", url: "https://huggingface.co/learn/llm-course", kind: "Course" },
      { title: "Microsoft: RAG vs fine-tuning", url: "https://learn.microsoft.com/en-us/azure/developer/ai/augment-llm-rag-fine-tuning", kind: "Docs" },
      yt("prompting vs RAG vs fine-tuning when to use"),
    ],
  },

  "ai-13": {
    basics: {
      en: "AI governance is the set of rules, roles and checks for using AI responsibly. The EU AI Act is the first big AI law. It sorts AI systems by risk (unacceptable, high, limited, minimal) and requires more transparency, human oversight and documentation as risk grows.",
      bn: "AI governance হলো দায়িত্বশীলভাবে AI ব্যবহারের নিয়ম, ভূমিকা ও যাচাইয়ের সমষ্টি। EU AI Act হলো প্রথম বড় AI আইন। এটি AI সিস্টেমকে ঝুঁকি অনুযায়ী ভাগ করে (unacceptable, high, limited, minimal) এবং ঝুঁকি বাড়লে বেশি স্বচ্ছতা, মানুষের তদারকি ও ডকুমেন্টেশন দাবি করে।",
    },
    ideas: {
      en: [
        "Know the risk level of what you build: hiring, credit scoring and health tools are usually high risk.",
        "Users must be told when they are talking to AI or seeing AI-generated content.",
        "Keep records of data, decisions and testing so you can show accountability.",
        "Assign an owner for each AI system in the organisation.",
      ],
      bn: [
        "যা বানাচ্ছেন তার ঝুঁকির স্তর জানুন: নিয়োগ, ঋণ স্কোরিং ও স্বাস্থ্য টুল সাধারণত উচ্চ ঝুঁকি।",
        "ইউজারকে জানাতে হবে তারা AI-র সাথে কথা বলছে বা AI-তৈরি কনটেন্ট দেখছে।",
        "ডেটা, সিদ্ধান্ত ও পরীক্ষার রেকর্ড রাখুন, দায়বদ্ধতা দেখাতে।",
        "প্রতিষ্ঠানে প্রতিটি AI সিস্টেমের জন্য একজন মালিক ঠিক করুন।",
      ],
    },
    tryIt: {
      en: "Think of a feature you might build (for example a CV screening assistant) and guess its risk category under the EU AI Act. Check your guess in the official explorer.",
      bn: "আপনি যে ফিচার বানাতে পারেন (যেমন CV স্ক্রিনিং সহকারী) তার EU AI Act ঝুঁকি-শ্রেণি অনুমান করুন। অফিশিয়াল এক্সপ্লোরারে মিলিয়ে দেখুন।",
    },
    refs: [
      { title: "EU AI Act Explorer", url: "https://artificialintelligenceact.eu/ai-act-explorer/", kind: "Tool" },
      { title: "European Commission: AI Act overview", url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai", kind: "Docs" },
      { title: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework", kind: "Docs" },
      { title: "Artificial Intelligence Act (Wikipedia)", url: "https://en.wikipedia.org/wiki/Artificial_Intelligence_Act", kind: "Wiki" },
      yt("EU AI Act explained for businesses"),
    ],
  },

  "ai-14": {
    basics: {
      en: "Voice and conversational AI lets people talk or chat with a system in natural language. Designing it means planning how the conversation flows, handling misunderstandings gracefully, and respecting that voice has no screen: users must remember what they heard.",
      bn: "Voice ও conversational AI মানুষকে স্বাভাবিক ভাষায় সিস্টেমের সাথে কথা বা চ্যাট করতে দেয়। এর ডিজাইনে কথোপকথনের প্রবাহ পরিকল্পনা, ভুল বোঝাবুঝি সুন্দরভাবে সামলানো এবং মনে রাখা দরকার যে ভয়েসে স্ক্রিন নেই: ইউজারকে যা শুনেছে তা মনে রাখতে হয়।",
    },
    ideas: {
      en: [
        "Keep voice replies short; give at most three options at a time.",
        "Always offer a way out: repeat, go back, or talk to a human.",
        "Confirm before risky actions ('Transfer 5,000 taka to Rahim, correct?').",
        "Test with real accents and noisy places. Support Bangla if your users speak it.",
      ],
      bn: [
        "ভয়েস উত্তর ছোট রাখুন; একসাথে সর্বোচ্চ তিনটি অপশন দিন।",
        "সবসময় বেরোনোর পথ দিন: আবার বলা, পেছনে যাওয়া বা মানুষের সাথে কথা।",
        "ঝুঁকিপূর্ণ কাজের আগে নিশ্চিত করুন ('রহিমকে ৫,০০০ টাকা পাঠাব, ঠিক?')।",
        "আসল উচ্চারণ ও কোলাহলপূর্ণ জায়গায় টেস্ট করুন। ইউজাররা বাংলায় কথা বললে বাংলা সমর্থন দিন।",
      ],
    },
    tryIt: {
      en: "Write a 6-turn dialogue script for a voice assistant that books a doctor appointment, including one misunderstanding and its recovery.",
      bn: "ডাক্তারের অ্যাপয়েন্টমেন্ট বুক করা একটি ভয়েস সহকারীর জন্য ৬ ধাপের সংলাপ লিখুন, একটি ভুল বোঝাবুঝি ও তার সমাধানসহ।",
    },
    refs: [
      { title: "Google Conversation Design", url: "https://developers.google.com/assistant/conversation-design/welcome", kind: "Docs" },
      { title: "NN/g: Intelligent Assistants Have Poor Usability", url: "https://www.nngroup.com/articles/intelligent-assistant-usability/", kind: "Article" },
      { title: "Anthropic: Building with Claude (guides)", url: "https://docs.anthropic.com/en/docs/build-with-claude/overview", kind: "Docs" },
      { title: "Conversational user interface (Wikipedia)", url: "https://en.wikipedia.org/wiki/Conversational_user_interface", kind: "Wiki" },
      yt("conversation design voice assistants"),
    ],
  },
}
