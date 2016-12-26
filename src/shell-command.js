export class ShellCommand {
  constructor(input) {
    this.args = [];
    this.flags = [];
    if (!input) {
      this.command = null;
    } else {
      this.parseInput(input);
    }
  }

  /* parse input string into object encapsulating command,
   * arguments, and flags */
  parseInput(input) {
    const splitInput = input.split(' ');
    this.command = splitInput[0];
    if (splitInput.length > 1) {
      splitInput.slice(1).forEach((word) => {
        if (word.length > 0 && word[0] === '-') {
          this.flags.push(word);
        } else if (word.length > 0 && word !== ' ') {
          this.args.push(word);
        }
      });
    }
  }

}
