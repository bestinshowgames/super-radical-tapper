import { Input, Events } from 'phaser';
import { CueConfiguration } from '../objects';

export interface CueCreationConfig extends CueConfiguration {
  key: number;
}

export enum GamePhase {
  START,
  PRESENTATION,
  RESPONSE_COLLECTION,
  DISPLAY_RESULTS,
  WAIT,
}

export default class GameManager {
  private phaseConfiguration = {
    [GamePhase.START]: {
      duration: 3000,
      nextPhase: GamePhase.PRESENTATION,
    },
    [GamePhase.PRESENTATION]: {
      duration: 0,
      nextPhase: GamePhase.RESPONSE_COLLECTION,
    },
    [GamePhase.RESPONSE_COLLECTION]: {
      duration: 500,
      nextPhase: GamePhase.DISPLAY_RESULTS,
    },
    [GamePhase.DISPLAY_RESULTS]: {
      duration: 500,
      nextPhase: GamePhase.WAIT,
    },
    [GamePhase.WAIT]: {
      duration: 250,
      nextPhase: GamePhase.PRESENTATION,
    },
  };

  private m_currentGamePhase: GamePhase;

  private m_eventEmitter: Events.EventEmitter;
  private m_cueConfigurations: CueCreationConfig[] = [];

  // TODO: make these magic numbers less magic
  private m_structuredSequence: string[] = [
    'LL',
    'L',
    'LL',
    'R',
    'RR',
    'L',
    'R',
    'LL',
    'RR',
    'R',
    'L',
    'RR',
  ];
  private m_sequnceLength = 12;
  private m_sequenceIterations = 8;
  private m_presentationPhaseLength =
    this.m_sequnceLength * this.m_sequenceIterations;

  private m_structuredPresentationPhase: string[];

  private m_cueSelector: Generator<string, string, unknown>;

  constructor(eventEmitter: Events.EventEmitter) {
    this.m_eventEmitter = eventEmitter;
    this.constructCueConfigurations();
    this.m_currentGamePhase = GamePhase.START;
    this.m_structuredPresentationPhase =
      this.buildStructuredPresentationPhase();
    this.m_cueSelector = this.cueGenerator();
  }

  constructCueConfigurations() {
    this.m_cueConfigurations = [
      {
        id: 'LL',
        x: 160,
        y: 300,
        radius: 50,
        text: 'D',
        key: Input.Keyboard.KeyCodes.D,
        eventEmitter: this.m_eventEmitter,
      },
      {
        id: 'L',
        x: 320,
        y: 300,
        radius: 50,
        text: 'F',
        key: Input.Keyboard.KeyCodes.F,
        eventEmitter: this.m_eventEmitter,
      },
      {
        id: 'R',
        x: 480,
        y: 300,
        radius: 50,
        text: 'J',
        key: Input.Keyboard.KeyCodes.J,
        eventEmitter: this.m_eventEmitter,
      },
      {
        id: 'RR',
        x: 640,
        y: 300,
        radius: 50,
        text: 'K',
        key: Input.Keyboard.KeyCodes.K,
        eventEmitter: this.m_eventEmitter,
      },
    ];
  }

  get cueConfigurations(): CueCreationConfig[] {
    return this.m_cueConfigurations;
  }

  get currentGamePhase(): GamePhase {
    return this.m_currentGamePhase;
  }

  set currentGamePhase(newGamePhase: GamePhase) {
    this.m_currentGamePhase = newGamePhase;
  }

  get structuredSequence(): string[] {
    return this.m_structuredSequence;
  }

  get sequenceIterations(): number {
    return this.m_sequenceIterations;
  }

  get presentationPhaseLength(): number {
    return this.m_presentationPhaseLength;
  }

  get cueSelector(): Generator<string, string, undefined> {
    return this.m_cueSelector;
  }

  nextPhase(): GamePhase {
    return this.phaseConfiguration[this.currentGamePhase].nextPhase;
  }

  phaseDuration(gamePhase: GamePhase): number {
    return this.phaseConfiguration[gamePhase].duration;
  }

  buildStructuredPresentationPhase(): string[] {
    let phase: string[] = [];
    [...Array(this.m_sequenceIterations)].forEach(() => {
      phase = phase.concat([...this.m_structuredSequence]);
    });
    return phase;
  }

  randomCueId(): string {
    return this.m_cueConfigurations[
      Math.floor(Math.random() * this.m_cueConfigurations.length)
    ].id;
  }

  *cueGenerator(): Generator<string, string, unknown> {
    while (true) {
      for (const id of this.m_structuredPresentationPhase) {
        yield id;
      }
      let i = 1;
      while (i <= this.m_presentationPhaseLength) {
        yield this.randomCueId();
        i++;
      }
    }
  }

  cueForKey(keyCode: number): string | undefined {
    const cueForKey = this.cueConfigurations.find(
      (config) => config.key == keyCode
    );
    return cueForKey?.id;
  }

  handlePhaseUpdate(timeInPhase: integer): integer {
    const phaseDuration = this.phaseDuration(this.currentGamePhase);
    let resultTime = timeInPhase;
    if (this.currentGamePhase === GamePhase.DISPLAY_RESULTS) {
      this.m_eventEmitter.emit('displayResults');
    }

    if (timeInPhase >= phaseDuration) {
      const newPhase = this.nextPhase();
      this.currentGamePhase = newPhase;
      if (newPhase === GamePhase.PRESENTATION) {
        this.m_eventEmitter.emit('presentCue', this.m_cueSelector.next().value);
      } else if (newPhase === GamePhase.WAIT) {
        this.m_eventEmitter.emit('reset');
      }
      resultTime = 0;
    }

    return resultTime;
  }
}
