// dependencies
import semver from 'semver';
import npmRunPath from 'npm-run-path';
import { parse } from 'shell-quote';
import spawn from 'cross-spawn';
import { exec } from 'child_process';

// private
const isLatest = semver.gt(process.version, '5.6.0');

/**
* @module npmRunScript
* @param {string} command - an executable shell command
* @param {object} [options={}] - a child_process options
* @returns {child_process} child - the child_process instance
*/
export default (command, options = {}) => {
  const opts = {
    stdio: 'inherit',
    env: {
      ...process.env,
      PATH: npmRunPath(),
    },
    maxBuffer: 1024 * 1024 * 10, // 10 MiB (for legacy NodeJS)
    ...options,
  };

  const parsedCommand = parse(command);
  const notShellCommand = parsedCommand.reduce((can, op) => can && typeof op === 'string', true);

  let child;
  if (notShellCommand) {
    const [file, ...args] = parsedCommand;
    child = spawn(file, args, opts);
  } else if (isLatest) {
    // child_process.spawn {shell} available at version gt 5.6
    // fix: abigailjs/abigail#4
    child = spawn(command, { ...opts, shell: true });
  } else {
    child = exec(command, opts);

    // TODO https://github.com/nodejs/node/issues/2333
    if (opts.stdio === 'inherit') {
      const flush = () => {
        child.stdin.unpipe(process.stdin);
        child.stdout.unpipe(process.stdout);
        child.stderr.unpipe(process.stderr);
      };
      child.stdin.pipe(process.stdin);
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);

      child.once('error', flush);
      child.once('exit', flush);
    }
  }

  return child;
};
