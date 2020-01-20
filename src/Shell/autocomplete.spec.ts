import { assert } from 'chai'
import * as autocomplete from './autocomplete'

describe('autocomplete unit tests', function() {
  describe('#findLongestCommonBeginning()', function() {
    it('returns partial if options are isEmpty', function() {
      const partial = 'no_matches'
      const options: string[] = []
      const result = autocomplete.findLongestCommonBeginning(partial, options)
      assert.equal(partial, result)
    })

    it('returns partial if shortest word equals partial', function() {
      const partial = 'match'
      const options = ['match', 'matcherino', 'matchorama']
      const result = autocomplete.findLongestCommonBeginning(partial, options)
      assert.equal(partial, result)
    })

    it('returns single option', function() {
      const partial = 'one_'
      const options = ['one_match']
      const result = autocomplete.findLongestCommonBeginning(partial, options)
      assert.equal('one_match', result)
    })

    it('returns suggestion when there are multiple matching words', function() {
      const partial = 'two_'
      const options = ['two_matching', 'two_matcherinos']
      const result = autocomplete.findLongestCommonBeginning(partial, options)
      assert.equal('two_match', result)
    })
  })

  describe('#filterOptions()', function() {
    it('finds no matches from isEmpty array', function() {
      const partial = 'no_matches'
      const options: string[] = []
      const result = autocomplete.filterOptions(partial, options)
      assert.isEmpty(result)
    })
    it('finds no matches from array with elements', function() {
      const partial = 'no_matches'
      const options = ['there', 'are', 'no', 'matches']
      const result = autocomplete.filterOptions(partial, options)
      assert.isEmpty(result)
    })
    it('finds single valid match', function() {
      const partial = 'one_match'
      const options = ['one_match_here', 'only_one_though', 'just_one']
      const result = autocomplete.filterOptions(partial, options)
      assert.equal(result.length, 1)
      assert.equal(result[0], 'one_match_here')
    })
    it('finds multiple valid matches', function() {
      const partial = 'multiple'
      const options = [
        'multiple_matches',
        'multiple_matcherinos',
        'multiple_schmultiple',
      ]
      const result = autocomplete.filterOptions(partial, options)
      assert.equal(result.length, 3)
      assert.include(result, 'multiple_matches')
      assert.include(result, 'multiple_matcherinos')
      assert.include(result, 'multiple_schmultiple')
    })
    it('finds multiple valid matches when there are also invalid options', function() {
      const partial = 'multiple'
      const options = [
        'multiple_matches',
        'multiple_matcherinos',
        'multiple_schmultiple',
        'but_some',
        'do_not_match',
      ]
      const result = autocomplete.filterOptions(partial, options)
      assert.equal(result.length, 3)
      assert.include(result, 'multiple_matches')
      assert.include(result, 'multiple_matcherinos')
      assert.include(result, 'multiple_schmultiple')
    })
  })
})
