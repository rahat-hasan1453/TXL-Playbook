"use client"

import React, { useState, useMemo } from "react"
import { CURRICULUM_DOMAINS, Domain, Topic } from "@/lib/curriculumData"
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
  Filter,
  Sparkles,
  Award,
  TrendingUp,
  Check,
  ChevronDown,
  ChevronRight,
  BookOpen,
  X
} from "lucide-react"

export interface RoleTrackConfig {
  key: string // "ALL" | "Consultant" | "Service Designer" | "AI PM" | "Engineer"
  code: string // "all" | "c" | "sd" | "pm" | "e" (from TXL Playbook)
  label: string
  title: string
  subtitle: string
  description: string
  badge: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
}

export interface RoleTheme {
  primary: string        // Main accent hex
  activeBg: string       // Active tab background class
  activeText: string     // Active tab text
  activeBorder: string   // Active tab border
  badgeBg: string        // Dark tinted background
  badgeText: string      // Badge text color
  badgeBorder: string    // Badge border
}

export const ROLE_THEMES: Record<string, RoleTheme> = {
  ALL: {
    primary: "#60A5FA",       // Soft Blue
    activeBg: "bg-blue-600",
    activeText: "text-white",
    activeBorder: "border-blue-500",
    badgeBg: "#172554",
    badgeText: "#93C5FD",
    badgeBorder: "rgba(59, 130, 246, 0.3)",
  },
  Consultant: {
    primary: "#FBBF24",       // Warm Amber
    activeBg: "bg-amber-600",
    activeText: "text-white",
    activeBorder: "border-amber-500",
    badgeBg: "#451a03",
    badgeText: "#FCD34D",
    badgeBorder: "rgba(245, 158, 11, 0.3)",
  },
  "Service Designer": {
    primary: "#C084FC",       // Soft Purple
    activeBg: "bg-purple-600",
    activeText: "text-white",
    activeBorder: "border-purple-500",
    badgeBg: "#3b0764",
    badgeText: "#E9D5FF",
    badgeBorder: "rgba(168, 85, 247, 0.3)",
  },
  "AI PM": {
    primary: "#38BDF8",       // Subtle Cyan / Sky
    activeBg: "bg-cyan-600",
    activeText: "text-white",
    activeBorder: "border-cyan-500",
    badgeBg: "#083344",
    badgeText: "#7DD3FC",
    badgeBorder: "rgba(6, 182, 212, 0.3)",
  },
  Engineer: {
    primary: "#34D399",       // Refined Emerald
    activeBg: "bg-emerald-600",
    activeText: "text-white",
    activeBorder: "border-emerald-500",
    badgeBg: "#064e3b",
    badgeText: "#6EE7B7",
    badgeBorder: "rgba(16, 185, 129, 0.3)",
  },
}

