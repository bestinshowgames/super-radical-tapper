import { GameObjects, Scene } from 'phaser';
import eventsCenter from './EventsCenter';
import Cue from './Cue';
import CueFacet from './CueFacet';

export default class CueContainer extends GameObjects.Container {
  cues: { [key: string]: Cue } = {};
  highlightedCue!: Cue;
  scene: Scene;

  constructor(scene: Scene) {
    super(scene);
    this.scene = scene;

    this.cues[CueFacet.CUE_FACETS[0].id] = new Cue(this.scene, {
      id: CueFacet.CUE_FACETS[0].id,
      x: 153,
      y: 330,
      text: 'D',
      key: CueFacet.CUE_FACETS[0].key,
      eventEmitter: eventsCenter,
    });

    this.cues[CueFacet.CUE_FACETS[1].id] = new Cue(this.scene, {
      id: CueFacet.CUE_FACETS[1].id,
      x: 307,
      y: 330,
      text: 'F',
      key: CueFacet.CUE_FACETS[1].key,
      eventEmitter: eventsCenter,
    });

    this.cues[CueFacet.CUE_FACETS[2].id] = new Cue(this.scene, {
      id: CueFacet.CUE_FACETS[2].id,
      x: 461,
      y: 330,
      text: 'J',
      key: CueFacet.CUE_FACETS[2].key,
      eventEmitter: eventsCenter,
    });

    this.cues[CueFacet.CUE_FACETS[3].id] = new Cue(this.scene, {
      id: CueFacet.CUE_FACETS[3].id,
      x: 614,
      y: 330,
      text: 'K',
      key: CueFacet.CUE_FACETS[3].key,
      eventEmitter: eventsCenter,
    });

    eventsCenter.on('presentCue', (cueKey: string) => {
      this.presentCue(cueKey);
    });
  }

  presentCue(cueKey: string) {
    // first - reset any cues
    eventsCenter.emit('reset');
    // Change the highlighted cue
    this.highlightedCue = this.cues[cueKey];
    this.highlightedCue.highlight();
  }

  get highlightedCueId(): string {
    return this.highlightedCue.id;
  }

  cueForKey(keyCode: number): string | undefined {
    return Object.values(this.cues).find((cue) => cue.key == keyCode)?.id;
  }
}
