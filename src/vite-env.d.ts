/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_ROD_COUNT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
