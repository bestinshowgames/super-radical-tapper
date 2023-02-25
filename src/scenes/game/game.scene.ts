import { Scene, GameObjects } from 'phaser';
import GameController from './game.controller';
import CueContainer from './cue.container';
import InputMediator, { InputEvents } from './input.mediator';
import PhaseController, { GamePhase } from './phase.controller';
import CueGenerator from './cue.generator';

export default class Game extends Scene {
  private resultText!: GameObjects.Text;
  private scoreText!: GameObjects.Text;
  private cueContainer!: CueContainer;
  private gm!: GameController;

  constructor() {
    super('Game');
  }

  preload() {}

  create() {
    this.gm = new GameController(
      this,
      new PhaseController(this),
      new CueGenerator(),
      new CueContainer(this)
    );

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

    this.events.on('succeed', () => {
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
}
