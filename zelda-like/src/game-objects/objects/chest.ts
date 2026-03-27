import Phaser from "phaser";
import { ASSET_KEYS, CHEST_FRAME_KEYS } from "../../common/assets";
import { ChestState, Position } from "../../common/types";
import { CHEST_STATE } from "../../common/common";

type ChestConfig = {
  scene: Phaser.Scene;
  position: Position;
  requireBossKey: boolean;
  chestState?: ChestState;
};
export class Chest extends Phaser.Physics.Arcade.Image {
  private _state: ChestState;
  private _isBossKeyChest: boolean;

  constructor(config: ChestConfig) {
    const { scene, position } = config;
    const assetKey = config.requireBossKey
      ? CHEST_FRAME_KEYS.BIG_CHEST_CLOSED
      : CHEST_FRAME_KEYS.SMALL_CHEST_CLOSED;
    super(scene, position.x, position.y, ASSET_KEYS.DUNGEON_OBJECTS, assetKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0, 1).setImmovable(true);

    this._state = config.chestState ?? CHEST_STATE.HIDDEN;
    this._isBossKeyChest = config.requireBossKey;

    if (this._isBossKeyChest) {
      (this.body as Phaser.Physics.Arcade.Body).setSize(32, 24).setOffset(0, 8);
    }
  }

  public open(): void {
    if (this._state !== CHEST_STATE.REVEALED) {
      return;
    }

    this._state = CHEST_STATE.OPEN;

    const frameKey = this._isBossKeyChest
      ? CHEST_FRAME_KEYS.BIG_CHEST_OPEN
      : CHEST_FRAME_KEYS.SMALL_CHEST_OPEN;
    this.setFrame(frameKey);
  }
}
