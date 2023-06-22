import { Scene } from 'phaser';
import { Background, Title } from '../../objects';

export default class About extends Scene {
  constructor() {
    super('About');
  }

  create() {
    this.add.existing(new Background(this));
    this.add.existing(new Title(this));

    this.add
      .text(
        384,
        250,
        [
          '\nMeet Edgar, the cheeky familiar of',
          'the renown wizard Trizolam.\n',
          'One day, left to his own devices in the summoning chamber,',
          "Edgar knocks several of his master's bottled portals off of a desk.",
          'Holes to another dimension burst open, and tiny fae known as radicals',
          'to come pouring through.\n',
          'Help Edgar beat back the radical horde and close the portals',
          'before his master returns!\n',
          'When a portal flashes, press the corresponding key before time runs out.',
          'Mess up and a radical will slip through and attack!\n',
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
