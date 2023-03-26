import PhaseController, { GamePhase } from './PhaseController';
import eventsCenter from './EventsCenter';

jest.mock('./EventsCenter', () => ({
  emit: jest.fn(),
  on: jest.fn(),
}));

describe('PhaseController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('eventing', () => {
    it('endPhase emits a changePhase event, moves the current phase to the next one, and reset the timeInPhase', () => {
      const pc = new PhaseController();
      pc.currentPhase = GamePhase.PRESENTATION;
      pc.endPhase(false);

      expect(eventsCenter.emit).toHaveBeenCalledWith(
        'changePhase',
        GamePhase.PRESENTATION,
        GamePhase.RESPONSE_COLLECTION,
        false,
        0
      );
      expect(pc.timeInPhase).toBe(0);
      expect(pc.currentPhase).toBe(GamePhase.RESPONSE_COLLECTION);
    });

    it('responds to scene updates and progresses the phase after the phase duration has passed', () => {
      const pc = new PhaseController();
      jest.spyOn(pc, 'endPhase');
      pc.currentPhase = GamePhase.DISPLAY_RESULTS;

      pc.handleUpdate(300);
      expect(pc.endPhase).not.toHaveBeenCalled();

      pc.handleUpdate(300);
      expect(pc.endPhase).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('sets the phase back to START, clears timeInPhase, and sets gameOver to false', () => {
      const pc = new PhaseController();
      pc.currentPhase = GamePhase.RESPONSE_COLLECTION;
      pc.timeInPhase = 230;
      pc.gameOver = true;

      pc.reset();

      expect(pc.currentPhase).toBe(GamePhase.START);
      expect(pc.timeInPhase).toBe(0);
      expect(pc.gameOver).toBeFalsy();
    });
  });
});
