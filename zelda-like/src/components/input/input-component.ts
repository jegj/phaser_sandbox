export abstract class InputComponent {
  abstract get isUpDown(): boolean;
  abstract get isUpJustDown(): boolean;
  abstract get isDownDown(): boolean;
  abstract get isDownJustDown(): boolean;
  abstract get isLeftDown(): boolean;
  abstract get isRightDown(): boolean;
  abstract get isActionKeyJustDown(): boolean;
  abstract get isAttackKeyJustDown(): boolean;
  abstract get isSelectKeyJustDown(): boolean;
  abstract get isEnterKeyJustDown(): boolean;
  abstract reset(): void;
}
