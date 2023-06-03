import { Scene, GameObjects, Sound } from 'phaser';
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
  private enterSound!: Sound.BaseSound;
  private failSound!: Sound.BaseSound;
  private succeedSound!: Sound.BaseSound;
  private backgroundMusic!: Sound.BaseSound;
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

  init(data: any) {
    if (data && data.restart) {
      eventsCenter.emit('restart');
    }
    InputMediator.mediateKeyboardStream(this.input.keyboard);
  }

  create() {
    let { width, height } = this.sys.game.config;
    // Force conversion to int just to keep the parser happy
    width = +width;
    height = +height;
    this.add
      .image(width / 2, height / 2, 'background')
      .setScale(2, 2)
      .setOrigin(0.5);
    this.gm.cueContainer = new CueContainer(this);

    this.add
      .text(384, 75, 'Super Radical Tapper!', { font: '40px Clarity' })
      .setOrigin(0.5);

    this.resultText = this.add
      .text(384, 250, '', { font: '32px Clarity' })
      .setOrigin(0.5);

    // Score Text with Label
    this.add.text(128, 150, 'Score:', { font: '32px Clarity' }).setOrigin(0.5);
    this.scoreText = this.add
      .text(128, 200, this.gm.score.toString(), { font: '32px Clarity' })
      .setOrigin(0.5);

    this.add.text(384, 150, 'Streak:', { font: '32px Clarity' }).setOrigin(0.5);
    this.streakText = this.add
      .text(384, 200, this.gm.streak.toString(), { font: '32px Clarity' })
      .setOrigin(0.5);

    this.add.text(640, 150, 'Health:', { font: '32px Clarity' }).setOrigin(0.5);
    this.healthText = this.add
      .text(640, 200, this.gm.health.toString(), { font: '32px Clarity' })
      .setOrigin(0.5);

    this.enterSound = this.sound.add('enter', {
      rate: 2,
    });
    this.failSound = this.sound.add('fail', {
      rate: 2,
    });
    this.succeedSound = this.sound.add('hit', { rate: 2 });

    this.backgroundMusic =
      this.backgroundMusic ??
      this.sound.add('music', { loop: true, volume: 0.5 });

    if (!this.backgroundMusic.isPlaying) {
      this.backgroundMusic.play();
    }

    eventsCenter.on('presentCue', () => {
      this.enterSound.play();
    });

    eventsCenter.on('succeed', () => {
      this.enterSound.stop();
      this.succeedSound.play();
      this.scoreText.setText(this.gm.score.toString());
      this.streakText.setText(this.gm.streak.toString());
      // this.resultText.setText('SCORE!');
      this.cameras.main.shake(100, 0.005);
    });

    eventsCenter.on('fail', () => {
      this.enterSound.stop();
      this.failSound.play();
      this.streakText.setText(this.gm.streak.toString());
      this.healthText.setText(this.gm.health.toString());
      this.cameras.main.shake(100, 0.005);
    });

    eventsCenter.on('reset', () => {
      this.resultText.setText('');
      this.failSound.stop();
      this.succeedSound.stop();
    });

    eventsCenter.on('gameOver', () => {
      this.scene.start('End', {
        score: this.gm.score,
        longestStreak: this.gm.longestStreak,
        totalHits: this.gm.totalHits,
      });
    });
    // this.set = true;

    this.scene.pause('MainMenu');
    this.scene.pause('End');
  }

  update(time: number, delta: number): void {
    eventsCenter.emit('update', time, delta);
  }
}
