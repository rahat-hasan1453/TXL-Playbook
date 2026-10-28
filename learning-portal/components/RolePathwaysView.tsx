"use client"

import React, { useState, useMemo } from "react"
import { CURRICULUM_DOMAINS, Domain, Topic } from "@/lib/curriculumData"
import { noteToPlainText } from "@/lib/note-content"
import { COMPULSORY_COLOR, trackColor } from "@/lib/track-colors"
import {
  Compass,
  Briefcase,
  Layers,
  Cpu,
  Code,
  CheckCircle2,
  Circle,
  Clock,
  Share2,
  FileText,
  Search,
  Sparkles,
  TrendingUp,
  Check,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Star,
  X
} from "lucide-react"

export interface RoleTrackConfig {
  key: string // "ALL" | "Consultant" | "Service Designer" | "AI PM" | "Engineer"
  code: string
  label: string
  title: string
  subtitle: string
  description: string
  badge: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
}

export const ROLE_TRACKS: RoleTrackConfig[] = [
  {
    key: "ALL",
    code: "all",
    label: "All topics",
    title: "All Organizational Competencies",
    subtitle: "All Domains",
    description: "Every competency defined in Chapter 15 of the TXL Playbook 2026. Topics tagged 'Everyone' form the universal shared baseline required across all delivery pods.",
    badge: "All Domains",
    icon: Compass,
  },
  {
    key: "Consultant",
    code: "c",
    label: "Product Consultant",
    title: "Product Consultant Track",
    subtitle: "Commercial Architecture & Advisory",
    description: "Master commercial framing, business model canvas, unit economics (LTV/CAC), pricing models, competitive advantage (Porter's Five Forces, 7 Powers), proposals, and signed SOWs.",
    badge: "Commercial Track",
    icon: Briefcase,
  },
  {
    key: "Service Designer",
    code: "sd",
    label: "Service Designer",
    title: "Service Designer Track",
    subtitle: "System & Experience Architecture",
    description: "Specialize in end-to-end customer journey mapping, service blueprints, Design Thinking & Double Diamond, usability heuristics, design systems, and cross-channel touchpoint orchestration.",
    badge: "Design Track",
    icon: Layers,
  },
  {
    key: "AI PM",
    code: "pm",
    label: "AI Product Manager",
    title: "AI Product Manager Track",
    subtitle: "Spec-Driven Strategy & Agentic Delivery",
    description: "Master writing executable PRDs and specs for AI agents, Opportunity Solution Trees, Jobs-To-Be-Done, North Star metrics, Lean Startup experiments, prompt evaluation, and RAG architectures.",
    badge: "AI & Product Track",
    icon: Cpu,
  },
  {
    key: "Engineer",
    code: "e",
    label: "Product Engineer",
    title: "Product Engineer Track",
    subtitle: "Autonomous Agent Engineering & Web Architecture",
    description: "Build production software with Next.js App Router, TypeScript, LLM context grounding & function calling, vector search, automated Playwright testing, and security hardening (OWASP).",
    badge: "Engineering Track",
    icon: Code,
  },
]

interface RolePathwaysViewProps {
  progressState: Record<string, "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | undefined>
  onToggleStatus: (topicId: string) => void
  userNotes: Record<string, string>
  onOpenNotes: (topic: Topic) => void
  onOpenShare: (topic: Topic) => void
  activeRoleKey?: string
  onRoleChange?: (roleKey: string) => void
  domains?: Domain[]
}

