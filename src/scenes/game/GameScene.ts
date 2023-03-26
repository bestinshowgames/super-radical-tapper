import { Scene, GameObjects } from 'phaser';
import eventsCenter from './EventsCenter';
import InputMediator from './InputMediator';
import GameController from './GameController';
import CueContainer from './CueContainer';
import PhaseController from './PhaseController';
import CueGenerator from './CueGenerator';
import CueFacet from './CueFacet';

export default class Game extends Scene {
  private resultText!: GameObjects.Text;
  private scoreText!: GameObjects.Text;
  private streakText!: GameObjects.Text;
  private healthText!: GameObjects.Text;
  private gm!: GameController;

  constructor() {
    super('Game');
    this.gm = new GameController(
      new PhaseController(),
      new CueGenerator([
        CueFacet.CUE_FACETS[0],
        CueFacet.CUE_FACETS[1],
        CueFacet.CUE_FACETS[0],
        CueFacet.CUE_FACETS[2],
        CueFacet.CUE_FACETS[3],
        CueFacet.CUE_FACETS[1],
        CueFacet.CUE_FACETS[2],
        CueFacet.CUE_FACETS[0],
        CueFacet.CUE_FACETS[3],
        CueFacet.CUE_FACETS[2],
        CueFacet.CUE_FACETS[1],
        CueFacet.CUE_FACETS[3],
      ])
    );
  }

  preload() {}

  init(data: any) {
    if (data && data.restart) {
      eventsCenter.emit('restart');
    }
    InputMediator.mediateKeyboardStream(this.input.keyboard);
  }

  create() {
    this.gm.cueContainer = new CueContainer(this);

    this.add
      .text(400, 50, 'Super Radical Tapper!', { font: '40px Clarity' })
      .setOrigin(0.5);

    this.resultText = this.add
      .text(400, 200, '', { font: '32px Clarity' })
      .setOrigin(0.5);

    // Score Text with Label
    this.add.text(100, 100, 'Score:', { font: '32px Clarity' }).setOrigin(0.5);
    this.scoreText = this.add
      .text(100, 150, this.gm.score.toString(), { font: '32px Clarity' })
      .setOrigin(0.5);

    this.add.text(400, 100, 'Streak:', { font: '32px Clarity' }).setOrigin(0.5);
    this.streakText = this.add
      .text(400, 150, this.gm.streak.toString(), { font: '32px Clarity' })
      .setOrigin(0.5);

    this.add.text(700, 100, 'Health:', { font: '32px Clarity' }).setOrigin(0.5);
    this.healthText = this.add
      .text(700, 150, this.gm.health.toString(), { font: '32px Clarity' })
      .setOrigin(0.5);

    eventsCenter.on('succeed', () => {
      this.scoreText.setText(this.gm.score.toString());
      this.streakText.setText(this.gm.streak.toString());
      this.resultText.setText('SCORE!');
    });

    eventsCenter.on('fail', () => {
      this.streakText.setText(this.gm.streak.toString());
      this.healthText.setText(this.gm.health.toString());
      this.resultText.setText('OUCH!');
    });

    eventsCenter.on('reset', () => {
      this.resultText.setText('');
    });

    eventsCenter.on('gameOver', () => {
      this.scene.start('End', {
        score: this.gm.score,
      });
    });
  }

  update(time: number, delta: number): void {
    eventsCenter.emit('update', time, delta);
  }
}
