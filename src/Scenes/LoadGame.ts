import { getLevel } from "./GenerateMap";
import { GameScene } from "./GameScene";
import { updateMapVisuals } from "./GenerateMap";
import { redShroom, cactus, snowTree, Plant } from "./Plant"; // Import Plant

/**
 * Loads the game state from a JSON file.
 * @param scene The current instance of the game scene.
 */
export async function loadGameState(scene: GameScene): Promise<void> {
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
    scene.plants.forEach((plant: Plant) => plant.deletePlant(scene.plants));
    // scene.plants = [];
    //console.log(scene.plants);
    //console.log(state.plants);
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

    // Update plant visuals
    // Plant.updatePlantVisuals(scene, scene.plants);

    console.log("Game state loaded!");
  };

  input.click();
}
