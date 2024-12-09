import Phaser from "phaser";

export class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu");
    this.selectedLang = "lang_en";
  }

  // preload() {
  //   // Load background and additional image assets
  //   this.load.image("background", "assets/galaxyBG.jpeg");
  //   this.load.image("earth", "assets/earthPixel.png"); // Replace with the path to your image
  // }

  create() {

   
    // Add the background image
    // this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "background")
    //   .setOrigin(0.5)
    //   .setDisplaySize(this.cameras.main.width, this.cameras.main.height * 2); // Scale to fit the screen

    // const earth = this.add.image(this.cameras.main.centerX - 200, 600, "earth") 
    //   .setOrigin(0.5);

    // earth.setScale(); 
    this.langData = this.cache.json.get(this.selectedLang);

    // Add the title
    this.title = this.add
      .text(this.cameras.main.centerX, 200, this.langData.title, {
        font: "48px Jaro",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Add tilt animation to the title
    this.tweens.add({
      targets: this.title,
      angle: { from: -1, to: 1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Add play button
    this.playButton = this.add
      .text(this.cameras.main.centerX, 310, this.langData.play, {
        font: "32px Jaro",
        fill: "#ffffff",
        backgroundColor: "#00C000",
        padding: { x: 55, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        console.log(`Starting game in ${this.selectedLang}`);
        this.scene.start("GameScene", { selectedLang: this.selectedLang });
      })
      .on("pointerover", () => {
        this.playButton.setStyle({ fill: "#039164", backgroundColor: "#cffcd0" });
      })
      .on("pointerout", () => {
        this.playButton.setStyle({ fill: "#ffffff", backgroundColor: "#00C000" });
      });

    // Add settings button
    this.settingsButton = this.add
      .text(this.cameras.main.centerX, 390, this.langData.settings, {
        font: "32px Jaro",
        fill: "#ffffff",
        backgroundColor: "#ffd21f",
        padding: { x: 12, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.openSettingsMenu())
      .on("pointerover", () => {
        this.settingsButton.setStyle({ fill: "#00bbff", backgroundColor: "#fffb91" });
      })
      .on("pointerout", () => {
        this.settingsButton.setStyle({ fill: "#ffffff", backgroundColor: "#ffd21f" });
      });
  }

  openSettingsMenu() {
    const bg = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.5
    );

    const settingsMenu = this.add.container(
      this.cameras.main.centerX,
      this.cameras.main.centerY
    );

    const menuBg = this.add.rectangle(0, 0, 400, 300, 0xffffff).setOrigin(0.5);
    settingsMenu.add(menuBg);

    const menuTitle = this.add
      .text(0, -100, this.langData.selectLanguage, {
        font: "24px Arial",
        fill: "#000000",
      })
      .setOrigin(0.5);
    settingsMenu.add(menuTitle);

    const languages = [
      { name: "English", file: "lang_en" },
      { name: "日本語", file: "lang_jp" },
      { name: "اللغة العربية", file: "lang_ar" },
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

          this.langData = this.cache.json.get(this.selectedLang);
          this.updateText();

          console.log(`Language selected: ${this.selectedLang}`);
        })
        .on("pointerover", () => {
          langButton.setStyle({ fill: "#ffffff", backgroundColor: "#666666" });
        })
        .on("pointerout", () => {
          langButton.setStyle({ fill: "#000000", backgroundColor: "#dddddd" });
        });
      settingsMenu.add(langButton);
    });
  }

  updateText() {
    this.title.setText(this.langData.title);
    this.playButton.setText(this.langData.play);
    this.settingsButton.setText(this.langData.settings);
  }
}
