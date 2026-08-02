// The whole study plan is Phases -> Weeks -> Tasks, matching how you
// actually structure your roadmaps (Phase 1, Week 1, checklist items).

export interface Task {
  id: string;
  title: string;
  done: boolean;
}

export interface Week {
  id: string;
  label: string; // e.g. "Week 3 — STM32 bootstrap"
  tasks: Task[];
}

export interface Phase {
  id: string;
  label: string; // e.g. "Phase 1 — Electronics & Embedded Foundations"
  weeks: Week[];
}

export type StudyPlan = Phase[];

export interface PomodoroLogEntry {
  id: string;
  date: string; // ISO date, e.g. 2026-08-01
  taskName: string;
  minutes: number;
  timestamp: number;
}

export interface CompletionLogEntry {
  id: string;
  date: string;
  label: string; // "Week 2 - MOSFET Motor Control"
  timestamp: number;
}

export interface Settings {
  vaultPath: string; // absolute path to the Obsidian vault
  logFileName: string; // e.g. "Study Log.md"
  obsidianEnabled: boolean;
  pomodoroWorkMin: number;
  pomodoroBreakMin: number;
  alwaysOnTop: boolean;
  soundEnabled: boolean;
}
