const { assert } = require('chai');

const { testShellFactory } = require('../util/test-helpers');
const ShellCommandResult = require('../Shell/ShellCommandResult');

describe('help', function () {
  const testShell = testShellFactory();

  it('displays help information', function () {
    const res = testShell.executeCommand('help');
    assert.instanceOf(res, ShellCommandResult);
    assert.isNotEmpty(res.stdOut);
    assert.isEmpty(res.stdErr);
  });
});
