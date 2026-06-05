export const HEAVEN_BEADS_PER_ROD = 2;
export const EARTH_BEADS_PER_ROD = 5;
export const DEFAULT_ROD_COUNT = 13;
export const MIN_ROD_COUNT = 1;
export const MAX_ROD_COUNT = 21;

export type BeadDeck = 'heaven' | 'earth';

export interface SuanpanBead {
  readonly id: string;
  readonly deck: BeadDeck;
  readonly index: number;
  readonly isActive: boolean;
}

export interface SuanpanRod {
  readonly id: string;
  readonly index: number;
  readonly heaven: readonly SuanpanBead[];
  readonly earth: readonly SuanpanBead[];
}

export interface SuanpanState {
  readonly rodCount: number;
  readonly rods: readonly SuanpanRod[];
}

export function validateRodCount(rodCount: number): number {
  if (!Number.isInteger(rodCount)) {
    throw new RangeError('Rod count must be an integer.');
  }

  if (rodCount < MIN_ROD_COUNT || rodCount > MAX_ROD_COUNT) {
    throw new RangeError(
      `Rod count must be between ${MIN_ROD_COUNT} and ${MAX_ROD_COUNT}.`,
    );
  }

  return rodCount;
}

export function createNeutralSuanpanState(
  rodCount = DEFAULT_ROD_COUNT,
): SuanpanState {
  const validRodCount = validateRodCount(rodCount);

  return {
    rodCount: validRodCount,
    rods: Array.from({ length: validRodCount }, (_, index) =>
      createNeutralRod(index),
    ),
  };
}

export function createNeutralRod(index: number): SuanpanRod {
  if (!Number.isInteger(index) || index < 0) {
    throw new RangeError('Rod index must be a non-negative integer.');
  }

  return {
    id: `rod-${index}`,
    index,
    heaven: createNeutralBeads('heaven', index, HEAVEN_BEADS_PER_ROD),
    earth: createNeutralBeads('earth', index, EARTH_BEADS_PER_ROD),
  };
}

export function isNeutralRod(rod: SuanpanRod): boolean {
  return [...rod.heaven, ...rod.earth].every((bead) => !bead.isActive);
}

export function isNeutralSuanpanState(state: SuanpanState): boolean {
  return state.rodCount === state.rods.length && state.rods.every(isNeutralRod);
}

function createNeutralBeads(
  deck: BeadDeck,
  rodIndex: number,
  beadCount: number,
): readonly SuanpanBead[] {
  return Array.from({ length: beadCount }, (_, index) => ({
    id: `rod-${rodIndex}-${deck}-${index}`,
    deck,
    index,
    isActive: false,
  }));
}
