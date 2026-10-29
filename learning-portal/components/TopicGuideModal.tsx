"use client"

import { useEffect } from "react"
import { BookOpen, Check, ExternalLink, Lightbulb, Target, Undo2, X } from "lucide-react"
import type { Topic } from "@/lib/curriculumData"
import { getTopicGuide } from "@/lib/topic-guides"
import type { Lang } from "@/lib/topic-guides"
import { useLang } from "@/lib/use-lang"

const LABELS = {
  badge: { en: "Beginner guide", bn: "শুরুর গাইড" },
  basics: { en: "The basics", bn: "মূল কথা" },
  ideas: { en: "Key ideas to remember", bn: "মনে রাখার মতো ধারণা" },
  tryIt: { en: "Try this first", bn: "প্রথমে এটি করে দেখুন" },
  refs: { en: "Learn more from these 5 places", bn: "আরও শিখুন এই ৫টি জায়গা থেকে" },
  opens: { en: "Opens in a new tab", bn: "নতুন ট্যাবে খুলবে" },
  close: { en: "Close", bn: "বন্ধ করুন" },
  markRead: { en: "Mark as read", bn: "পড়া হয়েছে চিহ্নিত করুন" },
  isRead: { en: "Marked as read", bn: "পড়া সম্পন্ন" },
  undo: { en: "Undo: mark as not read", bn: "পূর্বাবস্থায় ফেরান" },
  none: {
    en: "There is no beginner guide for this topic yet. Search the topic name on the web, or ask a teammate who works with it.",
    bn: "এই বিষয়ের জন্য এখনো কোনো শুরুর গাইড নেই। ওয়েবে বিষয়টির নাম সার্চ করুন অথবা যিনি এটি নিয়ে কাজ করেন এমন সহকর্মীকে জিজ্ঞেস করুন।",
  },
  expert: {
    en: "Want to become an expert? Learn in the way that suits you best: practise on real projects, read the references above, ask people who do this work every day, and keep exploring beyond what is listed here. This content only gives you a basic idea to start with.",
    bn: "দক্ষ হতে চান? আপনার নিজের মতো করে শিখুন: বাস্তব প্রজেক্টে অনুশীলন করুন, ওপরের রেফারেন্স পড়ুন, যারা প্রতিদিন এই কাজ করেন তাদের জিজ্ঞেস করুন এবং এখানে দেওয়া তালিকার বাইরেও খুঁজতে থাকুন। এই কনটেন্ট শুধু শুরু করার জন্য একটি প্রাথমিক ধারণা দেয়।",
  },
} as const

const KIND_BN: Record<string, string> = {
  Article: "আর্টিকেল",
  Docs: "ডকুমেন্টেশন",
  Course: "কোর্স",
  Book: "বই",
  Wiki: "উইকি",
  Video: "ভিডিও",
  Tool: "টুল",
}

const KIND_STYLE: Record<string, string> = {
  Video: "bg-red-950/40 text-red-300 border-red-800/50",
  Course: "bg-emerald-950/40 text-emerald-300 border-emerald-800/50",
  Book: "bg-amber-950/40 text-amber-300 border-amber-800/50",
  Tool: "bg-violet-950/40 text-violet-300 border-violet-800/50",
}

function t(label: { en: string; bn: string }, lang: Lang) {
  return label[lang]
}

export function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div role="group" aria-label="Content language" className="inline-flex rounded-lg border border-zinc-700/70 bg-zinc-800/60 p-0.5 text-xs font-semibold">
      {(["en", "bn"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
          className={`px-3 py-1 rounded-md transition ${
            lang === l ? "bg-white text-black" : "text-zinc-400 hover:text-white"
          }`}
        >
          {l === "en" ? "English" : "বাংলা"}
        </button>
      ))}
    </div>
  )
}

interface TopicGuideModalProps {
  topic: Topic
  onClose: () => void
  /** Whether the learner has already marked this topic as read. */
  completed?: boolean
  /** When given, the modal shows the Mark as read control (locked once read, with an undo icon). */
  onSetCompleted?: (done: boolean) => void
  xp?: number
}

