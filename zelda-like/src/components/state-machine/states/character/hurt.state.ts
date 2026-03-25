import { CHARACTER_ANIMATIONS } from "../../../../common/assets";
import { DIRECTION } from "../../../../common/common";
import { HURT_PUSH_BACK_DELAY } from "../../../../common/config";
import { Direction } from "../../../../common/types";
import { exhaustiveGuard, isArcadePhysicsBody } from "../../../../common/utils";
import { CharacterGameObject } from "../../../../game-objects/common/character-game-object";
import { BaseCharacterState } from "./base-character-state";
import { CHARACTER_STATES } from "./character-states";

export class HurtState extends BaseCharacterState {
  private _hurtPushBackSpeed: number;
  private _onHurtCallback: () => void;
  private _nextState: string;

  constructor(
    gameObject: CharacterGameObject,
    hurtPushBackSpeed: number,
    onHurtCallback: () => void = () => undefined,
    nextState: string = CHARACTER_STATES.IDLE_STATE,
  ) {
    super(CHARACTER_STATES.HURT_STATE, gameObject);
    this._hurtPushBackSpeed = hurtPushBackSpeed;
    this._onHurtCallback = onHurtCallback;
    this._nextState = nextState;
  }
  public onEnter(args: unknown[]) {
    const attackDirection = args[0] as Direction;
    if (isArcadePhysicsBody(this._gameObject.body)) {
      const body = this._gameObject.body;
      body.velocity.x = 0;
      body.velocity.y = 0;
      switch (attackDirection) {
        case DIRECTION.DOWN:
          body.velocity.y = this._hurtPushBackSpeed;
          break;
        case DIRECTION.UP:
          body.velocity.y = this._hurtPushBackSpeed * -1;
          break;
        case DIRECTION.LEFT:
          body.velocity.x = this._hurtPushBackSpeed * -1;
          break;
        case DIRECTION.RIGHT:
          body.velocity.x = this._hurtPushBackSpeed;
          break;
        default:
          exhaustiveGuard(attackDirection);
      }

      this._gameObject.scene.time.delayedCall(HURT_PUSH_BACK_DELAY, () => {
        body.velocity.x = 0;
        body.velocity.y = 0;
      });
    }
    this._gameObject.invulnerableCmp.invulnerable = true;
    this._onHurtCallback();
    this._gameObject.animation.playAnimation(
      CHARACTER_ANIMATIONS.HURT_DOWN,
      () => {
        this.transition();
      },
    );
  }

  private transition() {
    this._gameObject.scene.time.delayedCall(
      this._gameObject.invulnerableCmp.invulnerableAfterHitAnimationDuration,
      () => {
        this._gameObject.invulnerableCmp.invulnerable = false;
      },
    );
    this._stateMachine.setState(this._nextState);
  }
}
