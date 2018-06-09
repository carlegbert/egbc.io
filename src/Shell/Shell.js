const { getChar, print, printInline } = require('../util/io');
const { getElementById } = require('../util/selectors');
const { Directory, File, Path } = require('../FileStructure');
const ShellCommand = require('./Command');
const ShellCommandResult = require('./CommandResult');

/**
 * Programs.help cannot be exported in Programs/index.js due to requiring
 * it in order to iterate through all other available programs; hence,
 * this hack.
 */
const Programs = require('../Programs');
Programs.help = require('../Programs/help');

/**
 * Object encapsulating shell session
 * @class
 */
class Shell {
  /**
   * Represents shell session. to be instantiated once upon browser load.
   * @constructor
   * @param {Directory} fileStructure base dir tied to shell session
   */
  constructor(fileStructure) {
    this.fileStructure = fileStructure;
    this.currentDir = fileStructure;
    this.user = 'guest';
    this.inputString = '';
    this.bashHistory = [];
    this.historyIndex = 0;
    this.tabPressed = false;
    this.inputPromptElement = getElementById('input');
    this.PS1Element = getElementById('PS1');
    this.outputElement = getElementById('terminal-output');
    this.childProcess = null;
  }

  /**
   * @return {string} PS1 string
   */
  getPS1String() {
    return `<span class="user">${this.user}@www.carlegbert.com:</span>` +
      `<span class="path">${this.currentDir.fullPath}</span>$&nbsp;`;
  }

  /**
   * Direct keystroke to shell's keystroke handler or to child process
   * if there is one active
   * @param {Object} event Keystroke event
   */
  parseKeystroke(event) {
    if (!this.childProcess) this.shellKeystroke(event);
    else this.childProcess.parseKeystroke(event);
  }

  /**
   * Process keystroke
   * @param {Object} event Keystroke event
   */
  shellKeystroke(event) {
    if (event.which === 13) { // enter
      this.tabPressed = false;
      event.preventDefault();
      this.handleEnter();
    } else if (event.which === 8) { // backspace
      this.tabPressed = false;
      event.preventDefault();
      this.inputString = this.inputString.slice(0, (this.inputString.length - 1));
      this.inputPromptElement.innerHTML = this.inputString.replace(/ /g, '&nbsp;');
    } else if (event.which === 38 && this.historyIndex > 0) { // up arrow
      this.tabPressed = false;
      event.preventDefault();
      this.historyIndex -= 1;
      this.inputString = this.bashHistory[this.historyIndex];
      this.inputPromptElement.innerHTML = this.inputString;
    } else if (event.which === 40 && this.historyIndex < this.bashHistory.length) { // down
      this.tabPressed = false;
      event.preventDefault();
      this.historyIndex += 1;
      if (this.historyIndex === this.bashHistory.length) this.inputString = '';
      else this.inputString = this.bashHistory[this.historyIndex];
      this.inputPromptElement.innerHTML = this.inputString;
    } else if (event.which === 9) { // tab
      event.preventDefault();
      this.handleTab();
    } else {
      this.tabPressed = false;
      const k = getChar(event);
      this.inputString += k;
      const kSpaceAdjusted = k === ' ' ? '&nbsp;' : k;
      this.inputPromptElement.innerHTML += kSpaceAdjusted;
    }
    this.inputPromptElement.scrollIntoView(false);
  }

  /**
   * process Enter keystroke
   */
  handleEnter() {
    if (!this.inputString.match(/[^ ]/g)) { // regex for anything but space
      print(this.getPS1String(), this.outputElement);
    } else {
      print(this.getPS1String() + this.inputString.replace(' ', '&nbsp;'), this.outputElement);
      this.bashHistory.push(this.inputString);
      const res = this.executeCommand(this.inputString);
      print(res.getDefaultOutput(), this.outputElement);
    }
    this.inputString = '';
    this.inputPromptElement.innerHTML = '';
    this.historyIndex = this.bashHistory.length;
  }

  /**
   * attempt to process inputstring into shell command
   * @param {string} inputString String to process
   * @return {Object} Result of eval(evalStr), which should always
   * be a ShellCommandResult object
   */
  executeCommand(inputString) {
    if (inputString.includes('>>')) return this.redirect(inputString, '>>');
    if (inputString.includes('>')) return this.redirect(inputString, '>');

    const shellCommand = new ShellCommand(inputString, this);
    const program = Programs[shellCommand.command];
    if (!program) return new ShellCommandResult([], `${shellCommand.command}: command not found`);
    return program.run(shellCommand);
  }

