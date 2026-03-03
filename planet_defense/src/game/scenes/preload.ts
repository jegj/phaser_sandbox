import { Scene } from 'phaser';
import { SCENE_KEYS } from '../common/scenes.keys';

export class Preload extends Scene {
  constructor() {
    super(
      {
        key: SCENE_KEYS.PRELOAD_SCENE
      }
    );
  }

  create() {
    console.log('Preload scene created');
    this.scene.start(SCENE_KEYS.GAME_SCENE);
  }
}
