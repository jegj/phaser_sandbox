import { Player } from "../../../../game-objects/player/player";
import { State, StateMachine } from "../../state-machine";

export abstract class BaseCharacterState implements State {
  protected _gameObject: Player;
  protected _stateMachine: StateMachine;
  private _name: string;

  constructor(name: string, gameObject: Player) {
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
