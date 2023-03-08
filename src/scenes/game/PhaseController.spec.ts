import { Scene } from 'phaser';
import PhaseController, { GamePhase } from './PhaseController';

jest.mock('phaser', () => ({
  __esModule: true,
  Scene: jest.fn().mockImplementation(() => ({
    events: {
      emit: jest.fn(),
      on: jest.fn(),
    },
  })),
}));

const mockScene = new Scene({});

describe('PhaseController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('eventing', () => {
    it('endPhase emits a changePhase event, moves the current phase to the next one, and reset the timeInPhase', () => {
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

    it('responds to scene updates and progresses the phase after the phase duration has passed', () => {
      const pc = new PhaseController(mockScene);
      jest.spyOn(pc, 'endPhase');
      pc.currentPhase = GamePhase.DISPLAY_RESULTS;

      pc.handleUpdate(300);
      expect(pc.endPhase).not.toHaveBeenCalled();

      pc.handleUpdate(300);
      expect(pc.endPhase).toHaveBeenCalled();
    });
  });
});
