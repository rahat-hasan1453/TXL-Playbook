import { NextResponse } from 'next/server';
import { CURRICULUM_DOMAINS } from '@/lib/curriculumData';

export async function GET() {
  return NextResponse.json({
    domains: CURRICULUM_DOMAINS,
    totalDomains: CURRICULUM_DOMAINS.length,
    totalTopics: CURRICULUM_DOMAINS.reduce((acc, d) => acc + d.topics.length, 0),
  });
}
