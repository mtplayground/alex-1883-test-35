import type { CSSProperties } from 'react';

import type { SuanpanBead } from '../model/suanpan';

interface BeadProps {
  readonly bead: SuanpanBead;
}

export function Bead({ bead }: BeadProps) {
  const beadStyle = {
    top: `${getBeadPosition(bead)}%`,
  } satisfies CSSProperties;

  return (
    <div
      className="absolute left-1/2 z-10 h-8 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-950/40 bg-gradient-to-b from-amber-500 via-amber-700 to-amber-950 shadow-md shadow-slate-950/25 transition-[top] duration-150 ease-out"
      style={beadStyle}
      data-active={bead.isActive ? 'true' : 'false'}
      aria-label={`${bead.deck} bead ${bead.index + 1} ${bead.isActive ? 'active' : 'neutral'}`}
      role="img"
    >
      <span
        className="absolute left-1/2 top-1/2 h-3 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/45"
        aria-hidden="true"
      />
    </div>
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
