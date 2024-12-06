import Phaser from "phaser";
import { GameScene } from "./Scenes/Game.js";
import { LoadScene } from "./Scenes/Load.js";
import {MainMenu} from "./Scenes/MainMenu.js";

if ('serviceWorker' in navigator) {
	const baseURL = import.meta.env.BASE_URL;

  	navigator.serviceWorker
		.register(`${baseURL.endsWith('/') ? baseURL : baseURL + '/'}sw.js`)
		.then((registration) => {
		console.log('Service Worker registered with scope:', registration.scope);
		})
		.catch((error) => {
		console.error('Service Worker registration failed:', error);
		});
}

// Game configuration
const config = {
	parent: "phaser-game",
	type: Phaser.CANVAS,
	render: {
		pixelArt: true,
	},
	width: 640,
	height: 640,
	zoom: 2,
	input: {
		keyboard: true,
	},
	physics: {
		default: "arcade",
		arcade: {
			debug: true,
		},
	},
	scene: [LoadScene, MainMenu, GameScene],
};

// Create the Phaser game instance
const game = new Phaser.Game(config);

// Global variables
const centerX = Number(game.config.width) / 2;
const centerY = Number(game.config.height) / 2;
const w = Number(game.config.width);
const h = Number(game.config.height);
let cursors = null;

export { game, centerX, centerY, w, h, cursors }; 
