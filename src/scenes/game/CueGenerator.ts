import eventsCenter from './EventsCenter';
import CueFacet from './CueFacet';

export default class CueGenerator {
  private _structuredSequence: string[];
  private _sequenceIterations = 8; //TODO: magic number go brrrrr
  private _presentationPhaseLength: number;
  private _structuredPresentationPhase: string[];
  private _cueSelector: Generator<string, string, unknown>;
  private _structuredPhaseIterator = 0;
  private _unstructuredPhaseIterator = 0;
  private _inStructuredPhase = true; // TODO: Will need to set this dynamically if we want to change up whether we start with structured or unstructured phase

  constructor(structuredSequence: CueFacet[]) {
    this._structuredSequence = structuredSequence.map((facet) => facet.id);

    this._presentationPhaseLength =
      this._structuredSequence.length * this._sequenceIterations;

    this._structuredPresentationPhase = this.buildStructuredPresentationPhase();
    this._cueSelector = this.cueGenerator();

    eventsCenter.on('restart', () => {
      this._structuredPhaseIterator = this._inStructuredPhase ? -1 : 0; // -1 is here to account for incidental increment in generator
      this._unstructuredPhaseIterator = 0;
      this._inStructuredPhase = true;
    });
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
      while (
        this._inStructuredPhase &&
        this._structuredPhaseIterator < this._structuredPresentationPhase.length
      ) {
        this._inStructuredPhase = true;
        yield this._structuredPresentationPhase[this._structuredPhaseIterator];
        this._structuredPhaseIterator++;
      }

      this._inStructuredPhase = false;

      while (
        !this._inStructuredPhase &&
        this._unstructuredPhaseIterator < this.presentationPhaseLength
      ) {
        this._inStructuredPhase = false;
        yield this.randomCueId();
        this._unstructuredPhaseIterator++;
      }

      this._structuredPhaseIterator = 0;
      this._unstructuredPhaseIterator = 0;
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
