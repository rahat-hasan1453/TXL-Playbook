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

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 w-full">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR: FIXED / STICKY DISCIPLINE SELECTOR ("Fixed thakbe")     */}
      {/* ========================================================================= */}
      <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-24 self-start">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
            Select Discipline<br />Learning Track
          </h2>
        </div>

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
                className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 text-left border ${
                  isSelected
                    ? `bg-[#16181f] text-white shadow-md ${color.card}`
                    : "bg-[#121316] border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-[#16171b]"
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className={`p-1.5 rounded-lg border ${color.text} ${
                    isSelected
                      ? "bg-zinc-800 border-zinc-600"
                      : "bg-[#0e0f12] border-zinc-800"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold text-xs sm:text-sm leading-tight truncate ${isSelected ? "text-white" : "text-zinc-200"}`}>
                      {track.label}
                    </p>
                    <p className="text-[11px] mt-0.5 text-zinc-400 font-normal truncate">
                      {track.subtitle}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-0.5 rounded-md font-semibold shrink-0 ml-2 ${
                    isSelected
                      ? `border ${color.chip}`
                      : "bg-[#0e0f12] text-zinc-400 border border-zinc-800"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. RIGHT MAIN CONTENT: SCROLLABLE CURRICULUM PANEL                        */}
      {/* ========================================================================= */}
      <section className="flex-1 min-w-0 space-y-6 w-full">
        {/* Hero Section: Track Title, Badges (Left) & Track Readiness (Right) */}
        <div className="relative bg-[#121316] border border-zinc-800/80 rounded-2xl p-6 sm:p-7 shadow-sm overflow-hidden">
          <div className={`absolute inset-x-0 top-0 h-1 ${activeColor.bar}`} aria-hidden="true" />
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Left: Title, Description, Badges */}
            <div className="space-y-3 max-w-xl">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeRole.title}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                {activeRole.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className={`flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-lg border ${COMPULSORY_COLOR.chip}`}>
                  <Star className="w-3.5 h-3.5" />
                  {baselineCount} Compulsory Topics (Everyone)
                </span>
                {currentRoleKey !== "ALL" && (
                  <span className={`flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-lg border ${activeColor.chip}`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    {specialistCount} Specialist Competencies
                  </span>
                )}
              </div>
            </div>

            {/* Right: Track Readiness Card */}
            <div className="bg-[#0e0f12] p-5 rounded-xl border border-zinc-800/80 w-full lg:w-80 shrink-0 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  TRACK READINESS
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/50">
                    {inProgressInRole} In Progress
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                    {completedInRole} / {totalInRole} Done
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {readinessPercentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    style={{ width: `${readinessPercentage}%` }}
                    className={`h-full rounded-full ${activeColor.bar} transition-all duration-300`}
                  />
                </div>

                <p className="text-right text-[11px] text-zinc-400 mt-1.5 font-medium">
                  {totalInRole - completedInRole} topics to go
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar: Counter Text (Left) & Search Input (Right) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="text-xs text-zinc-400 font-medium">
            Showing <span className="font-bold text-white">{allRoleTopics.length}</span> topics for{" "}
            <span className="font-bold text-white">{activeRole.label}</span>
            {currentRoleKey !== "ALL" && (
              <span className="text-zinc-500"> ({baselineCount} compulsory + {specialistCount} specialist)</span>
            )}
          </div>

          <div className="relative w-full sm:w-80 md:w-96">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeRole.label} topics (e.g. Next.js, RAG, Unit economics, JTBD)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121316] border border-zinc-800 focus:border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg pl-9 pr-8 py-2 text-xs font-normal focus:outline-none transition shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Domain Accordions */}
        <div className="space-y-3">
          {filteredRoleDomains.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-[#121316]">
              <Search className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-white">No matching topics found</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                No competencies matched your filter for {activeRole.label}. Try adjusting your search query.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-white transition border border-zinc-700"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredRoleDomains.map((domain) => {
              const isCollapsed = collapsedDomainIds[domain.id] === true
              const domainPct = domain.totalRoleTopics
                ? Math.round((domain.completedInDomain / domain.totalRoleTopics) * 100)
                : 0

              return (
                <div
                  key={domain.id}
                  className="border border-zinc-800/80 rounded-xl bg-[#121316] overflow-hidden shadow-sm transition-all"
                >
                  {/* Domain Accordion Header */}
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
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/30 transition select-none"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0 pr-4">
                      <div className="w-8 h-8 rounded-lg border border-zinc-700/60 bg-zinc-800/80 flex items-center justify-center font-bold text-xs text-zinc-200 shrink-0">
                        {domain.code}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-white truncate">
                            {domain.name}
                          </h3>
                          <span className="text-[11px] font-medium text-zinc-400 bg-zinc-800/70 px-2 py-0.5 rounded-md border border-zinc-700/50 shrink-0">
                            {domain.completedInDomain}/{domain.totalRoleTopics} done
                          </span>
                          {domain.compulsoryCount > 0 && (
                            <span className={`hidden sm:flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${COMPULSORY_COLOR.chip}`}>
                              <Star className="w-3 h-3" />
                              {domain.compulsoryCount === domain.totalRoleTopics ? "Compulsory" : `${domain.compulsoryCount} compulsory`}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{domain.focus}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0">
                      <div className="hidden sm:flex items-center space-x-2.5">
                        <div className="w-20 sm:w-28 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            style={{ width: `${domainPct}%` }}
                            className={`h-full rounded-full ${activeColor.bar} transition-all duration-300`}
                          />
                        </div>
                        <span className="text-xs font-semibold text-zinc-400 w-8 text-right">
                          {domainPct}%
                        </span>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-zinc-800/60 flex items-center justify-center text-zinc-400 border border-zinc-700/50">
                        {isCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-200" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Topics Grid (Open when !isCollapsed) */}
                  {!isCollapsed && (
                    <div className="p-4 sm:p-5 bg-[#0e0f12] border-t border-zinc-800/80">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
                          const railColor = isBaseline ? COMPULSORY_COLOR.bar : trackColor(ownTrack).bar

                          return (
                            <div
                              key={topic.id}
                              className={`relative overflow-hidden p-4 sm:p-5 pl-5 sm:pl-6 rounded-xl border transition-all flex flex-col justify-between ${
                                isCompleted
                                  ? "bg-[#121316] border-emerald-500/40"
                                  : isInProgress
                                  ? "bg-[#121316] border-blue-500/40"
                                  : isBaseline
                                  ? `${COMPULSORY_COLOR.card} hover:border-blue-600/70`
                                  : "bg-[#121316] border-zinc-800/80 hover:border-zinc-700"
                              }`}
                            >
                              <span className={`absolute left-0 inset-y-0 w-1.5 ${railColor}`} aria-hidden="true" />
                              <div>
                                {/* Header Tags: Baseline or Specialist + Roles */}
                                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                                  {isBaseline ? (
                                    <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border font-semibold ${COMPULSORY_COLOR.chip}`}>
                                      <Star className="w-2.5 h-2.5" /> Compulsory
                                    </span>
                                  ) : (
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/60 text-zinc-400 border border-zinc-700/40 font-medium">
                                      Specialist
                                    </span>
                                  )}

                                  {topic.roles
                                    .filter((r) => r !== "Everyone")
                                    .map((r) => (
                                      <span
                                        key={r}
                                        className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border font-medium ${trackColor(r).chip}`}
                                      >
                                        <span className={`w-1.5 h-1.5 rounded-full ${trackColor(r).dot}`} aria-hidden="true" />
                                        {r}
                                      </span>
                                    ))}
                                </div>

                                {/* Title & Description */}
                                <h4 className="font-bold text-sm text-white tracking-tight">
                                  {topic.title}
                                </h4>
                                <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-normal">
                                  {topic.description}
                                </p>

                                {/* Note snippet preview */}
                                {hasNote && (
                                  <div className="mt-3 p-2.5 rounded-lg bg-[#0a0a0c] border border-zinc-800 text-xs text-zinc-300 font-mono">
                                    <div className="flex items-center gap-1.5 font-medium text-blue-400 mb-1 text-[10px]">
                                      <FileText className="w-3 h-3" /> Note:
                                    </div>
                                    <p className="line-clamp-2 text-[11px]">{noteToPlainText(userNotes[topic.id])}</p>
                                  </div>
                                )}
                              </div>

                              {/* Actions Footer */}
                              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                                {/* Toggle Status Button */}
                                <button
                                  onClick={() => onToggleStatus(topic.id)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                    isCompleted
                                      ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/60"
                                      : isInProgress
                                      ? "bg-blue-950/60 text-blue-300 border border-blue-800/60 hover:bg-blue-900/60"
                                      : "bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700/80 border border-zinc-700/60"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Completed</span>
                                    </>
                                  ) : isInProgress ? (
                                    <>
                                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                                      <span>In Progress</span>
                                    </>
                                  ) : (
                                    <>
                                      <Circle className="w-3.5 h-3.5 text-zinc-400" />
                                      <span>Start Learning</span>
                                    </>
                                  )}
                                </button>

                                {/* Secondary Actions: Notes & Share */}
                                <div className="flex items-center space-x-1.5">
                                  <button
                                    onClick={() => onOpenNotes(topic)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 border ${
                                      hasNote
                                        ? "bg-blue-950/40 text-blue-300 border-blue-800/50"
                                        : "bg-zinc-800/60 text-zinc-300 border-zinc-700/50 hover:bg-zinc-800 hover:text-white"
                                    }`}
                                    title="Add or edit personal learning notes"
                                    aria-label={`${hasNote ? "Edit note" : "Add note"} for ${topic.title}`}
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>{hasNote ? "Edit Note" : "Note"}</span>
                                  </button>

                                  <button
                                    onClick={() => onOpenShare(topic)}
                                    className="p-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition border border-transparent hover:border-zinc-700"
                                    title="Share a key learning with your pod"
                                    aria-label={`Share a learning about ${topic.title}`}
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
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
