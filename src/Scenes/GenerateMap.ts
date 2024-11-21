import Phaser from "phaser";
import * as noise from "perlin.js";  // Assuming you're using the perlin.js library

export class GenMapScene extends Phaser.Scene {
    private seed: number;
    private sampleScale: number;
    private level: number[][];  // 2D array of tile indexes
    private layer: Phaser.Tilemaps.TilemapLayer | null = null;  // Allowing for null

    constructor() {
        super("GenMapScene");
    }

    preload() {
        this.load.path = "./assets/";
        this.load.image("smb_tiles", "mapPack_tilesheet.png");  // Tileset image

        // Generate a random seed for the map
        this.seed = Math.random();
        this.sampleScale = 10;
        noise.seed(this.seed);
    }

    create() {
        this.generateMap();
    }

    generateMap() {
        const rowSize = 50;  // Number of tiles in a row
        const colSize = 50;  // Number of tiles in a column

        const level: number[][] = [];

        for (let y = 0; y < colSize; y++) {
            const row: number[] = [];
            for (let x = 0; x < rowSize; x++) {
                const noiseValue = noise.simplex2(x / this.sampleScale, y / this.sampleScale);

                let tile: number;
                if (noiseValue > 0.5) {
                    tile = 0;
                } else if (noiseValue > 0) {
                    tile = 1;
                } else {
                    tile = 2;
                }

                row.push(tile);
            }
            level.push(row);
        }

        // Create the tilemap from the level data
        const map = this.make.tilemap({
            data: level,
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

    update() {
    }
}
