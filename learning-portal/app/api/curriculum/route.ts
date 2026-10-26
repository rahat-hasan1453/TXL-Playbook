import { NextResponse } from "next/server"
import { CURRICULUM_DOMAINS, Domain } from "@/lib/curriculumData"
import { getServerSession } from "@/lib/auth"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), ".data")
const CURRICULUM_FILE = path.join(DATA_DIR, "curriculum.json")

function loadCurriculumFromDisk(): Domain[] {
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

function saveCurriculumToDisk(domains: Domain[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(CURRICULUM_FILE, JSON.stringify(domains, null, 2), "utf-8")
  } catch (err) {
    console.warn("Failed to save curriculum to disk:", err)
  }
}

export async function GET() {
  const domains = loadCurriculumFromDisk()
  return NextResponse.json({
    domains,
    totalDomains: domains.length,
    totalTopics: domains.reduce((acc, d) => acc + d.topics.length, 0),
  })
}

export async function PUT(req: Request) {
  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  if (session.user.role !== "UNIT_HEAD") {
    return NextResponse.json({ error: "Only Unit Heads can modify curriculum" }, { status: 403 })
  }

  const body = await req.json()
  const { domains } = body

  if (!Array.isArray(domains) || domains.length === 0) {
    return NextResponse.json({ error: "Invalid domains payload" }, { status: 400 })
  }

  saveCurriculumToDisk(domains)

  return NextResponse.json({
    success: true,
    totalDomains: domains.length,
    totalTopics: domains.reduce((acc, d: Domain) => acc + d.topics.length, 0),
  })
}
