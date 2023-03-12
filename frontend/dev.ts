import esbuild from "esbuild";

esbuild
  .context({
    bundle: true,
    platform: "browser",
    target: "chrome110",
    jsx: "automatic",
    entryPoints: ["src/app.tsx"],
    outfile: "../public/script/index.js",
  })
  .then((ctx) => ctx.watch())
  .catch((e) => console.error(e));
