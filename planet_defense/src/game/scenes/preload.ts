import { Scene } from 'phaser';
import { SCENE_KEYS } from '../common/scenes.keys';
import { IMAGE_ASSETS, AUDIO_ASSETS, SPRITESHEET_ASSETS } from '../common/assets';

export class Preload extends Scene {
  constructor() {
    super(
      {
        key: SCENE_KEYS.PRELOAD_SCENE
      }
    );
  }

  preload() {
    IMAGE_ASSETS.forEach((asset) => {
      this.load.image(asset.assetKey, asset.path);
    });

    AUDIO_ASSETS.forEach((asset) => {
      this.load.audio(asset.assetKey, asset.path);
    });

    SPRITESHEET_ASSETS.forEach((asset) => {
      this.load.spritesheet(asset.assetKey, asset.path, {
        frameWidth: asset.frameWidth,
        frameHeight: asset.frameHeight,
      });
    });
  }

  create() {
    SPRITESHEET_ASSETS.forEach((asset) => {
      this.anims.create(
        {
          key: asset.assetKey,
          frames: this.anims.generateFrameNumbers(asset.assetKey),
          frameRate: asset.frameRate,
          repeat: asset.repeat,
        }
      );
    });

    this.scene.start(SCENE_KEYS.GAME_SCENE);
  }
}
