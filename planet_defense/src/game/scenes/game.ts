import { Scene } from 'phaser';
import { SCENE_KEYS } from '../common/scenes.keys';
import { ASSET_KEYS } from '../common/assets';


const DATA_KEYS = {
  ROTATION_SPEED: 'ROTATION_SPEED',
}

export class Game extends Scene {
  private planet: Phaser.Physics.Arcade.Image;
  private player: Phaser.GameObjects.Image;
  private playerAngleInRadians: number = 0;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private bulletGroup: Phaser.GameObjects.Group;
  private lastBulletTime: number = 0;
  private enemyGroup: Phaser.GameObjects.Group;
  private destroyedEnemyGroup: Phaser.GameObjects.Group;
  private enemySpeed: number;
  private spawnDelay: number;
  private spawnTimer: Phaser.Time.TimerEvent;
  private score: number = 0;
  private lives: number = 3;
  private lockInput: boolean = false;
  private scoreText: Phaser.GameObjects.Text;

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
    this.planet = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, ASSET_KEYS.PLANET).setScale(1.5).play(ASSET_KEYS.PLANET);
    this.planet.body!.setCircle(30, 18, 18);
    this.player = this.add.image(0, 0, ASSET_KEYS.SHIP);
    this.playerAngleInRadians = 0;
    this.updatePLayerPosition();

    this.bulletGroup = this.physics.add.group([]);
    this.enemyGroup = this.physics.add.group([]);
    this.destroyedEnemyGroup = this.add.group([]);
    this.spawnDelay = 1250;
    this.enemySpeed = 50;
    this.spawnTimer = this.time.addEvent({
      delay: this.spawnDelay,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
    this.time.addEvent({
      delay: 10000,
      callback: this.increaseDifficulty,
      callbackScope: this,
      loop: true
    });
    this.lives = 3;
    this.score = 0;
    const scoreTextPrefix = this.add.text(10, 10, "Score:", { fontSize: '16px' }).setDepth(2);
    this.scoreText = this.add.text(scoreTextPrefix.x + scoreTextPrefix.displayWidth, scoreTextPrefix.y, this.score.toString(), { fontSize: '16px' }).setDepth(2);
    this.lockInput = false;
    this.physics.add.overlap(this.bulletGroup, this.enemyGroup, this.handleBulletEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
    this.physics.add.overlap(this.planet, this.enemyGroup, this.handlePlanetEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
    this.cursorKeys = this.input.keyboard!.createCursorKeys();
  }

  update(time: number) {
    if (this.lockInput) {
      return
    }

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
    this.enemyGroup.getChildren().forEach((enemy) => {
      const enemySprite = enemy as Phaser.Physics.Arcade.Image;
      if (enemySprite.active && (enemySprite.x < 0 || enemySprite.x > this.scale.width || enemySprite.y < 0 || enemySprite.y > this.scale.height)) {
        enemySprite.setActive(false).setVisible(false);
        return;
      }
      enemySprite.rotation += enemySprite.getData(DATA_KEYS.ROTATION_SPEED);
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

  spawnEnemy() {
    let x, y;
    const edge = Phaser.Math.Between(0, 3);
    if (edge === 0) {
      x = 0;
      y = Phaser.Math.Between(0, this.scale.height);
    } else if (edge === 1) {
      x = this.scale.width;
      y = Phaser.Math.Between(0, this.scale.height);
    } else {
      x = Phaser.Math.Between(0, this.scale.width);
      y = 0;
    }
    const enemy = this.enemyGroup.getFirstDead(true, x, y, ASSET_KEYS.ASTEROID, 0, true);
    enemy.setActive(true).setVisible(true).enableBody().setScale(Phaser.Math.FloatBetween(0.75, 1.25)).setData(DATA_KEYS.ROTATION_SPEED, Phaser.Math.FloatBetween(-0.05, 0.05));
    enemy.body.setSize(enemy.displayWidth * 0.3, enemy.displayHeight * 0.3);
    console.log('spawnEnemy: number of enemy', this.enemyGroup.getLength());
    this.physics.moveTo(enemy, this.planet.x, this.planet.y, this.enemySpeed);
  }

  increaseDifficulty() {
    if (this.spawnDelay > 500) {
      this.spawnDelay -= 50;
      console.log('increaseDifficulty: spawnDelay', this.spawnDelay);
      this.spawnTimer.destroy();
      this.spawnTimer = this.time.addEvent({
        delay: this.spawnDelay,
        callback: this.spawnEnemy,
        callbackScope: this,
        loop: true
      });
    }
    if (this.enemySpeed < 200) {
      this.enemySpeed += 10;
      console.log('increaseDifficulty: enemySpeed', this.enemySpeed);
    }
  }

  private handleBulletEnemyCollision(bullet: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    const bulletSprite = bullet as Phaser.Physics.Arcade.Image;
    const enemySprite = enemy as Phaser.Physics.Arcade.Image;
    bulletSprite.disableBody();
    bulletSprite.setActive(false).setVisible(false);
    enemySprite.disableBody();
    enemySprite.setActive(false).setVisible(false);
    this.score += 1;
    this.scoreText.setText(this.score.toString(10));
    this.spawnDestroyedEnemy(enemySprite.x, enemySprite.y);
  }

  private spawnDestroyedEnemy(x: number, y: number) {
    const explosion = this.destroyedEnemyGroup.getFirstDead(true, x, y, ASSET_KEYS.ASTEROID_EXPLODE, 0, true) as Phaser.GameObjects.Sprite;
    explosion.setActive(true).setVisible(true).play(ASSET_KEYS.ASTEROID_EXPLODE);
    explosion.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      explosion.setActive(false).setVisible(false);
    });
  }

  private handlePlanetEnemyCollision(planet: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    const enemySprite = enemy as Phaser.Physics.Arcade.Image;
    enemySprite.disableBody();
    enemySprite.setActive(false).setVisible(false);
    this.spawnDestroyedEnemy(enemySprite.x, enemySprite.y);
    this.damagePlanet();
  }


  private damagePlanet() {
    if (this.lives <= 0) {
      return
    }
    this.lives -= 1;

    this.cameras.main.shake(150, 0.02)
    this.tweens.add({
      targets: this.planet,
      scaleX: 1.1,
      scaleY: 0.9,
      duration: 100,
      ease: Phaser.Math.Easing.Sine.InOut,
      yoyo: true,
    });

    if (this.lives <= 0) {
      this.lockInput = true;
      this.player.setVisible(false);
      this.planet.disableBody();
      this.planet.setActive(false).setVisible(false);
      this.spawnDestroyedEnemy(this.planet.x, this.planet.y);
      this.scene.start(SCENE_KEYS.GAME_OVER_SCENE, {
        score: this.score
      });
    }
  }
}
