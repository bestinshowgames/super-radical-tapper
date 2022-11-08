import Phaser from 'phaser';

export default class Cue extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  x: number;
  y: number;
  radius: number;
  text?: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    radius: number,
    text?: string
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.text = text;

    const circle = this.scene.add.circle(x, y, radius, 0xff43c2);
    this.scene.add.existing(circle);
  }
}
