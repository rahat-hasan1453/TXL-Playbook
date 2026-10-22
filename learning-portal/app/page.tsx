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

// Sample team members for Unit Head scenario
const MOCK_TEAM_MEMBERS = [
  { id: "user-1", name: "Rahat Chowdhury", role: "AI PM", email: "rahat@selise.ch", avatar: "RC" },
  { id: "user-2", name: "Alex Mercer", role: "Product Engineer", email: "alex@selise.ch", avatar: "AM" },
  { id: "user-3", name: "Priya Sharma", role: "Service Designer", email: "priya@selise.ch", avatar: "PS" },
  { id: "user-4", name: "Michael Vance", role: "Product Consultant", email: "michael@selise.ch", avatar: "MV" },
]

export default function TXLLearningPortal() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null)
  const [activeTab, setActiveTab] = useState<"what-to-learn" | "my-notes" | "shared-feed" | "unit-head">("what-to-learn")
  const [selectedRoleTrack, setSelectedRoleTrack] = useState<string>("ALL")

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
  const [progressState, setProgressState] = useState<Record<string, "COMPLETED" | "IN_PROGRESS">>({
    "biz-1": "COMPLETED",
    "prod-1": "COMPLETED",
    "ai-1": "COMPLETED",
    "ai-2": "IN_PROGRESS",
    "dev-1": "COMPLETED",
  })

  // User personal notes per topic (Topic ID -> note string)
  const [userNotes, setUserNotes] = useState<Record<string, string>>({
    "ai-1": "Key insight: Context limits and temperature dictate hallucinations. Always ground with clear examples.",
    "biz-1": "Need to align value proposition with client's actual pain points rather than features.",
  })

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
  }>>([
    {
      id: "sh-1",
      userName: "Rahat Chowdhury",
      userRole: "AI PM",
      topicTitle: "Spec-driven development",
      domainName: "AI",
      note: "Learned how writing executable markdown specifications allows AI agents to scaffold reliable components with zero ambiguity.",
      timestamp: "2 hours ago",
      likes: 5,
    },
    {
      id: "sh-2",
      userName: "Alex Mercer",
      userRole: "Product Engineer",
      topicTitle: "Next.js App Router",
      domainName: "Development and technologies",
      note: "Server Components provide massive performance wins by shipping 0kB bundle to the client for read-heavy screens.",
      timestamp: "Yesterday",
      likes: 8,
    }
  ])

  // Active modal for taking notes or sharing
  const [activeModalTopic, setActiveModalTopic] = useState<Topic | null>(null)
  const [noteDraft, setNoteDraft] = useState("")
  const [shareDraft, setShareDraft] = useState("")
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  // Selected member for Unit Head drill-down
  const [selectedMemberId, setSelectedMemberId] = useState<string>("user-1")

  // Total topics calculation
  const totalTopicsCount = useMemo(() => {
    return CURRICULUM_DOMAINS.reduce((acc, d) => acc + d.topics.length, 0)
  }, [])

  // User completed count
  const completedCount = useMemo(() => {
    return Object.values(progressState).filter((s) => s === "COMPLETED").length
  }, [progressState])

  const completionPercentage = Math.round((completedCount / totalTopicsCount) * 100)

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
      const domain = CURRICULUM_DOMAINS.find((d) => d.id === activeModalTopic.domainId)
      const newEntry = {
        id: `sh-${Date.now()}`,
        userName: currentUserRole === "UNIT_HEAD" ? "Sarah Jenkins (Lead)" : "Rahat Chowdhury",
        userRole: currentUserRole === "UNIT_HEAD" ? "Unit Head" : "AI PM",
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-[#67E14B] selection:text-black">
      {/* Top Navigation Bar */}
      <header className="border-b-2 border-slate-800 bg-[#0f172a]/95 backdrop-blur sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-none bg-[#142617] border-2 border-[#67E14B] flex items-center justify-center shadow-lg shadow-lime-500/20">
              <Sparkles className="w-5 h-5 text-[#67E14B]" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
                TXL Playbook{" "}
                <span className="text-xs px-2 py-0.5 rounded-none bg-[#142617] text-[#7FE866] font-black border border-[#67E14B]/60 uppercase">
                  2026
                </span>
              </span>
              <p className="text-xs text-lime-400 font-semibold">Chapter 15 · What to Learn</p>
            </div>
          </div>

          {/* User Profile & Logout Button */}
          <div className="flex items-center space-x-3.5">
            <div className="flex items-center space-x-2.5 bg-[#090d16] border-2 border-slate-700 px-3 py-1.5 rounded-none shadow-sm">
              <div
                style={
                  currentUserRole === "UNIT_HEAD"
                    ? { borderColor: "#A855F7", color: "#C084FC" }
                    : { borderColor: "#67E14B", color: "#7FE866" }
                }
                className="w-7 h-7 rounded-none bg-slate-900 flex items-center justify-center text-xs font-black border"
              >
                {currentUser?.avatar || (currentUserRole === "UNIT_HEAD" ? "UH" : "RC")}
              </div>
              <div className="text-left text-xs">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-white leading-tight">
                    {currentUser?.name || (currentUserRole === "UNIT_HEAD" ? "Sarah Jenkins" : "Rahat Chowdhury")}
                  </p>
                  <span
                    style={
                      currentUserRole === "UNIT_HEAD"
                        ? { backgroundColor: "#3b0764", borderColor: "#A855F7", color: "#C084FC" }
                        : { backgroundColor: "#142617", borderColor: "#67E14B80", color: "#7FE866" }
                    }
                    className="text-[9px] px-1.5 py-0.2 rounded-none font-black border uppercase"
                  >
                    {currentUserRole === "UNIT_HEAD" ? "Unit Head" : "Learner"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {currentUser?.discipline || (currentUserRole === "UNIT_HEAD" ? "Unit Head / Lead" : "AI Product Manager")}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-none border border-slate-700 bg-slate-900 hover:bg-red-950/70 hover:border-red-500/80 hover:text-red-300 text-slate-400 text-xs font-bold transition flex items-center gap-1.5"
              title="Logout from portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 text-sm overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("what-to-learn")}
            className={`py-3.5 font-black border-b-2 transition flex items-center gap-2 whitespace-nowrap text-sm ${
              activeTab === "what-to-learn"
                ? "border-[#67E14B] text-[#7FE866]"
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>What to Learn</span>
            <span className="text-[10px] px-2 py-0.5 rounded-none bg-[#142617] text-[#7FE866] border border-[#67E14B]/60 font-black">
              Role Tracks
            </span>
          </button>

          <button
            onClick={() => setActiveTab("my-notes")}
            className={`py-3.5 font-black border-b-2 transition flex items-center gap-2 whitespace-nowrap text-sm ${
              activeTab === "my-notes"
                ? "border-[#67E14B] text-[#7FE866]"
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Notes</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-none bg-slate-800 text-slate-300 border border-slate-700">
              {Object.keys(userNotes).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("shared-feed")}
            className={`py-3.5 font-black border-b-2 transition flex items-center gap-2 whitespace-nowrap text-sm ${
              activeTab === "shared-feed"
                ? "border-[#67E14B] text-[#7FE866]"
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Shared Learnings</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-none bg-slate-800 text-slate-300 border border-slate-700">
              {sharedLearnings.length}
            </span>
          </button>

          {currentUserRole === "UNIT_HEAD" && (
            <button
              onClick={() => setActiveTab("unit-head")}
              className={`py-3.5 font-black border-b-2 transition flex items-center gap-2 whitespace-nowrap text-sm ${
                activeTab === "unit-head"
                  ? "border-purple-400 text-purple-300"
                  : "border-transparent text-slate-300 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Unit Head Overview</span>
              <span className="text-[10px] px-2 py-0.5 rounded-none bg-purple-950 text-purple-300 border border-purple-500/60 font-black">
                Executive
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
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
          />
        )}

        {/* ================= VIEW 2: MY NOTES ================= */}
        {activeTab === "my-notes" && (
          <div className="space-y-6">
            <div className="bg-[#0f172a] p-6 rounded-none border-2 border-slate-700 shadow-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-black bg-[#67E14B] px-2.5 py-0.5 rounded-none">
                  Personal Archive
                </span>
              </div>
              <h1 className="text-2xl font-black text-white">My Learning Notes</h1>
              <p className="text-sm text-slate-200 mt-1 font-medium">
                Your private implementation notes, observations, and key takeaways across the 82 competencies.
              </p>
            </div>

            {Object.keys(userNotes).length === 0 ? (
              <div className="p-16 text-center border-2 border-dashed border-slate-700 rounded-none bg-[#0f172a]/60">
                <FileText className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No notes logged yet</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Click "Note" on any topic in the curriculum to record your personal learnings.
                </p>
                <button
                  onClick={() => setActiveTab("what-to-learn")}
                  className="mt-4 px-4 py-2 rounded-none bg-[#67E14B] text-black text-xs font-black hover:bg-lime-300 transition"
                >
                  Browse Topics
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(userNotes).map(([topicId, noteContent]) => {
                  let foundTopic: Topic | undefined
                  let foundDomain: Domain | undefined
                  for (const d of CURRICULUM_DOMAINS) {
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
                      className="p-5 rounded-none border-2 border-slate-700 bg-[#0f172a] shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-black text-[#7FE866] bg-[#142617] border border-[#67E14B]/60 px-2 py-0.5 rounded-none uppercase tracking-wider">
                            {foundDomain?.name}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">Personal Note</span>
                        </div>
                        <h3 className="font-extrabold text-base text-white mt-1">
                          {foundTopic?.title || topicId}
                        </h3>
                        <p className="text-xs text-slate-100 mt-3 whitespace-pre-wrap bg-[#090d16] p-3.5 rounded-none border border-slate-800 leading-relaxed font-mono">
                          {noteContent}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        <button
                          onClick={() => foundTopic && handleOpenNotes(foundTopic)}
                          className="px-3 py-1.5 rounded-none bg-[#142617] text-[#7FE866] border border-[#67E14B]/60 font-bold hover:bg-[#67E14B] hover:text-black transition"
                        >
                          Edit Note
                        </button>
                        <button
                          onClick={() => foundTopic && handleOpenShare(foundTopic)}
                          className="px-3 py-1.5 rounded-none bg-slate-800 text-white hover:text-indigo-300 border border-slate-700 transition flex items-center gap-1.5 font-semibold"
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
            <div className="bg-[#0f172a] p-6 rounded-none border-2 border-slate-700 shadow-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-black bg-[#67E14B] px-2.5 py-0.5 rounded-none">
                  Community Feed
                </span>
              </div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-lime-400" />
                Team Learning Feed
              </h1>
              <p className="text-sm text-slate-200 mt-1 font-medium">
                High-signal takeaways, agent workflows, and architectural tips shared across TXL pods.
              </p>
            </div>

            <div className="space-y-4">
              {sharedLearnings.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-none border-2 border-slate-700 bg-[#0f172a] shadow-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-none bg-[#142617] border border-[#67E14B]/70 flex items-center justify-center text-xs font-black text-[#7FE866]">
                        {item.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-white leading-tight">
                          {item.userName}
                          <span className="ml-2 text-[10px] font-semibold text-lime-400">
                            ({item.userRole})
                          </span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">{item.timestamp}</p>
                      </div>
                    </div>

                    <span className="text-[11px] px-2.5 py-0.5 rounded-none bg-[#142617] text-[#7FE866] border border-[#67E14B]/60 font-bold">
                      {item.domainName}
                    </span>
                  </div>

                  <div className="bg-[#090d16] p-4 rounded-none border border-slate-800">
                    <p className="text-xs font-bold text-lime-400 mb-1">
                      Learned: <span className="text-white">{item.topicTitle}</span>
                    </p>
                    <p className="text-xs text-slate-100 leading-relaxed font-normal">{item.note}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <button
                      onClick={() => {
                        setSharedLearnings((prev) =>
                          prev.map((l) => (l.id === item.id ? { ...l, likes: l.likes + 1 } : l))
                        )
                      }}
                      className="hover:text-pink-400 transition flex items-center gap-1.5 font-bold bg-slate-900 px-3 py-1.5 rounded-none border border-slate-700"
                    >
                      <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/30" />
                      <span>{item.likes} Likes</span>
                    </button>
                    <span className="text-[11px] text-slate-400 font-semibold">TXL Playbook Knowledge Base</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 4: UNIT HEAD OVERVIEW ================= */}
        {activeTab === "unit-head" && currentUserRole === "UNIT_HEAD" && (
          <div className="space-y-6">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-purple-950/60 via-[#0f172a] to-[#0f172a] p-6 sm:p-7 rounded-none border-2 border-purple-500/60 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-none bg-purple-500/20 text-purple-300 text-xs font-black border border-purple-500/40 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Executive Command Center
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">TXL Organizational Capability Matrix</h1>
              <p className="text-sm text-slate-200 mt-1 max-w-2xl font-medium">
                Live visibility into individual and squad maturity across all 82 competencies. Track staffing readiness, identify training deficits, and allocate engineers with high confidence.
              </p>
            </div>

            {/* Macro KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0f172a] p-5 rounded-none border-2 border-slate-700 shadow-xl">
                <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
                  <span>Total Active Learners</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-2xl font-black text-white mt-2">12 Members</p>
                <p className="text-xs text-[#7FE866] font-bold mt-1">Across 4 cross-functional pods</p>
              </div>

              <div className="bg-[#0f172a] p-5 rounded-none border-2 border-slate-700 shadow-xl">
                <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
                  <span>Org Completion Rate</span>
                  <TrendingUp className="w-4 h-4 text-lime-400" />
                </div>
                <p className="text-2xl font-black text-lime-400 mt-2">48.2%</p>
                <p className="text-xs text-slate-300 font-semibold mt-1">+14% velocity this month</p>
              </div>

              <div className="bg-[#0f172a] p-5 rounded-none border-2 border-slate-700 shadow-xl">
                <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
                  <span>Highest Velocity Domain</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-black text-white mt-2">04 · AI</p>
                <p className="text-xs text-amber-400 font-bold mt-1">72% baseline completed</p>
              </div>

              <div className="bg-[#0f172a] p-5 rounded-none border-2 border-slate-700 shadow-xl">
                <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
                  <span>Deficit Domain (Needs Workshop)</span>
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-2xl font-black text-white mt-2">08 · Security</p>
                <p className="text-xs text-purple-300 font-bold mt-1">28% completion across pods</p>
              </div>
            </div>

            {/* Individual Learner Drilldown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Member Selector List */}
              <div className="bg-[#0f172a] p-5 rounded-none border-2 border-slate-700 shadow-xl space-y-3">
                <h3 className="text-sm font-extrabold text-white flex items-center justify-between">
                  <span>Pod Members</span>
                  <span className="text-xs text-slate-400 font-normal">Click to audit</span>
                </h3>

                <div className="space-y-2">
                  {MOCK_TEAM_MEMBERS.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMemberId(member.id)}
                      className={`w-full p-3 rounded-none border-2 text-left transition flex items-center justify-between ${
                        selectedMemberId === member.id
                          ? "bg-[#142617] border-[#67E14B] shadow-md shadow-lime-500/20"
                          : "bg-[#090d16] border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-none bg-slate-800 text-xs font-black text-white flex items-center justify-center border border-slate-700">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{member.name}</p>
                          <p className="text-[11px] text-lime-400 font-medium">{member.role}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-lime-400">
                          {member.id === "user-1" ? `${completionPercentage}%` : "35%"}
                        </span>
                        <p className="text-[9px] text-slate-400 font-semibold">Readiness</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Member Inspection View */}
              <div className="lg:col-span-2 bg-[#0f172a] p-6 rounded-none border-2 border-slate-700 shadow-xl space-y-6">
                {(() => {
                  const currentMember =
                    MOCK_TEAM_MEMBERS.find((m) => m.id === selectedMemberId) || MOCK_TEAM_MEMBERS[0]

                  return (
                    <>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-none bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-base font-extrabold text-white shadow-lg">
                            {currentMember.avatar}
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                              {currentMember.name}
                              <span className="text-xs px-2 py-0.5 rounded-none bg-[#142617] text-[#7FE866] border border-[#67E14B]/60 font-bold">
                                {currentMember.role}
                              </span>
                            </h3>
                            <p className="text-xs text-slate-300 font-medium">{currentMember.email}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-black text-lime-400">
                            {currentMember.id === "user-1" ? completedCount : 29}
                          </span>
                          <span className="text-xs text-slate-400 font-bold"> / {totalTopicsCount} topics</span>
                        </div>
                      </div>

                      {/* Domain Breakdown for this member */}
                      <div>
                        <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-3">
                          Domain Proficiency Breakdown
                        </h4>
                        <div className="space-y-3">
                          {CURRICULUM_DOMAINS.map((domain) => {
                            const domainCompleted =
                              currentMember.id === "user-1"
                                ? domain.topics.filter((t) => progressState[t.id] === "COMPLETED").length
                                : Math.floor(domain.topics.length * 0.4)
                            const domainPct = Math.round((domainCompleted / domain.topics.length) * 100)

                            return (
                              <div key={domain.id} className="text-xs">
                                <div className="flex justify-between text-slate-300 mb-1 font-semibold">
                                  <span>{domain.code} · {domain.name}</span>
                                  <span className="font-extrabold text-lime-400">
                                    {domainCompleted}/{domain.topics.length} ({domainPct}%)
                                  </span>
                                </div>
                                <div className="w-full bg-[#090d16] rounded-none h-2 overflow-hidden border border-slate-800">
                                  <div
                                    className="bg-[#67E14B] h-full rounded-none transition-all shadow-sm shadow-lime-500/50"
                                    style={{ width: `${domainPct}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Recent Notes by this member */}
                      <div className="pt-4 border-t border-slate-800">
                        <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-3">
                          Recent Implementation Notes
                        </h4>
                        {currentMember.id === "user-1" && Object.keys(userNotes).length > 0 ? (
                          <div className="space-y-2">
                            {Object.entries(userNotes).map(([tid, note]) => {
                              const t = CURRICULUM_DOMAINS.flatMap((d) => d.topics).find((i) => i.id === tid)
                              return (
                                <div key={tid} className="p-3 rounded-none bg-[#090d16] border border-lime-500/30 text-xs">
                                  <p className="font-bold text-lime-400">{t?.title || tid}</p>
                                  <p className="text-slate-200 mt-1 font-mono text-[11px]">{note}</p>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No notes logged yet for this member.</p>
                        )}
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= NOTES MODAL ================= */}
      {activeModalTopic && !isShareModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border-2 border-slate-700 rounded-none max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div>
              <span className="text-[11px] font-black text-black bg-[#67E14B] px-2.5 py-0.5 rounded-none uppercase tracking-wider">
                Personal Learning Note
              </span>
              <h2 className="text-lg font-black text-white mt-1.5">{activeModalTopic.title}</h2>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{activeModalTopic.description}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Takeaways / Implementation Details:
              </label>
              <textarea
                rows={5}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Write your personal observations, key takeaways, and how this applies to client deliverables..."
                className="w-full bg-[#090d16] border-2 border-slate-700 rounded-none p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#67E14B] font-mono leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setActiveModalTopic(null)}
                className="px-4 py-2 rounded-none text-xs font-bold text-slate-300 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-none text-xs font-black bg-[#67E14B] hover:bg-lime-300 text-black shadow-lg transition"
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
          <div className="bg-[#0f172a] border-2 border-slate-700 rounded-none max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div>
              <span className="text-[11px] font-black text-[#7FE866] bg-[#142617] border border-[#67E14B]/60 px-2.5 py-0.5 rounded-none uppercase tracking-wider flex items-center gap-1 w-fit">
                <Share2 className="w-3 h-3" /> Share with Team Pod
              </span>
              <h2 className="text-lg font-black text-white mt-1.5">Share: {activeModalTopic.title}</h2>
              <p className="text-xs text-slate-200 mt-0.5">Post your practical takeaway so the rest of the unit can benefit.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Your Takeaway / Summary:
              </label>
              <textarea
                rows={4}
                value={shareDraft}
                onChange={(e) => setShareDraft(e.target.value)}
                placeholder="Share your practical takeaway or how you applied this in your current project..."
                className="w-full bg-[#090d16] border-2 border-slate-700 rounded-none p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#67E14B] font-sans"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsShareModalOpen(false)
                  setActiveModalTopic(null)
                }}
                className="px-4 py-2 rounded-none text-xs font-bold text-slate-300 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishShare}
                className="px-4 py-2 rounded-none text-xs font-black bg-[#67E14B] hover:bg-lime-300 text-black shadow-lg transition"
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
