import type { LearningPlan } from "@/lib/learning-plan"
import { kvDelete, kvGetJson, kvListJson, kvSetJson } from "@/lib/kv"

const PREFIX = "plan:"
const keyFor = (email: string) => `${PREFIX}${email.toLowerCase().trim()}`

export async function getPlan(email: string): Promise<LearningPlan | null> {
  return kvGetJson<LearningPlan>(keyFor(email))
}

export async function getAllPlans(): Promise<LearningPlan[]> {
  return kvListJson<LearningPlan>(PREFIX)
}

export async function savePlan(plan: LearningPlan): Promise<LearningPlan> {
  const saved = { ...plan, email: plan.email.toLowerCase().trim(), updatedAt: new Date().toISOString() }
  await kvSetJson(keyFor(saved.email), saved)
  return saved
}

export async function deletePlan(email: string): Promise<void> {
  await kvDelete(keyFor(email))
}
