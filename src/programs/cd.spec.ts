import { assert } from 'chai'

import { testShellFactory } from '../util/test-helpers'
import { Directory } from '../FileStructure'

import ShellCommandResult from '../Shell/ShellCommandResult'

describe('cd', function() {
  const testShell = testShellFactory()
  const testDir = testShell.fileStructure.createChild('testDir', Directory)
  const nestedTestDir = testDir.createChild('nestedTestDir', Directory)

  beforeEach(function() {
    testShell.currentDir = testShell.fileStructure
  })

  it('changes directories', function() {
    const res = testShell.executeCommand('cd testDir')
    assert.equal(testShell.currentDir, testDir)
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr)
    assert.isEmpty(res.stdOut)
  })

  it('changes PS1 string', function() {
    testShell.executeCommand('cd testDir')
    const ps1 = testShell.getPS1String()
    assert.include(ps1, '~/testDir')
  })

  it('changes to nested directory', function() {
    const res = testShell.executeCommand('cd testDir/nestedTestDir')
    assert.instanceOf(res, ShellCommandResult)
    assert.equal(testShell.currentDir, nestedTestDir)
    assert.isEmpty(res.stdErr)
    assert.isEmpty(res.stdOut)
  })

  it('changes to filestructure root when called with no args', function() {
    testShell.currentDir = nestedTestDir
    const res = testShell.executeCommand('cd')
    assert.equal(testShell.currentDir, testShell.fileStructure)
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr)
    assert.isEmpty(res.stdOut)
  })

  it('changes to filestructure root when called with tilde', function() {
    testShell.currentDir = nestedTestDir
    const res = testShell.executeCommand('cd ~')
    assert.equal(testShell.currentDir, testShell.fileStructure)
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr)
    assert.isEmpty(res.stdOut)
  })

  it('returns stderr when passed bad arg', function() {
    const res = testShell.executeCommand('cd fakeDir')
    assert.equal(testShell.currentDir, testShell.fileStructure)
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdOut)
    assert.equal(res.stdErr.length, 1)
    assert.equal(res.stdErr[0], 'fakeDir: directory not found')
    assert.isEmpty(res.stdOut)
  })

  it('errors when passed multiple args', function() {
    const res = testShell.executeCommand('cd testDir .. ~ fakeDir')
    assert.equal(testShell.currentDir, testShell.fileStructure)
    assert.instanceOf(res, ShellCommandResult)
    assert.equal(res.stdErr?.length, 1)
    assert.includeMembers(res.stdErr, ['cd: too many arguments'])
    assert.isEmpty(res.stdOut)
  })
})
