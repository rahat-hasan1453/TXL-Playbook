"use client"

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
  const [loginRole, setLoginRole] = useState<"LEARNER" | "UNIT_HEAD">("LEARNER")

  // Signup Form States
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupRole, setSignupRole] = useState<"LEARNER" | "UNIT_HEAD">("LEARNER")
  const [signupDiscipline, setSignupDiscipline] = useState("Product Engineer")
  const [registerViaBlocks, setRegisterViaBlocks] = useState(true)

  // SELISE Blocks Hosted SSO Redirect
  const handleBlocksSso = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch("/api/auth/blocks/initiate")
      const data = await res.json()
      if (data.redirectUrl) {
        window.location.assign(data.redirectUrl)
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
          role: loginRole,
          email: loginEmail,
          name:
            loginRole === "UNIT_HEAD"
              ? "Sarah Jenkins (Lead)"
              : name || "Rahat Chowdhury",
          discipline: loginRole === "UNIT_HEAD" ? "Leadership & Strategy" : "AI Product Manager",
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
          role: signupRole,
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

  // Quick fill preset test credentials
  const fillPreset = (role: "LEARNER" | "UNIT_HEAD") => {
    if (role === "LEARNER") {
      setLoginEmail("rahat@selise.ch")
      setLoginPassword("••••••••••••")
      setLoginRole("LEARNER")
    } else {
      setLoginEmail("sarah.lead@selise.ch")
      setLoginPassword("••••••••••••")
      setLoginRole("UNIT_HEAD")
    }
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-4 border-b-2 border-slate-800">
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
          <span>RBAC & Cloud Identity Gateway</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-xl w-full mx-auto my-8 space-y-6">
        {/* Title Header */}
        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 bg-[#142617] border border-[#67E14B]/70 text-[#7FE866] text-xs font-black uppercase tracking-wider">
            Enterprise Competency Portal
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {authMode === "SIGN_IN" ? "Sign In to Your Workspace" : "Create New Account"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            {authMode === "SIGN_IN"
              ? "Access your personalized curriculum pathways, executive metrics, and team competency feed."
              : "Join the TXL Learning Operating System and track your discipline growth."}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs (Sign In / Sign Up) */}
        <div className="grid grid-cols-2 bg-[#090d16] border-2 border-slate-800 p-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode("SIGN_IN")
              setErrorMsg(null)
            }}
            className={`py-2.5 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              authMode === "SIGN_IN"
                ? "bg-[#67E14B] text-black shadow-lg shadow-lime-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode("SIGN_UP")
              setErrorMsg(null)
            }}
            className={`py-2.5 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              authMode === "SIGN_UP"
                ? "bg-[#67E14B] text-black shadow-lg shadow-lime-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* SELISE Blocks Cloud SSO / Signup Option */}
        <div className="bg-[#142617]/70 border-2 border-[#67E14B] p-4 rounded-none flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-none bg-[#1a3820] border border-[#67E14B] flex items-center justify-center shrink-0">
              <Globe2 className="w-4 h-4 text-[#67E14B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 bg-[#67E14B] text-black font-black uppercase">
                  SELISE Blocks IAM
                </span>
                <span className="text-[10px] text-lime-300 font-mono">D5e5c23b</span>
              </div>
              <p className="text-xs text-white font-bold mt-0.5">
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
            className="w-full sm:w-auto px-4 py-2.5 bg-[#67E14B] hover:bg-[#7FE866] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0 transition-colors disabled:opacity-50"
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
          <div className="p-3 bg-red-950/80 border-2 border-red-500 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Box Container */}
        <div className="bg-[#0f172a] border-2 border-slate-700 p-6 sm:p-8 rounded-none shadow-2xl">
          {authMode === "SIGN_IN" ? (
            /* ================= SIGN IN FORM ================= */
            <form onSubmit={handleGeneralLogin} className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-lime-400" />
                  General Credentials Sign In
                </h3>

                {/* Preset Fast Picker */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400">Quick Test:</span>
                  <button
                    type="button"
                    onClick={() => fillPreset("LEARNER")}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-lime-400 border border-slate-700 font-bold"
                  >
                    Learner
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPreset("UNIT_HEAD")}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-400 border border-slate-700 font-bold"
                  >
                    Unit Head
                  </button>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-lime-400" />
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@selise.ch"
                  className="w-full bg-[#090d16] border-2 border-slate-700 focus:border-lime-400 rounded-none p-3 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-lime-400" />
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#090d16] border-2 border-slate-700 focus:border-lime-400 rounded-none p-3 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Access Role Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Operational Workspace Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLoginRole("LEARNER")}
                    className={`p-3 text-left border-2 rounded-none transition-all flex flex-col justify-between ${
                      loginRole === "LEARNER"
                        ? "bg-[#142617] border-[#67E14B] text-white"
                        : "bg-[#090d16] border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black uppercase text-lime-400 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> Learner
                      </span>
                      {loginRole === "LEARNER" && <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1">Curriculum & Personal Notes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginRole("UNIT_HEAD")}
                    className={`p-3 text-left border-2 rounded-none transition-all flex flex-col justify-between ${
                      loginRole === "UNIT_HEAD"
                        ? "bg-purple-950/60 border-purple-500 text-white"
                        : "bg-[#090d16] border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black uppercase text-purple-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Unit Head
                      </span>
                      {loginRole === "UNIT_HEAD" && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1">Executive Org Matrix & Auditing</span>
                  </button>
                </div>
              </div>

              {/* Sign In Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#67E14B] hover:bg-[#7FE866] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg shadow-lime-500/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  <>
                    <span>Enter Learning Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ================= SIGN UP FORM ================= */
            <form onSubmit={handleGeneralSignup} className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-lime-400" />
                  Register New Account
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set up your profile to sync learning progress across disciplines.
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Rahat"
                    className="w-full bg-[#090d16] border-2 border-slate-700 focus:border-lime-400 rounded-none p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Chowdhury"
                    className="w-full bg-[#090d16] border-2 border-slate-700 focus:border-lime-400 rounded-none p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-lime-400" />
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="user@selise.ch"
                  className="w-full bg-[#090d16] border-2 border-slate-700 focus:border-lime-400 rounded-none p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-lime-400" />
                  Password (Min 8 Characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#090d16] border-2 border-slate-700 focus:border-lime-400 rounded-none p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Discipline and Role */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Discipline Track
                  </label>
                  <select
                    value={signupDiscipline}
                    onChange={(e) => setSignupDiscipline(e.target.value)}
                    className="w-full bg-[#090d16] border-2 border-slate-700 focus:border-lime-400 rounded-none p-2.5 text-xs text-white focus:outline-none transition-colors"
                  >
                    <option value="Product Engineer">Product Engineer</option>
                    <option value="AI Product Manager">AI Product Manager</option>
                    <option value="Technical Consultant">Technical Consultant</option>
                    <option value="Service Designer">Service Designer</option>
                    <option value="Cloud Architect">Cloud Architect</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Assigned Role
                  </label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value as "LEARNER" | "UNIT_HEAD")}
                    className="w-full bg-[#090d16] border-2 border-slate-700 focus:border-lime-400 rounded-none p-2.5 text-xs text-white focus:outline-none transition-colors"
                  >
                    <option value="LEARNER">Learner (User A)</option>
                    <option value="UNIT_HEAD">Unit Head (User B)</option>
                  </select>
                </div>
              </div>

              {/* Register through SELISE Blocks Checkbox Option */}
              <div className="p-3 bg-[#142617]/50 border border-[#67E14B]/60 rounded-none flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="viaBlocks"
                  checked={registerViaBlocks}
                  onChange={(e) => setRegisterViaBlocks(e.target.checked)}
                  className="mt-0.5 accent-[#67E14B] rounded-none cursor-pointer"
                />
                <label htmlFor="viaBlocks" className="text-xs text-slate-300 cursor-pointer select-none">
                  <span className="font-bold text-white block">
                    Register through SELISE Blocks IAM (Project D5e5c23b)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Creates an enterprise identity record on Blocks Cloud platform with verified permissions.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#67E14B] hover:bg-[#7FE866] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg shadow-lime-500/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  <>
                    <span>Create Account & Enter Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom Switch Link */}
          <div className="pt-5 border-t border-slate-800 text-center mt-5">
            {authMode === "SIGN_IN" ? (
              <p className="text-xs text-slate-400">
                Don&apos;t have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGN_UP")
                    setErrorMsg(null)
                  }}
                  className="text-lime-400 font-bold hover:underline ml-1"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Already registered with an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGN_IN")
                    setErrorMsg(null)
                  }}
                  className="text-lime-400 font-bold hover:underline ml-1"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-4 gap-2">
        <span>TXL Playbook 2026 · Chapter 15 Competency Operating System</span>
        <span>Security: Strict Enterprise Role Isolation & Blocks IAM</span>
      </footer>
    </div>
  )
}
