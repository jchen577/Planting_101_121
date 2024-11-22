import Phaser from "phaser";
import { generateMap, getPlayerTileAttributes } from "./GenerateMap.ts";

export class GameScene extends Phaser.Scene {
	private player!: Phaser.Physics.Arcade.Sprite;
	private forward!: Phaser.Input.Keyboard.Key;
	private backward!: Phaser.Input.Keyboard.Key;
	private left!: Phaser.Input.Keyboard.Key;
	private right!: Phaser.Input.Keyboard.Key;

	constructor() {
		super({ key: "GameScene" });
	}

	create() {
		generateMap(this);
		// Add player sprite with physics
		this.player = this.physics.add.sprite(320, 320, "player"); // Adjust starting position if needed
		this.player.setCollideWorldBounds(true); // Prevent moving outside bounds

		// Set up camera to follow player
		this.cameras.main.startFollow(this.player);
		this.cameras.main.setFollowOffset(0, 0); // Camera directly follows the player

		this.forward = this.input!.keyboard!.addKey(
			Phaser.Input.Keyboard.KeyCodes.W
		);
		this.backward = this.input!.keyboard!.addKey(
			Phaser.Input.Keyboard.KeyCodes.S
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
	}

	advanceTurn() {
		// generate new sun and water values for every tile
		// (probably can just be new seed for sun)
		// grow plants depending on criteria
		// maybe add juice of a screen fade out and back in
		console.log("The button is working.");
	}

	override update() {
		// Movement speed (pixels per frame)
		const moveSpeed = 150;

		// Reset player velocity at the beginning of the update
		this.player.setVelocity(0);

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

		//getPlayerTileAttributes(this.player);
	}
}
