import { Abacus } from './components/Abacus';
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
        <Abacus state={suanpanState} />
      </section>
    </main>
  );
}

export default App;
