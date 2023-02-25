import CueFacet from './cue_facets';

export default class CueGenerator {
  private _cueIds = CueFacet.CUE_FACETS.map((facet) => facet.id);
  private _structuredSequence: string[];
  private _sequenceIterations = 8; //TODO: magic number go brrrrr
  private _presentationPhaseLength: number;
  private _structuredPresentationPhase: string[];
  private _cueSelector: Generator<string, string, unknown>;

  constructor() {
    this._structuredSequence = [
      this._cueIds[0],
      this._cueIds[1],
      this._cueIds[0],
      this._cueIds[2],
      this._cueIds[3],
      this._cueIds[1],
      this._cueIds[2],
      this._cueIds[0],
      this._cueIds[3],
      this._cueIds[2],
      this._cueIds[1],
      this._cueIds[3],
    ];

    this._presentationPhaseLength =
      this._structuredSequence.length * this._sequenceIterations;

    this._structuredPresentationPhase = this.buildStructuredPresentationPhase();
    this._cueSelector = this.cueGenerator();

    // this.setupEvents();
  }

  buildStructuredPresentationPhase(): string[] {
    let phase: string[] = [];
    [...Array(this._sequenceIterations)].forEach(() => {
      phase = phase.concat([...this._structuredSequence]);
    });
    return phase;
  }

  randomCueId(): string {
    return this._cueIds[Math.floor(Math.random() * this._cueIds.length)];
  }

  *cueGenerator(): Generator<string, string, unknown> {
    while (true) {
      for (const id of this._structuredPresentationPhase) {
        yield id;
      }
      let i = 1;
      while (i <= this._presentationPhaseLength) {
        yield this.randomCueId();
        i++;
      }
    }
  }

  get nextCue(): string {
    return this._cueSelector.next().value;
  }
}
