import { FileKind } from '../fs/constants'
import { Directory, BaseFile } from '../fs'

/**
 * Make sure a list of different autocomplete options aren't identical up to a
 * certain amount of letters, eg, if there are two options 'catalogue' and 'catamaran',
 * and a user types 'vi c <Tab>', the input should be completed to 'cata'.
 * @param {string} partial Original user input to be autocompleted
 * @param {string[]} words Available options
 * @return {string} A string representing the longest matching beginning.
 * */
export const findLongestCommonBeginning = (
  partial: string,
  words: string[],
): string => {
  const sortedWords = words.slice().sort((a, b) => a.length - b.length)
  const [shortestWord, ...rest] = sortedWords
  if (!shortestWord) {
    return partial
  }

  let longestPartial = partial
  for (let i = partial.length; i < shortestWord.length; i += 1) {
    if (!rest.every(word => word[i] === shortestWord[i])) {
      return longestPartial
    }

    longestPartial += shortestWord[i]
  }
  return longestPartial
}

/**
 * Filter array of strings into options that match up with partial argument.
 * @param {string} partial String to be autocompleted
 * @param {string[]} options List of files or commands to check against partial
 * @return {string[]} Array of strings from options that match against partial
 */
export const filterOptions = (partial: string, options: string[]) =>
  options.filter(opt => opt.startsWith(partial))

/**
 * returns list of all files in a directory matching filetype and starting with partial
 * @param {string} partial Filepath to be completed, eg, 'path/to/fi' or 'pat'
 * @param {Class[]} filetypes Optional filetypes to filter for
 * @return {string[]} array of filenames
 */
export const getFiles = (
  partial: string,
  filekinds: FileKind[],
  dir: Directory,
): string[] => {
  const fileOptions: BaseFile[] = dir.getChildrenByTypes(filekinds)
  return fileOptions
    .filter(f => f.name.startsWith(partial))
    .map(f => (f instanceof Directory ? `${f.name}/` : f.name))
}
