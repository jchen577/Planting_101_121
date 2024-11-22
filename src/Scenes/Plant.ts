import { GameObjects, Scene } from "phaser";
import { changePlantable, getPlantable } from "./GenerateMap.ts";
import { Tile } from "./TileGeneration.ts";
import { GameScene } from "./GameScene.ts"; // Ensure this import is added

export class Plant extends Phaser.Scene {
  growthLevel: number = 0;
  fullGrownImage = 0;
  sprout = 59;
  plantObject: GameObjects.Sprite;

  constructor() {
    super();
  }

  getGrowth() {
    return this.growthLevel;
  }

  increaseGrowth(growth: number, tile: Tile) {
    if (tile.sunLevel >= 3 && tile.waterLevel >= 2) {
      this.growthLevel++;
    }

    // Check if the plant is fully grown
    if (this.growthLevel === 3) {
      this.growPlant();

      // Add interactivity for harvesting
      this.plantObject.setInteractive();
      this.plantObject.on('pointerdown', () => {
        this.harvestPlant(tile);
      });
    }
  } 
  
  harvestPlant(tile: Tile) {
    // Remove the plant object
    this.plantObject.destroy();

    // Ensure the scene is cast to GameScene
    const gameScene = this.scene as GameScene;

    // Update the inventory
    const plantType = this.constructor.name; // Get the class name
    if (!gameScene.inventory[plantType]) {
        gameScene.inventory[plantType] = 0;
    }
    gameScene.inventory[plantType]++;

    // Reset the tile to be plantable again
    changePlantable(tile.x, tile.y, true);

    // Update the inventory UI in the scene
    gameScene.updateInventoryUI();
  }


  plant(scene: Scene, posX: number, posY: number) {
    if (getPlantable(posX, posY)) {
      this.plantObject = scene.physics.add.sprite(
        posX * 64 + 32,
        posY * 64 + 32,
        "all_tiles",
        this.sprout,
      );
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
