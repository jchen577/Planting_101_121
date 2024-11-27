import { saveGameState } from "./SaveGame";

export class AutoSaveManager {
  private scene: Phaser.Scene;
  private intervalId: number | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Starts the auto-save system with a specified interval 
   * @param interval The interval in milliseconds for auto-saving every 2 mins
   */
  startAutoSave(interval: number = 120000): void {
    if (this.intervalId !== null) {
      console.warn("Auto-save system is already running.");
      return;
    }

    this.intervalId = window.setInterval(() => {
      saveGameState(this.scene, true); // Auto-save with flag set to true
      this.showSaveIndicator();
    }, interval);

    console.log(
      "Auto-save system started. Saving every " + interval / 60000 + " minutes."
    );
  }

  // Stop autosave system 
  stopAutoSave(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Auto-save system stopped.");
    } else {
      console.warn("Auto-save system is not running.");
    }
  }

  // Display an auto-save notification on the screen.
  private showSaveIndicator(): void {
    const saveIndicator = document.getElementById("save-indicator");
    if (saveIndicator) {
      saveIndicator.style.display = "block";
      setTimeout(() => {
        saveIndicator.style.display = "none";
      }, 2000); // Display for 2 seconds
    }
  }
}
