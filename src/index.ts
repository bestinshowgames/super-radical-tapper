import Phaser from 'phaser';
import PhaserConfig from './PhaserConfig';
import { Game } from './scenes';

new Phaser.Game(
  Object.assign(PhaserConfig, {
    scene: [Game]
  })
);
