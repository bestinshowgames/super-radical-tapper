import { Scene } from 'phaser';
import { MainMenu, Game, Lose, Win } from './scenes';

export default class SceneManager {
  public static scenes: typeof Scene[] = [MainMenu, Game, Lose, Win];
}
