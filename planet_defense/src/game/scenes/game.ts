import { GameObjects, Scene } from 'phaser';
import { SCENE_KEYS } from '../common/scenes.keys';
import { ASSET_KEYS } from '../common/assets';

export class Game extends Scene {
  private planet: Phaser.GameObjects.Sprite;
  private player: Phaser.GameObjects.Image;
  private playerAngleInRadians: number = 0;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private bulletGroup: Phaser.GameObjects.Group;
  private lastBulletTime: number = 0;

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

    this.bulletGroup = this.physics.add.group([]);
    this.cursorKeys = this.input.keyboard!.createCursorKeys();
  }

  update(time: number) {
    if (this.cursorKeys.left.isDown) {
      this.playerAngleInRadians -= 0.06;
    } else if (this.cursorKeys.right.isDown) {
      this.playerAngleInRadians += 0.06;
    }

    this.updatePLayerPosition();

    if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.space) && time > this.lastBulletTime + 200) {
      this.fireBullet();
      this.lastBulletTime = time;
    }

    this.bulletGroup.getChildren().forEach((bullet) => {
      const bulletSprite = bullet as Phaser.Physics.Arcade.Image;
      if (bulletSprite.active && (bulletSprite.x < 0 || bulletSprite.x > this.scale.width || bulletSprite.y < 0 || bulletSprite.y > this.scale.height)) {
        bulletSprite.setActive(false).setVisible(false);
      }
    });
  }

  private updatePLayerPosition() {
    const x = this.scale.width / 2 + (this.planet.displayHeight / 2) * Math.cos(this.playerAngleInRadians);
    const y = this.scale.height / 2 + (this.planet.displayHeight / 2) * Math.sin(this.playerAngleInRadians);
    this.player.setPosition(x, y);
    this.player.rotation = this.playerAngleInRadians + Math.PI / 2;
  }

  private fireBullet() {
    const x = this.player.x;
    const y = this.player.y;
    const velocity = this.physics.velocityFromRotation(this.playerAngleInRadians, 400);
    const bullet = this.bulletGroup.getFirstDead(true, x, y, ASSET_KEYS.BULLET, 0, true);
    bullet.setActive(true).setVisible(true).setScale(1.5).play(ASSET_KEYS.BULLET).enableBody();
    bullet.setVelocity(velocity.x, velocity.y);
    bullet.setRotation(this.player.rotation);
    console.log('fireBUllet: number of bullet', this.bulletGroup.getLength());
  }
}
