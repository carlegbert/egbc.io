/* eslint-env mocha */
/* eslint-disable prefer-arrow-callback, func-names, no-unused-vars */

const assert = require('chai').assert;

const { testShell } = require('../util/test-helpers');
const { File } = require('../FileStructure');
const { textEquals } = require('../util/io');
const ShellCommandResult = require('../Shell/CommandResult');

describe('cat', function () {
  const textObject = ['test line one', 'test line two'];
  const testFile = testShell.fileStructure.createChild(['~', 'testFile'], 'txt');
  const secondTestFile = testShell.fileStructure.createChild(['~', 'secondTestFile'], 'txt');
  testFile.contents = textObject;
  secondTestFile.contents = ['test line three'];

  it('returns ShellCommandResult with correct sdout', function () {
    const res = testShell.executeCommand('cat testFile');
    assert.instanceOf(res, ShellCommandResult);
    assert.equal(res.stdOut[0], textObject[0]);
    assert.equal(res.stdOut[1], textObject[1]);
    assert.equal(res.stdOut.length, textObject.length);
    assert.isEmpty(res.stdErr);
  });

  it('fails when called on non-existent file', function () {
    const res = testShell.executeCommand('cat nonExistantFile');
    assert.equal(res.stdErr[0], 'cat: nonExistantFile: No such file or directory');
    assert.isEmpty(res.stdOut);
  });

  it('successfully cats multiple files', function () {
    const res = testShell.executeCommand('cat testFile secondTestFile');
    assert.equal(res.stdOut[0], textObject[0]);
    assert.equal(res.stdOut[1], textObject[1]);
    assert.equal(res.stdOut[2], 'test line three');
    assert.equal(res.stdOut.length, 3);
    assert.isEmpty(res.stdErr);
  });

  it('cats multiple files in correct order', function () {
    const res = testShell.executeCommand('cat secondTestFile testFile');
    assert.equal(res.stdOut[0], 'test line three');
    assert.equal(res.stdOut[1], textObject[0]);
    assert.equal(res.stdOut[2], textObject[1]);
    assert.equal(res.stdOut.length, 3);
    assert.isEmpty(res.stdErr);
  });

  it('cats file and returns stdErr in same command', function () {
    const res = testShell.executeCommand('cat testFile nonExistantFile');
    assert.equal(res.stdOut[0], 'test line one');
    assert.equal(res.stdErr[0], 'cat: nonExistantFile: No such file or directory');
  });
});
