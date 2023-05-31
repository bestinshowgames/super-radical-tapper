import { Scene } from 'phaser';
import { MainMenu, Game, End } from './scenes';

export default class SceneManager {
  public static scenes: typeof Scene[] = [MainMenu, Game, End];
}
