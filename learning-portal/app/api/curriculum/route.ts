import { NextResponse } from "next/server"
import { Domain } from "@/lib/curriculumData"
import { loadCurriculumFromDisk, saveCurriculumToDisk } from "@/lib/curriculum-store"
import { getServerSession } from "@/lib/auth"

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
