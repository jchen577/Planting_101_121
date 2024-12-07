import Phaser from "phaser";
import * as noise from "perlin.js"; // Assuming you're using the perlin.js library
import { loadGameConfig } from "./YAMLInterpreter.js";

// Define the level array
let seed;
const sampleScale = 10;
let layer = null;
export const level = [];

// Initialize noise seed
noise.seed(Math.random());

export function generateMap(scene) {
  let rowSize = 50;
  let colSize = 50;

  // Load configuration from YAML
  const gameConfig = loadGameConfig();
  if (gameConfig) {
    rowSize = gameConfig.tutorial.grid_size[0];
    colSize = gameConfig.tutorial.grid_size[1];
  }

  for (let y = 0; y < colSize; y++) {
    const row = [];
    for (let x = 0; x < rowSize; x++) {
      const noiseValue = noise.simplex2(x / sampleScale, y / sampleScale);

      let tileNumber;
      let canPlant;
      const moisture = Math.floor(Math.random() * 5);

      if (noiseValue > 0.5) {
        tileNumber = 18;
        canPlant = true;
      } else if (noiseValue > 0) {
        tileNumber = 23;
        canPlant = true;
      } else {
        tileNumber = 86;
        canPlant = false;
      }

      row.push({
        tileNumber,
        canPlant,
        sunLevel: 0,
        waterLevel: 0,
      });
    }
    level.push(row);
  }

  // Create the tilemap
  const map = scene.make.tilemap({
    data: level.map((row) => row.map((tile) => tile.tileNumber)),
    tileWidth: 64,
    tileHeight: 64,
  });

  const tileset = map.addTilesetImage("smb_tiles", "smb_tiles");

  if (tileset) {
    layer = map.createLayer(0, tileset, 0, 0);
  } else {
    console.error("Tileset is null, map generation failed.");
  }
}

export function getLevel() {
  return level;
}

export function getPlantable(tileX, tileY) {
  return level[tileY][tileX].canPlant;
}

export function changePlantable(tileX, tileY, tf) {
  level[tileY][tileX].canPlant = tf;
}

export function getPlayerTileAttributes(player) {
  const tileSize = 64;
  const playerX = player.x;
  const playerY = player.y;

  const tileX = Math.floor(playerX / tileSize);
  const tileY = Math.floor(playerY / tileSize);

  if (level[tileY] && level[tileY][tileX]) {
    return [tileY, tileX];
  }
  return null;
}

export function updateMapVisuals() {
  if (layer) {
    const tileData = getLevel().map((row) =>
      row.map((tile) => tile.tileNumber),
    );
    layer.putTilesAt(tileData, 0, 0);
  }
}
