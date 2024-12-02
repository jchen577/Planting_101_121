import YAML from 'js-yaml';
import fs from "node:fs";

export function YAMLtoJSON(file) {
    let parsedContent;
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file: ' + err);
            return;
        }
        parsedContent = YAML.parse(data);
    });
    if (!parsedContent) {return};
    return JSON.stringify(parsedContent);
}