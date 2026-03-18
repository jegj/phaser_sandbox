import { DIRECTION } from "../../common/common";
import { Direction, GameObject } from "../../common/types";
import { BaseGameObjectComponent } from "./base-game-object-component";

export class DirectionComponent extends BaseGameObjectComponent {
  private _direction: Direction;
  private callback: (direction: Direction) => void;

  constructor(gameObject: GameObject, onDirectionCallback = () => undefined) {
    super(gameObject);
    this._direction = DIRECTION.DOWN;
    this.callback = onDirectionCallback;
  }

  get direction(): Direction {
    return this._direction;
  }

  set direction(direction: Direction) {
    this._direction = direction;
    this.callback(this._direction);
  }
}
