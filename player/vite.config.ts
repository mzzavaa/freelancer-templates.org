import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: path.resolve(__dirname, "../static/player"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // Deduplicate React - player and compositions must use the same instance
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      remotion: path.resolve(__dirname, "node_modules/remotion"),
      // Templates live at the repo root, not inside player/
      "@templates": path.resolve(__dirname, "../src/remotion/templates"),
    },
  },
});