  /**
   * redirect with >, >> operators
   * @param {string} inputString Input string containing redirect operator
   * @param {string} pattern Redirect operator (either > or >>)
   * @return {Object} ShellCommandResult containing stderr to print to screen if necessary
   */
  redirect(inputString, pattern) {
    const i = inputString.indexOf(pattern);
    const afterSymbol = inputString.slice(i + pattern.length).trim().split(' ');
    if (!afterSymbol || afterSymbol.length === 0) return new ShellCommandResult([], 'Syntax error');
    const otherArgs = afterSymbol.length === 1 ? [] : afterSymbol.slice(pattern.length);
    const newInput = inputString.slice(0, i) + otherArgs.join(' ');
    const res = this.executeCommand(newInput);
    const filepath = new Path(afterSymbol[0]);
    const file = this.currentDir.findFile(filepath, File)
      || this.currentDir.createChild(filepath, File);
    if (!file) return new ShellCommandResult(null, `bash: ${filepath}: No such file or directory`);
    if (file.contents === ['']) file.contents = [];
    file.contents = pattern === '>' ? [res.stdOut] : file.contents.concat(res.stdOut);
    return new ShellCommandResult(null, res.stdErr);
  }

  /**
   * handle tab for autocompletion
   */
  handleTab() {
    const spaceAtEnd = (this.inputString[this.inputString.length - 1] === ' ');
    const cmd = new ShellCommand(this.inputString, this);
    let options;
    let partial;
    if (!cmd.command) {
      partial = '';
      options = ShellCommand.validCommands();
    } else if (!spaceAtEnd && cmd.args.length === 0) {
      partial = cmd.command;
      options = Shell.filterAutoCompleteOptions(partial, ShellCommand.validCommands());
    } else {
      partial = cmd.args[cmd.args.length - 1] || '';
      options = this.getAutocompleteFiles(partial, ShellCommand.getValidTypes(cmd.command));
      if (options.length === 0) options = this.getAutocompleteFiles(partial, [Directory]);
    }
    if (options.length === 1) this.executeAutoComplete(partial, options[0]);
    else if (options.length > 1) this.printAutoCompleteOptions(options);
  }

  /**
   * Filter array of strings into options that match up with partial argument.
   * @param {string} partial String to be autocompleted
   * @param {string[]} options List of files or commands to check against partial
   * @return {string[]} Array of strings from options that match against partial
   */
  static filterAutoCompleteOptions(partial, options) {
    const len = partial.length;
    const validOptions = [];
    options.forEach((opt) => {
      if (opt.length >= len && opt.slice(0, len) === partial) {
        validOptions.push(opt);
      }
    });
    if (validOptions.length > 1) {
      const longestPartial = Shell.checkForSameBeginning(partial, validOptions);
      if (longestPartial === partial) return validOptions;
      return [longestPartial];
    }
    return validOptions;
  }

  /**
   * Make sure a list of different autocomplete options aren't identical up to a
   * certain amount of letters, eg, if there are two options 'catalogue' and 'catamaran',
   * and a user types 'vi c <Tab>', the input should be completed to 'cata'.
   * @param {string} partial Original user input to be autocompleted
   * @param {string[]} options Available options
   * @return {string} A string representing the longest matching beginning.
   * */
  static checkForSameBeginning(partial, options) {
    const sortedOpts = options.slice().sort((a, b) => a.length - b.length);
    const shortestOpt = sortedOpts[0];
    let longestPartial = partial;
    for (let i = partial.length; i < shortestOpt.length; i += 1) {
      const charToCheckFor = shortestOpt[i];
      for (let j = 1; j < options.length; j += 1) {
        if (options[j][i] !== charToCheckFor) return longestPartial;
      }
      longestPartial += shortestOpt[i];
    }
    return longestPartial;
  }

  /**
   * returns list of all files in a directory for autocompletion purposes.
   * @param {string} partial Filepath to be completed, eg, 'path/to/fi' or 'pat'
   * @param {Class[]} filetypes Optional filetypes to filter for
   * @return {string[]} array of filenames
   */
  getAutocompleteFiles(partial, filetypes) {
    const partialAsArray = partial.split('/');
    const partialName = partialAsArray.slice(-1)[0];
    const dirPath = partialAsArray.slice(0, -1);
    const dir = this.currentDir.findFile(dirPath, Directory);
    const fileOptions = dir.getChildrenByTypes(filetypes);
    const options = [];
    fileOptions.forEach((f) => {
      let optName = f.name;
      if (f instanceof Directory) optName += '/';
      options.push(optName);
    });
    return Shell.filterAutoCompleteOptions(partialName, options);
  }

  /**
   * prints valid autocomplete options. to be called only if there are multiple options.
   * @param {string[]} options Options to print
   */
  printAutoCompleteOptions(options) {
    if (this.tabPressed) {
      print(this.getPS1String() + this.inputString, this.outputElement);
      printInline(options, this.outputElement);
    } else {
      this.tabPressed = true;
    }
  }

  /**
   * executes autocomplete. to be called only if there is one valid autocomplete option.
   * @param {string} partial Word to be completed
   * @param {string} complete Word to be autocompleted to
   */
  executeAutoComplete(partial, complete) {
    const splitPartial = partial.split('/');
    const wordPartial = splitPartial[splitPartial.length - 1];
    const completion = complete.slice(wordPartial.length);
    this.inputString += completion;
    this.inputPromptElement.append(completion);
  }


  killChildProcess() {
    this.childProcess = null;
  }
}

module.exports = Shell;
