interface ValueReadoutProps {
  readonly value: number;
  readonly isNeutral: boolean;
  readonly onReset: () => void;
}

export function ValueReadout({ value, isNeutral, onReset }: ValueReadoutProps) {
  return (
    <section
      className="flex flex-col justify-between gap-3 border-b border-slate-300 pb-4 sm:flex-row sm:items-end"
      aria-label="Current value"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Value
        </p>
        <output
          className="block font-mono text-4xl font-semibold leading-none text-slate-950 sm:text-5xl"
          aria-live="polite"
        >
          {value}
        </output>
      </div>
      <button
        className="inline-flex h-11 items-center justify-center border border-slate-900 bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-500"
        type="button"
        onClick={onReset}
        disabled={isNeutral}
      >
        Reset
      </button>
    </section>
  );
}
