import GamePhaseController from './GamePhaseController.interface';
import { Input } from 'phaser';
import { CueConfiguration } from '../objects';

export interface CueCreationConfig extends CueConfiguration {
  key: number;
}

const cueConfigs: CueCreationConfig[] = [
  {
    id: 'LL_CUE',
    x: 160,
    y: 300,
    radius: 50,
    text: 'D',
    key: Input.Keyboard.KeyCodes.D,
  },
  {
    id: 'L_CUE',
    x: 320,
    y: 300,
    radius: 50,
    text: 'F',
    key: Input.Keyboard.KeyCodes.F,
  },
  {
    id: 'R_CUE',
    x: 480,
    y: 300,
    radius: 50,
    text: 'J',
    key: Input.Keyboard.KeyCodes.J,
  },
  {
    id: 'RR_CUE',
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
      duration: 750,
      nextPhase: GamePhase.PRESENTATION,
    },
  };

  private m_currentGamePhase: GamePhase;

  constructor() {
    this.m_currentGamePhase = GamePhase.START;
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

  selectCue(): string {
    return cueConfigs[Math.floor(Math.random() * cueConfigs.length)].id;
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
        phaseController.presentCue(this.selectCue());
      } else if (newPhase === GamePhase.WAIT) {
        phaseController.waitForResponse();
      }
      resultTime = 0;
    }

    return resultTime;
  }
}
