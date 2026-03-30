import * as Phaser from "phaser";
import { CHARACTER_ANIMATIONS } from "./assets";
import { CHEST_STATE, DIRECTION, INTERACTIVE_OBJECT_TYPE } from "./common";

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

export type Direction = keyof typeof DIRECTION;

export type ChestState = keyof typeof CHEST_STATE;

export type InteractiveObjectType = keyof typeof INTERACTIVE_OBJECT_TYPE;
