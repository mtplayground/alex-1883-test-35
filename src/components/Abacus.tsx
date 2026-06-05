import type { CSSProperties } from 'react';

import type { BeadSelection, SuanpanState } from '../model/suanpan';
import { Rod } from './Rod';

interface AbacusProps {
  readonly state: SuanpanState;
  readonly onBeadSelect: (selection: BeadSelection) => void;
}

export function Abacus({ state, onBeadSelect }: AbacusProps) {
  const rodGridStyle = {
    gridTemplateColumns: `repeat(${state.rodCount}, minmax(2.75rem, 1fr))`,
  } satisfies CSSProperties;

  return (
    <section
      className="w-full"
      aria-label={`Suanpan board with ${state.rodCount} rods`}
    >
      <div className="border-y-[14px] border-amber-950 bg-amber-950 shadow-2xl shadow-slate-950/15">
        <div className="border-x-[14px] border-amber-900 bg-amber-100">
          <div className="relative overflow-x-auto bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100">
            <div
              className="grid min-w-max grid-rows-[2fr_1rem_5fr]"
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
