import { Clock, CheckCircle2 } from "lucide-react";
import { useStudyStore } from "../store/useStudyStore";

export function StatsBar() {
  const minutes = useStudyStore((s) => s.focusedMinutesThisWeek());
  const tasksDone = useStudyStore((s) => s.tasksCompletedThisWeek());

  const hours = Math.floor(minutes / 60);
  const remMin = minutes % 60;
  const timeLabel = hours > 0 ? `${hours}h ${remMin}m` : `${remMin}m`;

  return (
    <div className="flex items-center gap-4 px-3 py-2 rounded-lg bg-surface border border-border/60 text-xs">
      <div className="flex items-center gap-1.5 text-ink-muted">
        <Clock size={13} className="text-coral" />
        <span className="text-ink font-medium">{timeLabel}</span>
        <span>focused this week</span>
      </div>
      <div className="w-px h-4 bg-border" />
      <div className="flex items-center gap-1.5 text-ink-muted">
        <CheckCircle2 size={13} className="text-avocado" />
        <span className="text-ink font-medium">{tasksDone}</span>
        <span>tasks this week</span>
      </div>
    </div>
  );
}
