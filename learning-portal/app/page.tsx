"use client"

import React, { useState, useMemo, useEffect } from "react"
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
} from "lucide-react"
import RolePathwaysView, { ROLE_TRACKS } from "@/components/RolePathwaysView"
import UnitHeadManagementView from "@/components/UnitHeadManagementView"

export default function TXLLearningPortal() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null)
  const [activeTab, setActiveTab] = useState<"what-to-learn" | "my-notes" | "shared-feed" | "unit-head">("what-to-learn")
  const [selectedRoleTrack, setSelectedRoleTrack] = useState<string>("ALL")

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
  }

  // Load session from cookie
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user)
        } else {
          router.push("/login")
        }
      })
      .catch(() => {
        router.push("/login")
      })
  }, [router])

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
    setProgressState((prev) => {
      const current = prev[topicId]
      if (current === "COMPLETED") {
        const next = { ...prev }
        delete next[topicId]
        return next
      } else if (current === "IN_PROGRESS") {
        return { ...prev, [topicId]: "COMPLETED" }
      } else {
        return { ...prev, [topicId]: "IN_PROGRESS" }
      }
    })
  }

  // Open Notes Modal
  const handleOpenNotes = (topic: Topic) => {
    setActiveModalTopic(topic)
    setNoteDraft(userNotes[topic.id] || "")
    setIsShareModalOpen(false)
  }

  // Save Note
  const handleSaveNote = () => {
    if (activeModalTopic) {
      setUserNotes((prev) => ({
        ...prev,
        [activeModalTopic.id]: noteDraft,
      }))
      setActiveModalTopic(null)
    }
  }

  // Open Share Modal
  const handleOpenShare = (topic: Topic) => {
    setActiveModalTopic(topic)
    setShareDraft(userNotes[topic.id] || "")
    setIsShareModalOpen(true)
  }

  // Publish Shared Learning
  const handlePublishShare = () => {
    if (activeModalTopic && shareDraft.trim()) {
      const domain = domains.find((d) => d.id === activeModalTopic.domainId)
      const newEntry = {
        id: `sh-${Date.now()}`,
        userName: currentUser?.name || (currentUserRole === "UNIT_HEAD" ? "Unit Lead" : "Learner"),
        userRole: currentUser?.discipline || (currentUserRole === "UNIT_HEAD" ? "Unit Head" : "Learner"),
        topicTitle: activeModalTopic.title,
        domainName: domain?.name || "Curriculum",
        note: shareDraft,
        timestamp: "Just now",
        likes: 0,
      }
      setSharedLearnings([newEntry, ...sharedLearnings])
      setIsShareModalOpen(false)
      setActiveModalTopic(null)
      setShareDraft("")
      setActiveTab("shared-feed")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-800/80 bg-[#0c0d10]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                TXL Playbook
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium border border-zinc-700/60 uppercase">
                  2026
                </span>
              </span>
              <p className="text-xs text-zinc-400">Chapter 15 · What to Learn</p>
            </div>
          </div>

          {/* User Profile & Logout Button */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2.5 bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 rounded-lg shadow-sm">
              <div
                className="w-7 h-7 rounded-md bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-200 border border-zinc-700/60"
              >
                {currentUser?.avatar || (currentUserRole === "UNIT_HEAD" ? "UH" : "RC")}
              </div>
              <div className="text-left text-xs">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-white leading-tight">
                    {currentUser?.name || (currentUserRole === "UNIT_HEAD" ? "Lead" : "Learner")}
                  </p>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-md font-medium border bg-zinc-800 text-zinc-300 border-zinc-700/60"
                  >
                    {currentUserRole === "UNIT_HEAD" ? "Unit Head" : "Learner"}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  {currentUser?.discipline || (currentUserRole === "UNIT_HEAD" ? "Unit Head / Lead" : "AI Product Manager")}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium transition flex items-center gap-1.5"
              title="Logout from portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 text-sm overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("what-to-learn")}
            className={`py-3.5 font-medium border-b-2 transition flex items-center gap-2 whitespace-nowrap text-sm ${
              activeTab === "what-to-learn"
                ? "border-blue-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>What to Learn</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-medium">
              Role Tracks
            </span>
          </button>

          <button
            onClick={() => setActiveTab("my-notes")}
            className={`py-3.5 font-medium border-b-2 transition flex items-center gap-2 whitespace-nowrap text-sm ${
              activeTab === "my-notes"
                ? "border-blue-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Notes</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              {Object.keys(userNotes).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("shared-feed")}
            className={`py-3.5 font-medium border-b-2 transition flex items-center gap-2 whitespace-nowrap text-sm ${
              activeTab === "shared-feed"
                ? "border-blue-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Shared Learnings</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              {sharedLearnings.length}
            </span>
          </button>

          {currentUserRole === "UNIT_HEAD" && (
            <button
              onClick={() => setActiveTab("unit-head")}
              className={`py-3.5 font-medium border-b-2 transition flex items-center gap-2 whitespace-nowrap text-sm ${
                activeTab === "unit-head"
                  ? "border-purple-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Unit Head Overview</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/60 font-medium">
                Executive
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* ================= PRIMARY VIEW: WHAT TO LEARN (ROLE TRACKS) ================= */}
        {activeTab === "what-to-learn" && (
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
        )}

        {/* ================= VIEW 2: MY NOTES ================= */}
        {activeTab === "my-notes" && (
          <div className="space-y-6">
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
                        <p className="text-xs text-zinc-300 mt-3 whitespace-pre-wrap bg-[#0a0a0c] p-3.5 rounded-lg border border-zinc-800/80 leading-relaxed font-mono">
                          {noteContent}
                        </p>
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
                        onClick={() => {
                          setSharedLearnings((prev) =>
                            prev.map((l) => (l.id === item.id ? { ...l, likes: l.likes + 1 } : l))
                          )
                        }}
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

        {/* ================= VIEW 4: UNIT HEAD OVERVIEW & MODULE MANAGEMENT ================= */}
        {activeTab === "unit-head" && currentUserRole === "UNIT_HEAD" && (
          <UnitHeadManagementView
            domains={domains}
            onUpdateDomains={handleUpdateDomains}
            currentUser={currentUser}
            currentLearnerProgress={progressState}
            currentLearnerNotes={userNotes}
          />
        )}
      </main>

      {/* ================= NOTES MODAL ================= */}
      {activeModalTopic && !isShareModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316] border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div>
              <span className="text-[11px] font-medium text-zinc-400 bg-zinc-800/80 px-2.5 py-0.5 rounded-full border border-zinc-700/50">
                Personal Learning Note
              </span>
              <h2 className="text-lg font-bold text-white mt-2 tracking-tight">{activeModalTopic.title}</h2>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{activeModalTopic.description}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Takeaways / Implementation Details:
              </label>
              <textarea
                rows={5}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Write your personal observations, key takeaways, and how this applies to client deliverables..."
                className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-800/80">
              <button
                onClick={() => setActiveModalTopic(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow transition"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SHARE MODAL ================= */}
      {activeModalTopic && isShareModalOpen && (
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
    </div>
  )
}
