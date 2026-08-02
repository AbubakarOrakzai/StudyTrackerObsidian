import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tauri expects a fixed port and wants HMR to work through the webview.
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // Don't watch the Rust project, Tauri's own dev server handles that.
      ignored: ["**/src-tauri/**"],
    },
  },
});
