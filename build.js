import { ensureDir, copy } from "https://deno.land/std@0.157.0/fs/mod.ts";
//import YAML from "https://cdn.skypack.dev/js-yaml";
import { join } from "https://deno.land/std@0.203.0/path/mod.ts";

const OUTPUT_DIR = "./dist/seedy_place_in_outer_space"; // Ensure it includes the correct folder
//const YAML_FILE = "./src/Scenes/GameSettings.yaml"; // Path to your YAML file
const JSON_OUTPUT = `${OUTPUT_DIR}/assets/GameSettings.json`; // Path for JSON output
const MANIFEST_SOURCE = "./public/manifest.json"; // Path to source manifest.json
const MANIFEST_OUTPUT = `${OUTPUT_DIR}/manifest.json`; // Where the manifest will end up
const ASSETS_SOURCE = "./public/assets"; // Where your static assets are stored
const HTML_SOURCE = "./index.html"; // Path to your index.html file
const SERVICE_WORKER_SOURCE = "./public/serviceWorker.js"; // Path to your service worker file

// Step 1: Ensure necessary directories exist
await ensureDir(`${OUTPUT_DIR}/assets`); // Ensure the assets directory exists
await ensureDir(OUTPUT_DIR); // Ensure the output directory itself exists

// Step 2: Parse YAML and write it to JSON
/*try {
  const yamlContent = await Deno.readTextFile(YAML_FILE);
  const parsedYAML = YAML.load(yamlContent); // Parse YAML to object
  await Deno.writeTextFile(JSON_OUTPUT, JSON.stringify(parsedYAML, null, 2)); // Write to JSON
  console.log(`YAML successfully converted to JSON --> ${JSON_OUTPUT}`);
} catch (error) {
  console.error("Failed to process YAML:", error.message);
}*/

// Step 3: Copy or generate manifest.json
try {
  const manifestExists = await Deno.stat(MANIFEST_SOURCE)
    .then(() => true)
    .catch(() => false);
  if (manifestExists) {
    await copy(MANIFEST_SOURCE, MANIFEST_OUTPUT, { overwrite: true });
    console.log(`manifest.json successfully copied --> ${MANIFEST_OUTPUT}`);
  } else {
    const manifest = {
      name: "Seedy Place in Outer Space",
      short_name: "Seedy Place",
      icons: [
        {
          src: "/seedy_place_in_outer_space/assets/icon-192.png",
          type: "image/png",
          sizes: "192x192",
        },
        {
          src: "/seedy_place_in_outer_space/assets/icon-512.png",
          type: "image/png",
          sizes: "512x512",
        },
      ],
      start_url: "/seedy_place_in_outer_space/",
      display: "standalone",
      background_color: "#000000",
      theme_color: "#000000",
    };
    await Deno.writeTextFile(
      MANIFEST_OUTPUT,
      JSON.stringify(manifest, null, 2),
    );
    console.log(`manifest.json successfully generated --> ${MANIFEST_OUTPUT}`);
  }
} catch (error) {
  console.error("Failed to process manifest.json:", error.message);
}

// Step 4: Copy static assets to the dist directory
try {
  await ensureDir(`${OUTPUT_DIR}/assets`); // Ensure the assets directory exists

  // Copy assets from the source folder to the output folder
  await copy(ASSETS_SOURCE, `${OUTPUT_DIR}/assets`, { overwrite: true });
  console.log(`Assets successfully copied to --> ${OUTPUT_DIR}/assets`);
} catch (error) {
  console.error("Failed to copy assets:", error.message);
}

// Step 5: Copy index.html to the output directory
try {
  await Deno.copyFile(HTML_SOURCE, `${OUTPUT_DIR}/index.html`); // Copy index.html to the output
  console.log(`index.html successfully copied to --> ${OUTPUT_DIR}/index.html`);
} catch (error) {
  console.error("Failed to copy index.html:", error.message);
}

// Step 6: Copy serviceWorker.js to the output directory
try {
  await Deno.copyFile(SERVICE_WORKER_SOURCE, `${OUTPUT_DIR}/serviceWorker.js`); // Copy serviceWorker.js
  console.log(
    `serviceWorker.js successfully copied to --> ${OUTPUT_DIR}/serviceWorker.js`,
  );
} catch (error) {
  console.error("Failed to copy serviceWorker.js:", error.message);
}
