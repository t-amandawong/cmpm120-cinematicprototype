class NonInteractive extends Phaser.Scene {
   constructor() {
      super("noninteractive");
   }

   preload() {
      this.load.path = "./assets/";
      this.load.image("one", "images/Numeral1.png");
      this.load.image("seven", "images/Numeral7.png");
      this.load.image("teamname", "images/TeamName.png");
      this.load.audio("impact", "sounds/GroundImpact.wav");
      this.load.audio("jingle", "sounds/jingle.mp3");
   }

   create() {
      let w = this.game.config.width;
      let h = this.game.config.height;

      let scaleFactor = 1920 / 120;
      let one = this.add.image(0.5 * w, 0.5 * h, "one").setOrigin(0.5).setScale(scaleFactor * 0.5);
      let seven = this.add.image(0.5 * w, 0.5 * h, "seven").setOrigin(0.5).setScale(scaleFactor * 0.5);
      let team = this.add.image(0.5 * w, 0.5 * h, "teamname").setOrigin(0.5).setScale(scaleFactor * 0.5);
      let impactSound = this.sound.add("impact");
      let jingle = this.sound.add("jingle").setVolume(0.4);

      let teamNameAppear = this.tweens.add({
         targets: team,
         alpha: {start: 0, to: 1},
         duration: 800,
         onComplete: () => {
            one.postFX.addShine(1);
            seven.postFX.addShine(1);
            team.postFX.addShine(1);
            jingle.play();
            this.time.delayedCall(600, () => this.cameras.main.fadeOut(1000, 0, 0, 0, (c, t) => {
               // TODO: add interactive cinematic scene and transition to that
               if (t >= 1) console.log("Fadeout complete");
            }));
         },
         paused: true
      });

      let sevenDrop = this.tweens.add({
         targets: seven,
         y: {start: -0.5 * h, to: 0.5 * h},
         duration: 800,
         onComplete: () => {
            impactSound.play();
            this.time.delayedCall(50, () => teamNameAppear.play());
         },
         paused: true
      });

      let oneDrop = this.tweens.add({
         targets: one,
         y: {start: -0.5 * h, to: 0.5 * h},
         duration: 800,
         onComplete: () => {
            impactSound.play();
            this.time.delayedCall(50, () => sevenDrop.play());
         },
         paused: true
      });

      let instruction = this.add.text(0.5 * w, 0.5 * h, "Sounds will not play until the player interacts with the game canvas, so please tap when you are ready to begin.")
         .setOrigin(0.5)
         .setFontSize(32)
         .setWordWrapWidth(800)
         .setColor("#ffffff");

      this.input.on("pointerdown", () => {
         instruction.setAlpha(0);
         oneDrop.play();
      });
   }

   update() {

   }
}
