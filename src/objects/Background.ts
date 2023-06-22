import { Scene, GameObjects } from 'phaser';

export default class Background extends GameObjects.Image {
  constructor(scene: Scene) {
    super(
      scene,
      +scene.sys.game.config.width / 2,
      +scene.sys.game.config.height / 2,
      'background'
    );
    this.setScale(2, 2);
    this.setOrigin(0.5, 0.5);
  }
}
