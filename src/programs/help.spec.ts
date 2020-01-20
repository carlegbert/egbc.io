import { assert } from 'chai'

import { testShellFactory } from '../util/test-helpers'

import ShellCommandResult from '../Shell/ShellCommandResult'

describe('help', function() {
  const testShell = testShellFactory()

  it('displays help information', function() {
    const res = testShell.executeCommand('help')
    assert.instanceOf(res, ShellCommandResult)
    assert.isNotEmpty(res.stdOut)
    assert.isEmpty(res.stdErr)
  })

  it('shows information about programs', function() {
    const res = testShell.executeCommand('help')
    assert.include(res.stdOut, 'mkdir')
  })
})
