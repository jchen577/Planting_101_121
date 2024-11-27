import Phaser, { Game, GameObjects } from "phaser";
import { saveGameState } from "./SaveGame";
import { loadGameState } from "./LoadGame";
import { AutoSaveManager } from "./AutoSaveManager";

import {
  generateMap,
  getPlayerTileAttributes,
  level,
  Tile,
} from "./GenerateMap.ts";
import { generateTileAttributes } from "./TileGeneration.ts";
import { Plant, redShroom, snowTree, cactus } from "./Plant.ts";

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private forward!: Phaser.Input.Keyboard.Key;
  private backward!: Phaser.Input.Keyboard.Key;
  private left!: Phaser.Input.Keyboard.Key;
  private right!: Phaser.Input.Keyboard.Key;
  private plant!: Phaser.Input.Keyboard.Key;
  private level: Tile[][] = [];
  private plants: Plant[] = [];
  private levelInfo!: Phaser.GameObjects.Text;
  private autoSaveManager!: AutoSaveManager;

  private inventory: { [key: string]: number } = {
    redShroom: 0,
    cactus: 0,
    snowTree: 0,
  };

  private inventoryText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    this.level = generateMap(this);
    // Add player sprite with physics
    this.player = this.physics.add.sprite(320, 320, "player"); // Adjust starting position if needed
    this.player.setCollideWorldBounds(true); // Prevent moving outside bounds

    // Set up camera to follow player
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setFollowOffset(0, 0); // Camera directly follows the player

    this.forward = this.input!.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.W,
    );
    this.backward = this.input!.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.S,
    );
    this.plant = this.input!.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.left = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.right = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    const mapWidth = 50 * 64;
    const mapHeight = 50 * 64;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    const turnButton = this.add.text(10, 10, "Advance Time", {
      color: "#0f0",
      backgroundColor: "black",
    });
    turnButton.setInteractive();
    turnButton
      .on("pointerdown", () => {
        this.advanceTurn();
      })
      .setScrollFactor(0);

    // add text to display sun and water level
    this.levelInfo = this.add
      .text(10, 30, "Sun: 0, Water: 0", {
        font: "14px Arial",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0);

    // Initialize inventory UI
    this.inventoryText = this.add
      .text(10, 60, "Inventory:", {
        font: "14px Arial",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0);

    //temp save and load buttons
    const saveButton = this.add.text(10, 570, "Save Game", {
      color: "#0f0",
      backgroundColor: "black",
    });
    saveButton.setInteractive();
    saveButton
      .on("pointerdown", () => {
        saveGameState(this);
      })
      .setScrollFactor(0);

    const loadButton = this.add.text(10, 600, "Load Game", {
      color: "#0f0",
      backgroundColor: "black",
    });
    loadButton.setInteractive().on("pointerdown", () => loadGameState(this));
    loadButton.setScrollFactor(0);

    // Initialize AutoSaveManager and start autosave
    this.autoSaveManager = new AutoSaveManager(this);
    this.autoSaveManager.startAutoSave(); // Autosave every 5 mins

    // Check for auto-save and prompt the user
    const autoSave = localStorage.getItem("auto-save");
    if (autoSave) {
      const userWantsToContinue = confirm("Do you want to continue where you left off?");
      if (userWantsToContinue) {
        loadGameState(this, "auto-save");
      }
    }
  }

  updateInventoryUI() {
    let inventoryDisplay = "Inventory:\n";
    for (const [plant, count] of Object.entries(this.inventory)) {
      inventoryDisplay += `${plant}: ${count}\n`;
    }
    this.inventoryText.setText(inventoryDisplay);
  }

  advanceTurn() {
    // grow plants depending on criteria
    // generate new sun and water values for every tile
    generateTileAttributes(level);
    for (const plant of this.plants) {
      const plantPos = getPlayerTileAttributes(plant.plantObject) || [
        null,
        null,
      ];
      if (plantPos[0] !== null && plantPos[1] !== null) {
        const tile = level[plantPos[0]][plantPos[1]];
        plant.increaseGrowth(1, tile, this, this.plants); // Pass tile attributes to the plant
      }
    }
    // maybe add juice of a screen fade out and back in
    console.log("The button is working.");
  }

  winConditionCheck(): boolean {
    return (
      Object.values(this.inventory).reduce((sum, value) => sum + value, 0) >= 10
    );
  }

  override update() {
    // Movement speed (pixels per frame)
    const moveSpeed = 150;

    // Reset player velocity at the beginning of the update
    this.player.setVelocity(0);

    if (Phaser.Input.Keyboard.JustDown(this.plant)) {
      const randomPlant = Math.floor(Math.random() * 3);
      let newPlant: Plant = new Plant();
      if (randomPlant == 0) {
        newPlant = new redShroom(115);
      } else if (randomPlant == 1) {
        newPlant = new cactus(38);
      } else {
        newPlant = new snowTree(123);
      }
      const currPos = getPlayerTileAttributes(this.player);
      const plantHolder = newPlant.plant(this, currPos[1], currPos[0]);
      if (plantHolder != null) {
        this.plants.push(plantHolder);
      }
    }
    // Get the current tile attributes based on the player's position
    const [tileY, tileX] = getPlayerTileAttributes(this.player) || [null, null];
    if (tileX !== null && tileY !== null) {
      const tile = level[tileY][tileX];
      if (tile) {
        // Update the UI with the current tile's attributes
        this.levelInfo.setText(
          `Sun: ${tile.sunLevel}, Water: ${tile.waterLevel}`,
        );
      }
    }

    if (this.winConditionCheck() == true) {
      const victoryText = this.add
        .text(320, 320, "Space Conquered!", {
          color: "#ff0000",
        })
        .setScrollFactor(0);
    }

    // Moving left (A key)
    if (this.left.isDown) {
      this.player.setVelocityX(-moveSpeed); // Move left
    }
    // Moving right (D key)
    else if (this.right.isDown) {
      this.player.setVelocityX(moveSpeed); // Move right
    }

    // Moving up (W key)
    if (this.forward.isDown) {
      this.player.setVelocityY(-moveSpeed); // Move up
    }
    // Moving down (S key)
    else if (this.backward.isDown) {
      this.player.setVelocityY(moveSpeed); // Move down
    }

    this.updateInventoryUI();
  }
}
