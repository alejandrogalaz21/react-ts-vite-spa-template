// @ts-check
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import perfectionist from 'eslint-plugin-perfectionist';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const TS_FILES = ['**/*.{ts,tsx}'];

/**
 * ESLint flat config.
 *
 * - typescript-eslint `recommendedTypeChecked` on TS files: rules that need type information
 *   (floating promises, unsafe any) on top of the syntax rules.
 * - react-hooks: rules of hooks plus the React Compiler-aware checks.
 * - jsx-a11y-x: accessibility rules for JSX (maintained fork of eslint-plugin-jsx-a11y, which has
 *   no ESLint 10 support). See docs/decisions/0004-lint-and-format.md.
 * - perfectionist: deterministic import order, so diffs never fight over it.
 * - prettier last: turns off every stylistic rule that Prettier owns.
 */
export default tseslint.config(
  {
    ignores: [
      'build',
      'coverage',
      'storybook-static',
      'playwright-report',
      'test-results',
      '.react-router',
      'node_modules',
      '.claude',
      '.impeccable',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({ ...config, files: TS_FILES })),
  {
    files: TS_FILES,
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
      globals: { ...globals.browser },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      // React Router signals HTTP errors by throwing `data(...)` from loaders.
      '@typescript-eslint/only-throw-error': [
        'error',
        { allow: [{ from: 'package', package: 'react-router', name: 'DataWithResponseInit' }] },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ...reactHooks.configs.flat['recommended-latest'],
  },
  {
    files: ['src/**/*.tsx'],
    ...jsxA11y.configs.recommended,
  },
  {
    plugins: { perfectionist },
    rules: {
      'perfectionist/sort-imports': ['error', { type: 'natural', internalPattern: ['^~/.+'] }],
      'perfectionist/sort-named-imports': ['error', { type: 'natural' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Node scripts, config files and the e2e suite.
    files: ['scripts/**/*.mjs', '*.{js,ts}', 'e2e/**/*.ts', 'public/**/*.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: { 'no-console': 'off' },
  },
  prettier,
);
