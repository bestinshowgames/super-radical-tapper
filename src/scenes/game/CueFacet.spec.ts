import CueFacet from './CueFacet';

jest.mock('phaser', () => ({
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

describe('CueFacet', () => {
  describe('toString', () => {
    it("prints out a facet's id and key", () => {
      expect(CueFacet.CUE_FACETS[0].toString()).toEqual('LL -> 0');
      expect(CueFacet.CUE_FACETS[1].toString()).toEqual('L -> 1');
      expect(CueFacet.CUE_FACETS[2].toString()).toEqual('R -> 2');
      expect(CueFacet.CUE_FACETS[3].toString()).toEqual('RR -> 3');
    });
  });
  describe('getFacetForKey', () => {
    it('returns a CueFacet for a given key', () => {
      expect(CueFacet.getFacetForKey(0)).toEqual(CueFacet.CUE_FACETS[0]);
    });
  });
});
