import { assert } from 'chai'

import ShellCommand from './ShellCommand'
import { testShellFactory } from '../util/test-helpers'

describe('ShellCommand', function() {
  const testShell = testShellFactory()

  it('Successfully creates an instance from only one argument', function() {
    const cmd = new ShellCommand('onearg', testShell)
    assert.equal(cmd.command, 'onearg')
    assert.equal(cmd.args.length, 0)
  })

  it('Successfully creates an instance from multiple arguments', function() {
    const cmd = new ShellCommand('two args', testShell)
    assert.equal(cmd.command, 'two')
    assert.equal(cmd.args.length, 1)
    assert.equal(cmd.args[0], 'args')
  })

  it('Successfully creates an instance from an empty string', function() {
    const cmd = new ShellCommand('', testShell)
    assert.equal(cmd.command, '')
    assert.equal(cmd.args.length, 0)
  })

  it('Successfully handles excessive whitespace', function() {
    const cmd = new ShellCommand('   two     args    ', testShell)
    assert.equal(cmd.command, 'two')
    assert.equal(cmd.args.length, 1)
    assert.equal(cmd.args[0], 'args')
  })

  it('Successfully creates an instance from a string with only whitespace', function() {
    const cmd = new ShellCommand('     ', testShell)
    assert.equal(cmd.command, '')
    assert.equal(cmd.args.length, 0)
  })
})
