/* eslint-env mocha */
/* eslint-disable prefer-arrow-callback, func-names */

const { assert } = require('chai');

const { testShellFactory } = require('../util/test-helpers');
const ShellCommandResult = require('../Shell/CommandResult');

describe('ls', function () {
  const testShell = testShellFactory();
  const testDir = testShell.fileStructure.createChild(['testDir'], 'dir');
  testDir.createChild(['nestedTestDir'], 'dir');
  testShell.fileStructure.createChild(['file'], 'dir');

  it('lists files', function () {
    const res = testShell.executeCommand('ls testDir');
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.equal(res.stdOut.length, 1);
    assert.include(res.stdOut[0], 'nestedTestDir');
    assert.notInclude(res.stdOut[0], 'file');
  });

  it('lists files when called with no args', function () {
    const res = testShell.executeCommand('ls');
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.equal(res.stdOut.length, 1);
    assert.include(res.stdOut[0], 'testDir');
    assert.notInclude(res.stdOut[0], 'nestedTestDir');
  });

  it('lists files from multiple directories', function () {
    const res = testShell.executeCommand('ls testDir ~');
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.equal(res.stdOut.length, 2);
    assert.include(res.stdOut[0], 'nestedTestDir');
    assert.include(res.stdOut[1], 'testDir');
  });

  it('lists files from same directory multiple times', function () {
    const res = testShell.executeCommand('ls testDir testDir');
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.equal(res.stdOut.length, 2);
    assert.include(res.stdOut[0], 'nestedTestDir');
    assert.include(res.stdOut[1], 'nestedTestDir');
  });

  it('returns error when unable to find file', function () {
    const res = testShell.executeCommand('ls fakeDir');
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdOut);
    assert.equal(res.stdErr.length, 1);
    assert.include(res.stdErr[0], 'ls: cannot access fakeDir: no such file or directory');
  });

  it('lists files and returns error', function () {
    const res = testShell.executeCommand('ls fakeDir testDir');
    assert.instanceOf(res, ShellCommandResult);
    assert.equal(res.stdErr.length, 1);
    assert.equal(res.stdOut.length, 1);
    assert.include(res.stdErr[0], 'ls: cannot access fakeDir: no such file or directory');
    assert.include(res.stdOut[0], 'nestedTestDir');
  });
});
