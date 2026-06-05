import { describe, expect, it } from 'vitest';

import {
  clearRod,
  clearSuanpanState,
  createNeutralSuanpanState,
  EARTH_BEADS_PER_ROD,
  HEAVEN_BEADS_PER_ROD,
  isNeutralRod,
  isNeutralSuanpanState,
  setRodBeadCounts,
} from './suanpan';
import { getRodActiveBeadCounts } from './value';

describe('suanpan state model', () => {
  it('creates a configurable neutral state with 2 heaven and 5 earth beads per rod', () => {
    const state = createNeutralSuanpanState(3);

    expect(state.rodCount).toBe(3);
    expect(state.rods).toHaveLength(3);
    expect(isNeutralSuanpanState(state)).toBe(true);

    for (const rod of state.rods) {
      expect(rod.heaven).toHaveLength(HEAVEN_BEADS_PER_ROD);
      expect(rod.earth).toHaveLength(EARTH_BEADS_PER_ROD);
      expect(isNeutralRod(rod)).toBe(true);
    }
  });

  it('sets active bead counts immutably on a rod', () => {
    const state = createNeutralSuanpanState(2);
    const updated = setRodBeadCounts(state, 1, { heaven: 1, earth: 3 });

    expect(updated).not.toBe(state);
    expect(updated.rods[0]).toBe(state.rods[0]);
    expect(updated.rods[1]).not.toBe(state.rods[1]);
    expect(getRodActiveBeadCounts(updated.rods[1])).toEqual({
      heaven: 1,
      earth: 3,
    });
    expect(updated.rods[1].heaven.map((bead) => bead.isActive)).toEqual([
      true,
      false,
    ]);
    expect(updated.rods[1].earth.map((bead) => bead.isActive)).toEqual([
      true,
      true,
      true,
      false,
      false,
    ]);
    expect(isNeutralRod(state.rods[1])).toBe(true);
  });

  it('clears one rod without changing the other rods', () => {
    const state = setRodBeadCounts(
      setRodBeadCounts(createNeutralSuanpanState(2), 0, {
        heaven: 1,
        earth: 2,
      }),
      1,
      { heaven: 2, earth: 5 },
    );

    const updated = clearRod(state, 1);

    expect(isNeutralRod(updated.rods[1])).toBe(true);
    expect(getRodActiveBeadCounts(updated.rods[0])).toEqual({
      heaven: 1,
      earth: 2,
    });
  });

  it('clears the full board back to neutral state', () => {
    const state = setRodBeadCounts(createNeutralSuanpanState(3), 2, {
      heaven: 2,
      earth: 5,
    });

    const cleared = clearSuanpanState(state);

    expect(cleared).not.toBe(state);
    expect(cleared.rodCount).toBe(3);
    expect(isNeutralSuanpanState(cleared)).toBe(true);
  });

  it('rejects invalid active bead counts', () => {
    const state = createNeutralSuanpanState(1);

    expect(() =>
      setRodBeadCounts(state, 0, {
        heaven: HEAVEN_BEADS_PER_ROD + 1,
        earth: 0,
      }),
    ).toThrow(RangeError);
    expect(() =>
      setRodBeadCounts(state, 0, { heaven: 0, earth: EARTH_BEADS_PER_ROD + 1 }),
    ).toThrow(RangeError);
  });
});
