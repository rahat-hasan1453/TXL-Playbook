# TXL Learning & Competency Portal

An interactive web portal based on **Chapter 15 ("What to learn")** of the [TXL Playbook 2026](https://txlplaybook.netlify.app/).

## Features

### 1. Learner View
- **Curriculum Browser:** Complete listing of all 9 domains and 74+ competencies extracted directly from the TXL Playbook.
- **Search & Role Filtering:** Filter topics by role (`Everyone`, `Consultant`, `Service Designer`, `AI PM`, `Engineer`) or search by keyword.
- **Progress Tracking ("Mark as Done"):** One-click toggle between `Not Started`, `In Progress`, and `Completed`.
- **Personal Notes:** Add, edit, and save private markdown/text notes on any topic.
- **Share Learnings:** Publish key takeaways to the internal team feed.
- **Real-time Progress Calculation:** Dynamic calculation of completed competencies and percentage completion.

### 2. Unit Head / Leadership Dashboard
- **Aggregate Metrics:**
  - Active learners count
  - Overall organization completion percentage
  - Highest velocity domains and competencies needing attention
- **Individual User Drill-down:**
  - Select any team member to see their specific domain progress bars, completed topics, and personal notes.

### 3. Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (TXL Playbook dark-mode aesthetic)
- **Icons:** Lucide React
- **Database Schema:** Prisma ORM with models for User, Domain, Topic, UserProgress, UserNote, and SharedLearning (`prisma/schema.prisma`).

---

## Getting Started

Inside the `learning-portal` folder:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.
