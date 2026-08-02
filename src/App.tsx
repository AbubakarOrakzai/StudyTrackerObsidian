import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { TitleBar } from "./components/TitleBar";
import { ChecklistPanel } from "./components/ChecklistPanel";
import { PomodoroTimer } from "./components/PomodoroTimer";
import { StatsBar } from "./components/StatsBar";
import { SettingsPanel } from "./components/SettingsPanel";
import { useStudyStore } from "./store/useStudyStore";

export default function App() {
  const widgetMode = useStudyStore((s) => s.widgetMode);
  const settings = useStudyStore((s) => s.settings);
  const [showSettings, setShowSettings] = useState(false);

  // Apply the persisted always-on-top preference once on launch.
  useEffect(() => {
    getCurrentWindow().setAlwaysOnTop(settings.alwaysOnTop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (widgetMode) {
    // Compact floating widget: just the mascot/timer, no checklist.
    return (
      <div className="h-screen w-screen flex flex-col bg-bg rounded-xl2 overflow-hidden border border-border">
        <TitleBar onOpenSettings={() => setShowSettings(true)} />
        <div className="flex-1 flex items-center justify-center p-2">
          <PomodoroTimer />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-bg relative overflow-hidden">
      <TitleBar onOpenSettings={() => setShowSettings(true)} />

      <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
        <div className="rounded-xl2 bg-surface/40 border border-border/50 py-2">
          <PomodoroTimer />
        </div>

        <StatsBar />

        <div className="flex-1 overflow-hidden">
          <ChecklistPanel />
        </div>
      </div>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
}
