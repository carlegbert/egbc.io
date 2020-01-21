import { assert } from 'chai'

import { testShellFactory } from '../util/test-helpers'
import { Directory, TextFile } from '../FileStructure'

import ShellCommandResult from '../Shell/ShellCommandResult'

describe('mkdir', function() {
  const testShell = testShellFactory()
  const children = testShell.fileStructure.children

  beforeEach(function() {
    children.splice(0, 9)
  })

  it('creates directory', function() {
    const res = testShell.executeCommand('mkdir testDir') as ShellCommandResult<
      Directory[]
    >
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr, 'expected res.stdErr to be empty')
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.equal(children.length, 1)
    assert.instanceOf(children[0], Directory)
    assert.equal(children[0].name, 'testDir')
    assert.equal(res.data && res.data[0], children[0] as Directory)
  })

  it('does nothing when called with directory name that already exists', function() {
    testShell.fileStructure.createChild('testDir', Directory)
    const res = testShell.executeCommand('mkdir testDir')
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr, 'expected res.stdErr to be empty')
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.isEmpty(res.data, 'expected res.data to be empty')
  })

  it('creates multiple directories', function() {
    const res = testShell.executeCommand(
      'mkdir testDir secondTestDir',
    ) as ShellCommandResult<Directory[]>
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr, 'expected res.stdErr to be empty')
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.equal(res.data?.length, 2)
    assert.equal(children.length, 2)
    assert.include(children, res.data && res.data[0])
    assert.include(children, res.data && res.data[1])
    assert.instanceOf(res.data && res.data[0], Directory)
  })

  it('creates nested directory', function() {
    const testDir = testShell.fileStructure.createChild(
      'testDir',
      Directory,
    ) as Directory
    const res = testShell.executeCommand(
      'mkdir testDir/nestedTestDir',
    ) as ShellCommandResult<Directory[]>
    const createdDir = res.data && res.data[0]
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr, 'expected res.stdErr to be empty')
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.equal(testDir.children.length, 1)
    assert.instanceOf(createdDir, Directory)
    assert.include(testDir.children, createdDir)
    assert.equal(createdDir?.name, 'nestedTestDir')
  })

  it('fails to create directory when called with bad path', function() {
    const res = testShell.executeCommand('mkdir x/y/z')
    assert.equal(children.length, 0)
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.equal(res.stdErr.length, 1, 'stderr has incorrect number of members')
    assert.equal(
      res.stdErr[0],
      'mkdir: cannot create directory x/y/z: No such file or directory',
    )
  })

  it('fails to create directory when called with non-dir existing filepath', function() {
    testShell.fileStructure.createChild('testFile')
    const res = testShell.executeCommand('mkdir testFile')
    assert.equal(children.length, 1)
    assert.instanceOf(res, ShellCommandResult)
    assert.instanceOf(children[0], TextFile)
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.isEmpty(res.data, 'expected res.data to be empty')
    assert.equal(res.stdErr.length, 1, 'stderr has incorrect number of members')
    assert.equal(
      res.stdErr[0],
      "mkdir: cannot create directory 'testFile': File exists",
    )
  })

  it('creates dir and returns error message when called with both good and bad arguments', function() {
    const res = testShell.executeCommand(
      'mkdir testDir x/y/z',
    ) as ShellCommandResult<Directory[]>
    const createdDir = res.data && res.data[0]
    assert.equal(children.length, 1)
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.equal(res.stdErr.length, 1, 'stderr has incorrect number of members')
    assert.equal(
      res.stdErr[0],
      'mkdir: cannot create directory x/y/z: No such file or directory',
    )
    assert.equal(res.data?.length, 1)
    assert.include(children, createdDir)
  })

  it('fails when not passed an argument', function() {
    const res = testShell.executeCommand('mkdir')
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdOut, 'expected res.stdOut to be empty')
    assert.equal(res.stdErr.length, 1, 'stderr has incorrect number of members')
    assert.equal(res.stdErr[0], 'mkdir: missing operand')
  })
})
