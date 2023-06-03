import { Scene } from 'phaser';

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

    const startButton = this.add
      .text(394, 400, 'Start', {
        font: '32px Clarity',
        backgroundColor: 'black',
      })
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    startButton.on('pointerup', () => {
      console.log('DING!');
      this.scene.start('Game');
    });

    this.scene.pause('End');
  }
}