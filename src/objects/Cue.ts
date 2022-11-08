import Phaser from 'phaser';

export type HEX = `#${string}`;

export interface CueOptions {
  x: number;
  y: number;
  radius: number;
  baseColor?: HEX;
  highlightColor?: HEX;
  successColor?: HEX;
  failureColor?: HEX;
  text?: string;
}

export default class Cue extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  options: CueOptions;

  baseCircle: Phaser.GameObjects.Arc;
  defaultBaseColor: HEX = '#FF43C2';
  highlightedCircle: Phaser.GameObjects.Arc;
  defaultHighlightedColor: HEX = '#F8FF43';
  succeededCircle: Phaser.GameObjects.Arc;
  defaultSuccessColor: HEX = '#43FF63';
  failedCircle: Phaser.GameObjects.Arc;
  defaultFailureColor: HEX = '#FF4343';

  constructor(scene: Phaser.Scene, options: CueOptions) {
    super(scene, options.x, options.y);
    this.scene = scene;
    this.options = options;
    const { x, y } = options;

    this.baseCircle = this.createCircle();
    this.scene.add.existing(this.baseCircle);

    this.highlightedCircle = this.createCircle('highlight');
    this.scene.add.existing(this.highlightedCircle);

    this.succeededCircle = this.createCircle('success');
    this.scene.add.existing(this.succeededCircle);

    this.failedCircle = this.createCircle('failure');
    this.scene.add.existing(this.failedCircle);

    if (options.text) {
      const cueText = this.scene.add.text(x, y, options.text, {
        font: 'Toriko'
      });
      Phaser.Display.Align.In.Center(cueText, this.baseCircle);
    }

    this.rest();
  }

  convertHEXToNumber(hex: HEX) {
    return parseInt(hex.replace(/^#/, ''), 16);
  }

  rest() {
    this.reset();
    this.baseCircle.setVisible(true);
  }

  highlight() {
    this.reset();
    this.highlightedCircle.setVisible(true);
  }

  succeed() {
    this.reset();
    this.succeededCircle.setVisible(true);
  }

  fail() {
    this.reset();
    this.failedCircle.setVisible(true);
  }

  reset() {
    this.baseCircle.setVisible(false);
    this.highlightedCircle.setVisible(false);
    this.succeededCircle.setVisible(false);
    this.failedCircle.setVisible(false);
  }

  createCircle(type?: string) {
    const circle = this.scene.add.circle(
      this.options.x,
      this.options.y,
      this.options.radius
    );
    switch (type) {
      case 'highlight':
        circle.setFillStyle(
          this.convertHEXToNumber(
            this.options.highlightColor ?? this.defaultHighlightedColor
          )
        );
        break;
      case 'success':
        circle.setFillStyle(
          this.convertHEXToNumber(
            this.options.successColor ?? this.defaultSuccessColor
          )
        );
        break;
      case 'failure':
        circle.setFillStyle(
          this.convertHEXToNumber(
            this.options.failureColor ?? this.defaultFailureColor
          )
        );
        break;
      default:
        circle.setFillStyle(
          this.convertHEXToNumber(
            this.options.baseColor ?? this.defaultBaseColor
          )
        );
    }
    return circle;
  }
}
