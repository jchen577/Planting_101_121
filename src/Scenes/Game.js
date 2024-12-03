import Phaser from "phaser";
import { saveGameState } from "./SaveGame";
import { loadGameState } from "./LoadGame";
import { addState, loadState } from "./Undo";
import { AutoSaveManager } from "./AutoSaveManager";

import { generateMap, getPlayerTileAttributes, level } from "./GenerateMap";
import { generateTileAttributes } from "./TileGeneration";
import { Plant, redShroom, snowTree, cactus, PlantBuilder } from "./Plant";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.player = null;
    this.forward = null;
    this.backward = null;
    this.left = null;
    this.right = null;
    this.plant = null;
    this.level = [];
    this.plants = [];
    this.levelInfo = null;
    this.autoSaveManager = null;
    this.undoStack = [];
    this.redoStack = [];
    this.inventory = {
      redShroom: 0,
      cactus: 0,
      snowTree: 0,
    };
    this.inventoryText = null;
    this.langData;
  }

  create() {
    this.langData = this.cache.json.get(`lang_en`);

    this.level = generateMap(this);

    this.player = this.physics.add.sprite(320, 320, "player");
    this.player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setFollowOffset(0, 0);

    this.forward = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.backward = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S,
    );
    this.plant = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    const mapWidth = 50 * 64;
    const mapHeight = 50 * 64;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    const turnButton = this.add.text(10, 10, this.langData.timeMessage, {
      color: "#0f0",
      backgroundColor: "black",
    });
    turnButton.setInteractive();
    turnButton
      .on("pointerdown", () => {
        this.advanceTurn();
        addState(this, this.undoStack);
        this.redoStack = [];
      })
      .setScrollFactor(0);

    this.levelInfo = this.add
      .text(10, 30, `${this.langData.sun}: 0, ${this.langData.water}: 0`, {
        font: "14px Arial",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0);

    this.inventoryText = this.add
      .text(10, 60, `${this.langData.inventory}:`, {
        font: "14px Arial",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0);

    const saveButton = this.add.text(10, 570, this.langData.save, {
      color: "#0f0",
      backgroundColor: "black",
    });
    saveButton.setInteractive();
    saveButton
      .on("pointerdown", () => {
        saveGameState(this);
      })
      .setScrollFactor(0);

    const loadButton = this.add.text(10, 600, this.langData.load, {
      color: "#0f0",
      backgroundColor: "black",
    });
    loadButton.setInteractive().on("pointerdown", () => loadGameState(this));
    loadButton.setScrollFactor(0);

    const undoButton = this.add.text(10, 510, this.langData.undo, {
      color: "#0f0",
      backgroundColor: "black",
    });
    undoButton.setInteractive();
    undoButton
      .on("pointerdown", () => {
        const state = this.undoStack.pop();
        if (state) {
          this.redoStack.push(state);
          loadState(this, state);
        }
      })
      .setScrollFactor(0);

    const redoButton = this.add.text(10, 540, this.langData.redo, {
      color: "#0f0",
      backgroundColor: "black",
    });
    redoButton.setInteractive();
    redoButton
      .on("pointerdown", () => {
        const state = this.redoStack.pop();
        if (state) {
          this.undoStack.push(state);
          loadState(this, state);
        }
      })
      .setScrollFactor(0);

    this.autoSaveManager = new AutoSaveManager(this);
    this.autoSaveManager.startAutoSave();

    const autoSave = localStorage.getItem("auto-save");
    if (autoSave) {
      const userWantsToContinue = confirm(
        "Do you want to continue where you left off?",
      );
      if (userWantsToContinue) {
        loadGameState(this, "auto-save");
      }
    }
  }

  updateInventoryUI() {
    let inventoryDisplay = `${this.langData.inventory}:\n`;
    for (const [plant, count] of Object.entries(this.inventory)) {
      inventoryDisplay += `${this.langData[plant]}: ${count}\n`;
    }
    this.inventoryText.setText(inventoryDisplay);
    addState(this, this.undoStack);
    this.redoStack = [];
  }

  advanceTurn() {
    generateTileAttributes(level);
    for (const plant of this.plants) {
      const plantPos = getPlayerTileAttributes(plant.plantObject) || [
        null,
        null,
      ];
      if (plantPos[0] !== null && plantPos[1] !== null) {
        const tile = level[plantPos[0]][plantPos[1]];
        plant.increaseGrowth(1, tile, this, this.plants);
      }
    }
    console.log("The button is working.");
  }

  winConditionCheck() {
    return (
      Object.values(this.inventory).reduce((sum, value) => sum + value, 0) >= 10
    );
  }

  update() {
    const moveSpeed = 150;

    this.player.setVelocity(0);

    if (Phaser.Input.Keyboard.JustDown(this.plant)) {
      const randomPlant = Math.floor(Math.random() * 3);
      let newPlant = null;

      if (randomPlant === 0) {
        newPlant = new redShroom(115);
        new PlantBuilder(newPlant)
          .setGrowthLevel(3)
          .setMoistureRequired(2)
          .setSunRequired(2)
          .setGrownImage(115);
      } else if (randomPlant === 1) {
        newPlant = new cactus(38);
        new PlantBuilder(newPlant)
          .setGrowthLevel(4)
          .setMoistureRequired(2)
          .setSunRequired(4)
          .setGrownImage(38);
      } else {
        newPlant = new snowTree(123);
        new PlantBuilder(newPlant)
          .setGrowthLevel(5)
          .setMoistureRequired(4)
          .setSunRequired(2)
          .setGrownImage(123);
      }

      const currPos = getPlayerTileAttributes(this.player);
      const plantHolder = newPlant.plant(this, currPos[1], currPos[0]);

      if (plantHolder != null) {
        this.plants.push(plantHolder);
        addState(this, this.undoStack);
        this.redoStack = [];
      }
    }

    const [tileY, tileX] = getPlayerTileAttributes(this.player) || [null, null];
    if (tileX !== null && tileY !== null) {
      const tile = level[tileY][tileX];
      if (tile) {
        this.levelInfo.setText(
          `Sun: ${tile.sunLevel}, Water: ${tile.waterLevel}`,
        );
      }
    }

    if (this.winConditionCheck()) {
      this.add
        .text(320, 320, this.langData.win, { color: "#ff0000" })
        .setScrollFactor(0);
    }

    if (this.left.isDown) {
      this.player.setVelocityX(-moveSpeed);
    } else if (this.right.isDown) {
      this.player.setVelocityX(moveSpeed);
    }

    if (this.forward.isDown) {
      this.player.setVelocityY(-moveSpeed);
    } else if (this.backward.isDown) {
      this.player.setVelocityY(moveSpeed);
    }
  }
}
