import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	envPrefix: ["VITE_", "PUBLIC_"],
	plugins: [react()],
	build: {
		target: "esnext",
	},
	resolve: {
		alias: {
			module: false,
		},
	},
	server: {
		host: "0.0.0.0",
		port: 3000,
		strictPort: true,
		watch: {
			usePolling: true,
		},
	},
	preview: {
		host: "0.0.0.0",
		port: 3000,
		strictPort: true,
	},
});
