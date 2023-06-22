import { Input, Scene } from 'phaser';
import CueContainer from './CueContainer';
import eventsCenter from './EventsCenter';

jest.mock('./EventsCenter', () => ({
  emit: jest.fn(),
  on: jest.fn(),
}));

jest.mock('phaser', () => ({
  __esModule: true,
  GameObjects: {
    Container: jest.fn(),
  },
  Scene: jest.fn(),
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

jest.mock('./Cue', () => {
  return function (this: any, _scene: any, options: any) {
    this.id = options.id;
    this.key = options.key;
    this.highlight = jest.fn();
  };
});

const mockScene = new Scene({});

describe('CueContainer', () => {
  describe('event listening', () => {
    it('resets the field, then highlights the cue for the provided key', () => {
      const container = new CueContainer(mockScene);
      container.presentCue('R');

      expect(eventsCenter.emit).toHaveBeenCalledWith('reset');
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
