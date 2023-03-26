import { Scene } from 'phaser';

export default class End extends Scene {
  private score: number = 0;
  private longestStreak: number = 0;
  constructor() {
    super('End');
  }

  init(data: any) {
    this.score = data.score;
    this.longestStreak = data.longestStreak;
  }

  create() {
    this.add
      .text(400, 50, 'Super Radical Tapper!', { font: '40px Clarity' })
      .setOrigin(0.5);

    this.add
      .text(400, 125, 'You Lost 💀', { font: '32px Clarity' })
      .setOrigin(0.5);

    this.add
      .text(400, 200, `Final Score: ${this.score.toString()}`, {
        font: '32px Clarity',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 250, `Longest Streak: ${this.longestStreak.toString()}`, {
        font: '32px Clarity',
      })
      .setOrigin(0.5);

    const restart = this.add
      .text(400, 400, 'Restart', {
        font: '32px Clarity',
      })
      .setOrigin(0.5);

    restart.setInteractive().on('pointerup', () => {
      this.scene.start('Game', { restart: true });
    });
  }
}
