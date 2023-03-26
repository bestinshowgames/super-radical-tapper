import { Events } from 'phaser';
import eventsCenter from './EventsCenter';
import CueFacet from './CueFacet';

export enum InputEvents {
  CUE_INPUT,
  UNDEFINED,
}

export default class InputMediator {
  static mediateKeyboardStream(source: Events.EventEmitter): void {
    source.on('keydown', (event: any) => {
      const code: number = event.keyCode;
      const cueResponse = CueFacet.getFacetForKey(code);
      if (cueResponse) {
        eventsCenter.emit('input', InputEvents.CUE_INPUT, cueResponse);
      } else {
        eventsCenter.emit('input', InputEvents.UNDEFINED, null);
      }
    });
  }
}
