import GamePhaseController from './GamePhaseController.interface';
import { Input } from 'phaser';
import { CueConfiguration } from '../objects';

export interface CueCreationConfig extends CueConfiguration {
  key: number;
}

const cueConfigs: CueCreationConfig[] = [
  {
    id: 'LL',
    x: 160,
    y: 300,
    radius: 50,
    text: 'D',
    key: Input.Keyboard.KeyCodes.D,
  },
  {
    id: 'L',
    x: 320,
    y: 300,
    radius: 50,
    text: 'F',
    key: Input.Keyboard.KeyCodes.F,
  },
  {
    id: 'R',
    x: 480,
    y: 300,
    radius: 50,
    text: 'J',
    key: Input.Keyboard.KeyCodes.J,
  },
  {
    id: 'RR',
    x: 640,
    y: 300,
    radius: 50,
    text: 'K',
    key: Input.Keyboard.KeyCodes.K,
  },
];

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
  private m_phaseLength = this.m_sequnceLength * this.m_sequenceIterations;

  private m_structuredPhase: string[];

  private m_cueSelector: Generator<string, string, unknown>;

  constructor() {
    this.m_currentGamePhase = GamePhase.START;
    this.m_structuredPhase = this.buildStructuredPhase();
    this.m_cueSelector = this.cueGenerator();
    console.log(this.m_structuredPhase);
  }

  get cueConfigurations(): CueCreationConfig[] {
    return cueConfigs;
  }

  get currentGamePhase(): GamePhase {
    return this.m_currentGamePhase;
  }

  set currentGamePhase(newGamePhase: GamePhase) {
    this.m_currentGamePhase = newGamePhase;
  }

  nextPhase(): GamePhase {
    return this.phaseConfiguration[this.currentGamePhase].nextPhase;
  }

  phaseDuration(gamePhase: GamePhase): number {
    return this.phaseConfiguration[gamePhase].duration;
  }

  buildStructuredPhase(): string[] {
    let phase: string[] = [];
    // this.m_structuredSequence = this.buildSequence();
    [...Array(this.m_sequenceIterations)].forEach(() => {
      phase = phase.concat([...this.m_structuredSequence]);
    });
    return phase;
  }

  buildSequence(): string[] {
    let sequence: string[] = [];
    [...Array(this.m_sequnceLength)].forEach(() => {
      sequence.push(this.randomCueId());
    });
    return sequence;
  }

  randomCueId(): string {
    return cueConfigs[Math.floor(Math.random() * cueConfigs.length)].id;
  }

  *cueGenerator(): Generator<string, string, unknown> {
    while (true) {
      for (const id of this.m_structuredPhase) {
        yield id;
      }
      let i = 1;
      while (i < this.m_phaseLength) {
        yield cueConfigs[Math.floor(Math.random() * cueConfigs.length)].id;
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

  handlePhaseUpdate(
    timeInPhase: integer,
    phaseController: GamePhaseController
  ): integer {
    const phaseDuration = this.phaseDuration(this.currentGamePhase);
    let resultTime = timeInPhase;
    if (this.currentGamePhase === GamePhase.DISPLAY_RESULTS) {
      phaseController.displayResults();
    }

    if (timeInPhase >= phaseDuration) {
      const newPhase = this.nextPhase();
      this.currentGamePhase = newPhase;
      if (newPhase === GamePhase.PRESENTATION) {
        phaseController.presentCue(this.m_cueSelector.next().value);
      } else if (newPhase === GamePhase.WAIT) {
        phaseController.waitForResponse();
      }
      resultTime = 0;
    }

    return resultTime;
  }
}
