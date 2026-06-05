import { describe, expect, it } from 'vitest';

import {
  type SuanpanState,
  clearRod,
  clearSuanpanState,
  createNeutralSuanpanState,
  EARTH_BEADS_PER_ROD,
  HEAVEN_BEADS_PER_ROD,
  isNeutralRod,
  isNeutralSuanpanState,
  setRodBeadCounts,
  toggleBead,
  validateSuanpanState,
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

  it('rejects invalid rod counts', () => {
    expect(() => createNeutralSuanpanState(0)).toThrow(RangeError);
    expect(() => createNeutralSuanpanState(22)).toThrow(RangeError);
    expect(() => createNeutralSuanpanState(1.5)).toThrow(RangeError);
  });

  it('rejects states with inconsistent bead group sizes', () => {
    const state = createNeutralSuanpanState(1);
    const malformed = {
      ...state,
      rods: [
        {
          ...state.rods[0],
          earth: state.rods[0].earth.slice(1),
        },
      ],
    };

    expect(() => validateSuanpanState(malformed as SuanpanState)).toThrow(
      RangeError,
    );
  });

  it('rejects non-contiguous active bead state', () => {
    const state = createNeutralSuanpanState(1);
    const malformed = {
      ...state,
      rods: [
        {
          ...state.rods[0],
          earth: state.rods[0].earth.map((bead, index) => ({
            ...bead,
            isActive: index === 1,
          })),
        },
      ],
    };

    expect(() => validateSuanpanState(malformed as SuanpanState)).toThrow(
      RangeError,
    );
  });

  it('rejects bead metadata that does not match its group', () => {
    const state = createNeutralSuanpanState(1);
    const malformed = {
      ...state,
      rods: [
        {
          ...state.rods[0],
          heaven: state.rods[0].heaven.map((bead, index) => ({
            ...bead,
            deck: index === 0 ? 'earth' : bead.deck,
          })),
        },
      ],
    };

    expect(() => validateSuanpanState(malformed as SuanpanState)).toThrow(
      RangeError,
    );
  });

  it('toggles earth beads and neighboring beads toward and away from the bar', () => {
    const activated = toggleBead(createNeutralSuanpanState(1), {
      rodIndex: 0,
      deck: 'earth',
      beadIndex: 2,
    });

    expect(getRodActiveBeadCounts(activated.rods[0])).toEqual({
      heaven: 0,
      earth: 3,
    });

    const cleared = toggleBead(activated, {
      rodIndex: 0,
      deck: 'earth',
      beadIndex: 1,
    });

    expect(getRodActiveBeadCounts(cleared.rods[0])).toEqual({
      heaven: 0,
      earth: 1,
    });
  });

  it('toggles heaven beads and neighboring beads toward and away from the bar', () => {
    const activated = toggleBead(createNeutralSuanpanState(1), {
      rodIndex: 0,
      deck: 'heaven',
      beadIndex: 1,
    });

    expect(getRodActiveBeadCounts(activated.rods[0])).toEqual({
      heaven: 2,
      earth: 0,
    });

    const cleared = toggleBead(activated, {
      rodIndex: 0,
      deck: 'heaven',
      beadIndex: 0,
    });

    expect(getRodActiveBeadCounts(cleared.rods[0])).toEqual({
      heaven: 0,
      earth: 0,
    });
  });
});
