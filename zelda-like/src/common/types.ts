import * as Phaser from "phaser";
import { CHARACTER_ANIMATIONS } from "./assets";

export type CharacterAnimation = keyof typeof CHARACTER_ANIMATIONS;

export type Position = {
  x: number;
  y: number;
};

type ComponentMap = Record<`_${string}`, unknown>;
export type GameObject = (
  | Phaser.GameObjects.Sprite
  | Phaser.GameObjects.Image
) &
  ComponentMap;
