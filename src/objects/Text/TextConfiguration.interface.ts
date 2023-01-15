import { Types, Events } from 'phaser';

type SRTTextConfiguration = Types.GameObjects.Text.TextConfig & {
  x: number;
  y: number;
  text: string;
  style: Types.GameObjects.Text.TextStyle;
  origin?: number;
  visible?: boolean;
  eventEmitter?: Events.EventEmitter;
};

export default SRTTextConfiguration;
