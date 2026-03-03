import { AUTO, Game } from 'phaser';
import { Preload } from './scenes/preload.ts';
import { Game as GameScene } from './scenes/game.ts';
import { SCENE_KEYS } from './common/scenes.keys';

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  pixelArt: true,
  roundPixels: true,
  scale: {
    parent: 'game-container',
    width: 640,
    height: 450,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT
  },
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: true
    }
  }
};

const StartGame = (parent: string) => {
  const game = new Game({ ...config, parent });
  game.scene.add(SCENE_KEYS.PRELOAD_SCENE, Preload);
  game.scene.add(SCENE_KEYS.GAME_SCENE, GameScene);
  game.scene.start(SCENE_KEYS.PRELOAD_SCENE);
  return game;
}

export default StartGame;
