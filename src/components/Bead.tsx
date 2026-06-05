import type { CSSProperties } from 'react';

import type { SuanpanBead } from '../model/suanpan';

interface BeadProps {
  readonly bead: SuanpanBead;
  readonly onSelect: () => void;
}

export function Bead({ bead, onSelect }: BeadProps) {
  const beadStyle = {
    top: `${getBeadPosition(bead)}%`,
  } satisfies CSSProperties;

  return (
    <button
      className="absolute left-1/2 z-10 h-11 w-12 -translate-x-1/2 -translate-y-1/2 touch-manipulation rounded-full border border-amber-950/40 bg-gradient-to-b from-amber-500 via-amber-700 to-amber-950 shadow-md shadow-slate-950/25 transition-[top] duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-amber-50"
      style={beadStyle}
      type="button"
      onClick={onSelect}
      data-active={bead.isActive ? 'true' : 'false'}
      aria-label={`${bead.deck} bead ${bead.index + 1} ${bead.isActive ? 'active' : 'neutral'}`}
      aria-pressed={bead.isActive}
    >
      <span
        className="absolute left-1/2 top-1/2 h-3 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/45"
        aria-hidden="true"
      />
    </button>
  );
}

function getBeadPosition(bead: SuanpanBead): number {
  if (bead.deck === 'heaven') {
    return bead.isActive
      ? getActiveHeavenPosition(bead.index)
      : getNeutralHeavenPosition(bead.index);
  }

  return bead.isActive
    ? getActiveEarthPosition(bead.index)
    : getNeutralEarthPosition(bead.index);
}

function getActiveHeavenPosition(index: number): number {
  return 78 - index * 20;
}

function getNeutralHeavenPosition(index: number): number {
  return 22 + index * 22;
}

function getActiveEarthPosition(index: number): number {
  return 16 + index * 12;
}

function getNeutralEarthPosition(index: number): number {
  return 42 + index * 11;
}
