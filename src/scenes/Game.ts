import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.add
      .text(400, 300, "Hello World!", {
        fontFamily: "Toriko",
        fontSize: "64px",
      })
      .setOrigin(0.5);
  }
}
