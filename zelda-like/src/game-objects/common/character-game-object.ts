import * as Phaser from "phaser";
import { Direction, GameObject, Position } from "../../common/types";
import {
  AnimationComponent,
  AnimationConfig,
} from "../../components/game-object/animation-component";
import { ControlsComponent } from "../../components/game-object/controls-component";
import { DirectionComponent } from "../../components/game-object/direction-component";
import { InvulnerableComponent } from "../../components/game-object/invulnerable-component";
import { SpeedComponent } from "../../components/game-object/speed-component";
import { InputComponent } from "../../components/input/input-component";
import { StateMachine } from "../../components/state-machine/state-machine";
import { CHARACTER_STATES } from "../../components/state-machine/states/character/character-states";
import { LifeComponent } from "../../components/game-object/life-component";
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
  isInvulnerable?: boolean;
  invulnerableAfterHitAnimationDuration?: number;
  maxLife: number;
  currentLife?: number;
};

export abstract class CharacterGameObject extends Phaser.Physics.Arcade.Sprite {
  protected controlsComponent: ControlsComponent;
  protected speedComponent: SpeedComponent;
  protected directionComponent: DirectionComponent;
  protected animationComponent: AnimationComponent;
  protected invulnerableComponent: InvulnerableComponent;
  protected lifeComponent: LifeComponent;
  protected stateMachine: StateMachine;
  protected isPlayer: boolean;
  protected _isDefeated: boolean;

  constructor(config: CharacterConfig) {
    const {
      scene,
      position,
      assetKey,
      frame,
      id,
      isPlayer,
      isInvulnerable,
      invulnerableAfterHitAnimationDuration,
      maxLife,
      currentLife,
    } = config;
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
    this.invulnerableComponent = new InvulnerableComponent(
      this as unknown as GameObject,
      isInvulnerable ?? false,
      invulnerableAfterHitAnimationDuration,
    );
    this.lifeComponent = new LifeComponent(
      this as unknown as GameObject,
      maxLife,
      currentLife ?? 0,
    );

    this.stateMachine = new StateMachine(id);
    this.isPlayer = isPlayer;
  }

  get isDefeated() {
    return this._isDefeated;
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

  get invulnerableCmp(): InvulnerableComponent {
    return this.invulnerableComponent;
  }

  update(): void {
    this.stateMachine.onUpdate();
  }

  public hit(direction: Direction, damage: number): void {
    if (this.isDefeated) {
      return;
    }

    if (this.invulnerableComponent.invulnerable) {
      return;
    }

    this.lifeComponent.takeDamage(damage);

    if (this.lifeComponent.life == 0) {
      this._isDefeated = true;
      this.stateMachine.setState(CHARACTER_STATES.DEATH_STATE, direction);
      return;
    }

    this.stateMachine.setState(CHARACTER_STATES.HURT_STATE, direction);
  }

  public disableObject() {
    (this.body as Phaser.Physics.Arcade.Body).enable = false;
    this.active = false;
    if (!this.isPlayer) {
      this.visible = false;
    }
  }

  public enableObject() {
    if (this.isDefeated) {
      return;
    }
    (this.body as Phaser.Physics.Arcade.Body).enable = true;
    this.visible = true;
    this.active = true;
  }

  get physicsBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }
}
