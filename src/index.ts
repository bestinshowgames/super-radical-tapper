import Phaser from 'phaser';
import config from './config';
import { Game } from './scenes';

new Phaser.Game(
  Object.assign(config, {
    scene: [Game]
  })
);
