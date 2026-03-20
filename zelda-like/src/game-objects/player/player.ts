import * as Phaser from "phaser";
import { PLAYER_ANIMATION_KEYS } from "../../common/assets";
import { PLAYER_SPEED } from "../../common/config";
import { Direction, GameObject, Position } from "../../common/types";
import {
  AnimationComponent,
  AnimationConfig,
} from "../../components/game-object/animation-component";
import { ControlsComponent } from "../../components/game-object/controls-component";
import { DirectionComponent } from "../../components/game-object/direction-component";
import { SpeedComponent } from "../../components/game-object/speed-component";
import { InputComponent } from "../../components/input/input-component";
import { StateMachine } from "../../components/state-machine/state-machine";
import { CHARACTER_STATES } from "../../components/state-machine/states/character/character-states";
import { IdleState } from "../../components/state-machine/states/character/idle-state";
import { MoveState } from "../../components/state-machine/states/character/move-state";

export type PlayerConfig = {
  scene: Phaser.Scene;
  position: Position;
  assetKey: string;
  frame?: number;
  controls: InputComponent;
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  private controlsComponent: ControlsComponent;
  private speedComponent: SpeedComponent;
  private directionComponent: DirectionComponent;
  private animationComponent: AnimationComponent;
  private stateMachine: StateMachine;

  constructor(config: PlayerConfig) {
    const { scene, position, assetKey, frame } = config;
    const { x, y } = position;
    super(scene, x, y, assetKey, frame || 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.controlsComponent = new ControlsComponent(
      this as unknown as GameObject,
      config.controls,
    );

    this.speedComponent = new SpeedComponent(
      this as unknown as GameObject,
      PLAYER_SPEED,
    );

    this.directionComponent = new DirectionComponent(
      this as unknown as GameObject,
    );

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
    };
    this.animationComponent = new AnimationComponent(
      this as unknown as GameObject,
      animationConfig,
    );

    this.stateMachine = new StateMachine("player");
    this.stateMachine.addState(new IdleState(this));
    this.stateMachine.addState(new MoveState(this));
    this.stateMachine.setState(CHARACTER_STATES.IDLE_STATE);

    config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    config.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      config.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });
  }

  get controls(): InputComponent {
    return this.controlsComponent.controls;
  }

  get speed(): number {
    return this.speedComponent.speed;
  }

  get direction(): Direction {
    return this.directionComponent.direction;
  }

  set direction(value: Direction) {
    this.directionComponent.direction = value;
  }

  get animation(): AnimationComponent {
    return this.animationComponent;
  }

  update(): void {
    this.stateMachine.onUpdate();
  }
}
