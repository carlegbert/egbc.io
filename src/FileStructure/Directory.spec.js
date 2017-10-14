const { assert } = require('chai');

const Directory = require('./Directory');
const File = require('./File');

describe('Directory unit tests', function () {
  const testDir = new Directory('testDir', null);
  const emptyTestDir = new Directory('emptyTestDir', null);

  describe('#createChild()', function () {
    after(function () {
      testDir.children = [];
    });

    it('Creates child directory', function () {
      const childDir = testDir.createChild(['childDir'], Directory);
      assert.instanceOf(childDir, Directory);
    });

    it('Creates child file', function () {
      const childFile = testDir.createChild(['']);
      assert.instanceOf(childFile, File);
    });
  });

  describe('#getChildrenByTypes()', function () {
    before(function () {
      testDir.createChild(['firstDirChild'], Directory);
      testDir.createChild(['testDirFile']);
    });

    after(function () {
      testDir.children = [];
    });

    it('Finds directory children', function () {
      const dirs = testDir.getChildrenByTypes([Directory]);
      assert.equal(dirs.length, 1);
      assert.instanceOf(dirs[0], Directory);
    });

    it('Finds file children', function () {
      const files = testDir.getChildrenByTypes([File]);
      assert.equal(files.length, 1);
      assert.instanceOf(files[0], File);
    });

    it('Finds all children', function () {
      const children = testDir.getChildrenByTypes([Directory, File]);
      assert.equal(children.length, 2);
    });

    it('Finds all children when no types are passed in', function () {
      const children = testDir.getChildrenByTypes([Directory, File]);
      assert.equal(children.length, 2);
    });

    it('Returns empty array when directory is empty', function () {
      const dirs = emptyTestDir.getChildrenByTypes([File]);
      const files = emptyTestDir.getChildrenByTypes([Directory]);
      const allTypes = emptyTestDir.getChildrenByTypes([Directory, File]);
      const noTypes = emptyTestDir.getChildrenByTypes();
      assert.equal(dirs, 0);
      assert.equal(files, 0);
      assert.equal(allTypes, 0);
      assert.equal(noTypes, 0);
    });
  });

  describe('#findTopParent', function () {
    let child;
    let secondChild;

    before(function () {
      child = testDir.createChild(['child'], Directory);
      secondChild = child.createChild(['secondChild'], Directory);
    });

    after(function () {
      testDir.children = [];
    });

    it('Returns self when directory has no parent', function () {
      const result = testDir.findTopParent();
      assert.equal(result, testDir);
    });

    it('Finds parent when directory has parent', function () {
      const result = child.findTopParent();
      assert.equal(result, testDir);
    });

    it('Finds parent when called on directory multiple levels down', function () {
      const result = secondChild.findTopParent();
      assert.equal(result, testDir);
    });
  });
});
