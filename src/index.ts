import Phaser from 'phaser';
import PhaserConfig from './PhaserConfig';
import { MainMenu, Game, Lose, About, Credits, Win } from './scenes';

new Phaser.Game(
  Object.assign(PhaserConfig, {
    scene: [MainMenu, Game, Lose, Win, About, Credits],
  })
);
