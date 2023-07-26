import execa from 'execa';
import {PACKAGE_MANAGER, logger} from '@react-native-community/cli-tools';
import {getYarnVersionIfAvailable, isProjectUsingYarn} from './yarn';

type Options = {
  pm?: PACKAGE_MANAGER;
  silent?: boolean;
  root: string;
};

const packageManagers = {
  yarn: {
    init: ['init', '-y'],
    install: ['add'],
    installDev: ['add', '-D'],
    uninstall: ['remove'],
    installAll: ['install'],
  },
  npm: {
    init: ['init', '-y'],
    install: ['install', '--save', '--save-exact'],
    installDev: ['install', '--save-dev', '--save-exact'],
    uninstall: ['uninstall', '--save'],
    installAll: ['install'],
  },
  pnpm: {
    init: ['init'],
    install: ['add'],
    installDev: ['add', '-D'],
    uninstall: ['remove'],
    installAll: ['install'],
  },
};

function configurePackageManager(
  packageNames: Array<string>,
  action: 'init' | 'install' | 'installDev' | 'installAll' | 'uninstall',
  options: Options,
) {
  const pm = options.pm
    ? options.pm
    : shouldUseYarn(options)
    ? PACKAGE_MANAGER.YARN
    : PACKAGE_MANAGER.NPM;
  const [executable, ...flags] = packageManagers[pm][action];
  const args = [executable, ...flags, ...packageNames];
  return executeCommand(pm, args, options);
}

function executeCommand(
  command: string,
  args: Array<string>,
  options: Options,
) {
  return execa(command, args, {
    stdio: options.silent && !logger.isVerbose() ? 'pipe' : 'inherit',
    cwd: options.root,
  });
}

function shouldUseYarn(options: Options) {
  return isProjectUsingYarn(options.root) && getYarnVersionIfAvailable();
}

export function init(options: Options) {
  return configurePackageManager([], 'init', options);
}

export function install(packageNames: Array<string>, options: Options) {
  return configurePackageManager(packageNames, 'install', options);
}

export function installDev(packageNames: Array<string>, options: Options) {
  return configurePackageManager(packageNames, 'installDev', options);
}

export function uninstall(packageNames: Array<string>, options: Options) {
  return configurePackageManager(packageNames, 'uninstall', options);
}

export function installAll(options: Options) {
  return configurePackageManager([], 'installAll', options);
}
