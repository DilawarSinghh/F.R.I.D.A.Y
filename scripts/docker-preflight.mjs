import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execute = promisify(execFile);

export async function dockerOutput(args) {
  try {
    const { stdout } = await execute('docker', args, { timeout: 15000, maxBuffer: 1024 * 1024 });
    return stdout.trim();
  } catch (error) {
    if (error.code === 'ENOENT')
      throw new Error(
        'Docker executable was not found on PATH (ENOENT). Install Docker Engine with Compose v2 and Buildx, then restart your terminal and run node scripts/friday-doctor.mjs.',
        { cause: error },
      );
    const reason = error.stderr?.trim() || error.message;
    const recovery =
      args[0] === 'info'
        ? 'Start Docker and check that your user can run docker info.'
        : args[0] === 'compose'
          ? 'Install or repair the Docker Compose v2 plugin, then run docker compose version.'
          : 'Install or repair the Docker Buildx plugin, then run docker buildx version.';
    throw new Error(`Docker check failed (docker ${args.join(' ')}): ${reason}\n${recovery}`, {
      cause: error,
    });
  }
}

export async function requireDocker() {
  const cpus = Number(await dockerOutput(['info', '--format', '{{.NCPU}}']));
  if (!Number.isInteger(cpus) || cpus < 1)
    throw new Error(
      'Docker did not report a usable CPU count. Check docker info before starting F.R.I.D.A.Y.',
    );
  await dockerOutput(['compose', 'version']);
  await dockerOutput(['buildx', 'version']);
  return cpus;
}