export const ROLE_TRACKS: RoleTrackConfig[] = [
  {
    key: "ALL",
    code: "all",
    label: "All topics",
    title: "All Organizational Competencies",
    subtitle: "Complete 82 Topics across 9 Domains",
    description: "Every competency defined in Chapter 15 of the TXL Playbook 2026. Topics tagged 'Everyone' form the universal shared baseline required across all delivery pods.",
    badge: "Master Syllabus",
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
}

export default function RolePathwaysView({
  progressState,
  onToggleStatus,
  userNotes,
  onOpenNotes,
  onOpenShare,
  activeRoleKey = "ALL",
  onRoleChange,
}: RolePathwaysViewProps) {
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

  // Search and status filter inside the role view
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED">("ALL")
  
  // Track collapsed domains (defaults to all collapsed as per Figma design)
  const [collapsedDomainIds, setCollapsedDomainIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    CURRICULUM_DOMAINS.forEach((d) => {
      initial[d.id] = true
    })
    return initial
  })

  // Find active track config
  const activeRole = useMemo(() => {
    return ROLE_TRACKS.find((r) => r.key === currentRoleKey) || ROLE_TRACKS[0]
  }, [currentRoleKey])

  const currentTheme = ROLE_THEMES[currentRoleKey] || ROLE_THEMES.ALL
  const RoleIcon = activeRole.icon

  // Count topics for each of the 5 role tabs
  const topicCountsByRole = useMemo(() => {
    const all = CURRICULUM_DOMAINS.flatMap((d) => d.topics)
    const counts: Record<string, number> = { ALL: all.length }
    ROLE_TRACKS.forEach((r) => {
      if (r.key !== "ALL") {
        counts[r.key] = all.filter(
          (t) => t.roles.includes("Everyone") || t.roles.includes(r.key)
        ).length
      }
    })
    return counts
  }, [])

  // All topics strictly belonging to the currently selected role
  const allRoleTopics = useMemo(() => {
    const all = CURRICULUM_DOMAINS.flatMap((d) => d.topics)
    if (currentRoleKey === "ALL") return all
    return all.filter((t) => t.roles.includes("Everyone") || t.roles.includes(currentRoleKey))
  }, [currentRoleKey])

  // Metrics for this role
  const totalInRole = allRoleTopics.length
  const completedInRole = useMemo(() => {
    return allRoleTopics.filter((t) => progressState[t.id] === "COMPLETED").length
  }, [allRoleTopics, progressState])

  const inProgressInRole = useMemo(() => {
    return allRoleTopics.filter((t) => progressState[t.id] === "IN_PROGRESS").length
  }, [allRoleTopics, progressState])

  const notStartedInRole = totalInRole - completedInRole - inProgressInRole
  const readinessPercentage = totalInRole ? Math.round((completedInRole / totalInRole) * 100) : 0

  const baselineCount = useMemo(() => {
    return allRoleTopics.filter((t) => t.roles.includes("Everyone")).length
  }, [allRoleTopics])

  const specialistCount = totalInRole - baselineCount

  // Filter domains and topics for the active role tab
  const filteredRoleDomains = useMemo(() => {
    return CURRICULUM_DOMAINS.map((domain) => {
      // 1. Filter topics matching role
      const roleTopics = domain.topics.filter((topic) => {
        if (currentRoleKey === "ALL") return true
        return topic.roles.includes("Everyone") || topic.roles.includes(currentRoleKey)
      })

      // 2. Filter topics by search query and status filter
      const visibleTopics = roleTopics.filter((topic) => {
        const matchesSearch =
          !searchQuery.trim() ||
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.description.toLowerCase().includes(searchQuery.toLowerCase())

        if (!matchesSearch) return false

        const currentStatus = progressState[topic.id] || "NOT_STARTED"
        if (statusFilter === "COMPLETED") return currentStatus === "COMPLETED"
        if (statusFilter === "IN_PROGRESS") return currentStatus === "IN_PROGRESS"
        if (statusFilter === "NOT_STARTED") return currentStatus === "NOT_STARTED"

        return true
      })

      const completedInDomain = roleTopics.filter((t) => progressState[t.id] === "COMPLETED").length

      return {
        ...domain,
        topics: visibleTopics,
        totalRoleTopics: roleTopics.length,
        completedInDomain,
      }
    }).filter((d) => d.topics.length > 0) // Strictly hide empty domains so filtering is immediate!
  }, [currentRoleKey, searchQuery, statusFilter, progressState])

  const toggleDomainCollapse = (domainId: string) => {
    setCollapsedDomainIds((prev) => ({
      ...prev,
      [domainId]: !prev[domainId],
    }))
  }

  return (
    <div className="space-y-6">
      {/* ================= 1. PRIMARY ROLE TABS (PLAYBOOK STYLE) ================= */}
      <div className="bg-[#121316] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                Chapter 15 · What to Learn
              </span>
              <span className="text-xs text-zinc-400">TXL Playbook 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5 tracking-tight">
              Select Discipline Learning Track
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs border border-zinc-800 bg-zinc-900/60 text-zinc-300 px-3 py-1.5 rounded-lg self-start sm:self-auto font-medium">
            <span className="text-zinc-400">Active Filter:</span>
            <span className="font-semibold text-white">
              {activeRole.label}
            </span>
          </div>
        </div>

        {/* The 5 Role Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-4">
          {ROLE_TRACKS.map((track) => {
            const isSelected = currentRoleKey === track.key
            const Icon = track.icon
            const count = topicCountsByRole[track.key] || 0
            const trackTheme = ROLE_THEMES[track.key] || ROLE_THEMES.ALL

            return (
              <button
                key={track.key}
                type="button"
                onClick={() => handleRoleSelect(track.key)}
                className={`flex flex-col p-3.5 rounded-xl transition-all duration-200 text-left border ${
                  isSelected
                    ? "bg-[#181a20] border-zinc-500 shadow-sm ring-1 ring-white/10"
                    : "bg-[#0d0e11] border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-[#15161a]"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <Icon
                    style={{ color: isSelected ? trackTheme.primary : "#9ca3af" }}
                    className="w-4 h-4 transition-colors"
                  />
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                      isSelected
                        ? "bg-zinc-800 text-white border border-zinc-700"
                        : "bg-zinc-900/80 text-zinc-400 border border-zinc-800"
                    }`}
                  >
                    {count}
                  </span>
                </div>
                <span className={`font-semibold text-xs sm:text-sm leading-snug ${isSelected ? "text-white" : "text-zinc-200"}`}>
                  {track.label}
                </span>
                <span className="text-[11px] mt-0.5 text-zinc-400 font-normal">
                  {track.key === "ALL" ? "All Domains" : track.badge}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ================= 2. ACTIVE TAB CONTENTS IN A CLEAN CONTAINER ================= */}
      <div className="border border-zinc-800/80 bg-[#121316] p-5 sm:p-7 rounded-2xl space-y-6 shadow-sm transition-all duration-300">
        {/* A. Role Hero Header & Track Readiness Box */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-800/80 text-zinc-200 border border-zinc-700/60 flex items-center gap-1.5">
                <RoleIcon className="w-3.5 h-3.5 text-blue-400" />
                {activeRole.badge}
              </span>
              <span className="text-xs font-medium text-zinc-400 bg-zinc-900/60 px-2.5 py-0.5 rounded-md border border-zinc-800">
                {activeRole.subtitle}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeRole.title}
            </h3>

            <p className="text-sm text-zinc-400 leading-relaxed font-normal">
              {activeRole.description}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 bg-zinc-900/60 text-zinc-300 font-medium px-3 py-1.5 rounded-lg border border-zinc-800">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                {baselineCount} Universal Baseline Topics (Everyone)
              </span>
              {currentRoleKey !== "ALL" && (
                <span className="flex items-center gap-1.5 bg-zinc-900/60 text-zinc-300 font-medium px-3 py-1.5 rounded-lg border border-zinc-800">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  {specialistCount} Specialist Competencies
                </span>
              )}
            </div>
          </div>

          {/* Role Readiness Box */}
          <div className="bg-[#16171b] p-5 rounded-xl border border-zinc-800/80 min-w-[290px] shadow-sm space-y-3.5 self-start w-full lg:w-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                Track Readiness
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700/60">
                {completedInRole} / {totalInRole} Done
              </span>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {readinessPercentage}%
                </span>
                <span className="text-xs font-normal text-zinc-400">
                  {totalInRole - completedInRole} topics to go
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-800/80 rounded-full h-2 overflow-hidden">
                <div
                  style={{ width: `${readinessPercentage}%` }}
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 text-center text-xs">
              <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                <span className="block text-zinc-400 text-[11px] font-medium">In Progress</span>
                <span className="font-bold text-amber-400 text-sm mt-0.5 block">{inProgressInRole}</span>
              </div>
              <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                <span className="block text-zinc-400 text-[11px] font-medium">Status</span>
                <span className="font-bold text-zinc-200 text-sm mt-0.5 block">
                  {readinessPercentage >= 70 ? "Pod Ready" : "In Training"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* B. Filter & Search Toolbar */}
        <div className="bg-[#16171b] p-3 rounded-xl border border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder={`Search ${activeRole.label} topics (e.g. Next.js, RAG, Unit economics, JTBD)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-zinc-800 focus:border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg pl-10 pr-9 py-2 text-xs font-normal focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto scrollbar-none pb-1 md:pb-0 text-xs">
            <span className="text-zinc-400 font-medium text-xs mr-1 hidden sm:inline">Status:</span>
            {[
              { id: "ALL", label: `All (${totalInRole})` },
              { id: "IN_PROGRESS", label: `In Progress (${inProgressInRole})` },
              { id: "COMPLETED", label: `Completed (${completedInRole})` },
              { id: "NOT_STARTED", label: `To Learn (${notStartedInRole})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === tab.id
                    ? "bg-zinc-800 text-white border border-zinc-700 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* C. Active topics counter banner */}
        <div className="flex items-center justify-between px-1 text-xs text-zinc-400">
          <div>
            Showing{" "}
            <span className="font-bold text-white">
              {allRoleTopics.length}
            </span>{" "}
            topics for{" "}
            <span className="font-bold text-white">
              {activeRole.label}
            </span>
            {currentRoleKey !== "ALL" && (
              <span className="text-zinc-500"> ({baselineCount} universal baseline + {specialistCount} specialist)</span>
            )}
          </div>
          {searchQuery && (
            <span className="text-amber-400/90 font-medium">
              Filtered by: "{searchQuery}"
            </span>
          )}
        </div>

        {/* D. Curriculum Topics Grouped by Domain */}
        <div className="space-y-3">
          {filteredRoleDomains.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
              <Search className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-white">No matching topics found</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                No competencies matched your filter for {activeRole.label}. Try adjusting your search query or status filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("ALL")
                }}
                className="mt-4 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-white transition border border-zinc-700"
              >
                Reset Filters
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
                  className="border border-zinc-800/80 rounded-xl bg-[#141519] overflow-hidden shadow-sm transition-all hover:border-zinc-700/80"
                >
                  {/* Domain Header */}
                  <div
                    onClick={() => toggleDomainCollapse(domain.id)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/30 transition select-none"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-8 h-8 rounded-lg border border-zinc-700/60 bg-zinc-800/80 flex items-center justify-center font-bold text-xs text-zinc-200">
                        {domain.code}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          {domain.name}
                          <span className="text-xs font-medium text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded-md border border-zinc-700/50">
                            {domain.completedInDomain}/{domain.totalRoleTopics} done
                          </span>
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{domain.focus}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="hidden sm:flex items-center space-x-2.5">
                        <div className="w-24 sm:w-32 bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
                          <div
                            style={{ width: `${domainPct}%` }}
                            className="h-full rounded-full bg-blue-500 transition-all duration-300"
                          />
                        </div>
                        <span className="text-xs font-medium text-zinc-400 w-10 text-right">
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

                  {/* Topics Grid (Open on toggle) */}
                  {!isCollapsed && (
                    <div className="p-4 sm:p-5 bg-[#0d0e11]/90 border-t border-zinc-800/80">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {domain.topics.map((topic) => {
                          const status = progressState[topic.id]
                          const isCompleted = status === "COMPLETED"
                          const isInProgress = status === "IN_PROGRESS"
                          const hasNote = !!userNotes[topic.id]
                          const isBaseline = topic.roles.includes("Everyone")

                          return (
                            <div
                              key={topic.id}
                              className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col justify-between ${
                                isCompleted
                                  ? "bg-[#16171b] border-emerald-500/30"
                                  : isInProgress
                                  ? "bg-[#16171b] border-amber-500/30"
                                  : "bg-[#141519] border-zinc-800/80 hover:border-zinc-700/80"
                              }`}
                            >
                              <div>
                                {/* Header Badges */}
                                <div className="flex items-start justify-between gap-2 mb-2.5">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {isBaseline ? (
                                      <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                                        Baseline
                                      </span>
                                    ) : (
                                      <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-zinc-800/40 text-zinc-400 border border-zinc-800">
                                        Specialist
                                      </span>
                                    )}

                                    {topic.roles
                                      .filter((r) => r !== "Everyone")
                                      .map((r) => (
                                        <span
                                          key={r}
                                          className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-zinc-900 text-zinc-400 border border-zinc-800"
                                        >
                                          {r}
                                        </span>
                                      ))}
                                  </div>

                                  {/* Status Badge */}
                                  <div>
                                    {isCompleted && (
                                      <span className="text-[11px] px-2.5 py-0.5 rounded-md font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Done
                                      </span>
                                    )}
                                    {isInProgress && (
                                      <span className="text-[11px] px-2.5 py-0.5 rounded-md font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> In Progress
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Title & Description */}
                                <h4 className="font-semibold text-sm text-white tracking-tight">
                                  {topic.title}
                                </h4>
                                <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-normal">
                                  {topic.description}
                                </p>

                                {/* Note snippet preview */}
                                {hasNote && (
                                  <div className="mt-3 p-3 rounded-lg bg-[#0a0a0c] border border-zinc-800 text-xs text-zinc-300 font-mono">
                                    <div className="flex items-center gap-1.5 font-semibold text-zinc-400 mb-1 text-[11px]">
                                      <FileText className="w-3 h-3 text-blue-400" /> Your Note:
                                    </div>
                                    <p className="line-clamp-2">{userNotes[topic.id]}</p>
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
                                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                                      : isInProgress
                                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
                                      : "bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700/80 border border-zinc-700/60"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Completed</span>
                                    </>
                                  ) : isInProgress ? (
                                    <>
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>Mark as Done</span>
                                    </>
                                  ) : (
                                    <>
                                      <Circle className="w-3.5 h-3.5" />
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
                                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                        : "bg-zinc-800/60 text-zinc-300 border-zinc-700/50 hover:bg-zinc-800 hover:text-white"
                                    }`}
                                    title="Add or edit personal learning notes"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>{hasNote ? "Edit Note" : "Note"}</span>
                                  </button>

                                  <button
                                    onClick={() => onOpenShare(topic)}
                                    className="p-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition border border-transparent hover:border-zinc-700"
                                    title="Share a key learning with your pod"
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
      </div>
    </div>
  )
}
