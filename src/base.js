/* eslint-env jquery, browser */

import { TxtFile, DirFile } from './fileobject';
import { Shell } from './shell';

const root = new DirFile('~', '~', 'dir', null);
const aDir = new DirFile('a_dir', '~/a_dir', 'dir', root);
const aTextfile = new TxtFile('a_textfile', '~/a_textfile', 'txt', root, ['this is some text']);
root.children = [aDir, aTextfile];

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
