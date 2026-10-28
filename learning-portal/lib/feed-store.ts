import { kvGetJson, kvSetJson } from "@/lib/kv"

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

const FEED_KEY = "feed"

const SEED_FEED: SharedLearningItem[] = [
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

export async function getSharedFeed(): Promise<SharedLearningItem[]> {
  const feed = await kvGetJson<SharedLearningItem[]>(FEED_KEY)
  if (feed) return feed
  await kvSetJson(FEED_KEY, SEED_FEED)
  return SEED_FEED
}

export async function addSharedLearning(
  item: Omit<SharedLearningItem, "id" | "timestamp" | "likes">
): Promise<SharedLearningItem> {
  const current = await getSharedFeed()
  const newItem: SharedLearningItem = {
    ...item,
    id: `sh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: "Just now",
    likes: 0,
  }
  await kvSetJson(FEED_KEY, [newItem, ...current])
  return newItem
}

export async function likeSharedLearning(id: string): Promise<SharedLearningItem | null> {
  const current = await getSharedFeed()
  const item = current.find((i) => i.id === id)
  if (!item) return null
  item.likes += 1
  await kvSetJson(FEED_KEY, current)
  return item
}
