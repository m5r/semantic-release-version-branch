import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { Context } from 'semantic-release';

const execAsync = promisify(exec);

import { shouldCreateBranch } from '../helpers/shouldCreateBranch';

async function success(pluginConfig: void, context: Context) {
  const { options, nextRelease, logger } = context;
  if (!options) {
    logger.error('Missing options from context!');
    return;
  }
  if (!nextRelease) {
    logger.error('Missing nextRelease from context!');
    return;
  }
  if (!['patch', 'minor', 'major'].includes(nextRelease.type)) {
    logger.info(
      'Not a patch, minor or major release. Skipping branch version.'
    );
    return;
  }

  const [major, minor] = nextRelease.version
    .split('.')
    .map((number) => Number.parseInt(number, 10));
  const versionBranch = `${major}.${minor}.x`;
  if (await shouldCreateBranch(nextRelease.version)) {
    logger.info(`Creating branch '${versionBranch}'.`);
    await execAsync(`git checkout -b ${versionBranch}`);
  } else {
    await execAsync(`git checkout ${versionBranch}`);
    try {
      await execAsync(`git cherry-pick HEAD..${nextRelease.version}`);
    } catch (error: any) {
      if (!error.stderr?.includes('empty commit set passed')) {
        logger.error('Unexpected error when cherry-picking commits:', error);
        return;
      }
    }
  }
  await execAsync(`git push ${options.repositoryUrl} ${versionBranch}`);
  await execAsync(`git checkout -`);
}

export default success;
