/* eslint-env mocha */
/* eslint-disable prefer-arrow-callback, func-names */

const { assert } = require('chai');

const io = require('./io');

describe('io helper unit tests', function () {
  describe('#isArrayOfStrings()', function () {
    it('returns true when called with array of strings', function () {
      const arr = ['array', 'of', 'strings'];
      const res = io.isArrayOfStrings(arr);
      assert.isTrue(res);
    });

    it('returns true when called with empty array', function () {
      const res = io.isArrayOfStrings([]);
      assert.isTrue(res);
    });

    it('returns false when called with no args', function () {
      const res = io.isArrayOfStrings();
      assert.isFalse(res);
    });

    it('returns false when called on string', function () {
      const res = io.isArrayOfStrings('not an array');
      assert.isFalse(res);
    });

    it('returns false when called on object', function () {
      const res = io.isArrayOfStrings({ not: 'an array' });
      assert.isFalse(res);
    });

    it('returns false when called on partial array of strings', function () {
      const arr = ['array', { of: 'strings and objects' }];
      const res = io.isArrayOfStrings(arr);
      assert.isFalse(res);
    });
  });
});
