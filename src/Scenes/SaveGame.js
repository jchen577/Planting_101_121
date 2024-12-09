import { getLevel } from "./GenerateMap.js";

/**
 * Saves the current game state into a JSON file.
 * @param {Object} scene The current instance of the game scene.
 */
export function saveGameState(scene) {
  const state = {
    player: {
      x: scene.player.x,
      y: scene.player.y,
    },
    inventory: scene.inventory,
    plants: scene.plants.map((plant) => ({
      plantType: plant.constructor.name,
      growthLevel: plant.growthLevel,
      tileX: plant.position[0],
      tileY: plant.position[1],
    })),
    level: getLevel().map((row) =>
      row.map((tile) => ({
        tileNumber: tile.tileNumber,
        canPlant: tile.canPlant,
        sunLevel: tile.sunLevel,
        waterLevel: tile.waterLevel,
      })),
    ),
    undoStack: scene.undoStack,
    redoStack: scene.redoStack,
  };

  const jsonState = JSON.stringify(state, null, 2);

  const blob = new Blob([jsonState], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "game_state.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
