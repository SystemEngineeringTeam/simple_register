// ref: https://roboin.io/article/2024/08/13/eslint-now-supports-typescript-based-config-files/

import antfu, { perfectionist } from "@antfu/eslint-config";

// @ts-expect-error: 本来 `postcss.config.cjs` で設定するものをここで設定している
import panda from "@pandacss/eslint-plugin";

// ref: https://github.com/antfu/eslint-config/issues/661#issuecomment-2632730969
const perfectionistRules = await perfectionist();

type ConfigAntfu = Parameters<typeof antfu>[0];
type Config = Parameters<typeof antfu>[1];

const configTsTsx = {
  ignores: ["panda/", "/panda.config.ts"],
  stylistic: {
    quotes: "double",
    semi: true,
    overrides: {
      "comma-dangle": ["error", "always-multiline"],
      "jsonc/comma-dangle": ["error", "always-multiline"],
      "style/jsx-sort-props": "warn",
      "arrow-body-style": ["error", "as-needed"],
      "no-restricted-imports": ["error", { patterns: ["../*"] }],
      "unused-imports/no-unused-imports": "warn",
      "style/arrow-parens": ["error", "always"],
      "style/brace-style": ["error", "1tbs"],
    },
  },
  typescript: {
    parserOptions: {
      project: ["./tsconfig.json"],
    },
    overrides: {
      "ts/consistent-type-definitions": ["error", "type"],
      "ts/explicit-function-return-type": [
        "error",
        {
          allowHigherOrderFunctions: true,
          allowedNames: ["clientLoader"],
        },
      ],
      "ts/explicit-member-accessibility": ["error"],
      "ts/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allowSingleOrDouble",
        },
      ],
      "ts/no-floating-promises": ["error"],
      "ts/no-misused-promises": ["error"],
      "ts/no-confusing-void-expression": ["error"],
      "ts/strict-boolean-expressions": ["error"],
      "ts/switch-exhaustiveness-check": ["error"],
      "ts/array-type": ["error", { default: "array-simple" }],
      "ts/no-restricted-types": [
        "error",
        { types: { Omit: "Use `OmitStrict`." } },
      ],
      "ts/no-unsafe-argument": "error",

      // https://typescript-eslint.io/rules/dot-notation/
      "dot-notation": "off",
      "ts/dot-notation": "error",

      "ts/no-redeclare": "off",
    },
  },
  rules: {
    "antfu/no-top-level-await": "off",
    "perfectionist/sort-imports": [
      "error",
      {
        // @ts-expect-error: import のソート順序の決定を perfectionist に任せる
        ...perfectionistRules[0].rules["perfectionist/sort-imports"][1],
        environment: "bun",
      },
    ],
  },
  react: {
    overrides: {
      "react-refresh/only-export-components": "off",
    },
  },
  formatters: true,
  isInEditor: false,
} satisfies ConfigAntfu;

const configPanda = {
  files: ["src/**/*.{ts,tsx}"],
  plugins: {
    "@pandacss": panda,
  },
  rules: {
    ...panda.configs.recommended.rules,
  },
  settings: {
    "@pandacss/configPath": "./panda.config.ts",
  },
} as const satisfies Config;

export default antfu(configTsTsx, configPanda) as unknown as Config;
