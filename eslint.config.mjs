import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	{
		ignores: ["**/node_modules/**", "**/.next/**", "src/components/ui/**"],
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		plugins: { js },
		extends: ["js/recommended"],
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		languageOptions: {
			globals: globals.browser,
		},
	},
	tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	{
		plugins: { prettier },
		rules: {
			quotes: ["error", "double"],
			indent: ["error", "tab", { SwitchCase: 1 }],
			semi: ["error", "always"],
			"react/react-in-jsx-scope": "off",
			"prettier/prettier": "off",
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
]);
