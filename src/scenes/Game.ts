import Phaser from "phaser";
import { Cue } from "../objects";

export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.add
      .text(400, 50, "Super Radical Tapper", {
        fontFamily: "Toriko",
        fontSize: "64px",
      })
      .setOrigin(0.5);

    new Cue(this, 400, 300);
    // this.add.existing(cue1);
  }
}
