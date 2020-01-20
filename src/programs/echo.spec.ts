import { assert } from 'chai'

import { testShellFactory } from '../util/test-helpers'
import ShellCommandResult from '../Shell/ShellCommandResult'

describe('echo', function() {
  const testShell = testShellFactory()

  it('returns single word', function() {
    const res = testShell.executeCommand('echo testCommand')
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr)
    assert.equal(res.stdOut.length, 1)
    assert.equal(res.stdOut[0], 'testCommand')
  })

  it('returns multiple words', function() {
    const str = 'these should all show up in result of echo'
    const res = testShell.executeCommand(`echo ${str}`)
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr)
    assert.equal(res.stdOut.length, 1)
    assert.equal(res.stdOut[0], str)
  })

  it('returns nothing when not passed args', function() {
    const res = testShell.executeCommand('echo')
    assert.instanceOf(res, ShellCommandResult)
    assert.isEmpty(res.stdErr)
    assert.equal(res.stdOut.length, 1)
    assert.isEmpty(res.stdOut[0])
  })
})
