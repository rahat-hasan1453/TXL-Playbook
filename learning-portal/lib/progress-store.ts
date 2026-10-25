import fs from "fs"
import path from "path"
import { PodLearner } from "@/components/UnitHeadManagementView"

const DATA_DIR = path.join(process.cwd(), ".data")
const DATA_FILE = path.join(DATA_DIR, "learner-progress.json")

interface StoredLearnersMap {
  [email: string]: PodLearner
}

// In-memory cache
let learnersCache: StoredLearnersMap | null = null

function ensureDataFile(): StoredLearnersMap {
  if (learnersCache) return learnersCache

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8")
      learnersCache = JSON.parse(content)
      return learnersCache!
    }
  } catch (err) {
    console.warn("Failed to read progress store file, using fallback cache:", err)
  }

  // Initial seed with active platform learners
  learnersCache = {
    "rahat.akash1453@gmail.com": {
      id: "learner-akash",
      name: "Nico Paz",
      email: "rahat.akash1453@gmail.com",
      role: "Cloud Systems Engineer",
      avatar: "NP",
      progress: {
        "biz-1": "COMPLETED", // Business Model Canvas from screenshot
      },
      notes: {},
    },
    "rahat.hasan1453@gmail.com": {
      id: "learner-enzo",
      name: "Enzo Farnendes",
      email: "rahat.hasan1453@gmail.com",
      role: "Product Engineer",
      avatar: "EF",
      progress: {},
      notes: {},
    },
  }

  saveDataFile(learnersCache)
  return learnersCache
}

function saveDataFile(data: StoredLearnersMap) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.warn("Failed to write to progress store file:", err)
  }
}

/**
 * Gets or creates learner record
 */
export function getOrCreateLearner(
  email: string,
  name?: string,
  role?: string,
  avatar?: string,
  userId?: string
): PodLearner {
  const data = ensureDataFile()
  const key = email.toLowerCase().trim()

  if (!data[key]) {
    const derivedName = name || email.split("@")[0]
    const derivedAvatar =
      avatar ||
      derivedName
        .split(" ")
        .map((s) => s[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) ||
      "LN"

    data[key] = {
      id: userId || `learner-${Date.now()}`,
      name: derivedName,
      email: key,
      role: role || "Cloud Systems Engineer",
      avatar: derivedAvatar,
      progress: {},
      notes: {},
    }
    saveDataFile(data)
  } else {
    // Update name/role if provided
    if (name && data[key].name !== name) data[key].name = name
    if (role && data[key].role !== role) data[key].role = role
    if (avatar && data[key].avatar !== avatar) data[key].avatar = avatar
    saveDataFile(data)
  }

  return data[key]
}

/**
 * Updates a topic's progress for a specific learner
 */
export function updateLearnerTopicProgress(
  email: string,
  topicId: string,
  status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED",
  name?: string,
  role?: string,
  avatar?: string,
  userId?: string
): PodLearner {
  const learner = getOrCreateLearner(email, name, role, avatar, userId)
  const data = ensureDataFile()
  const key = email.toLowerCase().trim()

  if (status === "NOT_STARTED") {
    delete learner.progress[topicId]
  } else {
    learner.progress[topicId] = status
  }

  data[key] = learner
  saveDataFile(data)
  return learner
}

/**
 * Saves a personal note for a learner on a topic
 */
export function saveLearnerTopicNote(
  email: string,
  topicId: string,
  content: string
): PodLearner {
  const learner = getOrCreateLearner(email)
  const data = ensureDataFile()
  const key = email.toLowerCase().trim()

  if (!content.trim()) {
    delete learner.notes[topicId]
  } else {
    learner.notes[topicId] = content.trim()
  }

  data[key] = learner
  saveDataFile(data)
  return learner
}

/**
 * Returns all registered learners with their progress for Unit Head view
 */
export function getAllLearners(): PodLearner[] {
  const data = ensureDataFile()
  return Object.values(data)
}

/**
 * Returns learner progress record for active session
 */
export function getLearnerProgress(email: string): Record<string, "COMPLETED" | "IN_PROGRESS"> {
  const learner = getOrCreateLearner(email)
  return learner.progress || {}
}

/**
 * Returns notes record for active session
 */
export function getLearnerNotes(email: string): Record<string, string> {
  const learner = getOrCreateLearner(email)
  return learner.notes || {}
}
