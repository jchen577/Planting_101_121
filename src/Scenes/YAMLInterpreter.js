import { readTextFile } from "https://deno.land/std/fs/mod.ts";
import YAML from "npm:js-yaml";

// Function to dynamically load and parse a YAML file
export async function loadGameConfig() {
  const filePath = "./src/Scenes/GameSettings.yaml"; // Replace with the correct path
  const yamlContent = await readTextFile(filePath); // Read YAML as text
  const parsedConfig = YAML.load(yamlContent); // Parse YAML to JavaScript object
  return parsedConfig;
}
