import Phaser from "phaser";
import config from "./config";
import scenes from "./scenes";

new Phaser.Game(
  Object.assign(config, {
    scene: [scenes.Game],
  })
);
