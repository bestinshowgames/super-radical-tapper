import { GameObjects, Scene, Input } from 'phaser';
import { Cue } from '../../objects';

export default class CueContainer extends GameObjects.Container {
  cues: { [key: string]: Cue } = {};
  highlightedCue!: Cue;

  constructor(scene: Scene) {
    super(scene);

    this.cues['LL'] = new Cue(this.scene, {
      id: 'LL',
      x: 160,
      y: 300,
      radius: 50,
      text: 'D',
      key: Input.Keyboard.KeyCodes.D,
      eventEmitter: this.scene.events,
    });

    this.cues['L'] = new Cue(this.scene, {
      id: 'L',
      x: 320,
      y: 300,
      radius: 50,
      text: 'F',
      key: Input.Keyboard.KeyCodes.F,
      eventEmitter: this.scene.events,
    });

    this.cues['R'] = new Cue(this.scene, {
      id: 'R',
      x: 480,
      y: 300,
      radius: 50,
      text: 'J',
      key: Input.Keyboard.KeyCodes.J,
      eventEmitter: this.scene.events,
    });

    this.cues['RR'] = new Cue(this.scene, {
      id: 'RR',
      x: 640,
      y: 300,
      radius: 50,
      text: 'K',
      key: Input.Keyboard.KeyCodes.K,
      eventEmitter: this.scene.events,
    });

    this.scene.events.on('presentCue', (cueKey: string) => {
      // Reset the cues
      this.scene.events.emit('reset');
      // Change the highlighted cue
      this.highlightedCue = this.cues[cueKey];
      this.highlightedCue.highlight();
    });
  }

  get highlightedCueKey(): string {
    return this.highlightedCue.id;
  }

  cueForKey(keyCode: number): string | undefined {
    return Object.values(this.cues).find((cue) => cue.key == keyCode)?.id;
  }
}
