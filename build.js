import { ensureDir, copy } from "https://deno.land/std@0.157.0/fs/mod.ts";

const OUTPUT_DIR = "./dist";
const ASSETS_DIR = "./assets";
const STATIC_FILES = ["./index.html"]; // Add other static files if needed.

await ensureDir(OUTPUT_DIR);

// Copy static files (e.g. index.html)
for (const file of STATIC_FILES) {
  const destPath = `${OUTPUT_DIR}/${file.split("/").pop()}`;
  await copy(file, destPath, { overwrite: true }).catch(() =>
    console.warn(`File not found: ${file}`),
  );
}

// Copy assets folder into `dist/assets/`
await copy(ASSETS_DIR, `${OUTPUT_DIR}/assets`, { overwrite: true }).catch(() =>
  console.warn(`Assets folder not found!`),
);

console.log("Assets and static files copied successfully.");
