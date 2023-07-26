import {PACKAGE_MANAGER, getProjectPM} from '@react-native-community/cli-tools';
import versionRanges from '../versionRanges';
import {doesSoftwareNeedToBeFixed} from '../checkInstallation';
import {install} from '../install';
import {HealthCheckInterface} from '../../types';

const packageManager = getProjectPM();

const yarn: HealthCheckInterface = {
  label: 'yarn',
  description: 'Required to install NPM dependencies',
  getDiagnostics: async ({Binaries}) => ({
    needsToBeFixed: doesSoftwareNeedToBeFixed({
      version: Binaries.Yarn.version,
      versionRange: versionRanges.YARN,
    }),
    version: Binaries.Yarn.version,
    versionRange: versionRanges.YARN,
  }),
  // Only show `yarn` if there's a `yarn.lock` file in the current directory
  // or if we can't identify that the user uses yarn or npm
  visible:
    packageManager === PACKAGE_MANAGER.YARN || packageManager === undefined,
  runAutomaticFix: async ({loader}) =>
    await install({
      pkg: 'yarn',
      label: 'yarn',
      url: 'https://yarnpkg.com/docs/install',
      loader,
    }),
};

const npm: HealthCheckInterface = {
  label: 'npm',
  description: 'Required to install NPM dependencies',
  getDiagnostics: async ({Binaries}) => ({
    needsToBeFixed: doesSoftwareNeedToBeFixed({
      version: Binaries.npm.version,
      versionRange: versionRanges.NPM,
    }),
    version: Binaries.npm.version,
    versionRange: versionRanges.NPM,
  }),
  // Only show `yarn` if there's a `package-lock.json` file in the current directory
  // or if we can't identify that the user uses yarn or npm
  visible:
    packageManager === PACKAGE_MANAGER.NPM || packageManager === undefined,
  runAutomaticFix: async ({loader}) =>
    await install({
      pkg: 'node',
      label: 'node',
      url: 'https://nodejs.org/',
      loader,
    }),
};

export {packageManager, yarn, npm};
