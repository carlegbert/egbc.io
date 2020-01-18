/* eslint-env browser */

import Shell from './Shell'
import ShellCommand from './Shell/ShellCommand'
import bin from '~/programs'
import { print } from './util/io'
import homeDir from '~/content'

import './styles.css'

document.addEventListener('DOMContentLoaded', () => {
  const shell = new Shell(homeDir)
  const cursor = document.getElementById('shell-cursor') as HTMLElement
  const PS1 = document.getElementById('PS1') as HTMLElement
  const aboutBtn = document.getElementById('about-btn') as HTMLElement
  const helpBtn = document.getElementById('help-btn') as HTMLElement
  const ps1String = shell.getPS1String()

  print(`${ps1String} cat ~/about.txt`, shell.outputElement)
  let aboutCommand = new ShellCommand('cat ~/about.txt', shell)
  let aboutRes = bin.cat.run(aboutCommand)
  print(aboutRes.getDefaultOutput(), shell.outputElement)

  print(`${ps1String} ls links`, shell.outputElement)
  const lsCommand = new ShellCommand('ls links', shell)
  const lsRes = bin.ls.run(lsCommand)
  print(lsRes.getDefaultOutput(), shell.outputElement)

  print(
    "<br /><br />Type 'help' for a list of available commands.",
    shell.outputElement,
  )

  PS1.innerHTML = ps1String

  let blinking = setInterval(() => {
    cursor.style.display = cursor.style.display === 'none' ? '' : 'none'
  }, 700)

  document.onkeydown = event => {
    shell.parseKeystroke(event)
    cursor.style.display = ''
    clearInterval(blinking)
    blinking = setInterval(() => {
      cursor.style.display = cursor.style.display === 'none' ? '' : 'none'
    }, 700)
  }

  aboutBtn.onclick = () => {
    print(`${shell.getPS1String()} cat ~/about.txt`, shell.outputElement)
    aboutCommand = new ShellCommand('cat ~/about.txt', shell)
    aboutRes = bin.cat.run(aboutCommand)
    print(aboutRes.getDefaultOutput(), shell.outputElement)
  }

  helpBtn.onclick = () => {
    const helpCommand = new ShellCommand('help')
    const helpRes = bin.help.run(helpCommand)
    print(`${shell.getPS1String()} help`, shell.outputElement)
    print(helpRes.getDefaultOutput(), shell.outputElement)
  }
})
