import { Input } from 'phaser';

export default class CueFacet {
  public static readonly CUE_FACETS = [
    new CueFacet('LL', Input.Keyboard.KeyCodes.D),
    new CueFacet('L', Input.Keyboard.KeyCodes.F),
    new CueFacet('R', Input.Keyboard.KeyCodes.J),
    new CueFacet('RR', Input.Keyboard.KeyCodes.K),
  ];

  private constructor(
    public readonly id: string,
    public readonly key: number
  ) {}

  toString() {
    return `${this.id} -> ${this.key}`;
  }

  static getFacetForKey(key: number): CueFacet | undefined {
    return this.CUE_FACETS.find((facet) => facet.key == key);
  }
}
