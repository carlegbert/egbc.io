/* eslint-env mocha */
/* eslint-disable prefer-arrow-callback, func-names */

const assert = require('chai').assert;

const FileObject = require('./FileObject');

describe('FileObject unit tests', function () {
  const testFile = new FileObject('testFile', null, null);

  describe('#objToFile()', function () {
    it('Creates FileObject from plain js object', function () {
      const obj = { name: 'fileFromObject' };
      const file = FileObject.objToFile(obj);
      assert.equal(file.name, 'fileFromObject');
      assert.instanceOf(file, FileObject);
    });
  });

  describe('#getLsEntry()', function () {
    it('Returns correct string', function () {
      const lsString = testFile.getLsEntry();
      const expected = '<span class="inline txt" id="testFile">testFile</span>';
      assert.equal(lsString, expected);
    });
  });

  describe('#getFullPath()', function () {
    it('Returns correct string', function () {
      const fullPath = testFile.getFullPath();
      assert.equal(fullPath, 'testFile');
    });
  });
});

