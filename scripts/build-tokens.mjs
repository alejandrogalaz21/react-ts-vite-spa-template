/**
 * Generates src/shared/styles/tokens.css from design/tokens.json.
 *
 *   node scripts/build-tokens.mjs           write the CSS
 *   node scripts/build-tokens.mjs --check   exit 1 if the committed CSS is stale (CI)
 *
 * The generated file is committed so dev, tests and Storybook never depend on a build step.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = `${root}design/tokens.json`;
const TARGET = `${root}src/shared/styles/tokens.css`;

/**
 * Pure transform from the token document to CSS text. Exported for scripts/build-tokens.test.mjs.
 *
 * @param {any} tokens Parsed design/tokens.json.
 * @returns {string}
 */
export function renderTokensCss(tokens) {
  const [defaultTheme, ...otherThemes] = tokens.color.themes;
  const colorVars = (theme) =>
    Object.entries(tokens.color.tokens)
      .map(([name, value]) => `  --color-${name}: ${value[theme]};`)
      .join('\n');
  const scalarVars = (prefix, group) =>
    Object.entries(group)
      .map(([name, value]) => `  --${prefix}-${name}: ${value};`)
      .join('\n');

  let css = '/* Generated from design/tokens.json by scripts/build-tokens.mjs. Do not edit by hand. */\n\n';
  css += `:root,\n[data-theme='${defaultTheme}'] {\n  color-scheme: ${defaultTheme};\n${colorVars(defaultTheme)}\n}\n\n`;
  for (const theme of otherThemes) {
    css += `[data-theme='${theme}'] {\n  color-scheme: ${theme};\n${colorVars(theme)}\n}\n\n`;
  }
  css += ':root {\n';
  css += `${scalarVars('font', tokens.font)}\n${scalarVars('space', tokens.space)}\n`;
  css += `${scalarVars('radius', tokens.radius)}\n${scalarVars('layout', tokens.layout)}\n`;
  css += '}\n';

  for (const [name, style] of Object.entries(tokens.text)) {
    css += `\n.text-${name} {\n  font-size: ${style.size};\n  line-height: ${style.lineHeight};\n  font-weight: ${style.weight};\n`;
    if (style.tracking) css += `  letter-spacing: ${style.tracking};\n`;
    css += '}\n';
  }
  return css;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const css = renderTokensCss(JSON.parse(readFileSync(SOURCE, 'utf8')));
  if (process.argv.includes('--check')) {
    let current = '';
    try {
      current = readFileSync(TARGET, 'utf8');
    } catch {
      // Missing file counts as stale.
    }
    if (current !== css) {
      console.error('src/shared/styles/tokens.css is stale. Run `npm run tokens` and commit the result.');
      process.exit(1);
    }
    console.log('tokens.css is up to date');
  } else {
    writeFileSync(TARGET, css);
    console.log('tokens.css written');
  }
}
