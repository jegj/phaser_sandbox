import { DIRECTION } from "../../common/common";
import { Direction, GameObject } from "../../common/types";
import { BaseGameObjectComponent } from "./base-game-object-component";

export class DirectionComponent extends BaseGameObjectComponent {
  private _direction: Direction;
  private _callback: (direction: Direction) => void;

  constructor(gameObject: GameObject, onDirectionCallback = () => undefined) {
    super(gameObject);
    this._direction = DIRECTION.DOWN;
    this._callback = onDirectionCallback;
  }

  get direction(): Direction {
    return this._direction;
  }

  set direction(direction: Direction) {
    this._direction = direction;
    this._callback(this._direction);
  }

  set callback(callback: (direction: Direction) => void) {
    this._callback = callback;
  }
}
