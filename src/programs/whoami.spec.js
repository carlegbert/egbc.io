const { assert } = require('chai');

const { testShellFactory } = require('../util/test-helpers');
const ShellCommandResult = require('../Shell/ShellCommandResult');

describe('whoami', function () {
  const testShell = testShellFactory();

  it('outputs current user', function () {
    const res = testShell.executeCommand('whoami');
    assert.instanceOf(res, ShellCommandResult);
    assert.isNotEmpty(res.stdOut);
    assert.isEmpty(res.stdErr);
    assert.equal(res.stdOut[0], testShell.user);
  });
});
