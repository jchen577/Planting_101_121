import { ensureDir } from "https://deno.land/std/fs/mod.ts";

const STATIC_DIR = "./public"; // Replace with the folder containing static files, e.g., "assets" or "public"
const OUTPUT_DIR = "./dist"; // This should match the `path: "./dist"` in your workflow

await ensureDir(OUTPUT_DIR); // Ensure the dist directory exists

// Copy each file in the static directory to the output directory
for await (const entry of Deno.readDir(STATIC_DIR)) {
  const srcPath = `${STATIC_DIR}/${entry.name}`;
  const destPath = `${OUTPUT_DIR}/${entry.name}`;
  if (entry.isFile) {
    await Deno.copyFile(srcPath, destPath);
    console.log(`Copied ${entry.name} to ${OUTPUT_DIR}`);
  }
}
