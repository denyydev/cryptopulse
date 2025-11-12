interface ImportMetaEnv {
  readonly VITE_CRYPTOPANIC_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_USE_MOCKS?: string;
  readonly VITE_CRYPTOPANIC_TOKEN?: string;
  readonly VITE_OPENSEA_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
