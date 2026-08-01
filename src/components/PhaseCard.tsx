import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Phase } from "../types";
import { WeekCard } from "./WeekCard";
import { useStudyStore } from "../store/useStudyStore";

export function PhaseCard({ phase, defaultOpen = false }: { phase: Phase; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const weekProgress = useStudyStore((s) => s.weekProgress);

  const allTasks = phase.weeks.flatMap((w) => w.tasks);
  const phaseProgress =
    allTasks.length === 0
      ? 0
      : Math.round((allTasks.filter((t) => t.done).length / allTasks.length) * 100);

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-1 py-1.5"
      >
        {open ? (
          <ChevronDown size={16} className="text-avocado shrink-0" />
        ) : (
          <ChevronRight size={16} className="text-avocado shrink-0" />
        )}
        <span className="font-display font-semibold text-sm flex-1 text-left truncate">
          {phase.label}
        </span>
        <span className="text-xs font-mono text-ink-muted">{phaseProgress}%</span>
      </button>

      {open && (
        <div className="flex flex-col gap-1.5 pl-2 mt-1 animate-pop-in">
          {phase.weeks.map((week) => (
            <WeekCard key={week.id} week={week} />
          ))}
        </div>
      )}
    </div>
  );
}
