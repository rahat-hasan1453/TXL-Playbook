"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Loader2, AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default function LoginCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(true)
  const isHandled = useRef(false)

  useEffect(() => {
    if (isHandled.current) return
    isHandled.current = true

    const handleCallback = async () => {
      try {
        setProcessing(true)

        // Parse OIDC callback parameters
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get("code")
        const state = urlParams.get("state")
        const errorParam = urlParams.get("error")
        const errorDesc = urlParams.get("error_description")

        if (errorParam) {
          throw new Error(errorDesc || errorParam)
        }

        if (!code) {
          throw new Error("No authorization code found in callback URL")
        }

        // Delegate code exchange and session establishment to server (safe from CORS)
        const res = await fetch("/api/auth/blocks/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            state,
            url: window.location.href,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "Failed to complete authentication with Blocks IAM")
        }

        // Redirect to main portal
        router.push("/")
        router.refresh()
      } catch (err: unknown) {
        console.error("SELISE Blocks OIDC callback error:", err)
        setError(err instanceof Error ? err.message : "Authentication callback failed")
      } finally {
        setProcessing(false)
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex items-center justify-center p-4 selection:bg-zinc-800">
      <div className="max-w-md w-full bg-[#121316] border border-zinc-800/80 p-8 rounded-2xl text-center space-y-6 shadow-2xl">
        <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-blue-400 shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>

        {processing && (
          <div className="space-y-3">
            <Loader2 className="w-7 h-7 text-white animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-white tracking-tight">Completing Blocks SSO Login...</h2>
            <p className="text-xs text-zinc-400">Exchanging authorization tokens and securing your enterprise session.</p>
          </div>
        )}

        {error && (
          <div className="space-y-4">
            <div className="p-3 bg-red-950/60 border border-red-800/50 text-red-300 text-xs rounded-xl flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-2.5 px-4 bg-white hover:bg-zinc-200 text-black font-semibold text-xs rounded-lg transition shadow"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
