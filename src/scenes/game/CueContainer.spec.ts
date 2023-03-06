import { Input, Scene } from 'phaser';
import CueContainer from './CueContainer';

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

jest.mock('../../objects', () => ({
  Cue: jest.fn().mockImplementation((_scene, options) => ({
    id: options.id,
    key: options.key,
    highlight: jest.fn(),
  })),
}));

const mockScene = new Scene({});

describe('CueContainer', () => {
  describe('event listening', () => {
    it('emits a reset event in response to a presentCue event', () => {
      new CueContainer(mockScene);
      mockScene.events.emit('presentCue');

      expect(mockScene.events.emit).toHaveBeenCalledWith('reset');
    });

    it('sets the highlighted cue to the provided cue key and highlights it', () => {
      const container = new CueContainer(mockScene);
      mockScene.events.emit('presentCue');

      expect(container.highlightedCue.id).toEqual('R');
      expect(container.highlightedCue.highlight).toHaveBeenCalled();
    });
  });
  describe('cueForKey', () => {
    it("return a cue's Id for a given input key", () => {
      const container = new CueContainer(mockScene);

      expect(container.cueForKey(Input.Keyboard.KeyCodes.D)).toEqual('LL');
      expect(container.cueForKey(Input.Keyboard.KeyCodes.F)).toEqual('L');
      expect(container.cueForKey(Input.Keyboard.KeyCodes.J)).toEqual('R');
      expect(container.cueForKey(Input.Keyboard.KeyCodes.K)).toEqual('RR');
    });
  });
});
