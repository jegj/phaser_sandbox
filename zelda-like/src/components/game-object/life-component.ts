import { GameObject } from "../../common/types";
import { BaseGameObjectComponent } from "./base-game-object-component";

export class LifeComponent extends BaseGameObjectComponent {
  private _maxLife: number;
  private _currentLife: number;

  constructor(
    gameObject: GameObject,
    maxLife: number,
    currentLife: number = maxLife,
  ) {
    super(gameObject);
    this._maxLife = maxLife;
    this._currentLife = currentLife ?? maxLife;
  }

  get life(): number {
    return this._currentLife;
  }

  get maxLife(): number {
    return this._maxLife;
  }

  public takeDamage(damage: number) {
    console.log(this._currentLife, this.maxLife);
    if (this._currentLife === 0) {
      return;
    }

    this._currentLife -= damage;
    if (this._currentLife < 0) {
      this._currentLife = 0;
    }
  }
}
