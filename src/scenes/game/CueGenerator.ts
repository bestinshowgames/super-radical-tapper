import CueFacet from './CueFacet';

export default class CueGenerator {
  private _structuredSequence: string[];
  private _sequenceIterations = 8; //TODO: magic number go brrrrr
  private _presentationPhaseLength: number;
  private _structuredPresentationPhase: string[];
  private _cueSelector: Generator<string, string, unknown>;

  constructor(structuredSequence: CueFacet[]) {
    this._structuredSequence = structuredSequence.map((facet) => facet.id);

    this._presentationPhaseLength =
      this._structuredSequence.length * this._sequenceIterations;

    this._structuredPresentationPhase = this.buildStructuredPresentationPhase();
    this._cueSelector = this.cueGenerator();

    // this.setupEvents();
  }

  private buildStructuredPresentationPhase(): string[] {
    let phase: string[] = [];
    [...Array(this._sequenceIterations)].forEach(() => {
      phase = phase.concat([...this._structuredSequence]);
    });
    return phase;
  }

  randomCueId(): string {
    return CueFacet.CUE_FACETS[
      Math.floor(Math.random() * CueFacet.CUE_FACETS.length)
    ].id;
  }

  private *cueGenerator(): Generator<string, string, unknown> {
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

  get presentationPhaseLength(): number {
    return this._presentationPhaseLength;
  }

  get sequenceIterations(): number {
    return this._sequenceIterations;
  }
}
