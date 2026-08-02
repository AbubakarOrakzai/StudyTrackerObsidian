import { useState } from "react";
import { FolderOpen, X } from "lucide-react";
import { open } from "@tauri-apps/plugin-dialog";
import { useStudyStore } from "../store/useStudyStore";
import { testObsidianConnection } from "../lib/obsidian";

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const settings = useStudyStore((s) => s.settings);
  const updateSettings = useStudyStore((s) => s.updateSettings);
  const [testResult, setTestResult] = useState<string | null>(null);

  async function pickVaultFolder() {
    const selected = await open({ directory: true, multiple: false });
    if (typeof selected === "string") {
      updateSettings({ vaultPath: selected });
    }
  }

  async function handleTestConnection() {
    setTestResult("Testing…");
    const result = await testObsidianConnection(settings.vaultPath, settings.logFileName);
    setTestResult(result.message);
  }

  return (
    <div className="absolute inset-0 bg-bg/95 backdrop-blur-sm z-20 flex flex-col p-4 animate-pop-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-sm">Settings</h2>
        <button onClick={onClose} className="text-ink-muted hover:text-ink">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-5 pr-1 text-sm">
        {/* Obsidian integration */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Obsidian logging</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.obsidianEnabled}
                onChange={(e) => updateSettings({ obsidianEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-avocado transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-ink rounded-full transition-transform peer-checked:translate-x-4" />
            </label>
          </div>

          <div className="flex gap-2">
            <input
              value={settings.vaultPath}
              onChange={(e) => updateSettings({ vaultPath: e.target.value })}
              placeholder="/path/to/your/Obsidian/vault"
              className="flex-1 min-w-0 rounded-md bg-surface border border-border px-2 py-1.5 text-xs focus:outline-none focus:border-avocado"
            />
            <button
              onClick={pickVaultFolder}
              className="rounded-md border border-border px-2 py-1.5 hover:bg-surface-hover shrink-0"
              title="Browse"
            >
              <FolderOpen size={14} />
            </button>
          </div>

          <input
            value={settings.logFileName}
            onChange={(e) => updateSettings({ logFileName: e.target.value })}
            placeholder="Study Log.md"
            className="rounded-md bg-surface border border-border px-2 py-1.5 text-xs focus:outline-none focus:border-avocado"
          />

          <button
            onClick={handleTestConnection}
            className="text-xs rounded-md border border-border px-2 py-1.5 hover:bg-surface-hover self-start"
          >
            Test connection
          </button>
          {testResult && <p className="text-xs text-ink-muted">{testResult}</p>}
        </section>

        {/* Pomodoro lengths */}
        <section className="flex flex-col gap-2">
          <span className="font-medium">Pomodoro lengths</span>
          <div className="flex gap-3">
            <label className="flex flex-col gap-1 text-xs text-ink-muted flex-1">
              Focus (min)
              <input
                type="number"
                min={1}
                value={settings.pomodoroWorkMin}
                onChange={(e) => updateSettings({ pomodoroWorkMin: Number(e.target.value) })}
                className="rounded-md bg-surface border border-border px-2 py-1.5 text-ink"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-ink-muted flex-1">
              Break (min)
              <input
                type="number"
                min={1}
                value={settings.pomodoroBreakMin}
                onChange={(e) => updateSettings({ pomodoroBreakMin: Number(e.target.value) })}
                className="rounded-md bg-surface border border-border px-2 py-1.5 text-ink"
              />
            </label>
          </div>
        </section>

        {/* Toggles */}
        <section className="flex flex-col gap-3">
          <ToggleRow
            label="Always on top"
            checked={settings.alwaysOnTop}
            onChange={(v) => updateSettings({ alwaysOnTop: v })}
          />
          <ToggleRow
            label="Sound on session end"
            checked={settings.soundEnabled}
            onChange={(v) => updateSettings({ soundEnabled: v })}
          />
        </section>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-avocado transition-colors" />
        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-ink rounded-full transition-transform peer-checked:translate-x-4" />
      </label>
    </div>
  );
}
