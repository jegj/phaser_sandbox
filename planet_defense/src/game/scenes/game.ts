import { Scene } from 'phaser';
import { SCENE_KEYS } from '../common/scenes.keys';
import { ASSET_KEYS } from '../common/assets';

export class Game extends Scene {
  #planet: Phaser.GameObjects.Sprite;
  #player: Phaser.GameObjects.Image;
  constructor() {
    super(
      {
        key: SCENE_KEYS.GAME_SCENE
      }
    );
  }

  create() {
    this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_1).setOrigin(0).setScale(1, 1.25).play(ASSET_KEYS.BACKGROUND_1).setAlpha(0.5);
    this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_2).setOrigin(0).setScale(1, 1.25).play(ASSET_KEYS.BACKGROUND_2).setAlpha(0.5);
    this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_3).setOrigin(0).setScale(1, 1.25).play(ASSET_KEYS.BACKGROUND_3).setAlpha(0.5);
    this.#planet = this.add.sprite(this.scale.width / 2, this.scale.height / 2, ASSET_KEYS.PLANET).setScale(1.5).play(ASSET_KEYS.PLANET);
    this.#player = this.add.image(320, 180, ASSET_KEYS.SHIP);
  }
}
