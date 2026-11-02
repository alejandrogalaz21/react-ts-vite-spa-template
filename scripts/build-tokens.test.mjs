import assert from 'node:assert/strict';
import { test } from 'node:test';

import { renderTokensCss } from './build-tokens.mjs';

const tokens = {
  color: { themes: ['light', 'dark'], tokens: { bg: { light: '#fff', dark: '#000' } } },
  font: { sans: 'Inter' },
  space: { 1: '4px' },
  radius: { sm: '6px' },
  layout: { 'content-max': '1120px' },
  text: {
    body: { size: '1rem', lineHeight: 1.6, weight: 400 },
    eyebrow: { size: '0.8rem', lineHeight: 1.2, weight: 600, tracking: '0.08em' },
  },
};

test('default theme lives on :root and the others on [data-theme]', () => {
  const css = renderTokensCss(tokens);
  assert.match(css, /:root,\n\[data-theme='light'\] \{\n {2}color-scheme: light;\n {2}--color-bg: #fff;/);
  assert.match(css, /\[data-theme='dark'\] \{\n {2}color-scheme: dark;\n {2}--color-bg: #000;/);
});

test('scalar groups become prefixed custom properties', () => {
  const css = renderTokensCss(tokens);
  for (const line of [
    '--font-sans: Inter;',
    '--space-1: 4px;',
    '--radius-sm: 6px;',
    '--layout-content-max: 1120px;',
  ]) {
    assert.ok(css.includes(line), line);
  }
});

test('text styles become classes; tracking is optional', () => {
  const css = renderTokensCss(tokens);
  assert.match(css, /\.text-body \{\n {2}font-size: 1rem;\n {2}line-height: 1.6;\n {2}font-weight: 400;\n\}/);
  assert.match(css, /\.text-eyebrow \{[^}]*letter-spacing: 0.08em;/);
});
