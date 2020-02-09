import { assert } from 'chai'

import { testShellFactory } from '../util/test-helpers'

import ShellCommandResult from '../Shell/ShellCommandResult'
import { Directory } from '../fs'

describe('pwd', function() {
  const testShell = testShellFactory()
  const testDir = testShell.deprecatedFileSystem.createChild(
    'testDir',
    Directory,
  ) as Directory

  it('returns name of current directory', function() {
    const res = testShell.executeCommand('pwd')
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr)
    assert.equal(res.stdOut.length, 1)
    assert.equal(res.stdOut[0], testShell.deprecatedFileSystem.getFullPath())
  })

  it('returns different name when directory changes', function() {
    testShell.currentDir = testDir
    const res = testShell.executeCommand('pwd')
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr)
    assert.equal(res.stdOut.length, 1)
    assert.equal(res.stdOut[0], testDir.getFullPath())
  })
})
