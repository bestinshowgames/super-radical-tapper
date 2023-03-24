import Phaser from 'phaser';
import CueConfiguration, { HEX } from './CueConfiguration';

export enum CueStatus {
  REST,
  HIGHLIGHT,
  SUCCEED,
  FAIL,
}

export default class Cue extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  options: CueConfiguration;
  id: string;
  _key: number;
  private _status: CueStatus = CueStatus.REST;

  baseCircle: Phaser.GameObjects.Arc;
  defaultBaseColor: HEX = '#FF43C2';
  highlightedCircle: Phaser.GameObjects.Arc;
  defaultHighlightedColor: HEX = '#F8FF43';
  succeededCircle: Phaser.GameObjects.Arc;
  defaultSuccessColor: HEX = '#43FF63';
  failedCircle: Phaser.GameObjects.Arc;
  defaultFailureColor: HEX = '#FF4343';

  constructor(scene: Phaser.Scene, options: CueConfiguration) {
    super(scene, options.x, options.y);
    this.scene = scene;
    this.options = options;
    this.id = options.id;
    this._key = options.key;
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
        font: '28px Clarity',
      });
      cueText.setStroke('black', 2);
      Phaser.Display.Align.In.Center(cueText, this.baseCircle);
    }

    this.options.eventEmitter.on('succeed', () => {
      if (this.status == CueStatus.HIGHLIGHT) {
        this.succeed();
      }
    });

    this.options.eventEmitter.on('fail', () => {
      if (this.status == CueStatus.HIGHLIGHT) {
        this.fail();
      }
    });

    this.options.eventEmitter.addListener('reset', () => {
      if (this.status != CueStatus.REST) {
        this.rest();
      }
    });

    this.rest();
  }

  convertHEXToNumber(hex: HEX) {
    return parseInt(hex.replace(/^#/, ''), 16);
  }

  get status(): CueStatus {
    return this._status;
  }

  get key(): number {
    return this._key;
  }

  private set status(newStatus: CueStatus) {
    this._status = newStatus;
  }

  rest() {
    this.reset();
    this.baseCircle.setVisible(true);
    this.status = CueStatus.REST;
  }

  highlight() {
    this.reset();
    this.highlightedCircle.setVisible(true);
    this.status = CueStatus.HIGHLIGHT;
  }

  succeed() {
    this.reset();
    this.succeededCircle.setVisible(true);
    this.status = CueStatus.SUCCEED;
  }

  fail() {
    this.reset();
    this.failedCircle.setVisible(true);
    this.status = CueStatus.FAIL;
  }

  private reset() {
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
