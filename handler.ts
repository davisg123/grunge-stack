import { createRequestHandler } from "@remix-run/architect";

if (process.env.NODE_ENV !== "production") {
  require("./mocks");
}

throw new Error("No build found");

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

export const handler = createRequestHandler({
  build: viteDevServer
  ? () =>
      viteDevServer.ssrLoadModule(
        "virtual:remix/server-build"
      )
  : await import("@remix-run/dev/server-build"),
  mode: process.env.NODE_ENV,
});
