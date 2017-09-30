/* eslint-env mocha */
/* eslint-disable prefer-arrow-callback, func-names */

const assert = require('chai').assert;

const { testShell } = require('../util/test-helpers');
const ShellCommandResult = require('../Shell/CommandResult');

describe('clear', function () {
  beforeEach(function () {
    // assign value to innerHTML property of empty object standing in for the DOM
    testShell.outputElement.innerHTML = 'This element is not empty';
  });

  it('clears output element', function () {
    const oldOutputElementContent = testShell.outputElement.innerHTML;
    const res = testShell.executeCommand('clear');
    assert.instanceOf(res, ShellCommandResult);
    assert.notEqual(oldOutputElementContent, testShell.outputElement.innerHTML);
    assert.isEmpty(res.stdOut);
    assert.isEmpty(res.stdErr);
  });
});
