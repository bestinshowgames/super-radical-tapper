import { GameObjects, Scene } from 'phaser';
import HUDContainerConfiguration from './HUDContainerConfiguration.interface';
import { Text } from '../Text';

interface HUDUpdatable {
  update(text: string): void;
}

export default class HUDContainer
  extends GameObjects.Container
  implements HUDUpdatable
{
  private updatableValue: Text;
  constructor(scene: Scene, configuration: HUDContainerConfiguration) {
    super(scene, configuration.x, configuration.y);

    this.add(
      new Text(scene, {
        x: 0,
        y: 0,
        text: configuration.titleText,
        style: configuration.style,
      })
    );

    this.updatableValue = new Text(scene, {
      x: 0,
      y: 86,
      text: configuration.initialValueText,
      style: configuration.style,
    });

    this.add(this.updatableValue);
  }

  update(text: string): void {
    this.updatableValue.setText(text);
  }
}
