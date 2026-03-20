import { CharacterGameObject } from "../../../../game-objects/common/character-game-object";
import { State, StateMachine } from "../../state-machine";

export abstract class BaseCharacterState implements State {
  protected _gameObject: CharacterGameObject;
  protected _stateMachine: StateMachine;
  private _name: string;

  constructor(name: string, gameObject: CharacterGameObject) {
    this._name = name;
    this._gameObject = gameObject;
  }

  get name(): string {
    return this._name;
  }

  set stateMachine(stateMachine: StateMachine) {
    this._stateMachine = stateMachine;
  }
}
