import { GameObject } from "../../common/types";
import { BaseGameObjectComponent } from "./base-game-object-component";

export class InvulnerableComponent extends BaseGameObjectComponent {
  private _invulnerable: boolean;
  private _invulnerableAfterHitAnimationDuration: number;

  constructor(
    gameObject: GameObject,
    invulnerable: boolean = false,
    invulnerableAfterHitAnimationDuration: number = 100,
  ) {
    super(gameObject);
    this._invulnerable = invulnerable;
    this._invulnerableAfterHitAnimationDuration =
      invulnerableAfterHitAnimationDuration;
  }

  get invulnerable(): boolean {
    return this._invulnerable;
  }

  set invulnerable(value: boolean) {
    this._invulnerable = value;
  }

  get invulnerableAfterHitAnimationDuration(): number {
    return this._invulnerableAfterHitAnimationDuration;
  }
}
