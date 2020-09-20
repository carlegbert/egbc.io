import { Directory, LinkFile, TextFile } from './fs'
import Shell from './Shell'

const initShell = (): Shell => {
  const shellInstance = new Shell()
  const links = shellInstance.fs.home.createChild(
    'links',
    Directory,
  ) as Directory

  links.children = [
    new LinkFile('github', links, 'https://github.com/carlegbert'),
    new LinkFile('linkedin', links, 'https://linkedin.com/in/carlegbert'),
    new LinkFile('email', links, 'mailto:egbertcarl@gmail'),
    new LinkFile(
      'gibson - soundings for double bass quartet',
      links,
      'https://www.youtube.com/watch?v=_VYZMzoVeZA',
    ),
  ]

  const about = shellInstance.fs.home.createChild('about.txt') as TextFile

  about.contents = [
    "<p>I am a software engineer based in Portland, OR. Before beginning my career in the tech industry, I was a professional classical double bassist. I've performed with the Oregon and Eugene Symphonies, the Chintimini Chamber Music Festival, the Aspen Festival Orchestra, and many other professional ensembles.</p>",
    '<p><a href="https://github.com/carlegbert/egbc.io" target="blank">source for this site</a></p>',
  ]
  return shellInstance
}

export default initShell
