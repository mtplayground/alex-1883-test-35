import type { CSSProperties } from 'react';

import type { BeadSelection, SuanpanState } from '../model/suanpan';
import { Rod } from './Rod';

interface AbacusProps {
  readonly state: SuanpanState;
  readonly onBeadSelect: (selection: BeadSelection) => void;
}

export function Abacus({ state, onBeadSelect }: AbacusProps) {
  const rodMinWidthRem = 3.75;
  const rodGridStyle = {
    gridTemplateColumns: `repeat(${state.rodCount}, minmax(${rodMinWidthRem}rem, 1fr))`,
    minWidth: `${state.rodCount * rodMinWidthRem}rem`,
  } satisfies CSSProperties;

  return (
    <section
      className="w-full"
      aria-label={`Suanpan board with ${state.rodCount} rods`}
    >
      <div className="border-y-8 border-amber-950 bg-amber-950 shadow-2xl shadow-slate-950/15 sm:border-y-[14px]">
        <div className="border-x-8 border-amber-900 bg-amber-100 sm:border-x-[14px]">
          <div className="relative touch-pan-x overflow-x-auto overscroll-x-contain bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 pb-2 [scrollbar-gutter:stable]">
            <div
              className="grid w-full grid-rows-[2fr_1rem_5fr]"
              style={rodGridStyle}
            >
              {state.rods.map((rod) => (
                <Rod key={rod.id} rod={rod} onBeadSelect={onBeadSelect} />
              ))}
            </div>
            <div
              className="pointer-events-none absolute inset-x-0 top-[28.5%] z-20 h-4 bg-amber-950 shadow-md shadow-slate-950/25"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
