import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	envPrefix: ["VITE_", "PUBLIC_"],
	plugins: [
		react(),
		VitePWA({
			injectRegister: false,
			registerType: "autoUpdate",
			manifestFilename: "site.webmanifest",
			manifest: {
				id: "/",
				name: "gitsky",
				short_name: "gitsky",
				description:
					"Generate printable 3D skylines from your Git contribution history.",
				start_url: "/",
				scope: "/",
				display: "standalone",
				orientation: "portrait",
				theme_color: "#071827",
				background_color: "#071827",
				categories: ["productivity", "utilities", "developer"],
				icons: [
					{
						src: "/icons/icon-192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/icons/icon-512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/icons/icon-512-maskable.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "/icon.svg",
						sizes: "any",
						type: "image/svg+xml",
						purpose: "any maskable",
					},
				],
			},
			workbox: {
				globPatterns: [
					"**/*.{js,css,html,ico,png,svg,webmanifest,wasm,ttf,woff,woff2}",
				],
				maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
				navigateFallback: "/index.html",
				navigateFallbackDenylist: [/^\/api\//],
			},
		}),
	],
	build: {
		target: "esnext",
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
