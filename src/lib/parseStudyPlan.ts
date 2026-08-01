import type { StudyPlan, Phase, Week, Task } from "../types";

// Expected input format (Markdown), designed to match how you already
// write these plans:
//
// # Phase 1 — Electronics & Embedded Foundations
// ## Week 1 — Electronics core + first circuits
// - Learn Ohm's Law, components, reading schematics
// - Project: LED blink
// ## Week 2 — MOSFETs, PWM, motors
// - ...
// # Phase 2 — ...
//
// Rules:
//   "# "   -> starts a new Phase
//   "## "  -> starts a new Week within the current Phase
//   "- "   -> a Task within the current Week (also accepts "* " and "- [ ] ")
// Anything else is ignored, so pasting extra prose/headers won't break it.
export function parseStudyPlan(markdown: string): StudyPlan {
  const lines = markdown.split("\n");
  const plan: StudyPlan = [];

  let currentPhase: Phase | null = null;
  let currentWeek: Week | null = null;
  let uid = 0;
  const id = (prefix: string) => `${prefix}-${uid++}`;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("# ") && !line.startsWith("## ")) {
      currentPhase = { id: id("phase"), label: line.replace(/^#\s+/, ""), weeks: [] };
      plan.push(currentPhase);
      currentWeek = null;
      continue;
    }

    if (line.startsWith("## ")) {
      if (!currentPhase) {
        // A week appeared before any phase heading — create an implicit phase.
        currentPhase = { id: id("phase"), label: "Untitled Phase", weeks: [] };
        plan.push(currentPhase);
      }
      currentWeek = { id: id("week"), label: line.replace(/^##\s+/, ""), tasks: [] };
      currentPhase.weeks.push(currentWeek);
      continue;
    }

    const taskMatch = line.match(/^[-*]\s*(?:\[[ xX]\]\s*)?(.+)$/);
    if (taskMatch) {
      if (!currentWeek) {
        // A task appeared with no week yet — create an implicit week.
        if (!currentPhase) {
          currentPhase = { id: id("phase"), label: "Untitled Phase", weeks: [] };
          plan.push(currentPhase);
        }
        currentWeek = { id: id("week"), label: "Untitled Week", tasks: [] };
        currentPhase.weeks.push(currentWeek);
      }
      const done = /^-\s*\[[xX]\]/.test(line);
      const task: Task = { id: id("task"), title: taskMatch[1].trim(), done };
      currentWeek.tasks.push(task);
    }
  }

  return plan;
}
