import { Scene, GameObjects } from 'phaser';
import GameController, { GamePhase } from './game.controller';
import CueContainer from './cue.container';

export default class Game extends Scene {
  private resultText!: GameObjects.Text;
  private scoreText!: GameObjects.Text;
  private cueContainer!: CueContainer;
  private gm!: GameController;

  private timeInPhase: number = 0;

  constructor() {
    super('Game');
  }

  init() {
    this.gm = new GameController(this.events, ['LL', 'L', 'R', 'RR']);
  }

  preload() {}

  create() {
    this.add
      .text(400, 50, 'Super Radical Tapper!', { font: '64px Toriko' })
      .setOrigin(0.5);

    this.resultText = this.add
      .text(400, 150, '', { font: '64px Toriko' })
      .setOrigin(0.5);

    // Score Text with Label
    this.add.text(100, 100, 'Score:', { font: '64px Toriko' }).setOrigin(0.5);

    this.scoreText = this.add
      .text(100, 150, '0', { font: '64px Toriko' })
      .setOrigin(0.5);

    this.cueContainer = new CueContainer(this);

    this.input.keyboard.on('keydown', this.processInput, this);
    this.events.on('succeed', () => {
      this.gm.incrementScore();
      this.scoreText.setText(this.gm.score.toString());
      this.resultText.setText('SCORE!');
    });

    this.events.on('fail', () => {
      this.resultText.setText('OUCH!');
    });

    this.events.on('reset', () => {
      this.resultText.setText('');
    });
  }

  update(_time: number, delta: number) {
    this.timeInPhase += delta;
    this.timeInPhase = this.gm.handlePhaseUpdate(this.timeInPhase);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processInput(event: any) {
    const key: number = event.keyCode;
    if (this.gm.currentGamePhase === GamePhase.RESPONSE_COLLECTION) {
      const cueId: string | undefined = this.cueContainer.cueForKey(key);
      if (cueId) {
        cueId == this.cueContainer.highlightedCueKey
          ? this.events.emit('succeed')
          : this.events.emit('fail');
      }
      this.gm.currentGamePhase = this.gm.nextPhase();
      this.timeInPhase = 0;
    } else {
      // TODO: Add handling for non-gameplay keys, e.g. pause
    }
  }
}
