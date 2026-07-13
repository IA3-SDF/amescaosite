import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/",
    "node_modules/",
    "out/",
    "build/",
    "dist/",
    "public/",
    "*.config.js",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
