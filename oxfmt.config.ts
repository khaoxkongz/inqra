import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ".nitro/",
    ".tanstack/",
    ".vinxi/",
    "coverage/",
    ".pnpm-store/",
    ".agents/",
  ],
  sortImports: false,
  sortPackageJson: false,
  sortTailwindcss: {
    functions: ["clsx", "cva", "cn"],
  },
});
