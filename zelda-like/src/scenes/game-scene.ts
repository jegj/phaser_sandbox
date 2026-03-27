import * as Phaser from "phaser";
import { ASSET_KEYS } from "../common/assets";
import { DIRECTION } from "../common/common";
import { PLAYER_START_MAX_HEALTH } from "../common/config";
import { KeyboardComponent } from "../components/input/keyboard-component";
import { CharacterGameObject } from "../game-objects/common/character-game-object";
import { Spider } from "../game-objects/enemies/spider";
import { Wisp } from "../game-objects/enemies/wisp";
import { Chest } from "../game-objects/objects/chest";
import { Pot } from "../game-objects/objects/pot";
import { Player } from "../game-objects/player/player";
import { SCENE_KEYS } from "./scene-keys";

export class GameScene extends Phaser.Scene {
  private player: Player;
  private controls: KeyboardComponent;
  private enemyGroup: Phaser.GameObjects.Group;
  private _blockingGroup: Phaser.GameObjects.Group;
  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    });
  }

  public create(): void {
    if (!this.input.keyboard) {
      console.warn(
        "Keyboard input is not available. Controls will not be initialized.",
      );
      return;
    }
    this.controls = new KeyboardComponent(this.input.keyboard);
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Game Scene", {
        fontFamily: ASSET_KEYS.FONT_PRESS_START_2P,
      })
      .setOrigin(0.5);
    this.player = new Player({
      scene: this,
      position: { x: this.scale.width / 2, y: this.scale.height / 2 },
      controls: this.controls,
      maxLife: PLAYER_START_MAX_HEALTH,
      currentLife: PLAYER_START_MAX_HEALTH,
    });

    this.enemyGroup = this.add.group(
      [
        new Spider({
          scene: this,
          position: { x: this.scale.width / 2, y: this.scale.height / 2 + 50 },
        }),
        new Wisp({
          scene: this,
          position: { x: this.scale.width / 2, y: this.scale.height / 2 - 50 },
        }),
      ],
      {
        runChildUpdate: true,
      },
    );

    this._blockingGroup = this.add.group([
      new Pot({
        scene: this,
        position: { x: this.scale.width / 2 + 90, y: this.scale.height / 2 },
      }),

      new Chest({
        scene: this,
        position: { x: this.scale.width / 2 - 90, y: this.scale.height / 2 },
        requireBossKey: false,
      }),
      new Chest({
        scene: this,
        position: {
          x: this.scale.width / 2 - 90,
          y: this.scale.height / 2 - 80,
        },
        requireBossKey: true,
      }),
    ]);
    this.registerColliders();
  }

  private registerColliders(): void {
    this.enemyGroup.getChildren().forEach((enemy) => {
      const enemyGameObject = enemy as CharacterGameObject;
      enemyGameObject.setCollideWorldBounds();
    });

    this.physics.add.overlap(this.player, this.enemyGroup, (player, enemy) => {
      console.log("hit");
      this.player.hit(DIRECTION.DOWN, 1);
      const enemyGameObject = enemy as CharacterGameObject;
      enemyGameObject.hit(this.player.direction, 1);
    });
    this.physics.add.collider(
      this.player,
      this._blockingGroup,
      (player, blockObject) => {},
    );
    this.physics.add.collider(
      this.enemyGroup,
      this._blockingGroup,
      (player, blockObject) => {},
    );
  }
}
