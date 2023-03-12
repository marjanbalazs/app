import esbuild from "esbuild";

esbuild.buildSync({
  bundle: true,
  platform: "node",
  target: "node18",
  entryPoints: ["src/app.ts"],
  outfile: "build/app.js",
});
