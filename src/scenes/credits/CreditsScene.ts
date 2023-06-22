import { Scene } from 'phaser';
import { Background, Title } from '../../objects';

export default class Credits extends Scene {
  constructor() {
    super('Credits');
  }

  create() {
    this.add.existing(new Background(this));
    this.add.existing(new Title(this));

    this.add
      .text(
        384,
        260,
        [
          '* Lead Programmer: the-camputer (https://github.com/the-camputer)\n',
          '* Lead Game Designer: Huzeather\n',
          '* Font: Clarity by Gossamore (https://gossamore.itch.io/clarity)\n',
          '* Character Sprites: Bit Bonanza by VEXED (https://v3x3d.itch.io/bit-bonanza)\n',
          '* Portal Sprites: 2D Asset Portal Pack by PixelZoink & actuallyKron\n(https://actuallykron.itch.io/32x32-2d-portal-asset-pack)\n',
          '* Background: Stonelands RPG Assets by chasersgaming\n(https://chasersgaming.itch.io/rpg-assets-tile-set-stonelands-nes)\n',
          '* Background Music: Dark Dragon by Fatal Exit\n(https://fatalexit.itch.io/dark-dragon-royalty-free-cca-chiptune-music-for-games)\n',
          '* Sound Effects: Retro Game Weapons Sound Effects on Happy Soul Music\n(https://happysoulmusic.com/retro-game-weapons-sound-effects/)\n',
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

    this.scene.pause('About');
  }
}
