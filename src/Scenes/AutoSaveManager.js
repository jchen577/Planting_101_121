import { saveGameState } from "./SaveGame";

export class AutoSaveManager {
  constructor(scene) {
    this.scene = scene;
    this.intervalId = null;
  }

  /**
   * Starts the auto-save system with a specified interval 
   * @param {number} interval The interval in milliseconds for auto-saving every 2 mins
   */
  startAutoSave(interval = 300000) {
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

  // Stop the auto-save system
  stopAutoSave() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Auto-save system stopped.");
    } else {
      console.warn("Auto-save system is not running.");
    }
  }

  // Display an auto-save notification on the screen.
  showSaveIndicator() {
    const saveIndicator = document.getElementById("save-indicator");
    if (saveIndicator) {
      saveIndicator.style.display = "block";
      setTimeout(() => {
        saveIndicator.style.display = "none";
      }, 2000); // Display for 2 seconds
    }
  }
}
