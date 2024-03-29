import { Scene } from 'phaser';
import { Background, Title } from '../../objects';

export default class MainMenu extends Scene {
  constructor() {
    super('MainMenu');
  }

  preload() {
    this.load.spritesheet('creatures', 'assets/sprites/Creatures-no-bg.png', {
      frameWidth: 10,
      frameHeight: 10,
    });
    this.load.audio('enter', 'assets/sounds/Teleport.mp3');
    this.load.audio('fail', 'assets/sounds/Starpower.mp3');
    this.load.audio('hit', 'assets/sounds/Hit 2.mp3');
    this.load.audio('music', 'assets/sounds/Dark Dragon.ogg');
    this.load.image('background', 'assets/sprites/SRT Background 2.png');
    this.load.image('basicButton', 'assets/sprites/buttonLong_beige.png');
    this.load.spritesheet('portals', 'assets/sprites/portal3_spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.add.existing(new Background(this));
    this.add.existing(new Title(this));

    this.add
      .text(384, 150, 'Beat Back the Baddies', { font: '24px Clarity' })
      .setOrigin(0.5);

    const startButton = this.add
      .text(394, 300, 'Start', {
        font: '32px Clarity',
        backgroundColor: 'black',
      })
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    startButton.on('pointerup', () => {
      this.scene.start('Game');
    });

    const aboutButton = this.add
      .text(394, 350, 'About', {
        font: '32px Clarity',
        backgroundColor: 'black',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    aboutButton.on('pointerup', () => {
      this.scene.start('About');
    });

    this.scene.pause('Lose');
    this.scene.pause('Win');
    this.scene.pause('About');
  }
}
