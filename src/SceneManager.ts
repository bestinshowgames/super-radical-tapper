import { Scene } from 'phaser';
import { Game } from './scenes';

export default class SceneManager {
  public static scenes: typeof Scene[] = [Game];
}
