/* eslint-env mocha */
/* eslint-disable prefer-arrow-callback, func-names */

const { assert } = require('chai');

const { testShellFactory } = require('../util/test-helpers');
const ShellCommandResult = require('../Shell/CommandResult');

describe('echo', function () {
  const testShell = testShellFactory();

  it('returns single word', function () {
    const res = testShell.executeCommand('echo testCommand');
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.equal(res.stdOut.length, 1);
    assert.equal(res.stdOut[0], 'testCommand');
  });

  it('returns multiple words', function () {
    const str = 'these should all show up in result of echo';
    const res = testShell.executeCommand(`echo ${str}`);
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.equal(res.stdOut.length, 1);
    assert.equal(res.stdOut[0], str);
  });

  it('returns nothing when not passed args', function () {
    const res = testShell.executeCommand('echo');
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.equal(res.stdOut.length, 1);
    assert.empty(res.stdOut[0]);
  });

  it('does not pick up flags', function () {
    const res = testShell.executeCommand('echo some words -a -b -c');
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.equal(res.stdOut.length, 1);
    assert.equal(res.stdOut[0], 'some words');
  });
});
