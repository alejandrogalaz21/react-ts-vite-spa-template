/** Runs on staged files only (pre-commit hook). Full checks live in CI and `npm run check`. */
export default {
  '*.{ts,tsx,js,mjs}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,css,yml,yaml,html}': ['prettier --write'],
};
