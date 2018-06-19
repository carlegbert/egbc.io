const { assert } = require('chai');
const autocomplete = require('./autocomplete');

describe('autocomplete unit tests', function () {
  describe('#findLongestCommonBeginning()', function () {
    it('returns partial if options are empty', function () {
      const partial = 'no_matches';
      const options = [];
      const result = autocomplete.findLongestCommonBeginning(partial, options);
      assert.equal(partial, result);
    });

    it('returns partial if shortest word equals partial', function () {
      const partial = 'match';
      const options = ['match', 'matcherino', 'matchorama'];
      const result = autocomplete.findLongestCommonBeginning(partial, options);
      assert.equal(partial, result);
    });

    it('returns single option', function () {
      const partial = 'one_';
      const options = ['one_match'];
      const result = autocomplete.findLongestCommonBeginning(partial, options);
      assert.equal('one_match', result);
    });

    it('returns suggestion when there are multiple matching words', function () {
      const partial = 'two_';
      const options = ['two_matching', 'two_matcherinos'];
      const result = autocomplete.findLongestCommonBeginning(partial, options);
      assert.equal('two_match', result);
    });
  });
});

