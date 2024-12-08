import YAML from "npm:js-yaml";
export async function loadGameSettings(filePath) {
  try {
    const yamlContent = await Deno.readTextFile(filePath); // Use Deno's built-in function
    return YAML.load(yamlContent); // Parse YAML into JavaScript object
  } catch (error) {
    console.error(`Failed to load YAML file '${filePath}':`, error);
    throw error;
  }
}
