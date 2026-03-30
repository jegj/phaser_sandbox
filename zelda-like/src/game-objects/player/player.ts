import * as Phaser from "phaser";
import { ASSET_KEYS, PLAYER_ANIMATION_KEYS } from "../../common/assets";
import {
  PLAYER_HURT_PUSH_BACK_SPEED,
  PLAYER_INVULNERABLE_AFTER_HIT_DURATION,
  PLAYER_SPEED,
} from "../../common/config";
import { flash } from "../../common/juice-utils";
import { GameObject, Position } from "../../common/types";
import { AnimationConfig } from "../../components/game-object/animation-component";
import { InputComponent } from "../../components/input/input-component";
import { CHARACTER_STATES } from "../../components/state-machine/states/character/character-states";
import { DeathState } from "../../components/state-machine/states/character/death-state";
import { HurtState } from "../../components/state-machine/states/character/hurt.state";
import { IdleState } from "../../components/state-machine/states/character/idle-state";
import { MoveState } from "../../components/state-machine/states/character/move-state";
import { CharacterGameObject } from "../common/character-game-object";
import { CollidingObjectsComponent } from "../../components/game-object/colliding-object-component";

export type PlayerConfig = {
  scene: Phaser.Scene;
  position: Position;
  controls: InputComponent;
  maxLife: number;
  currentLife: number;
};

const animationConfig: AnimationConfig = {
  WALK_DOWN: {
    key: PLAYER_ANIMATION_KEYS.WALK_DOWN,
    repeat: -1,
    ignoreIfPlaying: true,
  },
  WALK_UP: {
    key: PLAYER_ANIMATION_KEYS.WALK_UP,
    repeat: -1,
    ignoreIfPlaying: true,
  },
  WALK_LEFT: {
    key: PLAYER_ANIMATION_KEYS.WALK_SIDE,
    repeat: -1,
    ignoreIfPlaying: true,
  },
  WALK_RIGHT: {
    key: PLAYER_ANIMATION_KEYS.WALK_SIDE,
    repeat: -1,
    ignoreIfPlaying: true,
  },
  IDLE_DOWN: {
    key: PLAYER_ANIMATION_KEYS.IDLE_DOWN,
    repeat: -1,
    ignoreIfPlaying: true,
  },
  IDLE_UP: {
    key: PLAYER_ANIMATION_KEYS.IDLE_UP,
    repeat: -1,
    ignoreIfPlaying: true,
  },
  IDLE_LEFT: {
    key: PLAYER_ANIMATION_KEYS.IDLE_SIDE,
    repeat: -1,
    ignoreIfPlaying: true,
  },
  IDLE_RIGHT: {
    key: PLAYER_ANIMATION_KEYS.IDLE_SIDE,
    repeat: -1,
    ignoreIfPlaying: true,
  },
  HURT_DOWN: {
    key: PLAYER_ANIMATION_KEYS.HURT_DOWN,
    repeat: 0,
    ignoreIfPlaying: true,
  },
  HURT_UP: {
    key: PLAYER_ANIMATION_KEYS.HURT_UP,
    repeat: 0,
    ignoreIfPlaying: true,
  },
  HURT_LEFT: {
    key: PLAYER_ANIMATION_KEYS.HURT_SIDE,
    repeat: 0,
    ignoreIfPlaying: true,
  },
  HURT_RIGHT: {
    key: PLAYER_ANIMATION_KEYS.HURT_SIDE,
    repeat: 0,
    ignoreIfPlaying: true,
  },
  DIE_DOWN: {
    key: PLAYER_ANIMATION_KEYS.DIE_DOWN,
    repeat: 0,
    ignoreIfPlaying: true,
  },
  DIE_UP: {
    key: PLAYER_ANIMATION_KEYS.DIE_UP,
    repeat: 0,
    ignoreIfPlaying: true,
  },
  DIE_LEFT: {
    key: PLAYER_ANIMATION_KEYS.DIE_SIDE,
    repeat: 0,
    ignoreIfPlaying: true,
  },
  DIE_RIGHT: {
    key: PLAYER_ANIMATION_KEYS.DIE_SIDE,
    repeat: 0,
    ignoreIfPlaying: true,
  },
};

export class Player extends CharacterGameObject {
  private _collidingObjectComponent: CollidingObjectsComponent;
  constructor(config: PlayerConfig) {
    super({
      scene: config.scene,
      position: config.position,
      assetKey: ASSET_KEYS.PLAYER,
      frame: 0,
      id: "player",
      isPlayer: true,
      animationConfig,
      speed: PLAYER_SPEED,
      inputComponent: config.controls,
      isInvulnerable: false,
      invulnerableAfterHitAnimationDuration:
        PLAYER_INVULNERABLE_AFTER_HIT_DURATION,
      maxLife: config.maxLife,
      currentLife: config.currentLife,
    });

    this._collidingObjectComponent = new CollidingObjectsComponent(
      this as unknown as GameObject,
    );
    this.stateMachine.addState(new IdleState(this));
    this.stateMachine.addState(new MoveState(this));
    this.stateMachine.addState(
      new HurtState(this, PLAYER_HURT_PUSH_BACK_SPEED, () => {
        flash(this);
      }),
    );
    this.stateMachine.addState(new DeathState(this));
    this.stateMachine.setState(CHARACTER_STATES.IDLE_STATE);

    config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    config.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      config.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });

    this.physicsBody
      .setSize(12, 16, true)
      .setOffset(this.width / 2 - 5, this.height / 2);
  }

  public collideWithGameObject(gameObject: GameObject): void {
    this._collidingObjectComponent.add(gameObject);
  }

  public update() {
    super.update();
    console.log(this._collidingObjectComponent.objects);
    this._collidingObjectComponent.reset();
  }
}
