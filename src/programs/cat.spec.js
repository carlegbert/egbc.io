const { assert } = require('chai');

const { testShellFactory } = require('../util/test-helpers');
const { Directory, File } = require('../FileStructure');
const ShellCommandResult = require('../Shell/ShellCommandResult');

describe('cat', function () {
  const testShell = testShellFactory();
  const textObject = ['test line one', 'test line two'];
  const testFile = testShell.fileStructure.createChild('testFile', File);
  const secondTestFile = testShell.fileStructure.createChild('secondTestFile', File);
  testFile.contents = textObject;
  secondTestFile.contents = ['test line three'];

  it('returns ShellCommandResult with correct sdout', function () {
    const res = testShell.executeCommand('cat testFile');
    assert.instanceOf(res, ShellCommandResult);
    assert.equal(res.stdOut.length, testFile.contents.length);
    assert.equal(res.stdOut[0], textObject[0]);
    assert.equal(res.stdOut[1], textObject[1]);
    assert.equal(res.stdOut.length, textObject.length);
    assert.isEmpty(res.stdErr);
  });

  it('fails when called on non-existent file', function () {
    const res = testShell.executeCommand('cat nonExistantFile');
    assert.instanceOf(res, ShellCommandResult);
    assert.equal(res.stdErr[0], 'cat: nonExistantFile: No such file or directory');
    assert.isEmpty(res.stdOut);
  });

  it('successfully cats multiple files', function () {
    const res = testShell.executeCommand('cat testFile secondTestFile');
    assert.instanceOf(res, ShellCommandResult);
    assert.equal(res.stdOut[0], textObject[0]);
    assert.equal(res.stdOut[1], textObject[1]);
    assert.equal(res.stdOut[2], 'test line three');
    assert.equal(res.stdOut.length, 3);
    assert.isEmpty(res.stdErr);
  });

  it('cats multiple files in correct order', function () {
    const res = testShell.executeCommand('cat secondTestFile testFile');
    assert.instanceOf(res, ShellCommandResult);
    assert.equal(res.stdOut[0], 'test line three');
    assert.equal(res.stdOut[1], textObject[0]);
    assert.equal(res.stdOut[2], textObject[1]);
    assert.equal(res.stdOut.length, 3);
    assert.isEmpty(res.stdErr);
  });

  it('cats file and returns stdErr in same command', function () {
    const res = testShell.executeCommand('cat testFile nonExistantFile');
    assert.instanceOf(res, ShellCommandResult);
    assert.equal(res.stdErr.length, 1);
    assert.equal(res.stdOut[0], 'test line one');
    assert.equal(res.stdErr[0], 'cat: nonExistantFile: No such file or directory');
  });

  it('fails when called on directory', function () {
    testShell.fileStructure.createChild('testDir', Directory);
    const res = testShell.executeCommand('cat testDir');
    assert.instanceOf(res, ShellCommandResult);
    assert.equal(res.stdOut.length, 0);
    assert.equal(res.stdErr.length, 1);
    assert.equal(res.stdErr[0], 'cat: testDir: Is a directory');
  });

  it('does nothing when called with no args', function () {
    const res = testShell.executeCommand('cat');
    assert.instanceOf(res, ShellCommandResult);
    assert.equal(res.stdOut.length, 0);
    assert.equal(res.stdErr.length, 0);
  });
});
