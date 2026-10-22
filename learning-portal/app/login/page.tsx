"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  BarChart3,
  Users,
  Lock,
  Mail,
  User,
  Layers,
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loadingRole, setLoadingRole] = useState<string | null>(null)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customEmail, setCustomEmail] = useState("")
  const [customName, setCustomName] = useState("")
  const [customRole, setCustomRole] = useState<"LEARNER" | "UNIT_HEAD">("LEARNER")
  const [customDiscipline, setCustomDiscipline] = useState("Product Engineer")

  const handleQuickLogin = async (role: "LEARNER" | "UNIT_HEAD") => {
    setLoadingRole(role)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      if (res.ok) {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      console.error("Login failed:", err)
    } finally {
      setLoadingRole(null)
    }
  }

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customEmail) return
    setLoadingRole("CUSTOM")
    try {
      const initials = (customName || customEmail)
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: customRole,
          email: customEmail,
          name: customName || (customRole === "UNIT_HEAD" ? "Lead User" : "Learner Contributor"),
          discipline: customDiscipline,
          avatar: initials || "US",
        }),
      })
      if (res.ok) {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      console.error("Custom login failed:", err)
    } finally {
      setLoadingRole(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4 border-b-2 border-slate-800">
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

        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
          <Lock className="w-3.5 h-3.5 text-lime-400" />
          <span>RBAC Identity Gateway</span>
        </div>
      </header>

      {/* Main Login Body */}
      <main className="max-w-4xl w-full mx-auto my-10 space-y-8">
        <div className="text-center space-y-2.5">
          <span className="inline-block px-3 py-1 bg-[#142617] border border-[#67E14B]/70 text-[#7FE866] text-xs font-black uppercase tracking-wider">
            Role-Based Access Control
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Sign In to Learning Portal
          </h1>
          <p className="text-sm text-slate-300 max-w-lg mx-auto font-medium">
            Select your operational role below to enter your personalized curriculum tracks or access executive organizational capability matrix.
          </p>
        </div>

        {/* 1-Click Role Persona Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A: Learner Role */}
          <div className="bg-[#0f172a] border-2 border-slate-700 hover:border-[#67E14B] p-6 sm:p-7 rounded-none flex flex-col justify-between space-y-6 shadow-xl transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-0.5 rounded-none bg-[#142617] text-[#7FE866] border border-[#67E14B]/70 font-black uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-lime-400" />
                  Role A · Learner
                </span>
                <span className="text-xs text-slate-400 font-mono">user-1</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white group-hover:text-lime-300 transition-colors">
                  Rahat Chowdhury
                </h3>
                <p className="text-xs text-lime-400 font-bold mt-0.5">
                  AI Product Manager · Product Pod
                </p>
                <p className="text-xs text-slate-400 font-mono mt-1">rahat@selise.ch</p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <p className="font-bold text-white text-[11px] uppercase tracking-wider">
                  Unlocked Capabilities:
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                  <span>Curriculum Browser across 9 Domains & 74 Topics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                  <span>Discipline Track Filter (Engineer, Consultant, etc.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                  <span>Personal Markdown Notes & Private Portfolio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                  <span>Team Learning Feed Broadcast & Reactions</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleQuickLogin("LEARNER")}
              disabled={loadingRole !== null}
              className="w-full py-3 px-4 bg-[#67E14B] hover:bg-lime-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg shadow-lime-500/20"
            >
              {loadingRole === "LEARNER" ? (
                <span>Entering Workspace...</span>
              ) : (
                <>
                  <span>Login as Learner</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Card B: Unit Head Role */}
          <div className="bg-[#0f172a] border-2 border-slate-700 hover:border-purple-500 p-6 sm:p-7 rounded-none flex flex-col justify-between space-y-6 shadow-xl transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-0.5 rounded-none bg-purple-950/70 text-purple-300 border border-purple-500/70 font-black uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  Role B · Unit Head
                </span>
                <span className="text-xs text-slate-400 font-mono">user-head</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">
                  Sarah Jenkins
                </h3>
                <p className="text-xs text-purple-300 font-bold mt-0.5">
                  Unit Head / Pod Leadership Lead
                </p>
                <p className="text-xs text-slate-400 font-mono mt-1">sarah.lead@selise.ch</p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <p className="font-bold text-white text-[11px] uppercase tracking-wider">
                  Unlocked Capabilities:
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Full Access to All Learner Curriculum & Pathways</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Exclusive "Unit Head Overview" Command Center</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Team Velocity, Org Completion & Deficit Metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Individual Pod Member Auditing & Note Inspector</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleQuickLogin("UNIT_HEAD")}
              disabled={loadingRole !== null}
              className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg shadow-purple-500/20"
            >
              {loadingRole === "UNIT_HEAD" ? (
                <span>Entering Command Center...</span>
              ) : (
                <>
                  <span>Login as Unit Head</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Custom Login Drawer Toggle */}
        <div className="pt-4 text-center">
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="text-xs text-slate-400 hover:text-white underline decoration-slate-600 transition"
          >
            {showCustomForm
              ? "Hide custom credentials form"
              : "Or sign in with custom user details"}
          </button>
        </div>

        {/* Custom User Form */}
        {showCustomForm && (
          <form
            onSubmit={handleCustomSubmit}
            className="bg-[#0f172a] border-2 border-slate-700 p-6 rounded-none max-w-lg mx-auto space-y-4 shadow-2xl"
          >
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Custom Identity Sign-In
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Michael Vance"
                className="w-full bg-[#090d16] border-2 border-slate-700 focus:border-lime-400 rounded-none p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Work Email (@selise.ch)
              </label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="user@selise.ch"
                className="w-full bg-[#090d16] border-2 border-slate-700 focus:border-lime-400 rounded-none p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Access Role
                </label>
                <select
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value as "LEARNER" | "UNIT_HEAD")}
                  className="w-full bg-[#090d16] border-2 border-slate-700 focus:border-lime-400 rounded-none p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="LEARNER">Learner (User A)</option>
                  <option value="UNIT_HEAD">Unit Head (User B)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Discipline Track
                </label>
                <select
                  value={customDiscipline}
                  onChange={(e) => setCustomDiscipline(e.target.value)}
                  className="w-full bg-[#090d16] border-2 border-slate-700 focus:border-lime-400 rounded-none p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Product Engineer">Product Engineer</option>
                  <option value="AI Product Manager">AI Product Manager</option>
                  <option value="Service Designer">Service Designer</option>
                  <option value="Product Consultant">Product Consultant</option>
                  <option value="Unit Head / Pod Lead">Unit Head / Pod Lead</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingRole !== null}
              className="w-full mt-2 py-2.5 bg-[#67E14B] text-black font-black text-xs uppercase tracking-wider hover:bg-lime-300 transition"
            >
              Authenticate Custom Session
            </button>
          </form>
        )}
      </main>

      {/* Footer Info */}
      <footer className="max-w-6xl w-full mx-auto py-4 border-t-2 border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>TXL Playbook 2026 · Chapter 15 Competency Operating System</span>
        <span className="font-mono">Security: Strict Enterprise Role Isolation</span>
      </footer>
    </div>
  )
}
