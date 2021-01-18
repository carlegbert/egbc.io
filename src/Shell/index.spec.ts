import { assert } from 'chai'

import { FileOpenMode } from '../fs/FileStream'
import { testShellFactory } from '../util/test-helpers'

describe('Shell', () => {
    describe('redirect', () => {
        it('Redirects input to new file with > operator', () => {
            const testShell = testShellFactory()
            const result = testShell.executeCommand('echo foo > newfile.txt')

            const file = testShell.fs.findFile("newfile.txt")
            assert.deepEqual(file.contents, ["foo"])
            assert.isEmpty(result.stdErr)
        })

        it('Redirects input to new file with >> operator', () => {
            const testShell = testShellFactory()
            const result = testShell.executeCommand('echo foo >> newfile.txt')

            const file = testShell.fs.findFile("newfile.txt")
            assert.deepEqual(file.contents, ["foo"])
            assert.isEmpty(result.stdErr)
        })

        it('Overwrites existing file with > operator', () => {
            const testShell = testShellFactory()
            testShell.fs.findOrCreateFile("existing.txt")
            testShell.fs.openFileStream("existing.txt", FileOpenMode.Write).write(["overwrite me please"])

            const result = testShell.executeCommand('echo foo > existing.txt')

            const file = testShell.fs.findFile("existing.txt")
            assert.deepEqual(file.contents, ["foo"])
            assert.isEmpty(result.stdErr)
        })

        it('Appends to new file with >> operator', () => {
            const testShell = testShellFactory()
            testShell.fs.findOrCreateFile("existing.txt")
            testShell.fs.openFileStream("existing.txt", FileOpenMode.Write).write(["do not overwrite me please"])

            const result = testShell.executeCommand('echo foo >> existing.txt')

            const file = testShell.fs.findFile("existing.txt")
            assert.deepEqual(file.contents, ["do not overwrite me please", "foo"])
            assert.isEmpty(result.stdErr)
        })
    })
})