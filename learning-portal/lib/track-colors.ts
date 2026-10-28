// One color per career track so a topic's origin is readable at a glance.
// Class strings are written out in full so Tailwind can see them.

export interface TrackColor {
  text: string
  chip: string // small badge: tinted bg + border + text
  card: string // selected-state surface
  bar: string // solid accent (progress bars, left rails)
  dot: string
  planCard: string // calendar card
  banner: string // solid unit banner, dark enough for white text
  stroke: string // SVG stroke (progress ring)
  edge: string // thick bottom edge of a selected 3D tile
}

export const TRACK_COLORS: Record<string, TrackColor> = {
  ALL: {
    text: "text-rose-400",
    chip: "bg-rose-950/50 text-rose-300 border-rose-800/50",
    card: "border-rose-500/70 ring-1 ring-rose-500/30",
    bar: "bg-rose-500",
    dot: "bg-rose-500",
    planCard: "bg-rose-950/30 border-rose-800/50",
    banner: "bg-rose-700",
    stroke: "stroke-rose-400",
    edge: "border-b-rose-700",
  },
  Consultant: {
    text: "text-amber-400",
    chip: "bg-amber-950/50 text-amber-300 border-amber-800/50",
    card: "border-amber-500/70 ring-1 ring-amber-500/30",
    bar: "bg-amber-500",
    dot: "bg-amber-500",
    planCard: "bg-amber-950/30 border-amber-800/50",
    banner: "bg-amber-700",
    stroke: "stroke-amber-400",
    edge: "border-b-amber-700",
  },
  "Service Designer": {
    text: "text-violet-400",
    chip: "bg-violet-950/50 text-violet-300 border-violet-800/50",
    card: "border-violet-500/70 ring-1 ring-violet-500/30",
    bar: "bg-violet-500",
    dot: "bg-violet-500",
    planCard: "bg-violet-950/30 border-violet-800/50",
    banner: "bg-violet-700",
    stroke: "stroke-violet-400",
    edge: "border-b-violet-700",
  },
  "AI PM": {
    text: "text-emerald-400",
    chip: "bg-emerald-950/50 text-emerald-300 border-emerald-800/50",
    card: "border-emerald-500/70 ring-1 ring-emerald-500/30",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
    planCard: "bg-emerald-950/30 border-emerald-800/50",
    banner: "bg-emerald-700",
    stroke: "stroke-emerald-400",
    edge: "border-b-emerald-700",
  },
  Engineer: {
    text: "text-sky-400",
    chip: "bg-sky-950/50 text-sky-300 border-sky-800/50",
    card: "border-sky-500/70 ring-1 ring-sky-500/30",
    bar: "bg-sky-500",
    dot: "bg-sky-500",
    planCard: "bg-sky-950/30 border-sky-800/50",
    banner: "bg-sky-700",
    stroke: "stroke-sky-400",
    edge: "border-b-sky-700",
  },
}

export const COMPULSORY_COLOR = {
  text: "text-blue-400",
  chip: "bg-blue-950/60 text-blue-300 border-blue-700/60",
  bar: "bg-blue-500",
  card: "bg-blue-950/20 border-blue-800/50",
  planCard: "bg-blue-950/30 border-blue-800/50",
  banner: "bg-blue-700",
}

export function trackColor(key: string): TrackColor {
  return TRACK_COLORS[key] || TRACK_COLORS.ALL
}

/** The first of the given tracks that a topic belongs to. */
export function topicTrack(roles: string[], tracks: readonly string[]): string | null {
  return tracks.find((t) => roles.includes(t)) || null
}
