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
  maxGrowth = 3;
  moistureRequired = 2;
  sunRequired = 3;

  constructor() {
    super();
  }

  getGrowth() {
    return this.growthLevel;
  }

  setGrownImage(imgNum: number) {
    this.fullGrownImage = imgNum;
  }

  setGrowthNumber(growthLvl: number) {
    this.maxGrowth = growthLvl;
  }

  setReqMoisture(moisture: number) {
    this.moistureRequired = moisture;
  }

  setReqSun(sun: number) {
    this.sunRequired = sun;
  }

  increaseGrowth(
    growth: number,
    tile: Tile,
    scene: Phaser.Scene,
    plants: Plant[],
  ) {
    if (
      tile.sunLevel >= this.sunRequired &&
      tile.waterLevel >= this.moistureRequired
    ) {
      this.growthLevel++;
    }

    // Check if the plant is fully grown
    if (this.growthLevel == this.maxGrowth) {
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
    plants.splice(plants.indexOf(this), 1, this);

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
    plants.splice(plants.indexOf(this), 1, this);
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

export class PlantBuilder {
  private plant: Plant;

  constructor(plant: Plant) {
    this.plant = plant;
  }

  setGrowthLevel(level: number) {
    this.plant.setGrowthNumber(level);
    return this;
  }

  setMoistureRequired(moisture: number) {
    this.plant.setReqMoisture(moisture);
    return this;
  }

  setSunRequired(sun: number) {
    this.plant.setReqSun(sun);
    return this;
  }

  setGrownImage(image: number) {
    this.plant.setGrownImage(image);
    return this;
  }

  build() {
    return this.plant;
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
