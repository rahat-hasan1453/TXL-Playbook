import { GuideMap, TopicGuide } from "./types"
import { BUSINESS_GUIDES } from "./business"
import { PRODUCT_GUIDES } from "./product"
import { SERVICE_GUIDES } from "./service"
import { AI_GUIDES } from "./ai"
import { DEV_GUIDES } from "./dev"
import { DATA_GUIDES, GROWTH_GUIDES } from "./data-growth"
import { SECURITY_GUIDES, CONSULTING_GUIDES } from "./security-consulting"

export type { Lang, TopicGuide, GuideRef, RefKind } from "./types"

const GUIDES: GuideMap = {
  ...BUSINESS_GUIDES,
  ...PRODUCT_GUIDES,
  ...SERVICE_GUIDES,
  ...AI_GUIDES,
  ...DEV_GUIDES,
  ...DATA_GUIDES,
  ...GROWTH_GUIDES,
  ...SECURITY_GUIDES,
  ...CONSULTING_GUIDES,
}

/** Beginner guide for a topic id, or undefined for topics added later by a Unit Head. */
export function getTopicGuide(topicId: string): TopicGuide | undefined {
  return GUIDES[topicId]
}

export const GUIDE_TOPIC_COUNT = Object.keys(GUIDES).length
