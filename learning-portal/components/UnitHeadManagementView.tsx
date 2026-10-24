"use client"

import React, { useState, useMemo } from "react"
import { Domain, Topic } from "@/lib/curriculumData"
import { UserSession } from "@/lib/auth"
import {
  ShieldAlert,
  Users,
  TrendingUp,
  Award,
  BarChart3,
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Circle,
  FileText,
  UserCheck,
  ChevronRight,
  ChevronDown,
  X,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  Layers,
  ArrowRight,
  Check
} from "lucide-react"

export interface PodLearner {
  id: string
  name: string
  role: string
  email: string
  avatar: string
  progress: Record<string, "COMPLETED" | "IN_PROGRESS">
  notes: Record<string, string>
}

interface UnitHeadManagementViewProps {
  domains: Domain[]
  onUpdateDomains: (updatedDomains: Domain[]) => void
  currentUser: UserSession | null
  currentLearnerProgress: Record<string, "COMPLETED" | "IN_PROGRESS">
  currentLearnerNotes: Record<string, string>
}

export default function UnitHeadManagementView({
  domains,
  onUpdateDomains,
  currentUser,
  currentLearnerProgress,
  currentLearnerNotes,
}: UnitHeadManagementViewProps) {
  // Unit Head Sub-view
  const [activeSubTab, setActiveSubTab] = useState<"audits" | "curriculum">("audits")

  // ==================== LEARNER ROSTER STATE ====================
  // Seed realistic cross-pod members while integrating the real signed-in session
  const [podMembers, setPodMembers] = useState<PodLearner[]>(() => {
    // Collect all topic IDs to seed sample progress
    const allTopics = domains.flatMap((d) => d.topics)
    const getSampleProgress = (countCompleted: number, countInProg: number) => {
      const prog: Record<string, "COMPLETED" | "IN_PROGRESS"> = {}
      allTopics.slice(0, countCompleted).forEach((t) => {
        prog[t.id] = "COMPLETED"
      })
      allTopics.slice(countCompleted, countCompleted + countInProg).forEach((t) => {
        prog[t.id] = "IN_PROGRESS"
      })
      return prog
    }

    return [
      {
        id: "member-current",
        name: currentUser?.name || "Active Session (You)",
        role: currentUser?.discipline || "Learner / Lead",
        email: currentUser?.email || "user@seliseblocks.com",
        avatar: (currentUser?.name?.slice(0, 2) || "ME").toUpperCase(),
        progress: currentLearnerProgress,
        notes: currentLearnerNotes,
      },
      {
        id: "member-1",
        name: "Tahmid Chowdhury",
        role: "AI Product Manager",
        email: "tahmid.c@txl.is",
        avatar: "TC",
        progress: getSampleProgress(24, 8),
        notes: {
          "biz-1": "Applied Business Model Canvas for the FinTech MVP engagement. Validated cost structure vs value capture.",
          "spec-1": "Drafted spec with strict user constraints before letting subagents scaffold routes.",
        },
      },
      {
        id: "member-2",
        name: "Ayesha Rahman",
        role: "Service Designer",
        email: "ayesha.r@txl.is",
        avatar: "AR",
        progress: getSampleProgress(32, 5),
        notes: {
          "biz-2": "Mapped customer journey touchpoints across cross-border payment flows.",
        },
      },
      {
        id: "member-3",
        name: "Zubair Al-Mamun",
        role: "Product Engineer",
        email: "zubair.m@txl.is",
        avatar: "ZM",
        progress: getSampleProgress(41, 12),
        notes: {
          "eng-1": "Configured Next.js App Router with streaming SSR and optimistic updates.",
          "eng-3": "Hardened API endpoints against prompt injections using schema validation.",
        },
      },
      {
        id: "member-4",
        name: "Tanvir Hasan",
        role: "Product Consultant",
        email: "tanvir.h@txl.is",
        avatar: "TH",
        progress: getSampleProgress(18, 4),
        notes: {
          "biz-4": "Reviewed unit economics for SaaS enterprise pricing tier.",
        },
      },
    ]
  })

  // Synchronize current member with live session progress
  const activePodMembers = useMemo(() => {
    return podMembers.map((m) => {
      if (m.id === "member-current") {
        return {
          ...m,
          name: currentUser?.name || "Active Session (You)",
          role: currentUser?.discipline || "Learner / Lead",
          email: currentUser?.email || "user@seliseblocks.com",
          avatar: (currentUser?.name?.slice(0, 2) || "ME").toUpperCase(),
          progress: currentLearnerProgress,
          notes: currentLearnerNotes,
        }
      }
      return m
    })
  }, [podMembers, currentUser, currentLearnerProgress, currentLearnerNotes])

  const [selectedMemberId, setSelectedMemberId] = useState<string>("member-current")
  const currentMember = useMemo(() => {
    return activePodMembers.find((m) => m.id === selectedMemberId) || activePodMembers[0]
  }, [activePodMembers, selectedMemberId])

  // Filters for Learner Module Progress Audit
  const [auditStatusFilter, setAuditStatusFilter] = useState<"ALL" | "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED">("ALL")
  const [auditDomainFilter, setAuditDomainFilter] = useState<string>("ALL")
  const [auditSearchQuery, setAuditSearchQuery] = useState("")

  // Toggle member's progress from Unit Head audit view
  const handleToggleMemberTopic = (topicId: string) => {
    setPodMembers((prev) =>
      prev.map((m) => {
        if (m.id !== selectedMemberId) return m
        const current = m.progress[topicId]
        const updatedProgress = { ...m.progress }
        if (current === "COMPLETED") {
          delete updatedProgress[topicId]
        } else if (current === "IN_PROGRESS") {
          updatedProgress[topicId] = "COMPLETED"
        } else {
          updatedProgress[topicId] = "IN_PROGRESS"
        }
        return { ...m, progress: updatedProgress }
      })
    )
  }

  // ==================== CURRICULUM MANAGEMENT STATE ====================
  const [moduleSearchQuery, setModuleSearchQuery] = useState("")
  const [moduleDomainFilter, setModuleDomainFilter] = useState<string>("ALL")

  // Modals
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [deletingTopic, setDeletingTopic] = useState<{ topic: Topic; domainId: string } | null>(null)

  // Add/Edit Form State
  const [formDomainId, setFormDomainId] = useState(domains[0]?.id || "")
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formRoles, setFormRoles] = useState<string[]>(["Everyone"])

  const allAvailableRoles = ["Everyone", "Consultant", "Service Designer", "AI PM", "Engineer"]

  const openAddModal = () => {
    setFormDomainId(domains[0]?.id || "")
    setFormTitle("")
    setFormDescription("")
    setFormRoles(["Everyone"])
    setIsAddModuleModalOpen(true)
  }

  const openEditModal = (topic: Topic) => {
    setEditingTopic(topic)
    setFormDomainId(topic.domainId)
    setFormTitle(topic.title)
    setFormDescription(topic.description)
    setFormRoles([...topic.roles])
  }

  const handleRoleToggle = (role: string) => {
    setFormRoles((prev) => {
      if (role === "Everyone") {
        return prev.includes("Everyone") ? [] : ["Everyone"]
      }
      const withoutEveryone = prev.filter((r) => r !== "Everyone")
      if (withoutEveryone.includes(role)) {
        return withoutEveryone.filter((r) => r !== role)
      } else {
        return [...withoutEveryone, role]
      }
    })
  }

  // Save new module
  const handleSaveNewModule = () => {
    if (!formTitle.trim() || !formDescription.trim()) return

    const newTopic: Topic = {
      id: `mod-${Date.now()}`,
      title: formTitle.trim(),
      description: formDescription.trim(),
      roles: formRoles.length ? formRoles : ["Everyone"],
      domainId: formDomainId,
    }

    const updatedDomains = domains.map((domain) => {
      if (domain.id === formDomainId) {
        return {
          ...domain,
          topics: [...domain.topics, newTopic],
        }
      }
      return domain
    })

    onUpdateDomains(updatedDomains)
    setIsAddModuleModalOpen(false)
  }

  // Save edited module
  const handleSaveEditModule = () => {
    if (!editingTopic || !formTitle.trim()) return

    const updatedTopic: Topic = {
      ...editingTopic,
      title: formTitle.trim(),
      description: formDescription.trim(),
      roles: formRoles.length ? formRoles : ["Everyone"],
      domainId: formDomainId,
    }

    const updatedDomains = domains.map((domain) => {
      // Remove topic if domain changed
      const topicsWithout = domain.topics.filter((t) => t.id !== editingTopic.id)
      if (domain.id === formDomainId) {
        return {
          ...domain,
          topics: [...topicsWithout, updatedTopic],
        }
      }
      return {
        ...domain,
        topics: topicsWithout,
      }
    })

    onUpdateDomains(updatedDomains)
    setEditingTopic(null)
  }

  // Confirm delete module
  const handleConfirmDeleteModule = () => {
    if (!deletingTopic) return

    const updatedDomains = domains.map((domain) => {
      if (domain.id === deletingTopic.domainId) {
        return {
          ...domain,
          topics: domain.topics.filter((t) => t.id !== deletingTopic.topic.id),
        }
      }
      return domain
    })

    onUpdateDomains(updatedDomains)
    setDeletingTopic(null)
  }

  // Metrics
  const totalTopicsCount = useMemo(() => {
    return domains.reduce((acc, d) => acc + d.topics.length, 0)
  }, [domains])

  const aggregateOrgCompletion = useMemo(() => {
    if (activePodMembers.length === 0 || totalTopicsCount === 0) return 0
    const totalCompletions = activePodMembers.reduce((acc, m) => {
      const completed = Object.values(m.progress).filter((v) => v === "COMPLETED").length
      return acc + completed
    }, 0)
    const maxPossible = activePodMembers.length * totalTopicsCount
    return Math.round((totalCompletions / maxPossible) * 100)
  }, [activePodMembers, totalTopicsCount])

  // Filtered topics for the selected member in Audit Tab
  const memberAuditTopics = useMemo(() => {
    if (!currentMember) return []
    const list: Array<{ topic: Topic; domain: Domain; status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED"; note?: string }> = []

    domains.forEach((domain) => {
      if (auditDomainFilter !== "ALL" && domain.id !== auditDomainFilter) return

      domain.topics.forEach((topic) => {
        const status = currentMember.progress[topic.id] || "NOT_STARTED"
        const note = currentMember.notes[topic.id]

        if (auditStatusFilter !== "ALL" && status !== auditStatusFilter) return

        if (auditSearchQuery.trim()) {
          const q = auditSearchQuery.toLowerCase()
          const matches =
            topic.title.toLowerCase().includes(q) ||
            topic.description.toLowerCase().includes(q) ||
            domain.name.toLowerCase().includes(q)
          if (!matches) return
        }

        list.push({ topic, domain, status, note })
      })
    })

    return list
  }, [domains, currentMember, auditDomainFilter, auditStatusFilter, auditSearchQuery])

  // Filtered topics for Curriculum Manager Tab
  const curriculumManagerDomains = useMemo(() => {
    return domains.map((domain) => {
      if (moduleDomainFilter !== "ALL" && domain.id !== moduleDomainFilter) {
        return { ...domain, topics: [] }
      }

      const filteredTopics = domain.topics.filter((topic) => {
        if (!moduleSearchQuery.trim()) return true
        const q = moduleSearchQuery.toLowerCase()
        return (
          topic.title.toLowerCase().includes(q) ||
          topic.description.toLowerCase().includes(q) ||
          topic.roles.some((r) => r.toLowerCase().includes(q))
        )
      })

      return { ...domain, topics: filteredTopics }
    }).filter((d) => d.topics.length > 0)
  }, [domains, moduleDomainFilter, moduleSearchQuery])

  return (
    <div className="space-y-6">
      {/* ================= HEADER & SUB-TABS ================= */}
      <div className="bg-[#121316] p-6 sm:p-7 rounded-2xl border border-zinc-800/80 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 text-xs font-medium border border-purple-800/50 flex items-center gap-1.5 w-fit">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Executive Command Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              TXL Organizational Capability & Curriculum Management
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Audit granular learner progress across pods, inspect topic-by-topic completions, or author and manage all curriculum modules.
            </p>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1 bg-[#0a0a0c] p-1 rounded-xl border border-zinc-800 self-start sm:self-center">
            <button
              onClick={() => setActiveSubTab("audits")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeSubTab === "audits"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span>Learner Audits & Progress</span>
            </button>
            <button
              onClick={() => setActiveSubTab("curriculum")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeSubTab === "curriculum"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Curriculum & Module Manager</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: LEARNER AUDITS & PROGRESS ("k kon modules er ki ki sesh koreche") */}
      {/* ========================================================================= */}
      {activeSubTab === "audits" && (
        <div className="space-y-6">
          {/* Macro KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#121316] p-5 rounded-xl border border-zinc-800/80 shadow-sm">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                <span>Active Pod Learners</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white mt-2">{activePodMembers.length} Members</p>
              <p className="text-xs text-zinc-500 mt-1">Cross-pod engineering & product staff</p>
            </div>

            <div className="bg-[#121316] p-5 rounded-xl border border-zinc-800/80 shadow-sm">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                <span>Org Completion Rate</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400 mt-2">{aggregateOrgCompletion}%</p>
              <p className="text-xs text-zinc-500 mt-1">Total verified competency readiness</p>
            </div>

            <div className="bg-[#121316] p-5 rounded-xl border border-zinc-800/80 shadow-sm">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                <span>Total Live Modules</span>
                <BookOpen className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-white mt-2">{totalTopicsCount} Modules</p>
              <p className="text-xs text-zinc-500 mt-1">Across {domains.length} curriculum domains</p>
            </div>

            <div className="bg-[#121316] p-5 rounded-xl border border-zinc-800/80 shadow-sm">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                <span>Leadership Oversight</span>
                <Award className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white mt-2">Active</p>
              <p className="text-xs text-zinc-500 mt-1">Real-time status sign-off enabled</p>
            </div>
          </div>

          {/* Master-Detail Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Pod Member Roster (4 cols) */}
            <div className="lg:col-span-4 bg-[#121316] p-5 rounded-xl border border-zinc-800/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">Pod Member Roster</h3>
                <span className="text-[11px] text-zinc-400 font-normal">Select to audit</span>
              </div>

              <div className="space-y-2">
                {activePodMembers.map((member) => {
                  const memberCompleted = Object.values(member.progress).filter((v) => v === "COMPLETED").length
                  const memberInProg = Object.values(member.progress).filter((v) => v === "IN_PROGRESS").length
                  const memberPct = totalTopicsCount ? Math.round((memberCompleted / totalTopicsCount) * 100) : 0
                  const isSelected = selectedMemberId === member.id

                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMemberId(member.id)}
                      className={`w-full p-3 rounded-lg border text-left transition flex items-center justify-between ${
                        isSelected
                          ? "bg-zinc-800/90 border-blue-500/80 shadow-sm"
                          : "bg-[#0e0f12] border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border ${
                          isSelected
                            ? "bg-blue-600 border-blue-400 text-white"
                            : "bg-zinc-800 border-zinc-700 text-zinc-200"
                        }`}>
                          {member.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-semibold text-white">{member.name}</p>
                            {member.id === "member-current" && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800/50">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 font-normal">{member.role}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400">{memberPct}%</span>
                        <p className="text-[9px] text-zinc-500">
                          {memberCompleted}/{totalTopicsCount}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Column: Granular Module Audit Details (8 cols) */}
            <div className="lg:col-span-8 bg-[#121316] p-6 rounded-xl border border-zinc-800/80 shadow-sm space-y-6">
              {/* Member Profile Summary Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-5 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-base font-bold text-white shadow-md">
                    {currentMember.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{currentMember.name}</h2>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-medium">
                        {currentMember.role}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{currentMember.email}</p>
                  </div>
                </div>

                {/* Progress pill & metrics */}
                {(() => {
                  const comp = Object.values(currentMember.progress).filter((v) => v === "COMPLETED").length
                  const inProg = Object.values(currentMember.progress).filter((v) => v === "IN_PROGRESS").length
                  const notStarted = totalTopicsCount - comp - inProg
                  const pct = totalTopicsCount ? Math.round((comp / totalTopicsCount) * 100) : 0

                  return (
                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right">
                        <span className="text-xl font-bold text-emerald-400">{pct}%</span>
                        <p className="text-[10px] text-zinc-500">Readiness Score</p>
                      </div>
                      <div className="h-8 w-px bg-zinc-800" />
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 text-[11px] font-medium">
                          {comp} Completed
                        </span>
                        <span className="px-2 py-1 rounded bg-blue-950/40 text-blue-300 border border-blue-800/40 text-[11px] font-medium">
                          {inProg} In Progress
                        </span>
                        <span className="px-2 py-1 rounded bg-zinc-800/60 text-zinc-400 border border-zinc-700/40 text-[11px] font-medium">
                          {notStarted} Remaining
                        </span>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Module Filter & Search Toolbar */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Status Tabs */}
                  <div className="flex items-center gap-1 bg-[#0a0a0c] p-1 rounded-lg border border-zinc-800 text-xs">
                    {(["ALL", "COMPLETED", "IN_PROGRESS", "NOT_STARTED"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setAuditStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-md font-medium transition ${
                          auditStatusFilter === st
                            ? "bg-zinc-800 text-white shadow-sm"
                            : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {st === "ALL" && "All Modules"}
                        {st === "COMPLETED" && "Completed"}
                        {st === "IN_PROGRESS" && "In Progress"}
                        {st === "NOT_STARTED" && "Not Started"}
                      </button>
                    ))}
                  </div>

                  {/* Domain dropdown filter */}
                  <select
                    value={auditDomainFilter}
                    onChange={(e) => setAuditDomainFilter(e.target.value)}
                    className="bg-[#0a0a0c] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="ALL">All Domains ({domains.length})</option>
                    {domains.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} · {d.name} ({d.topics.length})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={auditSearchQuery}
                    onChange={(e) => setAuditSearchQuery(e.target.value)}
                    placeholder="Filter learner modules by topic title or keyword..."
                    className="w-full pl-9 pr-3 py-2 bg-[#0a0a0c] border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Granular Module-by-Module Progress List */}
              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {memberAuditTopics.length === 0 ? (
                  <div className="p-12 text-center text-xs text-zinc-400 border border-dashed border-zinc-800 rounded-xl bg-[#0a0a0c]/50">
                    <CheckCircle2 className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-zinc-300">No modules match this filter</p>
                    <p className="text-[11px] text-zinc-500 mt-1">Try selecting another status tab or domain.</p>
                  </div>
                ) : (
                  memberAuditTopics.map(({ topic, domain, status, note }) => {
                    const isCompleted = status === "COMPLETED"
                    const isInProgress = status === "IN_PROGRESS"

                    return (
                      <div
                        key={topic.id}
                        className={`p-3.5 rounded-xl border transition ${
                          isCompleted
                            ? "bg-[#0e1612]/40 border-emerald-900/50"
                            : isInProgress
                            ? "bg-[#0e1320]/40 border-blue-900/50"
                            : "bg-[#0e0f12] border-zinc-800/80"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded">
                                {domain.code} · {domain.name}
                              </span>
                              <div className="flex items-center gap-1">
                                {topic.roles.map((r) => (
                                  <span key={r} className="text-[9px] text-zinc-500 font-medium">
                                    • {r}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <h4 className="text-xs font-semibold text-zinc-100">{topic.title}</h4>
                            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed line-clamp-2">
                              {topic.description}
                            </p>
                          </div>

                          {/* Status Badge & Unit Head Toggle Control */}
                          <div className="flex items-center gap-2 shrink-0">
                            {isCompleted && (
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 text-[11px] font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Completed</span>
                              </span>
                            )}
                            {isInProgress && (
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/50 text-[11px] font-medium">
                                <Clock className="w-3.5 h-3.5 text-blue-400" />
                                <span>In Progress</span>
                              </span>
                            )}
                            {!isCompleted && !isInProgress && (
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800/60 text-zinc-400 border border-zinc-700/50 text-[11px] font-medium">
                                <Circle className="w-3.5 h-3.5 text-zinc-500" />
                                <span>Not Started</span>
                              </span>
                            )}

                            {/* Sign-off / Toggle status action button */}
                            <button
                              onClick={() => handleToggleMemberTopic(topic.id)}
                              title="Toggle learner progress status"
                              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-[11px] font-medium transition"
                            >
                              Toggle
                            </button>
                          </div>
                        </div>

                        {/* If learner logged personal note for this topic */}
                        {note && (
                          <div className="mt-2.5 pt-2 border-t border-zinc-800/80 bg-[#0a0a0c] p-2.5 rounded-lg border text-xs">
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-blue-400 mb-1">
                              <FileText className="w-3 h-3" />
                              <span>Learner Implementation Note:</span>
                            </div>
                            <p className="text-[11px] text-zinc-300 font-mono leading-relaxed">{note}</p>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: CURRICULUM & MODULE MANAGER (Add, Edit, Delete any module) */}
      {/* ========================================================================= */}
      {activeSubTab === "curriculum" && (
        <div className="space-y-6">
          {/* Controls bar: Search, Domain filter, Add New Module button */}
          <div className="bg-[#121316] p-5 rounded-xl border border-zinc-800/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={moduleSearchQuery}
                  onChange={(e) => setModuleSearchQuery(e.target.value)}
                  placeholder="Search modules by title, description or role..."
                  className="w-full pl-9 pr-3 py-2 bg-[#0a0a0c] border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Domain Filter */}
              <select
                value={moduleDomainFilter}
                onChange={(e) => setModuleDomainFilter(e.target.value)}
                className="bg-[#0a0a0c] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="ALL">All Domains ({domains.length})</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} · {d.name} ({d.topics.length} topics)
                  </option>
                ))}
              </select>
            </div>

            {/* Add New Module Button */}
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Module</span>
            </button>
          </div>

          {/* Grouped Modules by Domain */}
          <div className="space-y-6">
            {curriculumManagerDomains.length === 0 ? (
              <div className="bg-[#121316] p-12 text-center text-xs text-zinc-400 border border-dashed border-zinc-800 rounded-2xl">
                <BookOpen className="w-10 h-10 text-zinc-600 mx-auto mb-3 opacity-50" />
                <h3 className="text-base font-semibold text-zinc-200">No modules found</h3>
                <p className="text-xs text-zinc-500 mt-1">Try clearing your search query or add a new module.</p>
              </div>
            ) : (
              curriculumManagerDomains.map((domain) => (
                <div key={domain.id} className="bg-[#121316] p-6 rounded-2xl border border-zinc-800/80 shadow-sm space-y-4">
                  {/* Domain Header */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                        {domain.code}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">{domain.name}</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">{domain.focus}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/50 font-medium">
                      {domain.topics.length} Modules
                    </span>
                  </div>

                  {/* Modules in this Domain */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {domain.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="p-4 rounded-xl border border-zinc-800/80 bg-[#0e0f12] hover:border-zinc-700 transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex flex-wrap gap-1">
                              {topic.roles.map((r) => (
                                <span
                                  key={r}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-medium"
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500">{topic.id}</span>
                          </div>

                          <h4 className="text-sm font-semibold text-zinc-100">{topic.title}</h4>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{topic.description}</p>
                        </div>

                        {/* Actions: Edit & Delete */}
                        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(topic)}
                            className="px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 text-xs font-medium transition flex items-center gap-1.5"
                          >
                            <Pencil className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setDeletingTopic({ topic, domainId: domain.id })}
                            className="px-2.5 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-800/40 text-xs font-medium transition flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW MODULE */}
      {/* ========================================================================= */}
      {isAddModuleModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316] border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                  Curriculum Authoring
                </span>
                <h2 className="text-lg font-bold text-white mt-1.5">Add New Learning Module</h2>
              </div>
              <button
                onClick={() => setIsAddModuleModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Domain Select */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Curriculum Domain</label>
                <select
                  value={formDomainId}
                  onChange={(e) => setFormDomainId(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                >
                  {domains.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} · {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Module Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Model Context Protocol (MCP) Setup"
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Learning Description & Objective</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Explain what the learner must master and how it applies in production..."
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Target Roles */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Target Roles</label>
                <div className="flex flex-wrap gap-1.5">
                  {allAvailableRoles.map((role) => {
                    const isSelected = formRoles.includes(role)
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => handleRoleToggle(role)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium ${
                          isSelected
                            ? "bg-blue-950/60 text-blue-300 border-blue-700"
                            : "bg-[#0a0a0c] text-zinc-400 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        {role} {isSelected && "✓"}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setIsAddModuleModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewModule}
                disabled={!formTitle.trim() || !formDescription.trim()}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT MODULE */}
      {/* ========================================================================= */}
      {editingTopic && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316] border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[11px] font-medium text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded-full">
                  Edit Competency
                </span>
                <h2 className="text-lg font-bold text-white mt-1.5">Edit Module: {editingTopic.title}</h2>
              </div>
              <button
                onClick={() => setEditingTopic(null)}
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Domain Select */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Curriculum Domain</label>
                <select
                  value={formDomainId}
                  onChange={(e) => setFormDomainId(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                >
                  {domains.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} · {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Module Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Learning Description & Objective</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Target Roles */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Target Roles</label>
                <div className="flex flex-wrap gap-1.5">
                  {allAvailableRoles.map((role) => {
                    const isSelected = formRoles.includes(role)
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => handleRoleToggle(role)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium ${
                          isSelected
                            ? "bg-blue-950/60 text-blue-300 border-blue-700"
                            : "bg-[#0a0a0c] text-zinc-400 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        {role} {isSelected && "✓"}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setEditingTopic(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditModule}
                disabled={!formTitle.trim()}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow transition disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {deletingTopic && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316] border border-red-900/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Learning Module?</h3>
                <p className="text-xs text-zinc-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-[#0a0a0c] p-3 rounded-lg border border-zinc-800">
              Are you sure you want to delete <span className="font-semibold text-white">"{deletingTopic.topic.title}"</span>? This will remove this module from the curriculum syllabus and from all learner tracking dashboards.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeletingTopic(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteModule}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow transition"
              >
                Delete Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
