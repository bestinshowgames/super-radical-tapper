import { Events } from 'phaser';

export type HEX = `#${string}`;

export default interface CueConfiguration {
  id: string;
  x: number;
  y: number;
  text?: string;
  key: number;
  eventEmitter: Events.EventEmitter;
}
