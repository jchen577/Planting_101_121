import { getLevel, updateMapVisuals } from "./GenerateMap";
import { redShroom, cactus, snowTree } from "./Plant";

/**
 * Adds the current game state to the undo stack.
 * @param {Object} scene - The current instance of the game scene.
 * @param {Array} undoStack - The undo stack to which the state will be added.
 */
export function addState(scene, undoStack) {
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
      }))
    ),
  };
  undoStack.push(state);
}

/**
 * Loads a saved game state.
 * @param {Object} scene - The current instance of the game scene.
 * @param {Object} state - The state to load.
 */
export function loadState(scene, state) {
  // Restore player position
  scene.player.setPosition(state.player.x, state.player.y);

  // Restore inventory
  scene.inventory = state.inventory;

  // Reset and restore plants
  scene.plants.forEach((plant) => {
    plant.deletePlant(scene.plants);
  });

  state.plants.forEach((plantData) => {
    const { plantType, tileX, tileY, growthLevel } = plantData;
    let plant = null;

    if (plantType === "redShroom") {
      plant = new redShroom(115);
    } else if (plantType === "cactus") {
      plant = new cactus(38);
    } else if (plantType === "snowTree") {
      plant = new snowTree(123);
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
            planted.harvestPlant(getLevel()[tileX][tileY], scene, scene.plants);
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

  // Update map visuals
  updateMapVisuals();
}
