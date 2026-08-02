# How to Import & Export Your Study Plan

The app stores your plan as **Phases → Weeks → Tasks**, and reads/writes
that structure using plain Markdown with three rules:

| Symbol | Creates |
|---|---|
| `# Text` | A **Phase** (top-level section) |
| `## Text` | A **Week** (nested under the phase above it) |
| `- Text` or `* Text` | A **Task** (nested under the week above it) |

---

## Importing a plan

### Minimal example
```markdown
# Phase 1 — Electronics Basics
## Week 1 — Ohm's Law & Circuits
- Learn Ohm's Law and read a schematic
- Build an LED blink circuit
- Practice with a multimeter

## Week 2 — Motors & PWM
- Learn PWM and MOSFETs
- Build a motor speed controller
```

### Step-by-step
1. Write or paste your plan into any text editor (or generate it with an AI assistant) using the `#` / `##` / `-` structure above.
2. Open the app and click **Import Plan** above the checklist.
3. Paste the whole thing into the box.
4. Click **Replace Plan**.

⚠️ **Importing replaces your entire current plan** — it doesn't merge with what's already there. Export first (see below) if you want a backup before replacing it.

### Formatting tips that make imports go smoothly
- **Every task needs a `-` or `*` at the start of the line** — plain text without a bullet is ignored.
- **A task without a Week above it, or a Week without a Phase above it, still imports** — the app auto-creates an "Untitled Phase"/"Untitled Week" so nothing gets silently dropped. It's cleaner, though, to always go `#` → `##` → `-` in order.
- **Pre-checked tasks:** write `- [x] Task name` instead of `- Task name` to import it already checked off.
- **Extra text is safe** — any line that isn't a `#`, `##`, or `-`/`*` bullet (notes, blank lines, prose) is simply skipped.
- **Headings need a space after the `#`** — `# Phase 1` works, `#Phase1` does not.

### Where to get a plan to paste
- Write it yourself directly in this format.
- Ask an AI assistant to generate a study roadmap and specifically request it "formatted as `#` Phase / `##` Week / `-` Task markdown" — that phrasing alone is usually enough for a clean import.
- Convert a spreadsheet/doc manually into this structure (there's no automatic converter for other formats).

---

## Exporting your current plan

Click the **Export** button (next to **Import Plan**, above the checklist). This downloads a file named `study-plan-YYYY-MM-DD.md` containing your exact current structure **and** checkbox state — every task is written as `- [x] ...` if done or `- [ ] ...` if not.

Use this for:
- **Backing up progress** before importing a different plan over it.
- **Moving your plan to another machine** — copy the exported `.md` file over and import it there.
- **Sharing your plan** with someone else, or archiving it in Obsidian/Notes as a plain record.

### Round-tripping
Because export and import use the exact same format, you can:
1. Export your current plan.
2. Edit the downloaded `.md` file by hand (add a new week, reword a task, etc.).
3. Re-import it — your edits apply, and any tasks still marked `[x]` stay checked.

This is the simplest way to restructure a plan without losing progress: **export → edit → re-import**, rather than editing inside the app's UI.
