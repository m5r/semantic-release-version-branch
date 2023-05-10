import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export async function shouldCreateBranch(version: string) {
  const [major, minor] = version
    .split('.')
    .map((number) => Number.parseInt(number, 10));
  return execAsync(`git rev-parse --verify ${major}.${minor}.x`)
    .then(() => false)
    .catch(() => execAsync(`git rev-parse --verify origin/${major}.${minor}.x`))
    .then(() => false)
    .catch(() => true);
}
