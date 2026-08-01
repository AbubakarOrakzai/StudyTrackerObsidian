import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { AvocadoMascot } from "./AvocadoMascot";
import { useStudyStore } from "../store/useStudyStore";
import { playChime } from "../lib/sound";

type Mode = "work" | "break";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function PomodoroTimer() {
  const settings = useStudyStore((s) => s.settings);
  const logPomodoroSession = useStudyStore((s) => s.logPomodoroSession);

  const [mode, setMode] = useState<Mode>("work");
  const [secondsLeft, setSecondsLeft] = useState(settings.pomodoroWorkMin * 60);
  const [running, setRunning] = useState(false);
  const [taskName, setTaskName] = useState("");

  // Keep the countdown in sync if the user changes the work/break length
  // in Settings while the timer is idle (not mid-session).
  useEffect(() => {
    if (!running) {
      setSecondsLeft(
        (mode === "work" ? settings.pomodoroWorkMin : settings.pomodoroBreakMin) * 60
      );
    }
  }, [settings.pomodoroWorkMin, settings.pomodoroBreakMin, mode, running]);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function handleSessionEnd() {
    setRunning(false);
    if (settings.soundEnabled) {
      playChime(mode === "work" ? "work-end" : "break-end");
    }

    if (mode === "work") {
      logPomodoroSession(taskName, settings.pomodoroWorkMin);
      setMode("break");
      setSecondsLeft(settings.pomodoroBreakMin * 60);
    } else {
      setMode("work");
      setSecondsLeft(settings.pomodoroWorkMin * 60);
    }
  }

  function reset() {
    setRunning(false);
    setMode("work");
    setSecondsLeft(settings.pomodoroWorkMin * 60);
  }

  function skipToBreak() {
    // Lets you log a session early instead of waiting out the last minute.
    if (mode === "work" && secondsLeft > 0) {
      const elapsedMin = settings.pomodoroWorkMin - Math.ceil(secondsLeft / 60);
      if (elapsedMin > 0) logPomodoroSession(taskName, elapsedMin);
    }
    setMode(mode === "work" ? "break" : "work");
    setRunning(false);
    setSecondsLeft(
      (mode === "work" ? settings.pomodoroBreakMin : settings.pomodoroWorkMin) * 60
    );
  }

  const mascotMood = running ? (mode === "work" ? "focused" : "resting") : "idle";
  const accent = mode === "work" ? "text-avocado" : "text-coral";
  const ringColor = mode === "work" ? "#8FAE6E" : "#E8875B";

  const totalSeconds =
    (mode === "work" ? settings.pomodoroWorkMin : settings.pomodoroBreakMin) * 60;
  const progress = 1 - secondsLeft / totalSeconds;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
        <svg width="140" height="140" className="-rotate-90 absolute">
          <circle cx="70" cy="70" r={radius} stroke="#2A2D35" strokeWidth="6" fill="none" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={ringColor}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <AvocadoMascot mood={mascotMood} size={64} />
      </div>

      <div className={`font-mono text-3xl font-bold ${accent}`}>{formatTime(secondsLeft)}</div>
      <div className="text-xs uppercase tracking-wide text-ink-muted">
        {mode === "work" ? "Focus session" : "Short break"}
      </div>

      <input
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder='Task name, e.g. "Week 3 - STM32 UART"'
        disabled={running}
        className="w-full max-w-[220px] rounded-lg bg-surface border border-border px-3 py-1.5 text-sm text-center placeholder:text-ink-muted/60 focus:outline-none focus:border-avocado disabled:opacity-50"
      />

      <div className="flex items-center gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex items-center gap-1.5 rounded-full bg-avocado hover:bg-avocado-bright text-bg font-semibold px-4 py-2 text-sm transition-colors"
        >
          {running ? <Pause size={15} /> : <Play size={15} />}
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          title="Reset"
          className="rounded-full bg-surface hover:bg-surface-hover border border-border p-2 transition-colors"
        >
          <RotateCcw size={15} className="text-ink-muted" />
        </button>
        <button
          onClick={skipToBreak}
          title={mode === "work" ? "Skip to break" : "Skip to focus"}
          className="rounded-full bg-surface hover:bg-surface-hover border border-border p-2 transition-colors"
        >
          <Coffee size={15} className="text-ink-muted" />
        </button>
      </div>
    </div>
  );
}
