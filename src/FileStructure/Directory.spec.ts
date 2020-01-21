import { assert } from 'chai'
import { Directory, TextFile } from './'

describe('Directory unit tests', function() {
  const testDir = new Directory('testDir', null)
  const emptyTestDir = new Directory('emptyTestDir', null)

  describe('#createChild()', function() {
    afterEach(function() {
      testDir.children = []
    })

    it('Creates child directory', function() {
      const childDir = testDir.createChild('testChild', Directory)
      assert.instanceOf(childDir, Directory)
    })

    it('Creates child file', function() {
      const childFile = testDir.createChild('testChild')
      assert.instanceOf(childFile, TextFile)
    })

    it('Creates nested child directory', function() {
      const dir = testDir.createChild('firstDir', Directory) as Directory
      const nestedDir = testDir.createChild(
        'firstDir/nestedDir',
        Directory,
      ) as Directory
      assert.instanceOf(nestedDir, Directory)
      assert.equal(dir.children.length, 1)
      assert.include(dir.children, nestedDir)
    })

    it('Creates nested child file', function() {
      const dir = testDir.createChild('firstDir', Directory) as Directory
      const nestedFile = testDir.createChild('firstDir/nestedFile') as Directory
      assert.instanceOf(nestedFile, TextFile)
      assert.equal(dir.children.length, 1)
      assert.include(dir.children, nestedFile)
    })
  })

  describe('#getChildrenByTypes()', function() {
    before(function() {
      testDir.createChild('firstDirChild', Directory)
      testDir.createChild('testDirFile')
    })

    after(function() {
      testDir.children = []
    })

    it('Finds directory children', function() {
      const dirs = testDir.getChildrenByTypes([Directory])
      assert.equal(dirs.length, 1)
      assert.instanceOf(dirs[0], Directory)
    })

    it('Finds file children', function() {
      const files = testDir.getChildrenByTypes([TextFile])
      assert.equal(files.length, 1)
      assert.instanceOf(files[0], TextFile)
    })

    it('Finds all children', function() {
      const children = testDir.getChildrenByTypes([Directory, TextFile])
      assert.equal(children.length, 2)
    })

    it('Finds all children when no types are passed in', function() {
      const children = testDir.getChildrenByTypes([Directory, TextFile])
      assert.equal(children.length, 2)
    })

    it('Returns empty array when directory is empty', function() {
      const dirs = emptyTestDir.getChildrenByTypes([TextFile])
      const files = emptyTestDir.getChildrenByTypes([Directory])
      const allTypes = emptyTestDir.getChildrenByTypes([Directory, TextFile])
      const noTypes = emptyTestDir.getChildrenByTypes([])
      assert.isEmpty(dirs)
      assert.isEmpty(files)
      assert.isEmpty(allTypes)
      assert.isEmpty(noTypes)
    })
  })

  describe('#findTopParent', function() {
    let child: Directory
    let secondChild: Directory

    before(function() {
      child = testDir.createChild('child', Directory) as Directory
      secondChild = child.createChild('secondChild', Directory) as Directory
    })

    after(function() {
      testDir.children = []
    })

    it('Returns self when directory has no parent', function() {
      const result = testDir.findTopParent()
      assert.equal(result, testDir)
    })

    it('Finds parent when directory has parent', function() {
      const result = child.findTopParent()
      assert.equal(result, testDir)
    })

    it('Finds parent when called on directory multiple levels down', function() {
      const result = secondChild.findTopParent()
      assert.equal(result, testDir)
    })
  })
})
