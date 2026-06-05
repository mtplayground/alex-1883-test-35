import { useState } from 'react';

import { Abacus } from './components/Abacus';
import { ValueReadout } from './components/ValueReadout';
import { appConfig } from './config/env';
import {
  type BeadSelection,
  clearSuanpanState,
  createNeutralSuanpanState,
  EARTH_BEADS_PER_ROD,
  HEAVEN_BEADS_PER_ROD,
  isNeutralSuanpanState,
  toggleBead,
} from './model/suanpan';
import { computeSuanpanValue } from './model/value';

import './index.css';

function App() {
  const [suanpanState, setSuanpanState] = useState(() =>
    createNeutralSuanpanState(appConfig.defaultRodCount),
  );
  const currentValue = computeSuanpanValue(suanpanState);
  const isNeutral = isNeutralSuanpanState(suanpanState);

  function handleBeadSelect(selection: BeadSelection) {
    setSuanpanState((currentState) => toggleBead(currentState, selection));
  }

  function handleReset() {
    setSuanpanState((currentState) => clearSuanpanState(currentState));
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-5"
        aria-labelledby="app-title"
      >
        <header className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h1
              id="app-title"
              className="text-4xl font-bold leading-none sm:text-6xl"
            >
              Suanpan
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-600">
            {suanpanState.rodCount} rods · {HEAVEN_BEADS_PER_ROD} heaven /{' '}
            {EARTH_BEADS_PER_ROD} earth
          </p>
        </header>
        <ValueReadout
          value={currentValue}
          isNeutral={isNeutral}
          onReset={handleReset}
        />
        <Abacus state={suanpanState} onBeadSelect={handleBeadSelect} />
      </section>
    </main>
  );
}

export default App;
