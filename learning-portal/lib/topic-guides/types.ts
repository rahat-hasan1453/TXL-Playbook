// Beginner guide shown for every curriculum topic, in English and Bangla.
// Content lives apart from the curriculum so Unit Head edits to topics never wipe it.

export type Lang = "en" | "bn"

export interface Bi<T = string> {
  en: T
  bn: T
}

export type RefKind = "Article" | "Docs" | "Course" | "Book" | "Wiki" | "Video" | "Tool"

export interface GuideRef {
  title: string
  url: string
  kind: RefKind
}

export interface TopicGuide {
  /** Plain-language explanation for someone who has never heard of the topic. */
  basics: Bi
  /** The handful of ideas worth remembering. */
  ideas: Bi<string[]>
  /** One small thing to try right now. */
  tryIt: Bi
  /** Five places to go deeper (four curated links and one video search). */
  refs: GuideRef[]
}

export type GuideMap = Record<string, TopicGuide>

/** Builds a YouTube search link, so a "watch it explained" option never goes stale. */
export function yt(query: string): GuideRef {
  return {
    title: `Watch: ${query}`,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    kind: "Video",
  }
}
