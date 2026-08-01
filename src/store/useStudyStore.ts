import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  StudyPlan,
  Settings,
  PomodoroLogEntry,
  CompletionLogEntry,
} from "../types";
import { defaultPlan } from "../data/defaultPlan";
import { appendObsidianLog } from "../lib/obsidian";

interface StudyState {
  plan: StudyPlan;
  settings: Settings;
  pomodoroLogs: PomodoroLogEntry[];
  completionLogs: CompletionLogEntry[];
  widgetMode: boolean;

  // Checklist actions
  toggleTask: (weekId: string, taskId: string) => void;
  importPlan: (plan: StudyPlan) => void;

  // Settings actions
  updateSettings: (patch: Partial<Settings>) => void;

  // Pomodoro/logging actions
  logPomodoroSession: (taskName: string, minutes: number) => void;

  // Widget mode
  setWidgetMode: (on: boolean) => void;

  // Derived stats (implemented as plain functions, not stored state)
  overallProgress: () => number;
  weekProgress: (weekId: string) => number;
  focusedMinutesThisWeek: () => number;
  tasksCompletedThisWeek: () => number;
}

function startOfWeekISO(): string {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      plan: defaultPlan,
      settings: {
        vaultPath: "",
        logFileName: "Study Log.md",
        obsidianEnabled: false,
        pomodoroWorkMin: 25,
        pomodoroBreakMin: 5,
        alwaysOnTop: false,
        soundEnabled: true,
      },
      pomodoroLogs: [],
      completionLogs: [],
      widgetMode: false,

      toggleTask: (weekId, taskId) => {
        let toggledOn = false;
        let taskTitle = "";
        let weekLabel = "";

        set((state) => ({
          plan: state.plan.map((phase) => ({
            ...phase,
            weeks: phase.weeks.map((w) => {
              if (w.id !== weekId) return w;
              weekLabel = w.label;
              return {
                ...w,
                tasks: w.tasks.map((t) => {
                  if (t.id !== taskId) return t;
                  toggledOn = !t.done;
                  taskTitle = t.title;
                  return { ...t, done: !t.done };
                }),
              };
            }),
          })),
        }));

        // Only log to Obsidian when a task is being checked OFF -> ON,
        // not when un-checking a mistake.
        if (toggledOn) {
          const entry: CompletionLogEntry = {
            id: crypto.randomUUID(),
            date: new Date().toISOString().slice(0, 10),
            label: `${weekLabel} - ${taskTitle}`,
            timestamp: Date.now(),
          };
          set((state) => ({
            completionLogs: [...state.completionLogs, entry],
          }));

          const { settings } = get();
          if (settings.obsidianEnabled && settings.vaultPath) {
            appendObsidianLog(settings, {
              type: "completion",
              date: entry.date,
              text: entry.label,
            });
          }
        }
      },

      importPlan: (plan) => set({ plan }),

      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),

      logPomodoroSession: (taskName, minutes) => {
        const entry: PomodoroLogEntry = {
          id: crypto.randomUUID(),
          date: new Date().toISOString().slice(0, 10),
          taskName: taskName || "Untitled session",
          minutes,
          timestamp: Date.now(),
        };
        set((state) => ({ pomodoroLogs: [...state.pomodoroLogs, entry] }));

        const { settings } = get();
        if (settings.obsidianEnabled && settings.vaultPath) {
          appendObsidianLog(settings, {
            type: "pomodoro",
            date: entry.date,
            text: `${minutes}min on "${taskName || "Untitled session"}"`,
          });
        }
      },

      setWidgetMode: (on) => set({ widgetMode: on }),

      overallProgress: () => {
        const { plan } = get();
        const all = plan.flatMap((p) => p.weeks.flatMap((w) => w.tasks));
        if (all.length === 0) return 0;
        return Math.round((all.filter((t) => t.done).length / all.length) * 100);
      },

      weekProgress: (weekId) => {
        const { plan } = get();
        const week = plan.flatMap((p) => p.weeks).find((w) => w.id === weekId);
        if (!week || week.tasks.length === 0) return 0;
        return Math.round(
          (week.tasks.filter((t) => t.done).length / week.tasks.length) * 100
        );
      },

      focusedMinutesThisWeek: () => {
        const start = new Date(startOfWeekISO()).getTime();
        return get()
          .pomodoroLogs.filter((l) => l.timestamp >= start)
          .reduce((sum, l) => sum + l.minutes, 0);
      },

      tasksCompletedThisWeek: () => {
        const start = new Date(startOfWeekISO()).getTime();
        return get().completionLogs.filter((l) => l.timestamp >= start).length;
      },
    }),
    {
      name: "study-companion-storage", // localStorage key; persists across restarts
    }
  )
);
