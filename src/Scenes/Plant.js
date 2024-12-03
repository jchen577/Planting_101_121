import { GameObjects, Scene } from "phaser";
import { changePlantable, getPlantable } from "./GenerateMap.js";

export class Plant extends Scene {
  constructor() {
    super();
    this.growthLevel = 0;
    this.fullGrownImage = 0;
    this.sprout = 59;
    this.plantObject = null;
    this.position = [];
    this.maxGrowth = 3;
    this.moistureRequired = 2;
    this.sunRequired = 3;
  }

  getGrowth() {
    return this.growthLevel;
  }

  setGrownImage(imgNum) {
    this.fullGrownImage = imgNum;
  }

  setGrowthNumber(growthLvl) {
    this.maxGrowth = growthLvl;
  }

  setReqMoisture(moisture) {
    this.moistureRequired = moisture;
  }

  setReqSun(sun) {
    this.sunRequired = sun;
  }

  increaseGrowth(growth, tile, scene, plants) {
    if (
      tile.sunLevel >= this.sunRequired &&
      tile.waterLevel >= this.moistureRequired
    ) {
      this.growthLevel++;
    }

    if (this.growthLevel === this.maxGrowth) {
      this.growPlant();

      // Add interactivity for harvesting
      this.plantObject.setInteractive();
      this.plantObject.once("pointerdown", () => {
        this.plantObject.active = false;
        this.harvestPlant(tile, scene, plants);
      });
    }
  }

  harvestPlant(tile, scene, plants) {
    plants.splice(plants.indexOf(this), 1);

    this.plantObject.destroy();

    const plantType = this.constructor.name;
    if (!scene.inventory[plantType]) {
      scene.inventory[plantType] = 0;
    }
    scene.inventory[plantType]++;

    changePlantable(
      (this.plantObject.x - 32) / 64,
      (this.plantObject.y - 32) / 64,
      true
    );

    scene.updateInventoryUI();
  }

  deletePlant(plants) {
    plants.splice(plants.indexOf(this), 1);
    this.plantObject.destroy();
    changePlantable(
      (this.plantObject.x - 32) / 64,
      (this.plantObject.y - 32) / 64,
      true
    );
  }

  plant(scene, posX, posY) {
    if (getPlantable(posX, posY)) {
      this.plantObject = scene.physics.add.sprite(
        posX * 64 + 32,
        posY * 64 + 32,
        "all_tiles",
        this.sprout
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
  constructor(plant) {
    this.plant = plant;
  }

  setGrowthLevel(level) {
    this.plant.setGrowthNumber(level);
    return this;
  }

  setMoistureRequired(moisture) {
    this.plant.setReqMoisture(moisture);
    return this;
  }

  setSunRequired(sun) {
    this.plant.setReqSun(sun);
    return this;
  }

  setGrownImage(image) {
    this.plant.setGrownImage(image);
    return this;
  }

  build() {
    return this.plant;
  }
}

export class redShroom extends Plant {
  constructor(imageNum) {
    super();
    this.fullGrownImage = imageNum;
  }
}

export class cactus extends Plant {
  constructor(imageNum) {
    super();
    this.fullGrownImage = imageNum;
  }
}

export class snowTree extends Plant {
  constructor(imageNum) {
    super();
    this.fullGrownImage = imageNum;
  }
}
