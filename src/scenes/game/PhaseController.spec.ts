import { Scene } from 'phaser';
import PhaseController, { GamePhase } from './PhaseController';

jest.mock('phaser', () => ({
  __esModule: true,
  GameObjects: {
    Container: jest.fn(),
  },
  Scene: jest.fn().mockImplementation(() => ({
    events: {
      emit: jest.fn(),
      on: jest.fn().mockImplementation((_event: string, callback: Function) => {
        callback('R');
      }),
    },
  })),
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
}));

const mockScene = new Scene({});

describe('PhaseController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('endPhase', () => {
    it('emits a changePhase event, moves the current phase to the next one, and reset the timeInPhase', () => {
      const pc = new PhaseController(mockScene);
      pc.currentPhase = GamePhase.PRESENTATION;
      pc.endPhase(false);

      expect(mockScene.events.emit).toHaveBeenCalledWith(
        'changePhase',
        GamePhase.PRESENTATION,
        GamePhase.RESPONSE_COLLECTION,
        false
      );
      expect(pc.timeInPhase).toBe(0);
      expect(pc.currentPhase).toBe(GamePhase.RESPONSE_COLLECTION);
    });
  });

  // TODO: write unit test for setupEvents
});
