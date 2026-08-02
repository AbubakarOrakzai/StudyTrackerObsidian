import { invoke } from "@tauri-apps/api/core";
import type { Settings } from "../types";

interface LogEvent {
  type: "completion" | "pomodoro";
  date: string; // YYYY-MM-DD
  text: string;
}

// Groups today's entries under a single "### 2026-08-01" heading, matching
// the format you asked for:
//
// ### 2026-08-01
// - Completed: Week 2 - MOSFET Motor Control
// - Pomodoro: 25min on "STM32 Interrupts"
function formatEntry(event: LogEvent): string {
  const prefix = event.type === "completion" ? "Completed" : "Pomodoro";
  return `- ${prefix}: ${event.text}\n`;
}

// We keep this cheap: check whether today's date heading is already the
// last heading in the file by asking Rust for the tail, and only insert a
// new "### date" heading when the day changes. This keeps the log readable
// instead of repeating the date on every single line.
export async function appendObsidianLog(settings: Settings, event: LogEvent) {
  if (!settings.vaultPath) return;

  try {
    const needsHeading: boolean = await invoke("obsidian_needs_date_heading", {
      vaultPath: settings.vaultPath,
      logFile: settings.logFileName,
      date: event.date,
    });

    const chunk =
      (needsHeading ? `\n### ${event.date}\n` : "") + formatEntry(event);

    await invoke("append_obsidian_log", {
      vaultPath: settings.vaultPath,
      logFile: settings.logFileName,
      entry: chunk,
    });
  } catch (err) {
    // Don't let a broken vault path crash the whole app — surface it in
    // the console; the Settings panel also lets the user "Test connection".
    console.error("Failed to write to Obsidian log:", err);
  }
}

export async function testObsidianConnection(
  vaultPath: string,
  logFileName: string
): Promise<{ ok: boolean; message: string }> {
  try {
    await invoke("append_obsidian_log", {
      vaultPath,
      logFile: logFileName,
      entry: `\n### Connection test (${new Date().toISOString().slice(0, 10)})\n- Study Companion connected successfully ✅\n`,
    });
    return { ok: true, message: "Connected! Check your log file." };
  } catch (err) {
    return { ok: false, message: String(err) };
  }
}
