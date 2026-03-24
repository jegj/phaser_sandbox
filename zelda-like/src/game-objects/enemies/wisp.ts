import * as Phaser from "phaser";
import { ASSET_KEYS, WISP_ANIMATION_KEYS } from "../../common/assets";
import { DIRECTION } from "../../common/common";
import {
  ENEMY_SPIDER_CHANGE_DIRECTION_DELAY_MAX,
  ENEMY_SPIDER_CHANGE_DIRECTION_DELAY_MIN,
  ENEMY_SPIDER_CHANGE_DIRECTION_DELAY_WAIT,
  ENEMY_WISP_SPEED,
} from "../../common/config";
import { Direction, Position } from "../../common/types";
import { exhaustiveGuard } from "../../common/utils";
import { AnimationConfig } from "../../components/game-object/animation-component";
import { InputComponent } from "../../components/input/input-component";
import { CHARACTER_STATES } from "../../components/state-machine/states/character/character-states";
import { IdleState } from "../../components/state-machine/states/character/idle-state";
import { MoveState } from "../../components/state-machine/states/character/move-state";
import { CharacterGameObject } from "../common/character-game-object";

export type WispConfig = {
  scene: Phaser.Scene;
  position: Position;
};

const animConfig = {
  key: WISP_ANIMATION_KEYS.IDLE,
  repeat: -1,
  ignoreIfPlaying: true,
};
const animationConfig: AnimationConfig = {
  IDLE_DOWN: animConfig,
  IDLE_UP: animConfig,
  IDLE_LEFT: animConfig,
  IDLE_RIGHT: animConfig,
};

export class Wisp extends CharacterGameObject {
  constructor(config: WispConfig) {
    super({
      scene: config.scene,
      position: config.position,
      assetKey: ASSET_KEYS.PLAYER,
      frame: 0,
      id: `wips-${Phaser.Math.RND.uuid()}`,
      isPlayer: false,
      animationConfig,
      speed: ENEMY_WISP_SPEED,
      inputComponent: new InputComponent(),
    });

    this.directionComponent.callback = (direction: Direction) => {
      this.handleDirectionChange(direction);
    };
    this.stateMachine.addState(new IdleState(this));

    this.stateMachine.setState(CHARACTER_STATES.IDLE_STATE);

    this.scene.time.addEvent({
      delay: Phaser.Math.Between(500, 1500),
      callback: this.changeDirection,
      callbackScope: this,
      loop: false,
    });
  }

  private handleDirectionChange(direction: Direction) {
    switch (direction) {
      case DIRECTION.DOWN:
        this.setAngle(0);
        return;
      case DIRECTION.UP:
        this.setAngle(180);
        return;
      case DIRECTION.LEFT:
        this.setAngle(90);
        return;
      case DIRECTION.RIGHT:
        this.setAngle(270);
        return;
      default:
        exhaustiveGuard(direction);
    }
  }

  private changeDirection(): void {
    this.controls.reset();
    this.scene.time.delayedCall(
      ENEMY_SPIDER_CHANGE_DIRECTION_DELAY_WAIT,
      () => {
        const randomDirection = Phaser.Math.Between(0, 3);
        if (randomDirection === 0) {
          this.controls.isUpDown = true;
        } else if (randomDirection === 1) {
          this.controls.isRightDown = true;
        } else if (randomDirection === 2) {
          this.controls.isDownDown = true;
        } else {
          this.controls.isLeftDown = true;
        }
      },
    );

    this.scene.time.addEvent({
      delay: Phaser.Math.Between(
        ENEMY_SPIDER_CHANGE_DIRECTION_DELAY_MIN,
        ENEMY_SPIDER_CHANGE_DIRECTION_DELAY_MAX,
      ),
      callback: this.changeDirection,
      callbackScope: this,
      loop: false,
    });
  }
}
