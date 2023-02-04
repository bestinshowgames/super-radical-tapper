import { Events } from 'phaser';
import GameController, { GamePhase } from './game.controller';
// import type GamePhaseController from './GamePhaseController.interface';

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
    Events: {
      EventEmitter: jest.fn().mockImplementation(() => ({
        emit: jest.fn(),
      })),
    },
  };
});

const mockEmitter = new Events.EventEmitter();

describe('Core Gameplay Loop', () => {
  describe('Phase Updating', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('calls displayResults on phase controller if the current phase is DISPLAY_RESULTS', () => {
      const gm = new GameController(mockEmitter, ['LL', 'L', 'R', 'RR']);
      gm.currentGamePhase = GamePhase.DISPLAY_RESULTS;
      gm.handlePhaseUpdate(0);

      expect(mockEmitter.emit).toHaveBeenCalledTimes(1);
      expect(mockEmitter.emit).toHaveBeenCalledWith('displayResults');
    });

    describe('moving to PRESENTATION stage calls presentCue on phase controller', () => {
      it('from START stage', () => {
        const gm = new GameController(mockEmitter, ['LL', 'L', 'R', 'RR']);
        gm.currentGamePhase = GamePhase.START;
        const duration = gm.phaseDuration(gm.currentGamePhase) + 1;

        gm.handlePhaseUpdate(duration);

        expect(mockEmitter.emit).toHaveBeenCalled();
        expect(mockEmitter.emit).toHaveBeenCalledWith(
          'presentCue',
          expect.any(String)
        );
        expect(gm.currentGamePhase).toBe(GamePhase.PRESENTATION);
      });
      it('from WAIT stage', () => {
        const gm = new GameController(mockEmitter, ['LL', 'L', 'R', 'RR']);
        gm.currentGamePhase = GamePhase.WAIT;
        const duration = gm.phaseDuration(gm.currentGamePhase) + 1;

        gm.handlePhaseUpdate(duration);

        expect(mockEmitter.emit).toHaveBeenCalled();
        expect(mockEmitter.emit).toHaveBeenCalledWith(
          'presentCue',
          expect.any(String)
        );
        expect(gm.currentGamePhase).toBe(GamePhase.PRESENTATION);
      });
      it('only after phase duration has passed', () => {
        const gm = new GameController(mockEmitter, ['LL', 'L', 'R', 'RR']);
        gm.currentGamePhase = GamePhase.START;
        const duration = gm.phaseDuration(gm.currentGamePhase) - 1;

        gm.handlePhaseUpdate(duration);

        expect(mockEmitter.emit).not.toHaveBeenCalled();
        expect(gm.currentGamePhase).toBe(GamePhase.START);
      });
    });
    describe('moving to WAIT stage calls waitForResponse on the phase controller', () => {
      it('from DISPLAY_RESULTS stage', () => {
        const gm = new GameController(mockEmitter, ['LL', 'L', 'R', 'RR']);
        gm.currentGamePhase = GamePhase.DISPLAY_RESULTS;
        const duration = gm.phaseDuration(gm.currentGamePhase) + 1;

        gm.handlePhaseUpdate(duration);

        // expect(mockPhaseController.waitForResponse).toHaveBeenCalled();
        expect(gm.currentGamePhase).toBe(GamePhase.WAIT);
      });
    });
  });

  describe('Sequencing', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('Cue selection iterates back and forth between a structured, repeating sequence and a random sequence', () => {
      const gm = new GameController(mockEmitter, ['LL', 'L', 'R', 'RR']);
      jest.spyOn(gm, 'randomCueId').mockReturnValue('FOO');
      const sequence = gm.structuredSequence;
      const count = gm.sequenceIterations;
      const presentationPhaseLength = gm.presentationPhaseLength;

      // Test that that structured sequence repeats
      [...Array(count)].forEach(() => {
        sequence.forEach((expected) => {
          expect(gm.cueSelector.next().value).toBe(expected);
        });
      });
      // Test that the random cue selector is then used
      [...Array(presentationPhaseLength)].forEach(() => {
        expect(gm.cueSelector.next().value).toBe('FOO');
      });

      // Test that cue selection then goes back to the structured sequence
      [...Array(count)].forEach(() => {
        sequence.forEach((expected) => {
          expect(gm.cueSelector.next().value).toBe(expected);
        });
      });
    });
  });
});
