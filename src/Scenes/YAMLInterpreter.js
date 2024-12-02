import YAML from 'js-yaml';
import GameConfig from './GameSettings.yaml?raw';

export function YAMLtoJSObj() {
    const parsedContent = YAML.load(GameConfig);
    return parsedContent;
}