import Phaser from 'phaser';
import PhaserConfig from './PhaserConfig';
import SceneManager from './SceneManager';

new Phaser.Game(
  Object.assign(PhaserConfig, {
    scene: SceneManager.scenes,
  })
);
