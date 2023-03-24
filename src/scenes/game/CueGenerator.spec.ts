import { Scene } from 'phaser';
import CueFacet from './CueFacet';
import CueGenerator from './CueGenerator';

jest.mock('phaser', () => ({
  __esModule: true,
  Scene: jest.fn().mockImplementation(() => ({
    events: {
      emit: jest.fn(),
      on: jest.fn(),
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

describe('CueGenerator', () => {
  describe('nextCue', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    it('generates a phase of structured sequences, followed by an unstructured phase', () => {
      const mockSequence = [
        CueFacet.CUE_FACETS[0],
        CueFacet.CUE_FACETS[1],
        CueFacet.CUE_FACETS[3],
        CueFacet.CUE_FACETS[2],
      ];
      const generator = new CueGenerator(mockSequence, mockScene);
      jest.spyOn(generator, 'randomCueId').mockReturnValue('FOO');

      [...Array(generator.sequenceIterations)].forEach(() => {
        mockSequence.forEach((expected) => {
          expect(generator.nextCue).toBe(expected.id);
        });
      });
      [...Array(generator.presentationPhaseLength)].forEach(() => {
        expect(generator.nextCue).toBe('FOO');
      });
    });
  });
});
