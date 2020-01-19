import { assert } from 'chai'
import Directory from './Directory'
import LinkFile from './LinkFile'

describe('LinkFile unit tests', function() {
  const testDir = new Directory('testDir', null)
  const testLinkFile = new LinkFile(
    'testLinkFile',
    testDir,
    'https://www.carlegbert.com',
  )

  describe('#getLsEntry()', function() {
    it('getLsEntry() returns correct string', function() {
      const lsString = testLinkFile.getLsEntry()
      const expected =
        '<span class="inline link"><a href="https://www.carlegbert.com" target="_blank">testLinkFile<a></span>'
      assert.equal(lsString, expected)
    })
  })
})
