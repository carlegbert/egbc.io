import { assert } from 'chai'

import BaseFile from './BaseFile'
import { FileKind } from './constants'

class TestFileClass extends BaseFile {
  kind: FileKind.Text = FileKind.Text
}

describe('BaseFile unit tests', function () {
  const testFile = new TestFileClass('testFile', null)

  describe('#getLsEntry()', function () {
    it('Returns correct string', function () {
      const lsString = testFile.getLsEntry()
      const expected = '<span class="inline txt" id="testFile">testFile</span>'
      assert.equal(lsString, expected)
    })
  })

  describe('#getFullPath()', function () {
    it('Returns correct string', function () {
      const fullPath = testFile.getFullPath()
      assert.equal(fullPath, 'testFile')
    })
  })
})
