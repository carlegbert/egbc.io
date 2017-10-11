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

  describe('#filter', function () {
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
});
