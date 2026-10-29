"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Domain, Topic } from "@/lib/curriculumData"
import { UserSession } from "@/lib/auth"
import { NoteViewer } from "@/components/NotesEditor"
import TopicGuideModal from "@/components/TopicGuideModal"
import { noteToPlainText } from "@/lib/note-content"
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
  CheckCircle2,
  Clock,
  Circle,
  FileText,
  ChevronRight,
  ChevronDown,
  X,
  AlertTriangle,
  GraduationCap,
  ArrowRight,
  Trophy,
  Target,
  Sparkles,
  Layers
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
  onNavigateToCurriculum?: () => void
}

export default function UnitHeadManagementView({
  domains,
  onUpdateDomains,
  currentUser,
  currentLearnerProgress,
  currentLearnerNotes,
  onNavigateToCurriculum,
}: UnitHeadManagementViewProps) {
  // Main Sub-tabs: Leaderboard & Audits vs Curriculum Manager
  const [activeSubTab, setActiveSubTab] = useState<"audits" | "curriculum">("audits")
  const [guideTopic, setGuideTopic] = useState<Topic | null>(null)

  // View mode in the Audits tab: "ALL_LEARNERS" (Org-Wide Module % Adoption) vs "INDIVIDUAL_AUDIT"
  const [auditViewMode, setAuditViewMode] = useState<"ALL_LEARNERS" | "INDIVIDUAL_AUDIT">("ALL_LEARNERS")

  // ==================== LEARNER ROSTER & LEADERBOARD ====================
  // Clean dynamic cross-pod learners (persisted in localStorage, zero hardcoded dummy data)
  const [podLearners, setPodLearners] = useState<PodLearner[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("txl_pod_learners")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Failed to parse saved pod learners", e)
        }
      }
    }
    return []
  })

  // Persist podLearners whenever modified
  const handleUpdatePodLearners = (updated: PodLearner[]) => {
    setPodLearners(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("txl_pod_learners", JSON.stringify(updated))
    }
  }

  // Live real-time cross-pod learner synchronization from server
  useEffect(() => {
    let isMounted = true

    const fetchLiveLearners = async () => {
      try {
        const res = await fetch("/api/progress")
        const data = await res.json()
        if (isMounted && data?.learners && Array.isArray(data.learners)) {
          setPodLearners(data.learners)
          if (typeof window !== "undefined") {
            localStorage.setItem("txl_pod_learners", JSON.stringify(data.learners))
          }
        }
      } catch (err) {
        console.warn("Could not fetch live learners:", err)
      }
    }

    fetchLiveLearners()

    // Poll every 5 seconds for real-time progress updates across browser tabs
    const interval = setInterval(fetchLiveLearners, 5000)

    const handleFocus = () => {
      fetchLiveLearners()
    }
    window.addEventListener("focus", handleFocus)

    return () => {
      isMounted = false
      clearInterval(interval)
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  // Modal to dynamically enroll/add a new real learner
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  const [enrollName, setEnrollName] = useState("")
  const [enrollEmail, setEnrollEmail] = useState("")
  const [enrollRole, setEnrollRole] = useState("Product Engineer")

  const handleEnrollLearner = () => {
    if (!enrollName.trim() || !enrollEmail.trim()) return
    const initials = enrollName
      .trim()
      .split(" ")
      .map((s) => s[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "LN"

    const newLearner: PodLearner = {
      id: `learner-${Date.now()}`,
      name: enrollName.trim(),
      email: enrollEmail.trim(),
      role: enrollRole,
      avatar: initials,
      progress: {},
      notes: {},
    }

    const next = [...podLearners, newLearner]
    handleUpdatePodLearners(next)
    setEnrollName("")
    setEnrollEmail("")
    setIsEnrollModalOpen(false)
  }

  const handleRemoveLearner = (learnerId: string) => {
    const next = podLearners.filter((l) => l.id !== learnerId)
    handleUpdatePodLearners(next)
    if (selectedLearnerId === learnerId) {
      setSelectedLearnerId("")
      setAuditViewMode("ALL_LEARNERS")
    }
  }

  // Total topics in curriculum
  const totalTopicsCount = useMemo(() => {
    return domains.reduce((acc, d) => acc + d.topics.length, 0)
  }, [domains])

  // Ranked Leaderboard: sorted strictly descending by completion percentage
  const rankedLeaderboard = useMemo(() => {
    return podLearners
      .map((learner) => {
        const completed = Object.values(learner.progress).filter((v) => v === "COMPLETED").length
        const inProgress = Object.values(learner.progress).filter((v) => v === "IN_PROGRESS").length
        const percentage = totalTopicsCount ? Math.round((completed / totalTopicsCount) * 100) : 0
        return {
          ...learner,
          completed,
          inProgress,
          percentage,
        }
      })
      .sort((a, b) => b.percentage - a.percentage || b.completed - a.completed)
  }, [podLearners, totalTopicsCount])

  // Selected learner for individual audit drilldown
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>(rankedLeaderboard[0]?.id || "")
  const currentLearner = useMemo(() => {
    return rankedLeaderboard.find((l) => l.id === selectedLearnerId) || rankedLeaderboard[0] || null
  }, [rankedLeaderboard, selectedLearnerId])

  // Aggregate Org-Wide Completion percentage
  const aggregateOrgCompletion = useMemo(() => {
    if (rankedLeaderboard.length === 0 || totalTopicsCount === 0) return 0
    const totalCompletions = rankedLeaderboard.reduce((acc, l) => acc + l.completed, 0)
    const maxPossible = rankedLeaderboard.length * totalTopicsCount
    return Math.round((totalCompletions / maxPossible) * 100)
  }, [rankedLeaderboard, totalTopicsCount])

  // ==================== SECTION 2: ORG-WIDE MODULE ADOPTION MATRIX ====================
  // Computes for every module in curriculum: how many total learners finished it, in-progress, and what % of all learners
  const [adoptionFilter, setAdoptionFilter] = useState<"ALL" | "HIGH" | "IN_PROGRESS" | "DEFICIT">("ALL")
  const [orgDomainFilter, setOrgDomainFilter] = useState<string>("ALL")
  const [orgSearchQuery, setOrgSearchQuery] = useState("")
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null)

  // Compute all module adoption stats
  const allModulesAdoption = useMemo(() => {
    const list: Array<{
      topic: Topic
      domain: Domain
      completedLearners: PodLearner[]
      inProgressLearners: PodLearner[]
      notStartedLearners: PodLearner[]
      adoptionPercentage: number
      totalLearnersCount: number
    }> = []

    const totalLearners = rankedLeaderboard.length

    domains.forEach((domain) => {
      if (orgDomainFilter !== "ALL" && domain.id !== orgDomainFilter) return

      domain.topics.forEach((topic) => {
        const completedLearners: PodLearner[] = []
        const inProgressLearners: PodLearner[] = []
        const notStartedLearners: PodLearner[] = []

        rankedLeaderboard.forEach((learner) => {
          const st = learner.progress[topic.id]
          if (st === "COMPLETED") {
            completedLearners.push(learner)
          } else if (st === "IN_PROGRESS") {
            inProgressLearners.push(learner)
          } else {
            notStartedLearners.push(learner)
          }
        })

        const adoptionPercentage = totalLearners ? Math.round((completedLearners.length / totalLearners) * 100) : 0

        // Adoption Filter
        if (adoptionFilter === "HIGH" && adoptionPercentage < 50) return
        if (adoptionFilter === "IN_PROGRESS" && (adoptionPercentage === 0 || adoptionPercentage >= 50)) return
        if (adoptionFilter === "DEFICIT" && adoptionPercentage > 0) return

        // Search Query
        if (orgSearchQuery.trim()) {
          const q = orgSearchQuery.toLowerCase()
          const matches =
            topic.title.toLowerCase().includes(q) ||
            topic.description.toLowerCase().includes(q) ||
            domain.name.toLowerCase().includes(q) ||
            topic.roles.some((r) => r.toLowerCase().includes(q))
          if (!matches) return
        }

        list.push({
          topic,
          domain,
          completedLearners,
          inProgressLearners,
          notStartedLearners,
          adoptionPercentage,
          totalLearnersCount: totalLearners,
        })
      })
    })

    // Sort modules by adoption percentage high to low (highest % first)
    list.sort((a, b) => {
      if (b.adoptionPercentage !== a.adoptionPercentage) {
        return b.adoptionPercentage - a.adoptionPercentage
      }
      if (b.completedLearners.length !== a.completedLearners.length) {
        return b.completedLearners.length - a.completedLearners.length
      }
      if (b.inProgressLearners.length !== a.inProgressLearners.length) {
        return b.inProgressLearners.length - a.inProgressLearners.length
      }
      return a.topic.title.localeCompare(b.topic.title)
    })

    return list
  }, [domains, rankedLeaderboard, orgDomainFilter, adoptionFilter, orgSearchQuery])

  // Toggle learner progress on a module directly from the breakdown
  const handleToggleLearnerTopic = (learnerId: string, topicId: string) => {
    const next = podLearners.map((l) => {
      if (l.id !== learnerId) return l
      const current = l.progress[topicId]
      const updatedProgress = { ...l.progress }
      if (current === "COMPLETED") {
        delete updatedProgress[topicId]
      } else if (current === "IN_PROGRESS") {
        updatedProgress[topicId] = "COMPLETED"
      } else {
        updatedProgress[topicId] = "IN_PROGRESS"
      }
      return { ...l, progress: updatedProgress }
    })
    handleUpdatePodLearners(next)
  }

  // ==================== CURRICULUM MANAGEMENT CRUD STATE ====================
  const [moduleSearchQuery, setModuleSearchQuery] = useState("")
  const [moduleDomainFilter, setModuleDomainFilter] = useState<string>("ALL")
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [deletingTopic, setDeletingTopic] = useState<{ topic: Topic; domainId: string } | null>(null)

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
    <div className="space-y-4">
      {/* Back to Curriculum Nav Link (Screenshot Specification) */}
      {onNavigateToCurriculum && (
        <button
          onClick={onNavigateToCurriculum}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition group py-0.5"
        >
          <span className="text-zinc-500 group-hover:-translate-x-0.5 transition-transform font-mono">←</span>
          <span>Back to Curriculum (What to Learn)</span>
        </button>
      )}

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
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl font-normal">
              Executive overview of pod competency adoption, team leaderboard rankings, and curriculum authoring.
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
              <span>Leaderboard & Module Adoption</span>
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
      {/* SUB-VIEW 1: LEADERBOARD & ORG-WIDE MODULE ADOPTION MATRIX                 */}
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
              <p className="text-2xl font-bold text-white mt-2">{rankedLeaderboard.length} Learners</p>
              <p className="text-xs text-zinc-500 mt-1">Cross-pod engineering & design staff</p>
            </div>

            <div className="bg-[#121316] p-5 rounded-xl border border-zinc-800/80 shadow-sm">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                <span>Org Completion Rate</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400 mt-2">{aggregateOrgCompletion}%</p>
              <p className="text-xs text-zinc-500 mt-1">Total collective readiness score</p>
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
                <span>Top Ranked Learner</span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xl font-bold text-white mt-2 truncate">
                {rankedLeaderboard[0]?.name || "—"}
              </p>
              <p className={`text-xs font-semibold mt-1 ${rankedLeaderboard[0] ? "text-emerald-400" : "text-zinc-500"}`}>
                {rankedLeaderboard[0] ? `${rankedLeaderboard[0].percentage}% Readiness` : "No learners registered"}
              </p>
            </div>
          </div>

          {/* Master-Detail Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ========================================================================= */}
            {/* 1. LEFT PANEL: POD LEADERBOARD (Annotated 1)                              */}
            {/* ========================================================================= */}
            <div className="lg:col-span-4 bg-[#121316] p-5 rounded-xl border border-zinc-800/80 shadow-sm space-y-3.5 lg:sticky lg:top-24 self-start">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Pod Leaderboard</h3>
                    <p className="text-[11px] text-zinc-400 font-normal">Ranked by verified readiness</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsEnrollModalOpen(true)}
                    className="text-[11px] px-2 py-1 rounded-md font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 transition flex items-center gap-1"
                    title="Add a real team member to pod"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Learner</span>
                  </button>

                  <button
                    onClick={() => setAuditViewMode("ALL_LEARNERS")}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition ${
                      auditViewMode === "ALL_LEARNERS"
                        ? "bg-blue-950 text-blue-300 border border-blue-800/60"
                        : "bg-zinc-800/80 text-zinc-400 hover:text-white border border-zinc-700/50"
                    }`}
                    title="View aggregate completion % across all learners"
                  >
                    All Learners %
                  </button>
                </div>
              </div>

              {/* Leaderboard Ranks */}
              <div className="space-y-2">
                {rankedLeaderboard.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl bg-[#0a0a0c]/60 space-y-2">
                    <Users className="w-8 h-8 text-zinc-600 mx-auto" />
                    <p className="text-xs font-semibold text-zinc-300">No Learners in Pod Yet</p>
                    <p className="text-[11px] text-zinc-500 max-w-[220px] mx-auto leading-relaxed">
                      Click &quot;+ Add Learner&quot; above to enroll pod members or let team members sign up via Blocks IAM.
                    </p>
                  </div>
                ) : (
                  rankedLeaderboard.map((learner, idx) => {
                  const rank = idx + 1
                  const isSelected = auditViewMode === "INDIVIDUAL_AUDIT" && selectedLearnerId === learner.id

                  return (
                    <button
                      key={learner.id}
                      onClick={() => {
                        setSelectedLearnerId(learner.id)
                        setAuditViewMode("INDIVIDUAL_AUDIT")
                      }}
                      className={`w-full p-3 rounded-lg border text-left transition flex items-center justify-between group ${
                        isSelected
                          ? "bg-[#181a20] border-zinc-400 text-white shadow-sm ring-1 ring-zinc-400/30"
                          : "bg-[#0e0f12] border-zinc-800/90 hover:border-zinc-700 hover:bg-[#14151a]"
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {/* Rank Badge */}
                        <div className="shrink-0 flex items-center justify-center w-6 text-xs font-black">
                          {rank === 1 ? (
                            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-xs">
                              1
                            </span>
                          ) : rank === 2 ? (
                            <span className="w-6 h-6 rounded-full bg-zinc-400/20 text-zinc-300 border border-zinc-400/40 flex items-center justify-center text-xs">
                              2
                            </span>
                          ) : rank === 3 ? (
                            <span className="w-6 h-6 rounded-full bg-amber-800/20 text-amber-500 border border-amber-800/40 flex items-center justify-center text-xs">
                              3
                            </span>
                          ) : (
                            <span className="text-zinc-500 font-mono text-xs">#{rank}</span>
                          )}
                        </div>

                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${
                          isSelected
                            ? "bg-blue-600 border-blue-400 text-white"
                            : "bg-zinc-800 border-zinc-700 text-zinc-300"
                        }`}>
                          {learner.avatar}
                        </div>

                        {/* Name & Role */}
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${isSelected ? "text-white" : "text-zinc-200"}`}>
                            {learner.name}
                          </p>
                          <p className="text-[11px] text-zinc-400 font-normal truncate">
                            {learner.role}
                          </p>
                        </div>
                      </div>

                      {/* Percentage & Count */}
                      <div className="text-right shrink-0 ml-2">
                        <span className="text-xs font-bold text-emerald-400">{learner.percentage}%</span>
                        <p className="text-[10px] text-zinc-500">
                          {learner.completed}/{totalTopicsCount}
                        </p>
                      </div>
                    </button>
                  )
                }))}
              </div>

              {/* Note for Unit Head */}
              <div className="p-3 bg-[#0a0a0c] border border-zinc-800 rounded-lg text-xs text-zinc-400">
                <span className="text-zinc-300 font-semibold block mb-0.5">Executive View:</span>
                Unit Head does not study modules. Click any learner to inspect their personal notes, or click "All Learners %" to view collective adoption.
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 2. RIGHT PANEL: ORG-WIDE MODULE ADOPTION MATRIX (Annotated 2)              */}
            {/* ========================================================================= */}
            <div className="lg:col-span-8 bg-[#121316] p-6 rounded-xl border border-zinc-800/80 shadow-sm space-y-6">
              {auditViewMode === "ALL_LEARNERS" ? (
                <>
                  {/* Executive Header for All Learners Collective Adoption */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-5 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                          Organizational Competency Adoption
                        </h2>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/50 font-medium">
                          All {rankedLeaderboard.length} Learners Combined
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        Tracking which modules the pod has mastered, which are in adoption, and organizational training deficits.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-400">{aggregateOrgCompletion}%</span>
                        <p className="text-[10px] text-zinc-500">Avg Org Readiness</p>
                      </div>
                    </div>
                  </div>

                  {/* Filter & Search Toolbar */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      {/* Adoption Filter Tabs */}
                      <div className="flex items-center gap-1 bg-[#0a0a0c] p-1 rounded-lg border border-zinc-800 text-xs">
                        {(["ALL", "HIGH", "IN_PROGRESS", "DEFICIT"] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => setAdoptionFilter(st)}
                            className={`px-3 py-1.5 rounded-md font-medium transition ${
                              adoptionFilter === st
                                ? "bg-zinc-800 text-white shadow-sm"
                                : "text-zinc-400 hover:text-zinc-200"
                            }`}
                          >
                            {st === "ALL" && "All Modules"}
                            {st === "HIGH" && "High Adoption (≥50%)"}
                            {st === "IN_PROGRESS" && "In Adoption (1-49%)"}
                            {st === "DEFICIT" && "Skill Gap (0%)"}
                          </button>
                        ))}
                      </div>

                      {/* Domain Dropdown */}
                      <select
                        value={orgDomainFilter}
                        onChange={(e) => setOrgDomainFilter(e.target.value)}
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
                        value={orgSearchQuery}
                        onChange={(e) => setOrgSearchQuery(e.target.value)}
                        placeholder="Search modules by title, keyword, or role tags..."
                        className="w-full pl-9 pr-3 py-2 bg-[#0a0a0c] border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Modules Adoption List */}
                  <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                    {allModulesAdoption.length === 0 ? (
                      <div className="p-12 text-center text-xs text-zinc-400 border border-dashed border-zinc-800 rounded-xl bg-[#0a0a0c]/50">
                        <CheckCircle2 className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                        <p className="font-semibold text-zinc-300">No modules match this adoption filter</p>
                        <p className="text-[11px] text-zinc-500 mt-1">Try resetting the adoption tab or selecting all domains.</p>
                      </div>
                    ) : (
                      allModulesAdoption.map(({ topic, domain, completedLearners, inProgressLearners, adoptionPercentage, totalLearnersCount }) => {
                        const isExpanded = expandedModuleId === topic.id
                        const isHigh = adoptionPercentage >= 50
                        const isZero = adoptionPercentage === 0

                        return (
                          <div
                            key={topic.id}
                            className={`p-4 rounded-xl border transition ${
                              isHigh
                                ? "bg-[#0e1612]/30 border-emerald-900/40"
                                : isZero
                                ? "bg-[#181116]/30 border-red-950/40"
                                : "bg-[#0e0f12] border-zinc-800/80"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded">
                                    {domain.code} · {domain.name}
                                  </span>
                                  {topic.roles.map((r) => (
                                    <span key={r} className="text-[9px] text-zinc-500 font-medium">
                                      • {r}
                                    </span>
                                  ))}
                                </div>
                                <h4 className="text-sm font-bold text-zinc-100">{topic.title}</h4>
                                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                  {topic.description}
                                </p>
                              </div>

                              {/* Org Adoption Percentage & Progress Bar */}
                              <div className="w-full sm:w-56 shrink-0 bg-[#0a0a0c] p-3 rounded-lg border border-zinc-800/80 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] text-zinc-400 font-medium">Pod Adoption</span>
                                  <span className={`text-base font-black ${
                                    isHigh ? "text-emerald-400" : isZero ? "text-red-400" : "text-blue-400"
                                  }`}>
                                    {adoptionPercentage}%
                                  </span>
                                </div>

                                {/* Adoption Bar */}
                                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    style={{ width: `${adoptionPercentage}%` }}
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      isHigh ? "bg-emerald-500" : isZero ? "bg-zinc-700" : "bg-blue-500"
                                    }`}
                                  />
                                </div>

                                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
                                  <span>{completedLearners.length}/{totalLearnersCount} Completed</span>
                                  <span>{inProgressLearners.length} In Progress</span>
                                </div>
                              </div>
                            </div>

                            {/* Completed Learners Avatars & Breakdown Toggle */}
                            <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-zinc-400 font-medium">Completed by:</span>
                                {completedLearners.length === 0 ? (
                                  <span className="text-[11px] text-red-400/80 font-medium">No learners yet (Training Gap)</span>
                                ) : (
                                  <div className="flex items-center -space-x-1.5">
                                    {completedLearners.map((l) => (
                                      <div
                                        key={l.id}
                                        title={`${l.name} (${l.role}) - Completed`}
                                        className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center justify-center text-[10px] font-bold"
                                      >
                                        {l.avatar}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => setExpandedModuleId(isExpanded ? null : topic.id)}
                                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium transition"
                              >
                                <span>{isExpanded ? "Hide Breakdown" : "Inspect Learner Notes & Status"}</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                              </button>
                            </div>

                            {/* Expanded Learner Inspection Drawer */}
                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-zinc-800 bg-[#0a0a0c] p-3 rounded-lg space-y-2.5 text-xs">
                                <h5 className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px]">
                                  Learner Pacing Breakdown for "{topic.title}":
                                </h5>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {rankedLeaderboard.map((learner) => {
                                    const st = learner.progress[topic.id]
                                    const note = learner.notes[topic.id]
                                    const isComp = st === "COMPLETED"
                                    const isInP = st === "IN_PROGRESS"

                                    return (
                                      <div
                                        key={learner.id}
                                        className="p-2.5 rounded-lg border border-zinc-800 bg-[#121316] flex flex-col justify-between"
                                      >
                                        <div className="flex items-center justify-between mb-1.5">
                                          <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-200 flex items-center justify-center">
                                              {learner.avatar}
                                            </div>
                                            <div>
                                              <p className="font-semibold text-xs text-white">{learner.name}</p>
                                              <p className="text-[10px] text-zinc-400">{learner.role}</p>
                                            </div>
                                          </div>

                                          <button
                                            onClick={() => handleToggleLearnerTopic(learner.id, topic.id)}
                                            className={`text-[10px] px-2 py-0.5 rounded font-medium border transition ${
                                              isComp
                                                ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                                                : isInP
                                                ? "bg-blue-950 text-blue-300 border-blue-800"
                                                : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                            }`}
                                          >
                                            {isComp ? "Completed ✓" : isInP ? "In Progress" : "Not Started"}
                                          </button>
                                        </div>

                                        {note && (
                                          <div className="mt-1 pt-1 border-t border-zinc-800/80 text-[10px] text-zinc-400 font-mono">
                                            <span className="text-blue-400 font-sans font-medium">Note: </span>
                                            <span className="line-clamp-3">{noteToPlainText(note)}</span>
                                          </div>
                                        )}
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
                </>
              ) : currentLearner ? (
                /* ================= INDIVIDUAL LEARNER DRILLDOWN ================= */
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-base font-bold text-white shadow">
                        {currentLearner.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-white">{currentLearner.name}</h2>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-medium">
                            {currentLearner.role}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">{currentLearner.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-2xl font-bold text-emerald-400">{currentLearner.percentage}%</span>
                        <p className="text-[10px] text-zinc-500">Readiness Score</p>
                      </div>
                      <button
                        onClick={() => setAuditViewMode("ALL_LEARNERS")}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
                      >
                        ← Back to All Learners %
                      </button>
                    </div>
                  </div>

                  {/* Individual Modules Audit Checklist */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Module Checklist for {currentLearner.name} ({currentLearner.completed} of {totalTopicsCount} Completed):
                    </h4>

                    <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                      {domains.flatMap((d) => d.topics.map((t) => ({ topic: t, domain: d }))).map(({ topic, domain }) => {
                        const st = currentLearner.progress[topic.id]
                        const isComp = st === "COMPLETED"
                        const isInP = st === "IN_PROGRESS"
                        const note = currentLearner.notes[topic.id]

                        return (
                          <div
                            key={topic.id}
                            className={`p-3.5 rounded-xl border transition ${
                              isComp
                                ? "bg-[#0e1612]/40 border-emerald-900/50"
                                : isInP
                                ? "bg-[#0e1320]/40 border-blue-900/50"
                                : "bg-[#0e0f12] border-zinc-800/80"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded">
                                  {domain.code} · {domain.name}
                                </span>
                                <h5 className="text-xs font-bold text-white mt-1">{topic.title}</h5>
                                <p className="text-[11px] text-zinc-400 mt-0.5">{topic.description}</p>
                              </div>

                              <button
                                onClick={() => handleToggleLearnerTopic(currentLearner.id, topic.id)}
                                className={`text-xs px-2.5 py-1 rounded-lg font-medium border transition shrink-0 ${
                                  isComp
                                    ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                                    : isInP
                                    ? "bg-blue-950 text-blue-300 border-blue-800"
                                    : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                }`}
                              >
                                {isComp ? "Completed ✓" : isInP ? "In Progress" : "Not Started"}
                              </button>
                            </div>

                            {note && (
                              <div className="mt-2 pt-2 border-t border-zinc-800 text-xs text-zinc-300 bg-[#0a0a0c] p-2 rounded">
                                <span className="text-blue-400 font-sans font-medium">Learner Note: </span>
                                <div className="mt-1 max-h-64 overflow-y-auto">
                                  <NoteViewer content={note} />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-xs text-zinc-400 border border-dashed border-zinc-800 rounded-xl bg-[#0a0a0c]/60 space-y-2">
                  <Users className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs font-semibold text-zinc-300">No Learner Selected</p>
                  <p className="text-[11px] text-zinc-500 max-w-[240px] mx-auto leading-relaxed">
                    Select a learner from the leaderboard on the left, or view organizational competency adoption.
                  </p>
                  <button
                    onClick={() => setAuditViewMode("ALL_LEARNERS")}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
                  >
                    View All Learners Adoption
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: CURRICULUM & MODULE MANAGER (Add, Edit, Delete any module)    */}
      {/* ========================================================================= */}
      {activeSubTab === "curriculum" && (
        <div className="space-y-6">
          {/* Controls bar: Search, Domain filter, Add New Module button */}
          <div className="bg-[#121316] p-5 rounded-xl border border-zinc-800/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
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

                        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-end gap-2">
                          <button
                            onClick={() => setGuideTopic(topic)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-950/70 text-blue-200 border border-blue-800/50 text-xs font-medium transition flex items-center gap-1.5"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Guide</span>
                          </button>
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

      {/* ================= MODALS: ADD / EDIT / DELETE ================= */}
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
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow transition disabled:opacity-50"
              >
                Create Module
              </button>
            </div>
          </div>
        </div>
      )}

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

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Module Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Learning Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                />
              </div>

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

      {/* Modal: Enroll Real Learner */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316] border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Enroll Pod Member</h3>
                  <p className="text-xs text-zinc-400">Add a real team member to track curriculum progress</p>
                </div>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={enrollName}
                  onChange={(e) => setEnrollName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Work Email</label>
                <input
                  type="email"
                  value={enrollEmail}
                  onChange={(e) => setEnrollEmail(e.target.value)}
                  placeholder="e.g. member@company.com"
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Discipline Track</label>
                <select
                  value={enrollRole}
                  onChange={(e) => setEnrollRole(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Product Engineer">Product Engineer</option>
                  <option value="AI Product Manager">AI Product Manager</option>
                  <option value="Product Consultant">Product Consultant</option>
                  <option value="Service Designer">Service Designer</option>
                  <option value="Cloud Architect">Cloud Architect</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEnrollLearner}
                disabled={!enrollName.trim() || !enrollEmail.trim()}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow transition disabled:opacity-50"
              >
                Enroll Member
              </button>
            </div>
          </div>
        </div>
      )}
    {guideTopic && <TopicGuideModal topic={guideTopic} onClose={() => setGuideTopic(null)} />}
    </div>
  )
}
