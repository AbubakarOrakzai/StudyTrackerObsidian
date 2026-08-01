# Study Companion 🥑

A cute, lightweight desktop widget for tracking a multi-week study plan: a hierarchical checklist (Phases → Weeks → Tasks), a pomodoro timer with a mood-changing avocado, and automatic logging to an Obsidian vault file.

Everything here is real, working source — you just need to run a few one-time setup commands locally, because they touch your machine (Rust toolchain, app icons) in ways I can't do from here.

## 1. Prerequisites (Ubuntu)

**Node.js 18+** — if you don't have it:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**Rust** — if you don't have it:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

**System libraries Tauri needs** (WebKitGTK, appindicator, etc. — these are not installed by default, this is the step people usually miss):

```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  libssl-dev \
  libxdo-dev \
  build-essential \
  curl \
  wget \
  file \
  pkg-config
```

**Important version note:** Tauri v2 needs `webkit2gtk-4.1`, which means **Ubuntu 22.04 or newer**. On Ubuntu 20.04, only `webkit2gtk-4.0` is available in the default repos and the build will fail at `libwebkit2gtk-4.1-dev` — you'd need to either upgrade, add a PPA that backports 4.1, or drop to Tauri v1 (a bigger change, ask me if that's your situation). Check your version with `lsb_release -a` if unsure.

If `libayatana-appindicator3-dev` isn't found, older Ubuntu releases use `libappindicator3-dev` instead — install whichever your `apt-cache search appindicator` shows.

## 2. Install dependencies

```bash
npm install
```

> **Note on permissions & vulnerabilities:**
> - **Never run `sudo npm install`.** It will lock your file permissions to the root user. If you encounter permission errors, fix your folder ownership first: `sudo chown -R $USER:$USER .`
> - If `npm audit` flags vulnerabilities in `esbuild` or `vite`, updating them (`npm install vite@latest @vitejs/plugin-react@latest --save-dev`) will resolve the security warnings safely.

## 3. Generate app icons (one-time)

The config references `src-tauri/icons/*` which don't exist yet — Tauri can generate a full icon set from a single square PNG:

```bash
# Put any square image (512x512+) at src-tauri/icon-source.png, then:
npx @tauri-apps/cli icon src-tauri/icon-source.png
```

If you skip this, `tauri dev` will still run — it only matters for `tauri build` (the installer needs real icons).

## 4. Run it (development)

```bash
npm run tauri dev
```

> **Version mismatch warning:** If the terminal warns about mismatched Tauri packages between npm (`@tauri-apps/api`) and the Rust crate (`tauri`), open `src-tauri/Cargo.toml` and update the `tauri` dependency version to match your frontend package (e.g., `version = "2.11"`).

This opens the app as a small (380×560) frameless window. Drag it by the top bar (the 🥑 area). Click the pin icon for always-on-top, the shrink icon to collapse into a compact widget mode (just the timer), and the gear icon for settings.

## 5. Build and install (desktop launcher)

To use the app like a standard Linux application (with a clickable icon in your app menu), build the standalone production executable:

```bash
npm run tauri build
```

Once the build completes, install the generated Debian package to add it to your system launcher:

```bash
sudo dpkg -i src-tauri/target/release/bundle/deb/*.deb
```

You can now search for **Study Companion** in your Ubuntu app launcher, click it to open, and pin it to your dock.

## 6. Point it at your Obsidian vault

In Settings:
1. Toggle **Obsidian logging** on.
2. Browse to (or paste) your vault's folder path.
3. Set the log file name (defaults to `Study Log.md` — it's created automatically if it doesn't exist, in the vault root).
4. Hit **Test connection** — you should see a "Connection test" entry appear in that file inside Obsidian.

From then on, checking off a task or finishing a pomodoro focus session appends a line like:

```
### 2026-08-02
- Completed: Week 2 — MOSFETs, PWM, motors - MOSFET-driven motor ON/OFF then PWM speed control
- Pomodoro: 25min on "STM32 Interrupts"
```

(One `### date` heading per day, not per entry — see `src/lib/obsidian.ts` / `obsidian_needs_date_heading` in `main.rs`.)

## 7. Import your real plan

Click **Import plan** above the checklist and paste plain markdown:

```markdown
# Phase 1 — Electronics & Embedded Foundations
## Week 1 — Electronics core + first circuits
- Learn Ohm's Law, components, reading schematics
- Project: LED blink + multiple LEDs
## Week 2 — MOSFETs, PWM, motors
- ...
# Phase 2 — ...
```

`#` starts a Phase, `##` starts a Week, `-`/`*` lines become Tasks (`- [x] ...` imports as already checked). This **replaces** the current plan — see `src/lib/parseStudyPlan.ts` if you want different formatting rules.

## Project structure

```
study-companion/
├── src/
│   ├── App.tsx                 # layout + widget-mode switch
│   ├── main.tsx                # React entry point
│   ├── index.css               # Tailwind + custom checkbox/scrollbar styles
│   ├── types.ts                 # Task/Week/Phase/Settings types
│   ├── data/defaultPlan.ts      # your drone-roadmap, hardcoded as the default plan
│   ├── store/useStudyStore.ts   # Zustand store, persisted to localStorage
│   ├── lib/
│   │   ├── obsidian.ts          # formats + sends log entries to Rust
│   │   ├── parseStudyPlan.ts    # markdown -> Phase[] importer
│   │   └── sound.ts             # Web Audio chime (no mp3 asset needed)
│   └── components/
│       ├── TitleBar.tsx         # drag region, pin/widget/settings/close
│       ├── PomodoroTimer.tsx    # timer + progress ring + mascot
│       ├── AvocadoMascot.tsx    # the mood-changing SVG mascot
│       ├── ChecklistPanel.tsx   # overall progress + import UI + phase list
│       ├── PhaseCard.tsx / WeekCard.tsx / TaskRow.tsx
│       ├── StatsBar.tsx         # weekly focused-minutes + tasks-done
│       └── SettingsPanel.tsx    # vault path, log filename, toggles
└── src-tauri/
    ├── src/main.rs               # append_obsidian_log, obsidian_needs_date_heading
    ├── Cargo.toml
    ├── tauri.conf.json           # frameless 380x560 window
    └── capabilities/default.json # dialog/notification/window permissions
```

## Notes on a few design decisions

- **Why Zustand + localStorage instead of the Tauri store plugin?**
  Simpler, and localStorage in the Tauri webview already persists across app restarts — no extra plugin needed for this scale of data.
- **Why does Obsidian writing happen in Rust, not a JS fs plugin?**
  Your vault can be anywhere on disk, outside any app-sandboxed scope. The Rust commands (`main.rs`) use `std::fs` directly — no fs plugin is installed at all — so writes aren't restricted to a fixed scope. That's the correct approach for "write to an arbitrary user-chosen folder" and it's one less dependency to build on Ubuntu.
- **Why no bundled sound file?** `src/lib/sound.ts` synthesizes a two-tone chime with the Web Audio API — no binary asset to track, easy to retune.
- **Widget mode** resizes the same window rather than opening a second one — simpler state management, still gives you the "just a timer" floating feel.

## Next steps you might want

- A tray icon (via `tauri-plugin-tray`) so closing the window doesn't fully quit the app.
- Multiple named checklists (e.g. swap between study plans) — the store already separates `plan` cleanly, so this is mostly a UI change plus keying `plan` by an id.
- Weekly Obsidian summary (e.g. append a "Week X wrap-up" block every Sunday) — you already have `pomodoroLogs`/`completionLogs` with timestamps to build that from.
