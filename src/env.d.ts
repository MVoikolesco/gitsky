/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly PUBLIC_APP_NAME: string;
	readonly PUBLIC_POSTHOG_KEY: string;
	readonly PUBLIC_POSTHOG_HOST: string;
	readonly PUBLIC_USE_MOCKS: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
