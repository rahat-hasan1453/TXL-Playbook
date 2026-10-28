"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

const STORAGE_KEY = "txl_theme"

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [light, setLight] = useState(false)

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"))
  }, [])

  const toggle = () => {
    const next = !light
    setLight(next)
    document.documentElement.classList.toggle("light", next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? "light" : "dark")
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      title={light ? "Switch to dark mode" : "Switch to light mode"}
      className={`p-2 rounded-xl border bg-[#121316] border-zinc-800/80 text-zinc-300 hover:text-white hover:border-zinc-700 transition ${className}`}
    >
      {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  )
}
