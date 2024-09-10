/* eslint-disable @typescript-eslint/no-unused-vars */
import * as path from "path";

import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}"],
      routes: (defineRoutes) =>
        defineRoutes((route) => {
          if (process.env.NODE_ENV === "production") return;

          console.log("⚠️  Test routes enabled.");

          const appDir = path.join(process.cwd(), "app");

          route(
            "__tests/create-user",
            path.relative(appDir, "cypress/support/test-routes/create-user.ts"),
          );
        }),
      serverBuildFile: "index.mjs",
      serverModuleFormat: "esm",
    }),
    tsconfigPaths(),
    {
      name: "remix-apigatewayv2-adapter",
      apply(_config, env): boolean {
        return env.command === "build" && env?.isSsrBuild === true;
      },
      config: async (_config, _env) => {
        return {
          build: {
            ssr: "handler.ts",
          },
        };
      },
    },
  ],
});
