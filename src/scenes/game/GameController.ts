import eventsCenter from './EventsCenter';
import CueContainer from './CueContainer';
import CueGenerator from './CueGenerator';
import PhaseController from './PhaseController';
import { InputEvents } from './InputMediator';

export enum GamePhase {
  START,
  PRESENTATION,
  RESPONSE_COLLECTION,
  DISPLAY_RESULTS,
  WAIT,
}

export default class GameController {
  private _score = 0;
  private _streak = 0;
  private _health = 10;
  private _phaseController: PhaseController;
  private _cueGenerator: CueGenerator;
  private _cueContainer!: CueContainer;

  constructor(phaseController: PhaseController, cueGenerator: CueGenerator) {
    this._phaseController = phaseController;
    this._cueGenerator = cueGenerator;

    // TODO: The awkward part here is that CueContainer holds rendering info, which we want to de-couple from the game logic. See if that can be moved elsewhere
    eventsCenter.on('input', (event: InputEvents, data: any) => {
      if (
        event == InputEvents.CUE_INPUT &&
        this._phaseController.currentPhase == GamePhase.RESPONSE_COLLECTION
      ) {
        eventsCenter.emit(
          'displayResults',
          data.id === this._cueContainer.highlightedCueId
        );
        this._phaseController.endPhase(true);
      }
    });

    eventsCenter.on(
      'changePhase',
      (currentPhase: GamePhase, newPhase: GamePhase, premature: boolean) => {
        if (currentPhase === GamePhase.RESPONSE_COLLECTION && !premature) {
          eventsCenter.emit('displayResults', false);
        } else if (newPhase === GamePhase.WAIT) {
          eventsCenter.emit('reset');
        } else if (newPhase === GamePhase.PRESENTATION) {
          eventsCenter.emit('presentCue', this._cueGenerator.nextCue);
        }
      }
    );

    eventsCenter.on('displayResults', (correct: boolean) => {
      correct ? eventsCenter.emit('succeed') : eventsCenter.emit('fail');
    });

    eventsCenter.on('succeed', () => {
      this.incrementStreak();
      this.incrementScore();
    });

    eventsCenter.on('fail', () => {
      this.streak = 0;
      this.decrementHealth();
      if (this.health <= 0) {
        eventsCenter.emit('gameOver');
      }
    });

    eventsCenter.on('restart', () => {
      this.reset();
    });
  }

  set cueContainer(cueContainer: CueContainer) {
    this._cueContainer = cueContainer;
  }

  get score(): number {
    return this._score;
  }

  set score(newScore: number) {
    this._score = newScore;
  }

  get streak(): number {
    return this._streak;
  }

  set streak(newStreak: number) {
    this._streak = newStreak;
  }

  get health(): number {
    return this._health;
  }

  set health(newHealth: number) {
    this._health = newHealth;
  }

  incrementScore(): void {
    this._score += 10 * this.streak;
  }

  incrementStreak(): void {
    this._streak++;
  }

  decrementHealth(): void {
    this._health--;
  }

  reset(): void {
    this._score = 0;
    this._streak = 0;
    this._health = 3;
  }
}
