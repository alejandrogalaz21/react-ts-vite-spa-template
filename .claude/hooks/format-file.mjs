// PostToolUse hook: formats the file Claude just wrote or edited, so every change lands already
// formatted (Prettier) and lint-fixed (ESLint) without an extra step. Never blocks: on any error
// it exits 0 and the regular `npm run lint` / CI still catches problems.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const file = input?.tool_input?.file_path;
  if (typeof file === 'string' && /\.(ts|tsx|js|mjs|json|css|md|ya?ml)$/.test(file)) {
    const run = (args) => execFileSync('npx', args, { stdio: 'ignore', shell: process.platform === 'win32' });
    if (/\.(ts|tsx|js|mjs)$/.test(file)) {
      try {
        run(['eslint', '--fix', file]);
      } catch {
        // Lint errors are reported by `npm run lint`; formatting still runs.
      }
    }
    run(['prettier', '--write', '--ignore-unknown', file]);
  }
} catch {
  // Never fail the tool call because of formatting.
}
