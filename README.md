Npm Run Script
---

<p align="right">
  <a href="https://npmjs.org/package/npm-run-script">
    <img src="https://img.shields.io/npm/v/npm-run-script.svg?style=flat-square">
  </a>
  <a href="https://travis-ci.org/59naga/npm-run-script">
    <img src="http://img.shields.io/travis/59naga/npm-run-script.svg?style=flat-square">
  </a>
  <a href="https://codeclimate.com/github/59naga/npm-run-script/coverage">
    <img src="https://img.shields.io/codeclimate/github/59naga/npm-run-script.svg?style=flat-square">
  </a>
  <a href="https://gemnasium.com/59naga/npm-run-script">
    <img src="https://img.shields.io/gemnasium/59naga/npm-run-script.svg?style=flat-square">
  </a>
</p>

Installation
---
```bash
npm install npm-run-script --save
```

Motivation
---
`child_process` doesn't know path of the local-installed npm commands.

```bash
npm install eslint
node -e "require('child_process').exec('eslint').stderr.pipe(process.stderr)"
# /bin/sh: eslint: command not found
```

by using [execa](https://github.com/sindresorhus/execa), this problem can be solved. but, can't inherit the stdout.

```bash
npm install execa
node -e "require('execa').shell('eslint').then((result)=>console.log(result))"
# { stdout: 'eslint [options] file.js [file.js] [ ...
```

`npm-run-script` inherits the stdio, and run the command and returns the [child_process](https://nodejs.org/api/child_process.html).

```bash
node -e "require('npm-run-script')('eslint').once('exit',(code)=>console.log('exit in',code))"
# eslint [options] file.js [file.js] [dir]
#
# Basic configuration:
# ...
# exit in 0
```

API
---

## `npmRunScript(command, spawnOptions={stdio:'inherit'})` -> `childProcess`

run the `command` as shell comand in childProcess.

```js
import npmRunScript from 'npm-run-script';

const command = 'eslint && exit 59';
const child = npmRunScript(command, { stdio: 'ignore' });// quiet...
child.once('error', (error) => {
  console.trace(error);
  process.exit(1);
});
child.once('exit', (exitCode) => {
  console.trace('exit in', exitCode);
  process.exit(exitCode);
});
```

Development
---
Requirement global
* NodeJS v5.10.0
* Npm v3.8.3

```bash
git clone https://github.com/59naga/npm-run-script
cd npm-run-script
npm install

npm test
```

License
---
[MIT](http://59naga.mit-license.org/)
