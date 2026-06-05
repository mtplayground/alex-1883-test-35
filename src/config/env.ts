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
  try {
    return validateRodCount(
      parseIntegerEnv(value, 'VITE_DEFAULT_ROD_COUNT', DEFAULT_ROD_COUNT),
    );
  } catch (error) {
    throw new Error(
      `Invalid VITE_DEFAULT_ROD_COUNT: ${getErrorMessage(error)}`,
      {
        cause: error,
      },
    );
  }
}

export const appConfig = Object.freeze({
  defaultRodCount: parseDefaultRodCount(import.meta.env.VITE_DEFAULT_ROD_COUNT),
  rodCountRange: Object.freeze({
    min: MIN_ROD_COUNT,
    max: MAX_ROD_COUNT,
  }),
});

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}
