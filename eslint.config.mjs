import eslint from "@eslint/js"
import tseslint from 'typescript-eslint';
import eslintPluginVue from 'eslint-plugin-vue'
import pluginCypress from 'eslint-plugin-cypress/flat'
import globals from 'globals'


export default tseslint.config(
//    { ignores: ['*.d.ts', '**/coverage', '**/dist'] },
    {
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...eslintPluginVue.configs['flat/essential'],
            pluginCypress.configs.recommended
        ],
        files: ['**/*.{ts,vue}'],
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

            "cypress/unsafe-to-chain-command": "off",
        }
    }
)
