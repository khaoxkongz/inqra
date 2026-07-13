import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";
import tanstack from "ultracite/oxlint/tanstack";

export default defineConfig({
  extends: [core, react, tanstack],
  ignorePatterns: [
    ...(core.ignorePatterns || ""),
    ".agents",
    "packages/ui/src",
  ],
  rules: {
    "no-nested-conditional": "off",
    "no-nested-ternary": "off",

    /** Prefer Array<T> format */
    "typescript/array-type": "off",
    /** Warn about async functions which have no await expression */
    "require-await": "off",
    "func-style": ["error", "declaration", { allowArrowFunctions: true }],

    "import/no-cycle": "off",
    "sort-imports": "off",
    "sort-keys": "off",

    /**
     * @see https://github.com/un-ts/eslint-plugin-import-x
     */
    /** Bans the use of inline type-only markers for named imports */
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    /** Reports any imports that come after non-import statements */
    "import/first": "error",
    /** Stylistic preference */
    "import/newline-after-import": "error",
    /** No require() or module.exports */
    "import/no-commonjs": "error",
    /** Reports if a resolved path is imported more than once */
    "import/no-duplicates": "error",

    /**
     * @see https://typescript-eslint.io/rules/
     */
    /** Prevent @ts-ignore, allow @ts-expect-error */
    "typescript/ban-ts-comment": [
      "error",
      {
        "ts-expect-error": false,
        "ts-ignore": "allow-with-description",
      },
    ],
    /** Enforce import type { T } */
    "typescript/consistent-type-imports": ["error", { prefer: "type-imports" }],
    /** Shorthand method style is less strict */
    "typescript/method-signature-style": ["error", "property"],
    /** Duplicate values can lead to bugs that are hard to track down */
    "typescript/no-duplicate-enum-values": "error",
    /** Using the operator any more than once does nothing */
    "typescript/no-extra-non-null-assertion": "error",
    /** There are several potential bugs with this compared to other loops */
    "typescript/no-for-in-array": "error",
    /** Don't over-define types for simple things like strings */
    "typescript/no-inferrable-types": ["error", { ignoreParameters: true }],
    /** Enforce valid definition of new and constructor */
    "typescript/no-misused-new": "error",
    /** Disallow TypeScript namespaces */
    "typescript/no-namespace": "error",
    /** Disallow non-null assertions after an optional chain expression */
    "typescript/no-non-null-asserted-optional-chain": "error",
    /** Detects conditionals which will always evaluate truthy or falsy */
    "typescript/no-unnecessary-condition": "error",
    /** Checks if the the explicit type is identical to the inferred type */
    "typescript/no-unnecessary-type-assertion": "error",
    /** Disallow using the unsafe built-in Function type */
    "typescript/no-unsafe-function-type": "error",
    /** Disallow using confusing built-in primitive class wrappers */
    "typescript/no-wrapper-object-types": "error",
    /** Enforce the use of as const over literal type */
    "typescript/prefer-as-const": "error",
    /** Prefer for-of loop over the standard for loop */
    "typescript/prefer-for-of": "warn",
    /** Prefer of ES6-style import declarations */
    "typescript/triple-slash-reference": "error",
  },
});
