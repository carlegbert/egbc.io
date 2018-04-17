const { assert } = require('chai');

const Path = require('./Path');

describe('Path unit tests', function () {
  describe('#constructor()', function () {
    it('Constructs path from String[] arg', function () {
      const p = new Path(['from', 'array']);
      assert.instanceOf(p, Path);
      assert.equal(p.str, 'from/array');
      assert.equal(p.length, 2);
      assert.sameMembers(p.arr, ['from', 'array']);
    });

    it('Constructs path from String arg', function () {
      const p = new Path('from/string');
      assert.instanceOf(p, Path);
      assert.equal(p.str, 'from/string');
      assert.equal(p.length, 2);
      assert.sameMembers(p.arr, ['from', 'string']);
    });

    it('Constructs path from empty String[] arg', function () {
      const p = new Path([]);
      assert.instanceOf(p, Path);
      assert.equal(p.str, '.');
      assert.equal(p.length, 1);
      assert.sameMembers(p.arr, ['.']);
    });

    it('Constructs path from empty String arg', function () {
      const p = new Path('');
      assert.instanceOf(p, Path);
      assert.equal(p.str, '.');
      assert.equal(p.length, 1);
      assert.sameMembers(p.arr, ['.']);
    });

    it('Constructs path with no arg', function () {
      const p = new Path();
      assert.instanceOf(p, Path);
      assert.equal(p.str, '.');
      assert.equal(p.length, 1);
      assert.sameMembers(p.arr, ['.']);
    });
  });

  describe('#lowestDir()', function () {
    it('returns correct array member', function () {
      const p = new Path(['one', 'two', 'three']);
      const res = p.lowestDir();
      assert.equal(res, 'one');
    });
  });

  describe('#next()', function () {
    it('Returns new path', function () {
      const p = new Path(['one', 'two', 'three']);
      const nxt = p.next();
      assert.instanceOf(nxt, Path);
      assert.equal(nxt.length, 2);
      assert.sameMembers(nxt.arr, ['two', 'three']);
      assert.equal(nxt.str, 'two/three');
    });

    it('Returns new empty path when called on empty path', function () {
      const p = new Path();
      const nxt = p.next();
      assert.instanceOf(nxt, Path);
      assert.equal(p.length, 1);
      assert.deepEqual(p, nxt);
      assert.notEqual(p, nxt);
    });
  });

  describe('#basename()', function () {
    it('Returns basename', function () {
      const p = new Path(['one', 'two', 'three']);
      const basename = p.basename();
      assert.equal(basename, 'three');
    });
  });

  describe('#highestDir()', function () {
    it('Returns the highest-level directory', function () {
      const p = new Path(['one', 'two', 'three']);
      const dir = p.highestDir();
      assert.instanceOf(dir, Path);
      assert.equal(dir.length, 2);
      assert.equal(dir.str, 'one/two');
    });
  });
});
