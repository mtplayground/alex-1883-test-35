import type {
  BeadDeck,
  BeadSelection,
  SuanpanBead,
  SuanpanRod,
} from '../model/suanpan';
import { Bead } from './Bead';

interface RodProps {
  readonly rod: SuanpanRod;
  readonly onBeadSelect: (selection: BeadSelection) => void;
}

export function Rod({ rod, onBeadSelect }: RodProps) {
  return (
    <div
      className="relative grid h-[clamp(24rem,62vh,38rem)] grid-rows-[2fr_1rem_5fr] border-l border-amber-950/20 last:border-r"
      aria-label={`Rod ${rod.index + 1}`}
    >
      <RodSegment
        beads={rod.heaven}
        deck="heaven"
        rodIndex={rod.index}
        onBeadSelect={onBeadSelect}
      />
      <div className="relative z-10 bg-amber-950" aria-hidden="true" />
      <RodSegment
        beads={rod.earth}
        deck="earth"
        rodIndex={rod.index}
        onBeadSelect={onBeadSelect}
      />
    </div>
  );
}

interface RodSegmentProps {
  readonly beads: readonly SuanpanBead[];
  readonly deck: BeadDeck;
  readonly rodIndex: number;
  readonly onBeadSelect: (selection: BeadSelection) => void;
}

function RodSegment({ beads, deck, rodIndex, onBeadSelect }: RodSegmentProps) {
  return (
    <div className="relative bg-amber-50/60" data-segment={deck}>
      <div
        className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-stone-700 shadow-sm shadow-slate-950/25"
        aria-hidden="true"
      />
      {beads.map((bead) => (
        <Bead
          key={bead.id}
          bead={bead}
          onSelect={() =>
            onBeadSelect({
              rodIndex,
              deck,
              beadIndex: bead.index,
            })
          }
        />
      ))}
    </div>
  );
}
