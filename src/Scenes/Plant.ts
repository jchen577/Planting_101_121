import { GameObjects, Scene } from "phaser";
import { changePlantable, getPlantable } from "./GenerateMap.ts";
import { Tile } from "./TileGeneration.ts";
import { GameScene } from "./GameScene.ts"; // Ensure this import is added

export class Plant extends Phaser.Scene {
  growthLevel: number = 0;
  fullGrownImage = 0;
  sprout = 59;
  plantObject: GameObjects.Sprite;
  position: number[] = [];

  constructor() {
    super();
  }

  // static updatePlantVisuals(scene: GameScene, plants: Plant[]): void {
  // 	plants.forEach((plant) => {
  // 	  if (!plant.plantObject) {
  // 		const tileX = Math.floor(plant.plantObject?.x / 64) || 0;
  // 		const tileY = Math.floor(plant.plantObject?.y / 64) || 0;

  // 		const planted = plant.plant(scene, tileX, tileY);
  // 		if (planted) {
  // 		  // Restore growth level and visuals
  // 		  planted.growthLevel = plant.growthLevel;
  // 		  if (plant.growthLevel === 3) {
  // 			planted.growPlant();
  // 		  }
  // 		}
  // 	  }
  // 	});
  //   }

  getGrowth() {
    return this.growthLevel;
  }

  increaseGrowth(
    growth: number,
    tile: Tile,
    scene: Phaser.Scene,
    plants: Plant[],
  ) {
    if (tile.sunLevel >= 3 && tile.waterLevel >= 2) {
      this.growthLevel++;
    }

    // Check if the plant is fully grown
    if (this.growthLevel === 3) {
      this.growPlant();

      // Add interactivity for harvesting
      this.plantObject.setInteractive();
      this.plantObject.once("pointerdown", () => {
        this.plantObject.active = false;
        this.harvestPlant(tile, scene, plants);
      });
    }
  }

  harvestPlant(tile: Tile, scene: Phaser.Scene, plants: Plant[]) {
    // Remove the plant object
    plants.splice(plants.indexOf(this));

    this.plantObject.destroy();

    // Ensure the scene is cast to GameScene

    // Update the inventory
    const plantType = this.constructor.name; // Get the class name
    if (!scene.inventory[plantType]) {
      scene.inventory[plantType] = 0;
    }
    scene.inventory[plantType]++;

    // Reset the tile to be plantable again
    changePlantable(
      (this.plantObject.x - 32) / 64,
      (this.plantObject.y - 32) / 64,
      true,
    );

    // Update the inventory UI in the scene
    scene.updateInventoryUI();
  }

  deletePlant(plants: Plant[]) {
    plants.splice(plants.indexOf(this));
    this.plantObject.destroy();
    changePlantable(
      (this.plantObject.x - 32) / 64,
      (this.plantObject.y - 32) / 64,
      true,
    );
  }

  plant(scene: Scene, posX: number, posY: number) {
    if (getPlantable(posX, posY)) {
      this.plantObject = scene.physics.add.sprite(
        posX * 64 + 32,
        posY * 64 + 32,
        "all_tiles",
        this.sprout,
      );
      this.position = [posX, posY];
      changePlantable(posX, posY, false);
      return this;
    } else {
      return null;
    }
  }
  growPlant() {
    this.plantObject.setTexture("all_tiles", this.fullGrownImage);
  }
}

export class redShroom extends Plant {
  constructor(imageNum: number) {
    super();
    this.fullGrownImage = imageNum;
  }
}

export class cactus extends Plant {
  constructor(imageNum: number) {
    super();
    this.fullGrownImage = imageNum;
  }
}

export class snowTree extends Plant {
  constructor(imageNum: number) {
    super();
    this.fullGrownImage = imageNum;
  }
}
