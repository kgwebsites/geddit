require("esbuild").build({
  entryPoints: ["./index.js", "./index.css", "./sw.js"],
  outdir: "../static",
  bundle: true,
  splitting: true,
  format: "esm",
  watch: {
    onRebuild(error, result) {
      if (error) console.error("watch build failed:", error);
      else console.log("watch build succeeded:", result);
    },
  },
});
