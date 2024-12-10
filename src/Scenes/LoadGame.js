import { getLevel } from "./GenerateMap.js";
import { updateMapVisuals } from "./GenerateMap.js";
import { redShroom, cactus, snowTree } from "./Plant.js"; // Import Plant classes

/**
 * Loads the game state from a JSON file.
 * @param {Object} scene The current instance of the game scene.
 */
export async function loadGameState(scene) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    const jsonText = await file.text();
    const state = JSON.parse(jsonText);

    // Restore player position
    scene.player.setPosition(state.player.x, state.player.y);

    // Restore inventory
    scene.inventory = state.inventory;

    // Reset and restore plants
    const totalNumPlants = scene.plants.length;
    for (let i = 0; i < totalNumPlants; i++) {
      scene.plants[0].deletePlant(scene.plants);
    }
    state.plants.forEach((plantData) => {
      const { plantType, tileX, tileY, growthLevel } = plantData;

      let plant = null;
      if (plantType === "redShroom") {
        plant = new redShroom(115, "redShroom"); // Provide correct sprite index
      } else if (plantType === "cactus") {
        plant = new cactus(38, "cactus"); // Provide correct sprite index
      } else if (plantType === "snowTree") {
        plant = new snowTree(123, "snowTree"); // Provide correct sprite index
      }

      if (plant) {
        const planted = plant.plant(scene, tileX, tileY);
        if (planted) {
          planted.growthLevel = growthLevel;

          // Update texture if fully grown
          if (growthLevel >= 3) {
            planted.growPlant();
            planted.plantObject.setInteractive();
            planted.plantObject.once("pointerdown", () => {
              planted.harvestPlant(
                getLevel()[tileX][tileY],
                scene,
                scene.plants,
              );
            });
          }

          scene.plants.push(planted);
        }
      }
    });

    // Restore level data
    const level = getLevel();
    state.level.forEach((row, y) => {
      row.forEach((tile, x) => {
        level[y][x] = {
          tileNumber: tile.tileNumber,
          canPlant: tile.canPlant,
          sunLevel: tile.sunLevel,
          waterLevel: tile.waterLevel,
        };
      });
    });

    // Restore undo and redo stacks
    scene.undoStack = state.undoStack;
    scene.redoStack = state.redoStack;

    // Update map visuals
    updateMapVisuals();

    console.log("Game state loaded!");
  };

  input.click();
}
