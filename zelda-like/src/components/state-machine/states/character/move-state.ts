import { DIRECTION } from "../../../../common/common";
import { Direction } from "../../../../common/types";
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
      this.updateVelocity(false, -1);
      this.updateDirection(DIRECTION.UP);
    } else if (controls.isDownDown) {
      this.updateVelocity(false, 1);
      this.updateDirection(DIRECTION.DOWN);
    } else {
      this.updateVelocity(false, 0);
    }

    const isMovingVertically = controls.isUpDown || controls.isUpDown;
    if (controls.isLeftDown) {
      this._gameObject.setFlipX(true);
      this.updateVelocity(true, -1);
      if (!isMovingVertically) {
        this.updateDirection(DIRECTION.LEFT);
      }
    } else if (controls.isRightDown) {
      this._gameObject.setFlipX(false);
      this.updateVelocity(true, 1);
      if (!isMovingVertically) {
        this.updateDirection(DIRECTION.RIGHT);
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
    this._gameObject.body.velocity.normalize().scale(this._gameObject.speed);
  }

  private updateDirection(direction: Direction) {
    this._gameObject.direction = direction;
    this._gameObject.animation.playAnimation(`WALK_${direction}`);
  }
}
