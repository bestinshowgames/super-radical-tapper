import { Scene, GameObjects } from 'phaser';
import GameController from './GameController';
import CueContainer from './CueContainer';
import PhaseController from './PhaseController';
import CueGenerator from './CueGenerator';
import CueFacet from './CueFacet';

export default class Game extends Scene {
  private resultText!: GameObjects.Text;
  private scoreText!: GameObjects.Text;
  private streakText!: GameObjects.Text;
  private gm!: GameController;

  constructor() {
    super('Game');
  }

  preload() {}

  create() {
    this.gm = new GameController(
      this,
      new PhaseController(this),
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
      ]),
      new CueContainer(this)
    );

    this.add
      .text(400, 50, 'Super Radical Tapper!', { font: '64px Toriko' })
      .setOrigin(0.5);

    this.resultText = this.add
      .text(400, 200, '', { font: '64px Toriko' })
      .setOrigin(0.5);

    // Score Text with Label
    this.add.text(100, 100, 'Score:', { font: '64px Toriko' }).setOrigin(0.5);
    this.scoreText = this.add
      .text(100, 150, this.gm.score.toString(), { font: '64px Toriko' })
      .setOrigin(0.5);

    this.add.text(400, 100, 'Streak:', { font: '64px Toriko' }).setOrigin(0.5);
    this.streakText = this.add
      .text(400, 150, this.gm.streak.toString(), { font: '64px Toriko' })
      .setOrigin(0.5);

    this.events.on('succeed', () => {
      this.scoreText.setText(this.gm.score.toString());
      this.streakText.setText(this.gm.streak.toString());
      this.resultText.setText('SCORE!');
    });

    this.events.on('fail', () => {
      this.streakText.setText(this.gm.streak.toString());
      this.resultText.setText('OUCH!');
    });

    this.events.on('reset', () => {
      this.resultText.setText('');
    });
  }
}
