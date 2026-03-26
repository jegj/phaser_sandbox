import * as Phaser from "phaser";
import { ASSET_KEYS, ASSET_PACK_KEYS } from "../common/assets";
import { SCENE_KEYS } from "./scene-keys";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE,
    });
  }

  public preload(): void {
    // load asset pack that has assets for the rest of the game
    this.load.pack(ASSET_PACK_KEYS.MAIN, "assets/data/assets.json");
  }

  public create(): void {
    this.createAnimation();
    this.scene.start(SCENE_KEYS.GAME_SCENE);
  }

  private createAnimation() {
    this.anims.createFromAseprite(ASSET_KEYS.PLAYER);
    this.anims.createFromAseprite(ASSET_KEYS.SPIDER);
    this.anims.createFromAseprite(ASSET_KEYS.WISP);
    this.anims.create({
      key: ASSET_KEYS.ENEMY_DEATH,
      frames: this.anims.generateFrameNames(ASSET_KEYS.ENEMY_DEATH),
      frameRate: 6,
      repeat: 0,
      delay: 0,
    });
  }
}
