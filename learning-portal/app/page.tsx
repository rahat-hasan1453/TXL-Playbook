"use client"

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { CURRICULUM_DOMAINS, Domain, Topic } from "@/lib/curriculumData"
import { UserSession } from "@/lib/auth"
import {
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Share2,
  FileText,
  Users,
  BarChart3,
  Search,
  Filter,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Award,
  TrendingUp,
  UserCheck,
  ShieldAlert,
  GraduationCap,
  ArrowRight,
  Check,
  Heart,
  LogOut,
  X,
  CalendarDays,
} from "lucide-react"
import RolePathwaysView, { ROLE_TRACKS } from "@/components/RolePathwaysView"
import UnitHeadManagementView from "@/components/UnitHeadManagementView"
import LearningHub from "@/components/game/LearningHub"
import GameChip from "@/components/game/GameChip"
import RewardToaster from "@/components/game/RewardToaster"
import Leaderboard from "@/components/game/Leaderboard"
import { announceReward } from "@/lib/reward-events"
import ThemeToggle from "@/components/ThemeToggle"
import RichNoteEditor, { NoteViewer } from "@/components/NotesEditor"
import { isNoteEmpty, noteToPlainText } from "@/lib/note-content"

export default function TXLLearningPortal() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [activeTab, setActiveTab] = useState<"what-to-learn" | "my-plan" | "my-notes" | "shared-feed" | "unit-head">("what-to-learn")
  const [selectedRoleTrack, setSelectedRoleTrack] = useState<string>("ALL")
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Curriculum domains state (persisted to localStorage so Unit Head changes persist across reload)
  const [domains, setDomains] = useState<Domain[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("txl_curriculum_domains")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Failed to parse saved curriculum domains", e)
        }
      }
    }
    return CURRICULUM_DOMAINS
  })

  const handleUpdateDomains = (updatedDomains: Domain[]) => {
    setDomains(updatedDomains)
    if (typeof window !== "undefined") {
      localStorage.setItem("txl_curriculum_domains", JSON.stringify(updatedDomains))
    }
    // Persist to server
    fetch("/api/curriculum", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domains: updatedDomains }),
    }).catch((err) => console.warn("Failed to persist curriculum:", err))
  }

  // Load latest curriculum from server on mount
  useEffect(() => {
    fetch("/api/curriculum")
      .then((res) => res.json())
      .then((data) => {
        if (data?.domains && Array.isArray(data.domains)) {
          setDomains(data.domains)
        }
      })
      .catch(() => {})
  }, [])

  const [roleUpgradeNotice, setRoleUpgradeNotice] = useState<string | null>(null)

  // Verify and sync session dynamically (handles real-time role promotion while user is active)
  const syncSession = useCallback(async (isInitial = false) => {
    try {
      const res = await fetch("/api/auth/session")
      const data = await res.json()
      if (data?.user) {
        setCurrentUser((prev) => {
          if (prev && prev.role !== data.user.role) {
            if (data.user.role === "UNIT_HEAD") {
              setRoleUpgradeNotice(
                "Your account has been upgraded to Unit Head / Educator! Executive Command Center is now active."
              )
              setActiveTab("unit-head")
            }
          } else if (isInitial && data.user.role === "UNIT_HEAD") {
            setActiveTab("unit-head")
          }
          return data.user
        })

        if (data.roleUpdated && data.newRole === "UNIT_HEAD") {
          setRoleUpgradeNotice(
            "Your account has been upgraded to Unit Head / Educator! Executive Command Center is now active."
          )
          setActiveTab("unit-head")
        }
      } else {
        router.push("/login")
      }
    } catch {
      // Retain offline state on minor network hiccup
    } finally {
      setIsLoadingSession(false)
    }
  }, [router])

  useEffect(() => {
    syncSession(true)

    // Live tab-focus verification (detects when admin promoted user in IAM or another tab)
    const handleFocus = () => {
      syncSession(false)
    }
    window.addEventListener("focus", handleFocus)

    // Periodic heartbeat check every 45s
    const interval = setInterval(() => syncSession(false), 45000)

    return () => {
      window.removeEventListener("focus", handleFocus)
      clearInterval(interval)
    }
  }, [syncSession])

  const currentUserRole: "LEARNER" | "UNIT_HEAD" = currentUser?.role || "LEARNER"

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (err) {
      console.error("Logout failed:", err)
      router.push("/login")
    }
  }

  // User progress data (Topic ID -> 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED')
  const [progressState, setProgressState] = useState<Record<string, "COMPLETED" | "IN_PROGRESS">>({})

  // User personal notes per topic (Topic ID -> note string)
  const [userNotes, setUserNotes] = useState<Record<string, string>>({})

  // Fetch active learner's real progress and notes from server
  useEffect(() => {
    let isMounted = true
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progress")
        const data = await res.json()
        if (isMounted) {
          if (data?.progress) {
            setProgressState(data.progress)
          }
          if (data?.notes) {
            setUserNotes(data.notes)
          }
        }
      } catch (err) {
        console.warn("Could not load learner progress:", err)
      }
    }

    if (currentUserRole === "LEARNER") {
      fetchProgress()
    }

    return () => {
      isMounted = false
    }
  }, [currentUserRole])

  // Shared learnings feed
  const [sharedLearnings, setSharedLearnings] = useState<Array<{
    id: string
    userName: string
    userRole: string
    topicTitle: string
    domainName: string
    note: string
    timestamp: string
    likes: number
  }>>([])

  // Load shared feed on mount
  useEffect(() => {
    fetch("/api/feed")
      .then((res) => res.json())
      .then((data) => {
        if (data?.feed && Array.isArray(data.feed)) {
          setSharedLearnings(data.feed)
        }
      })
      .catch(() => {})
  }, [])

  // Active modal for taking notes or sharing
  const [activeModalTopic, setActiveModalTopic] = useState<Topic | null>(null)
  const [noteDraft, setNoteDraft] = useState("")
  const [shareDraft, setShareDraft] = useState("")
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  // Total topics calculation
  const totalTopicsCount = useMemo(() => {
    return domains.reduce((acc, d) => acc + d.topics.length, 0)
  }, [domains])

  // User completed count
  const completedCount = useMemo(() => {
    return Object.values(progressState).filter((s) => s === "COMPLETED").length
  }, [progressState])

  const completionPercentage = totalTopicsCount ? Math.round((completedCount / totalTopicsCount) * 100) : 0

  // Toggle progress status
  const handleToggleStatus = (topicId: string) => {
    const current = progressState[topicId]
    const nextStatus = current === "COMPLETED" ? "NOT_STARTED" : current === "IN_PROGRESS" ? "COMPLETED" : "IN_PROGRESS"

    setProgressState((prev) => {
      if (nextStatus === "NOT_STARTED") {
        const next = { ...prev }
        delete next[topicId]
        return next
      }
      return { ...prev, [topicId]: nextStatus }
    })

    // Immediately persist to server
    fetch("/api/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, status: nextStatus }),
    })
      .then((res) => res.json())
      .then((data) => announceReward(data?.reward))
      .catch((err) => console.warn("Failed to sync progress to server:", err))
  }

  // Set a topic's completion directly (planner cards and reminder checklist)
  const handleSetTopicCompleted = (topicId: string, completed: boolean) => {
    setProgressState((prev) => {
      const next = { ...prev }
      if (completed) next[topicId] = "COMPLETED"
      else delete next[topicId]
      return next
    })
    fetch("/api/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, status: completed ? "COMPLETED" : "NOT_STARTED" }),
    })
      .then((res) => res.json())
      .then((data) => announceReward(data?.reward))
      .catch((err) => console.warn("Failed to sync progress to server:", err))
  }

  // Notes autosave while typing; the modal's Done button flushes any pending save
  const [noteSaveState, setNoteSaveState] = useState<"idle" | "saving" | "saved">("idle")
  const noteSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingNote = useRef<{ topicId: string; content: string } | null>(null)

  const persistNote = (topicId: string, rawContent: string) => {
    const content = isNoteEmpty(rawContent) ? "" : rawContent
    const status = progressState[topicId] || "IN_PROGRESS"
    setUserNotes((prev) => {
      const next = { ...prev }
      if (content) next[topicId] = content
      else delete next[topicId]
      return next
    })
    setProgressState((prev) => ({ ...prev, [topicId]: status }))
    setNoteSaveState("saving")
    fetch("/api/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, status, note: content }),
    })
      .then((res) => res.json())
      .then((data) => {
        setNoteSaveState("saved")
        announceReward(data?.reward)
      })
      .catch((err) => {
        setNoteSaveState("idle")
        console.warn("Failed to sync note to server:", err)
      })
  }

  const flushPendingNote = () => {
    if (noteSaveTimer.current) clearTimeout(noteSaveTimer.current)
    noteSaveTimer.current = null
    if (pendingNote.current) {
      persistNote(pendingNote.current.topicId, pendingNote.current.content)
      pendingNote.current = null
    }
  }

  const handleNoteChange = (topicId: string, html: string) => {
    setNoteDraft(html)
    pendingNote.current = { topicId, content: html }
    setNoteSaveState("idle")
    if (noteSaveTimer.current) clearTimeout(noteSaveTimer.current)
    noteSaveTimer.current = setTimeout(flushPendingNote, 800)
  }

  // Open Notes Modal
  const handleOpenNotes = (topic: Topic) => {
    flushPendingNote()
    setActiveModalTopic(topic)
    setNoteDraft(userNotes[topic.id] || "")
    setNoteSaveState("idle")
    setIsShareModalOpen(false)
  }

  // Close Notes Modal, saving anything still pending
  const handleCloseNotes = () => {
    flushPendingNote()
    setActiveModalTopic(null)
  }

  // Open Share Modal
  const handleOpenShare = (topic: Topic) => {
    setActiveModalTopic(topic)
    setShareDraft(noteToPlainText(userNotes[topic.id] || ""))
    setIsShareModalOpen(true)
  }

  // Publish Shared Learning
  const handlePublishShare = async () => {
    if (activeModalTopic && shareDraft.trim()) {
      const domain = domains.find((d) => d.id === activeModalTopic.domainId)
      const noteContent = shareDraft.trim()
      const payload = {
        topicTitle: activeModalTopic.title,
        domainName: domain?.name || "Curriculum",
        note: noteContent,
      }

      const tempId = `sh-${Date.now()}`
      const newEntry = {
        id: tempId,
        userName: currentUser?.name || (currentUserRole === "UNIT_HEAD" ? "Unit Lead" : "Learner"),
        userRole: currentUser?.discipline || (currentUserRole === "UNIT_HEAD" ? "Unit Head" : "Learner"),
        topicTitle: activeModalTopic.title,
        domainName: domain?.name || "Curriculum",
        note: noteContent,
        timestamp: "Just now",
        likes: 0,
      }
      setSharedLearnings([newEntry, ...sharedLearnings])
      setIsShareModalOpen(false)
      setActiveModalTopic(null)
      setShareDraft("")
      setActiveTab("shared-feed")

      try {
        const res = await fetch("/api/feed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        announceReward(data?.reward)
        if (data?.item) {
          setSharedLearnings((prev) => [data.item, ...prev.filter((i) => i.id !== tempId)])
        }
      } catch (err) {
        console.warn("Failed to persist shared learning:", err)
      }
    }
  }

  // Like a shared learning item
  const handleLikeItem = (itemId: string) => {
    setSharedLearnings((prev) =>
      prev.map((l) => (l.id === itemId ? { ...l, likes: l.likes + 1 } : l))
    )
    fetch("/api/feed", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: itemId }),
    }).catch((err) => console.warn("Failed to register like:", err))
  }

  if (isLoadingSession && !currentUser) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#121316] border border-purple-900/60 flex items-center justify-center text-purple-400 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <p className="text-xs text-zinc-500 font-medium tracking-wide">Loading workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-800/80 bg-[#0c0d10]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: App Logo, Badge & Chapter Subtitle */}
          {currentUserRole === "UNIT_HEAD" ? (
            <div className="flex items-center space-x-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-[#121316] border border-purple-900/60 flex items-center justify-center text-purple-400 shadow-sm">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                    TXL Playbook
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 font-medium border border-purple-800/50">
                    Executive
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-normal">Executive Command Center · Unit Management</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab("what-to-learn")}
              className="flex items-center space-x-3 text-left group transition focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-[#121316] border border-zinc-800 flex items-center justify-center text-blue-400 shadow-sm group-hover:border-zinc-700 transition">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                    TXL Playbook
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-medium border border-zinc-700/40">
                    2026
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 font-normal">Chapter 15 · What to Learn</p>
              </div>
            </button>
          )}

          {/* Right: User Profile Card */}
          <div className="flex items-center gap-2">
          <ThemeToggle />
          {currentUserRole === "LEARNER" && <GameChip onClick={() => setActiveTab("my-plan")} />}
          {currentUserRole === "LEARNER" && (
            <button
              onClick={() => setActiveTab(activeTab === "my-plan" ? "what-to-learn" : "my-plan")}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition ${
                activeTab === "my-plan"
                  ? "bg-white text-black border-white"
                  : "bg-[#121316] text-zinc-200 border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{activeTab === "my-plan" ? "Curriculum" : "My Plan"}</span>
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 bg-[#121316] hover:bg-[#16171b] border border-zinc-800/80 hover:border-zinc-700 px-3 py-2 rounded-xl transition text-left shadow-sm cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-xs font-bold text-zinc-200">
                {currentUser?.avatar || (currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : (currentUserRole === "UNIT_HEAD" ? "UH" : "LN"))}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-xs text-white leading-tight">
                    {currentUser?.name || (currentUserRole === "UNIT_HEAD" ? "Unit Head" : "Learner")}
                  </p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                    {currentUserRole === "UNIT_HEAD" ? "Unit Head" : "Learner"}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 font-normal leading-tight">
                  {currentUser?.discipline || (currentUserRole === "UNIT_HEAD" ? "Leadership & Strategy" : "Active Learner")}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-[#121316] border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs">
                  {currentUserRole === "UNIT_HEAD" ? (
                    <>
                      {/* Unit Head Dropdown - Executive View Only */}
                      <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-white truncate">{currentUser?.name || "Unit Head"}</p>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800/50 font-medium">
                            Unit Head
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">{currentUser?.email || ""}</p>
                      </div>

                      <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium bg-purple-950/40 text-purple-200 border border-purple-800/40 my-1">
                        <span className="flex items-center gap-2">
                          <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                          <span>Unit Head Command Center</span>
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900 text-purple-200 border border-purple-700/50">
                          Active
                        </span>
                      </div>

                      <div className="border-t border-zinc-800/80 my-1 pt-1" />

                      <button
                        onClick={() => { setIsUserMenuOpen(false); handleLogout() }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-red-400 hover:bg-red-950/30 transition text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Learner Dropdown Menu */}
                      <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                        <p className="font-semibold text-white truncate">{currentUser?.name || "Active Session"}</p>
                        <p className="text-[11px] text-zinc-400 truncate">{currentUser?.email || ""}</p>
                      </div>

                      <button
                        onClick={() => { setActiveTab("what-to-learn"); setIsUserMenuOpen(false) }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition text-left ${
                          activeTab === "what-to-learn" ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-800/60"
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                        <span>What to Learn (Curriculum)</span>
                      </button>

                      <button
                        onClick={() => { setActiveTab("my-plan"); setIsUserMenuOpen(false) }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition text-left ${
                          activeTab === "my-plan" ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-800/60"
                        }`}
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
                        <span>My Learning Plan</span>
                      </button>

                      <button
                        onClick={() => { setActiveTab("my-notes"); setIsUserMenuOpen(false) }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition text-left ${
                          activeTab === "my-notes" ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-800/60"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>My Notes</span>
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                          {Object.keys(userNotes).length}
                        </span>
                      </button>

                      <button
                        onClick={() => { setActiveTab("shared-feed"); setIsUserMenuOpen(false) }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition text-left ${
                          activeTab === "shared-feed" ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-800/60"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                          <span>Shared Learnings</span>
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                          {sharedLearnings.length}
                        </span>
                      </button>

                      <div className="border-t border-zinc-800/80 my-1 pt-1" />

                      <button
                        onClick={() => { setIsUserMenuOpen(false); handleLogout() }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-red-400 hover:bg-red-950/30 transition text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* Live Role Upgrade Alert Banner */}
      {roleUpgradeNotice && (
        <div className="bg-gradient-to-r from-purple-950/90 via-blue-950/90 to-purple-950/90 border-b border-purple-700/60 py-3 px-4 z-30 shadow-lg">
          <div className="max-w-[1536px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-purple-200">
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 shrink-0">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
              </span>
              <span className="font-semibold text-white">{roleUpgradeNotice}</span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => {
                  setActiveTab("unit-head")
                  setRoleUpgradeNotice(null)
                }}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs transition shadow flex items-center gap-1.5"
              >
                <span>Enter Command Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setRoleUpgradeNotice(null)}
                className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900/40 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {currentUserRole === "UNIT_HEAD" ? (
          /* ================= UNIT HEAD DIRECT WORKSPACE (NO LEARNER OPTIONS) ================= */
          <UnitHeadManagementView
            domains={domains}
            onUpdateDomains={handleUpdateDomains}
            currentUser={currentUser}
            currentLearnerProgress={progressState}
            currentLearnerNotes={userNotes}
          />
        ) : null}
        {currentUserRole === "UNIT_HEAD" && (
          <div className="mt-6">
            <Leaderboard />
          </div>
        )}
        {currentUserRole === "UNIT_HEAD" ? null : (
          /* ================= LEARNER WORKSPACE ================= */
          <>
            {/* ================= PRIMARY VIEW: WHAT TO LEARN (ROLE TRACKS) ================= */}
            {activeTab === "what-to-learn" && (
              <div className="space-y-4">
                <RolePathwaysView
                  progressState={progressState}
                  onToggleStatus={handleToggleStatus}
                  userNotes={userNotes}
                  onOpenNotes={handleOpenNotes}
                  onOpenShare={handleOpenShare}
                  activeRoleKey={selectedRoleTrack}
              onRoleChange={setSelectedRoleTrack}
              domains={domains}
            />
          </div>
        )}

        {/* ================= LEARNING PLANNER ================= */}
        {activeTab === "my-plan" && (
          <LearningHub
            domains={domains}
            progressState={progressState}
            onSetTopicCompleted={handleSetTopicCompleted}
            onOpenNotes={handleOpenNotes}
          />
        )}

        {/* ================= VIEW 2: MY NOTES ================= */}
        {activeTab === "my-notes" && (
          <div className="space-y-6">
            <button
              onClick={() => setActiveTab("what-to-learn")}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition w-fit"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span>Back to Curriculum (What to Learn)</span>
            </button>

            <div className="bg-[#121316] p-6 rounded-2xl border border-zinc-800/80 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-medium tracking-wide text-zinc-400 bg-zinc-800/80 px-2.5 py-0.5 rounded-full border border-zinc-700/50">
                  Personal Archive
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">My Learning Notes</h1>
              <p className="text-sm text-zinc-400 mt-1">
                Your private implementation notes, observations, and key takeaways across the 82 competencies.
              </p>
            </div>

            {Object.keys(userNotes).length === 0 ? (
              <div className="p-16 text-center border border-dashed border-zinc-800 rounded-2xl bg-[#121316]/50">
                <FileText className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-zinc-200">No notes logged yet</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Click "Note" on any topic in the curriculum to record your personal learnings.
                </p>
                <button
                  onClick={() => setActiveTab("what-to-learn")}
                  className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition"
                >
                  Browse Topics
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(userNotes).map(([topicId, noteContent]) => {
                  let foundTopic: Topic | undefined
                  let foundDomain: Domain | undefined
                  for (const d of domains) {
                    const t = d.topics.find((item) => item.id === topicId)
                    if (t) {
                      foundTopic = t
                      foundDomain = d
                      break
                    }
                  }

                  return (
                    <div
                      key={topicId}
                      className="p-5 rounded-xl border border-zinc-800/80 bg-[#121316] shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-medium text-zinc-300 bg-zinc-800/80 border border-zinc-700/60 px-2.5 py-0.5 rounded-full">
                            {foundDomain?.name}
                          </span>
                          <span className="text-xs text-zinc-500">Personal Note</span>
                        </div>
                        <h3 className="font-semibold text-base text-zinc-100 mt-1">
                          {foundTopic?.title || topicId}
                        </h3>
                        <div className="mt-3 bg-[#0a0a0c] p-3.5 rounded-lg border border-zinc-800/80 max-h-80 overflow-y-auto">
                          <NoteViewer content={noteContent} />
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                        <button
                          onClick={() => foundTopic && handleOpenNotes(foundTopic)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 font-medium hover:bg-zinc-700 hover:text-white transition"
                        >
                          Edit Note
                        </button>
                        <button
                          onClick={() => foundTopic && handleOpenShare(foundTopic)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition flex items-center gap-1.5 font-medium"
                        >
                          <Share2 className="w-3.5 h-3.5" /> Share with Pod
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= VIEW 3: SHARED FEED ================= */}
        {activeTab === "shared-feed" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <button
              onClick={() => setActiveTab("what-to-learn")}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition w-fit"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span>Back to Curriculum (What to Learn)</span>
            </button>

            <div className="bg-[#121316] p-6 rounded-2xl border border-zinc-800/80 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-medium tracking-wide text-zinc-400 bg-zinc-800/80 px-2.5 py-0.5 rounded-full border border-zinc-700/50">
                  Community Feed
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
                <MessageSquare className="w-6 h-6 text-blue-400" />
                Team Learning Feed
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                High-signal takeaways, agent workflows, and architectural tips shared across TXL pods.
              </p>
            </div>

            <div className="space-y-4">
              {sharedLearnings.length === 0 ? (
                <div className="bg-[#121316]/50 p-12 text-center rounded-2xl border border-dashed border-zinc-800">
                  <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-zinc-200">No Shared Notes Yet</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                    When you or team members share notes from your curriculum topics, they will appear here in the team feed.
                  </p>
                </div>
              ) : (
                sharedLearnings.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl border border-zinc-800/80 bg-[#121316] shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-200">
                          {item.userName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-100 leading-tight">
                            {item.userName}
                            <span className="ml-2 text-[10px] font-normal text-zinc-400">
                              ({item.userRole})
                            </span>
                          </p>
                          <p className="text-[10px] text-zinc-500 font-medium">{item.timestamp}</p>
                        </div>
                      </div>

                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 font-medium">
                        {item.domainName}
                      </span>
                    </div>

                    <div className="bg-[#0a0a0c] p-4 rounded-lg border border-zinc-800/80">
                      <p className="text-xs font-medium text-blue-400 mb-1">
                        Learned: <span className="text-zinc-200">{item.topicTitle}</span>
                      </p>
                      <p className="text-xs text-zinc-300 leading-relaxed font-normal">{item.note}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                      <button
                        onClick={() => handleLikeItem(item.id)}
                        className="hover:text-red-400 transition flex items-center gap-1.5 font-medium bg-zinc-800/60 px-3 py-1.5 rounded-lg border border-zinc-700/50"
                      >
                        <Heart className="w-3.5 h-3.5 text-zinc-400 hover:text-red-400" />
                        <span>{item.likes} Likes</span>
                      </button>
                      <span className="text-[11px] text-zinc-500 font-normal">TXL Playbook Knowledge Base</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

          </>
        )}
      </main>

      {/* ================= NOTES MODAL ================= */}
      {currentUserRole !== "UNIT_HEAD" && activeModalTopic && !isShareModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Note for ${activeModalTopic.title}`}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-6"
          onKeyDown={(e) => e.key === "Escape" && !e.defaultPrevented && handleCloseNotes()}
        >
          <div className="bg-[#121316] border border-zinc-800 rounded-2xl max-w-3xl w-full h-[92vh] sm:h-[86vh] shadow-2xl flex flex-col">
            <div className="flex items-start justify-between gap-4 px-6 sm:px-10 pt-6 pb-4 border-b border-zinc-800/80">
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-zinc-400 bg-zinc-800/80 px-2.5 py-0.5 rounded-full border border-zinc-700/50">
                  Personal Learning Note
                </span>
                <h2 className="text-2xl font-bold text-white mt-3 tracking-tight">{activeModalTopic.title}</h2>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{activeModalTopic.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-zinc-500">
                  {noteSaveState === "saving" ? "Saving…" : noteSaveState === "saved" ? "Saved" : ""}
                </span>
                <button
                  onClick={handleCloseNotes}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow transition"
                >
                  Done
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-5">
              <RichNoteEditor
                key={activeModalTopic.id}
                initialContent={noteDraft}
                onChange={(html) => handleNoteChange(activeModalTopic.id, html)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= SHARE MODAL ================= */}
      {currentUserRole !== "UNIT_HEAD" && activeModalTopic && isShareModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316] border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div>
              <span className="text-[11px] font-medium text-zinc-300 bg-zinc-800/80 border border-zinc-700/60 px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                <Share2 className="w-3 h-3 text-blue-400" /> Share with Team Pod
              </span>
              <h2 className="text-lg font-bold text-white mt-2 tracking-tight">Share: {activeModalTopic.title}</h2>
              <p className="text-xs text-zinc-400 mt-1">Post your practical takeaway so the rest of the unit can benefit.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Your Takeaway / Summary:
              </label>
              <textarea
                rows={4}
                value={shareDraft}
                onChange={(e) => setShareDraft(e.target.value)}
                placeholder="Share your practical takeaway or how you applied this in your current project..."
                className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-800/80">
              <button
                onClick={() => {
                  setIsShareModalOpen(false)
                  setActiveModalTopic(null)
                }}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishShare}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow transition"
              >
                Publish to Team Feed
              </button>
            </div>
          </div>
        </div>
      )}
      {currentUserRole === "LEARNER" && <RewardToaster />}
    </div>
  )
}
