import Phaser from 'phaser';
import GameManager, { CueCreationConfig, GamePhase } from '../GameManager';
import { Cue } from '../objects';

const cues: { [key: string]: Cue } = {};

export default class Game extends Phaser.Scene {
  gm: GameManager;
  constructor() {
    super('Game');
    this.gm = new GameManager();
  }

  timeInPhase = 0;
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

    this.gm.cueConfigurations.forEach(
      (cueConfig: CueCreationConfig) =>
        (cues[cueConfig.id] = new Cue(this, cueConfig))
    );
  }

  // TODO: LET UPDATE JUST DECIDE WHAT 'PHASE' WE'RE IN.
  update(_time: number, delta: number) {
    this.timeInPhase += delta;
    const phaseDuration = this.gm.phaseDuration(this.gm.currentGamePhase);
    if (this.timeInPhase >= phaseDuration) {
      const newPhase = this.gm.nextPhase();
      console.log('FLIPPING PHASES TO ', newPhase);
      this.gm.currentGamePhase = newPhase;
      if (newPhase === GamePhase.PRESENTATION) {
        this.resetCues();
        this.highlightedCue = cues[this.gm.selectCue()];
        this.highlightedCue.highlight();
      } else if (newPhase === GamePhase.WAIT) {
        this.resetCues();
      }
      this.timeInPhase = 0;
    }
  }

  resetCues() {
    Object.keys(cues).forEach((cueId) => cues[cueId].rest());
  }

  processInput(event: any) {
    const key: number = event.keyCode;
    if (this.gm.currentGamePhase === GamePhase.RESPONSE_COLLECTION) {
      console.log(key);
    }
  }
}
