import type { PodLearner } from "@/components/UnitHeadManagementView"
import { kvGetJson, kvListJson, kvMode, kvSetJson } from "@/lib/kv"

// One record per learner: progress per topic plus personal notes.
const PREFIX = "learner:"
const keyFor = (email: string) => `${PREFIX}${email.toLowerCase().trim()}`

// Local development starts with two demo learners
const DEMO_LEARNERS: PodLearner[] = [
  {
    id: "learner-akash",
    name: "Nico Paz",
    email: "rahat.akash1453@gmail.com",
    role: "Cloud Systems Engineer",
    avatar: "NP",
    progress: { "biz-1": "COMPLETED" },
    notes: {},
  },
  {
    id: "learner-enzo",
    name: "Enzo Farnendes",
    email: "rahat.hasan1453@gmail.com",
    role: "Product Engineer",
    avatar: "EF",
    progress: {},
    notes: {},
  },
]

let seeded = false
async function seedDemoLearners() {
  if (seeded || kvMode() !== "file") return
  seeded = true
  for (const learner of DEMO_LEARNERS) {
    if (!(await kvGetJson(keyFor(learner.email)))) await kvSetJson(keyFor(learner.email), learner)
  }
}

/** Gets or creates a learner record. */
export async function getOrCreateLearner(
  email: string,
  name?: string,
  role?: string,
  avatar?: string,
  userId?: string
): Promise<PodLearner> {
  await seedDemoLearners()
  const key = email.toLowerCase().trim()
  const existing = await kvGetJson<PodLearner>(keyFor(key))

  if (!existing) {
    const derivedName = name || key.split("@")[0]
    const created: PodLearner = {
      id: userId || `learner-${Date.now()}`,
      name: derivedName,
      email: key,
      role: role || "Cloud Systems Engineer",
      avatar:
        avatar ||
        derivedName
          .split(" ")
          .map((s) => s[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) ||
        "LN",
      progress: {},
      notes: {},
    }
    await kvSetJson(keyFor(key), created)
    return created
  }

  // Keep display details current, writing only when something changed
  let changed = false
  if (name && existing.name !== name) (existing.name = name), (changed = true)
  if (role && existing.role !== role) (existing.role = role), (changed = true)
  if (avatar && existing.avatar !== avatar) (existing.avatar = avatar), (changed = true)
  if (changed) await kvSetJson(keyFor(key), existing)
  return existing
}

/** Updates a topic's progress for a learner. */
export async function updateLearnerTopicProgress(
  email: string,
  topicId: string,
  status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED",
  name?: string,
  role?: string,
  avatar?: string,
  userId?: string
): Promise<PodLearner> {
  const learner = await getOrCreateLearner(email, name, role, avatar, userId)
  if (status === "NOT_STARTED") delete learner.progress[topicId]
  else learner.progress[topicId] = status
  await kvSetJson(keyFor(email), learner)
  return learner
}

/** Saves (or clears) a learner's personal note on a topic. */
export async function saveLearnerTopicNote(email: string, topicId: string, content: string): Promise<PodLearner> {
  const learner = await getOrCreateLearner(email)
  if (!content.trim()) delete learner.notes[topicId]
  else learner.notes[topicId] = content.trim()
  await kvSetJson(keyFor(email), learner)
  return learner
}

/** All registered learners with their progress, for the Unit Head view. */
export async function getAllLearners(): Promise<PodLearner[]> {
  await seedDemoLearners()
  return kvListJson<PodLearner>(PREFIX)
}

export async function getLearnerProgress(email: string): Promise<Record<string, "COMPLETED" | "IN_PROGRESS">> {
  return (await getOrCreateLearner(email)).progress || {}
}

export async function getLearnerNotes(email: string): Promise<Record<string, string>> {
  return (await getOrCreateLearner(email)).notes || {}
}
