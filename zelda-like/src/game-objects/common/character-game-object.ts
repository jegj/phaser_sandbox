import * as Phaser from "phaser";
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

export type CharacterConfig = {
  scene: Phaser.Scene;
  position: Position;
  assetKey: string;
  frame?: number;
  inputComponent: InputComponent;
  animationConfig: AnimationConfig;
  speed: number;
  id?: string;
  isPlayer: boolean;
};

export abstract class CharacterGameObject extends Phaser.Physics.Arcade.Sprite {
  protected controlsComponent: ControlsComponent;
  protected speedComponent: SpeedComponent;
  protected directionComponent: DirectionComponent;
  protected animationComponent: AnimationComponent;
  protected stateMachine: StateMachine;
  protected isPlayer: boolean;

  constructor(config: CharacterConfig) {
    const { scene, position, assetKey, frame, id, isPlayer } = config;
    const { x, y } = position;
    super(scene, x, y, assetKey, frame || 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.controlsComponent = new ControlsComponent(
      this as unknown as GameObject,
      config.inputComponent,
    );

    this.speedComponent = new SpeedComponent(
      this as unknown as GameObject,
      config.speed,
    );

    this.directionComponent = new DirectionComponent(
      this as unknown as GameObject,
    );
    this.animationComponent = new AnimationComponent(
      this as unknown as GameObject,
      config.animationConfig,
    );

    this.stateMachine = new StateMachine(id);
    this.isPlayer = isPlayer;
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

  get isEnemy(): boolean {
    return !this.isPlayer;
  }

  update(): void {
    this.stateMachine.onUpdate();
  }
}
