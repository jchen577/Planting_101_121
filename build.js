import { ensureDir, copy } from "https://deno.land/std@0.157.0/fs/mod.ts";

const OUTPUT_DIR = "./dist"; // The output directory for the built project
const ASSETS_DIR = "./assets"; // Location of your assets folder
const STATIC_FILES = ["./index.html", "./serviceWorker.js"]; // Other static files to copy

// Ensure the `dist/` folder exists
await ensureDir(OUTPUT_DIR);

// Copy static files (e.g., index.html, serviceWorker.js)
for (const file of STATIC_FILES) {
  const destPath = `${OUTPUT_DIR}/${file.split("/").pop()}`;
  await copy(file, destPath, { overwrite: true }).catch(() =>
    console.warn(`Warning: File '${file}' not found.`),
  );
}

// Copy the `assets` folder into the `dist/` folder
await copy(ASSETS_DIR, `${OUTPUT_DIR}/assets`, { overwrite: true }).catch(() =>
  console.warn("Warning: Assets folder not found."),
);

console.log("All files have been copied to the dist/ directory successfully.");
