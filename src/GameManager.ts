import { CueOptions, KeyCodes } from './objects';

export interface CueCreationConfig extends CueOptions {
  key: number;
}

const cueConfigs: CueCreationConfig[] = [
  {
    x: 160,
    y: 300,
    radius: 50,
    text: 'D',
    key: KeyCodes.D
  },
  {
    x: 320,
    y: 300,
    radius: 50,
    text: 'F',
    key: KeyCodes.F
  },
  {
    x: 480,
    y: 300,
    radius: 50,
    text: 'J',
    key: KeyCodes.J
  },
  {
    x: 640,
    y: 300,
    radius: 50,
    text: 'K',
    key: KeyCodes.K
  }
];

enum GamePhase {
  START,
  PRESENTATION,
  RESPONSE_COLLECTION
}

export default class GameManager {
  get cueConfigurations(): CueCreationConfig[] {
    return cueConfigs;
  }
}
