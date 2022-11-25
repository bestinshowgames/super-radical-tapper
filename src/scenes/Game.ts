import Phaser from 'phaser';
import GameManager, { CueCreationConfig, GamePhase } from '../GameManager';
import { Cue, CueStatus } from '../objects';

const cues: { [key: string]: Cue } = {};

export default class Game extends Phaser.Scene {
  failText: Phaser.GameObjects.Text | undefined = undefined;
  successText: Phaser.GameObjects.Text | undefined = undefined;
  gm: GameManager;
  timeInPhase = 0;
  highlightedCue: Cue | null = null;
  constructor() {
    super('Game');
    this.gm = new GameManager();
  }

  create() {
    this.input.keyboard.createCursorKeys();
    this.add
      .text(400, 50, 'Super Radical Tapper', { font: '64px Toriko' })
      .setOrigin(0.5);

    this.failText = this.add
      .text(400, 150, 'OUCH!', { font: '64px Toriko' })
      .setOrigin(0.5)
      .setVisible(false);

    this.successText = this.add
      .text(400, 150, 'SCORE!', { font: '64px Toriko' })
      .setOrigin(0.5)
      .setVisible(false);

    this.input.keyboard.on('keydown', this.processInput, this);

    this.gm.cueConfigurations.forEach(
      (cueConfig: CueCreationConfig) =>
        (cues[cueConfig.id] = new Cue(this, cueConfig))
    );
  }

  update(_time: number, delta: number) {
    this.timeInPhase += delta;
    const phaseDuration = this.gm.phaseDuration(this.gm.currentGamePhase);
    if (this.gm.currentGamePhase === GamePhase.DISPLAY_RESULTS) {
      const responseStatus = this.highlightedCue?.status;
      const didSucceed = responseStatus === CueStatus.SUCCEED;
      if (!didSucceed) {
        this.failText?.setVisible(true);
        this.highlightedCue?.fail();
      } else {
        this.successText?.setVisible(true);
      }
    }

    if (this.timeInPhase >= phaseDuration) {
      const newPhase = this.gm.nextPhase();
      this.gm.currentGamePhase = newPhase;
      if (newPhase === GamePhase.PRESENTATION) {
        this.resetCues();
        this.highlightedCue = cues[this.gm.selectCue()];
        this.highlightedCue.highlight();
      } else if (newPhase === GamePhase.WAIT) {
        this.resetResultTexts();
        this.resetCues();
      }
      this.timeInPhase = 0;
    }
  }

  resetCues() {
    Object.keys(cues).forEach((cueId) => cues[cueId].rest());
  }

  resetResultTexts() {
    this.failText?.setVisible(false);
    this.successText?.setVisible(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processInput(event: any) {
    const key: number = event.keyCode;
    if (this.gm.currentGamePhase === GamePhase.RESPONSE_COLLECTION) {
      const cueId: string | undefined = this.gm.cueForKey(key);
      if (cueId && cueId == this.highlightedCue?.id) {
        this.highlightedCue?.succeed();
      } else {
        this.highlightedCue?.fail();
      }
      this.gm.currentGamePhase = this.gm.nextPhase();
      this.timeInPhase = 0;
    } else {
      // TODO: Add handling for non-gameplay keys, e.g. pause
    }
  }
}
