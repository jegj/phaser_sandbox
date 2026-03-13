import * as Phaser from "phaser";
import { GameObject } from "../../common/types";

export class BaseGameObjectComponent {
  protected scene: Phaser.Scene;
  protected gameObject: GameObject;

  constructor(gameObject: GameObject) {
    this.gameObject = gameObject;
    this.scene = gameObject.scene;
  }

  static getComponent<T>(gameObject: GameObject): T {
    return gameObject[`_${this.name}`] as T;
  }

  static removeComponent(gameObject: GameObject): void {
    delete gameObject[`_${this.constructor.name}`];
  }
  protected assignComponentToObject(object: GameObject): void {
    object[`_${this.constructor.name}`] = this;
  }
}
