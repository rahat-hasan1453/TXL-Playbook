import fs from "fs"
import path from "path"
import { CURRICULUM_DOMAINS, Domain } from "@/lib/curriculumData"

const DATA_DIR = path.join(process.cwd(), ".data")
const CURRICULUM_FILE = path.join(DATA_DIR, "curriculum.json")

export function loadCurriculumFromDisk(): Domain[] {
  try {
    if (fs.existsSync(CURRICULUM_FILE)) {
      const raw = fs.readFileSync(CURRICULUM_FILE, "utf-8")
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (err) {
    console.warn("Failed to read curriculum from disk:", err)
  }
  return CURRICULUM_DOMAINS
}

export function saveCurriculumToDisk(domains: Domain[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(CURRICULUM_FILE, JSON.stringify(domains, null, 2), "utf-8")
  } catch (err) {
    console.warn("Failed to save curriculum to disk:", err)
  }
}
