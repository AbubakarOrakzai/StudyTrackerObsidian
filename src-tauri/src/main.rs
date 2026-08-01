// Prevents an additional console window on Windows in release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::{self, OpenOptions};
use std::io::{Read, Write};
use std::path::PathBuf;

/// Appends raw text to <vault_path>/<log_file>, creating the file (and any
/// missing parent directories) if it doesn't exist yet.
#[tauri::command]
fn append_obsidian_log(vault_path: String, log_file: String, entry: String) -> Result<(), String> {
    let path: PathBuf = PathBuf::from(&vault_path).join(&log_file);

    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("Could not create folder: {e}"))?;
    }

    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&path)
        .map_err(|e| format!("Could not open '{}': {e}", path.display()))?;

    file.write_all(entry.as_bytes())
        .map_err(|e| format!("Could not write to '{}': {e}", path.display()))?;

    Ok(())
}

/// Checks whether the log file already ends with today's "### <date>"
/// heading, so we only insert a new heading once per day instead of once
/// per entry.
#[tauri::command]
fn obsidian_needs_date_heading(vault_path: String, log_file: String, date: String) -> Result<bool, String> {
    let path: PathBuf = PathBuf::from(&vault_path).join(&log_file);

    if !path.exists() {
        return Ok(true);
    }

    let mut contents = String::new();
    fs::File::open(&path)
        .map_err(|e| e.to_string())?
        .read_to_string(&mut contents)
        .map_err(|e| e.to_string())?;

    let heading = format!("### {date}");
    // "Needs a heading" if that heading doesn't appear anywhere yet.
    Ok(!contents.contains(&heading))
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            append_obsidian_log,
            obsidian_needs_date_heading
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
