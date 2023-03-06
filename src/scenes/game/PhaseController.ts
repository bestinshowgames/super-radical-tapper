import { Scene } from 'phaser';

export enum GamePhase {
  START,
  PRESENTATION,
  RESPONSE_COLLECTION,
  DISPLAY_RESULTS,
  WAIT,
}

export default class PhaseController {
  private _scene: Scene;
  private _phaseConfiguration: { [key in GamePhase]: any };
  private _currentPhase: GamePhase;
  private _timeInPhase: number = 0;

  constructor(scene: Scene) {
    this._scene = scene;

    // TODO: Make this configurable/changeable
    this._phaseConfiguration = {
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

    this._currentPhase = GamePhase.START;

    this.setupEvents();
  }

  phaseDuration(gamePhase: GamePhase): number {
    return this._phaseConfiguration[gamePhase].duration;
  }

  nextPhase(gamePhase: GamePhase): GamePhase {
    return this._phaseConfiguration[gamePhase].nextPhase;
  }

  get currentPhase(): GamePhase {
    return this._currentPhase;
  }

  set currentPhase(newPhase: GamePhase) {
    this._currentPhase = newPhase;
  }

  get timeInPhase(): number {
    return this._timeInPhase;
  }

  endPhase(premature: boolean = false): void {
    const newPhase = this.nextPhase(this._currentPhase);
    this._scene.events.emit(
      'changePhase',
      this._currentPhase,
      newPhase,
      premature
    );
    this._currentPhase = newPhase;
    this._timeInPhase = 0;
  }

  setupEvents(): void {
    this._scene.events.on('update', (_time: number, delta: number) => {
      this._timeInPhase += delta;
      if (this._timeInPhase >= this.phaseDuration(this._currentPhase)) {
        this.endPhase();
      }
    });
  }
}