export default function RolePathwaysView({
  progressState,
  onToggleStatus,
  userNotes,
  onOpenNotes,
  onOpenShare,
  activeRoleKey = "Service Designer",
  onRoleChange,
  domains,
}: RolePathwaysViewProps) {
  const activeDomains = useMemo(() => domains || CURRICULUM_DOMAINS, [domains])

  // Current role selection
  const [internalRoleKey, setInternalRoleKey] = useState<string>(activeRoleKey)
  const currentRoleKey = onRoleChange ? activeRoleKey : internalRoleKey

  const handleRoleSelect = (roleKey: string) => {
    if (onRoleChange) {
      onRoleChange(roleKey)
    } else {
      setInternalRoleKey(roleKey)
    }
  }

  const activeColor = trackColor(currentRoleKey)

  // Search query inside the role view
  const [searchQuery, setSearchQuery] = useState("")

  // Track collapsed domains - Domain 1 (index 0) open by default, rest collapsed
  const [collapsedDomainIds, setCollapsedDomainIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    activeDomains.forEach((d, idx) => {
      initial[d.id] = idx !== 0
    })
    return initial
  })

  // Find active track config
  const activeRole = useMemo(() => {
    return ROLE_TRACKS.find((r) => r.key === currentRoleKey) || ROLE_TRACKS[2] // defaults to Service Designer
  }, [currentRoleKey])

  // Count topics for each role track in the sidebar
  const topicCountsByRole = useMemo(() => {
    const all = activeDomains.flatMap((d) => d.topics)
    const counts: Record<string, number> = { ALL: all.length }
    ROLE_TRACKS.forEach((r) => {
      if (r.key !== "ALL") {
        counts[r.key] = all.filter(
          (t) => t.roles.includes("Everyone") || t.roles.includes(r.key)
        ).length
      }
    })
    return counts
  }, [activeDomains])

  // All topics belonging to the currently selected role
  const allRoleTopics = useMemo(() => {
    const all = activeDomains.flatMap((d) => d.topics)
    if (currentRoleKey === "ALL") return all
    return all.filter((t) => t.roles.includes("Everyone") || t.roles.includes(currentRoleKey))
  }, [currentRoleKey, activeDomains])

  // Metrics for this role
  const totalInRole = allRoleTopics.length
  const completedInRole = useMemo(() => {
    return allRoleTopics.filter((t) => progressState[t.id] === "COMPLETED").length
  }, [allRoleTopics, progressState])

  const inProgressInRole = useMemo(() => {
    return allRoleTopics.filter((t) => progressState[t.id] === "IN_PROGRESS").length
  }, [allRoleTopics, progressState])

  const readinessPercentage = totalInRole ? Math.round((completedInRole / totalInRole) * 100) : 0

  const baselineCount = useMemo(() => {
    return allRoleTopics.filter((t) => t.roles.includes("Everyone")).length
  }, [allRoleTopics])

  const specialistCount = totalInRole - baselineCount

  // Filter domains and topics for the active role tab
  const filteredRoleDomains = useMemo(() => {
    return activeDomains.map((domain) => {
      // 1. Filter topics matching role
      const roleTopics = domain.topics.filter((topic) => {
        if (currentRoleKey === "ALL") return true
        return topic.roles.includes("Everyone") || topic.roles.includes(currentRoleKey)
      })

      // 2. Filter topics by search query
      const visibleTopics = roleTopics.filter((topic) => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
          topic.title.toLowerCase().includes(q) ||
          topic.description.toLowerCase().includes(q) ||
          topic.roles.some((r) => r.toLowerCase().includes(q))
        )
      })

      const completedInDomain = roleTopics.filter((t) => progressState[t.id] === "COMPLETED").length

      return {
        ...domain,
        // Compulsory topics first, curriculum order otherwise
        topics: [...visibleTopics].sort(
          (a, b) => Number(b.roles.includes("Everyone")) - Number(a.roles.includes("Everyone"))
        ),
        compulsoryCount: roleTopics.filter((t) => t.roles.includes("Everyone")).length,
        totalRoleTopics: roleTopics.length,
        completedInDomain,
      }
    }).filter((d) => d.totalRoleTopics > 0)
  }, [activeDomains, currentRoleKey, searchQuery, progressState])

  const toggleDomainCollapse = (domainId: string) => {
    setCollapsedDomainIds((prev) => ({
      ...prev,
      [domainId]: !prev[domainId],
    }))
  }

  // Progress ring geometry
  const RING_R = 34
  const RING_C = 2 * Math.PI * RING_R

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 w-full">
      {/* Track picker */}
      <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-24 self-start" aria-label="Learning tracks">
        <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug mb-4">
          Choose your
          <br />
          learning track
        </h2>

        <div className="flex flex-col gap-2.5">
          {ROLE_TRACKS.map((track) => {
            const isSelected = currentRoleKey === track.key
            const Icon = track.icon
            const count = topicCountsByRole[track.key] || 0
            const color = trackColor(track.key)

            return (
              <button
                key={track.key}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleRoleSelect(track.key)}
                className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all bg-[#121316] ${
                  isSelected
                    ? `border-2 border-b-[5px] ${color.card.split(" ")[0]} ${color.edge}`
                    : "border border-zinc-800/80 border-b-4 border-b-zinc-700/70 hover:border-zinc-600"
                }`}
              >
                <span className={`w-10 h-10 rounded-full flex items-center justify-center text-white on-solid shrink-0 ${color.bar}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block font-bold text-sm leading-tight truncate ${isSelected ? "text-white" : "text-zinc-200"}`}>
                    {track.label}
                  </span>
                  <span className="block text-[11px] mt-0.5 text-zinc-400 truncate">{track.subtitle}</span>
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold shrink-0 border ${
                    isSelected ? color.chip : "bg-[#0e0f12] text-zinc-400 border-zinc-800"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </aside>

      {/* Main */}
      <section className="flex-1 min-w-0 space-y-6 w-full">
        {/* Hero with progress ring */}
        <div className="bg-[#121316] border border-zinc-800/80 border-b-4 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5">
          <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0" role="img" aria-label={`${readinessPercentage}% ready`}>
            <circle cx="48" cy="48" r={RING_R} fill="none" strokeWidth="11" className="stroke-zinc-800" />
            <circle
              cx="48"
              cy="48"
              r={RING_R}
              fill="none"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - readinessPercentage / 100)}
              transform="rotate(-90 48 48)"
              className={`${activeColor.stroke} transition-all duration-500`}
            />
            <text x="48" y="54" textAnchor="middle" className="fill-white text-[18px] font-extrabold">
              {readinessPercentage}%
            </text>
          </svg>
          <div className="min-w-0 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{activeRole.title}</h1>
            <p className="text-sm text-zinc-400">
              <span className="text-white font-bold">{completedInRole}</span> of {totalInRole} topics done
              {inProgressInRole > 0 && <> · {inProgressInRole} in progress</>} · {totalInRole - completedInRole} to go
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`flex items-center gap-1.5 font-semibold px-3 py-1 rounded-full border ${COMPULSORY_COLOR.chip}`}>
                <Star className="w-3.5 h-3.5" /> {baselineCount} compulsory
              </span>
              {currentRoleKey !== "ALL" && (
                <span className={`flex items-center gap-1.5 font-semibold px-3 py-1 rounded-full border ${activeColor.chip}`}>
                  <Sparkles className="w-3.5 h-3.5" /> {specialistCount} specialist
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            aria-label={`Search ${activeRole.label} topics`}
            placeholder={`Search ${activeRole.label} topics (Next.js, RAG, unit economics, JTBD)`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121316] border border-zinc-800 border-b-4 focus:border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-2xl pl-10 pr-9 py-3 text-sm focus:outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Domains */}
        <div className="space-y-4">
          {filteredRoleDomains.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-[#121316]">
              <Search className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-white">No matching topics</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                Nothing in {activeRole.label} matches your search. Try another word.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 border-b-4"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredRoleDomains.map((domain, domainIndex) => {
              const isCollapsed = collapsedDomainIds[domain.id] === true
              const domainPct = domain.totalRoleTopics
                ? Math.round((domain.completedInDomain / domain.totalRoleTopics) * 100)
                : 0

              return (
                <div
                  key={domain.id}
                  className={`rounded-2xl overflow-hidden bg-[#121316] border border-zinc-800/80 border-b-4 ${activeColor.edgeSoft}`}
                >
                  {/* Unit banner */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={!isCollapsed}
                    onClick={() => toggleDomainCollapse(domain.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        toggleDomainCollapse(domain.id)
                      }
                    }}
                    className={`px-4 sm:px-5 py-4 flex items-center gap-4 cursor-pointer select-none hover:bg-zinc-800/30 transition ${
                      isCollapsed ? "" : "border-b border-zinc-800/80"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className={`text-[11px] font-bold uppercase tracking-wide ${activeColor.text}`}>
                        Unit {domainIndex + 1}
                        {domain.compulsoryCount > 0 &&
                          ` · ${domain.compulsoryCount === domain.totalRoleTopics ? "All compulsory" : `${domain.compulsoryCount} compulsory`}`}
                      </p>
                      <h3 className="text-base sm:text-lg font-extrabold text-white truncate">{domain.name}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-1">{domain.focus}</p>
                    </div>
                    <div className="hidden sm:block w-28">
                      <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div className={`h-full rounded-full ${activeColor.bar} transition-all`} style={{ width: `${domainPct}%` }} />
                      </div>
                    </div>
                    <span className={`shrink-0 text-xs font-bold rounded-full border px-2.5 py-0.5 ${activeColor.chip}`}>
                      {domain.completedInDomain}/{domain.totalRoleTopics}
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 flex items-center justify-center shrink-0">
                      {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>

                  {/* Topic cards */}
                  {!isCollapsed && (
                    <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {domain.topics.map((topic) => {
                        const status = progressState[topic.id]
                        const isCompleted = status === "COMPLETED"
                        const isInProgress = status === "IN_PROGRESS"
                        const hasNote = !!userNotes[topic.id]
                        const isBaseline = topic.roles.includes("Everyone")
                        const ownTrack =
                          currentRoleKey !== "ALL" && topic.roles.includes(currentRoleKey)
                            ? currentRoleKey
                            : topic.roles.find((r) => r !== "Everyone") || "ALL"
                        const own = isBaseline ? null : trackColor(ownTrack)

                        return (
                          <div
                            key={topic.id}
                            className={`rounded-2xl border border-b-4 p-4 flex flex-col gap-3 bg-[#0e0f12] transition ${
                              isCompleted ? "border-emerald-600/70" : "border-zinc-800 hover:border-zinc-600"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white on-solid border-b-[3px] border-black/25 ${
                                  isCompleted ? "bg-emerald-500" : isBaseline ? COMPULSORY_COLOR.bar : own!.bar
                                }`}
                              >
                                {isCompleted ? (
                                  <Check className="w-5 h-5 stroke-[3]" />
                                ) : isBaseline ? (
                                  <Star className="w-5 h-5" />
                                ) : (
                                  <BookOpen className="w-5 h-5" />
                                )}
                              </span>
                              <div className="min-w-0">
                                <h4 className={`font-bold text-sm tracking-tight ${isCompleted ? "text-zinc-300" : "text-white"}`}>
                                  {topic.title}
                                </h4>
                                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{topic.description}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5">
                              {isBaseline ? (
                                <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-semibold ${COMPULSORY_COLOR.chip}`}>
                                  <Star className="w-2.5 h-2.5" /> Compulsory
                                </span>
                              ) : (
                                topic.roles
                                  .filter((r) => r !== "Everyone")
                                  .map((r) => (
                                    <span
                                      key={r}
                                      className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium ${trackColor(r).chip}`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${trackColor(r).dot}`} aria-hidden="true" />
                                      {r}
                                    </span>
                                  ))
                              )}
                              {isInProgress && <span className="text-[10px] font-semibold text-blue-300">In progress</span>}
                            </div>

                            {hasNote && (
                              <div className="p-2.5 rounded-xl bg-[#121316] border border-zinc-800 text-xs text-zinc-300">
                                <div className="flex items-center gap-1.5 font-medium text-blue-400 mb-1 text-[10px]">
                                  <FileText className="w-3 h-3" /> Your note
                                </div>
                                <p className="line-clamp-2 text-[11px]">{noteToPlainText(userNotes[topic.id])}</p>
                              </div>
                            )}

                            <div className="mt-auto flex items-center gap-2">
                              <button
                                onClick={() => onToggleStatus(topic.id)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                  isCompleted
                                    ? "bg-transparent text-emerald-300 border border-emerald-700/70 border-b-4 hover:bg-emerald-950/30"
                                    : isInProgress
                                    ? "bg-emerald-500 hover:bg-emerald-400 text-black border-b-4 border-emerald-700"
                                    : `${isBaseline ? COMPULSORY_COLOR.banner : own!.banner} text-white on-solid border-b-4 border-black/30 hover:brightness-110`
                                }`}
                              >
                                {isCompleted ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                                  </>
                                ) : isInProgress ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Mark done +10 XP
                                  </>
                                ) : (
                                  <>Start learning</>
                                )}
                              </button>
                              <span className="flex-1" />
                              <button
                                onClick={() => onOpenNotes(topic)}
                                title="Add or edit personal learning notes"
                                aria-label={`${hasNote ? "Edit note" : "Add note"} for ${topic.title}`}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center border border-b-4 transition ${
                                  hasNote
                                    ? "bg-blue-950/40 text-blue-300 border-blue-800/60"
                                    : "bg-zinc-800/60 text-zinc-300 border-zinc-700/60 hover:text-white"
                                }`}
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onOpenShare(topic)}
                                title="Share a key learning with your pod"
                                aria-label={`Share a learning about ${topic.title}`}
                                className="w-9 h-9 rounded-xl flex items-center justify-center border border-b-4 bg-zinc-800/60 text-zinc-300 border-zinc-700/60 hover:text-white transition"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
