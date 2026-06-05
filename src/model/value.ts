import {
  type ActiveBeadCounts,
  type SuanpanRod,
  type SuanpanState,
  validateSuanpanRod,
  validateSuanpanState,
} from './suanpan';

export const HEAVEN_BEAD_VALUE = 5;
export const EARTH_BEAD_VALUE = 1;

export function computeSuanpanValue(state: SuanpanState): number {
  validateSuanpanState(state);

  return state.rods.reduce(
    (value, rod) => value * 10 + computeRodValue(rod),
    0,
  );
}

export function computeRodValue(rod: SuanpanRod): number {
  validateSuanpanRod(rod);

  const counts = getRodActiveBeadCounts(rod);

  return counts.heaven * HEAVEN_BEAD_VALUE + counts.earth * EARTH_BEAD_VALUE;
}

export function getRodActiveBeadCounts(rod: SuanpanRod): ActiveBeadCounts {
  validateSuanpanRod(rod);

  return {
    heaven: rod.heaven.filter((bead) => bead.isActive).length,
    earth: rod.earth.filter((bead) => bead.isActive).length,
  };
}
