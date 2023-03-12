import { Scene } from 'phaser';
import CueContainer from './CueContainer';
import CueGenerator from './CueGenerator';
import PhaseController from './PhaseController';
import InputMediator, { InputEvents } from './InputMediator';

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
  private _scene: Scene;
  private _phaseController: PhaseController;
  private _cueGenerator: CueGenerator;
  private _cueContainer: CueContainer;

  constructor(
    scene: Scene,
    phaseController: PhaseController,
    cueGenerator: CueGenerator,
    cueContainer: CueContainer
  ) {
    this._scene = scene;
    this._phaseController = phaseController;
    this._cueGenerator = cueGenerator;
    this._cueContainer = cueContainer;

    InputMediator.mediateKeyboardStream(
      this._scene.input.keyboard,
      this._scene.events
    );

    // TODO: The awkward part here is that CueContainer holds rendering info, which we want to de-couple from the game logic. See if that can be moved elsewhere
    this._scene.events.on('input', (event: InputEvents, data: any) => {
      if (
        event == InputEvents.CUE_INPUT &&
        this._phaseController.currentPhase == GamePhase.RESPONSE_COLLECTION
      ) {
        this._scene.events.emit(
          'displayResults',
          data.id === this._cueContainer.highlightedCueId
        );
        this._phaseController.endPhase(true);
      }
    });

    this._scene.events.on(
      'changePhase',
      (currentPhase: GamePhase, newPhase: GamePhase, premature: boolean) => {
        if (currentPhase === GamePhase.RESPONSE_COLLECTION && !premature) {
          this._scene.events.emit('displayResults', false);
        } else if (newPhase === GamePhase.WAIT) {
          this._scene.events.emit('reset');
        } else if (newPhase === GamePhase.PRESENTATION) {
          this._scene.events.emit('presentCue', this._cueGenerator.nextCue);
        }
      }
    );

    this._scene.events.on('displayResults', (correct: boolean) => {
      correct
        ? this._scene.events.emit('succeed')
        : this._scene.events.emit('fail');
    });

    this._scene.events.on('succeed', () => {
      this.incrementStreak();
      this.incrementScore();
    });

    this._scene.events.on('fail', () => {
      this.streak = 0;
    });
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

  incrementScore(): void {
    this._score += 10 * this.streak;
  }

  incrementStreak(): void {
    this._streak++;
  }
}
