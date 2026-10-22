"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { blocksClient } from "@/lib/blocks"
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
        // Complete the hosted login via @seliseblocks/client SDK
        const callbackResult = await blocksClient.auth.idp.callback(window.location.href)
        
        // Fetch authenticated user claims from SELISE Blocks IAM
        const userInfo = (await blocksClient.auth.userInfo()) as { data?: Record<string, string> }
        const claims = userInfo?.data || {}

        // Sync with portal session cookie
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "LEARNER",
            email: claims.email || "blocks.user@selise.ch",
            name: claims.fullName || claims.displayName || claims.name || "SELISE Blocks User",
            discipline: "Cloud Engineer",
            avatar: "SB",
          }),
        })

        if (res.ok) {
          router.push("/")
          router.refresh()
        } else {
          router.push("/")
        }
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0f172a] border-2 border-slate-700 p-8 rounded-none text-center space-y-6 shadow-2xl">
        <div className="w-12 h-12 mx-auto rounded-none bg-[#142617] border-2 border-[#67E14B] flex items-center justify-center shadow-lg shadow-lime-500/20">
          <Sparkles className="w-6 h-6 text-[#67E14B]" />
        </div>

        {processing && (
          <div className="space-y-3">
            <Loader2 className="w-8 h-8 text-lime-400 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">Completing Blocks SSO Login...</h2>
            <p className="text-xs text-slate-400">Exchanging authorization tokens and securing your session.</p>
          </div>
        )}

        {error && (
          <div className="space-y-4">
            <div className="p-3 bg-red-950/60 border border-red-500/60 text-red-300 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-600 transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
