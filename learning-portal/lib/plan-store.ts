import fs from "fs"
import path from "path"
import type { LearningPlan } from "@/lib/learning-plan"

const DATA_DIR = path.join(process.cwd(), ".data")
const DATA_FILE = path.join(DATA_DIR, "learning-plans.json")

type PlansMap = Record<string, LearningPlan>

let plansCache: PlansMap | null = null

function loadPlans(): PlansMap {
  if (plansCache) return plansCache
  try {
    if (fs.existsSync(DATA_FILE)) {
      plansCache = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))
      return plansCache!
    }
  } catch (err) {
    console.warn("Failed to read learning plans file:", err)
  }
  plansCache = {}
  return plansCache
}

function savePlans(data: PlansMap) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.warn("Failed to write learning plans file:", err)
  }
}

export function getPlan(email: string): LearningPlan | null {
  return loadPlans()[email.toLowerCase().trim()] || null
}

export function getAllPlans(): LearningPlan[] {
  return Object.values(loadPlans())
}

export function savePlan(plan: LearningPlan): LearningPlan {
  const data = loadPlans()
  const key = plan.email.toLowerCase().trim()
  data[key] = { ...plan, email: key, updatedAt: new Date().toISOString() }
  savePlans(data)
  return data[key]
}

export function deletePlan(email: string) {
  const data = loadPlans()
  delete data[email.toLowerCase().trim()]
  savePlans(data)
}
