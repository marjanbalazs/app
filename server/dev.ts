import esbuild from "esbuild";

esbuild
  .context({
    bundle: true,
    platform: "node",
    target: "node18",
    entryPoints: ["src/app.ts"],
    outfile: "build/app.js",
  })
  .then((ctx) => ctx.watch())
  .catch((e) => console.error(e));
