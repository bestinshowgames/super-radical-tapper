import { GameObjects, Scene } from 'phaser';

export default class Title extends GameObjects.Text {
  constructor(scene: Scene) {
    super(scene, 384, 75, 'Super Radical Tapper!', { font: '40px Clarity' });
    this.setOrigin(0.5, 0.5);
    this.setStroke('black', 3);
  }
}
