/* eslint-env mocha */
/* eslint-disable prefer-arrow-callback, func-names */

const { assert } = require('chai');

const { testShellFactory } = require('../util/test-helpers');
const ShellCommandResult = require('../Shell/CommandResult');

describe('pwd', function () {
  const testShell = testShellFactory();
  const testDir = testShell.fileStructure.createChild(['testDir']);

  it('returns name of current directory', function () {
    const res = testShell.executeCommand('pwd');
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.equal(res.stdOut.length, 1);
    assert.equal(res.stdOut[0], testShell.fileStructure.getFullPath());
  });

  it('returns different name when directory changes', function () {
    testShell.currentDir = testDir;
    const res = testShell.executeCommand('pwd');
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.equal(res.stdOut.length, 1);
    assert.equal(res.stdOut[0], testDir.getFullPath());
  });
});
