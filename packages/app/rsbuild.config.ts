import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: "./index.html",
  },
  source: {
    entry: {
      index: "./src/index.tsx",
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  dev: {
    client: {
      host: "localhost",
      port: "3000",
      protocol: "ws",
    },
  },
});
