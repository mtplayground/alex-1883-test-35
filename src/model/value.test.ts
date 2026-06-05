import { describe, expect, it } from 'vitest';

import { createNeutralSuanpanState, setRodBeadCounts } from './suanpan';
import { computeRodValue, computeSuanpanValue } from './value';

describe('suanpan value computation', () => {
  it('computes per-rod digit values from active heaven and earth beads', () => {
    const state = setRodBeadCounts(createNeutralSuanpanState(1), 0, {
      heaven: 2,
      earth: 4,
    });

    expect(computeRodValue(state.rods[0])).toBe(14);
  });

  it('computes a full-board base-10 value from left-to-right rods', () => {
    const state = setRodBeadCounts(
      setRodBeadCounts(
        setRodBeadCounts(createNeutralSuanpanState(3), 0, {
          heaven: 1,
          earth: 2,
        }),
        1,
        { heaven: 0, earth: 4 },
      ),
      2,
      { heaven: 1, earth: 3 },
    );

    expect(computeSuanpanValue(state)).toBe(748);
  });

  it('returns zero for a neutral board', () => {
    expect(computeSuanpanValue(createNeutralSuanpanState(4))).toBe(0);
  });

  it('rejects inconsistent board shape', () => {
    const state = createNeutralSuanpanState(2);

    expect(() =>
      computeSuanpanValue({
        ...state,
        rodCount: 3,
      }),
    ).toThrow(RangeError);
  });
});
