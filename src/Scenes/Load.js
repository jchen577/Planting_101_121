import Phaser from "phaser";

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoadScene" });

    // Initial game state
    this.gameState = {
      player: { x: 0, y: 0 }, // Player's initial position
      inventory: [], // Initial inventory
      time: new Date().toISOString(), // Save timestamp
    };
  }

  // Autosave game state to local storage
  autosaveData() {
    this.gameState.time = new Date().toISOString(); // Update save time
    localStorage.setItem("gameState", JSON.stringify(this.gameState));
    console.log("Game state autosaved:", this.gameState);
  }

  // Save game state as a downloadable JSON file
  saveAsJSON() {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(this.gameState));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "gameState.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    console.log("Game state downloaded as JSON");
  }

  // Load game state from local storage
  loadGameState() {
    const savedState = localStorage.getItem("gameState");
    if (savedState) {
      this.gameState = JSON.parse(savedState);
      console.log("Game state loaded from local storage:", this.gameState);
    } else {
      console.log("No saved game state found in local storage.");
    }
  }

  // Update game state (e.g., during gameplay)
  updateGameState(newX, newY, newInventory) {
    this.gameState.player.x = newX;
    this.gameState.player.y = newY;
    this.gameState.inventory = newInventory;
    console.log("Game state updated:", this.gameState);
  }

  preload() {
    // Set asset path and preload assets
    this.load.path = "./seedy_place_in_outer_space/assets/";

    //Load Language
    this.load.json("lang_en", "lang_eng.json");

    // Load assets
    this.load.image("smb_tiles", "tilemap.png");
    this.load.spritesheet("all_tiles", "tilemap.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("player", "player.png");

    // Create a loading bar
    const loadingBar = this.add.graphics();
    loadingBar.fillStyle(0x0000ff, 1);
    this.load.on("progress", (value) => {
      loadingBar.clear();
      loadingBar.fillRect(320, 240, 200 * value, 20);
    });

    this.add
      .text(320, 200, "Loading...", { font: "24px Arial", color: "#ffffff" })
      .setOrigin(0.5);

    // Load game state from local storage
    this.loadGameState();

    // Set up autosave to run every 5 minutes
    setInterval(() => {
      this.autosaveData();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  create() {
    // Create a tilemap
    const map = this.make.tilemap({
      tileWidth: 64,
      tileHeight: 64,
      width: 10, // Number of tiles horizontally
      height: 10, // Number of tiles vertically
    });

    // Add the tileset to the map
    const tileset = map.addTilesetImage("smb_tiles"); // Match key from preload
    const layer = map.createBlankLayer("Ground", tileset);

    // Fill the layer with a default tile
    layer.fill(0); // Replace 0 with the index of your default tile

    console.log("Map and layer created successfully!");

    // Add a manual save button
    this.add
      .text(10, 10, "Save Game", { font: "18px Arial", color: "#00ff00" })
      .setInteractive()
      .on("pointerdown", () => {
        this.saveAsJSON();
      });

    // Add a manual load button
    this.add
      .text(10, 40, "Load Game", { font: "18px Arial", color: "#00ff00" })
      .setInteractive()
      .on("pointerdown", () => {
        this.loadGameState();
      });

    // Start the next scene
    this.scene.start("GameScene");
  }
}
