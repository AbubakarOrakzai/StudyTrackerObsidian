import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Week } from "../types";
import { TaskRow } from "./TaskRow";
import { useStudyStore } from "../store/useStudyStore";

export function WeekCard({ week }: { week: Week }) {
  const [open, setOpen] = useState(false);
  const toggleTask = useStudyStore((s) => s.toggleTask);
  const progress = useStudyStore((s) => s.weekProgress(week.id));

  const isDone = progress === 100;

  return (
    <div className="rounded-lg border border-border/60 bg-surface/50">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left"
      >
        {open ? (
          <ChevronDown size={14} className="text-ink-muted shrink-0" />
        ) : (
          <ChevronRight size={14} className="text-ink-muted shrink-0" />
        )}
        <span className="text-sm font-medium flex-1 truncate">{week.label}</span>
        <span
          className={`text-xs font-mono tabular-nums ${
            isDone ? "text-avocado" : "text-ink-muted"
          }`}
        >
          {progress}%
        </span>
      </button>

      {/* progress bar */}
      <div className="h-1 w-full bg-border/60 mx-3 rounded-full" style={{ width: "calc(100% - 1.5rem)" }}>
        <div
          className="h-1 rounded-full bg-avocado transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {open && (
        <div className="px-2 pb-2 pt-1 animate-pop-in">
          {week.tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => toggleTask(week.id, task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