export default function TopicGuideModal({ topic, onClose, completed = false, onSetCompleted, xp }: TopicGuideModalProps) {
  const [lang, setLang] = useLang()
  const guide = getTopicGuide(topic.id)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${t(LABELS.badge, lang)}: ${topic.title}`}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#121316] border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[94vh] sm:max-h-[88vh] shadow-2xl flex flex-col">
        <div className="flex items-start justify-between gap-4 px-5 sm:px-8 pt-5 pb-4 border-b border-zinc-800/80">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-300 bg-zinc-800/80 px-2.5 py-0.5 rounded-full border border-zinc-700/50">
              <BookOpen className="w-3 h-3 text-blue-400" /> {t(LABELS.badge, lang)}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2.5 tracking-tight">{topic.title}</h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{topic.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <LangSwitch lang={lang} onChange={setLang} />
            <button
              onClick={onClose}
              aria-label={t(LABELS.close, lang)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div lang={lang} className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 space-y-6 leading-relaxed">
          {!guide ? (
            <p className="text-sm text-zinc-300">{t(LABELS.none, lang)}</p>
          ) : (
            <>
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-2">{t(LABELS.basics, lang)}</h3>
                <p className="text-sm text-zinc-200">{guide.basics[lang]}</p>
              </section>

              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> {t(LABELS.ideas, lang)}
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-zinc-200 marker:text-zinc-500">
                  {guide.ideas[lang].map((idea, i) => (
                    <li key={i}>{idea}</li>
                  ))}
                </ul>
              </section>

              <section className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-emerald-300 mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> {t(LABELS.tryIt, lang)}
                </h3>
                <p className="text-sm text-zinc-200">{guide.tryIt[lang]}</p>
              </section>

              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-2">{t(LABELS.refs, lang)}</h3>
                <ol className="space-y-2">
                  {guide.refs.map((ref) => (
                    <li key={ref.url}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t(LABELS.opens, lang)}
                        className="group flex items-start gap-3 rounded-xl border border-zinc-800 bg-[#0e0f12] hover:border-zinc-600 px-3.5 py-2.5 transition"
                      >
                        <span
                          lang="en"
                          className={`mt-0.5 shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            KIND_STYLE[ref.kind] || "bg-zinc-800/80 text-zinc-300 border-zinc-700/60"
                          }`}
                        >
                          {lang === "bn" ? KIND_BN[ref.kind] || ref.kind : ref.kind}
                        </span>
                        <span lang="en" className="flex-1 min-w-0 text-sm text-zinc-200 group-hover:text-white break-words">
                          {ref.title}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-1 text-zinc-500 group-hover:text-white" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ol>
              </section>

              <p className="text-xs text-zinc-400 border-t border-zinc-800/80 pt-4">{t(LABELS.expert, lang)}</p>
            </>
          )}
        </div>

        {onSetCompleted && (
          <div className="flex items-center justify-end gap-2 px-5 sm:px-8 py-3.5 border-t border-zinc-800/80">
            {completed ? (
              <>
                <span
                  aria-live="polite"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 flex items-center justify-center gap-1.5 cursor-default select-none"
                >
                  <Check className="w-4 h-4 stroke-[3]" /> {t(LABELS.isRead, lang)}
                </span>
                <button
                  onClick={() => onSetCompleted(false)}
                  title={t(LABELS.undo, lang)}
                  aria-label={t(LABELS.undo, lang)}
                  className="w-10 h-10 rounded-xl border border-b-4 border-zinc-700/70 bg-zinc-800/80 text-zinc-300 hover:text-white flex items-center justify-center transition"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => onSetCompleted(true)}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-extrabold bg-emerald-500 hover:bg-emerald-400 text-black border-b-4 border-emerald-700 active:border-b-0 active:translate-y-0.5 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" /> {t(LABELS.markRead, lang)}
                {xp ? ` +${xp} XP` : ""}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
