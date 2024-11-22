import { GameObjects, Scene } from "phaser";
import { changePlantable, getPlantable } from "./GenerateMap.ts";
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
  increaseGrowth(growth: number) {
    return this.growthLevel + growth;
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
