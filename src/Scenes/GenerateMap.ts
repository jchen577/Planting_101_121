import Phaser from "phaser";
import * as noise from "perlin.js"; // Assuming you're using the perlin.js library
import { Plant } from "./Plant.ts";

// Define the Tile interface with properties

export interface Tile {
	tileNumber: number;
	canPlant: boolean;
	sunLevel: number;
	waterLevel: number;
}

let seed: number;
const sampleScale = 10;
let layer: Phaser.Tilemaps.TilemapLayer | null = null;
export const level: Tile[][] = [];

noise.seed(Math.random());

export function generateMap(scene: Phaser.Scene): Tile[][] {
	const rowSize = 50;
	const colSize = 50;

	for (let y = 0; y < colSize; y++) {
		const row: Tile[] = [];
		for (let x = 0; x < rowSize; x++) {
			const noiseValue = noise.simplex2(x / sampleScale, y / sampleScale);

			let tileNumber: number;
			let canPlant: boolean;
			let moisture: number = Math.floor(Math.random() * 5);

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
			row.push({
				tileNumber,
				canPlant,
				sunLevel: 0,
				waterLevel: 0,
			});
		}
		level.push(row);
	}

	const map = scene.make.tilemap({
		data: level.map((row) => row.map((tile) => tile.tileNumber)),
		tileWidth: 64,
		tileHeight: 64,
	});

	const tileset = map.addTilesetImage("smb_tiles", "smb_tiles");

	if (tileset) {
		layer = map.createLayer(0, tileset, 0, 0);
	} else {
		console.error("Tileset is null, map generation failed.");
	}
}

export function getLevel(): Tile[][] {
	return level;
}

export function getPlantable(tileX: number, tileY: number) {
	return level[tileY][tileX].canPlant;
}

export function changePlantable(tileX: number, tileY: number, tf: boolean) {
	level[tileY][tileX].canPlant = tf;
}

export function getPlayerTileAttributes(player: Phaser.Physics.Arcade.Sprite) {
	const tileSize = 64;
	const playerX = player.x;
	const playerY = player.y;

	const tileX = Math.floor(playerX / tileSize);
	const tileY = Math.floor(playerY / tileSize);

	if (level[tileY] && level[tileY][tileX]) {
		return [tileY, tileX];
	}
}

export function updateMapVisuals(): void {
	if (layer) {
		const tileData = getLevel().map((row) =>
			row.map((tile) => tile.tileNumber)
		);
		layer.putTilesAt(tileData, 0, 0);
	}
}
