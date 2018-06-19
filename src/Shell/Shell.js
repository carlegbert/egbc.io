const { getChar, print, printInline } = require('../util/io');
const { getElementById } = require('../util/selectors');
const { Directory, File, Path } = require('../FileStructure');
const ShellCommand = require('./ShellCommand');
const ShellCommandResult = require('./ShellCommandResult');
const autocomplete = require('./autocomplete');

/**
 * programs.help cannot be exported in programs/index.js due to requiring
 * it in order to iterate through all other available programs; hence,
 * this hack.
 */
const programs = require('../programs');
programs.help = require('../programs/help');

const PROGRAM_NAMES = Object.keys(programs);

const getValidTypesForProgram = (name) => {
  const program = programs[name];
  return program ? program.filetypes : [Directory, File];
};

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
    this.tabWait = false;
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
      this.tabWait = false;
      event.preventDefault();
      this.handleEnter();
    } else if (event.which === 8) { // backspace
      this.tabWait = false;
      event.preventDefault();
      this.inputString = this.inputString.slice(0, (this.inputString.length - 1));
      this.inputPromptElement.innerHTML = this.inputString.replace(/ /g, '&nbsp;');
    } else if (event.which === 38 && this.historyIndex > 0) { // up arrow
      this.tabWait = false;
      event.preventDefault();
      this.historyIndex -= 1;
      this.inputString = this.bashHistory[this.historyIndex];
      this.inputPromptElement.innerHTML = this.inputString;
    } else if (event.which === 40 && this.historyIndex < this.bashHistory.length) { // down
      this.tabWait = false;
      event.preventDefault();
      this.historyIndex += 1;
      if (this.historyIndex === this.bashHistory.length) this.inputString = '';
      else this.inputString = this.bashHistory[this.historyIndex];
      this.inputPromptElement.innerHTML = this.inputString;
    } else if (event.which === 9) { // tab
      event.preventDefault();
      this.handleTab();
    } else {
      this.tabWait = false;
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
    if (!this.inputString.match(/[^ ]/g)) {
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
    const program = programs[shellCommand.command];
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
      options = PROGRAM_NAMES;
    } else if (!spaceAtEnd && cmd.args.length === 0) {
      partial = cmd.command;
      options = autocomplete.filterOptions(partial, PROGRAM_NAMES);
    } else {
      partial = cmd.args[cmd.args.length - 1] || '';
      const typedPath = partial.split('/');
      const partialName = typedPath.pop();
      const dir = this.currentDir.findFile(typedPath, Directory);
      options = autocomplete.getFiles(partialName, getValidTypesForProgram(cmd.command), dir);
      if (options.length === 0) options = autocomplete.getFiles(partialName, [Directory], dir);
    }
    if (options.length === 1) this.completeWord(partial, options[0]);
    else if (options.length > 1) this.printAutoCompleteOptions(options);
  }

  /**
   * prints valid autocomplete options. to be called only if there are multiple options.
   * @param {string[]} options Options to print
   */
  printAutoCompleteOptions(options) {
    if (this.tabWait) {
      print(this.getPS1String() + this.inputString, this.outputElement);
      printInline(options, this.outputElement);
    } else {
      this.tabWait = true;
    }
  }

  /**
   * executes autocomplete. to be called only if there is one valid autocomplete option.
   * @param {string} partial Word to be completed
   * @param {string} complete Word to be autocompleted to
   */
  completeWord(partial, complete) {
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
