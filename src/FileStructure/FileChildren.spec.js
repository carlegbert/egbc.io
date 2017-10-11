/* eslint-env mocha */
/* eslint-disable prefer-arrow-callback, func-names, no-new */

const { assert } = require('chai');

const Directory = require('./Directory');
const FileChildren = require('./FileChildren');

describe('FileChildren unit tests', function () {
  const testDir = new Directory('testDir', null);
  const testChildDir = new Directory('testChildDir', testDir);

  describe('#constructor()', function () {
    it('Creates object without any children', function () {
      const children = new FileChildren(testDir);
      assert.instanceOf(children, FileChildren);
      assert.instanceOf(children.members, Object);
      assert.notEmpty(children.members);
    });

    it('Has correct . .. and ~ references', function () {
      const nestedDir = new Directory('nestedDir', testDir);
      const children = new FileChildren(nestedDir);
      const len = Object.keys(children.members).length;
      assert.instanceOf(children, FileChildren);
      assert.equal(len, 3);
      assert.equal(children.members['~'], testDir);
      assert.equal(children.members['.'], nestedDir);
      assert.equal(children.members['..'], testDir);
    });

    it('Creates object with children from array', function () {
      const children = new FileChildren(testDir, [testChildDir]);
      const len = Object.keys(children.members).length;
      assert.instanceOf(children, FileChildren);
      assert.instanceOf(children.members, Object);
      assert.equal(len, 4);
      assert.equal(children.members.testChildDir, testChildDir);
    });

    it('Creates object with children from object', function () {
      const children = new FileChildren(testDir, { testChildDir });
      const len = Object.keys(children.members).length;
      assert.instanceOf(children, FileChildren);
      assert.instanceOf(children.members, Object);
      assert.equal(len, 4);
      assert.equal(children.members.testChildDir, testChildDir);
    });
  });

  describe('#forEach()', function () {
    const childOne = new Directory('childOne', testDir);
    const childTwo = new Directory('childTwo', testDir);
    const children = new FileChildren(testDir, { childOne, childTwo });

    it('iterates through all children and ignores special references', function () {
      const childCollector = [];
      children.forEach((child) => {
        childCollector.push(child);
      });

      assert.equal(childCollector.length, 2);
      assert.include(childCollector, childOne);
      assert.include(childCollector, childTwo);
    });
  });

  describe('#filter()', function () {
    const childOne = new Directory('childOne', testDir);
    const childTwo = new Directory('childTwo', testDir);
    new Directory('theBadOne', testDir);
    const children = new FileChildren(testDir, { childOne, childTwo });

    it('ignores special references', function () {
      const childCollector = children.filter(() => true);
      const len = Object.keys(childCollector).length;
      assert.equal(len, 2);
    });

    it('filters', function () {
      const childCollector = children.filter(child => child.name.includes('child'));
      const len = Object.keys(childCollector).length;
      assert.equal(len, 2);
      assert.equal(childCollector.childOne, childOne);
      assert.equal(childCollector.childTwo, childTwo);
      assert.isUndefined(childCollector.theBadOne);
    });
  });

  describe('#addChild()', function () {
    it('adds child', function () {
      const children = new FileChildren(testDir);
      const beforeLen = Object.keys(children.members).length;
      const newChild = new Directory('newChild', testDir);
      children.addChild(newChild);
      const afterLen = Object.keys(children.members).length;
      assert.equal(afterLen, beforeLen + 1);
      assert.ok(children.members.newChild);
      assert.equal(children.members.newChild, newChild);
    });

    it('fails to add child if file already exists', function () {
      const children = new FileChildren(testDir, { testChildDir });
      const beforeLen = Object.keys(children.members).length;
      assert.throws(() => {
        children.addChild(testChildDir);
      }, Error, 'FileChildren error: File testChildDir exists');
      const afterLen = Object.keys(children.members).length;
      assert.equal(beforeLen, afterLen);
    });

    it('fails to add child if passed file with invalid name', function () {
      const children = new FileChildren(testDir);
      const beforeLen = Object.keys(children.members).length;
      const file = new Directory('.', testDir);
      assert.throws(() => {
        children.addChild(file);
      }, Error, 'FileChildren error: Invalid file name');
      const afterLen = Object.keys(children.members).length;
      assert.equal(beforeLen, afterLen);
    });

    it('fails to add child is passed file with name of an object property', function () {
      const children = new FileChildren(testDir);
      const beforeLen = Object.keys(children.members).length;
      const file = new Directory('hasOwnProperty', testDir);
      assert.throws(() => {
        children.addChild(file);
      }, Error, 'FileChildren error: Invalid file name');
      const afterLen = Object.keys(children.members).length;
      assert.equal(beforeLen, afterLen);
    });
  });

  describe('#unlinkChild()', function () {
    it('unlinks child', function () {
      const children = new FileChildren(testDir, { testChildDir });
      const beforeLen = Object.keys(children.members).length;
      children.unlinkChild('testChildDir');
      const afterLen = Object.keys(children.members).length;
      assert.equal(afterLen, beforeLen - 1);
      assert.isUndefined(children.members.testChildDir);
    });

    it('fails to unlink special directory', function () {
      const children = new FileChildren(testDir);
      assert.throws(() => {
        children.unlinkChild('.');
      }, Error, 'FileChildren error: Cannot unlink .');
    });

    it('fails to unlink file not in FileChildren', function () {
      const children = new FileChildren(testDir);
      assert.throws(() => {
        children.unlinkChild('testChildDir');
      }, Error, 'FileChildren error: File testChildDir not found in directory testDir');
    });
  });

  describe('#findChild()', function () {
    it('Finds child file when passed string', function () {
      const children = new FileChildren(testDir, { testChildDir });
      const foundChild = children.findChild('testChildDir');
      assert.ok(foundChild);
      assert.equal(foundChild, testChildDir);
    });

    it('Finds child file when passed callback', function () {
      const children = new FileChildren(testDir, { testChildDir });
      const foundChild = children.findChild(child => child.name === 'testChildDir');
      assert.ok(foundChild);
      assert.equal(foundChild, testChildDir);
    });

    it('Finds special reference', function () {
      const children = new FileChildren(testDir);
      const foundFile = children.findChild('.');
      assert.ok(foundFile);
      assert.equal(foundFile, testDir);
    });

    it('Throws error if file is not among children', function () {
      const children = new FileChildren(testDir);
      assert.throws(() => {
        children.findChild('testDir');
      }, Error, 'No such file or directory');
    });

    // TODO: make this test pass
    // it('Fails to find file if passed non-filename object property', function () {
    //   const children = new FileChildren(testDir);
    //   assert.throws(() => {
    //     children.findChild('hasOwnProperty');
    //   }, Error, 'No such file or directory');
    // });
  });
});
