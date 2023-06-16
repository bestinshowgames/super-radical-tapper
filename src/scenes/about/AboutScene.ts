import { Scene } from 'phaser';

export default class About extends Scene {
  constructor() {
    super('About');
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

    this.add
      .text(384, 75, 'Super Radical Tapper!', { font: '40px Clarity' })
      .setOrigin(0.5);

    this.add
      .text(
        384,
        200,
        [
          'Meet Edgar, the cheeky familiar of',
          'the renown wizard Trizolam.\n',
          'One day, left to his own devices in the summoning chamber,',
          "Edgar knocks several of his master's bottled portals off of a desk.",
          'Holes to another dimension burst open, and tiny fae known as radicals',
          'to come pouring through.\n',
          'Help Edgar beat back the radical horde and close the portals',
          'before his master returns!',
        ],
        { font: '12px Clarity', align: 'center', backgroundColor: 'gray' }
      )
      .setOrigin(0.5);

    const credits = this.add
      .text(394, 400, 'Credits', {
        font: '32px Clarity',
        backgroundColor: 'black',
      })
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });
    credits.on('pointerup', () => {
      this.scene.start('Credits');
    });

    const home = this.add
      .text(394, 450, 'Main Menu', {
        font: '32px Clarity',
        backgroundColor: 'black',
      })
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    home.on('pointerup', () => {
      this.scene.start('MainMenu');
    });

    this.scene.pause('MainMenu');
    this.scene.pause('Credits');
  }
}
