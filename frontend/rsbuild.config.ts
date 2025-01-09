import { defineConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginReact } from "@rsbuild/plugin-react";
import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";

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
    rspack(config, { appendPlugins }) {
      if (process.env.RSDOCTOR === "true") {
        appendPlugins(new RsdoctorRspackPlugin());
      }
      appendPlugins(TanStackRouterRspack());
    },
  },
});
