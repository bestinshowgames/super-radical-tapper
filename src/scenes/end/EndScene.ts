import { Scene } from 'phaser';

export default class End extends Scene {
  private score: number = 0;
  constructor() {
    super('End');
  }

  init(data: any) {
    this.score = data.score;
  }

  create() {
    this.add
      .text(400, 50, 'Super Radical Tapper!', { font: '40px Clarity' })
      .setOrigin(0.5);

    this.add
      .text(400, 150, 'You Lost 💀', { font: '32px Clarity' })
      .setOrigin(0.5);

    this.add
      .text(400, 200, `Final Score: ${this.score.toString()}`, {
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
