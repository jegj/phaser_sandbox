import { PLAYER_ANIMATION_KEYS } from "../../../../common/assets";
import { isArcadePhysicsBody } from "../../../../common/utils";
import { Player } from "../../../../game-objects/player/player";
import { BaseCharacterState } from "./base-character-state";
import { CHARACTER_STATES } from "./character-states";

export class MoveState extends BaseCharacterState {
  constructor(gameObject: Player) {
    super(CHARACTER_STATES.MOVE_STATE, gameObject);
  }

  public onUpdate() {
    const controls = this._gameObject.controls;

    if (
      !controls.isUpDown &&
      !controls.isDownDown &&
      !controls.isLeftDown &&
      !controls.isRightDown
    ) {
      this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE);
    }

    if (controls.isUpDown) {
      this._gameObject.play(
        { key: PLAYER_ANIMATION_KEYS.WALK_UP, repeat: -1 },
        true,
      );
      this.updateVelocity(false, -1);
    } else if (controls.isDownDown) {
      this._gameObject.play(
        { key: PLAYER_ANIMATION_KEYS.WALK_DOWN, repeat: -1 },
        true,
      );
      this.updateVelocity(false, 1);
    } else {
      this.updateVelocity(false, 0);
    }

    const isMovingVertically = controls.isUpDown || controls.isUpDown;
    if (controls.isLeftDown) {
      this._gameObject.setFlipX(true);
      this.updateVelocity(true, -1);
      if (!isMovingVertically) {
        this._gameObject.play(
          { key: PLAYER_ANIMATION_KEYS.WALK_SIDE, repeat: -1 },
          true,
        );
      }
    } else if (controls.isRightDown) {
      this._gameObject.setFlipX(false);
      this.updateVelocity(true, 1);
      if (!isMovingVertically) {
        this._gameObject.play(
          { key: PLAYER_ANIMATION_KEYS.WALK_SIDE, repeat: -1 },
          true,
        );
      }
    } else {
      this.updateVelocity(true, 0);
    }

    this.normalizeVelocity();
    if (
      !controls.isUpDown &&
      !controls.isDownDown &&
      !controls.isLeftDown &&
      !controls.isRightDown
    ) {
      return;
    }

    this._stateMachine.setState(CHARACTER_STATES.MOVE_STATE);
  }

  private updateVelocity(isX: boolean, value: number): void {
    if (!isArcadePhysicsBody(this._gameObject.body)) {
      return;
    }
    if (isX) {
      this._gameObject.body.velocity.x = value;
      return;
    }

    this._gameObject.body.velocity.y = value;
  }

  private normalizeVelocity(): void {
    if (!isArcadePhysicsBody(this._gameObject.body)) {
      return;
    }
    this._gameObject.body.velocity.normalize().scale(80);
  }
}
