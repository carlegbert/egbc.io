/* eslint-env mocha */
/* eslint-disable prefer-arrow-callback, func-names */

const { assert } = require('chai');

const { testShellFactory } = require('../util/test-helpers');
const ShellCommandResult = require('../Shell/CommandResult');

describe('cd', function () {
  const testShell = testShellFactory();
  const testDir = testShell.fileStructure.createChild(['testDir'], 'dir');
  const nestedTestDir = testDir.createChild(['nestedTestDir'], 'dir');

  beforeEach(function () {
    testShell.currentDir = testShell.fileStructure;
  });

  it('changes directories', function () {
    const res = testShell.executeCommand('cd testDir');
    assert.equal(testShell.currentDir, testDir);
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.empty(res.stdOut);
  });

  it('changes PS1 string', function () {
    testShell.executeCommand('cd testDir');
    const ps1 = testShell.getPS1String();
    assert.include(ps1, '~/testDir');
  });

  it('changes to nested directory', function () {
    const res = testShell.executeCommand('cd testDir/nestedTestDir');
    assert.equal(testShell.currentDir, nestedTestDir);
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.empty(res.stdOut);
  });

  it('changes to filestructure root when called with no args', function () {
    testShell.currentDir = nestedTestDir;
    const res = testShell.executeCommand('cd');
    assert.equal(testShell.currentDir, testShell.fileStructure);
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.empty(res.stdOut);
  });

  it('changes to filestructure root when called with tilde', function () {
    testShell.currentDir = nestedTestDir;
    const res = testShell.executeCommand('cd ~');
    assert.equal(testShell.currentDir, testShell.fileStructure);
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.empty(res.stdOut);
  });

  it('returns stderr when passed bad arg', function () {
    const res = testShell.executeCommand('cd fakeDir');
    assert.equal(testShell.currentDir, testShell.fileStructure);
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdOut);
    assert.equal(res.stdErr.length, 1);
    assert.equal(res.stdErr[0], 'fakeDir: directory not found');
    assert.empty(res.stdOut);
  });

  it('only uses first arg when passed multiple args', function () {
    const res = testShell.executeCommand('cd testDir .. ~ fakeDir');
    assert.equal(testShell.currentDir, testDir);
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.empty(res.stdOut);
  });
});