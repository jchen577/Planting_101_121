import { ensureDir, copy } from "https://deno.land/std@0.157.0/fs/mod.ts";

const OUTPUT_DIR = "./dist"; // Directory to gather all output
const STATIC_FILES = ["./index.html"]; // Files to copy directly to `dist/`
const ASSETS_DIR = "./assets"; // Directory containing game assets (images, audio, etc.)

// Ensure the output directory exists
await ensureDir(OUTPUT_DIR);

// Copy static files (e.g., index.html)
for (const file of STATIC_FILES) {
  const destPath = `${OUTPUT_DIR}/${file.split("/").pop()}`;
  await copy(file, destPath, { overwrite: true }).catch(() =>
    console.warn(`Skipping missing file: ${file}`),
  );
}

// Copy assets folder into `dist/assets`
await copy(ASSETS_DIR, `${OUTPUT_DIR}/assets`, { overwrite: true }).catch(() =>
  console.warn(`Assets folder not found: ${ASSETS_DIR}`),
);

console.log("Static files and assets copied to dist/");
