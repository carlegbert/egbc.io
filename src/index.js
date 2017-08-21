/* eslint-env browser */

import Shell from './Shell/Shell';
import ShellCommand from './Shell/Command';
import { print } from './util/io';
import homeDir from './content';

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
    const aboutRes = new ShellCommand('cat ~/about.txt', shell).cat();
    print(`${shell.getPS1String()} cat ~/about.txt`, shell.outputElement);
    print(aboutRes.getDefaultOutput(), shell.outputElement);
  };

  helpBtn.onclick = () => {
    const helpRes = new ShellCommand('help').help();
    print(`${shell.getPS1String()} help`, shell.outputElement);
    print(helpRes.getDefaultOutput(), shell.outputElement);
  };
});
