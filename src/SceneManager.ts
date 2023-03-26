import { Scene } from 'phaser';
import { Game, End } from './scenes';

export default class SceneManager {
  public static scenes: typeof Scene[] = [Game, End];
}
