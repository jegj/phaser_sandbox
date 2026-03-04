import { Scene } from 'phaser';
import { SCENE_KEYS } from '../common/scenes.keys';
import { ASSET_KEYS } from '../common/assets';

export class Game extends Scene {
  private planet: Phaser.GameObjects.Sprite;
  private player: Phaser.GameObjects.Image;
  private playerAngleInRadians: number = 0;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super(
      {
        key: SCENE_KEYS.GAME_SCENE
      }
    );
  }

  create() {
    this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_1).setOrigin(0).setScale(1, 1.25).play(ASSET_KEYS.BACKGROUND_1).setAlpha(0.5);
    this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_2).setOrigin(0).setScale(1, 1.25).play(ASSET_KEYS.BACKGROUND_2).setAlpha(0.5);
    this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_3).setOrigin(0).setScale(1, 1.25).play(ASSET_KEYS.BACKGROUND_3).setAlpha(0.5);
    this.planet = this.add.sprite(this.scale.width / 2, this.scale.height / 2, ASSET_KEYS.PLANET).setScale(1.5).play(ASSET_KEYS.PLANET);
    this.player = this.add.image(0, 0, ASSET_KEYS.SHIP);
    this.playerAngleInRadians = 0;
    this.updatePLayerPosition();

    this.cursorKeys = this.input.keyboard!.createCursorKeys();
  }

  update() {
    if (this.cursorKeys.left.isDown) {
      this.playerAngleInRadians -= 0.06;
    } else if (this.cursorKeys.right.isDown) {
      this.playerAngleInRadians += 0.06;
    }

    this.updatePLayerPosition();
  }

  private updatePLayerPosition() {
    const x = this.scale.width / 2 + (this.planet.displayHeight / 2) * Math.cos(this.playerAngleInRadians);
    const y = this.scale.height / 2 + (this.planet.displayHeight / 2) * Math.sin(this.playerAngleInRadians);
    this.player.setPosition(x, y);
    this.player.rotation = this.playerAngleInRadians + Math.PI / 2;
  }
}
