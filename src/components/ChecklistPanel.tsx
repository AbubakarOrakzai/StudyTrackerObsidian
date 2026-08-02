import { useState } from "react";
import { Upload } from "lucide-react";
import { PhaseCard } from "./PhaseCard";
import { useStudyStore } from "../store/useStudyStore";
import { parseStudyPlan } from "../lib/parseStudyPlan";

export function ChecklistPanel() {
  const plan = useStudyStore((s) => s.plan);
  const importPlan = useStudyStore((s) => s.importPlan);
  const overallProgress = useStudyStore((s) => s.overallProgress());

  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");

  function handleImport() {
    if (!importText.trim()) return;
    const parsed = parseStudyPlan(importText);
    if (parsed.length > 0) {
      importPlan(parsed);
      setShowImport(false);
      setImportText("");
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-1 mb-2">
        <div>
          <div className="text-xs text-ink-muted uppercase tracking-wide">Overall progress</div>
          <div className="font-display text-xl font-bold text-avocado">
            {overallProgress}%
          </div>
        </div>
        <button
          onClick={() => setShowImport((v) => !v)}
          className="flex items-center gap-1.5 text-xs rounded-full border border-border px-3 py-1.5 hover:bg-surface-hover transition-colors"
        >
          <Upload size={13} />
          Import plan
        </button>
      </div>

      <div className="h-1.5 w-full bg-border/60 rounded-full mb-4">
        <div
          className="h-1.5 rounded-full bg-avocado transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {showImport && (
        <div className="mb-3 rounded-lg border border-border bg-surface p-2 animate-pop-in">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={
              "Paste a plan using:\n# Phase 1 — Title\n## Week 1 — Title\n- Task one\n- Task two"
            }
            rows={6}
            className="w-full bg-transparent text-xs font-mono resize-none focus:outline-none placeholder:text-ink-muted/50"
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={() => setShowImport(false)}
              className="text-xs text-ink-muted hover:text-ink px-2 py-1"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              className="text-xs bg-avocado text-bg font-semibold rounded-md px-3 py-1 hover:bg-avocado-bright"
            >
              Replace plan
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-1">
        {plan.map((phase, i) => (
          <PhaseCard key={phase.id} phase={phase} defaultOpen={i === 0} />
        ))}
      </div>
    </div>
  );
}
