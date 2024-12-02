import { getLevel } from "./GenerateMap";
import { Plant } from "./Plant";
import { GameScene } from "./GameScene";
import { updateMapVisuals } from "./GenerateMap";
import { redShroom, cactus, snowTree, Plant } from "./Plant"; // Import Plant

/**
 * Saves the current game state into a JSON file.
 * @param scene The current instance of the game scene.
 */

export interface State {
  player: { x: any; y: any };
  inventory: any;
  plants: any;
  level: any;
}

export function addState(scene: GameScene, undoStack: State[]): void {
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
  };
  undoStack.push(state);
}

export function loadState(scene: GameScene, state: State) {
  // Restore player position
  scene.player.setPosition(state.player.x, state.player.y);

  // Restore inventory
  scene.inventory = state.inventory;
  // Reset and restore plants
  scene.plants.forEach((plant: Plant) => {
    plant.deletePlant(scene.plants);
  });
  state.plants.forEach((plantData: any) => {
    const { plantType, tileX, tileY, growthLevel } = plantData;
    let plant: Plant | null = null;
    if (plantType == "redShroom") {
      plant = new redShroom(115); // Provide correct sprite index
    } else if (plantType == "cactus") {
      plant = new cactus(38); // Provide correct sprite index
    } else if (plantType == "snowTree") {
      plant = new snowTree(123); // Provide correct sprite index
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
            planted.harvestPlant(level[tileX][tileY], scene, scene.plants);
          });
        }
        scene.plants.push(planted);
      }
    }
  });

  // Restore level data
  const level = getLevel();
  state.level.forEach((row: any[], y: number) => {
    row.forEach((tile: any, x: number) => {
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
