import Phaser from "phaser";

export default class Cue extends Phaser.GameObjects.Container {
  scene: any;
  x: number;
  y: number;
  radius: number;
  constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.radius = radius;

    const circle = this.scene.add.circle(x, y, radius, 0xff43c2);
    this.scene.add.existing(circle);
  }
}
