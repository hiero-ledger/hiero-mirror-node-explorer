import eslint from "@eslint/js"
import tseslint from 'typescript-eslint';
import eslintPluginVue from 'eslint-plugin-vue'
import pluginCypress from 'eslint-plugin-cypress/flat'
import globals from 'globals'


export default tseslint.config(
//    { ignores: ['*.d.ts', '**/coverage', '**/dist'] },
    {
        files: ['src/**/*.{ts,vue}'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...eslintPluginVue.configs['flat/essential'],
            pluginCypress.configs.recommended
        ],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
            parserOptions: {
                parser: tseslint.parser,
            },
        },
        rules: {

            "@typescript-eslint/no-explicit-any": "off",

            "vue/no-reserved-component-names": "off",
            "vue/multi-word-component-names": "off",
            "vue/no-mutating-props": "off",

            "complexity": ["error", 8],
            "max-lines-per-function": ["error", 50]
        }
    },
    {
        files: ['tests/**/*.ts'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...eslintPluginVue.configs['flat/essential'],
            pluginCypress.configs.recommended
        ],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
            parserOptions: {
                parser: tseslint.parser,
            },
        },
        rules: {
            "max-lines-per-function": "off",
            "@typescript-eslint/no-explicit-any": "off",
        }
    }
)
