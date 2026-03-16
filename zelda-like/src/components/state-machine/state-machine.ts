import * as Phaser from "phaser";
import { ENABLE_LOGGING } from "../../common/config";

export interface State {
  stateMachine: StateMachine;
  name: string;
  onEnter?: (args: unknown[]) => void;
  onUpdate?: () => void;
}

export class StateMachine {
  private id: string;
  private states: Map<string, State>;
  private currentState?: State | undefined;
  private isChangingState: boolean;
  private changingStateQueue: {
    state: string;
    args: unknown[];
  }[];

  constructor(id?: string) {
    if (id === undefined) {
      this.id = Phaser.Math.RND.uuid();
    } else {
      this.id = id;
    }
    this.isChangingState = false;
    this.changingStateQueue = [];
    this.currentState = undefined;
    this.states = new Map();
  }

  public onUpdate(): void {
    const queuedState = this.changingStateQueue.shift();
    if (queuedState !== undefined) {
      this.setState(queuedState.state, queuedState.args);
      return;
    }
    if (this.currentState && this.currentState.onUpdate) {
      this.currentState.onUpdate();
    }
  }

  public setState(name: string, ...args: unknown[]): void {
    const methodName = "setState";
    if (!this.states.has(name)) {
      console.warn(
        `[${StateMachine.name}-${this.id}:${methodName}] Tried to change to unknown state`,
      );
      return;
    }
    if (this.isCurrentState(name)) {
      return;
    }

    this.isChangingState = true;
    this.log(
      methodName,
      `Change from ${this.currentState?.name ?? "none"} to ${name}`,
    );
    this.currentState = this.states.get(name);

    if (this.currentState?.onEnter) {
      this.currentState.onEnter(args);
    }
  }

  public addState(state: State): void {
    state.stateMachine = this;
    this.states.set(state.name, state);
  }

  private isCurrentState(name: string): boolean {
    if (!this.currentState) {
      return false;
    }

    return this.currentState.name === name;
  }

  private log(methodName: string, message: string) {
    if (!ENABLE_LOGGING) {
      return;
    }
    console.log(`[${StateMachine.name}-${this.id}:${methodName}] ${message}`);
  }
}
