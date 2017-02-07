/* eslint-env jquery, browser */

import { TxtFile, DirFile } from './fileobject';
import Shell from './shell';

// dummy data - to be replaced with data from JSON API
const root = new DirFile('~', '~', 'dir', null, null);
const aDir = new DirFile('a_dir', '~/a_dir', 'dir', root, null);
const aTextfile = new TxtFile('a_textfile', '~/a_textfile', 'txt', root, null, ['this is some text']);
const anotherDir = new TxtFile('2_textfile', '~/a_dir/2_textfile', 'txt', aDir, null, ['more text']);
root.children = [aDir, aTextfile];
aDir.children = [anotherDir];

$(document).ready(() => {
  const shell = new Shell(root);
  $('#PS1').html(shell.getPS1String());

  const cursor = document.getElementById('shell-cursor');
  let blinking = setInterval(() => {
    cursor.style.display = (cursor.style.display === 'none' ? '' : 'none');
  }, 700);
  $('body').keydown((event) => {
    shell.parseKeystroke(event);
    cursor.style.display = '';
    clearInterval(blinking);
    blinking = setInterval(() => {
      cursor.style.display = (cursor.style.display === 'none' ? '' : 'none');
    }, 700);
  });
});
