import { GameObjects, Scene } from "phaser";
import { changePlantable, getPlantable } from "./GenerateMap.ts";
import { plants } from "./Game.ts";
import { Tile } from "./TileGeneration.ts";

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
    }
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
