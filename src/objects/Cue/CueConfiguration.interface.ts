import { Events } from 'phaser';

export type HEX = `#${string}`;

export default interface CueConfiguration {
  id: string;
  x: number;
  y: number;
  radius: number;
  baseColor?: HEX;
  highlightColor?: HEX;
  successColor?: HEX;
  failureColor?: HEX;
  text?: string;
  eventEmitter: Events.EventEmitter;
}
