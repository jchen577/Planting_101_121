import Phaser from "phaser";

export class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu");
    this.selectedLang = "lang_en";
  }

  create() {
    const title = this.add
      .text(this.cameras.main.centerX, 100, "Seedy Place in Outer Space", {
        font: "48px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    const playButton = this.add
      .text(this.cameras.main.centerX, 200, "Play", {
        font: "32px Arial",
        fill: "#ffffff",
        backgroundColor: "#0000ff",
        padding: 10,
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        console.log(`Starting game in ${this.selectedLang}`);
        this.scene.start("GameScene", { selectedLang: this.selectedLang });
      });

    const settingsButton = this.add
      .text(this.cameras.main.centerX, 300, "Settings", {
        font: "32px Arial",
        fill: "#ffffff",
        backgroundColor: "#ff0000",
        padding: 10,
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.openSettingsMenu());
  }

  openSettingsMenu() {
    const bg = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.5,
    );

    const settingsMenu = this.add.container(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
    );

    const menuBg = this.add.rectangle(0, 0, 400, 300, 0xffffff).setOrigin(0.5);
    settingsMenu.add(menuBg);

    const menuTitle = this.add
      .text(0, -100, "Select Language", { font: "24px Arial", fill: "#000000" })
      .setOrigin(0.5);
    settingsMenu.add(menuTitle);

    const languages = [
      { name: "English", file: "lang_en" },
      { name: "Japanese", file: "lang_jp" },
      { name: "Arabic", file: "lang_ar" },
    ];

    languages.forEach((lang, index) => {
      const langButton = this.add
        .text(0, -50 + index * 50, lang.name, {
          font: "20px Arial",
          fill: "#000000",
          backgroundColor: "#dddddd",
          padding: 10,
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => {
          settingsMenu.destroy();
          bg.destroy();
          this.selectedLang = lang.file;
          console.log(`Language selected: ${this.selectedLang}`);
        });
      settingsMenu.add(langButton);
    });
  }
}
