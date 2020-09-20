import { assert } from 'chai'
import { Directory, LinkFile } from '.'

describe('LinkFile unit tests', function() {
  const testDir = new Directory('testDir', null)
  const testLinkFile = new LinkFile(
    'testLinkFile',
    testDir,
    'https://egbc.io',
  )

  describe('#getLsEntry()', function() {
    it('getLsEntry() returns correct string', function() {
      const lsString = testLinkFile.getLsEntry()
      const expected =
        '<span class="inline link"><a href="https://egbc.io" target="_blank">testLinkFile<a></span>'
      assert.equal(lsString, expected)
    })
  })
})
