import * as Phaser from "phaser";
import { ASSET_KEYS } from "../common/assets";
import { SCENE_KEYS } from "./scene-keys";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    });
  }

  public create(): void {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Game Scene", {
        fontFamily: ASSET_KEYS.FONT_PRESS_START_2P,
      })
      .setOrigin(0.5);
  }
}
