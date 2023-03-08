import { Events } from 'phaser';
import CueFacet from './CueFacet';

export enum InputEvents {
  CUE_INPUT,
  UNDEFINED,
}

export default class InputMediator {
  static mediateKeyboardStream(
    source: Events.EventEmitter,
    target: Events.EventEmitter
  ): void {
    source.on('keydown', (event: any) => {
      const code: number = event.keyCode;
      const cueResponse = CueFacet.getFacetForKey(code);
      if (cueResponse) {
        target.emit('input', InputEvents.CUE_INPUT, cueResponse);
      } else {
        target.emit('input', InputEvents.UNDEFINED, null);
      }
    });
  }
}
