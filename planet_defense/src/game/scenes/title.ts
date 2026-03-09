
import { Scene } from 'phaser';
import { SCENE_KEYS } from '../common/scenes.keys';
import { ASSET_KEYS } from '../common/assets';

export class Title extends Scene {
  constructor() {
    super({
      key: SCENE_KEYS.TITLE_SCENE
    })
  }

  create() {
    this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_1).setOrigin(0).setScale(1, 1.25).play(ASSET_KEYS.BACKGROUND_1).setAlpha(0.5);
    this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_2).setOrigin(0).setScale(1, 1.25).play(ASSET_KEYS.BACKGROUND_2).setAlpha(0.5);
    this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_3).setOrigin(0).setScale(1, 1.25).play(ASSET_KEYS.BACKGROUND_3).setAlpha(0.5);

    this.add.sprite(this.scale.width / 2, this.scale.height / 2, ASSET_KEYS.PLANET, 0).play(ASSET_KEYS.PLANET);
    this.add.text(this.scale.width / 2, this.scale.height / 2, 'Planet Defense', { fontSize: '32px' }).setOrigin(0.5);

    this.add.text(this.scale.width / 2, this.scale.height / 2 + 150, 'Click to Play', { fontSize: '16px', color: '#FFFFFF' }).setOrigin(0.5);

    this.input.once(Phaser.Input.Events.POINTER_DOWN, () => {
      this.cameras.main.fadeOut(500,);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start(SCENE_KEYS.GAME_SCENE);
      });
    });

    this.cameras.main.fadeIn(500);
  }
}
