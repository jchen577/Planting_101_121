import { getLevel } from "./GenerateMap";
import { Plant } from "./Plant";
import { GameScene } from "./GameScene";

/**
 * Saves the current game state into a JSON file.
 * @param scene The current instance of the game scene.
 */
export function saveGameState(scene: GameScene): void {
    const state = {
        player: {
            x: scene.player.x,
            y: scene.player.y,
        },
        inventory: scene.inventory,
        plants: scene.plants.map((plant) => ({
            growthLevel: plant.growthLevel,
            tileX: Math.floor(plant.plantObject.x / 64),
            tileY: Math.floor(plant.plantObject.y / 64),
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

    const jsonState = JSON.stringify(state, null, 2);

    const blob = new Blob([jsonState], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "game_state.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
