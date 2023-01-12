import Phaser from 'phaser';
import { GameManager, CueCreationConfig, GamePhase } from '../controllers';
import type { GamePhaseController } from '../controllers';
import { Cue, CueStatus } from '../objects';

interface GameContainer {
  readonly failText?: Phaser.GameObjects.Text;
  readonly successText?: Phaser.GameObjects.Text;
  highlightedCue?: Cue;
  cues: { [key: string]: Cue };
  resetCues(): void;
  resetResultTexts(): void;
}

class GameController implements GamePhaseController {
  readonly container: GameContainer;
  constructor(container: GameContainer) {
    this.container = container;
  }

  displayResults(): void {
    const responseStatus = this.container.highlightedCue?.status;
    const didSucceed = responseStatus === CueStatus.SUCCEED;
    if (!didSucceed) {
      this.container.failText?.setVisible(true);
      this.container.highlightedCue?.fail();
    } else {
      this.container.successText?.setVisible(true);
    }
  }

  presentCue(cueKey: string): integer {
    this.container.resetCues();
    this.container.highlightedCue = this.container.cues[cueKey];
    this.container.highlightedCue.highlight();
    return 0;
  }

  waitForResponse(): integer {
    this.container.resetResultTexts();
    this.container.resetCues();
    return 0;
  }
}

export default class Game extends Phaser.Scene implements GameContainer {
  failText: Phaser.GameObjects.Text | undefined = undefined;
  successText: Phaser.GameObjects.Text | undefined = undefined;
  gm: GameManager;
  controller: GameController;
  timeInPhase = 0;
  cues: { [key: string]: Cue } = {};
  highlightedCue: Cue | undefined = undefined;

  constructor() {
    super('Game');
    this.gm = new GameManager();
    this.controller = new GameController(this);
  }

  create() {
    this.input.keyboard.createCursorKeys();
    this.add
      .text(400, 50, 'Super Radical Tapper', { font: '64px Toriko' })
      .setOrigin(0.5);

    this.failText = this.add
      .text(400, 150, 'OUCH!', { font: '64px Toriko' })
      .setOrigin(0.5)
      .setVisible(false);

    this.successText = this.add
      .text(400, 150, 'SCORE!', { font: '64px Toriko' })
      .setOrigin(0.5)
      .setVisible(false);

    this.input.keyboard.on('keydown', this.processInput, this);

    this.gm.cueConfigurations.forEach(
      (cueConfig: CueCreationConfig) =>
        (this.cues[cueConfig.id] = new Cue(this, cueConfig))
    );
  }

  update(_time: number, delta: number) {
    this.timeInPhase += delta;
    this.timeInPhase = this.gm.handlePhaseUpdate(
      this.timeInPhase,
      this.controller
    );
  }

  resetCues() {
    Object.keys(this.cues).forEach((cueId) => this.cues[cueId].rest());
  }

  resetResultTexts() {
    this.failText?.setVisible(false);
    this.successText?.setVisible(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processInput(event: any) {
    const key: number = event.keyCode;
    if (this.gm.currentGamePhase === GamePhase.RESPONSE_COLLECTION) {
      const cueId: string | undefined = this.gm.cueForKey(key);
      if (cueId && cueId == this.highlightedCue?.id) {
        this.highlightedCue?.succeed();
      } else {
        this.highlightedCue?.fail();
      }
      this.gm.currentGamePhase = this.gm.nextPhase();
      this.timeInPhase = 0;
    } else {
      // TODO: Add handling for non-gameplay keys, e.g. pause
    }
  }
}
