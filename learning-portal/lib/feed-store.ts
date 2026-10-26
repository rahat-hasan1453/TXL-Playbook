import fs from "fs"
import path from "path"

export interface SharedLearningItem {
  id: string
  userName: string
  userRole: string
  topicTitle: string
  domainName: string
  note: string
  timestamp: string
  likes: number
}

const DATA_DIR = path.join(process.cwd(), ".data")
const FEED_FILE = path.join(DATA_DIR, "shared-feed.json")

function loadFeedFromDisk(): SharedLearningItem[] {
  try {
    if (fs.existsSync(FEED_FILE)) {
      const raw = fs.readFileSync(FEED_FILE, "utf-8")
      return JSON.parse(raw)
    }
  } catch (err) {
    console.warn("Failed to read feed from disk:", err)
  }

  // Pre-seed with high-signal baseline takeaways
  const initialFeed: SharedLearningItem[] = [
    {
      id: "sh-seed-1",
      userName: "Nico Paz",
      userRole: "Cloud Systems Engineer",
      topicTitle: "Business Model Canvas",
      domainName: "Business",
      note: "Applied the BMC framework to map out cloud multi-tenant infrastructure costs vs tier-based client value. Essential for unit economics.",
      timestamp: "Just now",
      likes: 2,
    },
    {
      id: "sh-seed-2",
      userName: "Enzo Farnendes",
      userRole: "Product Engineer",
      topicTitle: "PRD writing",
      domainName: "Product",
      note: "When authoring spec-driven PRDs for autonomous coding agents, explicit acceptance criteria and JSON payload schemas eliminate 90% of regressions.",
      timestamp: "2 hours ago",
      likes: 4,
    },
  ]

  saveFeedToDisk(initialFeed)
  return initialFeed
}

function saveFeedToDisk(feed: SharedLearningItem[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(FEED_FILE, JSON.stringify(feed, null, 2), "utf-8")
  } catch (err) {
    console.warn("Failed to save feed to disk:", err)
  }
}

let feedCache: SharedLearningItem[] | null = null

export function getSharedFeed(): SharedLearningItem[] {
  if (!feedCache) {
    feedCache = loadFeedFromDisk()
  }
  return feedCache
}

export function addSharedLearning(item: Omit<SharedLearningItem, "id" | "timestamp" | "likes">): SharedLearningItem {
  const current = getSharedFeed()
  const newItem: SharedLearningItem = {
    ...item,
    id: `sh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: "Just now",
    likes: 0,
  }
  const next = [newItem, ...current]
  feedCache = next
  saveFeedToDisk(next)
  return newItem
}

export function likeSharedLearning(id: string): SharedLearningItem | null {
  const current = getSharedFeed()
  const item = current.find((i) => i.id === id)
  if (item) {
    item.likes += 1
    saveFeedToDisk(current)
    return item
  }
  return null
}
