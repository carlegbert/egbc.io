/* eslint-env browser */

const Shell = require('./Shell/Shell');
const ShellCommand = require('./Shell/Command');
const { cat, help } = require('./Programs');
const { print } = require('./util/io');
const homeDir = require('./content');

require('./styles.css');


document.addEventListener('DOMContentLoaded', () => {
  const shell = new Shell(homeDir);
  const cursor = document.getElementById('shell-cursor');
  const PS1 = document.getElementById('PS1');
  const aboutBtn = document.getElementById('about-btn');
  const helpBtn = document.getElementById('help-btn');
  PS1.innerHTML = shell.getPS1String();

  let blinking = setInterval(() => {
    cursor.style.display = (cursor.style.display === 'none' ? '' : 'none');
  }, 700);

  document.onkeydown = (event) => {
    shell.parseKeystroke(event);
    cursor.style.display = '';
    clearInterval(blinking);
    blinking = setInterval(() => {
      cursor.style.display = (cursor.style.display === 'none' ? '' : 'none');
    }, 700);
  };

  aboutBtn.onclick = () => {
    print(`${shell.getPS1String()} cat ~/about.txt`, shell.outputElement);
    const aboutCommand = new ShellCommand('cat ~/about.txt', shell);
    const aboutRes = cat.apply(aboutCommand);
    print(aboutRes.getDefaultOutput(), shell.outputElement);
  };

  helpBtn.onclick = () => {
    const helpCommand = new ShellCommand('help');
    const helpRes = help.apply(helpCommand);
    print(`${shell.getPS1String()} help`, shell.outputElement);
    print(helpRes.getDefaultOutput(), shell.outputElement);
  };
});
