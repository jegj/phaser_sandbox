import Phaser from "phaser";
import { ASSET_KEYS } from "../../common/assets";
import { INTERACTIVE_OBJECT_TYPE } from "../../common/common";
import { GameObject, Position } from "../../common/types";
import { InteractiveObjectsComponent } from "../../components/game-object/interactive-object-component";

type PotConfig = {
  scene: Phaser.Scene;
  position: Position;
};
export class Pot extends Phaser.Physics.Arcade.Sprite {
  private _position: Position;

  constructor(config: PotConfig) {
    const { scene, position } = config;
    super(scene, position.x, position.y, ASSET_KEYS.POT, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0, 1).setImmovable(true);

    this._position = {
      x: position.x,
      y: position.y,
    };

    new InteractiveObjectsComponent(
      this as unknown as GameObject,
      INTERACTIVE_OBJECT_TYPE.PICKUP,
    );
  }
}
