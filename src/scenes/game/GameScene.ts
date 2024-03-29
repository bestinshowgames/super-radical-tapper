import { Scene, GameObjects, Sound } from 'phaser';
import eventsCenter from './EventsCenter';
import { InputEvents } from './InputMediator';
import GameController from './GameController';
import CueContainer from './CueContainer';
import PhaseController from './PhaseController';
import CueGenerator from './CueGenerator';
import CueFacet from './CueFacet';
import { Background, Title } from '../../objects';

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
  }

  create() {
    this.add.existing(new Background(this));

    this.gm.cueContainer = new CueContainer(this);
    this.add.existing(new Title(this));

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

    this.input.keyboard.on('keydown', (event: any) => {
      const code: number = event.keyCode;
      const cueResponse = CueFacet.getFacetForKey(code);
      if (cueResponse) {
        eventsCenter.emit('input', InputEvents.CUE_INPUT, cueResponse);
      } else {
        eventsCenter.emit('input', InputEvents.UNDEFINED, null);
      }
    });

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

    eventsCenter.on('gameOver', (win: boolean | undefined) => {
      if (!win) {
        this.scene.start('Lose', {
          score: this.gm.score,
          longestStreak: this.gm.longestStreak,
          totalHits: this.gm.totalHits,
        });
      } else {
        this.scene.start('Win', {
          score: this.gm.score,
          longestStreak: this.gm.longestStreak,
          totalHits: this.gm.totalHits,
        });
      }
    });
    // this.set = true;

    this.scene.pause('MainMenu');
    this.scene.pause('Lose');
  }

  update(time: number, delta: number): void {
    eventsCenter.emit('update', time, delta);
  }
}
