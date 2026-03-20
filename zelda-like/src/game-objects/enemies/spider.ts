import * as Phaser from "phaser";
import { ASSET_KEYS, SPIDER_ANIMATION_KEYS } from "../../common/assets";
import { ENEMY_SPIDER_SPEED, PLAYER_SPEED } from "../../common/config";
import { Position } from "../../common/types";
import { AnimationConfig } from "../../components/game-object/animation-component";
import { InputComponent } from "../../components/input/input-component";
import { CHARACTER_STATES } from "../../components/state-machine/states/character/character-states";
import { IdleState } from "../../components/state-machine/states/character/idle-state";
import { MoveState } from "../../components/state-machine/states/character/move-state";

import { CharacterGameObject } from "../common/character-game-object";
export type SpiderConfig = {
  scene: Phaser.Scene;
  position: Position;
};

const animConfig = {
  key: SPIDER_ANIMATION_KEYS.WALK,
  repeat: -1,
  ignoreIfPlaying: true,
};
const animationConfig: AnimationConfig = {
  WALK_DOWN: animConfig,
  WALK_UP: animConfig,
  WALK_LEFT: animConfig,
  WALK_RIGHT: animConfig,
  IDLE_DOWN: animConfig,
  IDLE_UP: animConfig,
  IDLE_LEFT: animConfig,
  IDLE_RIGHT: animConfig,
};

export class Spider extends CharacterGameObject {
  constructor(config: SpiderConfig) {
    super({
      scene: config.scene,
      position: config.position,
      assetKey: ASSET_KEYS.PLAYER,
      frame: 0,
      id: `spider-${Phaser.Math.RND.uuid()}`,
      isPlayer: false,
      animationConfig,
      speed: ENEMY_SPIDER_SPEED,
      inputComponent: new InputComponent(),
    });

    this.stateMachine.addState(new IdleState(this));
    this.stateMachine.addState(new MoveState(this));
    this.stateMachine.setState(CHARACTER_STATES.IDLE_STATE);
  }
}
