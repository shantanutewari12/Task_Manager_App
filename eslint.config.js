// eslint.config.js — ESLint v9 flat config
// typescript-eslint v8 + eslint-plugin-vue v10

import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

// ── Shared TypeScript rule overrides ──────────────────────────────
/** @type {import('typescript-eslint').ConfigArray[number]['rules']} */
const sharedTsRules = {
  'no-unused-vars': 'off',
  'no-undef': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
  ],
  '@typescript-eslint/explicit-function-return-type': [
    'error',
    {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
    },
  ],
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
  ],
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/prefer-optional-chain': 'error',
  '@typescript-eslint/no-non-null-assertion': 'warn',
}

export default [
  // ── 1. Global ignores ─────────────────────────────────────────────
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'vite.config.ts',
      '.husky/**',
      'eslint.config.js',
    ],
  },

  // ── 2. JS base ─────────────────────────────────────────────────────
  js.configs.recommended,

  // ── 3. TypeScript strict (type-aware) for .ts files only ──────────
  ...tseslint.configs.strictTypeChecked.map((cfg) => ({
    ...cfg,
    files: ['src/**/*.ts'],
  })),
  ...tseslint.configs.stylisticTypeChecked.map((cfg) => ({
    ...cfg,
    files: ['src/**/*.ts'],
  })),
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: sharedTsRules,
  },

  // ── 4. Vue SFC files — parser must stay vue-eslint-parser ─────────
  // Apply Vue rules first
  {
    files: ['src/**/*.vue'],
    plugins: { vue: pluginVue },
    processor: pluginVue.processors['.vue'],
    languageOptions: {
      parser: vueParser,          // <── MUST be vue-eslint-parser (outer)
      parserOptions: {
        parser: tseslint.parser,  // <── TS parser for <script> blocks
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Vue 3 essential rules
      ...pluginVue.configs['vue3-essential']?.rules,
      ...pluginVue.configs['vue3-strongly-recommended']?.rules,
      ...pluginVue.configs['vue3-recommended']?.rules,

      // Vue-specific style
      'vue/multi-word-component-names': 'off',
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/define-emits-declaration': ['error', 'type-based'],
      'vue/block-lang': [
        'error',
        { script: { lang: 'ts' }, style: { allowNoLang: true } },
      ],
      'vue/no-unused-vars': 'error',
      'vue/no-unused-refs': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/v-bind-style': 'error',
      'vue/v-on-style': 'error',
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'never', component: 'always' },
          svg: 'always',
          math: 'always',
        },
      ],

      // TypeScript rules that work without full type-info in .vue
      ...sharedTsRules,
    },
  },

  // ── 5. TypeScript plugin registration for .vue files ──────────────
  {
    files: ['src/**/*.vue'],
    plugins: { '@typescript-eslint': tseslint.plugin },
  },
]
