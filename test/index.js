// dependencies
import test from 'ava';
import Promise from 'bluebird';

// target
import npmRunScript from '../src';

// helper
const result = (child) => new Promise((resolve, reject) => {
  child.once('exit', resolve);
  child.once('error', reject);
});

// specs
test('should be able to run the bin', async (t) => {
  const child = npmRunScript('eslint', { stdio: 'ignore' });
  const code = await result(child);

  t.true(code === 0);
});

test('shell command should spawn in as much as possible', async (t) => {
  const child = npmRunScript('eslint && exit 59', { stdio: 'ignore' });
  const code = await result(child);

  t.true(code === 59);
});
