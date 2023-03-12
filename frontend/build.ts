import esbuild from "esbuild";

esbuild.buildSync({
  bundle: true,
  platform: "browser",
  target: "chrome110",
  jsx: 'automatic',
  entryPoints: ["src/app.tsx"],
  outfile: "../public/script/index.js",
});
