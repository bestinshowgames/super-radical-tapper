import Phaser from 'phaser';
import { GameManager, CueCreationConfig, GamePhase } from '../controllers';
import { Cue, CueStatus } from '../objects';
import ResponseText from '../objects/ResponseText/ResponseText';
import Text from '../objects/Text/Text';

export default class Game extends Phaser.Scene {
  gm: GameManager;
  timeInPhase = 0;
  cues: { [key: string]: Cue } = {};
  highlightedCue: Cue | undefined = undefined;

  eventEmitter: Phaser.Events.EventEmitter;

  constructor() {
    super('Game');
    this.eventEmitter = new Phaser.Events.EventEmitter();
    this.gm = new GameManager(this.eventEmitter);
  }

  create() {
    this.input.keyboard.createCursorKeys();

    this.add.existing(
      new Text(this, {
        x: 400,
        y: 50,
        text: 'Super Radical Tapper!',
        style: { font: '64px Toriko' },
      })
    );

    this.add.existing(
      new ResponseText(this, {
        x: 400,
        y: 150,
        text: 'OUCH!',
        style: { font: '64px Toriko' },
        visible: false,
        eventEmitter: this.eventEmitter,
        respondOn: 'fail',
      })
    );

    this.add.existing(
      new ResponseText(this, {
        x: 400,
        y: 150,
        text: 'SCORE!',
        style: { font: '64px Toriko' },
        visible: false,
        eventEmitter: this.eventEmitter,
        respondOn: 'succeed',
      })
    );

    this.input.keyboard.on('keydown', this.processInput, this);

    this.gm.cueConfigurations.forEach(
      (cueConfig: CueCreationConfig) =>
        (this.cues[cueConfig.id] = new Cue(this, cueConfig))
    );

    this.eventEmitter.on('presentCue', (cueKey: string) => {
      this.eventEmitter.emit('reset');
      this.highlightedCue = this.cues[cueKey];
      this.highlightedCue.highlight();
    });

    this.eventEmitter.on('displayResults', () => {
      const responseStatus = this.highlightedCue?.status;
      responseStatus === CueStatus.SUCCEED
        ? this.eventEmitter.emit('succeed')
        : this.eventEmitter.emit('fail');
    });
  }

  update(_time: number, delta: number) {
    this.timeInPhase += delta;
    this.timeInPhase = this.gm.handlePhaseUpdate(this.timeInPhase);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processInput(event: any) {
    const key: number = event.keyCode;
    if (this.gm.currentGamePhase === GamePhase.RESPONSE_COLLECTION) {
      const cueId: string | undefined = this.gm.cueForKey(key);
      if (cueId) {
        cueId == this.highlightedCue?.id
          ? this.eventEmitter.emit('succeed')
          : this.eventEmitter.emit('fail');
      }
      this.gm.currentGamePhase = this.gm.nextPhase();
      this.timeInPhase = 0;
    } else {
      // TODO: Add handling for non-gameplay keys, e.g. pause
    }
  }
}
