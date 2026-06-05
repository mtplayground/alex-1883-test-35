import { appConfig } from './config/env';
import {
  createNeutralSuanpanState,
  EARTH_BEADS_PER_ROD,
  HEAVEN_BEADS_PER_ROD,
} from './model/suanpan';

import './index.css';

function App() {
  const suanpanState = createNeutralSuanpanState(appConfig.defaultRodCount);

  return (
    <main className="grid min-h-screen place-items-center px-8 py-12">
      <section className="w-full max-w-2xl" aria-labelledby="app-title">
        <h1
          id="app-title"
          className="mb-3 text-5xl font-bold leading-none text-slate-900 sm:text-7xl"
        >
          Suanpan
        </h1>
        <p className="text-lg leading-8 text-slate-600">
          Interactive abacus app scaffold.
        </p>
        <p className="mt-4 text-sm font-medium text-slate-500">
          Neutral state: {suanpanState.rodCount} rods, {HEAVEN_BEADS_PER_ROD}{' '}
          heaven beads and {EARTH_BEADS_PER_ROD} earth beads per rod.
        </p>
      </section>
    </main>
  );
}

export default App;
