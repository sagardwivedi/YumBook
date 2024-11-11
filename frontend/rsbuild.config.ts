import { defineConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginReact } from "@rsbuild/plugin-react";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions(opts) {
        opts.plugins?.unshift("babel-plugin-react-compiler");
      },
    }),
  ],
  tools: {
    rspack: {
      plugins: [TanStackRouterRspack({ disableManifestGeneration: true })],
      mode: isDev ? "development" : "production",
      experiments: {
        incremental: isDev,
      },
    },
  },
});
