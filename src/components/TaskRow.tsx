import clsx from "clsx";
import type { Task } from "../types";

export function TaskRow({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-start gap-2.5 py-1.5 px-2 rounded-lg hover:bg-surface-hover cursor-pointer group">
      <input
        type="checkbox"
        className="task-checkbox mt-0.5"
        checked={task.done}
        onChange={onToggle}
      />
      <span
        className={clsx(
          "text-sm leading-snug transition-colors",
          task.done ? "text-ink-muted line-through" : "text-ink group-hover:text-ink"
        )}
      >
        {task.title}
      </span>
    </label>
  );
}
