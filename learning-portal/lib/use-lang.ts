"use client"

import { useCallback, useEffect, useState } from "react"
import type { Lang } from "@/lib/topic-guides/types"

const KEY = "txl_lang"
const EVENT = "txl-lang-change"

function read(): Lang {
  try {
    return localStorage.getItem(KEY) === "bn" ? "bn" : "en"
  } catch {
    return "en"
  }
}

/** Content language (English or Bangla), remembered in the browser and shared by every open guide. */
export function useLang(): [Lang, (lang: Lang) => void] {
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    setLangState(read())
    const sync = () => setLangState(read())
    window.addEventListener(EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  const setLang = useCallback((next: Lang) => {
    try {
      localStorage.setItem(KEY, next)
    } catch {}
    setLangState(next)
    window.dispatchEvent(new Event(EVENT))
  }, [])

  return [lang, setLang]
}
