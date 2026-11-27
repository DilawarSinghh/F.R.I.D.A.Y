import { execFile } from 'node:child_process';
import { access, constants } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { dockerOutput } from './docker-preflight.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const run = promisify(execFile);
let blocked = false;
async function check(label, inspect, required = true) {
  try {
    console.log(`PASS ${label}: ${await inspect()}`);
  } catch (error) {
    if (required) blocked = true;
    const reason =
      error.code === 'ENOENT'
        ? 'required executable or file is missing'
        : error.code || error.message;
    console.log(`${required ? 'BLOCKED' : 'DESKTOP BLOCKED'} ${label}: ${reason}`);
  }
}
console.log(`F.R.I.D.A.Y readiness — ${process.platform}/${process.arch}`);
await check('Node.js', async () => {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 24 || (major === 24 && minor < 21)) throw new Error('Unsupported Node.js version');
  return process.versions.node;
});
await check('locked application dependencies', async () => {
  await access(join(root, 'node_modules/.bin/tsx'), constants.X_OK);
  return 'installed; run pnpm install --frozen-lockfile after lockfile changes';
});
await check('Docker daemon', async () => {
  await dockerOutput(['info', '--format', '{{.NCPU}}']);
  return 'reachable';
});
await check('Docker Compose', async () => {
  await dockerOutput(['compose', 'version']);
  return 'available';
});
await check('Docker Buildx', async () => {
  await dockerOutput(['buildx', 'version']);
  return 'available';
});
await check(
  'desktop native helper',
  async () => {
    const suffix = process.platform === 'win32' ? '.exe' : '';
    const binary = join(
      root,
      'desktop/node_modules/agent-desktop/bin',
      `agent-desktop-${process.platform}-${process.arch}${suffix}`,
    );
    await access(binary, constants.X_OK);
    const { stdout } = await run(binary, ['permissions'], { timeout: 15000, maxBuffer: 65536 });
    const result = JSON.parse(stdout);
    if (result.ok !== true)
      throw new Error(result.error?.code || 'Native helper permissions unavailable');
    const data = result.data ?? result;
    const permissions = data.permissions ?? data;
    if (permissions.accessibility?.state !== 'granted')
      throw new Error('Accessibility service is not granted');
    return 'helper answered; check Computer use in the local desktop app';
  },
  false,
);
if (process.platform === 'linux' && process.env.XDG_SESSION_TYPE === 'wayland')
  console.log(
    'LIMIT Linux Wayland: foreground activation is unavailable; verify each editor operation.',
  );
console.log(
  'MANUAL Configure and verify a model in Settings > Models. This check does not read credentials or call a model.',
);
console.log(
  'MANUAL Browser/web startup does not enable native desktop control. Use the local desktop application.',
);
console.log(
  'MANUAL Live browser, export, form review, takeover and desktop workflows still need end-to-end verification.',
);
process.exitCode = blocked ? 1 : 0;
