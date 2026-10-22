import { createBlocksClient } from "@seliseblocks/client"

export const blocksConfig = {
  apiUrl: process.env.NEXT_PUBLIC_BLOCKS_API_URL || "https://api.seliseblocks.com",
  appDomain: process.env.NEXT_PUBLIC_BLOCKS_APP_DOMAIN || "https://dlitay-eqicp.slsblx.com",
  xBlocksKey: process.env.NEXT_PUBLIC_BLOCKS_X_BLOCKS_KEY || "D5e5c23b9ebff4591908884d976138034",
  oidc: {
    clientId: process.env.NEXT_PUBLIC_BLOCKS_OIDC_CLIENT_ID || "fa1b7b0b-4b70-46b0-864c-2aeee2443b78",
    scope: process.env.NEXT_PUBLIC_BLOCKS_OIDC_SCOPE || "openid profile offline_access",
    url: process.env.NEXT_PUBLIC_BLOCKS_OIDC_URL || "https://iam.seliseblocks.com",
    redirectUri:
      typeof window !== "undefined"
        ? `${window.location.origin}/login/callback`
        : "https://dlitay-eqicp.slsblx.com/login/callback",
  },
}

/**
 * Global SELISE Blocks Client instance for the application
 */
export const blocksClient = createBlocksClient({
  apiUrl: blocksConfig.apiUrl,
  appDomain: blocksConfig.appDomain,
  xBlocksKey: blocksConfig.xBlocksKey,
  oidc: blocksConfig.oidc,
})

/**
 * Data Gateway Collections
 */
export interface CurriculumTopicRecord {
  id?: string
  topicId: string
  domainId: string
  domainTitle: string
  title: string
  level: string
  summary: string
  roles: string[]
}

export interface LearnerProgressRecord {
  id?: string
  userId: string
  userEmail: string
  topicId: string
  status: "COMPLETED" | "IN_PROGRESS" | "PLANNED"
  completedAt?: string
}

export interface LearnerNoteRecord {
  id?: string
  userId: string
  userEmail: string
  topicId: string
  content: string
  isPublic: boolean
}

export const curriculumTopicsCollection = blocksClient.data.collection<CurriculumTopicRecord>("CurriculumTopic", {
  fields: ["topicId", "domainId", "domainTitle", "title", "level", "summary", "roles"],
})

export const learnerProgressCollection = blocksClient.data.collection<LearnerProgressRecord>("LearnerProgress", {
  fields: ["userId", "userEmail", "topicId", "status", "completedAt"],
})

export const learnerNotesCollection = blocksClient.data.collection<LearnerNoteRecord>("LearnerNote", {
  fields: ["userId", "userEmail", "topicId", "content", "isPublic"],
})
