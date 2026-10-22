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
    primary: "#38BDF8",       // Electric Sky Blue
    activeBg: "bg-[#38BDF8]",
    activeText: "text-black",
    activeBorder: "border-[#38BDF8]",
    badgeBg: "#0b1e33",
    badgeText: "#7DD3FC",
    badgeBorder: "#38BDF880",
  },
  Consultant: {
    primary: "#F59E0B",       // Warm Amber / Gold
    activeBg: "bg-[#F59E0B]",
    activeText: "text-black",
    activeBorder: "border-[#F59E0B]",
    badgeBg: "#281b0a",
    badgeText: "#FBBF24",
    badgeBorder: "#F59E0B80",
  },
  "Service Designer": {
    primary: "#E879F9",       // Electric Fuchsia / Purple
    activeBg: "bg-[#E879F9]",
    activeText: "text-black",
    activeBorder: "border-[#E879F9]",
    badgeBg: "#290d2e",
    badgeText: "#F0ABFC",
    badgeBorder: "#E879F980",
  },
  "AI PM": {
    primary: "#06B6D4",       // Electric Cyan
    activeBg: "bg-[#06B6D4]",
    activeText: "text-black",
    activeBorder: "border-[#06B6D4]",
    badgeBg: "#08232c",
    badgeText: "#67E8F9",
    badgeBorder: "#06B6D480",
  },
  Engineer: {
    primary: "#67E14B",       // Neon Terminal Green
    activeBg: "bg-[#67E14B]",
    activeText: "text-black",
    activeBorder: "border-[#67E14B]",
    badgeBg: "#142617",
    badgeText: "#7FE866",
    badgeBorder: "#67E14B80",
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
      <div className="bg-[#0f172a] border-2 border-slate-700/80 rounded-none p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700">
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{ backgroundColor: currentTheme.primary, color: "#000000" }}
                className="text-xs font-black tracking-wider uppercase px-2.5 py-0.5 rounded-none shadow-sm"
              >
                Chapter 15 · What to Learn
              </span>
              <span className="text-xs font-semibold text-slate-300">TXL Playbook 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
              Select Discipline Learning Track
            </h2>
          </div>

          <div
            style={{
              backgroundColor: currentTheme.badgeBg,
              borderColor: currentTheme.badgeBorder,
              color: currentTheme.badgeText,
            }}
            className="flex items-center gap-2 text-xs border font-bold px-3 py-1.5 rounded-none self-start sm:self-auto"
          >
            <span>Active Filter:</span>
            <span
              style={{ color: currentTheme.primary }}
              className="bg-black/50 px-2 py-0.5 rounded-none font-black"
            >
              {activeRole.label}
            </span>
          </div>
        </div>

        {/* The 5 Role Tab Buttons with Respective Colors */}
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
                style={
                  isSelected
                    ? {
                        backgroundColor: trackTheme.primary,
                        borderColor: trackTheme.primary,
                        color: "#000000",
                        boxShadow: `0 10px 25px -5px ${trackTheme.primary}40`,
                      }
                    : {
                        borderColor: "#334155",
                      }
                }
                className={`flex flex-col p-3 rounded-none transition-all duration-200 text-left border-2 ${
                  isSelected
                    ? "scale-[1.02] font-black"
                    : "bg-slate-900/90 text-slate-100 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <Icon
                    style={{ color: isSelected ? "#000000" : trackTheme.primary }}
                    className="w-4 h-4 transition-colors"
                  />
                  <span
                    style={
                      isSelected
                        ? { backgroundColor: "#000000", color: trackTheme.primary }
                        : { color: trackTheme.primary, borderColor: "#334155" }
                    }
                    className={`text-xs px-2 py-0.5 rounded-none font-black ${
                      isSelected ? "" : "bg-slate-800 border"
                    }`}
                  >
                    {count}
                  </span>
                </div>
                <span className="font-extrabold text-xs sm:text-sm leading-snug">
                  {track.label}
                </span>
                <span
                  className={`text-[10px] mt-0.5 font-medium ${
                    isSelected ? "text-black/80 font-bold" : "text-slate-400"
                  }`}
                >
                  {track.key === "ALL" ? "All Domains" : track.badge}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ================= 2. ACTIVE TAB CONTENTS IN A SINGLE MASTER DIV WITH DYNAMIC THEME COLOR ================= */}
      <div
        style={{
          borderColor: currentTheme.primary,
          boxShadow: `0 20px 50px -12px ${currentTheme.primary}25`,
        }}
        className="border-2 bg-[#090d16] p-5 sm:p-7 rounded-none space-y-6 shadow-2xl transition-all duration-300"
      >
        {/* A. Role Hero Header & Track Readiness Box */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                style={{
                  backgroundColor: currentTheme.badgeBg,
                  borderColor: currentTheme.badgeBorder,
                  color: currentTheme.primary,
                }}
                className="px-2.5 py-1 rounded-none text-xs font-black border tracking-wider uppercase flex items-center gap-1.5"
              >
                <RoleIcon className="w-3.5 h-3.5" />
                {activeRole.badge}
              </span>
              <span
                style={{
                  borderColor: `${currentTheme.primary}60`,
                  color: currentTheme.primary,
                }}
                className="text-xs font-bold bg-black/40 px-2.5 py-0.5 rounded-none border"
              >
                {activeRole.subtitle}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {activeRole.title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {activeRole.description}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2.5 text-xs">
              <span className="flex items-center gap-1.5 bg-black/50 text-white font-semibold px-3 py-1.5 rounded-none border border-slate-700">
                <BookOpen style={{ color: currentTheme.primary }} className="w-3.5 h-3.5" />
                {baselineCount} Universal Baseline Topics (Everyone)
              </span>
              {currentRoleKey !== "ALL" && (
                <span
                  style={{
                    backgroundColor: currentTheme.badgeBg,
                    borderColor: currentTheme.badgeBorder,
                    color: currentTheme.primary,
                  }}
                  className="flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-none border"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {specialistCount} Specialist Competencies
                </span>
              )}
            </div>
          </div>

          {/* Role Readiness Box with Dynamic Border & Colors */}
          <div
            style={{ borderColor: `${currentTheme.primary}90` }}
            className="bg-[#0f172a] p-5 rounded-none border-2 min-w-[290px] shadow-2xl space-y-3.5 self-start w-full lg:w-auto"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">
                <TrendingUp style={{ color: currentTheme.primary }} className="w-3.5 h-3.5" />
                Track Readiness
              </span>
              <span
                style={{ backgroundColor: currentTheme.primary, color: "#000000" }}
                className="text-xs font-extrabold px-2.5 py-0.5 rounded-none"
              >
                {completedInRole} / {totalInRole} Done
              </span>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span
                  style={{ color: currentTheme.primary }}
                  className="text-3xl font-black tracking-tight"
                >
                  {readinessPercentage}%
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {totalInRole - completedInRole} topics to go
                </span>
              </div>

              {/* High Contrast Progress Bar */}
              <div className="w-full bg-slate-900 rounded-none h-3 overflow-hidden border border-slate-700">
                <div
                  style={{
                    width: `${readinessPercentage}%`,
                    backgroundColor: currentTheme.primary,
                    boxShadow: `0 0 12px ${currentTheme.primary}80`,
                  }}
                  className="h-full rounded-none transition-all duration-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-center text-xs">
              <div className="bg-slate-900 p-2 rounded-none border border-slate-700">
                <span className="block text-slate-300 text-[10px] font-semibold">In Progress</span>
                <span className="font-black text-amber-300 text-sm">{inProgressInRole}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-none border border-slate-700">
                <span className="block text-slate-300 text-[10px] font-semibold">Status</span>
                <span
                  style={{ color: currentTheme.primary }}
                  className="font-black text-sm"
                >
                  {readinessPercentage >= 70 ? "Pod Ready" : "In Training"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* B. Filter & Search Toolbar */}
        <div className="bg-[#0f172a] p-3.5 rounded-none border-2 border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search style={{ color: currentTheme.primary }} className="w-4 h-4 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={`Search ${activeRole.label} topics (e.g. Next.js, RAG, Unit economics, JTBD)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#090d16] border-2 border-slate-700 focus:border-white text-white placeholder-slate-400 rounded-none pl-10 pr-9 py-2 text-xs font-medium focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto scrollbar-none pb-1 md:pb-0 text-xs">
            <span className="text-slate-300 font-bold text-xs mr-1 hidden sm:inline">Status:</span>
            <button
              onClick={() => setStatusFilter("ALL")}
              style={
                statusFilter === "ALL"
                  ? { backgroundColor: currentTheme.primary, color: "#000000", borderColor: currentTheme.primary }
                  : {}
              }
              className={`px-3 py-1.5 rounded-none font-bold transition border ${
                statusFilter === "ALL"
                  ? ""
                  : "bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500"
              }`}
            >
              All ({totalInRole})
            </button>
            <button
              onClick={() => setStatusFilter("IN_PROGRESS")}
              style={
                statusFilter === "IN_PROGRESS"
                  ? { backgroundColor: currentTheme.primary, color: "#000000", borderColor: currentTheme.primary }
                  : {}
              }
              className={`px-3 py-1.5 rounded-none font-bold transition border ${
                statusFilter === "IN_PROGRESS"
                  ? ""
                  : "bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500"
              }`}
            >
              In Progress ({inProgressInRole})
            </button>
            <button
              onClick={() => setStatusFilter("COMPLETED")}
              style={
                statusFilter === "COMPLETED"
                  ? { backgroundColor: currentTheme.primary, color: "#000000", borderColor: currentTheme.primary }
                  : {}
              }
              className={`px-3 py-1.5 rounded-none font-bold transition border ${
                statusFilter === "COMPLETED"
                  ? ""
                  : "bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500"
              }`}
            >
              Completed ({completedInRole})
            </button>
            <button
              onClick={() => setStatusFilter("NOT_STARTED")}
              style={
                statusFilter === "NOT_STARTED"
                  ? { backgroundColor: currentTheme.primary, color: "#000000", borderColor: currentTheme.primary }
                  : {}
              }
              className={`px-3 py-1.5 rounded-none font-bold transition border ${
                statusFilter === "NOT_STARTED"
                  ? ""
                  : "bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500"
              }`}
            >
              To Learn ({notStartedInRole})
            </button>
          </div>
        </div>

        {/* C. Active topics counter banner */}
        <div className="flex items-center justify-between px-1 text-xs text-slate-200">
          <div>
            Showing{" "}
            <span style={{ color: currentTheme.primary }} className="font-extrabold">
              {allRoleTopics.length}
            </span>{" "}
            topics for{" "}
            <span
              style={{ textDecorationColor: currentTheme.primary }}
              className="font-extrabold text-white underline"
            >
              {activeRole.label}
            </span>
            {currentRoleKey !== "ALL" && (
              <span className="text-slate-300"> ({baselineCount} universal baseline + {specialistCount} specialist)</span>
            )}
          </div>
          {searchQuery && (
            <span className="text-amber-300 font-semibold">
              Filtered by query: "{searchQuery}"
            </span>
          )}
        </div>

        {/* D. Curriculum Topics Grouped by Domain */}
        <div className="space-y-3">
          {filteredRoleDomains.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-700 rounded-none bg-slate-900/50">
              <Search className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h4 className="text-base font-extrabold text-white">No matching topics found</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                No competencies matched your filter for {activeRole.label}. Try adjusting your search query or status filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("ALL")
                }}
                style={{ backgroundColor: currentTheme.primary, color: "#000000" }}
                className="mt-4 px-4 py-2 rounded-none text-xs font-black hover:opacity-90 transition"
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
                  className="border-2 border-slate-700/80 rounded-none bg-[#0f172a] overflow-hidden shadow-lg transition-colors hover:border-slate-600"
                >
                  {/* Domain Header */}
                  <div
                    onClick={() => toggleDomainCollapse(domain.id)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition select-none"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div
                        style={{
                          borderColor: currentTheme.badgeBorder,
                          color: currentTheme.primary,
                          backgroundColor: currentTheme.badgeBg,
                        }}
                        className="w-9 h-9 rounded-none border flex items-center justify-center font-black text-sm"
                      >
                        {domain.code}
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          {domain.name}
                          <span
                            style={{ color: currentTheme.primary }}
                            className="text-xs font-bold bg-black/40 px-2 py-0.5 rounded-none border border-slate-700"
                          >
                            {domain.completedInDomain}/{domain.totalRoleTopics} done
                          </span>
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{domain.focus}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="hidden sm:flex items-center space-x-2.5">
                        <div className="w-24 sm:w-32 bg-slate-900 rounded-none h-2.5 overflow-hidden border border-slate-700">
                          <div
                            style={{
                              width: `${domainPct}%`,
                              backgroundColor: currentTheme.primary,
                              boxShadow: `0 0 8px ${currentTheme.primary}70`,
                            }}
                            className="h-full rounded-none transition-all duration-300"
                          />
                        </div>
                        <span
                          style={{ color: currentTheme.primary }}
                          className="text-xs font-black w-10 text-right"
                        >
                          {domainPct}%
                        </span>
                      </div>
                      <div className="w-7 h-7 rounded-none bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700">
                        {isCollapsed ? (
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        ) : (
                          <ChevronDown style={{ color: currentTheme.primary }} className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Topics Grid (Open on toggle) */}
                  {!isCollapsed && (
                    <div className="p-4 sm:p-5 bg-[#090d16]/95 border-t border-slate-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {domain.topics.map((topic) => {
                          const status = progressState[topic.id]
                          const isCompleted = status === "COMPLETED"
                          const isInProgress = status === "IN_PROGRESS"
                          const hasNote = !!userNotes[topic.id]
                          const isBaseline = topic.roles.includes("Everyone")

                          return (
                            <div
                              key={topic.id}
                              style={
                                isCompleted
                                  ? {
                                      borderColor: currentTheme.primary,
                                      boxShadow: `0 0 15px -3px ${currentTheme.primary}25`,
                                    }
                                  : {}
                              }
                              className={`p-4 sm:p-5 rounded-none border-2 transition-all flex flex-col justify-between ${
                                isCompleted
                                  ? "bg-[#0f172a]"
                                  : isInProgress
                                  ? "bg-[#0f172a] border-amber-400 shadow-lg shadow-amber-500/10"
                                  : "bg-[#0f172a]/90 border-slate-700/90 hover:border-slate-500"
                              }`}
                            >
                              <div>
                                {/* Header Badges */}
                                <div className="flex items-start justify-between gap-2 mb-2.5">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {isBaseline ? (
                                      <span
                                        style={{
                                          backgroundColor: currentTheme.badgeBg,
                                          borderColor: currentTheme.badgeBorder,
                                          color: currentTheme.primary,
                                        }}
                                        className="text-[11px] px-2.5 py-0.5 rounded-none font-black border shadow-sm"
                                      >
                                        Everyone (Baseline)
                                      </span>
                                    ) : (
                                      <span className="text-[11px] px-2 py-0.5 rounded-none font-bold bg-slate-800 text-slate-200 border border-slate-600">
                                        Role Specialist
                                      </span>
                                    )}

                                    {topic.roles
                                      .filter((r) => r !== "Everyone")
                                      .map((r) => (
                                        <span
                                          key={r}
                                          className="text-[10px] px-2 py-0.5 rounded-none font-bold bg-black/60 text-slate-300 border border-slate-700"
                                        >
                                          {r}
                                        </span>
                                      ))}
                                  </div>

                                  {/* Status Badge */}
                                  <div>
                                    {isCompleted && (
                                      <span
                                        style={{ backgroundColor: currentTheme.primary, color: "#000000" }}
                                        className="text-xs px-2.5 py-0.5 rounded-none font-black flex items-center gap-1"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                                      </span>
                                    )}
                                    {isInProgress && (
                                      <span className="text-xs px-2.5 py-0.5 rounded-none font-bold bg-amber-400 text-black flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" /> In Progress
                                      </span>
                                    )}
                                    {!status && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-none font-semibold bg-slate-800 text-slate-400">
                                        Not Started
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Title & Description */}
                                <h4 className="font-extrabold text-base text-white tracking-tight">
                                  {topic.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed font-normal">
                                  {topic.description}
                                </p>

                                {/* Note snippet preview */}
                                {hasNote && (
                                  <div
                                    style={{ borderColor: `${currentTheme.primary}50` }}
                                    className="mt-3 p-3 rounded-none bg-[#090d16] border text-xs text-slate-200 font-mono"
                                  >
                                    <div
                                      style={{ color: currentTheme.primary }}
                                      className="flex items-center gap-1.5 font-bold mb-1 text-[11px]"
                                    >
                                      <FileText className="w-3.5 h-3.5" /> Your Note:
                                    </div>
                                    <p className="line-clamp-2">{userNotes[topic.id]}</p>
                                  </div>
                                )}
                              </div>

                              {/* Actions Footer */}
                              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                                {/* Toggle Status Button */}
                                <button
                                  onClick={() => onToggleStatus(topic.id)}
                                  style={
                                    isCompleted
                                      ? { backgroundColor: currentTheme.primary, color: "#000000" }
                                      : {}
                                  }
                                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-xs font-bold transition shadow-sm ${
                                    isCompleted
                                      ? "hover:opacity-90"
                                      : isInProgress
                                      ? "bg-amber-400 text-black hover:bg-amber-300"
                                      : "bg-slate-800 text-white hover:border-slate-400 border border-slate-600"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
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
                                    style={
                                      hasNote
                                        ? {
                                            backgroundColor: currentTheme.badgeBg,
                                            color: currentTheme.primary,
                                            borderColor: currentTheme.badgeBorder,
                                          }
                                        : {}
                                    }
                                    className={`px-3 py-1.5 rounded-none text-xs font-bold transition flex items-center gap-1.5 border ${
                                      hasNote
                                        ? ""
                                        : "bg-slate-800 text-slate-200 border-slate-700 hover:text-white hover:border-slate-500"
                                    }`}
                                    title="Add or edit personal learning notes"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>{hasNote ? "Edit Note" : "Note"}</span>
                                  </button>

                                  <button
                                    onClick={() => onOpenShare(topic)}
                                    className="px-3 py-1.5 rounded-none text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:text-indigo-300 hover:border-indigo-500 transition flex items-center gap-1.5"
                                    title="Share a key learning with your pod"
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Share</span>
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
