import { Types } from 'phaser';

type HUDContainerConfiguration = Types.GameObjects.GameObjectConfig & {
  x: number;
  y: number;
  titleText: string;
  initialValueText: string;
  style: Types.GameObjects.Text.TextStyle;
};

export default HUDContainerConfiguration;
