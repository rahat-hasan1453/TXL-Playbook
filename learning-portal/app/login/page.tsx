"use client"

import ThemeToggle from "@/components/ThemeToggle"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  User,
  Layers,
  Globe2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserPlus,
  LogIn,
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<"SIGN_IN" | "SIGN_UP">("SIGN_IN")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup Form States
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupDiscipline, setSignupDiscipline] = useState("Product Engineer")
  const [registerViaBlocks, setRegisterViaBlocks] = useState(true)

  // SELISE Blocks Hosted SSO Redirect
  const handleBlocksSso = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      const redirectUri = origin ? `${origin}/login/callback` : ""
      const url = redirectUri
        ? `/api/auth/blocks/initiate?redirectUri=${encodeURIComponent(redirectUri)}`
        : "/api/auth/blocks/initiate"

      const res = await fetch(url)
      const data = await res.json()
      if (data.redirectUrl) {
        // Use a link with rel="noreferrer" and no-referrer policy so IAM doesn't reject with Invalid_Origin_Or_Referer
        const link = document.createElement("a")
        link.href = data.redirectUrl
        link.rel = "noreferrer"
        link.referrerPolicy = "no-referrer"
        document.body.appendChild(link)
        link.click()
      } else {
        throw new Error(data.error || "Failed to obtain Blocks IAM login redirect URL")
      }
    } catch (err: unknown) {
      console.error("Blocks SSO redirect failed:", err)
      setErrorMsg(err instanceof Error ? err.message : "Blocks IAM connection failed")
      setLoading(false)
    }
  }

  // Handle General Sign In
  const handleGeneralLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail) return
    setLoading(true)
    setErrorMsg(null)

    try {
      const name = loginEmail.split("@")[0].replace(".", " ")
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "TX"

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          name: name || undefined,
          avatar: initials,
        }),
      })

      if (res.ok) {
        router.push("/")
        router.refresh()
      } else {
        const data = await res.json()
        throw new Error(data.error || "Login failed")
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Authentication failed")
      setLoading(false)
    }
  }

  // Handle General & Blocks Sign Up
  const handleGeneralSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signupEmail || !signupPassword) return
    setLoading(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: signupEmail,
          password: signupPassword,
          discipline: signupDiscipline,
          viaBlocks: registerViaBlocks,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        router.push("/")
        router.refresh()
      } else {
        throw new Error(data.error || "Registration failed")
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Sign up failed")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 relative flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-zinc-800 selection:text-white">
      <ThemeToggle className="absolute top-4 right-4 sm:top-6 sm:right-6" />
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-4 border-b border-zinc-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#121316] border border-zinc-800 flex items-center justify-center text-blue-400 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight flex items-center gap-2">
              TXL Playbook
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-medium border border-zinc-700/40">
                2026
              </span>
            </span>
            <p className="text-[11px] text-zinc-500 font-normal">Chapter 15 · What to Learn</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <Lock className="w-3.5 h-3.5 text-zinc-500" />
          <span>RBAC & Cloud Identity Gateway</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-lg w-full mx-auto my-8 space-y-6">
        {/* Title Header */}
        <div className="text-center space-y-2">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-zinc-400 text-[11px] font-medium tracking-wide">
            Enterprise Competency Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {authMode === "SIGN_IN" ? "Sign In to Your Workspace" : "Create New Account"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto font-normal">
            {authMode === "SIGN_IN"
              ? "Access your personalized curriculum pathways, executive metrics, and team competency feed."
              : "Join the TXL Learning Operating System and track your discipline growth."}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs (Sign In / Sign Up) */}
        <div className="grid grid-cols-2 bg-[#121316] border border-zinc-800/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setAuthMode("SIGN_IN")
              setErrorMsg(null)
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              authMode === "SIGN_IN"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode("SIGN_UP")
              setErrorMsg(null)
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              authMode === "SIGN_UP"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* SELISE Blocks Cloud SSO / Signup Option */}
        <div className="bg-[#121316] border border-zinc-800/80 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-lg bg-zinc-800/90 border border-zinc-700/60 flex items-center justify-center text-blue-400 shrink-0">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 font-semibold border border-blue-800/50">
                  SELISE Blocks IAM
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">d5e5c23b</span>
              </div>
              <p className="text-xs text-white font-medium mt-0.5">
                {authMode === "SIGN_IN"
                  ? "Single Sign-On via Blocks Cloud Identity"
                  : "One-Click Registration via Blocks Hosted IAM"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBlocksSso}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 shrink-0 transition border border-zinc-700/60 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>{authMode === "SIGN_IN" ? "Sign In via Blocks" : "Sign Up via Blocks"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-800/50 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Box Container */}
        <div className="bg-[#121316] border border-zinc-800/80 p-6 sm:p-7 rounded-2xl shadow-xl">
          {authMode === "SIGN_IN" ? (
            /* ================= SIGN IN FORM ================= */
            <form onSubmit={handleGeneralLogin} className="space-y-4">
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <LogIn className="w-3.5 h-3.5 text-zinc-400" />
                  General Credentials Sign In
                </h3>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@selise.ch"
                  className="w-full bg-[#0a0a0c] border border-zinc-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition shadow-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0a0a0c] border border-zinc-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition shadow-sm"
                />
              </div>

              {/* IAM Governance Info Notice */}
              <div className="p-3 bg-[#0a0a0c] border border-zinc-800/80 rounded-xl flex items-center gap-2.5 text-xs text-zinc-400">
                <Lock className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>
                  Role & permissions are governed centrally via <strong className="text-zinc-300">SELISE Blocks IAM</strong>.
                </span>
              </div>

              {/* Sign In Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-zinc-200 text-black font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 shadow mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  <>
                    <span>Enter Learning Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ================= SIGN UP FORM ================= */
            <form onSubmit={handleGeneralSignup} className="space-y-4">
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-zinc-400" />
                  Register New Account
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 font-normal">
                  Set up your profile to sync learning progress across disciplines.
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Rahat"
                    className="w-full bg-[#0a0a0c] border border-zinc-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Chowdhury"
                    className="w-full bg-[#0a0a0c] border border-zinc-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition shadow-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="user@selise.ch"
                  className="w-full bg-[#0a0a0c] border border-zinc-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition shadow-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
                  Password (Min 8 Characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0a0a0c] border border-zinc-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition shadow-sm"
                />
              </div>

              {/* Discipline Track */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Discipline Track
                </label>
                <select
                  value={signupDiscipline}
                  onChange={(e) => setSignupDiscipline(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-zinc-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none transition shadow-sm"
                >
                  <option value="Product Engineer">Product Engineer</option>
                  <option value="AI Product Manager">AI Product Manager</option>
                  <option value="Technical Consultant">Technical Consultant</option>
                  <option value="Service Designer">Service Designer</option>
                  <option value="Cloud Architect">Cloud Architect</option>
                </select>
              </div>

              {/* IAM Role Governance Notice */}
              <div className="p-2.5 bg-[#0a0a0c] border border-zinc-800/80 rounded-lg flex items-center gap-2 text-[11px] text-zinc-400">
                <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>Account roles & permission tiers are provisioned centrally via SELISE Blocks IAM.</span>
              </div>

              {/* Register through SELISE Blocks Checkbox Option */}
              <div className="p-3 bg-[#0a0a0c] border border-zinc-800 rounded-xl flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="viaBlocks"
                  checked={registerViaBlocks}
                  onChange={(e) => setRegisterViaBlocks(e.target.checked)}
                  className="mt-0.5 accent-blue-500 rounded cursor-pointer"
                />
                <label htmlFor="viaBlocks" className="text-xs text-zinc-300 cursor-pointer select-none">
                  <span className="font-semibold text-white block">
                    Register through SELISE Blocks IAM (Project d5e5c23b)
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Creates an enterprise identity record on Blocks Cloud platform with verified permissions.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-zinc-200 text-black font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 shadow mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  <>
                    <span>Create Account & Enter Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom Switch Link */}
          <div className="pt-4 border-t border-zinc-800 text-center mt-5">
            {authMode === "SIGN_IN" ? (
              <p className="text-xs text-zinc-400">
                Don&apos;t have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGN_UP")
                    setErrorMsg(null)
                  }}
                  className="text-white font-semibold hover:underline ml-1"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-xs text-zinc-400">
                Already registered with an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGN_IN")
                    setErrorMsg(null)
                  }}
                  className="text-white font-semibold hover:underline ml-1"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 border-t border-zinc-800/80 pt-4 gap-2">
        <span>TXL Playbook 2026 · Chapter 15 Competency Operating System</span>
        <span>Security: Strict Enterprise Role Isolation & Blocks IAM</span>
      </footer>
    </div>
  )
}
