import eventsCenter from './EventsCenter';

export enum GamePhase {
  START,
  PRESENTATION,
  RESPONSE_COLLECTION,
  DISPLAY_RESULTS,
  WAIT,
}

export default class PhaseController {
  private _phaseConfiguration: { [key in GamePhase]: any };
  private _currentPhase: GamePhase;
  private _timeInPhase: number = 0;
  private _gameOver: boolean = false;

  private _startingResponseDurationMS: number = 500;
  private _endingResponseDurationMS: number = 250;
  private _responseDurationChange;

  constructor() {
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
        duration: this._startingResponseDurationMS,
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

    this._responseDurationChange = Math.floor(
      (this._startingResponseDurationMS - this._endingResponseDurationMS) / 50
    );

    this._currentPhase = GamePhase.START;

    eventsCenter.on('update', (_time: number, delta: number) => {
      if (!this._gameOver) {
        this.handleUpdate(delta);
      }
    });

    eventsCenter.on('restart', () => {
      this.reset();
    });

    eventsCenter.on('gameOver', () => {
      this.reset();
      this._gameOver = true;
    });

    eventsCenter.on('succeed', () => {
      let newResponseDuration =
        this._phaseConfiguration[GamePhase.RESPONSE_COLLECTION].duration;
      if (newResponseDuration > this._endingResponseDurationMS) {
        newResponseDuration -= this._responseDurationChange;
        if (newResponseDuration < this._endingResponseDurationMS) {
          newResponseDuration = this._endingResponseDurationMS;
        }
        this._phaseConfiguration[GamePhase.RESPONSE_COLLECTION].duration =
          newResponseDuration;
      }
    });
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

  get maximumResponseDuration(): number {
    return this._startingResponseDurationMS;
  }

  set currentPhase(newPhase: GamePhase) {
    this._currentPhase = newPhase;
  }

  get timeInPhase(): number {
    return this._timeInPhase;
  }

  set timeInPhase(timeInPhase: number) {
    this._timeInPhase = timeInPhase;
  }

  set gameOver(gameOver: boolean) {
    this._gameOver = gameOver;
  }

  get gameOver(): boolean {
    return this._gameOver;
  }

  handleUpdate(delta: number): void {
    this._timeInPhase += delta;
    if (this._timeInPhase >= this.phaseDuration(this._currentPhase)) {
      this.endPhase();
    }
  }

  endPhase(premature: boolean = false): void {
    const newPhase = this.nextPhase(this._currentPhase);
    eventsCenter.emit(
      'changePhase',
      this._currentPhase,
      newPhase,
      premature,
      this._timeInPhase
    );
    this._currentPhase = newPhase;
    this._timeInPhase = 0;
  }

  reset() {
    this._currentPhase = GamePhase.START;
    this._phaseConfiguration[GamePhase.RESPONSE_COLLECTION].duration =
      this._startingResponseDurationMS;
    this._timeInPhase = 0;
    this._gameOver = false;
  }
}
