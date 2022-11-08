import Phaser from 'phaser';
import { Cue, CueOptions } from '../objects';

const cueConfigs: CueOptions[] = [
  {
    x: 160,
    y: 300,
    radius: 50,
    text: 'D'
  },
  {
    x: 320,
    y: 300,
    radius: 50,
    text: 'F'
  },
  {
    x: 480,
    y: 300,
    radius: 50,
    text: 'J'
  },
  {
    x: 640,
    y: 300,
    radius: 50,
    text: 'J'
  }
];

const cues: Cue[] = [];

export default class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  timeSinceLastSequenceFlip: number = 0;

  create() {
    this.add
      .text(400, 50, 'Super Radical Tapper', {
        fontFamily: 'Toriko',
        fontSize: '64px'
      })
      .setOrigin(0.5);

    cueConfigs.forEach((cueConfig) => cues.push(new Cue(this, cueConfig)));

    cues[Math.floor(Math.random() * cues.length)].highlight();
  }

  update(_time: number, delta: number) {
    this.timeSinceLastSequenceFlip += delta;
    if (this.timeSinceLastSequenceFlip > 500) {
      cues.forEach((cue) => cue.rest());
      cues[Math.floor(Math.random() * cues.length)].highlight();
      this.timeSinceLastSequenceFlip = 0;
    }
  }
}
