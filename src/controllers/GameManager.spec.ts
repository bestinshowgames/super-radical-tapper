import GameManager, { GamePhase } from './GameManager';
import type GamePhaseController from './GamePhaseController.interface';

jest.mock('phaser', () => {
  return {
    __esModule: true,
    Input: {
      Keyboard: {
        KeyCodes: {
          D: 0,
          F: 1,
          J: 2,
          K: 3,
        },
      },
    },
  };
});

const mockPhaseController: GamePhaseController = {
  displayResults: jest.fn(),
  presentCue: jest.fn(),
  waitForResponse: jest.fn(),
};

describe('Core Gameplay Loop', () => {
  describe('Phase Updating', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('calls displayResults on phase controller if the current phase is DISPLAY_RESULTS', () => {
      const gm = new GameManager();
      gm.currentGamePhase = GamePhase.DISPLAY_RESULTS;
      gm.handlePhaseUpdate(0, mockPhaseController);

      expect(mockPhaseController.displayResults).toHaveBeenCalledTimes(1);
    });

    describe('moving to PRESENTATION stage calls presentCue on phase controller', () => {
      it('from START stage', () => {
        const gm = new GameManager();
        gm.currentGamePhase = GamePhase.START;
        const duration = gm.phaseDuration(gm.currentGamePhase) + 1;

        gm.handlePhaseUpdate(duration, mockPhaseController);

        expect(mockPhaseController.presentCue).toHaveBeenCalled();
        expect(gm.currentGamePhase).toBe(GamePhase.PRESENTATION);
      });
      it('from WAIT stage', () => {
        const gm = new GameManager();
        gm.currentGamePhase = GamePhase.WAIT;
        const duration = gm.phaseDuration(gm.currentGamePhase) + 1;

        gm.handlePhaseUpdate(duration, mockPhaseController);

        expect(mockPhaseController.presentCue).toHaveBeenCalled();
        expect(gm.currentGamePhase).toBe(GamePhase.PRESENTATION);
      });
      it('only after phase duration has passed', () => {
        const gm = new GameManager();
        gm.currentGamePhase = GamePhase.START;
        const duration = gm.phaseDuration(gm.currentGamePhase) - 1;

        gm.handlePhaseUpdate(duration, mockPhaseController);

        expect(mockPhaseController.presentCue).not.toHaveBeenCalled();
        expect(gm.currentGamePhase).toBe(GamePhase.START);
      });
    });
    describe('moving to WAIT stage calls waitForResponse on the phase controller', () => {
      it('from DISPLAY_RESULTS stage', () => {
        const gm = new GameManager();
        gm.currentGamePhase = GamePhase.DISPLAY_RESULTS;
        const duration = gm.phaseDuration(gm.currentGamePhase) + 1;

        gm.handlePhaseUpdate(duration, mockPhaseController);

        expect(mockPhaseController.waitForResponse).toHaveBeenCalled();
        expect(gm.currentGamePhase).toBe(GamePhase.WAIT);
      });
    });
  });
});
