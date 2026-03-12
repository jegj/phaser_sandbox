import * as Phaser from "phaser";
import { ASSET_KEYS } from "../common/assets";
import { KeyboardComponent } from "../components/input/keyboard-component";
import { Player } from "../game-objects/player/player";
import { SCENE_KEYS } from "./scene-keys";

export class GameScene extends Phaser.Scene {
  private player: Phaser.Physics.Arcade.Sprite;
  private controls: KeyboardComponent;
  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    });
  }

  public create(): void {
    if (!this.input.keyboard) {
      console.warn(
        "Keyboard input is not available. Controls will not be initialized.",
      );
      return;
    }
    this.controls = new KeyboardComponent(this.input.keyboard);
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Game Scene", {
        fontFamily: ASSET_KEYS.FONT_PRESS_START_2P,
      })
      .setOrigin(0.5);
    this.player = new Player({
      scene: this,
      position: { x: this.scale.width / 2, y: this.scale.height / 2 },
      assetKey: ASSET_KEYS.PLAYER,
      frame: 0,
      controls: this.controls,
    });
  }
}
