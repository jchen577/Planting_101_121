import Phaser, { Game, GameObjects } from "phaser";

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
    turnButton.on("pointerdown", () => {
      this.advanceTurn();
    });

    // add text to display sun and water level 
    this.levelInfo = this.add.text(10, 30, "Sun: 0, Water: 0", {
      font: "14px Arial",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
    });
  }

  advanceTurn() {
    // grow plants depending on criteria
    // generate new sun and water values for every tile
    generateTileAttributes(level);
    for (const plant of this.plants) {
      const plantPos = getPlayerTileAttributes(plant.plantObject) || [null, null];
      if (plantPos[0] !== null && plantPos[1] !== null) {
        const tile = level[plantPos[0]][plantPos[1]];
        plant.increaseGrowth(1, tile); // Pass tile attributes to the plant
      }
    }
    // maybe add juice of a screen fade out and back in
    console.log("The button is working.");
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
        newPlant = new cactus(123);
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
        this.levelInfo.setText(`Sun: ${tile.sunLevel}, Water: ${tile.waterLevel}`);
      }
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
  }
}
