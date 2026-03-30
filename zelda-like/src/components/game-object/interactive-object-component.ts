import { GameObject, InteractiveObjectType } from "../../common/types";
import { BaseGameObjectComponent } from "./base-game-object-component";

export class InteractiveObjectsComponent extends BaseGameObjectComponent {
  private _objectType: InteractiveObjectType;
  private _callback: () => void;
  private _canInteractCheck: () => boolean;

  constructor(
    gameObject: GameObject,
    objectType: InteractiveObjectType,
    canInteractCheck: () => boolean = () => true,
    callback: () => undefined = () => undefined,
  ) {
    super(gameObject);
    this._callback = callback;
    this._objectType = objectType;
    this._canInteractCheck = canInteractCheck;
  }

  get objectType(): InteractiveObjectType {
    return this._objectType;
  }

  public interact() {
    this._callback();
  }

  public canInteractWith(): boolean {
    return this._canInteractCheck();
  }
}
