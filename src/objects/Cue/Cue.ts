import Phaser from 'phaser';
import CueConfiguration, { HEX } from './CueConfiguration';
import eventsCenter from '../../scenes/game/EventsCenter';
import CueFacet from '../../scenes/game/CueFacet';
import { InputEvents } from '../../scenes/game/InputMediator';

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

  baseCircle: Phaser.GameObjects.Sprite;
  highlightedCircle: Phaser.GameObjects.Sprite;
  succeededCircle: Phaser.GameObjects.Sprite;
  failedCircle: Phaser.GameObjects.Sprite;
  edgar: Phaser.GameObjects.Image;
  radical: Phaser.GameObjects.Image;
  cueText?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, options: CueConfiguration) {
    super(scene, options.x, options.y);
    this.scene = scene;
    this.options = options;
    this.id = options.id;
    this._key = options.key;
    const { x, y } = options;

    this.baseCircle = this.createCircle(1);
    this.scene.add.existing(this.baseCircle);

    this.highlightedCircle = this.createCircle(3);
    this.scene.add.existing(this.highlightedCircle);

    this.succeededCircle = this.createCircle(4);
    this.scene.add.existing(this.succeededCircle);

    this.failedCircle = this.createCircle(2);
    this.scene.add.existing(this.failedCircle);

    this.edgar = this.scene.add
      .image(this.options.x, this.options.y, 'creatures', 32)
      .setScale(4, 4)
      .setActive(false);
    this.radical = this.scene.add
      .image(this.options.x, this.options.y, 'creatures', 38)
      .setScale(4, 4)
      .setTint(0x0a1ab1, 0x0a1ab1, 0x0a1ab1, 0x0a1ab1)
      .setActive(false);

    if (options.text) {
      this.cueText = this.scene.add.text(x, y, options.text, {
        font: '28px Clarity',
      });
      this.cueText.setStroke('black', 2);
      Phaser.Display.Align.In.Center(this.cueText, this.baseCircle);
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
    this.edgar.setVisible(true);
    this.cueText?.setVisible(false);
    this.status = CueStatus.SUCCEED;
  }

  fail() {
    this.reset();
    this.failedCircle.setVisible(true);
    this.radical.setVisible(true);
    this.cueText?.setVisible(false);
    this.status = CueStatus.FAIL;
  }

  private reset() {
    this.baseCircle.setVisible(false);
    this.highlightedCircle.setVisible(false);
    this.succeededCircle.setVisible(false);
    this.failedCircle.setVisible(false);
    this.edgar.setVisible(false);
    this.radical.setVisible(false);
    this.cueText?.setVisible(true);
  }

  createCircle(type: number) {
    const circle = this.scene.add
      .sprite(this.options.x, this.options.y, 'portals', type)
      .setScale(3, 3)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        const cueResponse = CueFacet.getFacetForKey(this.key);
        eventsCenter.emit('input', InputEvents.CUE_INPUT, cueResponse);
      });
    return circle;
  }
}
