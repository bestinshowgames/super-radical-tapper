import Phaser from 'phaser';
import GameManager, { CueCreationConfig } from '../GameManager';
import { Cue } from '../objects';

const cues: Cue[] = [];

export default class Game extends Phaser.Scene {
  gm: GameManager;
  constructor() {
    super('Game');
    this.gm = new GameManager();
  }

  timeSinceLastSequenceFlip: number = 0;
  highlightedCue: Cue | null = null;

  create() {
    this.input.keyboard.createCursorKeys();
    this.add
      .text(400, 50, 'Super Radical Tapper', {
        fontFamily: 'Toriko',
        fontSize: '64px'
      })
      .setOrigin(0.5);

    this.input.keyboard.on('keydown', this.processInput, this);

    this.gm.cueConfigurations.forEach((cueConfig: CueCreationConfig) =>
      cues.push(new Cue(this, cueConfig))
    );
  }

  // TODO: LET UPDATE JUST DECIDE WHAT 'PHASE' WE'RE IN.
  update(_time: number, delta: number) {
    this.timeSinceLastSequenceFlip += delta;
    if (this.timeSinceLastSequenceFlip > 500) {
      cues.forEach((cue) => cue.rest());
      this.highlightedCue = cues[Math.floor(Math.random() * cues.length)];
      this.highlightedCue.highlight();
      this.timeSinceLastSequenceFlip = 0;
    }
  }
  processInput(event: any) {
    const key: number = event.keyCode;
    console.log(key);
  }
}
