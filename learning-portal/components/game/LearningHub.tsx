"use client"

import { useState } from "react"
import { CalendarDays, Map, Trophy } from "lucide-react"
import type { Domain, Topic } from "@/lib/curriculumData"
import LearningPlanner from "@/components/planner/LearningPlanner"
import SkillPath from "./SkillPath"
import Leaderboard from "./Leaderboard"

export type HubTab = "path" | "calendar" | "leaderboard"

export interface LearningHubProps {
  domains: Domain[]
  progressState: Record<string, "COMPLETED" | "IN_PROGRESS">
  onSetTopicCompleted: (topicId: string, completed: boolean) => void
  onOpenNotes: (topic: Topic) => void
  activeSubTab?: HubTab
  onSubTabChange?: (tab: HubTab) => void
}

const TABS: Array<{ id: HubTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "path", label: "Path", icon: Map },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
]

/** Learner's home for learning: gamified path first, calendar and leaderboard alongside. */
export default function LearningHub(props: LearningHubProps) {
  const [internalTab, setInternalTab] = useState<HubTab>("path")
  const tab = props.activeSubTab ?? internalTab

  const handleTabSelect = (id: HubTab) => {
    if (props.onSubTabChange) {
      props.onSubTabChange(id)
    } else {
      setInternalTab(id)
    }
  }

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="Learning views" className="inline-flex p-1 rounded-xl bg-[#121316] border border-zinc-800/80">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => handleTabSelect(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              tab === id ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {tab === "path" && <SkillPath {...props} onCreatePlan={() => handleTabSelect("calendar")} />}
      {tab === "calendar" && <LearningPlanner {...props} />}
      {tab === "leaderboard" && <Leaderboard />}
    </div>
  )
}
