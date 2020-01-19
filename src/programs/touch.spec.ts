import { assert } from 'chai'

import { testShellFactory } from '../util/test-helpers'
import { FixMe } from 'types'

const { Directory } = require('../FileStructure')
const ShellCommandResult = require('../Shell/ShellCommandResult')

describe('touch', function() {
  const testShell = testShellFactory()
  const children: FixMe.File[] = testShell.fileStructure.children

  afterEach(function() {
    children.splice(0, 9)
  })

  it('creates file', function() {
    const res = testShell.executeCommand('touch newFile')
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr, 'expected res.stdErr to be empty')
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.equal(children.length, 1, 'expected children.length to equal 1')
    assert.equal(
      children[0].name,
      'newFile',
      'expected children[0].name to equal "newFile"',
    )
  })

  it('creates multiple files', function() {
    const res = testShell.executeCommand('touch newFileOne newFileTwo')
    const namesOfChildren = children.map(child => child.name)
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr, 'expected res.stdErr to be empty')
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.equal(children.length, 2, 'expected children.length to equal 2')
    assert.include(namesOfChildren, 'newFileOne')
    assert.include(namesOfChildren, 'newFileTwo')
  })

  it('updates lastModified when invoked on existing file', function() {
    const testFile = testShell.fileStructure.createChild('testFile')
    const oldLastModified = testFile.lastModified
    const res = testShell.executeCommand('touch testFile')
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr, 'expected res.stdErr to be empty')
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.equal(children.length, 1, 'expected children.length to equal 1')
    assert.notEqual(testFile.lastModified, oldLastModified)
    assert.equal(
      children[0],
      testFile,
      'expected children[0] to equal testFile',
    )
  })

  it('fails when given invalid filepath', function() {
    const res = testShell.executeCommand('touch x/y/z')
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.equal(res.stdErr.length, 1, 'expected res.stdErr.length to equal 1')
    assert.equal(
      res.stdErr[0],
      'touch: cannout touch x/y/z: No such file or directory',
    )
  })

  it('fails multiple times when given invalid filepaths', function() {
    const res = testShell.executeCommand('touch x/y/z a/b/c')
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.equal(res.stdErr.length, 2, 'expected res.stdErr.length to equal 2')
    assert.include(
      res.stdErr,
      'touch: cannout touch x/y/z: No such file or directory',
    )
    assert.include(
      res.stdErr,
      'touch: cannout touch a/b/c: No such file or directory',
    )
  })

  it('fails and succeeds in same command', function() {
    const res = testShell.executeCommand('touch newFile x/y/z')
    const namesOfChildren = children.map(child => child.name)
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.equal(res.stdErr.length, 1, 'expected res.stdErr.length to equal 1')
    assert.equal(
      res.stdErr[0],
      'touch: cannout touch x/y/z: No such file or directory',
    )
    assert.equal(children.length, 1, 'expected children.length to equal 1')
    assert.include(namesOfChildren, 'newFile')
  })

  it('fails when called with no arguments', function() {
    const res = testShell.executeCommand('touch')
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.equal(res.stdErr.length, 1, 'expected res.stdErr.length to equal 1')
    assert.equal(res.stdErr[0], 'touch: missing file operand')
  })

  it('creates file in directory', function() {
    const dir = testShell.fileStructure.createChild('testDir', Directory)
    const res = testShell.executeCommand('touch testDir/newFile')
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.isEmpty(res.stdErr, 'expected res.stdErr to be empty')
    assert.equal(
      dir.children.length,
      1,
      'expected testDir to have one child file',
    )
    assert.equal(
      dir.children[0].name,
      'newFile',
      'expected newFile to be created in testDir',
    )
  })
})
