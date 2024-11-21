import Phaser from "phaser";
import * as noise from "perlin.js";  // Assuming you're using the perlin.js library

// Define the Tile interface with properties
interface Tile {
    tileNumber: number;
    canPlant: boolean;
    growthStage: number;
}

export function generateMap(scene: Phaser.Scene): Phaser.Tilemaps.Tilemap | null {
    const rowSize = 50;
    const colSize = 50;

    const level: Tile[][] = [];

    for (let y = 0; y < colSize; y++) {
        const row: Tile[] = [];
        for (let x = 0; x < rowSize; x++) {
            const noiseValue = noise.simplex2(x / this.sampleScale, y / this.sampleScale);
            
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
        level.push(row);
    }

    const map = this.make.tilemap({
        data: level.map(row => row.map(tile => tile.tileNumber)),
        tileWidth: 64,
        tileHeight: 64
    });

    const tileset = map.addTilesetImage("smb_tiles", "smb_tiles");

    if (tileset) {
        this.layer = map.createLayer(0, tileset, 0, 0);
    } else {
        console.error("Tileset is null, map generation failed.");
    }
}