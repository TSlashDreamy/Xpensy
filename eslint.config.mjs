import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "types/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Tailwind rule overrides
  {
    files: ["tailwind.config.{js,cjs,ts}"],
    rules: {
      // Allow require() statements for Tailwind plugins
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  // Import order config
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/order": [
        "error",
        {
          // Order of structural groups
          groups: [
            "builtin", // Node.js built-ins (e.g., fs, path)
            "external", // npm packages (e.g., react, lodash)
            "internal", // Path aliases if configured (e.g., @/components)
            ["parent", "sibling"], // Relative paths (e.g., ../, ./)
            "index", // Index file of current directory (./)
            "type", // Type imports (TypeScript specific)
          ],
          // Treat custom path aliases as internal imports
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];

export default eslintConfig;
