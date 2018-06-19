const { Directory } = require('../FileStructure');

/**
 * Make sure a list of different autocomplete options aren't identical up to a
 * certain amount of letters, eg, if there are two options 'catalogue' and 'catamaran',
 * and a user types 'vi c <Tab>', the input should be completed to 'cata'.
 * @param {string} partial Original user input to be autocompleted
 * @param {string[]} options Available options
 * @return {string} A string representing the longest matching beginning.
 * */
const findLongestCommonBeginning = (partial, options) => {
  const sortedOpts = options.slice().sort((a, b) => a.length - b.length);
  const shortestOpt = sortedOpts[0];
  if (!shortestOpt) return partial;
  let longestPartial = partial;
  for (let i = partial.length; i < shortestOpt.length; i += 1) {
    const charToCheckFor = shortestOpt[i];
    for (let j = 1; j < options.length; j += 1) {
      if (options[j][i] !== charToCheckFor) return longestPartial;
    }
    longestPartial += shortestOpt[i];
  }
  return longestPartial;
};

/**
 * Filter array of strings into options that match up with partial argument.
 * @param {string} partial String to be autocompleted
 * @param {string[]} options List of files or commands to check against partial
 * @return {string[]} Array of strings from options that match against partial
 */
const filterOptions = (partial, options) => {
  const validOptions = options.filter(opt => opt.startsWith(partial));
  const longestPartial = findLongestCommonBeginning(partial, validOptions);
  if (longestPartial === partial) return validOptions;
  return [longestPartial];
};

/**
 * returns list of all files in a directory for autocompletion purposes.
 * @param {string} partial Filepath to be completed, eg, 'path/to/fi' or 'pat'
 * @param {Class[]} filetypes Optional filetypes to filter for
 * @return {string[]} array of filenames
 */
const getFiles = (partial, filetypes, dir) => {
  const fileOptions = dir.getChildrenByTypes(filetypes);
  /* eslint-disable arrow-body-style */
  const options = fileOptions
    .map((f) => { return (f instanceof Directory) ? `${f.name}/` : f.name; });
  /* eslint-enable arrow-body-style */
  return filterOptions(partial, options);
};

module.exports = {
  filterOptions,
  findLongestCommonBeginning,
  getFiles,
};
