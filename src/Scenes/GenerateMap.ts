import Phaser from "phaser";
import * as noise from "perlin.js"; // Assuming you're using the perlin.js library

// Define the Tile interface with properties
interface Tile {
	tileNumber: number;
	canPlant: boolean;
	growthStage: number;
}

export class GenMapScene extends Phaser.Scene {
	private seed!: number;
	private sampleScale!: number;
	private layer: Phaser.Tilemaps.TilemapLayer | null = null;
	private level: Tile[][] = []; // Declare level here so it's accessible outside generateMap

	// Temporary character code//
	private player!: Phaser.Physics.Arcade.Sprite;
	private forward!: Phaser.Input.Keyboard.Key;
	private backward!: Phaser.Input.Keyboard.Key;
	private left!: Phaser.Input.Keyboard.Key;
	private right!: Phaser.Input.Keyboard.Key;

	constructor() {
		super("GenMapScene");
	}

	preload() {
		// this.seed = Math.random();
		this.sampleScale = 10;
		noise.seed(1);
	}

	create() {
		this.generateMap();
		// this.scene.start('GameScene');

		// Temporary character//
		this.player = this.physics.add.sprite(320, 320, "player");
		this.player.setCollideWorldBounds(true);

		this.cameras.main.startFollow(this.player);
		this.cameras.main.setFollowOffset(0, 0);

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
	}

	generateMap() {
		const rowSize = 50;
		const colSize = 50;

		for (let y = 0; y < colSize; y++) {
			const row: Tile[] = [];
			for (let x = 0; x < rowSize; x++) {
				const noiseValue = noise.simplex2(
					x / this.sampleScale,
					y / this.sampleScale
				);

				let tileNumber: number;
				let canPlant: boolean;
				let growthStage: number = 0;

				if (noiseValue > 0.5) {
					tileNumber = 18;
					canPlant = true;
				} else if (noiseValue > 0) {
					tileNumber = 23;
					canPlant = true;
				} else {
					tileNumber = 86;
					canPlant = false;
				}
				row.push({ tileNumber, canPlant, growthStage });
			}
			this.level.push(row);
		}

		const map = this.make.tilemap({
			data: this.level.map((row) => row.map((tile) => tile.tileNumber)),
			tileWidth: 64,
			tileHeight: 64,
		});

		const tileset = map.addTilesetImage("smb_tiles", "smb_tiles");

		if (tileset) {
			this.layer = map.createLayer(0, tileset, 0, 0);
		} else {
			console.error("Tileset is null, map generation failed.");
		}
	}

	override update() {
		const moveSpeed = 150;

		this.player.setVelocity(0);

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

		// Get the tile the player is standing on
		this.getPlayerTileAttributes();
	}

	getPlayerTileAttributes() {
		const tileSize = 64;
		const playerX = this.player.x;
		const playerY = this.player.y;

		const tileX = Math.floor(playerX / tileSize);
		const tileY = Math.floor(playerY / tileSize);

		if (this.level[tileY] && this.level[tileY][tileX]) {
			const tileData = this.level[tileY][tileX];
			console.log(`Tile at (${tileX}, ${tileY}):`, tileData);
		}
	}
}
