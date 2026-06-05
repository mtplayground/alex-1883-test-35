const DEFAULT_ROD_COUNT = 13;
const MIN_ROD_COUNT = 1;
const MAX_ROD_COUNT = 21;

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
  const rodCount = parseIntegerEnv(
    value,
    'VITE_DEFAULT_ROD_COUNT',
    DEFAULT_ROD_COUNT,
  );

  if (rodCount < MIN_ROD_COUNT || rodCount > MAX_ROD_COUNT) {
    throw new Error(
      `VITE_DEFAULT_ROD_COUNT must be between ${MIN_ROD_COUNT} and ${MAX_ROD_COUNT}.`,
    );
  }

  return rodCount;
}

export const appConfig = Object.freeze({
  defaultRodCount: parseDefaultRodCount(import.meta.env.VITE_DEFAULT_ROD_COUNT),
});
