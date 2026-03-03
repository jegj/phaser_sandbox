import { Scene } from 'phaser';
import { SCENE_KEYS } from '../common/scenes.keys';

export class Game extends Scene {
  constructor() {
    super(
      {
        key: SCENE_KEYS.GAME_SCENE
      }
    );
  }

  create() {
    console.log('Game scene created');
  }
}
