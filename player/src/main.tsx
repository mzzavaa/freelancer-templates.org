import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// Resolve staticFile() calls relative to the player's own URL.
// Assets are copied into the same directory as index.html by Vite's publicDir.
(window as Window & { remotion_staticBase?: string }).remotion_staticBase = "";

const root = document.getElementById("root")!;
createRoot(root).render(<App />);
