import { Scene } from 'phaser';
import Text from '../Text/Text';
import ResponseTextConfiguration from './ResponseTextConfiguration.interface';

export default class ResponseText extends Text {
  constructor(scene: Scene, config: ResponseTextConfiguration) {
    super(scene, config);

    config.eventEmitter.addListener(config.respondOn, () => {
      this.setVisible(true);
    });

    config.eventEmitter.addListener('reset', () => {
      this.setVisible(false);
    });
  }
}
