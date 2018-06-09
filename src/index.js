/* eslint-env browser */

const Shell = require('./Shell/Shell');
const ShellCommand = require('./Shell/Command');
const { cat, help, ls } = require('./Programs');
const { print } = require('./util/io');
const homeDir = require('./content');

require('./styles.css');

document.addEventListener('DOMContentLoaded', () => {
  const shell = new Shell(homeDir);
  const cursor = document.getElementById('shell-cursor');
  const PS1 = document.getElementById('PS1');
  const aboutBtn = document.getElementById('about-btn');
  const helpBtn = document.getElementById('help-btn');
  const ps1String = shell.getPS1String();

  print(`${ps1String} cat ~/about.txt`, shell.outputElement);
  let aboutCommand = new ShellCommand('cat ~/about.txt', shell);
  let aboutRes = cat.run(aboutCommand);
  print(aboutRes.getDefaultOutput(), shell.outputElement);

  print(`${ps1String} ls links`, shell.outputElement);
  const lsCommand = new ShellCommand('ls links', shell);
  const lsRes = ls.run(lsCommand);
  print(lsRes.getDefaultOutput(), shell.outputElement);

  print("<br /><br />Type 'help' for a list of available commands.", shell.outputElement);

  PS1.innerHTML = ps1String;

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
    aboutCommand = new ShellCommand('cat ~/about.txt', shell);
    aboutRes = cat.run(aboutCommand);
    print(aboutRes.getDefaultOutput(), shell.outputElement);
  };

  helpBtn.onclick = () => {
    const helpCommand = new ShellCommand('help');
    const helpRes = help.run(helpCommand);
    print(`${shell.getPS1String()} help`, shell.outputElement);
    print(helpRes.getDefaultOutput(), shell.outputElement);
  };
});
