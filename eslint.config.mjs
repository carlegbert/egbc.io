import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            require: true,
            module: true,
        },

        parser: tsParser,
        ecmaVersion: 2018,
        sourceType: "module",
    },

    rules: {
        "no-var": "error",
        "no-console": "error",
        "dot-notation": "error",
        "prefer-const": "error",
    },
}, {
    files: ["**/*.ts"],

    rules: {
        "@typescript-eslint/member-delimiter-style": "off",
        "@typescript-eslint/member-ordering": "warn",

        "@typescript-eslint/explicit-member-accessibility": ["warn", {
            overrides: {
                constructors: "no-public",
            },
        }],
    },
}, {
    files: ["**/*.js"],

    rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
    },
}, {
    files: ["**/*.spec.js"],

    languageOptions: {
        globals: {
            ...globals.mocha,
        },
    },

    rules: {
        "prefer-arrow-callback": "off",
        "func-names": "off",
    },
}];
