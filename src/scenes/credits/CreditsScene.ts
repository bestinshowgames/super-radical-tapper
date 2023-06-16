import { Scene } from 'phaser';

export default class Credits extends Scene {
  constructor() {
    super('Credits');
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
        250,
        [
          'Lead Programmer: the-camputer (https://github.com/the-camputer)\n',
          'Lead Game Designer: Huzeather\n',
          'Font: Clarity by Gossamore (https://gossamore.itch.io/clarity)\n',
          'Character Sprites: Bit Bonanza by VEXED (https://v3x3d.itch.io/bit-bonanza)\n',
          'Background: Stonelands RPG Assets by chasersgaming\n(https://chasersgaming.itch.io/rpg-assets-tile-set-stonelands-nes)\n',
          'background Music: Dark Dragon by Fatal Exit\n(https://fatalexit.itch.io/dark-dragon-royalty-free-cca-chiptune-music-for-games)\n',
          'Sound Effects: Retro Game Weapons Sound Effects on Happy Soul Music\n(https://happysoulmusic.com/retro-game-weapons-sound-effects/)',
        ],
        { font: '12px Clarity', align: 'center', backgroundColor: 'gray' }
      )
      .setOrigin(0.5);

    const back = this.add
      .text(394, 450, 'Back', {
        font: '32px Clarity',
        backgroundColor: 'black',
      })
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    back.on('pointerup', () => {
      this.scene.start('About');
    });
  }
}
