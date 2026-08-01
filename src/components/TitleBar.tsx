import { Settings, Pin, PinOff, Minimize2, Maximize2, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useStudyStore } from "../store/useStudyStore";

export function TitleBar({
  onOpenSettings,
}: {
  onOpenSettings: () => void;
}) {
  const settings = useStudyStore((s) => s.settings);
  const updateSettings = useStudyStore((s) => s.updateSettings);
  const widgetMode = useStudyStore((s) => s.widgetMode);
  const setWidgetMode = useStudyStore((s) => s.setWidgetMode);

  async function toggleAlwaysOnTop() {
    const next = !settings.alwaysOnTop;
    updateSettings({ alwaysOnTop: next });
    await getCurrentWindow().setAlwaysOnTop(next);
  }

  async function toggleWidgetMode() {
    const win = getCurrentWindow();
    const next = !widgetMode;
    setWidgetMode(next);
    // Widget mode shrinks the window down to just the timer — a lightweight
    // "sits on your desktop" mode instead of a second window.
    if (next) {
      await win.setSize({ type: "Logical", width: 220, height: 260 } as any);
    } else {
      await win.setSize({ type: "Logical", width: 380, height: 560 } as any);
    }
  }

  return (
    <div
      data-tauri-drag-region
      className="flex items-center justify-between px-3 py-2 bg-surface border-b border-border/60 cursor-default"
    >
      <div data-tauri-drag-region className="flex items-center gap-1.5 select-none">
        <span className="text-base">🥑</span>
        {!widgetMode && (
          <span className="font-display font-semibold text-xs text-ink-muted">
            Study Companion
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleAlwaysOnTop}
          title="Always on top"
          className={`p-1.5 rounded-md hover:bg-surface-hover transition-colors ${
            settings.alwaysOnTop ? "text-avocado" : "text-ink-muted"
          }`}
        >
          {settings.alwaysOnTop ? <Pin size={13} /> : <PinOff size={13} />}
        </button>
        <button
          onClick={toggleWidgetMode}
          title={widgetMode ? "Expand" : "Collapse to widget"}
          className="p-1.5 rounded-md hover:bg-surface-hover text-ink-muted transition-colors"
        >
          {widgetMode ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
        </button>
        {!widgetMode && (
          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-1.5 rounded-md hover:bg-surface-hover text-ink-muted transition-colors"
          >
            <Settings size={13} />
          </button>
        )}
        <button
          onClick={() => getCurrentWindow().close()}
          title="Close"
          className="p-1.5 rounded-md hover:bg-coral/20 hover:text-coral text-ink-muted transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
