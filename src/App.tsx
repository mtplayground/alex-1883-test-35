import './index.css';

function App() {
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
      </section>
    </main>
  );
}

export default App;
