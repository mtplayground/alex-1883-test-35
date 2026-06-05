import type { SuanpanRod } from '../model/suanpan';

interface RodProps {
  readonly rod: SuanpanRod;
}

export function Rod({ rod }: RodProps) {
  return (
    <div
      className="relative grid h-[min(58vh,34rem)] min-h-[22rem] grid-rows-[2fr_1rem_5fr] border-l border-amber-950/20 last:border-r"
      aria-label={`Rod ${rod.index + 1}`}
    >
      <RodSegment label="heaven" />
      <div className="relative z-10 bg-amber-950" aria-hidden="true" />
      <RodSegment label="earth" />
    </div>
  );
}

interface RodSegmentProps {
  readonly label: 'heaven' | 'earth';
}

function RodSegment({ label }: RodSegmentProps) {
  return (
    <div className="relative bg-amber-50/60" data-segment={label}>
      <div
        className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-stone-700 shadow-sm shadow-slate-950/25"
        aria-hidden="true"
      />
    </div>
  );
}
