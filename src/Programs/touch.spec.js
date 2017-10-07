/* eslint-env mocha */
/* eslint-disable prefer-arrow-callback, func-names */

const { assert } = require('chai');

const { testShellFactory } = require('../util/test-helpers');
const ShellCommandResult = require('../Shell/CommandResult');

describe('touch', function () {
  const testShell = testShellFactory();
  const children = testShell.fileStructure.children;

  afterEach(function () {
    children.splice(0, 9);
  });

  it('creates file', function () {
    const res = testShell.executeCommand('touch newFile');
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.empty(res.stdOut);
    assert.equal(children.length, 1);
    assert.equal(children[0].name, 'newFile');
  });

  it('creates multiple files', function () {
    const res = testShell.executeCommand('touch newFileOne newFileTwo');
    const namesOfChildren = children.map(child => child.name);
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.empty(res.stdOut);
    assert.equal(children.length, 2);
    assert.include(namesOfChildren, 'newFileOne');
    assert.include(namesOfChildren, 'newFileTwo');
  });

  it('updates lastModified when invoked on existing file', function () {
    const testFile = testShell.fileStructure.createChild(['testFile']);
    const oldLastModified = testShell.lastModified;
    const res = testShell.executeCommand('touch testFile');
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdErr);
    assert.empty(res.stdOut);
    assert.equal(children.length, 1);
    assert.notEqual(testFile.lastModified, oldLastModified);
    assert.equal(children[0], testFile);
  });

  it('fails when given invalid filepath', function () {
    const res = testShell.executeCommand('touch x/y/z');
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdOut);
    assert.equal(res.stdErr.length, 1);
    assert.equal(res.stdErr[0], 'touch: cannout touch x/y/z: No such file or directory');
  });

  it('fails multiple times when given invalid filepaths', function () {
    const res = testShell.executeCommand('touch x/y/z a/b/c');
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdOut);
    assert.equal(res.stdErr.length, 2);
    assert.include(res.stdErr, 'touch: cannout touch x/y/z: No such file or directory');
    assert.include(res.stdErr, 'touch: cannout touch a/b/c: No such file or directory');
  });

  it('fails and succeeds in same command', function () {
    const res = testShell.executeCommand('touch newFile x/y/z');
    const namesOfChildren = children.map(child => child.name);
    assert.instanceOf(res, ShellCommandResult);
    assert.empty(res.stdOut);
    assert.equal(res.stdErr.length, 1);
    assert.equal(res.stdErr[0], 'touch: cannout touch x/y/z: No such file or directory');
    assert.equal(children.length, 1);
    assert.include(namesOfChildren, 'newFile');
  });
});
