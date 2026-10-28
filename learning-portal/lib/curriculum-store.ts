import { CURRICULUM_DOMAINS, Domain } from "@/lib/curriculumData"
import { kvGetJson, kvSetJson } from "@/lib/kv"

const KEY = "curriculum"

export async function loadCurriculumFromDisk(): Promise<Domain[]> {
  const stored = await kvGetJson<Domain[]>(KEY)
  return Array.isArray(stored) && stored.length > 0 ? stored : CURRICULUM_DOMAINS
}

export async function saveCurriculumToDisk(domains: Domain[]): Promise<void> {
  await kvSetJson(KEY, domains)
}
