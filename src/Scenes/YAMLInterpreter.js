import YAML from 'https://unpkg.com/js-yaml@4.1.0/dist/js-yaml.min.js';
export async function loadGameSettings(filePath) {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Could not find YAML file! status: ${response.status}`);
  }
  const yamlText = await response.text(); // Get the response text
  return YAML.load(yamlText); // Parse the YAML content
}
