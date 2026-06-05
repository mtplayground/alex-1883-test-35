import type { ActiveBeadCounts, SuanpanRod, SuanpanState } from './suanpan';

export const HEAVEN_BEAD_VALUE = 5;
export const EARTH_BEAD_VALUE = 1;

export function computeSuanpanValue(state: SuanpanState): number {
  validateStateShape(state);

  return state.rods.reduce(
    (value, rod) => value * 10 + computeRodValue(rod),
    0,
  );
}

export function computeRodValue(rod: SuanpanRod): number {
  const counts = getRodActiveBeadCounts(rod);

  return counts.heaven * HEAVEN_BEAD_VALUE + counts.earth * EARTH_BEAD_VALUE;
}

export function getRodActiveBeadCounts(rod: SuanpanRod): ActiveBeadCounts {
  return {
    heaven: rod.heaven.filter((bead) => bead.isActive).length,
    earth: rod.earth.filter((bead) => bead.isActive).length,
  };
}

function validateStateShape(state: SuanpanState): void {
  if (state.rodCount !== state.rods.length) {
    throw new RangeError(
      'Suanpan state rod count must match the rods array length.',
    );
  }
}
