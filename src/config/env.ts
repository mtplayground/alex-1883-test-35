import {
  DEFAULT_ROD_COUNT,
  MAX_ROD_COUNT,
  MIN_ROD_COUNT,
  validateRodCount,
} from '../model/suanpan';

function parseIntegerEnv(
  value: string | undefined,
  name: string,
  fallback: number,
): number {
  if (value === undefined || value.trim() === '') {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    throw new Error(`${name} must be an integer.`);
  }

  return parsed;
}

function parseDefaultRodCount(value: string | undefined): number {
  return validateRodCount(
    parseIntegerEnv(value, 'VITE_DEFAULT_ROD_COUNT', DEFAULT_ROD_COUNT),
  );
}

export const appConfig = Object.freeze({
  defaultRodCount: parseDefaultRodCount(import.meta.env.VITE_DEFAULT_ROD_COUNT),
  rodCountRange: Object.freeze({
    min: MIN_ROD_COUNT,
    max: MAX_ROD_COUNT,
  }),
});
