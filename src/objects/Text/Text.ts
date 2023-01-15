import { GameObjects, Scene } from 'phaser';
import SRTTextConfiguration from './TextConfiguration.interface';

export default class Text extends GameObjects.Text {
  constructor(scene: Scene, options: SRTTextConfiguration) {
    super(scene, options.x, options.y, options.text, options.style);

    this.setOrigin(options.origin ?? 0.5);
    this.setVisible(options.visible ?? true);
  }
}
