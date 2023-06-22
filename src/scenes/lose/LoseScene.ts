import { Scene } from 'phaser';
import { Background, Title } from '../../objects';

export default class Lose extends Scene {
  private score: number = 0;
  private longestStreak: number = 0;
  private totalHits: number = 0;

  constructor() {
    super('Lose');
  }

  init(data: any) {
    this.score = data.score;
    this.longestStreak = data.longestStreak;
    this.totalHits = data.totalHits;
  }

  create() {
    this.add.existing(new Background(this));
    this.add.existing(new Title(this));

    this.add
      .text(384, 125, 'You Lost 💀', { font: '32px Clarity' })
      .setOrigin(0.5);

    this.add
      .text(384, 200, `Final Score: ${this.score.toString()}`, {
        font: '32px Clarity',
      })
      .setOrigin(0.5);

    this.add
      .text(384, 250, `Total Hits: ${this.totalHits.toString()}`, {
        font: '32px Clarity',
      })
      .setOrigin(0.5);

    this.add
      .text(384, 300, `Longest Streak: ${this.longestStreak.toString()}`, {
        font: '32px Clarity',
      })
      .setOrigin(0.5);

    const restart = this.add
      .text(394, 400, 'Restart', {
        font: '32px Clarity',
        backgroundColor: 'black',
      })
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    const home = this.add
      .text(394, 475, 'Main Menu', {
        font: '32px Clarity',
        backgroundColor: 'black',
      })
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    restart.on('pointerup', () => {
      this.scene.start('Game', { restart: true });
    });

    home.on('pointerup', () => {
      this.scene.start('MainMenu');
    });

    this.scene.pause('Game');
  }
}
