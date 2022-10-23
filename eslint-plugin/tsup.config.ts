import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  external: ["eslint"],
  clean: true,
  bundle: true,
  outDir: "lib"
});
